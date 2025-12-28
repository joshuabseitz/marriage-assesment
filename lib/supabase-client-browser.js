/**
 * Supabase Client for Browser (No Build Step)
 * Uses the global supabaseClient initialized in config.js
 */

// Wait for Supabase client to be initialized
async function waitForSupabase() {
  let attempts = 0;
  const maxAttempts = 50; // 5 seconds max
  
  while (!window.supabaseClient && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 100));
    attempts++;
  }
  
  if (!window.supabaseClient) {
    console.error('Debugging info:', {
      hasSupabaseLibrary: !!window.supabase,
      hasCreateClient: !!(window.supabase && window.supabase.createClient),
      hasConfig: !!window.SUPABASE_CONFIG,
      hasClient: !!window.supabaseClient
    });
    throw new Error('Supabase client not initialized after 5 seconds. Check that Supabase CDN and config.js are loaded correctly.');
  }
  
  return window.supabaseClient;
}

// Get the Supabase client from global scope
async function getSupabase() {
  if (!window.supabaseClient) {
    return await waitForSupabase();
  }
  return window.supabaseClient;
}

/**
 * Get the currently authenticated user
 * @returns {Promise<User|null>} The current user or null
 */
async function getCurrentUser() {
  try {
    const supabase = await getSupabase();
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
async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Get the current user's profile from user_profiles table
 * @returns {Promise<object|null>} The user profile or null
 */
async function getUserProfile() {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const supabase = await getSupabase();
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
async function updateUserProfile(updates) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const supabase = await getSupabase();
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
async function signUp(email, password, metadata = {}) {
  try {
    const supabase = await getSupabase();
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
async function signIn(email, password) {
  try {
    const supabase = await getSupabase();
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
async function signOut() {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Redirect to signup page after signout
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
async function resetPassword(email) {
  try {
    const supabase = await getSupabase();
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
async function updatePassword(newPassword) {
  try {
    const supabase = await getSupabase();
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
async function onAuthStateChange(callback) {
  const supabase = await getSupabase();
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

/**
 * Require authentication for the current page
 * Redirects to signup if user is not authenticated
 */
async function requireAuth() {
  // Don't redirect if already on signup page
  if (window.location.pathname.includes('signup')) {
    return null;
  }

  const user = await getCurrentUser();

  if (!user) {
    // Not authenticated, redirect to signup page
    const redirectUrl = '/signup?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = redirectUrl;
    return null;
  }

  return user;
}

/**
 * Redirect if user IS authenticated (for auth pages)
 */
async function redirectIfAuthenticated(defaultRedirect = '/survey') {
  try {
    const user = await getCurrentUser();

    if (user) {
      // Check for redirect parameter in URL
      const urlParams = new URLSearchParams(window.location.search);
      let redirect = urlParams.get('redirect') || defaultRedirect;
      
      // Check if demographics are complete
      if (window.demographicsAPI) {
        const demographicsComplete = await window.demographicsAPI.isDemographicsComplete();
        if (!demographicsComplete) {
          // Redirect to signup to complete demographics
          redirect = '/signup?step=2';
        }
      }
      
      window.location.href = redirect;
    }
  } catch (error) {
    console.error('Error in redirectIfAuthenticated:', error);
  }
}

// Export all functions globally
window.supabaseAuth = {
  getSupabase,
  getCurrentUser,
  isAuthenticated,
  getUserProfile,
  updateUserProfile,
  signUp,
  signIn,
  signOut,
  resetPassword,
  updatePassword,
  onAuthStateChange,
  requireAuth,
  redirectIfAuthenticated
};

// Log when ready
(async function() {
  try {
    await getSupabase();
    console.log('✅ Supabase auth functions loaded and ready');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase auth:', error);
  }
})();

