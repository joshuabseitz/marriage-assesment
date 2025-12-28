/**
 * Demographics API - Browser Compatible
 * Manages user demographic data in Supabase user_profiles table
 */

/**
 * Save demographics to user_profiles
 * @param {object} data - Demographic data to save
 */
async function saveDemographics(data) {
  try {
    const supabase = await window.supabaseAuth.getSupabase();
    const user = await window.supabaseAuth.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    // Use upsert to handle cases where profile might not exist
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        email: user.email,
        ...data,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (error) throw error;
    console.log('Demographics saved successfully');
  } catch (error) {
    console.error('Error saving demographics:', error);
    throw error;
  }
}

/**
 * Check if demographics are complete
 * @returns {Promise<boolean>}
 */
async function isDemographicsComplete() {
  try {
    const supabase = await window.supabaseAuth.getSupabase();
    const user = await window.supabaseAuth.getCurrentUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('demographics_complete')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data?.demographics_complete === true;
  } catch (error) {
    console.error('Error checking demographics completion:', error);
    return false;
  }
}

/**
 * Get user's demographics
 * @returns {Promise<object|null>}
 */
async function getUserDemographics() {
  try {
    const supabase = await window.supabaseAuth.getSupabase();
    const user = await window.supabaseAuth.getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('gender, age, profile_picture_url, education, employment_status, employment_category, religious_affiliation, relationship_status, living_together, long_distance, demographics_complete')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting demographics:', error);
    return null;
  }
}

/**
 * Mark demographics as complete
 */
async function markDemographicsComplete() {
  try {
    const supabase = await window.supabaseAuth.getSupabase();
    const user = await window.supabaseAuth.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('user_profiles')
      .update({
        demographics_complete: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) throw error;
    console.log('Demographics marked as complete');
  } catch (error) {
    console.error('Error marking demographics complete:', error);
    throw error;
  }
}

/**
 * Get demographics for another user (for partner display)
 * @param {string} userId - User ID to fetch demographics for
 * @returns {Promise<object|null>}
 */
async function getPartnerDemographics(userId) {
  try {
    const supabase = await window.supabaseAuth.getSupabase();
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('full_name, gender, age, education, religious_affiliation, relationship_status')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting partner demographics:', error);
    return null;
  }
}

// Export to global scope (use lowercase 'api' for consistency)
window.demographicsApi = {
  saveDemographics,
  isDemographicsComplete,
  getUserDemographics,
  markDemographicsComplete,
  getPartnerDemographics
};

console.log('✅ Demographics API loaded');

