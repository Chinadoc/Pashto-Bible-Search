# Cloudflare D1 + R2 Integration Summary

## ✅ What Was Implemented

### 1. **New API Routes**
- **`/api/d1-verses`** - Fetch verses from Cloudflare D1 database
  - `GET /api/d1-verses?book={book}&chapter={chapter}&translation={translation}`
  - `POST /api/d1-verses/search` - Search verses by text query

- **`/api/d1-audio`** - Resolve audio URLs from R2 storage
  - `GET /api/d1-audio?ref={verseRef}&translation={translation}`
  - `POST /api/d1-audio/batch` - Batch resolve multiple audio URLs

### 2. **Updated Existing Routes with D1/R2 Support**
- **`/api/chapter`** - Now tries D1 first, falls back to Supabase
- **`/api/audio_url`** - Now tries D1/R2 first, falls back to Google Drive/Supabase

### 3. **Enhanced Cloudflare D1 Client**
- Updated `app/lib/cloudflare-d1.ts` with:
  - Graceful fallback when Worker is unavailable
  - Better error handling
  - Support for both `verses_afghan2023` and `verses_yousafzai` tables

### 4. **Fixed Cloudflare Worker API**
- Updated `cloudflare/worker-api.ts` to use correct table name `verses_afghan2023` instead of `verses`

## 🔄 How It Works

### Automatic Fallback Strategy

1. **Verse Fetching**:
   ```
   Try D1 → If unavailable/empty → Fallback to Supabase
   ```

2. **Audio Resolution**:
   ```
   Try D1/R2 → If unavailable → Fallback to Google Drive/Supabase
   ```

### Environment Variable

Add to Vercel environment variables:
```bash
NEXT_PUBLIC_CLOUDFLARE_WORKER_URL=https://your-worker.workers.dev
```

**If not set**: Application automatically uses Supabase/Google Drive only (no code changes needed)

## 📊 Database Schema

### D1 Tables Required

**`verses_afghan2023`**:
- `book` (TEXT)
- `chapter` (INTEGER)
- `verse` (INTEGER)
- `text` (TEXT)
- `testament` (TEXT)
- `audio_r2_key` (TEXT) - **R2 object key for audio file**
- `audio_public_url` (TEXT, nullable) - Fallback URL
- `translation_key` (TEXT)
- `dialect` (TEXT)

**`verses_yousafzai`**: Same structure

### R2 Storage Structure

Audio files should be stored with keys matching `audio_r2_key`:
```
afghan2023/nt/matthew1_verse_001.mp3
afghan2023/nt/matthew1_verse_002.mp3
...
```

## 🚀 Deployment Steps

1. **Deploy Cloudflare Worker**:
   ```bash
   npx wrangler deploy cloudflare-worker.js
   ```

2. **Configure Worker Bindings** in `wrangler.toml`:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "pashto-bible-db"
   database_id = "your-database-id"

   [[r2_buckets]]
   binding = "AUDIO_BUCKET"
   bucket_name = "your-audio-bucket-name"
   ```

3. **Set Environment Variable in Vercel**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_CLOUDFLARE_WORKER_URL` = `https://your-worker.workers.dev`

4. **Redeploy Application**:
   ```bash
   git push origin main
   # Vercel will automatically redeploy
   ```

## 🧪 Testing

### Test D1 Verse Fetching
```bash
curl "https://your-site.vercel.app/api/d1-verses?book=Matthew&chapter=1&translation=afghan2023"
```

### Test D1 Audio Resolution
```bash
curl "https://your-site.vercel.app/api/d1-audio?ref=Matthew%201:1&translation=afghan2023"
```

### Test Chapter Route (with fallback)
```bash
curl "https://your-site.vercel.app/api/chapter?book=Matthew&chapter=1&translation=afghan2023"
```

## 📝 Frontend Compatibility

**No frontend changes needed!** The existing frontend components already use:
- `/api/chapter` - Now automatically uses D1 with fallback
- `/api/audio_url` - Now automatically uses R2 with fallback

The components will seamlessly transition to D1/R2 when:
1. `NEXT_PUBLIC_CLOUDFLARE_WORKER_URL` is set
2. D1 database contains the verses
3. R2 bucket contains the audio files

## 🔍 Monitoring

Check Vercel function logs to see:
- Whether D1 or Supabase is being used
- Audio resolution source (D1/R2 vs Google Drive/Supabase)
- Any errors or fallbacks

## 🛡️ Rollback Plan

To rollback to Supabase/Google Drive only:
1. Remove `NEXT_PUBLIC_CLOUDFLARE_WORKER_URL` from Vercel environment variables
2. Redeploy (or wait for next deployment)
3. Application automatically uses Supabase/Google Drive

**No code changes needed for rollback!**

## 📚 Additional Resources

- [Migration Guide](./MIGRATION_GUIDE.md) - Detailed migration steps
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)







