/**
 * Responses API - Browser Compatible
 * Manages survey responses in Supabase
 */

/**
 * Save or update a single response
 */
async function saveResponse(questionId, questionType, value) {
  try {
    const supabase = await window.supabaseAuth.getSupabase();
    const user = await window.supabaseAuth.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('responses')
      .upsert({
        user_id: user.id,
        question_id: questionId,
        question_type: questionType,
        value: value,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,question_id'
      });

    if (error) throw error;
    console.log(`✓ Saved response for question ${questionId}`);
  } catch (error) {
    console.error('Error saving response:', error);
    throw error;
  }
}

/**
 * Get all responses for the current user
 */
async function getUserResponses() {
  try {
    const supabase = await window.supabaseAuth.getSupabase();
    const user = await window.supabaseAuth.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('responses')
      .select('question_id, value')
      .eq('user_id', user.id);

    if (error) throw error;

    // Transform to question_id: value map
    const responses = {};
    data.forEach(r => responses[r.question_id] = r.value);
    return responses;
  } catch (error) {
    console.error('Error getting user responses:', error);
    throw error;
  }
}

/**
 * Get response count for a user
 */
async function getResponseCount(userId) {
  try {
    const supabase = await window.supabaseAuth.getSupabase();
    const { count, error } = await supabase
      .from('responses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) throw error;
    return count;
  } catch (error) {
    console.error('Error getting response count:', error);
    return 0;
  }
}

/**
 * Mark survey as complete for the current user
 */
async function markSurveyComplete() {
  try {
    const supabase = await window.supabaseAuth.getSupabase();
    const user = await window.supabaseAuth.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('user_profiles')
      .update({ last_survey_updated: new Date().toISOString() })
      .eq('id', user.id);

    if (error) throw error;
    console.log('Survey marked as complete');
  } catch (error) {
    console.error('Error marking survey complete:', error);
    throw error;
  }
}

/**
 * Get survey completion status for a user
 */
async function getSurveyCompletionStatus(userId) {
  try {
    const supabase = await window.supabaseAuth.getSupabase();
    const { data, error } = await supabase
      .from('user_profiles')
      .select('last_survey_updated')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data?.last_survey_updated;
  } catch (error) {
    console.error('Error getting survey status:', error);
    return false;
  }
}

/**
 * Check if current user's survey is complete
 */
async function isSurveyComplete() {
  try {
    const user = await window.supabaseAuth.getCurrentUser();
    if (!user) return false;
    return await getSurveyCompletionStatus(user.id);
  } catch (error) {
    console.error('Error checking survey completion:', error);
    return false;
  }
}

/**
 * Get survey progress for the current user
 */
async function getSurveyProgress() {
  try {
    const user = await window.supabaseAuth.getCurrentUser();
    if (!user) {
      return {
        answered: 0,
        total: 286,
        percentage: 0,
        isComplete: false
      };
    }

    const answered = await getResponseCount(user.id);
    const total = 286; // Total questions from questions-data.json
    const percentage = Math.round((answered / total) * 100);
    const isComplete = answered >= total;

    return {
      answered,
      total,
      percentage,
      isComplete
    };
  } catch (error) {
    console.error('Error getting survey progress:', error);
    return {
      answered: 0,
      total: 286,
      percentage: 0,
      isComplete: false
    };
  }
}

// Export to global scope (use lowercase 'api' for consistency)
window.responsesApi = {
  saveResponse,
  getUserResponses,
  getResponseCount,
  markSurveyComplete,
  getSurveyCompletionStatus,
  isSurveyComplete,
  getSurveyProgress
};

console.log('✅ Responses API loaded');

