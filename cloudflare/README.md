# Cloudflare D1 + R2 Migration

Complete migration setup for moving Pashto Bible Search from Supabase to Cloudflare D1 (database) + R2 (audio storage).

## Files Overview

### Core Files

- **`d1-schema.sql`** - SQLite schema for D1 database (all tables)
- **`worker-api.ts`** - Cloudflare Worker API routes for database queries and audio streaming
- **`types.ts`** - TypeScript types matching D1 schema

### Migration Scripts

- **`migrate-supabase-to-d1.ts`** - Exports data from Supabase and generates SQL for D1 import
- **`migrate-audio-to-r2.ts`** - Migrates audio files from Supabase Storage to R2

### Frontend Integration

- **`../app/lib/cloudflare-d1.ts`** - Frontend client library for querying D1 via Worker API

### Documentation

- **`MIGRATION_GUIDE.md`** - Step-by-step migration instructions

## Quick Start

1. **Create Cloudflare resources:**
   ```bash
   npx wrangler d1 create pashto-bible-db
   npx wrangler r2 bucket create pashto-bible-audio
   ```

2. **Initialize schema:**
   ```bash
   npx wrangler d1 execute pashto-bible-db --file=cloudflare/d1-schema.sql
   ```

3. **Migrate data:**
   ```bash
   # Set environment variables
   export NEXT_PUBLIC_SUPABASE_URL="..."
   export SUPABASE_SERVICE_ROLE_KEY="..."
   
   # Export and import data
   npx tsx cloudflare/migrate-supabase-to-d1.ts
   npx wrangler d1 execute pashto-bible-db --file=cloudflare/d1-migration-data.sql
   ```

4. **Migrate audio:**
   ```bash
   # Set R2 credentials
   export CLOUDFLARE_ACCOUNT_ID="..."
   export CLOUDFLARE_R2_ACCESS_KEY_ID="..."
   export CLOUDFLARE_R2_SECRET_ACCESS_KEY="..."
   
   # Migrate audio files
   npx tsx cloudflare/migrate-audio-to-r2.ts
   ```

5. **Deploy worker:**
   ```bash
   npx wrangler deploy
   ```

See `MIGRATION_GUIDE.md` for detailed instructions.

## Architecture

```
┌─────────────┐
│   Frontend  │ (Next.js on Vercel)
│   (Vercel)  │
└──────┬──────┘
       │ HTTP API calls
       ▼
┌─────────────────────────┐
│  Cloudflare Worker API   │ (Edge Functions)
│  (worker-api.ts)        │
└──────┬───────────┬──────┘
       │           │
       ▼           ▼
   ┌──────┐    ┌──────┐
   │  D1  │    │  R2  │
   │  DB  │    │Audio │
   └──────┘    └──────┘
```

## API Endpoints

All endpoints are prefixed with `/api`:

- `GET /api/search?q={query}&translation={translation}&testament={testament}&limit={limit}` - Search verses
- `GET /api/chapter?book={book}&chapter={chapter}&translation={translation}` - Get verses by chapter
- `GET /api/verse?ref={ref}&translation={translation}` - Get verse by reference
- `GET /api/word-occurrences?word={word}&translation={translation}&limit={limit}` - Search word occurrences
- `GET /api/audio/url/{r2Key}` - Get audio URL
- `GET /api/audio/stream/{r2Key}` - Stream audio file (supports Range requests)

## Benefits

- **Cost**: ~$1-5/month vs ~$35/month (Supabase)
- **Performance**: Edge-native, low latency globally
- **No egress fees**: R2 has zero egress costs
- **Scalability**: Serverless, auto-scales
- **Simplicity**: Single provider, integrated ecosystem

## Notes

- D1 uses SQLite (not Postgres), so some Postgres-specific features are adapted
- JSONB columns in Postgres become TEXT columns with JSON strings in SQLite
- Full-text search uses SQLite FTS or LIKE patterns (not Postgres tsvector)
- Timestamps are Unix integers (not ISO strings)

## Support

For issues or questions:
1. Check `MIGRATION_GUIDE.md` troubleshooting section
2. Review Cloudflare dashboard logs
3. Test locally with `npx wrangler dev`



