# Vercel Deployment Fix

## Problem
Getting error: `Cannot read properties of undefined (reading 'signIn')` when trying to sign up on Vercel.

## Root Cause
The issue was caused by:
1. Missing `vercel.json` configuration file
2. Scripts not loading properly due to relative paths
3. No error handling for when scripts fail to load

## What Was Fixed

### 1. Created `vercel.json`
Added proper Vercel configuration to:
- Route API requests to the Node.js server
- Handle extensionless URLs (`/signup` → `/signup.html`)
- Serve JavaScript files with correct MIME types
- Set up proper caching headers

### 2. Fixed Script Paths
Changed all script paths from relative to absolute:
- ❌ Before: `<script src="config.js"></script>`
- ✅ After: `<script src="/config.js"></script>`

This ensures scripts load correctly regardless of the current page's path.

### 3. Added Defensive Checks
Added checks in `signup.html` and `auth-signin.html` to:
- Wait for `window.supabaseAuth` to load before using it
- Show clear error messages if scripts fail to load
- Log debug information to help diagnose issues

### 4. Fixed Server Bug
Fixed `server.js` where `adminSupabase` was referenced but never initialized.

## What You Need to Do

### Step 1: Commit and Push Changes
```bash
git add .
git commit -m "Fix Vercel deployment issues"
git push
```

### Step 2: Add Environment Variables in Vercel
Go to your Vercel project → **Settings** → **Environment Variables** and add:

**Required:**
- `GEMINI_API_KEY` - Your Google Gemini API key
- `SUPABASE_SERVICE_KEY` - Your Supabase service role key

**Optional (has defaults):**
- `SUPABASE_URL` - Defaults to your current project
- `GEMINI_MODEL` - Defaults to `gemini-2.0-flash`

### Step 3: Redeploy
After adding environment variables, trigger a new deployment:
- Either push a new commit
- Or click **Redeploy** in Vercel dashboard

### Step 4: Test
After redeployment, test these URLs:
1. `https://your-app.vercel.app/api/health` - Should show healthy status
2. `https://your-app.vercel.app/signup` - Try signing up
3. Open browser console (F12) and check for debug logs

## Debugging

### Check Debug Logs
When you load `/signup`, open the browser console (F12) and look for:
```
=== Signup Page Debug Info ===
window.supabase: true
window.supabaseClient: true
window.supabaseAuth: true
window.demographicsApi: true
window.storageApi: true
window.SUPABASE_CONFIG: true
✅ All auth functions loaded successfully
```

If any show `false`:
1. Check Network tab to see if the script failed to load
2. Check for 404 errors on script files
3. Verify `vercel.json` is committed and deployed

### Common Issues

**Scripts still not loading:**
- Clear browser cache and hard refresh (Cmd+Shift+R or Ctrl+Shift+F5)
- Check that `/lib/` directory is included in your git repo
- Verify `vercel.json` exists in your deployment

**API calls failing:**
- Verify environment variables are set in Vercel
- Check that you redeployed after adding them
- Look at Vercel function logs for server errors

**CORS errors:**
- Check that your Supabase URL is correct
- Verify your Supabase project allows requests from your Vercel domain

## Files Modified
- ✅ `vercel.json` - Created (Vercel configuration)
- ✅ `signup.html` - Updated (absolute paths + error handling)
- ✅ `auth-signin.html` - Updated (absolute paths + error handling)
- ✅ `server.js` - Fixed (adminSupabase initialization)
- ✅ `VERCEL_SETUP.md` - Created (environment variables guide)
- ✅ `VERCEL_DEPLOYMENT_FIX.md` - This file

## Next Steps
After the fixes are deployed, you should be able to:
1. Sign up without errors
2. Sign in successfully
3. Upload profile pictures
4. Complete the full onboarding flow

If you still encounter issues, check the browser console for the debug logs and the error messages will now be much more helpful!

