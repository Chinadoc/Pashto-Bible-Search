# Verb Dictionary Migration to Cloudflare D1

## Overview

Migrated all 3,081 verb entries from the LingDocs dictionary (`full_dictionary_enriched.json`) to Cloudflare D1, including stem data (`psp`, `ssp`, `prp`) fields.

## Statistics

- **Total verbs**: 3,081
- **Regular verbs**: 2,767 (stored in `verbs_lexicon` table)
- **Irregular verbs**: 314 (stored in `irregular_verbs` table)
- **Verbs with explicit stem data**: 104

## Generated Files

### 1. Migration Script
- **File**: `cloudflare/migrate-verbs-from-dictionary.ts`
- **Purpose**: Extracts verb entries from dictionary and converts them to D1 schema format
- **Output**: `.temp-verbs-dictionary-migration.sql`

### 2. SQL Migration File
- **File**: `.temp-verbs-dictionary-migration.sql`
- **Contents**: 
  - 2,767 INSERT statements for `verbs_lexicon` table
  - 314 INSERT statements for `irregular_verbs` table
  - Total: 3,081 INSERT statements

## Schema Mapping

### Dictionary Entry → D1 Schema

| Dictionary Field | D1 Field | Notes |
|-----------------|----------|-------|
| `p` (Pashto word) | `verb_root` | Primary identifier |
| `psp` (imperfective stem P) | `stems.imperfective.p` | JSON object |
| `psf` (imperfective stem F) | `stems.imperfective.f` | JSON object |
| `ssp` (perfective stem P) | `stems.perfective.p` | JSON object |
| `ssf` (perfective stem F) | `stems.perfective.f` | JSON object |
| `prp` (perfective root P) | `roots.perfective.p` | JSON object |
| `prf` (perfective root F) | `roots.perfective.f` | JSON object |
| `pprtp` (past participle P) | `past_participle` | Direct mapping |
| `f` (phonetics) | `romanization.f` | JSON object |
| `e` (English) | `examples[0].english` | JSON array |

### Irregularity Detection

A verb is classified as **irregular** if it has:
- Explicit stem data (`psp`, `ssp`, `prp`)
- Special flags (`noOo`, `sepOo`, `shortIntrans`)
- Third person singular special form (`tppp`, `tppf`)
- Explicit English conjugation forms

## Example: اخستل (to take)

**Dictionary Entry:**
```json
{
  "p": "اخستل",
  "f": "akhistúl, akhustúl",
  "e": "to take, buy, purchase, receive",
  "psp": "اخل",
  "psf": "akhl",
  "c": "v. trans."
}
```

**D1 Entry (irregular_verbs):**
```sql
INSERT OR REPLACE INTO irregular_verbs (
  verb_root,
  stems,
  roots,
  past_participle,
  romanization,
  irregularity_type,
  conjugation_pattern,
  examples,
  notes
) VALUES (
  'اخستل',
  '{"imperfective":{"p":"اخل","f":"akhl"}}',
  '{"imperfective":{"p":"اخستل","f":"akhistúl, akhustúl"}}',
  NULL,
  '{"p":"اخستل","f":"akhistúl, akhustúl"}',
  'unknown',
  'regular',
  '[{"pashto":"اخستل","english":"to take, buy, purchase, receive; to shave, cut with scissors","romanization":"akhistúl, akhustúl"}]',
  'English: take,takes,taking,took,taken'
);
```

## Execution Steps

### 1. Execute SQL Migration

```bash
wrangler d1 execute pashto-bible-db --remote --file=.temp-verbs-dictionary-migration.sql
```

### 2. Verify Migration

```bash
# Check verb count
wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM verbs_lexicon;"
wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM irregular_verbs;"

# Check verbs with stems
wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM verbs_lexicon WHERE stems IS NOT NULL;"
wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM irregular_verbs WHERE stems IS NOT NULL;"
```

### 3. Test API Endpoints

```bash
# Test verb lookup
curl "https://pashtobiblesearch.jeremy-samuels17.workers.dev/api/verbs/کول"

# Test irregular verb
curl "https://pashtobiblesearch.jeremy-samuels17.workers.dev/api/verbs/اخستل"
```

## Next Steps

1. ✅ **Upload verb dictionary** - COMPLETED
2. ⏳ **Execute SQL migration** - PENDING
3. ⏳ **Update present tense generation** - Uses dictionary file (can be updated to use D1)
4. ⏳ **Generate present tense forms** - Run `generate-present-tense-verbs.ts` after migration
5. ⏳ **Update Cloudflare Worker API** - Already supports verb queries via `/api/verbs/{root}`

## Usage

### Query Verb Data from D1

The Cloudflare Worker API already supports querying verb data:

```typescript
// Get verb data
const response = await fetch(
  'https://pashtobiblesearch.jeremy-samuels17.workers.dev/api/verbs/کول'
);
const data = await response.json();

// data.verb contains:
// - verb_root
// - stems (imperfective, perfective)
// - roots (imperfective, perfective)
// - past_participle
// - romanization
// - conjugation_pattern
// - examples
```

### Generate Present Tense Forms

After migration, the present tense generation script (`generate-present-tense-verbs.ts`) will:
1. Load verbs from dictionary (can be updated to use D1)
2. Use `psp` (imperfective stem) from dictionary/D1 when available
3. Fall back to pattern-based inference for verbs without stems
4. Generate all 6 present tense forms (1sg, 1pl, 2sg, 2pl, 3sg, 3pl)

## Notes

- The migration preserves all stem data from the dictionary
- Verbs are automatically classified as regular or irregular based on their characteristics
- The `conjugation_pattern` field indicates the type of conjugation (regular, stem_variation, root_variation, etc.)
- The `irregularity_type` field for irregular verbs indicates the type of irregularity









