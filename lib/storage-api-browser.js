// lib/storage-api-browser.js
// This file provides browser-compatible functions for managing file uploads to Supabase Storage.

window.storageApi = {
  /**
   * Upload a profile picture for the current user
   * @param {File} file - The image file to upload
   * @returns {Promise<string>} The public URL of the uploaded image
   */
  uploadProfilePicture: async function(file) {
    try {
      const user = await window.supabaseAuth.getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }

      const supabase = await window.supabaseAuth.getSupabase();
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile.${fileExt}`;

      // Upload the file
      const { data, error } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true // Replace existing file
        });

      if (error) throw error;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      // Update user profile with the new URL
      await window.supabaseAuth.updateUserProfile({
        profile_picture_url: publicUrl
      });

      return publicUrl;
    } catch (error) {
      console.error('Error uploading profile picture:', error.message);
      throw error;
    }
  },

  /**
   * Delete the profile picture for the current user
   * @returns {Promise<void>}
   */
  deleteProfilePicture: async function() {
    try {
      const user = await window.supabaseAuth.getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      const supabase = await window.supabaseAuth.getSupabase();
      
      // List all files in user's folder
      const { data: files, error: listError } = await supabase.storage
        .from('profile-pictures')
        .list(user.id);

      if (listError) throw listError;

      if (files && files.length > 0) {
        // Delete all files in the user's folder
        const filePaths = files.map(file => `${user.id}/${file.name}`);
        const { error: deleteError } = await supabase.storage
          .from('profile-pictures')
          .remove(filePaths);

        if (deleteError) throw deleteError;
      }

      // Update user profile to remove the URL
      await window.supabaseAuth.updateUserProfile({
        profile_picture_url: null
      });
    } catch (error) {
      console.error('Error deleting profile picture:', error.message);
      throw error;
    }
  },

  /**
   * Get the profile picture URL for a user
   * @param {string} userId - The user ID
   * @returns {Promise<string|null>} The public URL or null
   */
  getProfilePictureUrl: async function(userId) {
    try {
      const supabase = await window.supabaseAuth.getSupabase();
      const { data, error } = await supabase
        .from('user_profiles')
        .select('profile_picture_url')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.profile_picture_url || null;
    } catch (error) {
      console.error('Error getting profile picture URL:', error.message);
      return null;
    }
  }
};

console.log('✅ Storage API loaded');

