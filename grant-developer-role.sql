-- Quick Script: Grant Developer Role
-- Run this in Supabase SQL Editor to grant developer role to a specific user
-- This can be run independently or after the migration

-- Grant developer role to joshuabseitz@gmail.com
UPDATE user_profiles
SET role = 'developer'
WHERE email = 'joshuabseitz@gmail.com';

-- Verify the change
SELECT email, role, full_name, created_at
FROM user_profiles
WHERE email = 'joshuabseitz@gmail.com';

-- To grant developer role to additional users, copy and modify:
-- UPDATE user_profiles SET role = 'developer' WHERE email = 'another@example.com';

-- To revoke and set back to regular user:
-- UPDATE user_profiles SET role = 'user' WHERE email = 'joshuabseitz@gmail.com';

-- To see all developers:
-- SELECT email, role, full_name FROM user_profiles WHERE role IN ('developer', 'admin');


