# LingDocs Database Migration Guide

This guide explains how to migrate your D1 database to align with LingDocs format.

## Overview

The migration process:
1. Adds new tables and columns for LingDocs-compatible structure
2. Processes LingDocs dictionary entries to extract structured data
3. Normalizes existing `grammatical_info` fields
4. Compares D1 data with LingDocs output to identify differences

## Files Created

- `scripts/migrate_to_lingdocs_format.sql` - Database migration SQL
- `scripts/process_lingdocs_dictionary.ts` - Processes LingDocs entries
- `scripts/normalize_existing_data.ts` - Normalizes existing data
- `scripts/compare_lingdocs_d1.ts` - Comparison utilities
- `scripts/main_processing.ts` - Main processing script
- `scripts/run_lingdocs_migration.sh` - Shell script runner

## Step-by-Step Migration

### 1. Run Database Migration

Apply the SQL migration to your D1 database:

```bash
# For local SQLite file
sqlite3 your_database.db < scripts/migrate_to_lingdocs_format.sql

# For Cloudflare D1 (via Wrangler)
wrangler d1 execute YOUR_DATABASE --file=scripts/migrate_to_lingdocs_format.sql
```

This creates:
- New columns in `verbs_lexicon` (verb_type, complement, auxiliary_verb, transitivity)
- New table `verb_conjugations` (structured conjugation data)
- New table `verb_metadata` (verb entry metadata)
- New columns in `inflections` (normalized grammatical info)
- New table `noun_metadata` (noun inflection patterns)
- New table `comparison_log` (for tracking differences)

### 2. Process LingDocs Dictionary

Run the processing script to populate new tables:

```bash
# Using Node.js directly
node -r ts-node/register scripts/main_processing.ts --db-path ./your_database.db

# Or use the shell script
./scripts/run_lingdocs_migration.sh --db-path ./your_database.db
```

Options:
- `--compare-only` - Only compare without updating
- `--update-only` - Only update without comparing
- `--batch-size N` - Process N records at a time
- `--dict-url URL` - Custom dictionary URL

### 3. Normalize Existing Data

The script automatically normalizes existing `grammatical_info` fields, but you can also run it separately:

```typescript
import { normalizeGrammaticalInfo, generateNormalizationSQL } from './scripts/normalize_existing_data';

// Normalize a single record
const normalized = normalizeGrammaticalInfo("1sg Present", "verb");

// Generate SQL for batch normalization
const sqlStatements = await generateNormalizationSQL(db, 1000);
```

### 4. Compare and Validate

Compare D1 data with LingDocs output:

```typescript
import { compareWord, batchCompare, generateSummary } from './scripts/compare_lingdocs_d1';

// Compare a single word
const result = await compareWord(db, lingdocsEntry, linkedEntry);

// Batch compare
const results = await batchCompare(db, entries, linkedEntriesMap);
const summary = generateSummary(results);

console.log(`Exact matches: ${summary.total_exact_matches}`);
console.log(`Missing in D1: ${summary.total_missing_in_d1}`);
```

## Database Schema Changes

### New Columns in `verbs_lexicon`

```sql
verb_type TEXT              -- 'regular', 'stative_compound', 'dynamic_compound', etc.
complement TEXT             -- For compound verbs: "ښکېل"
auxiliary_verb TEXT        -- For compound verbs: "کېدل" or "کول"
transitivity TEXT          -- 'transitive', 'intransitive', 'grammatically_transitive'
```

### New Table: `verb_conjugations`

Structured conjugation data matching LingDocs format:

```sql
verb_root TEXT
aspect TEXT                 -- 'imperfective' | 'perfective'
mood TEXT                   -- 'nonImperative' | 'imperative'
length TEXT                 -- 'long' | 'short' | NULL
person INTEGER              -- 0-5 (0=1sg, 1=2sg, 2=3sg, 3=1pl, 4=2pl, 5=3pl)
gender INTEGER             -- 0=masc, 1=fem
form TEXT                  -- The actual Pashto form
romanization TEXT
grammatical_label TEXT     -- Human-readable label
```

### New Columns in `inflections`

```sql
grammatical_info_normalized TEXT  -- JSON with standardized structure
person TEXT                       -- '1sg', '2sg', etc.
tense TEXT                        -- 'Present', 'Subjunctive', etc.
aspect TEXT                       -- 'Imperfective', 'Perfective'
mood TEXT                         -- 'Indicative', 'Subjunctive', 'Imperative'
gender TEXT                       -- 'Masc', 'Fem'
length TEXT                       -- 'long', 'short'
verb_type TEXT                    -- 'regular', 'stative_compound', etc.
inflection_type TEXT              -- 'plain', '1st', '2nd', 'plural', 'vocative'
```

## Normalized Grammatical Info Structure

The `grammatical_info_normalized` field uses this JSON structure:

```json
{
  "person": "1sg" | "2sg" | "3sg" | "1pl" | "2pl" | "3pl" | null,
  "tense": "Present" | "Subjunctive" | "Past" | "Imperative" | "Future" | null,
  "aspect": "Imperfective" | "Perfective" | null,
  "mood": "Indicative" | "Subjunctive" | "Imperative" | null,
  "gender": "Masc" | "Fem" | null,
  "length": "long" | "short" | null,
  "verb_type": "regular" | "stative_compound" | "dynamic_compound" | null,
  "participle_type": "past" | "present" | null,
  "inflection_type": "plain" | "1st" | "2nd" | "plural" | "vocative" | "bundled" | null,
  "pos": "verb" | "noun" | "adjective" | "other"
}
```

## Usage Examples

### Query Verbs by Type

```sql
-- Find all stative compound verbs
SELECT * FROM verb_metadata WHERE verb_type = 'stative_compound';

-- Find verbs with specific auxiliary
SELECT * FROM verb_metadata WHERE auxiliary_verb = 'کېدل';
```

### Query Conjugations by Person/Tense

```sql
-- Find all 1st person present forms
SELECT * FROM verb_conjugations 
WHERE person = 0 AND aspect = 'imperfective' AND mood = 'nonImperative';

-- Find all imperative forms
SELECT * FROM verb_conjugations WHERE mood = 'imperative';
```

### Query Normalized Inflections

```sql
-- Find all present tense forms
SELECT * FROM inflections WHERE tense = 'Present';

-- Find all 1st person forms
SELECT * FROM inflections WHERE person = '1sg' OR person = '1pl';
```

## Troubleshooting

### Migration Errors

If migration fails, check:
1. Database permissions
2. Existing table structure
3. Column conflicts (if columns already exist)

### Processing Errors

If processing fails:
1. Check LingDocs dictionary URL is accessible
2. Verify database connection
3. Check TypeScript compilation errors
4. Review console logs for specific entry errors

### Comparison Issues

If comparisons show many mismatches:
1. Ensure normalization has run
2. Check that grammatical_info parsing is correct
3. Verify LingDocs dictionary version matches

## Next Steps

After migration:
1. Review comparison results
2. Manually fix any critical mismatches
3. Update application code to use new normalized fields
4. Set up regular sync if needed

