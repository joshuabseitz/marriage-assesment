/**
 * Reports API - Browser Compatible
 * Manages report generation and storage in Supabase
 */

/**
 * Generate and save a report for the current partnership
 */
async function generateAndSaveReport(serverUrl = 'http://127.0.0.1:5000') {
  try {
    const supabase = await window.supabaseAuth.getSupabase();
    const currentUser = await window.supabaseAuth.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    // Get partnership
    const partnership = await window.partnershipsApi.getAcceptedPartnership();
    if (!partnership) {
      throw new Error('No accepted partnership found. Please connect with your partner first.');
    }

    // Get both users' responses
    const currentUserResponses = await window.responsesApi.getUserResponses();
    const partnerId = partnership.user1_id === currentUser.id 
      ? partnership.user2_id 
      : partnership.user1_id;
    
    // Get partner's responses
    const { data: partnerResponsesData, error: partnerError } = await supabase
      .from('responses')
      .select('question_id, value')
      .eq('user_id', partnerId);
    
    if (partnerError) throw partnerError;
    
    // Transform to question_id: value map
    const partnerResponses = {};
    partnerResponsesData.forEach(r => partnerResponses[r.question_id] = r.value);

    // Determine who is person1 and person2 (user who created partnership first is person1)
    const person1Responses = partnership.user1_id === currentUser.id 
      ? currentUserResponses 
      : partnerResponses;
    const person2Responses = partnership.user1_id === currentUser.id 
      ? partnerResponses 
      : currentUserResponses;

    // Call backend API to generate report
    const response = await fetch(`${serverUrl}/api/generate-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        person1_responses: person1Responses,
        person2_responses: person2Responses
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const reportData = await response.json();

    // Save to Supabase
    const { data: savedReport, error: saveError } = await supabase
      .from('reports')
      .insert({
        partnership_id: partnership.id,
        report_data: reportData,
        generated_by: currentUser.id
      })
      .select()
      .single();

    if (saveError) throw saveError;

    return savedReport;
  } catch (error) {
    console.error('Error generating and saving report:', error);
    throw error;
  }
}

/**
 * Get the latest report for the current partnership
 */
async function getPartnershipReport() {
  try {
    const supabase = await window.supabaseAuth.getSupabase();
    const partnership = await window.partnershipsApi.getAcceptedPartnership();
    if (!partnership) return null;

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('partnership_id', partnership.id)
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting partnership report:', error);
    throw error;
  }
}

/**
 * Get all reports for the current partnership
 */
async function getAllPartnershipReports() {
  try {
    const supabase = await window.supabaseAuth.getSupabase();
    const partnership = await window.partnershipsApi.getAcceptedPartnership();
    if (!partnership) return [];

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('partnership_id', partnership.id)
      .order('generated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting all partnership reports:', error);
    throw error;
  }
}

/**
 * Delete a report
 */
async function deleteReport(reportId) {
  try {
    const supabase = await window.supabaseAuth.getSupabase();
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', reportId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
}

/**
 * Check if a report exists for the current partnership
 */
async function hasPartnershipReport() {
  try {
    const report = await getPartnershipReport();
    return !!report;
  } catch (error) {
    console.error('Error checking for report:', error);
    return false;
  }
}

/**
 * Get report generation status for current partnership
 */
async function getReportStatus() {
  try {
    const currentUser = await window.supabaseAuth.getCurrentUser();
    const partnership = await window.partnershipsApi.getAcceptedPartnership();
    const report = await getPartnershipReport();

    return {
      hasPartnership: !!partnership,
      hasReport: !!report,
      canGenerate: !!partnership && !!currentUser,
      lastGenerated: report?.generated_at || null,
      partnership: partnership,
      report: report
    };
  } catch (error) {
    console.error('Error getting report status:', error);
    throw error;
  }
}

/**
 * Download report as JSON file
 */
async function downloadReportJSON(reportId, filename = 'symbis-report.json') {
  try {
    const supabase = await window.supabaseAuth.getSupabase();
    const { data, error } = await supabase
      .from('reports')
      .select('report_data')
      .eq('id', reportId)
      .single();

    if (error) throw error;

    // Create blob and download
    const blob = new Blob([JSON.stringify(data.report_data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading report:', error);
    throw error;
  }
}

/**
 * Load report data into localStorage for rendering
 */
async function loadReportForRendering(reportId = null) {
  try {
    const supabase = await window.supabaseAuth.getSupabase();
    let report;
    
    if (reportId) {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single();
      
      if (error) throw error;
      report = data;
    } else {
      report = await getPartnershipReport();
    }

    if (!report) {
      throw new Error('No report found');
    }

    // Store in localStorage for report pages to render
    localStorage.setItem('generated_report', JSON.stringify(report.report_data));

    return report.report_data;
  } catch (error) {
    console.error('Error loading report for rendering:', error);
    throw error;
  }
}

/**
 * Get response count for a specific user
 */
async function getResponseCountForUser(userId) {
  try {
    const supabase = await window.supabaseAuth.getSupabase();
    const { count, error } = await supabase
      .from('responses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting response count:', error);
    return 0;
  }
}

/**
 * Check if current user's survey is complete (290 questions)
 */
async function isSurveyComplete() {
  try {
    const currentUser = await window.supabaseAuth.getCurrentUser();
    if (!currentUser) return false;
    
    const count = await getResponseCountForUser(currentUser.id);
    return count >= 290;
  } catch (error) {
    console.error('Error checking survey completion:', error);
    return false;
  }
}

// Export to global scope
window.reportsApi = {
  generateAndSaveReport,
  getPartnershipReport,
  getAllPartnershipReports,
  deleteReport,
  hasPartnershipReport,
  getReportStatus,
  downloadReportJSON,
  loadReportForRendering,
  getResponseCountForUser,
  isSurveyComplete
};

console.log('✅ Reports API (Browser) loaded');

