/**
 * Application Configuration
 * Loads Supabase from CDN and configures the client
 * 
 * This file must be loaded AFTER the Supabase CDN script.
 * Load it in your HTML like this:
 * <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 * <script src="./config.js"></script>
 */

// Configuration - these will be replaced by the server or loaded from environment
window.SUPABASE_CONFIG = {
  url: 'https://tobxdhqcdttgawqewpwl.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvYnhkaHFjZHR0Z2F3cWV3cHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4ODc2OTUsImV4cCI6MjA4MjQ2MzY5NX0.C-5Za35RyU4EPRt4nuy694q-toPcr4m1VuQ0Q7S6Q6U'
};

// Initialize Supabase client with retry logic
(async function initSupabase() {
  let attempts = 0;
  const maxAttempts = 50; // 5 seconds max wait
  
  while (attempts < maxAttempts) {
    if (window.supabase && window.supabase.createClient) {
      try {
        window.supabaseClient = window.supabase.createClient(
          window.SUPABASE_CONFIG.url,
          window.SUPABASE_CONFIG.anonKey,
          {
            auth: {
              autoRefreshToken: true,
              persistSession: true,
              detectSessionInUrl: true
            }
          }
        );
        console.log('✅ Supabase client initialized successfully');
        return;
      } catch (error) {
        console.error('❌ Error initializing Supabase client:', error);
        return;
      }
    }
    
    // Wait 100ms and try again
    await new Promise(resolve => setTimeout(resolve, 100));
    attempts++;
  }
  
  console.error('❌ Supabase library not loaded after 5 seconds. Make sure the CDN script is included before config.js');
  console.error('Expected: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
})();
