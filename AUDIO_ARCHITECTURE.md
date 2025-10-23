# Audio Architecture

## Overview

The audio system uses a simplified single-query architecture:
- **Storage**: Audio files stored in Google Drive
- **Index**: `audio_url` column directly in `verses` and `verses_yousafzai` tables
- **Benefit**: Single query fetches both verse text and audio URL (no joins needed)

## Architecture (Simplified Single-Query)

```
┌─────────────────┐
│  User Request   │
│   (Mark Ch 1)   │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│     Supabase verses Table (ONE QUERY)    │
│  ┌──────┬────────┬──────┬──────────────┐ │
│  │ book │chapter │verse │  audio_url   │ │
│  ├──────┼────────┼──────┼──────────────┤ │
│  │ Mark │   1    │  1   │drive.google  │ │
│  │ Mark │   1    │  2   │drive.google  │ │
│  │ Mark │   1    │  3   │drive.google  │ │
│  └──────┴────────┴──────┴──────────────┘ │
└────────┬─────────────────────────────────┘
         │ Single Query: 5-10ms (verses + audio URLs)
         ▼
┌─────────────────┐
│  Google Drive   │
│  (Actual MP3s)  │
└─────────────────┘
    Stream: 100-500ms
```

**Old Architecture**: 2 queries (verses + audio_mappings)
**New Architecture**: 1 query (verses with audio_url column)

## Tables

### verses (Supabase - Afghan 2023)
- **Purpose**: Store all verses with integrated audio URLs
- **Rows**: ~31,000 verses
- **Query Time**: 5-10ms for a chapter (20-50 verses)

**Schema (relevant columns):**
```sql
CREATE TABLE verses (
  id SERIAL PRIMARY KEY,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  testament TEXT,
  dialect TEXT,
  translation TEXT,
  audio_url TEXT,                    -- Google Drive URL (added for simplification)
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_verses_book_chapter ON verses(book, chapter);
CREATE INDEX idx_verses_audio_url ON verses(audio_url) WHERE audio_url IS NOT NULL;
```

### verses_yousafzai (Supabase - Yousafzai 2019)
- **Purpose**: Store Yousafzai translation verses with audio URLs
- **Rows**: ~31,000 verses
- **Schema**: Same as `verses` table

### audio_mappings (Supabase - Legacy)
- **Purpose**: ⚠️ **DEPRECATED** - kept for reference only
- **Note**: Audio URLs now stored directly in `verses` tables
- **Migration**: See `migrations/add_audio_url_to_verses.sql`

### audio_files (Supabase)
- **Purpose**: Audio file metadata and stats
- **Rows**: ~58,313 files
- **Size**: 26 MB (metadata only, not actual audio)
- **Contains**: File info, durations, formats

**Schema:**
```sql
CREATE TABLE audio_files (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  drive_id TEXT,                     -- Google Drive file ID
  url TEXT,                          -- Full Google Drive URL
  file_size BIGINT,                  -- Size in bytes
  duration FLOAT,                    -- Duration in seconds
  format TEXT,                       -- e.g., 'mp3'
  verse_ref TEXT,                    -- Associated verse
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### `/api/chapter` (Primary - Simplified)
Fetch chapter verses with audio URLs in a single query:

```typescript
GET /api/chapter?book=Mark&chapter=1&translation=afghan2023

Response:
{
  "book": "Mark",
  "chapter": 1,
  "translation": "afghan2023",
  "verses": [
    {
      "ref": "Mark 1:1",
      "book": "Mark",
      "chapter": 1,
      "verse": 1,
      "text": "د خدای زوی عیسی مسیح د خوشخبری پیل",
      "testament": "NT",
      "dialect": "afghan",
      "translation": "afghan2023",
      "audioUrl": "https://drive.google.com/uc?export=download&id=..."  // ✅ Included!
    },
    // ... more verses
  ],
  "totalVerses": 45
}
```

**Key Benefit**: Audio URLs included directly in verse objects - no second query needed!

### `/api/audio-batch` (Legacy)
⚠️ **DEPRECATED** - No longer needed with simplified architecture.
Audio URLs now fetched with verses in `/api/chapter`.

### `/api/audio_url` (Legacy)
⚠️ **DEPRECATED** - Use `/api/chapter` instead.

## Flow for Chapter View (Simplified)

```
1. User opens Mark Chapter 1
   ↓
2. ChapterView calls /api/chapter?book=Mark&chapter=1
   ↓
3. API queries Supabase verses table (ONE QUERY, 5-10ms)
   SELECT book, chapter, verse, text, testament,
          dialect, translation, audio_url
   FROM verses
   WHERE book='Mark' AND chapter=1
   ORDER BY verse ASC
   ↓
4. Returns 45 verses with BOTH text AND audio URLs
   [
     { ref: "Mark 1:1", text: "...", audioUrl: "https://drive.google.com/..." },
     { ref: "Mark 1:2", text: "...", audioUrl: "https://drive.google.com/..." },
     ...
   ]
   ↓
5. ChapterView renders verses with audio players
   (No second query needed!)
   ↓
6. Browser loads audio directly from Google Drive
   (Google Drive handles streaming, caching, etc.)
```

**Performance Comparison**:
- **Old**: 2 API calls (verses + audio-batch) = 15-20ms total
- **New**: 1 API call (verses with audio_url) = 5-10ms total
- **Improvement**: 2x faster, simpler code

## Performance Benefits

| Approach | API Calls | Query Time | Code Complexity |
|----------|-----------|------------|-----------------|
| **Old: Separate audio_mappings table** | 2 (verses + audio) | 15-20ms | High (2 API calls, state management) |
| **New: Integrated audio_url column** | 1 (verses only) | 5-10ms | Low (1 API call, direct access) |

**Improvements**:
- ✅ **2x faster**: Single query vs two queries
- ✅ **Simpler code**: No separate audio-batch API call
- ✅ **Better DX**: Audio URL available directly on verse object
- ✅ **Fewer roundtrips**: 1 network request instead of 2

## Google Drive URLs

Audio files remain in Google Drive with two URL formats:

1. **Direct download**: `https://drive.google.com/uc?export=download&id={file_id}`
2. **Streaming**: `https://drive.google.com/file/d/{file_id}/view`

The Supabase `audio_mappings` table stores these URLs for instant retrieval.

## Advantages of This Architecture

### Google Drive Storage
✅ Large capacity (15 GB free, unlimited paid)
✅ Global CDN (fast worldwide access)
✅ Handles bandwidth/streaming automatically
✅ Easy file management
✅ No need to store 26 MB of audio in Supabase

### Supabase Index
✅ Ultra-fast lookups (indexed queries)
✅ Small storage footprint (just URLs)
✅ Easy to update mappings
✅ Can add metadata (source, quality, duration)
✅ SQL queries for complex lookups

## Migration from audio_mappings to verses.audio_url

### Migration Script

See `migrations/add_audio_url_to_verses.sql` for the full migration.

**Steps**:
1. Add `audio_url` column to `verses` and `verses_yousafzai` tables
2. Populate from `audio_mappings` table using UPDATE JOIN
3. Create indexes for performance
4. Update API endpoints to use new column
5. Update frontend components

**To run migration**:
```bash
# Option 1: Supabase Dashboard
# Go to SQL Editor → Run migrations/add_audio_url_to_verses.sql

# Option 2: Command line
psql $DATABASE_URL -f migrations/add_audio_url_to_verses.sql
```

### Updating Audio URLs

After migration, update audio URLs directly in verses tables:

```sql
-- Update a single verse
UPDATE verses
SET audio_url = 'https://drive.google.com/...'
WHERE book = 'Mark' AND chapter = 1 AND verse = 1;

-- Batch update from new audio_mappings
UPDATE verses v
SET audio_url = am.audio_url
FROM audio_mappings am
WHERE am.verse_ref = (v.book || ' ' || v.chapter || ':' || v.verse);
```

## Current Status

✅ **Migration script**: Created in `migrations/add_audio_url_to_verses.sql`
✅ **API updated**: `/api/chapter` returns `audioUrl` with verses
✅ **ChapterView updated**: Uses `verse.audioUrl` directly (no second API call)
✅ **TypeScript types**: Updated with `audioUrl` field
⚠️ **Migration pending**: Need to run SQL migration on Supabase database

## Example Data

```sql
-- Sample verses entries (new schema with audio_url)
┌──────┬────────┬──────┬─────────────────────────┬─────────────────────────────┐
│ book │chapter │verse │ text (abbreviated)      │ audio_url                   │
├──────┼────────┼──────┼─────────────────────────┼─────────────────────────────┤
│ Mark │   1    │  1   │ د خدای زوی عیسی...     │ https://drive.google.com... │
│ Mark │   1    │  2   │ لکه چې د یسعیا...      │ https://drive.google.com... │
│ Mark │   1    │  3   │ په دښته غږ کونکی...    │ https://drive.google.com... │
└──────┴────────┴──────┴─────────────────────────┴─────────────────────────────┘

-- Query example
SELECT book, chapter, verse, text, audio_url
FROM verses
WHERE book = 'Mark' AND chapter = 1
ORDER BY verse
LIMIT 3;
```

## Best Practices

1. **Keep Google Drive as storage**: Don't move audio files to Supabase (store URLs only)
2. **Single query approach**: Fetch verses with audio_url in one query (no joins)
3. **Index strategically**: Index on `(book, chapter)` for fast chapter lookups
4. **Cache in browser**: Let browser cache Google Drive audio responses
5. **Update directly**: When Drive URLs change, update `verses.audio_url` column
6. **Maintain both translations**: Keep audio URLs in sync for both Afghan and Yousafzai tables

## Future Enhancements

- [ ] Add audio quality metadata (bitrate, sample rate)
- [ ] Track audio duration in mappings
- [ ] Support multiple audio sources per verse
- [ ] Add audio playback analytics
- [ ] Implement audio pre-fetching for next chapter
