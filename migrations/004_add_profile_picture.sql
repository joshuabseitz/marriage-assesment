-- migrations/004_add_profile_picture.sql
-- Add profile picture URL column to user_profiles

ALTER TABLE user_profiles
ADD COLUMN profile_picture_url TEXT;

-- Create storage bucket for profile pictures (run this separately in Supabase dashboard or via API)
-- This is for documentation purposes - the actual bucket creation should be done via Supabase dashboard or MCP
/*
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true);
*/

-- Storage policies for profile pictures (run after bucket is created)
-- Allow users to upload their own profile pictures
/*
CREATE POLICY "Users can upload own profile picture"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own profile pictures
CREATE POLICY "Users can update own profile picture"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own profile pictures
CREATE POLICY "Users can delete own profile picture"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow everyone to view profile pictures (public bucket)
CREATE POLICY "Anyone can view profile pictures"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');
*/


