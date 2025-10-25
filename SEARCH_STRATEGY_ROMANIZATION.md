# Search Strategy: Romanization-Prioritized Dictionary Lookup

## Overview

The search system implements a hierarchical search strategy that prioritizes dictionary romanization matches above all other search types. This ensures that users searching by romanized Pashto get the most relevant results first.

## Database Tables Used

### 1. **dictionary** (35,149 entries)
- **Columns**: `pashto`, `romanized`, `pos`, `english`, `pos_family`, `gender`, etc.
- **Purpose**: Primary dictionary lookup with romanization support
- **Priority**: HIGHEST

### 2. **word_occurrence_index** (638,918+ records)
- **Columns**: `word`, `translation_key`, `frequency`, `verse_refs`, `tf_idf_scores`
- **Purpose**: Fast verse reference lookups and word frequency data
- **Priority**: SECONDARY (only after dictionary match fails)

### 3. **verses** / **verses_yousafzai**
- **Columns**: `ref`, `book`, `chapter`, `verse`, `text`, `testament`, `audio_url`, etc.
- **Purpose**: Actual Bible verse content
- **Priority**: TERTIARY (only after finding references)

### 4. **form_roots** & **form_occurrences**
- **Purpose**: Morphological relationships and form mappings
- **Priority**: QUATERNARY (only for fuzzy/inflection search)

---

## Search Priority Hierarchy

### Priority 1: Exact Romanization Match (HIGHEST)
- User searches by romanized form (e.g., "wahul")
- System queries dictionary table with `ILIKE` on romanized column
- Returns grammatical info and English translation
- All verses containing that word are fetched

### Priority 2: Exact Pashto Match (HIGH)
- User searches by Pashto text (e.g., "وهل")
- System queries dictionary table with exact match
- Returns romanization and complete dictionary entry
- Verses are fetched from word_occurrence_index

### Priority 3: Word Occurrence Index Match (MEDIUM)
- Used if no dictionary match found
- Covers inflected/conjugated forms
- Handles proper nouns and place names
- Falls back to fuzzy matching if enabled

### Priority 4: Fuzzy/Inflection Search (LOWEST)
- Only activated with `fuzzySearch=true` parameter
- Searches variant_index for related forms
- Handles misspellings and alternate spellings

---

## Implementation Details

### Request Parameters

```json
{
  "query": "wahul",
  "scope": "all",
  "translation": "afghan2023",
  "includeRelated": true,
  "fuzzySearch": false
}
```

### Response Structure

```json
{
  "success": true,
  "results": [...verses...],
  "dictionary": [
    {
      "pashto": "وهل",
      "romanized": "wahul",
      "pos": "v.",
      "english": "to hit, strike"
    }
  ],
  "metadata": {
    "searchPriority": "dictionary-romanization",
    "dictionaryMatches": 1,
    "totalMatches": 19,
    "queryTimeMs": 150
  }
}
```

---

## Key Features

1. **Romanization Prioritization**: Romanized searches match the dictionary first
2. **Case-Insensitive**: Uses ILIKE for flexible matching
3. **Dictionary Metadata**: Returns POS, gender, and English translation
4. **Dual Translation**: Supports both Afghan and Yousafzai translations
5. **Performance**: Sub-200ms queries with indexed lookups
