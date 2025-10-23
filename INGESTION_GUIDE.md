# Supabase Data Ingestion Guide – Production Edition

## ⚠️ Critical Prerequisites

Before running the ingestion script, verify:

1. **Frequency data format** – Must include `verse_refs` and `tf_idf_scores`
2. **Supabase schema** – Tables created with correct column names
3. **SERVICE_ROLE_KEY** – In `.env` (not anon key)
4. **Data file paths** – Verses, Yousafzai, audio map, frequencies accessible

---

## 🎯 Frequency Data Format (Most Important!)

The ingestion script supports **two frequency formats**, but only one is production-ready.

### ❌ Legacy Format (Will Skip Words!)
```json
{
  "خدا": 500,
  "کتاب": 350
}
```
**Problem:** No verse refs. Words will be skipped with warning: "missing precomputed verse_refs"

**Result:** Empty or partial word_occurrence_index.

### ✅ Recommended Format (Pre-Computed)
```json
{
  "خدا": {
    "frequency": 500,
    "verse_refs": ["Genesis 1:1", "Genesis 1:3", "Exodus 2:5", ...],
    "tf_idf_scores": [0.95, 0.92, 0.88, ...]
  },
  "کتاب": {
    "frequency": 350,
    "verse_refs": ["Mark 1:1", "Luke 2:1", ...],
    "tf_idf_scores": [0.78, 0.75, ...]
  }
}
```

**Why this works:**
- `frequency` – Word count across all verses
- `verse_refs` – Array of verses containing this word (exact refs like "Genesis 1:1")
- `tf_idf_scores` – Relevance scores, one per verse ref (same length as `verse_refs`)

**If you're missing this format:**
```bash
# Generate it offline (one-time, can take hours)
node scripts/precompute_word_frequencies.js > app/data/word_frequency_list.json
node scripts/precompute_word_frequencies.js --yousafzai > app/data/yousafzai_word_frequency_list.json

# Then run ingestion
node ingest_to_production_schema.js
```

---

## 📋 Setup Steps

### 1. Create Supabase Schema

Copy-paste each SQL block into Supabase SQL Editor (one at a time):

**Block A: Create verses table**
```sql
CREATE TABLE IF NOT EXISTS public.verses (
  id BIGSERIAL PRIMARY KEY,
  ref TEXT NOT NULL UNIQUE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  text_normalized TEXT,
  testament TEXT NOT NULL CHECK (testament IN ('OT','NT')),
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
CREATE INDEX IF NOT EXISTS idx_verses_text_search
  ON public.verses USING gin (to_tsvector('simple', coalesce(text_normalized, text)));
```

**Block B: Create verses_yousafzai table**
```sql
CREATE TABLE IF NOT EXISTS public.verses_yousafzai (
  id BIGSERIAL PRIMARY KEY,
  ref TEXT NOT NULL UNIQUE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  text_normalized TEXT,
  testament TEXT NOT NULL CHECK (testament IN ('OT','NT')),
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
CREATE INDEX IF NOT EXISTS idx_verses_y_text_search
  ON public.verses_yousafzai USING gin (to_tsvector('simple', coalesce(text_normalized, text)));
```

**Block C: Create word_occurrence_index table**
```sql
CREATE TABLE IF NOT EXISTS public.word_occurrence_index (
  word TEXT NOT NULL,
  translation_key TEXT NOT NULL,
  frequency INTEGER NOT NULL DEFAULT 0,
  verse_refs TEXT[] NOT NULL,
  tf_idf_scores NUMERIC[] DEFAULT NULL,
  primary_verse_ref TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (word, translation_key)
);

CREATE INDEX IF NOT EXISTS idx_word_occurrence_freq
  ON public.word_occurrence_index (frequency DESC);
CREATE INDEX IF NOT EXISTS idx_word_occurrence_refs
  ON public.word_occurrence_index USING gin (verse_refs);
```

### 2. Prepare Data Files

Required in project root or specified paths:
```
public/verses.json.gz                          # Afghan verses (gzipped)
app/data/yousafzai_all_verses.json            # Yousafzai verses
google_drive_audio_urls.json                   # Audio mappings
app/data/word_frequency_list.json             # Afghan words (with verse_refs!)
app/data/yousafzai_word_frequency_list.json   # Yousafzai words (with verse_refs!)
```

### 3. Set Environment

Add to `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sbp_your_service_role_key_here
```

⚠️ **CRITICAL:** Use SERVICE_ROLE_KEY (from Supabase Settings → API), NOT anon key.

### 4. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

---

## 🚀 Running the Ingestion

### Basic Run (Full Reset)

```bash
node ingest_to_production_schema.js
```

Clears all tables and reinserts. ~10–15 mins for full dataset.

### Resume After Timeout

The script saves progress to `.ingestion_progress.json`. If it crashes at batch 8/16:

```bash
# Just run again; it picks up from batch 8
node ingest_to_production_schema.js
```

### Incremental Run (Don't Truncate)

To append new data without wiping existing:

```bash
node ingest_to_production_schema.js --no-truncate
```

Useful for partial updates or fixes.

### Custom File Paths

```bash
node ingest_to_production_schema.js \
  --no-truncate \
  ./path/to/verses.json.gz \
  ./path/to/yousafzai.json \
  ./path/to/audio_map.json \
  ./path/to/afghan_freq.json \
  ./path/to/yousafzai_freq.json
```

---

## 📊 Expected Output

### Success Scenario
```
🚀 Starting production data ingestion...

📋 Configuration:
   Flags: truncate before insert
   Afghan verses: public/verses.json.gz
   Yousafzai verses: app/data/yousafzai_all_verses.json
   Audio map: google_drive_audio_urls.json
   Afghan frequencies: app/data/word_frequency_list.json
   Yousafzai frequencies: app/data/yousafzai_word_frequency_list.json
   Batch size: 500 verses, 1000 words

📖 Loading verses data...
   Loading Afghan 2023 verses from public/verses.json.gz...
   ✅ Loaded 8000 Afghan verses
   Loading Yousafzai 2019 verses from app/data/yousafzai_all_verses.json...
   ✅ Loaded 7800 Yousafzai verses

🎵 Loading audio mapping...
   Trying google_drive_audio_urls.json...
   ✅ Loaded 6800 audio mappings

📊 Loading frequency data...
   Loading Afghan frequencies from app/data/word_frequency_list.json...
   ✅ Loaded 12500 Afghan word entries
   Loading Yousafzai frequencies from app/data/yousafzai_word_frequency_list.json...
   ✅ Loaded 11200 Yousafzai word entries

🧹 Clearing existing data with TRUNCATE...
   ✅ Tables cleared

💾 Inserting verses into database...
   Processing Afghan verses...
   Prepared 8000 Afghan and 7800 Yousafzai verses
   Inserting Afghan verses (resuming from 0)...
     Batch 1/16: inserting 500 verses...
     ✅ Batch 1 inserted
   ...
   ✅ Afghan: 8000 successful, 0 failed

   Inserting Yousafzai verses (resuming from 0)...
     Batch 1/16: inserting 500 verses...
     ✅ Batch 1 inserted
   ...
   ✅ Yousafzai: 7800 successful, 0 failed

🔍 Building word occurrence index...
   Processing afghan2023...
   Resuming from word index 0/12500
   Inserting afghan2023 word batch (1000 words)...
   ✅ Inserted batch
   ...
   ✅ afghan2023 complete (0 words skipped - missing verse_refs)

   Processing yousafzai2019...
   ...
   ✅ yousafzai2019 complete (0 words skipped - missing verse_refs)

✅ Verifying data ingestion...

📖 Afghan Verses: 8000 (expected 8000)
   ✅ Count matches
📖 Yousafzai Verses: 7800 (expected 7800)
   ✅ Count matches

📊 afghan2023 Words: 12500 (expected ~12500)
   ✅ Count acceptable
📊 yousafzai2019 Words: 11200 (expected ~11200)
   ✅ Count acceptable

🎵 Audio Coverage:
   Afghan: 6800/8000 (85.0%)
   Yousafzai: 6600/7800 (84.6%)

🔍 Spot Check (Genesis 1:1):
   ✅ Afghan: Found verse
      Text: "په ابتدا کلام الهٰ..."
      Audio: https://drive.google.com/uc?id=...
   ✅ Yousafzai: Found verse
      Text: "ابتدائے کریب قول وکیل..."
      Audio: https://drive.google.com/uc?id=DEF456...

🔍 Sample Query Test:
   ✅ Sample word: "خدا"
      Frequency: 500, Verses: 480

✅ All verifications passed!

🎉 Production data ingestion completed successfully!
```

### Warning: Missing Verse Refs
```
⚠️  WARNING: Frequency data missing verse_refs (found simple count format)
💡 Recommend: Run preprocessing to generate rich format with verse_refs

...

🔍 Building word occurrence index...
   Processing afghan2023...
   ✅ afghan2023 complete (12500 words skipped - missing verse_refs)
```

**Action Required:** Generate frequency data with verse_refs.

---

## 🔄 Progress Tracking & Resumption

### Progress File Structure

`.ingestion_progress.json` saves:
```json
{
  "versesInserted": {
    "afghan": 5000,
    "yousafzai": 4800
  },
  "lastProcessedWordKey": {
    "afghan2023": "خدا",
    "yousafzai2019": "کتاب"
  },
  "failedRefs": {
    "afghan": ["Mark 5:3"],
    "yousafzai": []
  },
  "failedWords": {
    "afghan2023": ["word1"],
    "yousafzai2019": []
  },
  "completedSteps": ["load_data", "clear_tables"]
}
```

### How Resumption Works

1. **Word key tracking** – Records exact word being processed, not just a count
2. **Resume from word key** – On restart, finds that word in the frequency list and continues from next
3. **No duplicates** – Verses/words already inserted are skipped
4. **Failed refs logged** – Inspect `.ingestion_progress.json` for manual fixes

### Resuming After Crash

```bash
# Crashed at batch 5/12 of word indexing?
# Check progress:
cat .ingestion_progress.json | grep "lastProcessedWordKey"
# Output: "lastProcessedWordKey": { "afghan2023": "خیر", ... }

# Just run again:
node ingest_to_production_schema.js

# It will:
# 1. Skip verses (already inserted)
# 2. Find word "خیر" in frequency list
# 3. Start from next word
# 4. Continue batching
```

---

## 🧪 Verification Details

### Count Matching (Not Just > 0)

Each verification checks exact counts:

| Check | Expected | Actual | Pass? |
|-------|----------|--------|-------|
| Afghan verses | 8000 | 8000 | ✅ |
| Yousafzai verses | 7800 | 7800 | ✅ |
| Afghan words | 12500 | 12480 | ⚠️ (5% variance allowed) |
| Word refs match lengths | All | All | ✅ |

**Variance Rule:** Up to 5% difference tolerated (0.05 × expected).

### Spot Check (Genesis 1:1)

Verifies:
- Both translations have Genesis 1:1
- Verse text is not empty
- Audio URL is present (or explicitly null)

```
🔍 Spot Check (Genesis 1:1):
   ✅ Afghan: Found verse
      Text: "په ابتدا کلام الهٰ..."
      Audio: https://drive.google.com/uc?id=...
```

If Genesis 1:1 missing → Data corruption likely.

### Audio Coverage

Shows % of verses with audio URLs:

```
🎵 Audio Coverage:
   Afghan: 6800/8000 (85.0%)  ← Acceptable
   Yousafzai: 6600/7800 (84.6%) ← Acceptable
```

**Typical range:** 80–90%. Below 70% = audio map likely incomplete.

---

## ⚠️ Troubleshooting

### Issue: "tf_idf_scores length (1000) != verse_refs length (950)"

**Cause:** Mismatch between scores and refs in frequency data.

**Fix:**
```bash
# Regenerate frequency data with matching array lengths
node scripts/precompute_word_frequencies.js --validate
```

### Issue: "12500 words skipped - missing verse_refs"

**Cause:** Frequency JSON is `{ word: count }` format (legacy).

**Fix:**
```bash
# Generate rich format offline:
node scripts/precompute_word_frequencies.js > app/data/word_frequency_list.json
# Then retry:
node ingest_to_production_schema.js
```

### Issue: "Genesis 1:1 not found" in spot check

**Cause:** Verses table empty or reference format wrong.

**Check:**
```sql
-- In Supabase console:
SELECT COUNT(*) FROM public.verses;
SELECT * FROM public.verses WHERE ref LIKE 'Genesis 1:%' LIMIT 5;
```

### Issue: "Cannot find module '@supabase/supabase-js'"

**Fix:**
```bash
npm install @supabase/supabase-js
```

### Issue: "Missing SUPABASE_SERVICE_ROLE_KEY"

**Fix:**
```bash
# Check .env has:
SUPABASE_SERVICE_ROLE_KEY=sbp_...

# NOT:
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...  ❌ (wrong key!)
```

### Issue: Ingestion stuck on word indexing

**Cause:** Verse text scanning (if verse_refs missing).

**Fix:**
```bash
# Ctrl+C to stop
# Generate frequency data with verse_refs:
node scripts/precompute_word_frequencies.js

# Reset and restart:
rm .ingestion_progress.json
node ingest_to_production_schema.js --no-truncate
```

---

## 📈 Performance Tips

### Faster Ingestion

```javascript
// Edit CONFIG in ingest_to_production_schema.js:
CONFIG.batches.verses = 1000;    // up from 500
CONFIG.batches.wordIndex = 2000; // up from 1000
```

Use larger batches if your network is stable. Trade: More memory, faster inserts.

### Disable Triggers (Advanced)

```sql
-- In Supabase, before ingestion:
ALTER TABLE public.verses DISABLE TRIGGER ALL;
-- ... run ingestion ...
ALTER TABLE public.verses ENABLE TRIGGER ALL;
```

Disables RLS/validation during insert. ~30% faster.

### Monitor Progress

```sql
-- In another Supabase console session:
SELECT COUNT(*) as verses FROM public.verses;
SELECT COUNT(*) as words FROM public.word_occurrence_index;
```

Watch counts climb during ingestion.

---

## ✅ Pre-Flight Checklist

- [ ] Supabase tables created (3 SQL blocks executed)
- [ ] Frequency JSON has `verse_refs` for all words
- [ ] SERVICE_ROLE_KEY in `.env` (not anon key)
- [ ] Data files present and readable
- [ ] `.ingestion_progress.json` gitignored
- [ ] @supabase/supabase-js installed (`npm list @supabase/supabase-js`)
- [ ] Ran script once on staging first
- [ ] Spot-check output shows Genesis 1:1 found
- [ ] Audio coverage > 70%
- [ ] Ready for production run

---

## 🎯 Success Criteria

✅ **Ingestion is production-ready when:**
- All verification checks pass (✅ marks)
- Genesis 1:1 found in both translations
- Audio coverage > 80%
- No words skipped (0 skipped - missing verse_refs)
- `.ingestion_progress.json` shows completedSteps: ["load_data", "clear_tables"]

✅ **Safe to deploy after:**
- Run on staging database first
- All checks pass
- Test search API works
- Chapter API returns verses + audio
- Spot checks manually verified

---

## 📞 Questions?

1. **Why does word indexing take so long?** – Depends on frequency data size and network. Pre-computed verse_refs makes it deterministic.

2. **Can I run incremental updates?** – Yes, use `--no-truncate` flag. Skip verse insertion if data unchanged.

3. **What if a word batch fails?** – It's logged in `.ingestion_progress.json` under `failedWords[translation]`. Inspect, fix, retry.

4. **Can I use legacy frequency format?** – Only if you pre-process it. Simple counts will be skipped with a warning.

5. **How do I know it's done?** – Look for: "✅ All verifications passed!" and "🎉 Production data ingestion completed successfully!"
