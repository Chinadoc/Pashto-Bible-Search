# LingDocs Irregular Conjugations Integration

## Overview

This document describes the integration of comprehensive irregular verb conjugations from the [LingDocs pashto-inflector](https://github.com/lingdocs/pashto-inflector) library into our search system.

## Source

The LingDocs [`irregular-conjugations.ts`](https://github.com/lingdocs/pashto-inflector/blob/main/src/lib/src/irregular-conjugations.ts) file contains complete `VerbConjugation` objects with:

- **Present tense**: indicative, subjunctive, imperative
- **Perfective tense**: all person/gender/number combinations
- **Perfect tense**: past participles with auxiliary verbs
- **Past tense**: simple past, continuous past, habitual past
- **Modal forms**: ability (کېدلی شم), hypothetical (به کېدلی شم)
- **All person/gender/number combinations**: 1sg, 2sg, 3sg, 1pl, 2pl, 3pl, with masculine/feminine variants

## Extraction

**Script**: `scripts/extract-lingdocs-irregular-conjugations.py`

- Downloads the TypeScript file from GitHub
- Extracts all Pashto forms and romanizations
- Groups forms by verb root
- Outputs JSON: `lingdocs_irregular_conjugations.json`

**Results**:
- **6 verbs** extracted: کېدل, کول, تلل, ورکول, درکول, راکول
- **1,536 total forms** across all verbs
- **142 forms** for کېدل alone

## Database Integration

**Script**: `scripts/integrate-lingdocs-irregular-conjugations.py`

Creates `verb_forms` table with all morphological variants:

```sql
CREATE TABLE IF NOT EXISTS verb_forms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  verb_root TEXT NOT NULL,
  form TEXT NOT NULL,
  form_type TEXT,  -- 'present', 'past', 'perfective', 'imperative', 'modal', etc.
  person TEXT,     -- '1sg', '2sg', '3sg', '1pl', '2pl', '3pl'
  gender TEXT,     -- 'm', 'f'
  number TEXT,     -- 'sg', 'pl'
  aspect TEXT,     -- 'imperfective', 'perfective'
  tense TEXT,      -- 'present', 'past', 'future', etc.
  mood TEXT,       -- 'indicative', 'subjunctive', 'imperative', 'modal'
  romanization TEXT,
  UNIQUE(verb_root, form)
);
```

**Generated SQL**: `cloudflare/integrate-lingdocs-irregular-conjugations.sql`
- Updates `verbs_lexicon` with correct stems
- Inserts 1,536 forms into `verb_forms` table
- Creates indexes for fast lookups

## Search Integration

**Module**: `app/utils/lingdocs-irregular-conjugations.ts`

Functions:
- `getIrregularVerbForms(verbRoot)`: Get all forms from `verb_forms` table
- `checkIrregularVerb(verbRoot)`: Check if verb is irregular (with fallback)
- `getCompoundVerbFormsWithIrregularAux(compoundVerb)`: Generate compound forms using irregular auxiliary conjugations

**Usage in search**: `app/api/search_phrase/route.ts`

When searching for "ښکېل کېدل":
1. Detects compound verb with irregular auxiliary (کېدل)
2. Queries `verb_forms` for all کېدل conjugations (142 forms)
3. Generates compound forms: "ښکېل کېږم", "ښکېل شول", "ښکېل شوی", etc.
4. Includes both spaced and squished forms
5. Searches Bible for all variants

## Benefits

1. **Comprehensive coverage**: All morphological variants from LingDocs
2. **Fast lookups**: Indexed `verb_forms` table for instant form retrieval
3. **Compound verb support**: Proper handling of compound verbs with irregular auxiliaries
4. **Future-proof**: Easy to add more verbs from LingDocs

## Next Steps

1. **Run the SQL**: Execute `cloudflare/integrate-lingdocs-irregular-conjugations.sql`
   ```bash
   wrangler d1 execute pashto-bible-db --remote --file cloudflare/integrate-lingdocs-irregular-conjugations.sql
   ```

2. **Test search**: Try searching for "ښکېل کېدل" - should now find all conjugated forms

3. **Expand coverage**: Add more irregular verbs from LingDocs as needed

4. **Update regularly**: Re-run extraction script when LingDocs updates their conjugations

## Files Created

- `scripts/extract-lingdocs-irregular-conjugations.py` - Extract forms from TypeScript
- `scripts/integrate-lingdocs-irregular-conjugations.py` - Generate SQL for D1
- `app/utils/lingdocs-irregular-conjugations.ts` - TypeScript integration module
- `lingdocs_irregular_conjugations.json` - Extracted forms data
- `cloudflare/integrate-lingdocs-irregular-conjugations.sql` - Database migration SQL

## Example: "ښکېل کېدل" Search

When searching for "ښکېل کېدل" with "Search Inflections/Conjugations" enabled:

1. **Detects**: Compound stative verb with irregular auxiliary (کېدل)
2. **Queries**: `verb_forms` table for کېدل forms
3. **Generates**: 
   - Present: ښکېل کېږم, ښکېلېږم, ښکېل کېږې, etc.
   - Perfective: ښکېل شول, ښکېل شوی, ښکېل شوې, etc.
   - Modal: ښکېل کېدلی شم, ښکېل کېدلای شم, etc.
   - All person/gender/number combinations
4. **Searches**: Bible for all 142+ variants
5. **Results**: Finds verses containing any conjugated form

This ensures comprehensive search coverage matching the LingDocs interface!

