# Profile Picture Upload Setup

This guide will help you set up the Supabase Storage bucket for profile picture uploads.

## ✅ Completed Steps

1. ✅ Database migration applied - `profile_picture_url` column added to `user_profiles` table
2. ✅ Frontend UI updated with upload/delete functionality
3. ✅ Storage API created (`lib/storage-api-browser.js`)

## 🔧 Required Setup: Create Storage Bucket

You need to create a storage bucket in Supabase for profile pictures. Follow these steps:

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Click on **Storage** in the left sidebar
3. Click **New Bucket**
4. Enter the following details:
   - **Name**: `profile-pictures`
   - **Public bucket**: ✅ Checked (Yes)
5. Click **Create bucket**

### Option 2: SQL Editor

Alternatively, run this SQL in the Supabase SQL Editor:

```sql
-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true);
```

## 🔒 Configure Storage Policies

After creating the bucket, you need to set up Row Level Security (RLS) policies. 

### Via Supabase Dashboard:

1. Go to **Storage** → **Policies** tab for the `profile-pictures` bucket
2. Click **New Policy** and add the following policies:

#### Policy 1: Users can upload own profile picture
- **Policy name**: `Users can upload own profile picture`
- **Operation**: INSERT
- **Target roles**: authenticated
- **USING expression**:
  ```sql
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
  ```

#### Policy 2: Users can update own profile picture
- **Policy name**: `Users can update own profile picture`
- **Operation**: UPDATE
- **Target roles**: authenticated
- **USING expression**:
  ```sql
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
  ```

#### Policy 3: Users can delete own profile picture
- **Policy name**: `Users can delete own profile picture`
- **Operation**: DELETE
- **Target roles**: authenticated
- **USING expression**:
  ```sql
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
  ```

#### Policy 4: Anyone can view profile pictures
- **Policy name**: `Anyone can view profile pictures`
- **Operation**: SELECT
- **Target roles**: public
- **USING expression**:
  ```sql
  bucket_id = 'profile-pictures'
  ```

### Via SQL Editor:

Run this SQL in the Supabase SQL Editor:

```sql
-- Policy: Users can upload own profile picture
CREATE POLICY "Users can upload own profile picture"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can update own profile picture
CREATE POLICY "Users can update own profile picture"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete own profile picture
CREATE POLICY "Users can delete own profile picture"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Anyone can view profile pictures
CREATE POLICY "Anyone can view profile pictures"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');
```

## 📝 How It Works

### File Structure
Profile pictures are stored in Supabase Storage with this structure:
```
profile-pictures/
  └── {user_id}/
      └── profile.{ext}
```

Each user has their own folder identified by their user ID, and their profile picture is always named `profile.{ext}` (where `ext` is the file extension like jpg, png, etc.). When a user uploads a new picture, it replaces the old one.

### Features Implemented

1. **Upload**: Users can upload profile pictures (JPG, PNG, GIF)
2. **Validation**: 
   - Max file size: 5MB
   - File type: Images only
3. **Replace**: Uploading a new picture automatically replaces the old one
4. **Delete**: Users can remove their profile picture
5. **Preview**: Instant preview after upload
6. **Loading States**: Visual feedback during upload/delete operations
7. **Security**: RLS policies ensure users can only manage their own pictures

### UI Updates

The profile page now includes:
- Profile picture display (24x24px circular avatar)
- Upload button with file input
- Remove button (when picture exists)
- Loading spinner during operations
- Toast notifications for success/error feedback
- Automatic page reload after successful upload/delete

## 🧪 Testing

1. Navigate to the profile page: `http://localhost:5000/profile.html`
2. Click "Upload Photo" button
3. Select an image file (max 5MB)
4. Wait for upload to complete
5. Your profile picture should appear
6. Click "Remove" to delete it

## 🔗 Integration Points

Profile pictures will now be displayed:
- ✅ On the profile page
- ⏳ In navigation (future enhancement)
- ⏳ In partner connection UI (future enhancement)
- ⏳ In report generation (future enhancement)

## 📚 Related Files

- `migrations/004_add_profile_picture.sql` - Database schema change
- `lib/storage-api-browser.js` - Storage API functions
- `profile.html` - Updated with upload UI
- `lib/supabase-client-browser.js` - Auth functions (getUserProfile, updateUserProfile)

## ⚠️ Important Notes

- The bucket MUST be named exactly `profile-pictures` for the code to work
- The bucket MUST be set to public for profile pictures to be viewable
- RLS policies ensure users can only manage their own files despite the bucket being public
- Images are cached for 1 hour (3600 seconds) to improve performance
- Old images are automatically replaced when uploading new ones (using `upsert: true`)

