# Database Table Analysis & Integration Plan

Updated after dictionary-driven rebuild and verb form precomputation.

## Current Table Status

### `word_frequencies`
- ✅ Primary search index; contains one row per observed form
- Enriched with noun + verb metadata:
  - `gender`, `number`, `plural_forms`, `inflection_pattern`
  - `base_verb`, `form_type`, `verb_type`, `transitivity`
- Coverage snapshot (after latest update):
  - `form_type` populated for **2,887** rows
  - `base_verb` populated for **2,775** rows
- Still the only table hit by UI search and verse lookups → stays lean & indexed

### `verbs_lexicon`
- ✅ Rebuilt directly from `full_dictionary_enriched.json`
- Rows: **3,710**
- Schema now matches API expectations (`verb_root`, stems, roots, past_participle, romanization, english)
- Indexed on `verb_root`, `imperfective_stem`, `perfective_stem`
- Canonical source for verb metadata; no longer dependent on Bible frequency data

### `verb_forms`
- ✅ New table with **237,042** precomputed conjugations
- Columns: `base_verb`, `form`, `form_type`, `tense`, `person`
- Backfills `word_frequencies` instantly (no recomputation) and powers fast lookups of every verb variant

### `nouns_lexicon`
- ✅ Rebuilt from the dictionary
- Rows: **11,138**
- Stores `romanized`, `gender`, `number`, `plural_forms`, `inflection_type`
- `word_frequencies` noun entries now inherit this metadata via integration script

### `word_source_mapping`
- ✅ Populated with **4,195** entries derived from `word_verse_mapping`
- Tracks primary source (e.g., Bible verse) and frequency for each word

### `word_category_mappings`
- ⚠️ Contains category tags (age_stages, places, etc.) but needs QA/cleanup before exposing filters

### `word_frequency_update_log`
- ⚪️ Still empty; keep as a placeholder for future recalc logging or remove later

### `word_verse_mapping`
- ✅ ~45,500 rows mapping words to verses; remains the backbone for Scripture cross-references and source extraction

## Recent Automation (this session)
1. Rebuilt `verbs_lexicon` and `nouns_lexicon` from the enriched dictionary (no dependency on observed frequencies)
2. Generated `verb_forms` table with 237k conjugations for “canonical” coverage
3. Populated `word_source_mapping` using existing verse data
4. Reintegrated noun metadata into `word_frequencies` using the new dictionary-driven lexicon
5. Updated `word_frequencies` verb rows using `verb_forms` for base verb + form type classification

## Next Suggested Steps
1. **Cleanup `word_category_mappings`** – audit/remove incorrect mappings, then expose category filters in the UI
2. **Decide on `word_frequency_update_log`** – wire into future update scripts or drop if unneeded
3. **Leverage `verb_forms` in the API/UI** – e.g. Lexicon panel “show all forms” without recomputation
4. **Streaming ingestion** – classify new word forms on insert using `verb_forms` + `verbs_lexicon`
5. **Dictionary table (optional)** – store `full_dictionary_enriched` in D1 for enterprise queries while keeping searches on `word_frequencies`

