# Database Tables Analysis

## Current Status

### ✅ **Active Tables (Used)**

1. **`verses_afghan2023`** (22,359 rows)
   - Afghan 2023 translation verses
   - **Status**: Active, being used

2. **`verses_yousafzai`** (29,414 rows)
   - Yousafzai 2019 translation verses
   - **Status**: Active, being used

3. **`word_frequencies`** (11,421 rows)
   - Comprehensive word frequency list
   - Includes base forms, word types, inflection types, compound types
   - Breakdown by translation (afghan2023/yousafzai2019) and testament (OT/NT)
   - **Status**: Active, being rebuilt with comprehensive tokenization

4. **`word_verse_mapping`** (45,500 rows)
   - Maps words to verses they appear in
   - Includes base_form for efficient searches
   - **Status**: Active, used for fast word-verse lookups

### ⚠️ **Legacy/Redundant Tables**

5. **`verses`** (26,865 rows)
   - **Purpose**: Original unified verses table
   - **Status**: REDUNDANT - replaced by `verses_afghan2023` and `verses_yousafzai`
   - **Action**: Can be deleted (data exists in separate tables)

### ❌ **Empty Tables (Not Populated)**

6. **`dictionary`** (0 rows)
   - **Purpose**: Was intended to store dictionary entries
   - **Status**: NOT USED - dictionary data is in `app/data/full_dictionary_enriched.json`
   - **Action**: Can be deleted (not being used)

7. **`grammar_rules`** (0 rows)
   - **Purpose**: Was intended to store grammar rules
   - **Status**: NOT USED - grammar rules are in code/Python files
   - **Action**: Can be deleted (not being used)

8. **`irregular_verbs`** (0 rows)
   - **Purpose**: Was intended to store irregular verb forms
   - **Status**: NOT USED - irregular verbs handled by LingDocs library
   - **Action**: Can be deleted (not being used)

9. **`nouns_lexicon`** (0 rows)
   - **Purpose**: Was intended to store noun lexicon
   - **Status**: NOT USED - nouns handled by LingDocs library and word_frequencies
   - **Action**: Can be deleted (not being used)

10. **`verbs_lexicon`** (0 rows)
    - **Purpose**: Was intended to store verb lexicon
    - **Status**: NOT USED - verbs handled by LingDocs library and word_frequencies
    - **Action**: Can be deleted (not being used)

11. **`video_transcripts`** (0 rows)
    - **Purpose**: Was intended to store video transcripts
    - **Status**: NOT USED - video processing not implemented in D1
    - **Action**: Can be deleted (not being used)

## Recommendations

### Immediate Actions

1. **Delete redundant `verses` table**
   - All data exists in `verses_afghan2023` and `verses_yousafzai`
   - Saves storage space

2. **Delete all empty tables**
   - `dictionary`, `grammar_rules`, `irregular_verbs`, `nouns_lexicon`, `verbs_lexicon`, `video_transcripts`
   - These were planned but never populated
   - If needed in future, can be recreated

### Keep These Tables

- ✅ `verses_afghan2023` - Active verse data
- ✅ `verses_yousafzai` - Active verse data
- ✅ `word_frequencies` - Active word analysis
- ✅ `word_verse_mapping` - Active search index

## Summary

**Total tables**: 11 (+ 1 sqlite_sequence system table)
- **Active**: 4 tables
- **Redundant**: 1 table (`verses`)
- **Empty/Unused**: 6 tables

**Can safely delete**: 7 tables (1 redundant + 6 empty)

