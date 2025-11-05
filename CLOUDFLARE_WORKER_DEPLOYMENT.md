# Cloudflare Worker Deployment Guide for D1/R2 API

## Current Status

**Problem Identified:**
- ✅ Verses exist in D1 (`verses_afghan2023` table has 18,851 rows)
- ❌ Cloudflare Worker is still running old Google Drive proxy code
- ❌ Vercel environment variable set to placeholder `"https://your-worker.workers.dev"`

## Steps to Fix

### 1. Update `wrangler.toml`

The `wrangler.toml` file has been updated to point to the D1/R2 API worker:
- Changed `main = "cloudflare-worker.js"` → `main = "cloudflare/worker-api.ts"`
- Added D1 database binding
- Added R2 bucket binding

**⚠️ IMPORTANT:** You need to update the `database_id` in `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "pashto-bible-db"
database_id = "YOUR_D1_DATABASE_ID"  # ← Replace with your actual D1 database ID
```

To find your D1 database ID:
1. Go to Cloudflare Dashboard → D1
2. Click on your database (`pashto-bible-db`)
3. Copy the Database ID from the overview page

### 2. Deploy the Worker

```bash
# Install Wrangler CLI if not already installed
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy the worker
wrangler deploy
```

After deployment, your worker will be available at:
`https://pashtobiblesearch.jeremy-samuels17.workers.dev` (or your subdomain)

### 3. Update Vercel Environment Variable

In your Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_CLOUDFLARE_WORKER_URL` to:
   ```
   https://pashtobiblesearch.jeremy-samuels17.workers.dev
   ```
   (or your actual worker URL)

3. Redeploy your Vercel application

### 4. Verify Deployment

Test the worker directly:
```bash
# Test chapter endpoint
curl "https://pashtobiblesearch.jeremy-samuels17.workers.dev/api/chapter?book=Proverbs&chapter=11&translation=afghan2023"

# Test verse endpoint
curl "https://pashtobiblesearch.jeremy-samuels17.workers.dev/api/verse?ref=Proverbs%2011:10&translation=afghan2023"
```

Test via Vercel diagnostic endpoint:
```bash
curl "https://pashto-bible-search.vercel.app/api/cloudflare-check?ref=Proverbs%2011:10"
```

## Expected Results

After deployment:
- ✅ Chapter route will fetch from D1 instead of Supabase
- ✅ Verses will have `audio_r2_key` populated
- ✅ Audio URLs will use R2 instead of Google Drive
- ✅ Diagnostic endpoint will show successful D1 connectivity

## Troubleshooting

If the worker deployment fails:
1. Check that D1 database ID is correct in `wrangler.toml`
2. Verify R2 bucket name matches (`pashto-bible-audio`)
3. Ensure bindings are configured in Cloudflare dashboard
4. Check worker logs: `wrangler tail`

If Vercel still shows fallback to Supabase:
1. Verify `NEXT_PUBLIC_CLOUDFLARE_WORKER_URL` is set correctly
2. Check Vercel build logs for environment variable loading
3. Test worker directly to ensure it's responding
4. Check browser console for fetch errors







