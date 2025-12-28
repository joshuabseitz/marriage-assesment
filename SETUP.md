# Quick Setup Guide

Get up and running with SYMBIS in 10 minutes!

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free at [supabase.com](https://supabase.com))
- A Gemini API key (free at [Google AI Studio](https://makersuite.google.com/app/apikey))

## Step 1: Install Dependencies

```bash
npm install
```

This installs:
- `@supabase/supabase-js` - Supabase client
- `express` - Web server
- `@google/genai` - Gemini AI client
- Other required packages

## Step 2: Set Up Supabase

### Create Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Enter a name (e.g., "SYMBIS") and database password
4. Wait 1-2 minutes for project creation

### Get API Credentials
1. Go to **Project Settings** → **API**
2. Copy these three values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJhbGciOi...`)
   - **service_role** key (different JWT token)

### Run Database Migrations
1. Go to **SQL Editor** in Supabase dashboard
2. Click "New query"
3. Copy and paste contents of `migrations/001_initial_schema.sql`
4. Click **Run** (or Cmd/Ctrl + Enter)
5. Wait for success message

6. Create another new query
7. Copy and paste contents of `migrations/002_rls_policies.sql`
8. Click **Run**
9. Verify success

## Step 3: Configure Environment

Create a `.env` file in the project root:

```bash
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash

# Server Configuration
PORT=5000

# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJI...
SUPABASE_SERVICE_KEY=eyJhbGciOiJI...
```

**Get your Gemini API key:**
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy and paste into `.env`

**Important:** Never commit the `.env` file to git!

## Step 4: Start the Server

```bash
npm start
```

You should see:
```
═══════════════════════════════════════════════════════════
🎯 SYMBIS Report Generator Server
═══════════════════════════════════════════════════════════
📡 Server running at: http://127.0.0.1:5000
🔑 Gemini API: ✅ Configured
🗄️  Supabase: ✅ Available
═══════════════════════════════════════════════════════════
```

## Step 5: Create Your Account

1. Open browser to: http://127.0.0.1:5000/auth.html
2. Click **Sign Up** tab
3. Enter your:
   - Full name
   - Email address
   - Password (min 6 characters)
4. Click "Create Account"
5. Check your email for confirmation (if enabled)
6. Sign in with your credentials

## Step 6: Complete the Survey

### Option A: Use Dev Tools (Fast - for testing)
1. After sign in, you'll be at: http://127.0.0.1:5000/survey.html
2. Click the **🛠️ DEV** button in the bottom-right corner
3. Click "📝 Populate My Survey (300 Qs)"
4. Wait ~30 seconds for all responses to save
5. Click "✅ Mark Survey Complete"

### Option B: Manual Survey (Real use)
1. Go through each section one by one
2. Answer all 300 questions
3. Your progress auto-saves to Supabase after each answer
4. You can take breaks and resume anytime

## Step 7: Connect With Your Partner

1. Click "Find Partner" in the navigation
2. Have your partner:
   - Create their own account
   - Complete their survey
3. Search for them by email
4. Send a partnership request
5. They accept your request

**For Testing:** You can create a second account in a different browser/incognito window to simulate a partner.

## Step 8: Generate Report

1. Once both surveys are complete, go to: http://127.0.0.1:5000/report-generator.html
2. Verify both surveys show ✅ Complete
3. Click "Generate Your Report"
4. Wait 60-90 seconds for multi-pass AI analysis:
   - Pass 1: Personality & Core Identity
   - Pass 2: Wellbeing & Support
   - Pass 3: Communication & Expectations
5. Click "View Report"

## Step 9: Browse Your Report

Navigate through all 15 pages using the Next/Previous buttons!

Pages include:
- Overview & Demographics
- Personality Dynamics
- Wellbeing Analysis
- Communication Styles
- Conflict Management
- Financial Compatibility
- And more...

## Dev Tools Reference

The **🛠️ DEV** button (bottom-right corner, localhost only) provides:

- **📝 Populate My Survey**: Loads 300 sample responses for current user
- **✅ Mark Survey Complete**: Updates completion status
- **🔄 Refresh Status**: Updates response counts
- **Status Display**: Shows your and your partner's progress

## Troubleshooting

### Cannot find module errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### API Key not configured
- Check your `.env` file exists in project root
- Verify the key starts with your actual Gemini API key
- Restart the server after changing `.env`

### Port already in use
```bash
# Kill process on port 5000 (Mac/Linux)
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=3000
```

### Supabase connection errors
- Verify your `SUPABASE_URL` and keys are correct
- Check that migrations ran successfully in SQL Editor
- Ensure your Supabase project is active (not paused)

### Authentication issues
- Clear browser cache and cookies
- Try incognito/private browsing mode
- Check browser console for specific error messages

### Survey data not saving
- Check browser console for errors
- Verify you're authenticated (not signed out)
- Try signing out and back in

### "Not authenticated" on protected pages
- You need to sign in first at `/auth.html`
- Check if your session expired
- Clear cookies and sign in again

## Advanced Setup

For detailed Supabase configuration, see [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

Topics covered:
- Row Level Security policies explained
- Email confirmation settings
- Google OAuth setup
- Database backup and migration
- Production deployment

## Need Help?

1. Check the [full README.md](README.md) for detailed documentation
2. Review [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for database issues
3. Check browser console for error messages
4. Verify all environment variables are set correctly

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Start server
npm start

# View package info
npm list

# Update dependencies
npm update
```

---

**🎉 You're all set!** Sign in, complete your survey, connect with your partner, and generate your personalized SYMBIS report.
