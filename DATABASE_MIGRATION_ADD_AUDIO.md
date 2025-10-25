# Database Migration: Add Audio to Verses Tables

## Objective
Add audio storage paths and URLs to both `verses` and `verses_yousafzai` tables so each verse is served with its associated audio metadata.

## Why This Matters
Currently, audio data is stored separately. By adding it to the verses table:
- ✅ Each verse served includes its audio metadata
- ✅ Single database query returns complete verse + audio
- ✅ Beautiful, connected data model
- ✅ Better performance (no separate lookups)
- ✅ Simpler API responses

## Schema Addition

### Step 1: Add Audio Columns to `verses` Table

Run this in **Supabase SQL Editor**:

```sql
-- Add audio columns to verses table
ALTER TABLE public.verses
ADD COLUMN IF NOT EXISTS audio_storage_path TEXT,
ADD COLUMN IF NOT EXISTS audio_public_url TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_verses_audio_storage 
ON public.verses (audio_storage_path);
```

### Step 2: Add Audio Columns to `verses_yousafzai` Table

```sql
-- Add audio columns to verses_yousafzai table
ALTER TABLE public.verses_yousafzai
ADD COLUMN IF NOT EXISTS audio_storage_path TEXT,
ADD COLUMN IF NOT EXISTS audio_public_url TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_verses_yousafzai_audio_storage 
ON public.verses_yousafzai (audio_storage_path);
```

### Step 3: Populate Audio Data

If you have audio data stored elsewhere, populate it with:

```sql
-- Example: Update verses with audio URLs
-- Replace 'your_audio_id' pattern with your actual audio reference logic
UPDATE public.verses
SET audio_storage_path = 'audio/' || book || '_' || chapter || '_' || verse || '.mp3',
    audio_public_url = 'https://your-storage-bucket.com/audio/' || book || '_' || chapter || '_' || verse || '.mp3'
WHERE audio_storage_path IS NULL;

-- Same for Yousafzai
UPDATE public.verses_yousafzai
SET audio_storage_path = 'audio/' || book || '_' || chapter || '_' || verse || '.mp3',
    audio_public_url = 'https://your-storage-bucket.com/audio/' || book || '_' || chapter || '_' || verse || '.mp3'
WHERE audio_storage_path IS NULL;
```

### Step 4: Verify Data

Check that columns were created:

```sql
-- View verses table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'verses'
AND column_name LIKE '%audio%';

-- Count verses with audio
SELECT COUNT(*) as verses_with_audio
FROM public.verses
WHERE audio_public_url IS NOT NULL;

SELECT COUNT(*) as total_verses
FROM public.verses;
```

## API Update Required

After adding columns, update the chapter endpoint to fetch audio:

```typescript
// In app/api/chapter/route.ts
const { data: verses, error } = await supabase
  .from(tableName)
  .select('book, chapter, verse, text, testament, audio_storage_path, audio_public_url')
  .eq('book', book)
  .eq('chapter', chapter)
  .order('verse', { ascending: true });
```

## Benefits of Connected Data

With audio columns in verses table:

```json
{
  "verses": [
    {
      "ref": "Genesis 1:1",
      "book": "Genesis",
      "chapter": 1,
      "verse": 1,
      "text": "...",
      "audio_storage_path": "audio/Genesis_1_1.mp3",
      "audio_public_url": "https://storage.example.com/audio/Genesis_1_1.mp3"
    }
  ]
}
```

Every verse includes its audio - beautiful and connected! 🎵

## Migration Checklist

- [ ] Add audio columns to `verses` table
- [ ] Add audio columns to `verses_yousafzai` table
- [ ] Populate audio data
- [ ] Verify columns exist and contain data
- [ ] Update API endpoints to fetch audio columns
- [ ] Update TypeScript interfaces to include audio fields
- [ ] Test chapter view with audio URLs
- [ ] Deploy
