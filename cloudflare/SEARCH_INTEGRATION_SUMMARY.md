# Search Tool Integration with D1 Lexicon Data

## Overview

Integrated comprehensive word frequency data, verb dictionary entries with stems, and verse mappings into the search tool using Cloudflare D1. Updated inflection/conjugation search to use D1 data with proper translation demarcation (Afghan 2023 vs Yousafzai 2019).

## Completed Integrations

### 1. Word Frequency List Integration ✅

- **Source**: `word_frequency_list.json` + `word_index.json` + `full_dictionary_enriched.json`
- **Destination**: D1 `word_frequencies` table
- **Stats**: 
  - 27,872 words uploaded
  - 12,501 words with verse references in `form_occurrences`
  - Frequency counts, rankings, romanization, POS included

### 2. Verb Dictionary Integration ✅

- **Source**: LingDocs dictionary (`full_dictionary_enriched.json`)
- **Destination**: D1 `verbs_lexicon` and `irregular_verbs` tables
- **Stem Data**: All `psp`, `ssp`, `prp` fields preserved
- **Stats**: 3,081 verbs (2,767 regular + 314 irregular)

### 3. Inflection/Conjugation Search ✅

- **Updated**: `/api/related_forms` endpoint
- **Features**:
  - Uses D1 `inflections` table for cached forms
  - Uses D1 `form_to_root` for reverse lookups
  - Uses LingDocs library for verb/noun/adjective generation
  - Falls back to pattern-based generation if LingDocs unavailable
  - **Translation demarcation**: Afghan 2023 vs Yousafzai 2019

### 4. Noun/Adjective Inflection Support ✅

**Yes, nouns and adjectives have inflection patterns** similar to verbs:

#### Noun Inflection Patterns (from [LingDocs Grammar](https://grammar.lingdocs.com/inflection/inflection-patterns/)):
- **Pattern 1**: Basic consonant/ه (masculine/feminine)
  - Example: اتفاق → اتفاقو (2nd inflection), اتفاقونه (plural)
- **Pattern 2**: Unstressed ی
- **Pattern 3**: Stressed áy (سوری → سوري, سوریو)
- **Pattern 4**: Pashtoon (پښتون → پښتانه)
- **Pattern 5**: Short squish
- **Pattern 6**: Feminine inanimate ee
- **Vocative forms**: [LingDocs Vocative](https://grammar.lingdocs.com/inflection/vocative/)
- **"Mayonnaise" (second inflection)**: [LingDocs Mayonnaise](https://grammar.lingdocs.com/inflection/mayonnaise/)

#### Adjective Inflection Patterns:
- Similar to nouns but simpler
- Base, Feminine, Oblique, Plural forms
- Example: مفرد → مفرده (feminine), مفردې (oblique), مفردو (plural)

## Updated Files

### 1. `/app/api/related_forms/route.ts`
- **New**: Uses D1 `inflections` table
- **New**: Uses D1 `form_to_root` for reverse lookups
- **New**: Uses D1 `form_occurrences` for verse references
- **New**: Supports translation parameter (`afghan2023` | `yousafzai2019`)
- **New**: Adjective inflection generation using LingDocs patterns
- **Enhanced**: Verb/noun generation merges D1 data with LingDocs output

### 2. `/cloudflare/worker-api.ts`
- **New**: `GET /api/form-occurrences?form={form}&translation={translation}`
  - Returns verse references for a word form
  - Supports translation filtering
- **Updated**: `GET /api/inflections/reverse?form={form}`
  - Uses D1 `form_to_root` table

### 3. `/app/api/search/route.ts`
- **Updated**: Passes `translation` parameter to `/api/related_forms`
- **Updated**: Uses D1-based related forms endpoint

## Translation Demarcation

All API endpoints now support translation filtering:

```typescript
// Related forms with translation
POST /api/related_forms
{
  "form": "کول",
  "translation": "afghan2023" // or "yousafzai2019"
}

// Form occurrences with translation
GET /api/form-occurrences?form=کول&translation=afghan2023

// Verse search with translation
GET /api/search?q=کول&translation=afghan2023
```

## Data Flow

```
User Search Query
    ↓
/api/search (with translation parameter)
    ↓
/api/related_forms (D1 + LingDocs)
    ├─→ D1 inflections table
    ├─→ D1 form_to_root (reverse lookup)
    ├─→ D1 verbs_lexicon/irregular_verbs
    ├─→ D1 nouns_lexicon
    ├─→ LingDocs library (verb/noun/adjective generation)
    └─→ D1 form_occurrences (verse references)
    ↓
Search Results with Translation Demarcation
```

## API Endpoints

### D1 Lexicon Endpoints (Cloudflare Worker)

1. **`GET /api/inflections?base_word={word}`**
   - Get all inflections for a base word
   - Returns: inflected forms with grammatical_info

2. **`GET /api/inflections/reverse?form={form}`**
   - Find base word from inflected form
   - Uses: `form_to_root` table

3. **`GET /api/verbs/{root}`**
   - Get verb conjugation data
   - Returns: stems, roots, past_participle, romanization

4. **`GET /api/nouns/{word}`**
   - Get noun lexicon data
   - Returns: plural_forms, gender, examples

5. **`GET /api/form-occurrences?form={form}&translation={translation}`**
   - Get verse references for a word form
   - Supports translation filtering

### Next.js API Endpoints

1. **`POST /api/related_forms`**
   - Comprehensive inflection/conjugation search
   - Uses: D1 + LingDocs hybrid approach
   - Supports: verbs, nouns, adjectives
   - Translation-aware

## Usage Example

```typescript
// Search for inflections/conjugations
const response = await fetch('/api/related_forms', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    form: 'کول',
    translation: 'afghan2023'
  })
});

const data = await response.json();
// Returns:
// {
//   root: "کول",
//   searchedForm: "کول",
//   forms: {
//     verbs: [
//       { form: "کوم", label: "1sg Present", pos: "verb", count: 10 },
//       { form: "کوو", label: "1pl Present", pos: "verb", count: 5 },
//       ...
//     ],
//     nouns: [...],
//     adjectives: [...]
//   },
//   translation: "afghan2023",
//   metadata: {
//     source: "d1",
//     generationStrategy: "d1-lingdocs-hybrid",
//     ...
//   }
// }
```

## Next Steps

1. ✅ **Word frequency integration** - COMPLETED
2. ✅ **Verb dictionary integration** - COMPLETED
3. ✅ **Verse mapping integration** - COMPLETED
4. ✅ **Inflection/conjugation search** - COMPLETED
5. ✅ **Noun/adjective inflection support** - COMPLETED
6. ✅ **Translation demarcation** - COMPLETED
7. ⏳ **Populate D1 inflections table** - PENDING (need to run present tense migration)
8. ⏳ **Populate form_to_root mapping** - PENDING

## Notes

- Nouns and adjectives **do have inflection patterns** spelled out in LingDocs:
  - [Inflection Patterns](https://grammar.lingdocs.com/inflection/inflection-patterns/)
  - [Vocative](https://grammar.lingdocs.com/inflection/vocative/)
  - [Mayonnaise (Second Inflection)](https://grammar.lingdocs.com/inflection/mayonnaise/)
- The integration uses a **hybrid approach**:
  - D1 for cached/stored inflections (fast)
  - LingDocs library for on-the-fly generation (comprehensive)
  - Pattern-based fallback (reliable)
- Translation demarcation ensures Afghan 2023 and Yousafzai 2019 data are kept separate


