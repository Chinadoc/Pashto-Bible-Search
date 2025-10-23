# Supabase Data Ingestion Guide

## Overview

This guide covers ingesting the Pashto Bible verses and word indices into Supabase. The ingestion script is **resumable**, **batch-oriented**, and **production-ready**.

## Architecture

Three-table schema:
- **`verses`** (Afghan 2023 translation) – all verses + audio URLs
- **`verses_yousafzai`** (Yousafzai 2019 translation) – all verses + audio URLs
- **`word_occurrence_index`** (both translations) – word → verse mappings, frequencies, TF-IDF

**Key Design Decisions:**
- No verse text scanning during ingestion (too slow for O(words × verses))
- Frequency data must be **pre-computed** with verse refs baked in
- Batches are configurable (default: 500 verses, 1000 words) for reliability
- Progress is persisted to `.ingestion_progress.json` for resumability

---

## Prerequisites

### 1. Supabase Setup

Create the schema first. Run these SQL statements in your Supabase SQL Editor (one per execution):

```sql
-- 1. Create Afghan verses table
CREATE TABLE IF NOT EXISTS public.verses (
  id BIGSERIAL PRIMARY KEY,
  ref TEXT NOT NULL UNIQUE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  text_normalized TEXT,
  testament TEXT NOT NULL CHECK (testament IN ('OT', 'NT')),
  translation_key TEXT NOT NULL DEFAULT 'afghan2023',
  dialect TEXT,
  audio_url TEXT,
  audio_source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verses_book_chapter_verse
  ON public.verses (book, chapter, verse);
CREATE INDEX IF NOT EXISTS idx_verses_translation ON public.verses (translation_key);
```

```sql
-- 2. Create Yousafzai verses table
CREATE TABLE IF NOT EXISTS public.verses_yousafzai (
  id BIGSERIAL PRIMARY KEY,
  ref TEXT NOT NULL UNIQUE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  text_normalized TEXT,
  testament TEXT NOT NULL CHECK (testament IN ('OT', 'NT')),
  translation_key TEXT NOT NULL DEFAULT 'yousafzai2019',
  dialect TEXT,
  tags JSONB DEFAULT '[]',
  audio_url TEXT,
  audio_source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verses_y_book_chapter_verse
  ON public.verses_yousafzai (book, chapter, verse);
CREATE INDEX IF NOT EXISTS idx_verses_y_translation ON public.verses_yousafzai (translation_key);
```

```sql
-- 3. Create word occurrence index table
CREATE TABLE IF NOT EXISTS public.word_occurrence_index (
  word TEXT NOT NULL,
  translation_key TEXT NOT NULL,
  frequency INTEGER NOT NULL DEFAULT 0,
  verse_refs TEXT[] NOT NULL,
  tfidf NUMERIC[] DEFAULT NULL,
  primary_verse_ref TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (word, translation_key)
);

CREATE INDEX IF NOT EXISTS idx_word_occurrence_freq
  ON public.word_occurrence_index (frequency DESC);
```

### 2. Prepare Your Data Files

The script expects these files in your project root or specified paths:

**Afghan verses (compressed):**
```
public/verses.json.gz
```

**Yousafzai verses:**
```
app/data/yousafzai_all_verses.json
```

**Audio mapping (Google Drive):**
```
google_drive_audio_urls.json  (or specify custom path)
```

**Pre-computed frequencies (critical!):**
```
app/data/word_frequency_list.json         (Afghan)
app/data/yousafzai_word_frequency_list.json (Yousafzai)
```

### 3. Frequency Data Format

The ingestion script supports **two frequency formats**:

#### Option A: Simple frequency (legacy)
```json
{
  "خدا": 500,
  "کتاب": 350,
  ...
}
```
⚠️ This requires verse scanning (slower). Skipped words warn you.

#### Option B: Pre-computed with verse refs (recommended) ⭐
```json
{
  "خدا": {
    "frequency": 500,
    "verse_refs": ["Genesis 1:1", "Genesis 1:3", ...],
    "tf_idf_scores": [0.45, 0.42, ...]
  },
  "کتاب": {
    "frequency": 350,
    "verse_refs": ["Exodus 1:1", "Leviticus 2:3", ...],
    "tf_idf_scores": [0.38, 0.35, ...]
  },
  ...
}
```

**Generating Option B (offline, once):**
```bash
# Pre-compute frequencies with verse refs from your JSON data
node scripts/precompute_frequencies.js > app/data/word_frequency_list.json
```

### 4. Environment Variables

Add to `.env` (or set in CI/CD):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

⚠️ **Use the SERVICE_ROLE_KEY, not the anon key!** Service role bypasses RLS for data operations.

---

## Running the Ingestion

### Basic Usage

```bash
node ingest_to_production_schema.js
```

Uses default paths:
- Afghan verses: `public/verses.json.gz`
- Yousafzai verses: `app/data/yousafzai_all_verses.json`
- Audio map: `google_drive_audio_urls.json`
- Frequencies: `app/data/word_frequency_list.json`, `app/data/yousafzai_word_frequency_list.json`

### Custom Paths

```bash
node ingest_to_production_schema.js \
  ./path/to/afghan_verses.json.gz \
  ./path/to/yousafzai_verses.json \
  ./path/to/audio_map.json \
  ./path/to/afghan_frequencies.json \
  ./path/to/yousafzai_frequencies.json
```

### Expected Output

```
🚀 Starting production data ingestion...

📋 Configuration:
   Afghan verses: public/verses.json.gz
   Yousafzai verses: app/data/yousafzai_all_verses.json
   Audio map: google_drive_audio_urls.json
   Afghan frequencies: app/data/word_frequency_list.json
   Yousafzai frequencies: app/data/yousafzai_word_frequency_list.json
   Batch size: 500 verses, 1000 words

📖 Loading verses data...
   Loading Afghan 2023 verses...
   ✅ Loaded 8000 Afghan verses
   Loading Yousafzai 2019 verses...
   ✅ Loaded 7800 Yousafzai verses

🎵 Loading audio mapping...
   Trying google_drive_audio_urls.json...
   ✅ Loaded 6800 audio mappings

📊 Loading frequency data...
   ✅ Loaded 12500 Afghan frequencies
   ✅ Loaded 11200 Yousafzai frequencies

🧹 Clearing existing data with TRUNCATE...
   ✅ Tables cleared

💾 Inserting verses into database...
   Processing Afghan verses...
   Prepared 8000 Afghan verses and 7800 Yousafzai verses
   Inserting Afghan verses (resuming from 0)...
     Inserting Afghan batch 1/16 (500 verses)...
     ✅ Afghan batch 1 inserted
   ...
   ✅ Afghan insertion complete: 8000 successful, 0 failed

🔍 Building word occurrence index from pre-computed frequencies...
   Processing afghan2023...
   Found 12500 words with verse mappings for afghan2023 (0 skipped)
   Inserting afghan2023 word batch 1/13 (1000 words)...
     ✅ afghan2023 word batch 1 inserted (1000 words)
   ...
   ✅ afghan2023 indexing complete: 12500 successful, 0 failed

✅ Verifying data ingestion...

📖 Afghan Verses:
   ✅ Count: 8000 verses

📖 Yousafzai Verses:
   ✅ Count: 7800 verses

📊 Afghan Word Frequencies:
   ✅ Count matches: 12500 words

🎵 Audio URLs:
   Afghan: 6800/8000 verses with audio (85.0%)
   Yousafzai: 6600/7800 verses with audio (84.6%)

🔍 Sample Query Test:
   ✅ Sample word: "خدا" (500 occurrences, 480 verses)

✅ All verifications passed!

🎉 Production data ingestion completed successfully!
```

---

## Handling Failures & Resumption

### Progress File

The script persists progress to `.ingestion_progress.json`:

```json
{
  "versesInserted": {
    "afghan": 4000,
    "yousafzai": 3900
  },
  "wordsIndexed": {
    "afghan2023": 6250,
    "yousafzai2019": 5600
  },
  "failedRefs": {
    "afghan": ["Mark 1:1", "Luke 2:3"],
    "yousafzai": []
  },
  "failedWords": {
    "afghan2023": ["word1", "word2"],
    "yousafzai2019": []
  },
  "completedSteps": ["load_data", "insert_verses"]
}
```

### Resuming After a Timeout

The script **automatically resumes** from the last successful batch:

```bash
# Just run again; it picks up where it left off
node ingest_to_production_schema.js
```

If it crashed during verse insertion at batch 8, rerunning skips batches 1–7 and resumes at 8.

### Clearing and Restarting

If you want a full reset:

1. **Option A**: Via Supabase SQL Editor, run:
   ```sql
   TRUNCATE public.word_occurrence_index, public.verses_yousafzai, public.verses RESTART IDENTITY CASCADE;
   ```

2. **Option B**: Delete the progress file and restart:
   ```bash
   rm .ingestion_progress.json
   node ingest_to_production_schema.js
   ```

### Debugging Failed Rows

If rows fail to insert, they're logged in `.ingestion_progress.json` under `failedRefs` or `failedWords`. Check:
1. Supabase error logs (Dashboard → Logs)
2. Constraint violations (e.g., duplicate refs)
3. Character encoding issues

Example troubleshooting:
```bash
# Check if a specific ref exists
curl -H "Authorization: Bearer YOUR_ANON_KEY" \
  "https://your-project.supabase.co/rest/v1/verses?ref=eq.Genesis%201:1"
```

---

## Post-Ingestion: Switching APIs

Once ingestion completes and verification passes, update your API endpoints:

### 1. Update `app/api/search/route.ts`

Change data loading from JSON to Supabase:

```typescript
// Instead of:
const { data } = await import('@/app/lib/data/load');
const verses = data.verses;

// Use:
const { data: verses } = await supabase
  .from('verses')
  .select('ref, book, chapter, verse, text, testament, dialect, audio_url')
  .textSearch('text', query)  // if using full-text search
  .limit(100);
```

### 2. Update `app/api/chapter/route.ts`

Already done! It queries Supabase directly.

### 3. Remove JSON File Serving

Once all APIs use Supabase:
- Keep `public/verses.json.gz` as a backup
- Remove from production builds if disk space is tight

---

## Performance Tips

1. **Disable triggers during ingestion** (if any):
   ```sql
   ALTER TABLE public.verses DISABLE TRIGGER ALL;
   -- ... run ingestion ...
   ALTER TABLE public.verses ENABLE TRIGGER ALL;
   ```

2. **Increase batch sizes for faster inserts** (if fewer timeouts):
   ```javascript
   CONFIG.batches.verses = 1000;  // up to 2000 for stable networks
   CONFIG.batches.wordIndex = 2000;
   ```

3. **Pre-compute frequencies offline** to avoid scanning during ingestion.

4. **Monitor Supabase connections** while running (Dashboard → Logs).

---

## Verification Checklist

- [ ] Afghan verses count matches expected
- [ ] Yousafzai verses count matches expected
- [ ] Afghan word index count matches frequency data
- [ ] Yousafzai word index count matches frequency data
- [ ] Audio URL coverage > 80% for both translations
- [ ] Sample query returns correct word with verse refs
- [ ] Search API works against Supabase (not JSON)
- [ ] Chapter API returns verses + audio URLs
- [ ] Progress file is in `.gitignore`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Cannot find module '@supabase/supabase-js'` | Run `npm install @supabase/supabase-js` |
| `Missing SUPABASE_SERVICE_ROLE_KEY` | Check `.env` has the key (not anon key) |
| `ERROR: 42703: column "translation_key" does not exist` | Run the SQL schema creation above |
| `TRUNCATE fails with FK constraint` | Use `CASCADE` in TRUNCATE statement |
| `Verse insertion stuck/slow` | Reduce batch size from 500 to 250 |
| `Word indexing skips words` | Add `verse_refs` to frequency JSON (use precompute script) |
| `Audio coverage < 50%` | Check `google_drive_audio_urls.json` exists & has entries |
| `Resume doesn't work` | Verify `.ingestion_progress.json` isn't corrupted; try `rm` and restart |

---

## Next Steps

1. **Pre-compute frequencies** with verse refs (offline, once):
   ```bash
   node scripts/precompute_frequencies.js > app/data/word_frequency_list.json
   ```

2. **Run ingestion**:
   ```bash
   node ingest_to_production_schema.js
   ```

3. **Verify**:
   - Check counts in verification output
   - Query a sample word in Supabase console
   - Test search API

4. **Deploy**:
   - Merge to main after verification passes
   - Push to Vercel; it deploys with Supabase credentials

5. **Monitor**:
   - Watch Supabase logs for any slow queries
   - Profile API endpoints to ensure < 100ms latency
