# Audio Architecture

## Overview

The audio system uses a two-tier architecture:
- **Storage**: Audio files stored in Google Drive
- **Index**: Supabase `audio_mappings` table for fast lookups

## Architecture

```
┌─────────────────┐
│  User Request   │
│   (Mark 1:1)    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Supabase audio_mappings Table  │
│  ┌───────────┬──────────────┐   │
│  │ verse_ref │  audio_url   │   │
│  ├───────────┼──────────────┤   │
│  │ Mark 1:1  │ drive.google │   │
│  │ Mark 1:2  │ drive.google │   │
│  └───────────┴──────────────┘   │
└────────┬────────────────────────┘
         │ Query: < 5ms
         ▼
┌─────────────────┐
│  Google Drive   │
│  (Actual MP3s)  │
└─────────────────┘
    Stream: 100-500ms
```

## Tables

### audio_mappings (Supabase)
- **Purpose**: Fast verse → URL lookup
- **Rows**: ~6,831 mappings
- **Size**: 4.8 MB (metadata only)
- **Query Time**: 2-5ms

**Schema:**
```sql
CREATE TABLE audio_mappings (
  id SERIAL PRIMARY KEY,
  verse_ref TEXT NOT NULL,          -- e.g., "Mark 1:1"
  audio_url TEXT NOT NULL,           -- Google Drive URL
  source TEXT,                       -- 'afghan2023' or 'yousafzai2019'
  book TEXT,
  chapter INTEGER,
  verse INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audio_verse_ref ON audio_mappings(verse_ref);
CREATE INDEX idx_audio_book_chapter ON audio_mappings(book, chapter);
```

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

### `/api/audio-batch` (Current)
Fast batch audio URL lookup from Supabase:

```typescript
POST /api/audio-batch
{
  "refs": ["Mark 1:1", "Mark 1:2", "Mark 1:3"]
}

Response:
{
  "audioUrls": {
    "Mark 1:1": "https://drive.google.com/uc?export=download&id=...",
    "Mark 1:2": "https://drive.google.com/uc?export=download&id=...",
    "Mark 1:3": "https://drive.google.com/uc?export=download&id=..."
  },
  "metadata": {
    "requested": 3,
    "found": 3,
    "queryTimeMs": 4,
    "source": "supabase-audio-mappings"
  }
}
```

### `/api/audio_url` (Legacy)
Individual audio URL lookup - can be updated to use Supabase

## Flow for Chapter View

```
1. User opens Mark Chapter 1
   ↓
2. ChapterView fetches verses from Supabase
   SELECT * FROM verses WHERE book='Mark' AND chapter=1
   → Returns 45 verses with refs: ["Mark 1:1", ..., "Mark 1:45"]
   ↓
3. ChapterView calls /api/audio-batch
   POST { refs: ["Mark 1:1", ..., "Mark 1:45"] }
   ↓
4. API queries Supabase audio_mappings (ONE query, 5ms)
   SELECT verse_ref, audio_url
   FROM audio_mappings
   WHERE verse_ref IN (...)
   ↓
5. Returns Google Drive URLs
   { "Mark 1:1": "https://drive.google.com/...", ... }
   ↓
6. Browser loads audio directly from Google Drive
   (Google Drive handles streaming, caching, etc.)
```

## Performance Benefits

| Approach | Lookup Time | Storage |
|----------|-------------|---------|
| **Old: Load JSON audio map** | 100-200ms | 2-5 MB in memory |
| **New: Supabase index** | 2-5ms | 5 KB in memory |

**Improvement**: 40-100x faster lookup

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

## Migration Strategy

If audio URLs need to be updated:

```sql
-- Update a single mapping
UPDATE audio_mappings
SET audio_url = 'https://drive.google.com/...'
WHERE verse_ref = 'Mark 1:1';

-- Batch update from CSV
COPY audio_mappings(verse_ref, audio_url, source)
FROM '/path/to/mappings.csv'
DELIMITER ',' CSV HEADER;
```

## Current Status

✅ **audio_mappings table**: Stores verse → Google Drive URL mappings
✅ **audio_files table**: Stores file metadata
✅ **API endpoints**: Fast batch lookups implemented
✅ **ChapterView**: Uses optimized audio-batch endpoint

## Example Data

```sql
-- Sample audio_mappings entries
┌───────────┬────────────────────────────────────────────┬────────────┐
│ verse_ref │ audio_url                                  │ source     │
├───────────┼────────────────────────────────────────────┼────────────┤
│ Mark 1:1  │ https://drive.google.com/uc?id=1ABC...    │ afghan2023 │
│ Mark 1:2  │ https://drive.google.com/uc?id=1DEF...    │ afghan2023 │
│ Mark 1:3  │ https://drive.google.com/uc?id=1GHI...    │ afghan2023 │
└───────────┴────────────────────────────────────────────┴────────────┘
```

## Best Practices

1. **Keep Google Drive as storage**: Don't move audio files to Supabase
2. **Use Supabase for indexes**: Fast verse → URL lookups
3. **Batch queries**: Fetch multiple URLs at once
4. **Cache in browser**: Let browser cache Google Drive responses
5. **Update mappings**: When Drive URLs change, update Supabase table

## Future Enhancements

- [ ] Add audio quality metadata (bitrate, sample rate)
- [ ] Track audio duration in mappings
- [ ] Support multiple audio sources per verse
- [ ] Add audio playback analytics
- [ ] Implement audio pre-fetching for next chapter
