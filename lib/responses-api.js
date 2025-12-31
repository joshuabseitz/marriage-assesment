/**
 * Responses API
 * Manages survey responses in Supabase
 */

import { supabase, getCurrentUser } from './supabase-client.js';

/**
 * Save or update a single response
 * @param {number} questionId - The question ID
 * @param {string} questionType - The question type
 * @param {any} value - The response value
 * @returns {Promise<object>} The saved response
 */
export async function saveResponse(questionId, questionType, value) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('responses')
      .upsert({
        user_id: user.id,
        question_id: questionId,
        question_type: questionType,
        value: value,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,question_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving response:', error);
    throw error;
  }
}

/**
 * Get all responses for the current user
 * @returns {Promise<object>} Map of question_id to value
 */
export async function getUserResponses() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('responses')
      .select('*')
      .eq('user_id', user.id)
      .order('question_id');

    if (error) throw error;

    // Transform to question_id: value map
    const responses = {};
    data.forEach(r => {
      responses[r.question_id] = r.value;
    });

    return responses;
  } catch (error) {
    console.error('Error getting user responses:', error);
    throw error;
  }
}

/**
 * Get response count for current user
 * @returns {Promise<number>} Number of responses
 */
export async function getResponseCount() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const { count, error } = await supabase
      .from('responses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting response count:', error);
    throw error;
  }
}

/**
 * Get response count for a specific user (for partner checking)
 * @param {string} userId - The user ID
 * @returns {Promise<number>} Number of responses
 */
export async function getResponseCountForUser(userId) {
  try {
    const { count, error } = await supabase
      .from('responses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting response count for user:', error);
    throw error;
  }
}

/**
 * Get responses for a specific user (must be partner)
 * @param {string} userId - The user ID
 * @returns {Promise<object>} Map of question_id to value
 */
export async function getPartnerResponses(userId) {
  try {
    const { data, error } = await supabase
      .from('responses')
      .select('*')
      .eq('user_id', userId)
      .order('question_id');

    if (error) throw error;

    // Transform to question_id: value map
    const responses = {};
    data.forEach(r => {
      responses[r.question_id] = r.value;
    });

    return responses;
  } catch (error) {
    console.error('Error getting partner responses:', error);
    throw error;
  }
}

/**
 * Mark survey as complete by updating profile
 * @returns {Promise<void>}
 */
export async function markSurveyComplete() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('user_profiles')
      .update({
        last_survey_updated: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking survey complete:', error);
    throw error;
  }
}

/**
 * Check if user has completed the survey
 * @param {number} requiredCount - Number of questions required (default: 290)
 * @returns {Promise<boolean>} True if survey is complete
 */
export async function isSurveyComplete(requiredCount = 290) {
  try {
    const count = await getResponseCount();
    return count >= requiredCount;
  } catch (error) {
    console.error('Error checking survey completion:', error);
    return false;
  }
}

/**
 * Delete a specific response
 * @param {number} questionId - The question ID
 * @returns {Promise<void>}
 */
export async function deleteResponse(questionId) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('responses')
      .delete()
      .eq('user_id', user.id)
      .eq('question_id', questionId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting response:', error);
    throw error;
  }
}

/**
 * Delete all responses for current user
 * @returns {Promise<void>}
 */
export async function deleteAllResponses() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('responses')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting all responses:', error);
    throw error;
  }
}

/**
 * Get survey progress statistics
 * @param {number} totalQuestions - Total number of questions (default: 300)
 * @returns {Promise<object>} Progress statistics
 */
export async function getSurveyProgress(totalQuestions = 300) {
  try {
    const count = await getResponseCount();
    const percentage = Math.round((count / totalQuestions) * 100);
    const isComplete = count >= totalQuestions;

    return {
      answered: count,
      total: totalQuestions,
      percentage,
      isComplete
    };
  } catch (error) {
    console.error('Error getting survey progress:', error);
    throw error;
  }
}

// Export for global access in browser
if (typeof window !== 'undefined') {
  window.responsesApi = {
    saveResponse,
    getUserResponses,
    getResponseCount,
    getResponseCountForUser,
    getPartnerResponses,
    markSurveyComplete,
    isSurveyComplete,
    deleteResponse,
    deleteAllResponses,
    getSurveyProgress
  };
}


