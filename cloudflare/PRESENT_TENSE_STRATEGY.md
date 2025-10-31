# Present Tense Verb Conjugation Strategy

## Approach

Instead of migrating the entire inflections cache, we're building the lexicon from scratch using **LingDocs pashto-inflector** library, starting with **present tense endings** for all verbs.

## Present Tense Endings (Example: کول - kawul)

| Person | Number | Form | Romanization |
|--------|--------|------|--------------|
| 1st | Singular | کوم | kawúm |
| 1st | Plural | کوو | kawóo |
| 2nd | Singular | کوې | kawé |
| 2nd | Plural | کوئ | kawéy |
| 3rd | Singular | کوي | kawée |
| 3rd | Plural | کوي | kawée |

## Implementation

### Script: `cloudflare/generate-present-tense-verbs.ts`

This script:
1. **Loads verbs** from dictionary (`full_dictionary_enriched.json`)
2. **Uses LingDocs** to generate present tense conjugations via `generateVerbVariantsLingDocs()`
3. **Extracts present tense forms** from LingDocs output (filters by labels like "1sg Present", "2pl Present")
4. **Falls back to pattern-based generation** if LingDocs unavailable:
   - کول → stem "کو" → کوم, کوو, کوې, کوئ, کوي, کوي
   - کېدل → stem "کې" → کېم, کېو, کېې, کېئ, کېي, کېي
5. **Generates SQL** for D1 with proper categorization:
   - `inflections` table: base_word → inflected_form with grammatical_info
   - `form_to_root` table: form → root mapping

### Data Structure

Each inflection is stored with:
```json
{
  "category": "verb",
  "tense": "present",
  "person": "1st|2nd|3rd",
  "number": "singular|plural",
  "label": "1st singular Present"
}
```

### Usage

```bash
# Generate SQL for all verbs
npx tsx cloudflare/generate-present-tense-verbs.ts

# Execute migration
wrangler d1 execute pashto-bible-db --remote --file=.temp-present-tense-verbs.sql
```

## Next Steps

1. ✅ **Present Tense** - Start here (current script)
2. ⏳ **Past Tense** - Add past tense endings
3. ⏳ **Subjunctive** - Add subjunctive forms
4. ⏳ **Imperative** - Add imperative forms
5. ⏳ **Participles** - Add past/present participles
6. ⏳ **Noun Inflections** - Add noun declensions
7. ⏳ **Adjective Inflections** - Add adjective forms

## Benefits

- **Well-categorized**: Each form has clear grammatical labels
- **Bidirectional mapping**: Root → Forms AND Form → Root
- **LingDocs-powered**: Uses authoritative Pashto grammar engine
- **Incremental**: Can add tenses/forms progressively
- **Searchable**: Forms immediately searchable via D1 API

## Example Output

For verb **کول**:
- `inflections`: 6 rows (کوم, کوو, کوې, کوئ, کوي, کوي)
- `form_to_root`: 6 rows (each form → کول)

All forms are properly categorized and searchable!

