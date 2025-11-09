# How Dictionary Detection & Form Expansion Works

## Overview

The system now automatically detects when a search query matches a dictionary entry (verb root, noun base, etc.) and offers an option to expand the search to include all related forms. This replaces the previous "related forms mode" toggle with a smarter, on-demand expansion.

## Flow Diagram

```
User searches: "وهل"
    ↓
POST /api/search
    ├─→ Standard search: Find verses with "وهل"
    ├─→ Dictionary detection: Check if "وهل" is a verb root
    │   ├─→ Check verbs_lexicon ✓ Found!
    │   ├─→ Fetch variants: ["وهي", "ووهي", "به وهي", ...]
    │   └─→ Return dictionaryMatch in response
    ↓
Response includes:
{
  results: [...verses with "وهل"...],
  dictionaryMatch: {
    word: "وهل",
    pos: "verb",
    hasVariants: true,
    variantCount: 13,
    previewVariants: ["وهي", "ووهي", ...],
    lingdocsId: 1527815399
  },
  canExpand: true
}
    ↓
Frontend shows banner:
"Found dictionary entry: وهل (verb)"
[Search 13 related forms] button
    ↓
User clicks button
    ↓
POST /api/search/expand { word: "وهل" }
    ├─→ Fetch all 13 variants
    ├─→ Search verses with ALL variants
    └─→ Return expanded results
    ↓
Response:
{
  variants: [...all 13 variants...],
  results: [...verses matching ANY variant...],
  expandedTerms: ["وهل", "وهي", "ووهي", ...]
}
```

## Implementation Details

### 1. Dictionary Detection (`detectDictionaryTerm`)

**Location**: `app/api/search/route.ts` (lines 545-687)

**How it works**:
1. Checks `verbs_lexicon` table for direct match
2. Checks `word_frequencies.base_verb` for mapped forms
3. Checks `form_to_root` for inflected forms
4. Returns dictionary metadata including variants

**Example**:
```typescript
const detected = await detectDictionaryTerm("وهل");
// Returns:
{
  found: true,
  type: "verb",
  root: "وهل",
  variants: [
    { form: "وهي", label: "3sg Present", count: 45 },
    { form: "ووهي", label: "3sg Subjunctive", count: 12 },
    ...
  ],
  lingdocsId: 1527815399,
  verbType: "dynamic_compound",
  helper: "کول"
}
```

### 2. Search Response Enhancement

**Location**: `app/api/search/route.ts` (lines 2430-2480)

**What happens**:
- For Pashto queries with `includeRelated=false`
- Automatically detects dictionary terms
- Includes `dictionaryMatch` in response
- Sets `canExpand` flag when variants available

**Response structure**:
```typescript
{
  results: Verse[],           // Standard search results
  dictionaryMatch: {           // NEW: Dictionary detection
    word: string,
    pos: "verb" | "noun" | "adjective",
    hasVariants: boolean,
    variantCount: number,
    previewVariants: Variant[], // First 5 variants
    lingdocsId?: number,
    verbType?: string,
    helper?: string
  },
  canExpand: boolean           // NEW: Can expand search
}
```

### 3. Expand Endpoint

**Location**: `app/api/search/expand/route.ts`

**Endpoint**: `POST /api/search/expand`

**Request body**:
```typescript
{
  word: string,        // The word to expand
  root?: string,       // Optional: use this root instead
  scope?: "all" | "ot" | "nt",
  limit?: number,
  translation?: "afghan2023" | "yousafzai2019"
}
```

**What it does**:
1. Fetches all variants for the word from D1
2. Expands search to include all variant forms
3. Returns verses matching ANY variant

**Response**:
```typescript
{
  variants: Variant[],          // All variants found
  results: Verse[],             // Expanded search results
  expandedTerms: string[],     // All terms searched
  word: string,
  variantCount: number,
  resultCount: number
}
```

## Database Tables Used

### `verbs_lexicon`
- Stores verb roots and metadata
- Columns: `verb_root`, `infinitive`, `lingdocs_id`, `verb_type`, `helper`
- Used for: Dictionary detection

### `verb_forms`
- Stores all conjugated verb forms
- Columns: `form`, `verb_root`, `tense`, `person`, `number`, `gender`, `mood`
- Used for: Variant generation

### `word_frequencies`
- Maps inflected forms to base forms
- Columns: `pashto_word`, `base_verb`, `base_noun`, `frequency_count`
- Used for: Root resolution

### `form_to_root`
- Maps any form to its root
- Columns: `form`, `root`
- Used for: Root resolution for inflected forms

## Example Usage

### Standard Search (No Expansion)
```bash
POST /api/search
{
  "query": "وهل",
  "includeRelated": false
}

Response:
{
  "results": [...verses with "وهل"...],
  "dictionaryMatch": {
    "word": "وهل",
    "pos": "verb",
    "hasVariants": true,
    "variantCount": 13,
    "previewVariants": [
      {"form": "وهي", "label": "3sg Present", "count": 45},
      {"form": "ووهي", "label": "3sg Subjunctive", "count": 12}
    ],
    "lingdocsId": 1527815399
  },
  "canExpand": true
}
```

### Expanded Search
```bash
POST /api/search/expand
{
  "word": "وهل",
  "scope": "all",
  "limit": 200
}

Response:
{
  "variants": [
    {"form": "وهل", "label": "Root"},
    {"form": "وهي", "label": "3sg Present", "count": 45},
    {"form": "ووهي", "label": "3sg Subjunctive", "count": 12},
    ...
  ],
  "results": [...verses matching ANY variant...],
  "expandedTerms": ["وهل", "وهي", "ووهي", "به وهي", ...],
  "variantCount": 13,
  "resultCount": 156
}
```

## Frontend Integration

### Display Dictionary Match Banner

```typescript
{response.dictionaryMatch && (
  <div className="dictionary-match-banner">
    <p>
      Found dictionary entry: <strong>{response.dictionaryMatch.word}</strong>
      {' '}({response.dictionaryMatch.pos})
      {response.dictionaryMatch.lingdocsId && (
        <a href={`https://dictionary.lingdocs.com/word?id=${response.dictionaryMatch.lingdocsId}`}>
          View in LingDocs
        </a>
      )}
    </p>
    {response.dictionaryMatch.hasVariants && (
      <>
        <button onClick={handleExpandSearch}>
          Search {response.dictionaryMatch.variantCount} related forms
        </button>
        <div className="variant-preview">
          {response.dictionaryMatch.previewVariants.map(v => (
            <span key={v.form}>{v.form}</span>
          ))}
        </div>
      </>
    )}
  </div>
)}
```

### Handle Expand Search

```typescript
async function handleExpandSearch() {
  const word = response.dictionaryMatch.word;
  
  const expandResponse = await fetch('/api/search/expand', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      word,
      scope: currentScope,
      limit: 200,
      translation: currentTranslation
    })
  });
  
  const expanded = await expandResponse.json();
  // Update UI with expanded results
  setResults(expanded.results);
  setVariants(expanded.variants);
}
```

## Benefits

1. **Smarter UX**: Only shows expansion option when dictionary entry is detected
2. **Performance**: Standard search is fast, expansion is on-demand
3. **Transparency**: Shows preview variants before expanding
4. **LingDocs Integration**: Links to LingDocs dictionary entries
5. **Flexible**: Works with verbs now, easily extensible to nouns/adjectives

## Next Steps

1. **Frontend Implementation**: Add dictionary match banner UI
2. **Noun Support**: Extend to nouns when `nouns_lexicon` table is ready
3. **Shared Utilities**: Extract common functions to avoid duplication
4. **Caching**: Cache dictionary detection results for performance

