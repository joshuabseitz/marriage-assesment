# 🚀 TROUBLESHOOTING GUIDE

## Quick Start (Try This First)

```bash
# 1. Make sure you're in the right directory
cd /Users/joshuaseitz/Downloads/marriage2

# 2. Stop any running servers
# Press Ctrl+C in any terminal with a server running

# 3. Check if port 5000 is in use
lsof -ti:5000

# 4. If something is there, kill it
lsof -ti:5000 | xargs kill -9

# 5. Start the server
npm start
```

## Test the Server

After starting, open these URLs **in order**:

### 1. Test Endpoint (Simplest)
```
http://127.0.0.1:5000/api/test
```
**Should show:** Green "Server is Working!" page

### 2. Health Check
```
http://127.0.0.1:5000/api/health
```
**Should show:** JSON with status "healthy"

### 3. Survey
```
http://127.0.0.1:5000/survey.html
```
**Should show:** The survey form

## What To Look For

### In Terminal
After visiting ANY URL, you should see logs like:
```
[2024-12-27T...] GET /api/test
  Origin: direct
  User-Agent: Mozilla/5.0...
  ✅ Test endpoint accessed
```

### If You See NOTHING
Your browser is NOT connecting to our server. Possible reasons:

1. **Another process owns port 5000**
   ```bash
   lsof -i :5000
   ```
   
2. **Browser cached the old server**
   - Hard refresh: Cmd+Shift+R
   - Or use Incognito mode
   
3. **Firewall blocking**
   - Check System Preferences > Security & Privacy

## Still Getting 403?

Try a different port:
```bash
PORT=3000 npm start
```

Then visit:
```
http://127.0.0.1:3000/api/test
```

## Check Your .env File

```bash
# Should show your API key
cat .env

# If empty, add it:
echo "GEMINI_API_KEY=your_key_here" > .env
```

## Nuclear Option

If nothing works:
```bash
# Kill EVERYTHING on port 5000
lsof -ti:5000 | xargs kill -9

# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install

# Try port 8080 instead
PORT=8080 npm start
```

Then visit `http://127.0.0.1:8080/api/test`

## Get Help

When asking for help, provide:
1. Terminal output from `npm start`
2. Terminal output when you visit a URL (should show request logs)
3. Browser error message
4. Output of `lsof -i :5000`

