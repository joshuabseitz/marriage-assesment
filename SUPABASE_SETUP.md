# Supabase Setup Guide

This guide will help you set up Supabase for the SYMBIS application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- The SYMBIS project cloned locally

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the project details:
   - **Name**: SYMBIS (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free tier is sufficient for development
4. Click "Create new project"
5. Wait for the project to be provisioned (takes 1-2 minutes)

## Step 2: Get Your API Credentials

Once your project is ready:

1. Go to **Project Settings** (gear icon in sidebar)
2. Click on **API** in the left menu
3. You'll need two values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJI...` (long JWT token)
   - **service_role key**: `eyJhbGciOiJI...` (different JWT token)

4. Copy these values - you'll add them to your `.env` file

## Step 3: Configure Environment Variables

1. In your project root, open (or create) `.env`:

```bash
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash

# Server Configuration
PORT=5000

# Supabase Configuration
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJI...
SUPABASE_SERVICE_KEY=eyJhbGciOiJI...
```

2. Replace the placeholders with your actual values
3. **IMPORTANT**: Never commit the `.env` file to version control!

## Step 4: Set Up the Database Schema

### Option A: Using the SQL Editor (Recommended)

1. In your Supabase dashboard, click on **SQL Editor** in the sidebar
2. Click **New query**
3. Copy the contents of `migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Wait for "Success" message

7. Create a new query for the RLS policies:
8. Copy the contents of `migrations/002_rls_policies.sql`
9. Paste and click **Run**
10. Confirm "Success"

### Option B: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

## Step 5: Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. **Email** should be enabled by default
3. Configure email settings:
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation and password reset emails if desired

### Optional: Enable Google OAuth

1. Go to **Authentication** → **Providers**
2. Click on **Google**
3. Follow the instructions to set up Google OAuth
4. Add your OAuth credentials

## Step 6: Verify Database Setup

1. Go to **Table Editor** in the Supabase dashboard
2. You should see these tables:
   - `user_profiles`
   - `responses`
   - `partnerships`
   - `reports`

3. Click on each table to verify the columns are correct

## Step 7: Test RLS Policies

1. Go to **Authentication** → **Policies** in the sidebar
2. Verify that policies are created for each table:
   - `user_profiles`: 3-4 policies
   - `responses`: 4-5 policies
   - `partnerships`: 3-4 policies
   - `reports`: 2-3 policies

## Step 8: Configure Supabase Client for Browser

The app uses a configuration pattern for easy development. You have two options:

### Option A: Environment Variable Substitution (Production)

For production builds, you'll want to use a build tool that substitutes environment variables. The `lib/supabase-client.js` file has placeholders that can be replaced.

### Option B: Global Configuration (Development)

For local development, you can create a `supabase-config.js` file that sets global config:

```javascript
// supabase-config.js
window.SUPABASE_CONFIG = {
  url: 'https://xxxxxxxxxxxxx.supabase.co',
  anonKey: 'eyJhbGciOiJI...'
};
```

Then include it in your HTML files before other scripts:

```html
<script src="supabase-config.js"></script>
<script type="module" src="lib/supabase-client.js"></script>
```

## Step 9: Install Dependencies

```bash
npm install
```

This will install:
- `@supabase/supabase-js` - Supabase client library
- `express`, `cors`, `dotenv` - Server dependencies
- `@google/genai` - Gemini API client

## Step 10: Start the Server

```bash
npm start
```

The server should start on `http://127.0.0.1:5000`

## Step 11: Test the Application

1. Open `http://127.0.0.1:5000/auth.html` in your browser
2. Create a new account (Sign Up)
3. Check your email for the confirmation link (if email is configured)
4. Sign in
5. You should be redirected to the survey page

## Troubleshooting

### "Not authenticated" errors

- Clear browser cache and cookies
- Check browser console for errors
- Verify your Supabase URL and anon key are correct in the config

### Database connection issues

- Verify your project is active in Supabase dashboard
- Check that your IP isn't blocked (Supabase has no IP restrictions by default)
- Ensure RLS policies are enabled and correctly configured

### Email confirmation not working

- Go to **Authentication** → **Settings** in Supabase
- For development, you can disable email confirmation:
  - Set "Enable email confirmations" to OFF
  - Users can sign in immediately after signup

### CORS errors

- The Express server is configured to allow all origins
- If you still get CORS errors, check that you're accessing everything from the same port (5000)

### RLS Policy errors

- If you get "permission denied" errors, check your RLS policies
- Make sure you ran BOTH migration files (schema + policies)
- Verify policies in the Supabase dashboard under Authentication → Policies

## Next Steps

- Review the [README.md](README.md) for general application information
- Check [SETUP.md](SETUP.md) for quick start instructions
- Explore the [MULTI-PASS-IMPLEMENTATION.md](MULTI-PASS-IMPLEMENTATION.md) for AI generation details
- Read [NAVIGATION-UX-IMPLEMENTATION.md](NAVIGATION-UX-IMPLEMENTATION.md) for UX patterns

## Security Best Practices

1. **Never commit `.env` file** - It's in `.gitignore` for a reason
2. **Use RLS policies** - All data access should go through RLS
3. **Validate input** - Always validate user input on both client and server
4. **Use HTTPS in production** - Never use HTTP for production deployments
5. **Rotate keys regularly** - Change your Supabase keys periodically
6. **Monitor usage** - Keep an eye on your Supabase dashboard for unusual activity

## Support

For issues specific to Supabase:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)

For issues with this application:
- Check the GitHub repository issues
- Review the console logs for error messages


