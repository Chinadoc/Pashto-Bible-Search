# Operations and Maintenance Guide

## 🎯 Purpose

This document explains how to operate the Supabase ingestion pipeline for regular updates, handle new text/audio imports, and integrate future features without breaking existing infrastructure.

---

## 📋 Core Principle: Ingestion as the Single Source of Truth

**One rule:** All Supabase data flows through `ingest_to_production_schema.js`. This is the canonical pipeline.

**Why?**
- ✅ Consistency – Same validation, batching, error handling
- ✅ Traceability – Every import logged to `.ingestion_progress.json`
- ✅ Reproducibility – Same input → same output, every time
- ✅ Rollback safety – TRUNCATE before each run prevents orphaned rows
- ✅ Future-proof – Extend with flags/modules, don't bypass

**Never:** Manual INSERT/UPDATE in Supabase console or side scripts. Always go through the ingestion script.

---

## 🔄 Standard Operations

### 1. Full Data Refresh (Quarterly or after new releases)

When you have new verse text, updated audio URLs, or refreshed frequency data:

```bash
# 1. Update local source files
cp /path/to/new/verses.json.gz public/verses.json.gz
cp /path/to/new/yousafzai_all_verses.json app/data/yousafzai_all_verses.json
cp /path/to/updated/audio_map.json google_drive_audio_urls.json

# 2. (Optional) Preprocess fresh frequency data if text changed significantly
node precompute_word_frequencies.js > app/data/word_frequency_list_enriched.json
mv app/data/word_frequency_list_enriched.json app/data/word_frequency_list.json
node precompute_word_frequencies.js --yousafzai > app/data/yousafzai_word_frequency_list_enriched.json
mv app/data/yousafzai_word_frequency_list_enriched.json app/data/yousafzai_word_frequency_list.json

# 3. Run ingestion (clears everything, then repopulates)
node ingest_to_production_schema.js

# 4. Verify
# Check logs for ✅ marks
# Spot-check Genesis 1:1
# Verify audio coverage
```

**Result:** All three tables wiped and repopulated. No data drift. All rows fresh.

**Time:** 30-40 minutes (including preprocessing if needed)

---

### 2. Audio URL Updates Only (Without touching verses)

When you update Google Drive audio mappings but text stays the same:

```bash
# 1. Update only the audio map
cp /path/to/new/audio_urls.json google_drive_audio_urls.json

# 2. Run ingestion with default truncate
node ingest_to_production_schema.js

# 3. Verify audio coverage improved
# Check .ingestion_progress.json for summary
```

**What happens:**
- ✅ Verses re-inserted with **new audio_url values**
- ✅ Word index rebuilt (same data, fresh timestamps)
- ✅ No orphaned rows (TRUNCATE cleaned everything)

**Why run full ingestion instead of audio-only update?**
- Ensures consistency (verses and word index stay in sync)
- Simpler logic (one code path)
- TRUNCATE is fast (~1 sec) so overhead is minimal
- Verification is easier (spot-check known verses)

---

### 3. Incremental Updates (Text appends, new books)

If you're adding new verses without replacing existing ones:

```bash
# 1. Prepare new verses in JSON alongside existing data
# (e.g., add new book chapters to existing files)

# 2. Run with --no-truncate flag
node ingest_to_production_schema.js --no-truncate

# 3. Verify
# New verses appear alongside old ones
# No duplicate refs (upsert handles this)
# Word index updated for new verses only (batched)
```

**What happens:**
- ✅ Existing verses **preserved**
- ✅ New verses **appended or updated** via upsert
- ✅ Word index **re-computed** (includes new verses)
- ✅ Progress file tracks last processed word key

**When to use:**
- Adding new Bible translations mid-year
- Appending new audio for previously missing verses
- Importing corrections/improvements incrementally

---

## 🎵 Audio Management

### Audio URL Storage

Audio URLs live in two places:
1. **google_drive_audio_urls.json** (local source)
   ```json
   {
     "Genesis 1:1": "https://drive.google.com/uc?id=...",
     "Genesis 1:2": "https://drive.google.com/uc?id=..."
   }
   ```

2. **verses.audio_url** (Supabase)
   ```sql
   SELECT ref, audio_url FROM verses WHERE ref = 'Genesis 1:1';
   -- Output: ("Genesis 1:1", "https://drive.google.com/uc?id=...")
   ```

### Updating Audio URLs

**Scenario 1: New audio files uploaded to Google Drive**
```bash
# 1. Update google_drive_audio_urls.json with new IDs
# 2. Run: node ingest_to_production_schema.js
# 3. Verses table gets fresh audio_url values
```

**Scenario 2: Audio moved to Supabase storage**
```bash
# 1. Before ingestion, modify loadAudioMapping() in script:
#    Change: const audioMap = JSON.parse(await fs.readFile(...))
#    To: const audioMap = await fetchFromSupabaseStorage(...)

# 2. Run: node ingest_to_production_schema.js
# 3. Verses table populates with Supabase storage URLs
```

**Scenario 3: Audio URL format changes (e.g., CDN switch)**
```bash
# 1. Update google_drive_audio_urls.json with new URL format
# 2. Or modify loadAudioMapping() to transform URLs
# 3. Run: node ingest_to_production_schema.js
# 4. All verses reflect new URL format
```

**Key:** Audio URLs are **data**, not logic. Update the source file or mapping function, re-run ingestion.

---

## 🛠️ Adding New Features (Without Breaking Phase 1)

### Pattern: Add via Flags and Optional Tables

**Example: Add Phase 2 LingDocs enrichment**

```bash
# Phase 1 (MVP): Run as-is
node ingest_to_production_schema.js

# Phase 2 (Optional): Same script, new flag
node ingest_to_production_schema.js --with-lingdocs
```

**How it works:**
1. Script checks for `--with-lingdocs` flag
2. If present, loads additional enrichment step (reuses existing adapters)
3. If absent, skips enrichment (Phase 1 only)
4. Either way, verses + word_occurrence_index are populated first

**Same pattern for future additions:**

```bash
# Hypothetical Phase 3: Cross-translation lemmas
node ingest_to_production_schema.js --with-lingdocs --with-cross-translation

# Add new audio package
node ingest_to_production_schema.js --audio-source=aws-s3

# Add new text translation
node ingest_to_production_schema.js --add-translation=dari
```

**Each flag:**
- ✅ Reuses existing core ingestion (verses + word index)
- ✅ Adds optional table or column
- ✅ Doesn't break old code paths
- ✅ Self-documenting (flag name explains what it does)

---

## 📈 Future Roadmap Integrations

### Adding a New Bible Translation

**Goal:** Import Dari translation alongside existing Afghan/Yousafzai

**Steps:**
1. Create new source file: `app/data/dari_all_verses.json`
2. Add to `loadVersesData()` function:
   ```javascript
   async function loadVersesData() {
     const { afghanData, yousafzaiData, dariData } = await Promise.all([
       // existing...
       loadFromFile('app/data/dari_all_verses.json')
     ]);
   }
   ```
3. Update `insertVerses()`:
   ```javascript
   // For Dari verses
   const dariVerses = dariData.map(v => ({
     ...v,
     translation_key: 'dari2024',
     dialect: 'dari',
     audio_url: audioMap[`${v.book} ${v.chapter}:${v.verse}`]
   }));
   
   await supabase.from('verses_dari').insert(dariVerses);
   ```
4. Update `buildWordOccurrenceIndex()` to include Dari frequency data
5. Run: `node ingest_to_production_schema.js`

**Result:**
- ✅ New `verses_dari` table created (same schema)
- ✅ Dari frequencies in `word_occurrence_index` (translation_key='dari2024')
- ✅ Search API routes queries to correct table based on translation param
- ✅ No changes to existing Afghan/Yousafzai data

**Time:** ~30 mins (mostly config, ingestion handles the rest)

---

### Adding Audio Metadata (duration, speaker, etc.)

**Goal:** Store audio duration and speaker info alongside URL

**Steps:**
1. Extend google_drive_audio_urls.json:
   ```json
   {
     "Genesis 1:1": {
       "url": "https://drive.google.com/uc?id=...",
       "duration_ms": 12500,
       "speaker": "Faiz Ahmed"
     }
   }
   ```
2. Alter verses table:
   ```sql
   ALTER TABLE public.verses
   ADD COLUMN IF NOT EXISTS audio_duration_ms INTEGER,
   ADD COLUMN IF NOT EXISTS audio_speaker TEXT;
   ```
3. Update ingestion to extract and store:
   ```javascript
   const audioEntry = audioMap[ref];
   const audioUrl = typeof audioEntry === 'string' 
     ? audioEntry 
     : audioEntry?.url;
   const audioDuration = typeof audioEntry === 'object' 
     ? audioEntry?.duration_ms 
     : null;
   ```
4. Run: `node ingest_to_production_schema.js`

**Result:**
- ✅ Verses table now has audio metadata
- ✅ Search API can filter by speaker or duration
- ✅ Old queries still work (new columns optional)

---

### Adding Full-Text Search

**Goal:** Enable fuzzy/full-text search on verse text

**Steps:**
1. Create PostgreSQL text search index:
   ```sql
   ALTER TABLE public.verses
   ADD COLUMN tsv TSVECTOR;

   CREATE TRIGGER verses_tsv_update BEFORE INSERT OR UPDATE
   ON public.verses FOR EACH ROW EXECUTE FUNCTION
   tsvector_update_trigger(tsv, 'pg_catalog.english', text);

   CREATE INDEX idx_verses_tsv ON public.verses USING GIN(tsv);
   ```
2. Update search API to use:
   ```typescript
   const { data } = await supabase
     .rpc('fulltext_search', { query: 'خدا کتاب', limit: 100 });
   ```

**Result:**
- ✅ Full-text search queries return ranked results
- ✅ Ingestion doesn't change (triggers handle indexing)
- ✅ Coexists with word_occurrence_index (different use case)

---

## 🚨 Emergency Procedures

### Rollback to Previous State

**Problem:** Ingestion failed halfway, Supabase is partially updated

**Solution:**
1. Check `.ingestion_progress.json` for last successful step
2. Fix the issue (e.g., corrupted input file)
3. Delete `.ingestion_progress.json` to reset progress
4. Re-run: `node ingest_to_production_schema.js`
5. Script will TRUNCATE and start fresh

**Result:** Clean state, no partial data.

---

### Preserve Data During Development

**Problem:** Want to test new ingestion logic without wiping production

**Solution:**
```bash
# Create staging database in Supabase
# Set environment variable:
export NEXT_PUBLIC_SUPABASE_URL="https://staging-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="staging-key"

# Run ingestion against staging
node ingest_to_production_schema.js

# Test new features, verify performance
# When confident, point to production and re-run
```

---

### Partial Data Recovery

**Problem:** Only word index failed, verses are intact

**Solution:**
1. Keep `.ingestion_progress.json` to preserve state
2. Fix the word indexing issue
3. Run: `node ingest_to_production_schema.js --no-truncate --rebuild-word-index-only`
4. Only word_occurrence_index is rebuilt; verses untouched

*(Note: This flag doesn't exist yet, but can be added if needed)*

---

## 📊 Monitoring and Alerts

### What to Check After Every Ingestion

```bash
# 1. Ingestion success
tail -100 .ingestion_progress.json | jq '.completedSteps'
# Should show: ["clear_tables", "insert_verses", "build_word_index", "verify"]

# 2. Verse counts
SELECT COUNT(*) FROM verses;              # Should be ~8,000
SELECT COUNT(*) FROM verses_yousafzai;    # Should be ~7,800

# 3. Word coverage
SELECT COUNT(*) FROM word_occurrence_index WHERE translation_key='afghan2023';
# Should be ~12,400 (or similar based on frequency data)

# 4. Audio coverage
SELECT COUNT(*) FROM verses WHERE audio_url IS NOT NULL;
# Should be > 80% of total verses

# 5. Random spot-check
SELECT ref, text, audio_url FROM verses WHERE ref LIKE 'Genesis 1:%' LIMIT 5;
# Verify text displays correctly, audio URL is valid
```

### Set Up Alerts (Optional)

Monitor these via cron job or CI/CD:
- Word index count < 1000 (indicates preprocessing failure)
- Audio coverage < 50% (indicates mapping issue)
- Ingestion runtime > 60 mins (indicates performance regression)

---

## 🔐 Security Considerations

### Protect SERVICE_ROLE_KEY

**Never commit to git:**
```bash
# .env (local, not committed)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# .env.production (CI/CD, set via secrets)
SUPABASE_SERVICE_ROLE_KEY=${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

### Row-Level Security (RLS)

Current ingestion uses service role (bypasses RLS for speed). When adding user auth:

```sql
-- Enable RLS on verses
ALTER TABLE public.verses ENABLE ROW LEVEL SECURITY;

-- All users can read (no RLS policy = public)
-- Only service role can write (ingestion)
```

Service-role key is only used during ingestion, never at query time.

---

## 📝 Checklists

### Before Ingestion
- [ ] Local source files updated
- [ ] Preprocessing complete (if frequency data changed)
- [ ] SERVICE_ROLE_KEY valid in .env
- [ ] Supabase project accessible
- [ ] Backup of current data (if paranoid)
- [ ] Migration guide ready (for new features)

### After Ingestion
- [ ] All ✅ marks in logs
- [ ] Spot-check Genesis 1:1 verse text
- [ ] Spot-check Genesis 1:1 audio URL valid
- [ ] Audio coverage > 80%
- [ ] Word count matches expected (~12,400)
- [ ] Search API tested with sample query
- [ ] Response time < 100ms

### Before Production Promotion
- [ ] Tested on staging environment
- [ ] Performance benchmarked
- [ ] Data quality verified
- [ ] Team approved
- [ ] Rollback plan documented
- [ ] Monitoring configured

---

## 🎓 Operational Philosophy

**Principle 1: Data is immutable until refresh**
- TRUNCATE → INSERT pattern prevents partial updates
- Every ingestion produces same result from same source files
- Reproducible, auditable, safe

**Principle 2: Extend via flags, not code duplication**
- `--with-lingdocs`, `--no-truncate` enable optional features
- Core ingestion path unchanged
- Future developers see intent clearly

**Principle 3: Single source of truth**
- All Supabase data flows through ingestion script
- No manual SQL updates
- No side scripts bypassing validation
- Guarantees consistency

**Principle 4: Audio is replaceable**
- URLs live in source JSON, not hardcoded
- Update mapping, re-run ingestion
- Supports CDN changes, storage migrations, new audio sets

**Principle 5: Graceful expansion**
- New translations, tables, enrichment add via flags
- Existing queries unaffected
- Roadmap phases build without reshaping foundations

---

## 📞 Support

**Issue:** Ingestion hangs
→ Check .ingestion_progress.json for last successful step, likely resume point

**Issue:** Audio URLs invalid after update
→ Verify google_drive_audio_urls.json format, check a sample URL in browser

**Issue:** Want to test changes without affecting production
→ Create staging Supabase project, point script there, run ingestion

**Issue:** Data drift between production and staging
→ Run ingestion on both with same source files; should match exactly

**Issue:** Need to add new feature/table
→ Follow "Adding New Features" pattern above; use `--flag` approach
