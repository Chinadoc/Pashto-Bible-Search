# Migration Guide: Supabase + Google Drive → Cloudflare D1 + R2

This guide explains how to migrate your Pashto Bible Search application from Supabase + Google Drive to Cloudflare D1 + R2.

## Overview

The migration has been implemented with **automatic fallback** - the application will:
1. **Try D1/R2 first** if Cloudflare Worker URL is configured
2. **Fallback to Supabase/Google Drive** if D1 is unavailable or returns no results

This ensures zero downtime during migration.

## Prerequisites

1. **Cloudflare D1 Database** - Already set up with `verses_afghan2023` and `verses_yousafzai` tables
2. **Cloudflare R2 Bucket** - Contains audio files with keys matching `audio_r2_key` in D1
3. **Cloudflare Worker** - Deployed with the API routes from `cloudflare/worker-api.ts`

## Step 1: Configure Environment Variables

Add the following to your Vercel environment variables (or `.env.local` for local development):

```bash
NEXT_PUBLIC_CLOUDFLARE_WORKER_URL=https://your-worker.workers.dev
```

**Note:** Replace `your-worker.workers.dev` with your actual Cloudflare Worker URL.

## Step 2: Deploy Cloudflare Worker

The Cloudflare Worker provides the API endpoints for D1 database queries and R2 audio streaming.

1. Ensure `cloudflare/worker-api.ts` is complete and implements all endpoints
2. Deploy to Cloudflare Workers:
   ```bash
   npx wrangler deploy cloudflare-worker.js
   ```

3. Configure Worker bindings in `wrangler.toml`:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "pashto-bible-db"
   database_id = "your-database-id"

   [[r2_buckets]]
   binding = "AUDIO_BUCKET"
   bucket_name = "your-audio-bucket-name"
   ```

## Step 3: Verify D1 Database Schema

Ensure your D1 database has the correct schema:

- `verses_afghan2023` table with columns:
  - `audio_r2_key` (TEXT) - R2 object key for audio file
  - `audio_public_url` (TEXT, nullable) - Fallback public URL
  - Other verse columns (book, chapter, verse, text, etc.)

- `verses_yousafzai` table with same structure

## Step 4: Test the Migration

### Test D1 Verse Fetching

```bash
curl "https://your-site.vercel.app/api/d1-verses?book=Matthew&chapter=1&translation=afghan2023"
```

Expected response:
```json
{
  "book": "Matthew",
  "chapter": 1,
  "translation": "afghan2023",
  "verses": [...],
  "totalVerses": 25
}
```

### Test D1 Audio Resolution

```bash
curl "https://your-site.vercel.app/api/d1-audio?ref=Matthew%201:1&translation=afghan2023"
```

Expected response:
```json
{
  "ref": "Matthew 1:1",
  "url": "https://your-worker.workers.dev/api/audio/stream/afghan2023/nt/matthew1_verse_001.mp3",
  "translation": "afghan2023",
  "source": "d1-r2",
  "r2_key": "afghan2023/nt/matthew1_verse_001.mp3"
}
```

## Step 5: Monitor and Verify

1. **Check Logs**: Monitor Vercel function logs to see D1 vs Supabase usage
2. **Verify Audio**: Test audio playback in the frontend
3. **Check Performance**: Compare response times between D1 and Supabase

## API Routes Updated

### New Routes (D1/R2)

- `GET /api/d1-verses` - Fetch verses from D1
- `POST /api/d1-verses/search` - Search verses in D1
- `GET /api/d1-audio` - Resolve audio URLs from R2
- `POST /api/d1-audio/batch` - Batch resolve audio URLs

### Updated Routes (With Fallback)

- `GET /api/chapter` - Now tries D1 first, falls back to Supabase
- `GET /api/audio_url` - Now tries D1/R2 first, falls back to audio map

## Migration Status

The migration is **incremental** and **non-breaking**:

- ✅ D1/R2 routes created
- ✅ Chapter route updated with D1 fallback
- ✅ Audio URL route updated with D1/R2 fallback
- ⏳ Search route can be updated to use D1 (optional)
- ⏳ Frontend components automatically use new audio URLs

## Rollback Plan

If you need to rollback:

1. Remove `NEXT_PUBLIC_CLOUDFLARE_WORKER_URL` environment variable
2. Application will automatically use Supabase/Google Drive only
3. No code changes needed

## Next Steps

1. **Deploy Worker**: Ensure Cloudflare Worker is deployed and accessible
2. **Set Environment Variable**: Add `NEXT_PUBLIC_CLOUDFLARE_WORKER_URL` to Vercel
3. **Test Thoroughly**: Verify all features work with D1/R2
4. **Monitor**: Watch for any errors or performance issues
5. **Gradual Migration**: The fallback ensures smooth transition

## Troubleshooting

### D1 Queries Return Empty

- Check Cloudflare Worker logs
- Verify D1 database has data
- Check table names match (`verses_afghan2023` vs `verses`)

### Audio Not Playing

- Verify R2 bucket is configured correctly
- Check `audio_r2_key` values in D1 match R2 object keys
- Test R2 streaming endpoint directly

### Worker Not Responding

- Verify Worker is deployed
- Check Worker bindings (D1 database, R2 bucket)
- Test Worker endpoints directly

## Support

For issues or questions, check:
- Cloudflare D1 Documentation: https://developers.cloudflare.com/d1/
- Cloudflare R2 Documentation: https://developers.cloudflare.com/r2/
- Cloudflare Workers Documentation: https://developers.cloudflare.com/workers/



