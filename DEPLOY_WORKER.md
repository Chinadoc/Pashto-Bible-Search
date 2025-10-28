# 🚀 Quick Start: Deploy Cloudflare Worker

## What You Need to Do Right Now

**Your Cloudflare worker "pashtobiblesearch" has failed to build.** Here's how to fix it:

### Step 1: Deploy the Worker (2 minutes)

1. Go to https://dash.cloudflare.com
2. Click **"Workers & Pages"**
3. Click on your **"pashtobiblesearch"** worker
4. Copy the entire contents of `cloudflare-worker.js` from this repo
5. Paste it into the Cloudflare editor
6. Click **"Save and deploy"**
7. Wait for green "Success" message ✅

### Step 2: Verify It Works

Test your worker with this command (replace `YOUR_FILE_ID` with an actual Google Drive file ID):

```bash
curl "https://pashtobiblesearch.jeremy-samuels17.workers.dev?id=YOUR_FILE_ID" -I
```

You should see:
- Status: `200 OK` or `206 Partial Content`
- Headers including `Content-Type: audio/mpeg`
- Headers including `Access-Control-Allow-Origin: *`

### Step 3: Deploy Your Next.js App

The AudioPlayer component is already configured to use your Cloudflare worker:

```typescript
const CLOUDFLARE_WORKER_URL = 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';
```

Just commit and push to Vercel:

```bash
git add .
git commit -m "fix: Update Cloudflare worker for inline audio playback"
git push
```

### Step 4: Test Audio Playback

1. Open your deployed site
2. Search for any verse
3. Click **"▶ Play Audio"**
4. Audio should play inline! 🎵

---

## What Changed

✅ **cloudflare-worker.js** - Updated for proper audio streaming with Range request support
✅ **components/AudioPlayer.tsx** - Configured to use Cloudflare worker URL
✅ **wrangler.toml** - Added for CLI deployment (optional)
✅ **CLOUDFLARE_SETUP.md** - Complete deployment guide

---

## Troubleshooting

**If deployment fails:**
- Check that you copied the entire `cloudflare-worker.js` file
- Ensure the export format is correct (using `export default`)
- Try pasting line by line to catch any syntax errors

**If audio doesn't play:**
- Check browser console for errors
- Verify worker URL is correct in AudioPlayer.tsx
- Make sure Google Drive files are publicly accessible
- Test worker directly with curl first

---

**Need help?** See CLOUDFLARE_SETUP.md for detailed instructions.

