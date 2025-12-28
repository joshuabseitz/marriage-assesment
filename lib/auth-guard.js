/**
 * Authentication Guard
 * Protects pages by checking authentication status and redirecting if needed
 */

import { getCurrentUser, supabase } from './supabase-client.js';

/**
 * Require authentication for the current page
 * Redirects to signup if user is not authenticated
 * @param {object} options - Configuration options
 * @param {string} options.redirectTo - Page to redirect to after auth (default: current page)
 * @param {boolean} options.checkProfile - Whether to check if profile is complete
 * @returns {Promise<User>} The authenticated user
 */
export async function requireAuth(options = {}) {
  const {
    redirectTo = window.location.pathname + window.location.search,
    checkProfile = false
  } = options;

  try {
    // Don't redirect if already on signup page
    if (window.location.pathname.includes('signup')) {
      return null;
    }

    const user = await getCurrentUser();

    if (!user) {
      // Not authenticated, redirect to signup page
      const redirectUrl = '/signup?redirect=' + encodeURIComponent(redirectTo);
      window.location.href = redirectUrl;
      return null;
    }

    // Optionally check if profile is complete
    if (checkProfile) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (!profile || !profile.full_name) {
        // Profile incomplete, redirect to profile setup
        window.location.href = '/profile?setup=true';
        return null;
      }
    }

    return user;
  } catch (error) {
    console.error('Error checking authentication:', error);
    // On error, redirect to signup to be safe
    window.location.href = '/signup?redirect=' + encodeURIComponent(redirectTo);
    return null;
  }
}

/**
 * Check if user is authenticated without redirecting
 * Useful for conditional UI elements
 * @returns {Promise<User|null>} The current user or null
 */
export async function checkAuth() {
  try {
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    console.error('Error checking auth:', error);
    return null;
  }
}

/**
 * Redirect if user IS authenticated (for auth pages)
 * @param {string} defaultRedirect - Default page to redirect to (default: /survey)
 */
export async function redirectIfAuthenticated(defaultRedirect = '/survey') {
  try {
    const user = await getCurrentUser();

    if (user) {
      // Check for redirect parameter in URL
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect') || defaultRedirect;
      window.location.href = redirect;
    }
  } catch (error) {
    console.error('Error in redirectIfAuthenticated:', error);
  }
}

/**
 * Setup auth state listener for the page
 * Automatically handles auth state changes
 * @param {function} onSignIn - Callback when user signs in
 * @param {function} onSignOut - Callback when user signs out
 */
export function setupAuthListener(onSignIn, onSignOut) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session && onSignIn) {
      onSignIn(session.user);
    } else if (event === 'SIGNED_OUT' && onSignOut) {
      onSignOut();
    } else if (event === 'TOKEN_REFRESHED' && session) {
      console.log('Token refreshed');
    } else if (event === 'USER_UPDATED' && session) {
      console.log('User updated');
    }
  });
}

/**
 * Show loading state while checking auth
 * @param {string} containerId - ID of container to show loading in
 */
export function showAuthLoading(containerId = 'app') {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div class="flex items-center justify-center min-h-screen bg-[#fcfaf8]">
        <div class="text-center">
          <div class="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-slate-600 text-sm">Checking authentication...</p>
        </div>
      </div>
    `;
  }
}

/**
 * Initialize auth guard for a page
 * Call this at the top of protected pages
 * @param {object} options - Auth options
 * @returns {Promise<User>} The authenticated user
 */
export async function initAuthGuard(options = {}) {
  // Show loading state
  const { showLoading = true } = options;
  if (showLoading) {
    showAuthLoading();
  }

  // Check authentication
  const user = await requireAuth(options);

  // Hide loading state
  if (showLoading) {
    const container = document.getElementById('app');
    if (container) {
      container.innerHTML = '';
    }
  }

  return user;
}

// Export for global access in browser
if (typeof window !== 'undefined') {
  window.authGuard = {
    requireAuth,
    checkAuth,
    redirectIfAuthenticated,
    setupAuthListener,
    showAuthLoading,
    initAuthGuard
  };
}

