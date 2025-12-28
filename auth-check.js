/**
 * Simple Auth Check
 * Add this script to any page that requires authentication
 * Redirects to signup if user is not logged in
 * Also checks if demographics are complete
 */

(async function() {
  console.log('🔒 Auth check starting...', window.location.pathname);
  
  // Skip auth check on auth and signup pages
  if (window.location.pathname.includes('auth-signin') || 
      window.location.pathname.includes('signup')) {
    console.log('✅ On auth/signup page, skipping auth check');
    return;
  }

  // Wait for supabase to be available
  let attempts = 0;
  while (!window.supabaseAuth && attempts < 50) {
    await new Promise(resolve => setTimeout(resolve, 100));
    attempts++;
  }

  if (!window.supabaseAuth) {
    console.error('❌ Supabase auth not loaded. Redirecting to signup page...');
    const currentPath = window.location.pathname + window.location.search;
    window.location.replace('/signup?redirect=' + encodeURIComponent(currentPath));
    return;
  }

  // Check if user is authenticated
  console.log('🔍 Checking authentication...');
  const user = await window.supabaseAuth.getCurrentUser();
  
  if (!user) {
    // Not authenticated, redirect to signup page
    console.log('❌ Not authenticated, redirecting to signup...');
    const currentPath = window.location.pathname + window.location.search;
    window.location.replace('/signup?redirect=' + encodeURIComponent(currentPath));
    return;
  }

  console.log('✅ User authenticated:', user.email);

  // Wait for demographics API to be available
  attempts = 0;
  while (!window.demographicsAPI && attempts < 50) {
    await new Promise(resolve => setTimeout(resolve, 100));
    attempts++;
  }

  // Check if demographics are complete (only if demographics API is available)
  if (window.demographicsAPI) {
    const demographicsComplete = await window.demographicsAPI.isDemographicsComplete();
    
    if (!demographicsComplete && !window.location.pathname.includes('signup')) {
      // Demographics incomplete, redirect to signup to complete
      console.log('⚠️ Demographics incomplete, redirecting to complete signup...');
      window.location.replace('/signup?step=2');
      return;
    }
  }
  
  console.log('✅ Auth check complete - user is authenticated and authorized');
})();

