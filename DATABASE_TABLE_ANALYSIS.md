# Database Table Analysis & Integration Plan

## Current State Analysis

### 1. `verbs_lexicon` - EMPTY (0 rows) ❌
**Purpose**: Fast verb lookup table (LingDocs-style)
**Schema**: `pashto_word`, `imperfective_stem`, `perfective_stem`, `perfective_root`, `past_participle`, `pos`, `romanization`, `english`
**Status**: Table exists but is empty
**Intended Use**: Used by `cloudflare/worker-api.ts` and `app/api/word-analysis/route.ts` for verb lookups
**Problem**: Code queries it but gets no results because it's empty

**Solution**: Populate from `word_frequencies` where `word_type = 'verb'` OR run `scripts/create-verbs-lexicon-table.py` which generates SQL but hasn't been executed

### 2. `nouns_lexicon` - POPULATED (2,360 rows) ✅
**Purpose**: Noun-specific inflection data
**Schema**: `pashto_word`, `romanized`, `gender`, `number`, `plural_forms`, `inflection_pattern`, `inflection_type`
**Status**: Has data, separate from `word_frequencies`
**Current Use**: Used by `app/api/word-analysis/route.ts` for noun lookups
**Integration**: Currently separate - nouns have specialized inflection data that `word_frequencies` doesn't capture

**Question**: Should noun inflection data be merged into `word_frequencies` or kept separate?

### 3. `word_category_mappings` - POPULATED but with ERRORS ⚠️
**Purpose**: Categorize words (age_stages, places, actions, etc.)
**Schema**: `pashto_word`, `category_key`, `confidence`
**Status**: Has data but user reports "many errors"
**Current Use**: Queryable but may have incorrect mappings
**Problem**: Data quality issues - needs cleanup

**Solution**: 
- Review/cleanup script needed
- Could be used for filtering in LexiconPanel but needs validation

### 4. `word_frequency_update_log` - EMPTY (1 row, no real data) ❌
**Purpose**: Track when word frequencies are updated
**Schema**: `updated_at`, `words_updated`
**Status**: Exists but not being used
**Problem**: No logging mechanism currently records updates

**Solution**: Either populate it OR remove if not needed

### 5. `word_source_mapping` - EMPTY ❌
**Purpose**: Track word sources (bible, video, poem, etc.)
**Schema**: `pashto_word`, `source_type`, `source_id`, `frequency`, `translation_key`
**Status**: Empty - designed to track where words come from
**Problem**: Not populated, so can't track sources

**Solution**: Populate from existing data (verses, videos) OR remove if not needed

### 6. `word_verse_mapping` - LARGE (45,500 rows) ✅
**Purpose**: Map each word occurrence to specific Bible verses
**Schema**: `pashto_word`, `verse_id`, `verse_ref`, `translation_key`, `testament`, `book`, `chapter`, `verse`, `word_position`
**Status**: Has substantial data
**Current Use**: Could be used for verse-level search but may not be efficiently queried
**Question**: Is this actually being used effectively in search?

## Integration Strategy

### Option 1: Consolidate Everything into `word_frequencies` (Recommended)
**Pros**:
- Single source of truth
- Fast filtering by any field
- Matches your goal of "robust, categorized data for rapid searching"

**Cons**:
- Large table (already 27,872 rows)
- May lose some specialized data structure

### Option 2: Keep Separate but Link Properly
**Pros**:
- Maintains specialized structures
- Can optimize each table separately

**Cons**:
- More complex queries
- Duplication risk
- Harder to maintain

## Recommended Actions

### Immediate (High Priority)

1. **Populate `verbs_lexicon`** from `word_frequencies`:
   ```sql
   INSERT INTO verbs_lexicon (pashto_word, imperfective_stem, perfective_stem, perfective_root, past_participle, pos, romanization, english)
   SELECT pashto_word, imperfective_stem, perfective_stem, perfective_root, past_participle, pos, romanization, NULL
   FROM word_frequencies
   WHERE word_type = 'verb' AND base_verb = pashto_word
   ```

2. **Integrate `nouns_lexicon` data into `word_frequencies`**:
   - Add noun-specific columns: `gender`, `number`, `plural_forms`, `inflection_pattern`
   - Update `word_frequencies` from `nouns_lexicon` where they match

3. **Clean up `word_category_mappings`**:
   - Create validation script
   - Remove incorrect mappings
   - Use for filtering in UI

### Medium Priority

4. **Populate `word_source_mapping`** from `word_verse_mapping`:
   - Extract unique words and their sources
   - Populate `word_source_mapping` table

5. **Optimize `word_verse_mapping` queries**:
   - Check if it's being used efficiently
   - Add indexes if needed
   - Consider materialized views for common queries

### Low Priority

6. **Decide on `word_frequency_update_log`**:
   - Either implement logging OR remove table

## Files to Create

1. `scripts/populate-verbs-lexicon-from-word-frequencies.py` - Populate verbs_lexicon
2. `scripts/integrate-nouns-lexicon.py` - Merge nouns_lexicon into word_frequencies
3. `scripts/validate-word-categories.py` - Clean up word_category_mappings
4. `scripts/populate-word-source-mapping.py` - Extract sources from word_verse_mapping

