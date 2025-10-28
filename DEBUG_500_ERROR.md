# 🐛 Debugging 500 Error on Vercel

## Current Issue
Getting 500 Internal Server Error when clicking "Process Complete Video"

## Steps to Debug

### 1. Check Vercel Logs
Go to: https://vercel.com/dashboard

1. Select project: `pashto-bible-search`
2. Go to **Deployments** tab
3. Click on latest deployment
4. Click **Logs** tab
5. Look for errors mentioning:
   - AssemblyAI
   - Environment variables
   - "Missing Supabase environment variables"

### 2. Verify Environment Variables
Go to: Settings → Environment Variables

Check these are ALL there:
```
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY  
✅ SUPABASE_SERVICE_ROLE_KEY
✅ ASSEMBLYAI_API_KEY
✅ ELEVENLABS_API_KEY
```

### 3. Check Latest Deployment
1. Go to Deployments tab
2. Click on latest commit
3. Look for error messages in logs
4. Check if deployment succeeded

### 4. Common Issues

**Issue: Missing Environment Variable**
- Symptoms: 500 error immediately
- Fix: Add missing variable in Vercel dashboard

**Issue: Wrong API Key**
- Symptoms: Error from AssemblyAI
- Fix: Verify key is correct

**Issue: Vercel deployment failed**
- Symptoms: Old code still running
- Fix: Manually redeploy

### 5. Redeploy After Fix
After fixing variables:
1. Go to Deployments
2. Click "..." on latest
3. Click "Redeploy"

### 6. Alternative: Check Locally
Test locally to see if it works:
```bash
npm run dev
# Try processing video
# Check console for errors
```

## Quick Fix Checklist

- [ ] All 5 environment variables added to Vercel
- [ ] Latest deployment succeeded
- [ ] Checked Vercel logs for errors
- [ ] Redeployed after adding variables
- [ ] Cleared browser cache
- [ ] Tried in incognito mode

## Next Steps

Once you check Vercel logs, let me know what error you see and I'll fix it!
