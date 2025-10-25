# Database Schema Optimization Plan

## Current Problem: Fragmented Tables

Your Supabase has **too many overlapping tables** causing:
- ❌ Slow searches (need to join multiple tables)
- ❌ Data consistency issues (Afghan 2023 may not be indexed)
- ❌ Wasted storage (638MB+ in fragmented tables)
- ❌ Hard to maintain (updates needed in multiple places)

### Current Fragmentation:

**Dictionary/Word Data (7 tables):**
```
dictionary (35,149 rows) ...................... Master dictionary
word_dictionary (9,020 rows) .................. Duplicate?
romanized_dictionary (5,150 rows) ............ Partial romanization
word_frequencies (15,756 rows) .............. Word frequency data
word_frequencies_unified (10,264 rows) ..... Another frequency table
enriched_dictionary (2,160 rows) ............ Partial enrichment
+ nouns_lexicon, verbs_lexicon ............. More duplicates
```

**Occurrence Data (4 tables):**
```
word_occurrence_index (638,918 rows) ........ Main index
form_occurrences (7,405 rows) ............... Form-specific
ot_occurrences (16,106 rows) ................ OT-only
verse_occurrences (0 rows) .................. Empty table
```

---

## Solution: Unified Fast Schema

### Phase 1: Core Tables (Essential)

**1. unified_dictionary** - Single source of truth
```sql
CREATE TABLE public.unified_dictionary (
  id BIGSERIAL PRIMARY KEY,
  pashto TEXT NOT NULL,
  romanized TEXT,
  english TEXT,
  pos TEXT,
  frequency INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pashto)
);

CREATE INDEX idx_unified_dict_pashto ON unified_dictionary (pashto);
CREATE INDEX idx_unified_dict_romanized ON unified_dictionary (romanized);
CREATE INDEX idx_unified_dict_frequency ON unified_dictionary (frequency DESC);
```

**2. unified_word_occurrence** - All word occurrences indexed
```sql
CREATE TABLE public.unified_word_occurrence (
  id BIGSERIAL PRIMARY KEY,
  word TEXT NOT NULL,
  book TEXT NOT NULL,
  chapter INT NOT NULL,
  verse INT NOT NULL,
  testament TEXT,
  translation_key TEXT NOT NULL, -- 'afghan2023', 'yousafzai2019'
  frequency INT DEFAULT 1,
  verse_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_word_occ_word ON unified_word_occurrence (word, translation_key);
CREATE INDEX idx_word_occ_translation ON unified_word_occurrence (translation_key);
CREATE INDEX idx_word_occ_testament ON unified_word_occurrence (testament);
CREATE INDEX idx_word_occ_book_ch_v ON unified_word_occurrence (book, chapter, verse);
```

**3. verses_metadata** - Fast verse lookup
```sql
CREATE TABLE public.verses_metadata (
  ref TEXT PRIMARY KEY,
  book TEXT NOT NULL,
  chapter INT NOT NULL,
  verse INT NOT NULL,
  testament TEXT,
  translation_key TEXT NOT NULL,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_verses_metadata_ref ON verses_metadata (ref, translation_key);
CREATE INDEX idx_verses_metadata_translation ON verses_metadata (translation_key);
```

---

## Migration Steps

### Step 1: Verify Current Data

```sql
-- Check what translation_key values exist
SELECT DISTINCT translation_key, COUNT(*) as count
FROM word_occurrence_index
GROUP BY translation_key;

-- Check if afghan2023 data exists
SELECT COUNT(*) FROM word_occurrence_index 
WHERE translation_key = 'afghan2023' 
AND frequency > 0;
```

### Step 2: Backup (Optional but Recommended)

Your data is safe in Supabase, but consider exporting critical tables first.

### Step 3: Identify Unused Tables

Tables to likely **DELETE** (after verification):
- `word_dictionary` (if data is in `dictionary`)
- `romanized_dictionary` (if data is in `dictionary`)
- `enriched_dictionary` (if not used by frontend)
- `phrase_form_stats` (empty - 0 rows)
- `word_form_stats` (empty - 0 rows)
- `morphological_analysis` (empty - 0 rows)
- `grammar_rules` (empty - 0 rows)
- `inflections` (5 rows - likely unused)
- `verse_occurrences` (empty - 0 rows)

### Step 4: Keep These (Core Tables)

- `verses` (Afghan 2023 - 24,160 rows)
- `verses_yousafzai` (Yousafzai 2019 - 30,410 rows)
- `dictionary` (35,149 rows - master dictionary)
- `word_occurrence_index` (638,918 rows - your search index)
- `word_frequencies` (frequency data)

---

## Why Afghan 2023 Returns 0 Results

**Most Likely Cause:** The `word_occurrence_index` might not have rows with `translation_key = 'afghan2023'`

**Check this in Supabase SQL Editor:**
```sql
-- Check Afghan 2023 data
SELECT translation_key, COUNT(*) as word_count
FROM word_occurrence_index
GROUP BY translation_key
ORDER BY word_count DESC;

-- Check if "وهل" exists
SELECT * FROM word_occurrence_index
WHERE word = 'وهل'
LIMIT 10;

-- Check verses tables
SELECT COUNT(*) FROM verses;
SELECT COUNT(*) FROM verses_yousafzai;
```

---

## Recommended Actions

### Immediate (Quick Fix)

1. **Verify which tables are actually used** by your frontend
2. **Check translation_key values** in word_occurrence_index
3. **Regenerate word_occurrence_index** if Afghan 2023 data is missing:
   ```sql
   -- Rebuild index for Afghan 2023
   INSERT INTO word_occurrence_index (word, book, chapter, verse, translation_key, frequency, verse_refs)
   SELECT 
     (regexp_split_to_array(text, '\s+'))[idx] as word,
     book, chapter, verse,
     'afghan2023' as translation_key,
     1 as frequency,
     ARRAY[concat(book, ' ', chapter, ':', verse)] as verse_refs
   FROM verses
   CROSS JOIN generate_subscripts(regexp_split_to_array(text, '\s+'), 1) AS idx
   WHERE verses.text IS NOT NULL;
   ```

### Medium-term (Cleanup)

1. **Consolidate dictionary tables** into one `unified_dictionary`
2. **Delete unused empty tables** to reduce clutter
3. **Rebuild word_occurrence_index** with proper data for both translations

### Long-term (Best Practice)

1. **Use single unified schema** for all data
2. **Add proper indexing** for fast queries
3. **Set up automated data synchronization** between tables
4. **Monitor query performance** regularly

---

## Quick Diagnostic

Run this in Supabase SQL Editor to understand your current state:

```sql
-- Size of each table
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    (SELECT COUNT(*) FROM pg_class WHERE relname = tablename) as row_count
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check translation keys in word_occurrence_index
SELECT DISTINCT translation_key, COUNT(*) as count
FROM word_occurrence_index
GROUP BY translation_key;

-- Sample words per translation
SELECT translation_key, word, frequency
FROM word_occurrence_index
WHERE translation_key = 'afghan2023'
LIMIT 5;
```

---

## Next Steps

1. **Run the diagnostic queries above** in Supabase
2. **Share the results** so we know which tables have data
3. **I can create a migration script** to consolidate the schema
4. **Then your search will be much faster** and more reliable
