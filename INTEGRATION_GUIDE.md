# Pashto Bible Search - D1 Integration & Dictionary Detection Guide

## Current Architecture Overview

### How Search Currently Works

```
User Query: "وهل"
    ↓
1. Standard Search (includeRelated=false)
   - Searches exact word "وهل" in verses
   - Returns matching verses directly
   
2. Related Forms Mode (includeRelated=true) 
   - Generates variants: وهي, ووهي, به وهي, etc.
   - Expands search to all variants
   - Returns verses matching ANY variant
```

### Current Flow Diagram

```
┌─────────────────┐
│  User Query     │
│  "وهل"          │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  GET /api/search?q=وهل              │
│  includeRelated=false (default)     │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Direct Verse Search                │
│  - Search word_occurrence_index     │
│  - Return matching verses           │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Response: Verses with "وهل"       │
└─────────────────────────────────────┘
```

## New D1 Integration Architecture

### How D1 Verb Variants Work

The new `getVerbVariants()` function integrates D1 database:

```typescript
// app/api/search/route.ts (lines 519-545)

async function getVerbVariants(word: string, opts?: {...}): Promise<Variant[]> {
  // 1. Try D1 first (verb_forms table)
  const d1Variants = await fetchVerbVariantsFromD1(word, { cap });
  
  // 2. Fallback to LingDocs generator if D1 insufficient
  if (d1Variants.length < threshold) {
    const fallback = await generateVerbVariants(word, opts);
    return mergeVariantLists(d1Variants, fallback);
  }
  
  return d1Variants;
}
```

### D1 Query Flow

```
Query: "وهل"
    ↓
resolveVerbRoot()
    ├─→ Check word_frequencies.base_verb
    ├─→ Check form_to_root mapping  
    └─→ Check verbs_lexicon.verb_root
    ↓
Root: "وهل"
    ↓
fetchVerbVariantsFromD1()
    ├─→ Query verb_forms WHERE verb_root = "وهل"
    ├─→ JOIN word_frequencies (for counts)
    ├─→ JOIN verbs_lexicon (for POS/flags)
    └─→ Return variants with metadata
    ↓
Variants: [
  { form: "وهي", label: "3sg Present", count: 45, sources: ['d1'] },
  { form: "ووهي", label: "3sg Subjunctive", count: 12, sources: ['d1'] },
  ...
]
```

## Proposed UX Change: Dictionary Detection + Optional Form Expansion

### New Flow

```
User Query: "وهل"
    ↓
┌─────────────────────────────────────┐
│  Dictionary Detection               │
│  - Check verbs_lexicon              │
│  - Check word_frequencies           │
│  - Check nouns_lexicon (future)     │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Found Dictionary Entry?            │
│  ✓ Yes → "وهل" is a verb root      │
└────────┬────────────────────────────┘
         │
         ├─→ YES ────────────────────┐
         │                             │
         ▼                             ▼
┌─────────────────────────┐   ┌──────────────────────────┐
│ Standard Search        │   │ Response with Option     │
│ - Search exact "وهل"   │   │ {                        │
│ - Return verses        │   │   results: [...],        │
└─────────────────────────┘   │   dictionaryMatch: {     │
                              │     word: "وهل",        │
                              │     pos: "verb",        │
                              │     hasVariants: true,  │
                              │     variants: [...]     │
                              │   },                    │
                              │   canExpand: true       │
                              │ }                       │
                              └──────────────────────────┘
```

## Implementation Plan

### Step 1: Add Dictionary Detection Function

```typescript
// app/api/search/route.ts

async function detectDictionaryTerm(
  word: string,
  db: any
): Promise<{
  found: boolean;
  type: 'verb' | 'noun' | 'adjective' | null;
  root?: string;
  variants?: Variant[];
  lingdocsId?: number;
} | null> {
  const { getD1Database, queryD1, queryD1First } = await import('@/utils/d1');
  const d1db = getD1Database();
  if (!d1db) return null;

  const normalized = word.trim();
  
  // 1. Check verbs_lexicon
  try {
    const verbRow = await queryD1First<{
      verb_root: string;
      lingdocs_id?: number;
    }>(
      d1db,
      `SELECT verb_root, lingdocs_id 
       FROM verbs_lexicon 
       WHERE verb_root = ? OR infinitive = ?
       LIMIT 1`,
      [normalized, normalized]
    );
    
    if (verbRow?.verb_root) {
      // Fetch variants for this verb
      const variants = await getVerbVariants(verbRow.verb_root, { cap: 20 });
      return {
        found: true,
        type: 'verb',
        root: verbRow.verb_root,
        variants,
        lingdocsId: verbRow.lingdocs_id,
      };
    }
  } catch (error) {
    console.warn('Dictionary detection failed for verbs:', error);
  }

  // 2. Check word_frequencies for base_verb/base_noun
  try {
    const freqRow = await queryD1First<{
      base_verb?: string;
      base_noun?: string;
    }>(
      d1db,
      `SELECT base_verb, base_noun 
       FROM word_frequencies 
       WHERE pashto_word = ?
       LIMIT 1`,
      [normalized]
    );
    
    if (freqRow?.base_verb) {
      const variants = await getVerbVariants(freqRow.base_verb, { cap: 20 });
      return {
        found: true,
        type: 'verb',
        root: freqRow.base_verb,
        variants,
      };
    }
    
    // TODO: Add noun variant detection when nouns_lexicon is ready
    if (freqRow?.base_noun) {
      return {
        found: true,
        type: 'noun',
        root: freqRow.base_noun,
      };
    }
  } catch (error) {
    console.warn('Dictionary detection failed for word_frequencies:', error);
  }

  return null;
}
```

### Step 2: Modify GET Handler to Detect Dictionary Terms

```typescript
// In GET handler, after processing query:

// Detect if this is a dictionary term
const dictionaryMatch = await detectDictionaryTerm(convertedQuery, db);

// Always do standard search first
const standardResults = await searchVersesD1(convertedQuery, {...});

// Build response
const response = {
  results: standardResults,
  query: convertedQuery,
  dictionaryMatch: dictionaryMatch ? {
    word: dictionaryMatch.root || convertedQuery,
    pos: dictionaryMatch.type,
    hasVariants: dictionaryMatch.variants && dictionaryMatch.variants.length > 0,
    variantCount: dictionaryMatch.variants?.length || 0,
    lingdocsId: dictionaryMatch.lingdocsId,
    // Don't include full variants yet - only if user clicks "Expand"
    previewVariants: dictionaryMatch.variants?.slice(0, 5) || [],
  } : null,
  canExpand: dictionaryMatch?.variants && dictionaryMatch.variants.length > 0,
};
```

### Step 3: Add Expand Endpoint

```typescript
// app/api/search/expand/route.ts (NEW FILE)

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { word, root } = await request.json();
  
  if (!word && !root) {
    return NextResponse.json({ error: 'Missing word or root' }, { status: 400 });
  }
  
  const targetWord = root || word;
  
  // Fetch all variants
  const variants = await getVerbVariants(targetWord, { cap: 60 });
  
  // Expand search to all variants
  const searchTerms = variants.map(v => v.form);
  
  // Search with expanded terms
  const expandedResults = await searchVersesD1(targetWord, {
    // Use searchVersesByForms for multiple terms
    forms: searchTerms,
    limit: 100,
  });
  
  return NextResponse.json({
    variants,
    results: expandedResults,
    expandedTerms: searchTerms,
  });
}
```

### Step 4: Frontend Integration

```typescript
// In your SearchResults component

interface SearchResponse {
  results: Verse[];
  dictionaryMatch?: {
    word: string;
    pos: 'verb' | 'noun' | 'adjective';
    hasVariants: boolean;
    variantCount: number;
    previewVariants: Variant[];
    lingdocsId?: number;
  };
  canExpand: boolean;
}

// In component:
{response.dictionaryMatch && (
  <div className="dictionary-match-banner">
    <p>
      Found dictionary entry: <strong>{response.dictionaryMatch.word}</strong>
      {' '}({response.dictionaryMatch.pos})
    </p>
    {response.dictionaryMatch.hasVariants && (
      <button onClick={handleExpandSearch}>
        Search {response.dictionaryMatch.variantCount} related forms
      </button>
    )}
    {response.dictionaryMatch.previewVariants.length > 0 && (
      <div className="variant-preview">
        {response.dictionaryMatch.previewVariants.map(v => (
          <span key={v.form}>{v.form}</span>
        ))}
      </div>
    )}
  </div>
)}
```

## Current Integration Status

### ✅ Already Implemented

1. **D1 Verb Variants** (`fetchVerbVariantsFromD1`)
   - Schema introspection
   - Root resolution (word_frequencies, form_to_root, verbs_lexicon)
   - Frequency-based ordering
   - Source tracking

2. **Video Matching** (`fetchVideoMatches`)
   - Queries video_word_mappings
   - Aggregates by video
   - Returns segments with timestamps

3. **Inflection Reasons** (word-analysis route)
   - Reads inflection_reasons table
   - Returns grammatical tooltips

### 🔄 Needs Implementation

1. **Dictionary Detection** - Detect if query matches dictionary entry
2. **Optional Expansion** - Offer form expansion as UI option
3. **Noun Variants** - Extend to nouns (when nouns_lexicon ready)
4. **LingDocs Links** - Add "View in LingDocs" links using lingdocs_id

## Example: How "وهل" Would Work

### Current Behavior
```
Query: "وهل"
→ Searches only "وهل"
→ Returns ~10 verses
```

### New Behavior
```
Query: "وهل"
→ Detects: Dictionary verb root "وهل"
→ Standard search: Returns ~10 verses with "وهل"
→ Response includes:
   {
     results: [...],
     dictionaryMatch: {
       word: "وهل",
       pos: "verb",
       hasVariants: true,
       variantCount: 13,
       previewVariants: ["وهي", "ووهي", "به وهي", ...]
     },
     canExpand: true
   }
→ User clicks "Search 13 related forms"
→ POST /api/search/expand { word: "وهل" }
→ Returns expanded results with all variants
```

## Implementation Status

### ✅ Completed

1. **`detectDictionaryTerm()` function** - Added to `app/api/search/route.ts` (lines 545-687)
   - Checks `verbs_lexicon` for direct matches
   - Checks `word_frequencies.base_verb` for mapped forms
   - Checks `form_to_root` for inflected forms
   - Returns variants, lingdocs_id, verb_type, helper

2. **Dictionary detection in POST handler** - Modified response (lines 2430-2480)
   - Detects dictionary terms for Pashto queries (when `includeRelated=false`)
   - Includes `dictionaryMatch` in response with preview variants
   - Sets `canExpand` flag when variants available

3. **`/api/search/expand` endpoint** - Created `app/api/search/expand/route.ts`
   - Accepts POST with `{ word, root, scope, limit, translation }`
   - Fetches all variants for the word
   - Expands search to all variant forms
   - Returns expanded results

### 🔄 Next Steps

1. **Update frontend** to show dictionary match banner
   - Display dictionary match info when `dictionaryMatch` is present
   - Show "Search X related forms" button when `canExpand: true`
   - Call `/api/search/expand` endpoint on button click

2. **Add LingDocs links** using `lingdocsId` from `dictionaryMatch`
   - Link format: `https://dictionary.lingdocs.com/word?id={lingdocsId}`

3. **Extract shared utilities** - Move `getVerbVariants`, `getVerbFormsSchema`, `resolveVerbRoot` to shared utility file to avoid duplication

4. **Add noun variant support** - When `nouns_lexicon` table is ready, extend detection to nouns

