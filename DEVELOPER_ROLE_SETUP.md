# Developer Role & Enhanced Dev Tools

## Overview

This setup adds a **Developer Role** system that allows specific users to access enhanced development tools for testing, even in production environments. The dev tools now include the ability to populate surveys for:

- **Your own survey** (logged-in user)
- **Your partner's survey** (if connected)
- **Both surveys simultaneously** (for quick report generation testing)

## Features Added

### 1. Database Changes
- Added `role` column to `user_profiles` table (values: 'user', 'developer', 'admin')
- Created `is_developer()` function for role checking
- Granted developer role to `joshuabseitz@gmail.com`

### 2. Enhanced Dev Tools
The floating dev tools button now:
- ✅ Only appears for users with 'developer' or 'admin' role (not just localhost)
- ✅ Shows buttons to populate your survey, partner's survey, or both
- ✅ Displays real-time status for both you and your partner
- ✅ Indicates when both surveys are complete and ready for report generation

## Installation

### Step 1: Apply Database Migration

Run this SQL in your Supabase SQL Editor:

```sql
-- From migrations/005_add_developer_role.sql

-- Add role column to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'developer', 'admin'));

-- Create index for role lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Grant developer role to specific user
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
```

### Step 2: Verify Setup

1. Log in as `joshuabseitz@gmail.com`
2. You should see the **🛠️ DEV** button in the bottom-right corner
3. Click it to open the dev tools menu

### Step 3: Test Report Generation Flow

1. **Connect with a partner** (if not already connected)
2. **Click "🎯 Both Surveys (600 Qs)"** to populate both surveys
3. **Navigate to Report Generator** (`/report-generator`)
4. **Click "Generate Your Report"** to test report generation

## Dev Tools Menu

### Populate Surveys Section

```
📝 My Survey (300 Qs)
   - Populates your own survey with sample data
   - Always available

👥 Partner's Survey (300 Qs)
   - Populates your partner's survey with sample data
   - Only available when you have an accepted partnership
   - Useful for testing report generation

🎯 Both Surveys (600 Qs)
   - Populates both your and your partner's surveys
   - One-click solution for complete testing
   - Only available when you have an accepted partnership
```

### Completion Section

```
✅ Mark My Survey Complete
   - Manually marks your survey as complete
   - Useful if you've manually answered questions
```

### Status Display

Shows real-time progress:
```
You (Your Name):
123/300 questions ⏳

Partner (Partner Name):
290/300 questions ✅

✅ Ready to generate report!
```

## Granting Developer Role to Additional Users

To grant developer role to another user:

```sql
UPDATE user_profiles
SET role = 'developer'
WHERE email = 'user@example.com';
```

To revoke developer role:

```sql
UPDATE user_profiles
SET role = 'user'
WHERE email = 'user@example.com';
```

To grant admin role (admin = developer + future admin privileges):

```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'admin@example.com';
```

## Security Considerations

### Row-Level Security (RLS) Bypass

The dev tools directly insert data for other users, which requires careful consideration:

1. **Developer role check**: Only users with 'developer' or 'admin' role can see the tools
2. **Database-level validation**: The role column has a CHECK constraint
3. **Service role**: Dev tools use the client's session (with RLS), not service role

⚠️ **Note**: The dev tools use direct Supabase queries which respect RLS policies. To populate partner surveys, ensure your RLS policies allow this or adjust as needed.

### RLS Policy for Dev Tools (Optional)

If you want to allow developers to insert responses for their partners:

```sql
-- Allow developers to insert responses for their partner
CREATE POLICY "Developers can insert partner responses"
ON responses
FOR INSERT
TO authenticated
WITH CHECK (
  -- Check if user is a developer
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role IN ('developer', 'admin')
  )
  AND
  -- Check if target user is their partner
  EXISTS (
    SELECT 1 FROM partnerships
    WHERE status = 'accepted'
    AND (
      (user1_id = auth.uid() AND user2_id = responses.user_id)
      OR
      (user2_id = auth.uid() AND user1_id = responses.user_id)
    )
  )
);
```

## Troubleshooting

### Dev Tools Not Appearing

1. Check user role in database:
   ```sql
   SELECT email, role FROM user_profiles WHERE email = 'joshuabseitz@gmail.com';
   ```

2. Check browser console for errors
3. Ensure you're logged in
4. Refresh the page after applying migration

### Partner Buttons Disabled

1. Ensure you have an accepted partnership:
   ```sql
   SELECT * FROM partnerships WHERE status = 'accepted';
   ```

2. Click "🔄 Refresh Status" in dev menu
3. Check browser console for errors

### Population Fails

1. Check Supabase logs for RLS policy violations
2. Verify the partner connection exists
3. Check browser console for detailed error messages

## Usage Examples

### Quick Report Generation Test

1. Log in as developer user
2. Navigate to Partner Connect page
3. Connect with a test partner account
4. Open dev tools (🛠️ DEV button)
5. Click "🎯 Both Surveys (600 Qs)"
6. Wait for confirmation (takes ~30-60 seconds)
7. Navigate to Report Generator
8. Click "Generate Your Report"

### Testing Individual Survey Completion

1. Open dev tools
2. Click "📝 My Survey (300 Qs)" to populate your own
3. Have your partner log in and do the same
4. Test report generation flow

### Testing Partner Status Display

1. Populate only your survey
2. Check report generator shows "Partner incomplete"
3. Populate partner survey
4. Check report generator shows "Ready to generate"

## File Changes

### New Files
- `migrations/005_add_developer_role.sql` - Database migration for role system
- `DEVELOPER_ROLE_SETUP.md` - This documentation

### Modified Files
- `dev-tools.js` - Enhanced with partner population features and role checking

## Next Steps

After setup:
1. ✅ Test dev tools visibility (only for developer users)
2. ✅ Test single survey population
3. ✅ Test partner survey population
4. ✅ Test both surveys population
5. ✅ Test report generation with populated data
6. ✅ Grant developer role to additional team members if needed

## Support

If you encounter issues:
1. Check Supabase logs for database errors
2. Check browser console for JavaScript errors
3. Verify migrations were applied correctly
4. Ensure RLS policies allow the operations


