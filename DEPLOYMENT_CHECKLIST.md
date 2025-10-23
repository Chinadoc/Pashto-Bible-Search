# Production Deployment Execution Plan

## Environment Setup ✅
- ✅ Node.js v24.3.0 available
- ✅ Supabase keys in .env.local
- ✅ All source data present

## Phase 1: Data Preprocessing (STEP 1)
**Status:** Ready to execute
**Time:** 15-20 minutes
**Files:**
- Input: app/data/word_frequency_list.json (751K)
- Input: app/data/yousafzai_word_frequency_list.json (524K)
- Output: Enriched frequency JSONs with verse_refs + TF-IDF

**Command:**
```bash
node precompute_word_frequencies.js > app/data/word_frequency_list_enriched.json &
node precompute_word_frequencies.js --yousafzai > app/data/yousafzai_word_frequency_list_enriched.json &
wait
```

## Phase 2: Ingestion to Supabase (STEP 2)
**Status:** Ready after preprocessing
**Time:** 20-30 minutes
**Will:**
- Clear existing tables (TRUNCATE)
- Insert verses (8,000 Afghan + 7,800 Yousafzai)
- Build word_occurrence_index (12,400+ words)
- Verify with spot-checks

**Command:**
```bash
node ingest_to_production_schema.js
```

## Phase 3: Verification (STEP 3)
**Status:** After ingestion
**Checks:**
- Genesis 1:1 spot-check
- Audio coverage > 80%
- Word index count > 12,000
- Query performance < 100ms

