# Pashto Bible Search – Production Readiness Checklist

## ✅ Completed: Ingestion Script Hardening

### Problem Statement
The initial ingestion approach had several issues that would cause failures in production:
- No resumability: batch failures meant full restart
- Inefficient: verse text scanning (O(words × verses))
- Silent failures: no detailed error tracking
- No verification: can't confirm data integrity
- No batch configuration: one-size-fits-all approach

### Solution Implemented

#### 1. ✅ Resumable Batching
**File:** `ingest_to_production_schema.js`

- **Progress Tracking**: All progress saved to `.ingestion_progress.json`
- **Resume from Failure**: Crashed at batch 8/16? Restart picks up at batch 8
- **Graceful Restart**: No data duplication, only processes remaining batches
- **Configurable Batch Sizes**: 
  ```javascript
  CONFIG.batches.verses = 500;    // verses per batch (adjust for stability)
  CONFIG.batches.wordIndex = 1000; // words per batch
  ```

#### 2. ✅ Pre-Computed Frequencies (No Verse Scanning)
**Change:** Eliminated O(words × verses) string scanning

**Before:**
```javascript
for (const word of words) {
  for (const verse of verses) {           // ❌ Nested O(n²) loop
    if (verse.text.includes(word)) { ... }
  }
}
```

**After:**
```javascript
// Frequency data includes precomputed verse_refs
{
  "خدا": {
    "frequency": 500,
    "verse_refs": ["Genesis 1:1", "Genesis 1:3", ...]  // ✅ Already computed
  }
}
```

#### 3. ✅ Proper Table Clearing
**Change:** From `delete().neq('id', 0)` → `TRUNCATE ... RESTART IDENTITY`

**Before:**
```javascript
await supabase.from('verses').delete().neq('id', 0);  // ❌ Leaves NULLs
```

**After:**
```sql
TRUNCATE public.verses, public.verses_yousafzai, public.word_occurrence_index
  RESTART IDENTITY CASCADE;  -- ✅ Full reset, no orphans
```

#### 4. ✅ Comprehensive Error Tracking
**Change:** Log individual failed rows, not just batch counts

**Stored in `.ingestion_progress.json`:**
```json
{
  "failedRefs": {
    "afghan": ["Mark 1:1", "Luke 2:3"],  // ✅ Specific verses
    "yousafzai": []
  },
  "failedWords": {
    "afghan2023": ["word1", "word2"],     // ✅ Specific words
    "yousafzai2019": []
  }
}
```

#### 5. ✅ Production-Grade Verification
**Change:** From "count > 0" → count matching with coverage %

**Verification Checks:**
- Afghan verses count = expected
- Yousafzai verses count = expected
- Afghan words count = frequency data count (not approximate)
- Yousafzai words count = frequency data count
- Audio coverage: % of verses with audio URLs
- Sample query: test word lookup returns correct verse refs

**Example Output:**
```
📖 Afghan Verses:
   ✅ Count: 8000 verses

📊 Afghan Word Frequencies:
   ✅ Count matches: 12500 words

🎵 Audio URLs:
   Afghan: 6800/8000 verses with audio (85.0%)
   Yousafzai: 6600/7800 verses with audio (84.6%)

🔍 Sample Query Test:
   ✅ Sample word: "خدا" (500 occurrences, 480 verses)

✅ All verifications passed!
```

#### 6. ✅ Configurable File Paths
**Change:** From hardcoded paths → CLI arguments

```bash
# Default paths
node ingest_to_production_schema.js

# Custom paths
node ingest_to_production_schema.js \
  ./verses.json.gz \
  ./yousafzai.json \
  ./audio_map.json \
  ./freq_afghan.json \
  ./freq_yousafzai.json
```

#### 7. ✅ Gitignore for Progress File
**File:** `.gitignore`

```
# Ingestion progress tracking (don't commit run history)
.ingestion_progress.json
```

---

## 📋 Production Setup (Ready to Run)

### Step 1: Create Supabase Schema
**File:** `INGESTION_GUIDE.md` (copy-paste SQL)

Three SQL blocks to run in Supabase console:
1. Create `verses` table (Afghan)
2. Create `verses_yousafzai` table
3. Create `word_occurrence_index` table

All with proper indexes and column types.

### Step 2: Prepare Data
Required files:
- `public/verses.json.gz` (Afghan verses, gzipped)
- `app/data/yousafzai_all_verses.json` (Yousafzai verses)
- `google_drive_audio_urls.json` (audio mappings)
- `app/data/word_frequency_list.json` (Afghan frequencies with verse_refs)
- `app/data/yousafzai_word_frequency_list.json` (Yousafzai frequencies)

### Step 3: Set Environment
Add to `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # NOT anon key!
```

### Step 4: Run Ingestion
```bash
node ingest_to_production_schema.js
```

Automatic resumption on timeout:
```bash
# Crashed? Just run again
node ingest_to_production_schema.js
```

### Step 5: Verify
Check script output for all ✅ marks. Sample output in `INGESTION_GUIDE.md`.

---

## 🎯 Remaining Tasks (Not Yet Implemented)

### ⏳ Task 1: Update Search API
**File:** `app/api/search/route.ts`

Currently still loads from `public/verses.json.gz`. Should query Supabase:

```typescript
// Instead of:
const { data } = await import('@/app/lib/data/load');
const allVerses = data.verses;

// Use:
const { data: verses } = await supabase
  .from('verses')
  .select('ref, book, chapter, verse, text, testament, dialect, audio_url')
  .textSearch('text', query)  // if full-text search available
  .limit(100);
```

**Effort:** Medium (~2–3 hours)
- Replace JSON loader with Supabase query
- Handle both Afghan and Yousafzai selectively
- Test performance (should be <100ms for typical searches)

### ⏳ Task 2: Update Chapter API
**File:** `app/api/chapter/route.ts`

This one already uses Supabase! But verify it:
- ✅ Queries `verses` or `verses_yousafzai`
- ✅ Returns `audio_url` directly
- ✅ No separate audio-batch call needed

**Effort:** Low (~15 mins – mostly testing)

### ⏳ Task 3: Switch From JSON to Supabase
**Impact:** All data loading across the app

Once APIs are updated:
1. Search still works with JSON fallback during transition
2. Delete JSON loaders from `app/lib/data/load.ts` after cutover
3. Monitor Supabase logs for query performance
4. Keep `public/verses.json.gz` as backup (compressed disk usage minimal)

**Effort:** Low (~30 mins of testing)

---

## 🔧 Production Tips

### Monitor During Ingestion
```sql
-- In Supabase, watch insert progress
SELECT 
  COUNT(*) as verses,
  COUNT(*) FILTER (WHERE audio_url IS NOT NULL) as with_audio
FROM public.verses;

-- Watch word index build
SELECT COUNT(*) as words FROM public.word_occurrence_index
WHERE translation_key = 'afghan2023';
```

### If Ingestion Crashes Mid-Stream

**Option A: Resume automatically**
```bash
node ingest_to_production_schema.js  # Picks up where it left off
```

**Option B: Manual retry of failed rows**
```bash
# Check progress file for failed refs
cat .ingestion_progress.json | grep failedRefs

# Then manually handle in Supabase or re-prepare data
```

**Option C: Full reset and restart**
```bash
# In Supabase console:
TRUNCATE public.word_occurrence_index, public.verses_yousafzai, public.verses RESTART IDENTITY CASCADE;

# Then:
rm .ingestion_progress.json
node ingest_to_production_schema.js
```

### Optimize for Speed
```javascript
// In CONFIG section of ingest script:
CONFIG.batches.verses = 1000;      // up from 500 (if network stable)
CONFIG.batches.wordIndex = 2000;   // up from 1000

// In Supabase, disable triggers (if any):
ALTER TABLE public.verses DISABLE TRIGGER ALL;
-- ... run ingestion ...
ALTER TABLE public.verses ENABLE TRIGGER ALL;
```

---

## 📊 Expected Performance

### Ingestion Speed
- **Verses:** ~1,000 verses/sec (500 per batch, ~0.5s per batch)
- **Words:** ~2,000 words/sec (1,000 per batch, ~0.5s per batch)
- **Total for full dataset:** ~8,000 verses + 12,500 words ≈ 10–15 mins

### Query Performance (Post-Ingestion)
- **Word lookup:** 5–10ms (indexed on word + translation_key)
- **Verse by chapter:** 10–20ms (indexed on book + chapter)
- **Full-text search:** 50–100ms (if using PostgreSQL's full-text search)

---

## 🧪 Testing Checklist

- [ ] Supabase tables created successfully
- [ ] Frequency JSON files have `verse_refs` for all words
- [ ] SERVICE_ROLE_KEY is in `.env` (not anon key)
- [ ] Run ingestion script once on staging
- [ ] Verify counts match (output should show ✅)
- [ ] Check audio coverage > 80%
- [ ] Query a sample word in Supabase console
- [ ] Test search API against Supabase (not JSON)
- [ ] Test chapter API returns verses + audio
- [ ] `.ingestion_progress.json` is gitignored
- [ ] Deploy to Vercel with credentials set
- [ ] Monitor Vercel logs for any slow queries

---

## 📚 Documentation

- **`INGESTION_GUIDE.md`** – Complete guide: setup, running, troubleshooting, resuming
- **`ingest_to_production_schema.js`** – Actual ingestion script (fully commented)
- **`supabase_migration.sql`** – SQL schema (for reference; copy-paste from guide)

---

## 🎯 Success Criteria

✅ **Script is production-ready when:**
- Resumable: crashed batches don't require full restart
- Verified: comprehensive count matching + audio coverage checks
- Documented: operators can understand each step and troubleshoot
- Scalable: configurable batch sizes, handles timeouts gracefully
- Observable: detailed logging at each batch, progress tracked

✅ **APIs are production-ready when:**
- All queries hit Supabase (not JSON files)
- Performance meets SLA (< 100ms typical, < 500ms worst-case)
- Audio URLs stream correctly from Google Drive
- JSON loading is completely removed (or fallback-only)

✅ **Deployment is production-ready when:**
- Ingestion completes with all ✅ marks
- Verification passes: counts match, audio coverage acceptable
- APIs tested against live data
- Monitoring alerts configured for slow queries
- Rollback plan documented (keep JSON as backup)

---

## 🚀 Next Meeting Agenda

1. **Confirm frequency data has `verse_refs`** (or generate offline)
2. **Create Supabase tables** (copy-paste SQL from guide)
3. **Run ingestion script** on staging/test database
4. **Review verification output** – confirm all ✅ marks
5. **Update search API** to query Supabase (if time permits)
6. **Plan deployment** to production

---

## 📞 Questions?

Refer to:
- `INGESTION_GUIDE.md` → **Troubleshooting** section (common issues + fixes)
- `ingest_to_production_schema.js` → Inline comments explain each function
- `.ingestion_progress.json` → Check this file if things go wrong (shows exactly where it stopped)
