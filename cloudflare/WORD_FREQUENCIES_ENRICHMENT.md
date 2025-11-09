# Word Frequencies Enrichment Summary

## Overview
This document describes how other database tables are used to enrich the `word_frequencies` table.

## Enrichment Process

### Step 1: Inflection Type from `nouns_lexicon`
- **Source**: `nouns_lexicon.inflection_type`
- **Target**: `word_frequencies.inflection_type`
- **Impact**: 38 words updated

### Step 2: Romanization from `nouns_lexicon`
- **Source**: `nouns_lexicon.romanized`
- **Target**: `word_frequencies.romanization`
- **Impact**: 32 words updated

### Step 3: Part of Speech from `nouns_lexicon`
- **Source**: `nouns_lexicon.gender` → converted to `n. m.` or `n. f.`
- **Target**: `word_frequencies.pos`
- **Impact**: 1 word updated

### Step 4: Base Form from `inflection_reasons`
- **Source**: `inflection_reasons.base_word`
- **Target**: `word_frequencies.base_form`
- **Impact**: 1 word updated

### Step 5: Inflection Type from `inflection_reasons`
- **Source**: `inflection_reasons.inflection_type`
- **Target**: `word_frequencies.inflection_type`
- **Impact**: 1 word updated

### Step 6: Word Type Classification
- **Logic**: Update `word_type` based on `inflection_type`:
  - `1st` or `2nd` → `inflected`
  - `plain` + noun POS → `noun`
  - `plain` + adjective POS → `adjective`
- **Impact**: 2,284 words updated

## Results

### Before Enrichment
- Many NULL values in `inflection_type`, `romanization`, `pos`
- Many entries had `has_issues = 1` with flags like `["no_dictionary_match", "no_part_of_speech"]`

### After Enrichment
- **Total words**: 2,921 nouns/adjectives
- **With inflection_type**: 2,724 (93.3%)
- **With romanization**: 2,712 (92.8%)
- **With pos**: 2,728 (93.4%)
- **With base_form**: 298 (10.2%)
- **Without issues**: 2,869 (98.2%)

## Data Flow

```
nouns_lexicon
    ├─→ inflection_type → word_frequencies.inflection_type
    ├─→ romanized → word_frequencies.romanization
    └─→ gender → word_frequencies.pos (n. m./n. f.)

inflection_reasons
    ├─→ base_word → word_frequencies.base_form
    └─→ inflection_type → word_frequencies.inflection_type

form_occurrences
    └─→ (future: verse_count calculation)

word_frequencies
    └─→ inflection_type → word_type (classification)
```

## Usage

To re-run enrichment:
```bash
# Run all steps sequentially
for file in cloudflare/enrich-step*.sql; do
  wrangler d1 execute pashto-bible-db --remote --file="$file"
done
```

## Future Enhancements

1. **Verse Count from `form_occurrences`**: Calculate actual verse counts from JSON arrays
2. **Cross-reference with `verbs_lexicon`**: Identify verb forms
3. **Use `word_category_mappings`**: Add category information
4. **Aggregate frequency data**: Sum frequencies from different translations









