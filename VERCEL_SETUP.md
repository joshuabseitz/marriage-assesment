# Vercel Deployment Environment Variables

## Required Environment Variables

Your application needs the following environment variables configured in Vercel:

### 1. **GEMINI_API_KEY** (REQUIRED)
- **Purpose**: Google Gemini API key for AI report generation
- **Where to get it**: https://aistudio.google.com/app/apikey
- **Format**: String (e.g., `AIzaSyD...`)
- **Critical**: Without this, report generation will fail

### 2. **SUPABASE_SERVICE_KEY** (REQUIRED)
- **Purpose**: Supabase service role key for server-side database operations
- **Where to get it**: Supabase Dashboard → Settings → API → service_role key
- **Format**: String starting with `eyJ...`
- **⚠️ WARNING**: This is a SECRET key with admin privileges - never expose it in client code!
- **Critical**: Required to fetch user profiles during report generation

### 3. **SUPABASE_URL** (Optional, has default)
- **Purpose**: Your Supabase project URL
- **Default**: `https://tobxdhqcdttgawqewpwl.supabase.co`
- **Format**: URL (e.g., `https://your-project.supabase.co`)
- **When to set**: Only if you change Supabase projects

### 4. **GEMINI_MODEL** (Optional, has default)
- **Purpose**: Specify which Gemini model to use
- **Default**: `gemini-2.0-flash`
- **Format**: String (e.g., `gemini-2.0-flash`, `gemini-pro`)
- **When to set**: Only if you want to use a different model

### 5. **PORT** (Managed by Vercel)
- **Purpose**: Server port
- **Default**: Vercel will set this automatically
- **You don't need to configure this**

## How to Add Environment Variables in Vercel

1. Go to your project in Vercel dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: Variable name (e.g., `GEMINI_API_KEY`)
   - **Value**: Your actual key/value
   - **Environments**: Select all (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** your project for changes to take effect

## Verification

After deployment, you can verify your setup by visiting:
- `https://your-app.vercel.app/api/health` - Should show `api_key_configured: true`
- `https://your-app.vercel.app/api/test` - Should show all keys configured

## Security Notes

✅ **Safe for client-side** (already in `config.js`):
- Supabase URL
- Supabase anon key

❌ **NEVER expose in client code**:
- `GEMINI_API_KEY` - Only use server-side
- `SUPABASE_SERVICE_KEY` - Only use server-side

## Troubleshooting

### Report generation fails
- Check that `GEMINI_API_KEY` is set correctly
- Check that `SUPABASE_SERVICE_KEY` is set correctly
- Verify your Gemini API key has quota available
- Check Vercel function logs for specific errors

### "API key not configured" error
- Make sure you redeployed after adding environment variables
- Check that the variable name is exactly `GEMINI_API_KEY` (case-sensitive)

### Supabase connection errors
- Verify `SUPABASE_SERVICE_KEY` is the service_role key, not the anon key
- Ensure the key hasn't expired or been revoked

