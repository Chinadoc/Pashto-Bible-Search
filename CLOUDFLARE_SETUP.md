# 🚀 Cloudflare Workers CORS Proxy Setup

## Overview

This setup uses Cloudflare Workers to proxy Google Drive audio files with proper CORS headers, enabling inline audio playback in your Next.js app.

**Benefits:**
- ✅ **Keeps files on Google Drive** - No migration needed
- ✅ **FREE** - 100K requests/day
- ✅ **Fast** - Cloudflare's global CDN
- ✅ **Works inline** - Proper CORS headers and Range request support
- ✅ **Professional** - Serverless, scalable solution

---

## Deployment Instructions

### Option 1: Deploy via Cloudflare Dashboard (Easiest)

1. **Go to Cloudflare Dashboard**
   - Navigate to https://dash.cloudflare.com
   - Click **"Workers & Pages"**

2. **Create/Edit Worker**
   - Find your existing `pashtobiblesearch` worker
   - Click on it to edit
   - OR click **"Create application"** → **"Create Worker"** if starting fresh

3. **Deploy the Code**
   - Copy the contents of `cloudflare-worker.js`
   - Paste into the editor
   - Click **"Save and deploy"**
   - Wait for deployment to complete

4. **Get Your Worker URL**
   - After deployment, your worker will be available at:
   ```
   https://pashtobiblesearch.jeremy-samuels17.workers.dev
   ```
   - The URL format is: `https://[WORKER_NAME].[YOUR_SUBDOMAIN].workers.dev`

5. **Update AudioPlayer**
   - The AudioPlayer component has already been updated to use this URL
   - If you need to change it, edit `components/AudioPlayer.tsx` line 39

6. **Test**
   - Deploy your Next.js app to Vercel
   - Click "Play Audio" on any verse
   - Audio should play inline! ✅

---

### Option 2: Deploy via Wrangler CLI (Advanced)

1. **Install Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Deploy Worker**
   ```bash
   wrangler deploy
   ```

4. **Verify Deployment**
   ```bash
   curl "https://pashtobiblesearch.jeremy-samuels17.workers.dev?id=YOUR_FILE_ID"
   ```

---

## How It Works

```
User Browser → Cloudflare Worker → Google Drive → Cloudflare Worker → User Browser
              (adds CORS headers)    (fetches audio)  (returns audio)
```

The Cloudflare Worker:
1. Receives requests with Google Drive file IDs
2. Fetches audio from Google Drive (no CORS restrictions server-to-server)
3. Adds proper CORS headers
4. Handles Range requests for audio seeking
5. Returns audio stream to browser
6. Browser plays audio inline ✅

---

## Configuration

**Current Setup:**
- Worker Name: `pashtobiblesearch`
- Worker URL: `https://pashtobiblesearch.jeremy-samuels17.workers.dev`
- Subdomain: `jeremy-samuels17.workers.dev`

**To change these:**
1. Edit `wrangler.toml` (for CLI deployment)
2. Update `components/AudioPlayer.tsx` line 39 with new URL

---

## Cost

**FREE Tier Includes:**
- 100,000 requests/day
- 10ms CPU time per request
- No credit card required

**If you exceed:**
- $0.15 per million requests
- Very unlikely you'll hit this with typical usage

---

## Troubleshooting

### Worker Fails to Deploy
- Check syntax in `cloudflare-worker.js`
- Ensure you're using the correct export format
- Try deploying via dashboard instead of CLI

### Audio Still Doesn't Play
- Check browser console for errors
- Verify the worker URL is correct
- Test the worker directly: `curl "https://pashtobiblesearch.jeremy-samuels17.workers.dev?id=TEST_FILE_ID"`
- Check that Google Drive file is publicly accessible

### CORS Errors
- The worker should handle CORS automatically
- If you see CORS errors, check the worker headers
- Ensure `Access-Control-Allow-Origin: *` is set

---

## Time Estimate

- Deploy worker: 2 minutes
- Update code: Already done ✅
- Testing: 3 minutes
- **Total: ~5 minutes** ⚡

---

## Success Criteria

✅ Worker deploys without errors
✅ Direct test with curl returns audio data
✅ Audio plays inline in browser
✅ Audio seeking (scrubbing) works
✅ No CORS errors in browser console

Ready to deploy! Just update the worker code in the Cloudflare dashboard.
