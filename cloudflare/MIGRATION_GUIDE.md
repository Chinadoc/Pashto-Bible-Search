# Cloudflare D1 + R2 Migration Guide

This guide walks you through migrating your Pashto Bible Search application from Supabase to Cloudflare D1 (database) + R2 (audio storage).

## Overview

- **D1**: Cloudflare's serverless SQLite database (replaces Supabase Postgres)
- **R2**: Cloudflare's object storage (replaces Supabase Storage/Google Drive)
- **Workers**: Edge functions that handle API requests (can be deployed alongside Vercel)

## Prerequisites

1. Cloudflare account: https://dash.cloudflare.com
2. Wrangler CLI: `npm install -g wrangler` or `npx wrangler`
3. Access to your Supabase project (for data export)

## Step 1: Create Cloudflare Resources

### 1.1 Create D1 Database

```bash
# Login to Cloudflare
npx wrangler login

# Create D1 database
npx wrangler d1 create pashto-bible-db

# Copy the database_id from the output and add it to wrangler.toml
```

Update `wrangler.toml` with the database_id:

```toml
[[d1_databases]]
binding = "DB"
database_name = "pashto-bible-db"
database_id = "YOUR_DATABASE_ID_HERE"
```

### 1.2 Create R2 Bucket

```bash
# Create R2 bucket
npx wrangler r2 bucket create pashto-bible-audio
```

The bucket name is already configured in `wrangler.toml`.

### 1.3 Get R2 API Credentials

1. Go to https://dash.cloudflare.com → R2 → Manage R2 API Tokens
2. Create API token with read/write permissions
3. Save:
   - Account ID
   - Access Key ID
   - Secret Access Key

Set environment variables:

```bash
export CLOUDFLARE_ACCOUNT_ID="your_account_id"
export CLOUDFLARE_R2_ACCESS_KEY_ID="your_access_key"
export CLOUDFLARE_R2_SECRET_ACCESS_KEY="your_secret_key"
```

## Step 2: Initialize D1 Database Schema

```bash
# Apply schema to D1
npx wrangler d1 execute pashto-bible-db --file=cloudflare/d1-schema.sql
```

Verify schema:

```bash
npx wrangler d1 execute pashto-bible-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

## Step 3: Migrate Data from Supabase

### 3.1 Export Data to D1

```bash
# Set Supabase credentials
export NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Run migration script
npx tsx cloudflare/migrate-supabase-to-d1.ts

# This generates cloudflare/d1-migration-data.sql
# Execute it:
npx wrangler d1 execute pashto-bible-db --file=cloudflare/d1-migration-data.sql
```

Or set `EXECUTE_NOW=true` to execute automatically:

```bash
EXECUTE_NOW=true npx tsx cloudflare/migrate-supabase-to-d1.ts
```

### 3.2 Migrate Audio Files to R2

```bash
# Set R2 credentials (from Step 1.3)
export CLOUDFLARE_ACCOUNT_ID="your_account_id"
export CLOUDFLARE_R2_ACCESS_KEY_ID="your_access_key"
export CLOUDFLARE_R2_SECRET_ACCESS_KEY="your_secret_key"

# Run audio migration
npx tsx cloudflare/migrate-audio-to-r2.ts
```

This script:
- Lists all audio files from Supabase Storage
- Downloads each file
- Uploads to R2 bucket
- Skips files that already exist

## Step 4: Deploy Cloudflare Worker

### 4.1 Update Worker Code

The worker API is in `cloudflare/worker-api.ts`. Update `cloudflare-worker.js` or create a new entry point:

```javascript
// cloudflare-worker.js (or update existing)
import worker from './cloudflare/worker-api.ts';

export default worker;
```

### 4.2 Deploy Worker

```bash
npx wrangler deploy
```

Your worker will be available at: `https://pashtobiblesearch.YOUR_SUBDOMAIN.workers.dev`

### 4.3 Configure Custom Domain (Optional)

For production, set up a custom domain:

1. In Cloudflare dashboard → Workers → pashtobiblesearch → Settings → Routes
2. Add custom domain: `api.yourdomain.com`

## Step 5: Update Frontend Code

### 5.1 Environment Variables

Add to `.env.local`:

```bash
NEXT_PUBLIC_CLOUDFLARE_WORKER_URL=https://pashtobiblesearch.YOUR_SUBDOMAIN.workers.dev
```

### 5.2 Update API Routes

Replace Supabase queries with Cloudflare D1 queries:

**Before (Supabase):**
```typescript
import { supabase } from '@/utils/supabase';

const { data } = await supabase
  .from('verses')
  .select('*')
  .ilike('text', `%${query}%`);
```

**After (Cloudflare D1):**
```typescript
import { searchVerses } from '@/app/lib/cloudflare-d1';

const verses = await searchVerses(query, {
  translation: 'afghan2023',
  limit: 100,
});
```

### 5.3 Update Audio URL Resolution

**Before:**
```typescript
import { resolveAudioUrl } from '@/app/lib/audio';

const audioUrl = await resolveAudioUrl(ref, entry);
```

**After:**
```typescript
import { resolveAudioUrlFromVerse } from '@/app/lib/cloudflare-d1';

const audioUrl = await resolveAudioUrlFromVerse(verse);
```

### 5.4 Update Search Route

Edit `app/api/search/route.ts` to use Cloudflare D1:

```typescript
import { searchVerses } from '@/app/lib/cloudflare-d1';

// Replace supabaseSearch with:
const verses = await searchVerses(query, {
  translation: translation || 'afghan2023',
  testament: scope === 'ot' ? 'OT' : scope === 'nt' ? 'NT' : undefined,
  limit: limit || 100,
});
```

## Step 6: Make R2 Bucket Public (Optional)

For direct public access (no Worker proxy needed):

1. Go to Cloudflare Dashboard → R2 → pashto-bible-audio → Settings
2. Enable "Public Access"
3. Note the public URL format: `https://pub-{account_id}.r2.dev/{key}`

Or keep it private and use Worker endpoints (recommended for better control).

## Step 7: Testing

### 7.1 Test Database Queries

```bash
# Query D1 directly
npx wrangler d1 execute pashto-bible-db --command="SELECT COUNT(*) FROM verses;"

# Test via Worker API
curl "https://pashtobiblesearch.YOUR_SUBDOMAIN.workers.dev/api/search?q=خدا&translation=afghan2023"
```

### 7.2 Test Audio Access

```bash
# Get audio URL
curl "https://pashtobiblesearch.YOUR_SUBDOMAIN.workers.dev/api/audio/url/matthew1_verse_1.mp3"

# Stream audio (test in browser)
# https://pashtobiblesearch.YOUR_SUBDOMAIN.workers.dev/api/audio/stream/matthew1_verse_1.mp3
```

## Step 8: Performance Optimization

### 8.1 Enable Caching

The Worker already includes cache headers. For better performance:

1. Enable Cloudflare CDN caching
2. Use R2 public URLs for static audio (if bucket is public)
3. Consider edge caching for frequent queries

### 8.2 Database Indexes

Indexes are already defined in `d1-schema.sql`. To add more:

```bash
npx wrangler d1 execute pashto-bible-db --command="CREATE INDEX idx_custom ON verses(column_name);"
```

## Cost Comparison

### Supabase (Current)
- Database: ~$25/month (Postgres)
- Storage: ~$10/month (1GB audio)
- Bandwidth: Variable

### Cloudflare D1 + R2 (Migrated)
- D1: **Free tier** (5M reads/day, 25M rows stored)
- R2: **$0.015/GB/month** (no egress fees!)
- Workers: **Free tier** (100K requests/day)

**Estimated monthly cost**: $1-5 (for your use case)

## Troubleshooting

### Database Connection Issues

```bash
# Check database exists
npx wrangler d1 list

# Test connection
npx wrangler d1 execute pashto-bible-db --command="SELECT 1;"
```

### Worker Deployment Issues

```bash
# Check worker logs
npx wrangler tail

# Test locally
npx wrangler dev
```

### R2 Upload Issues

- Verify API credentials
- Check bucket name matches `wrangler.toml`
- Ensure bucket exists: `npx wrangler r2 bucket list`

## Rollback Plan

If migration fails:

1. Keep Supabase running during migration
2. Use feature flags to switch between Supabase and Cloudflare
3. Revert by removing `NEXT_PUBLIC_CLOUDFLARE_WORKER_URL`

## Next Steps

1. ✅ Complete migration
2. ✅ Update all API routes
3. ✅ Test thoroughly
4. ✅ Monitor Cloudflare dashboard for usage
5. ✅ Update documentation
6. ✅ Consider migrating other data (dictionary, frequencies, etc.)

## Resources

- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)



