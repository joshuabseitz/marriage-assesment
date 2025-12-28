/**
 * Supabase Client Configuration
 * Main client for interacting with Supabase from the frontend
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables (will be loaded from .env in development)
const supabaseUrl = 'SUPABASE_URL_PLACEHOLDER';
const supabaseAnonKey = 'SUPABASE_ANON_KEY_PLACEHOLDER';

// For development, allow loading from a global config object
// This enables easy configuration without build tools
const getConfig = () => {
  if (typeof window !== 'undefined' && window.SUPABASE_CONFIG) {
    return window.SUPABASE_CONFIG;
  }
  return { url: supabaseUrl, anonKey: supabaseAnonKey };
};

const config = getConfig();

// Create Supabase client
export const supabase = createClient(config.url, config.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

/**
 * Get the currently authenticated user
 * @returns {Promise<User|null>} The current user or null
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Check if a user is authenticated
 * @returns {Promise<boolean>} True if user is authenticated
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Get the current user's profile from user_profiles table
 * @returns {Promise<object|null>} The user profile or null
 */
export async function getUserProfile() {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/**
 * Update the current user's profile
 * @param {object} updates - Profile fields to update
 * @returns {Promise<object>} Updated profile data
 */
export async function updateUserProfile(updates) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

/**
 * Sign up a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {object} metadata - Additional user metadata
 * @returns {Promise<object>} Auth response
 */
export async function signUp(email, password, metadata = {}) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: window.location.origin + '/survey'
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

/**
 * Sign in an existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} Auth response
 */
export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Redirect to auth page after signout
    window.location.href = '/signup';
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

/**
 * Reset password for a user
 * @param {string} email - User email
 * @returns {Promise<void>}
 */
export async function resetPassword(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/signup?mode=reset'
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
}

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export async function updatePassword(newPassword) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
}

/**
 * Subscribe to auth state changes
 * @param {function} callback - Callback function to handle auth changes
 * @returns {object} Subscription object with unsubscribe method
 */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

// Export for global access in browser
if (typeof window !== 'undefined') {
  window.supabase = supabase;
  window.supabaseAuth = {
    getCurrentUser,
    isAuthenticated,
    getUserProfile,
    updateUserProfile,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    onAuthStateChange
  };
}

