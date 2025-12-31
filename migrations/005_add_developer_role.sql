-- Add developer role to user_profiles
-- This allows certain users to access development tools in production

-- Add role column to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'developer', 'admin'));

-- Create index for role lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Grant developer role to specific user
-- Replace with actual user email
UPDATE user_profiles
SET role = 'developer'
WHERE email = 'joshuabseitz@gmail.com';

-- Function to check if current user is a developer
CREATE OR REPLACE FUNCTION public.is_developer()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid()
    AND role IN ('developer', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_developer() TO authenticated;


