# LingDocs Integration - How It Works

This guide shows how the LingDocs-verified search integration works and how to use it.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER SEARCH FLOW                                 │
└─────────────────────────────────────────────────────────────────────────┘

1. User types: "وهي"
   ↓
2. Search API detects term via /api/detect-term
   ↓
3. D1 Query Chain:
   verbs_lexicon → verb_forms → form_to_root → nouns_lexicon
   ↓
4. Match found: وهل (wahul) - "to hit" [Verb, Dynamic Compound]
   ↓
5. UI shows banner:
   ┌──────────────────────────────────────────────────────────────┐
   │ 🔄 Found verb: وهل (wahul) - "to hit"                       │
   │    Dynamic compound verb • Helper: کول • transitive         │
   │    [Search all 47 conjugations →]                           │
   │    📖 View in LingDocs dictionary                           │
   └──────────────────────────────────────────────────────────────┘
   ↓
6. User clicks "Search all 47 conjugations"
   ↓
7. API queries verb_forms table (pre-computed from LingDocs):
   SELECT form, tense, person, voice, gender, helper
   FROM verb_forms
   WHERE lemma = 'وهل'
   ↓
8. Returns variants: [وهي, ووهي, وهې, واهي, ...]
   ↓
9. Multi-source search:
   word_verse_mapping → verses
   video_word_mappings → video clips
   category_verse_mappings → topics
   ↓
10. Results displayed with grammar tooltips
```

## Key Components

### 1. Dictionary Term Detection (`DictionaryTermDetection.tsx`)

**Component that shows the smart banner:**

```tsx
<DictionaryTermDetection
  term={{
    lemma: "وهل",
    romanization: "wahul",
    englishTranslation: "to hit, to strike",
    pos: "verb",
    verbType: "dynamic_compound",
    helper: "کول",
    transitivity: "transitive",
    lingdocsId: 1527815399,
    lingdocsUrl: "https://dictionary.lingdocs.com/word?id=1527815399",
    totalForms: 47,
    verbs: 47,
    confidence: "high",
    source: "d1_verified"
  }}
  searchedTerm="وهي"
  onExpandForms={() => {
    // Trigger search with all conjugations
    setIncludeRelated(true);
    executeSearch();
  }}
  isExpanded={includeRelated}
  loading={loading}
/>
```

### 2. Detection API (`/api/detect-term`)

**Queries D1 to identify dictionary terms:**

```typescript
// GET /api/detect-term?term=وهي

// Response:
{
  "term": {
    "lemma": "وهل",
    "romanization": "wahul",
    "englishTranslation": "to hit",
    "pos": "verb",
    "verbType": "dynamic_compound",
    "helper": "کول",
    "transitivity": "transitive",
    "lingdocsId": 1527815399,
    "lingdocsUrl": "https://dictionary.lingdocs.com/word?id=1527815399",
    "totalForms": 47,
    "verbs": 47,
    "confidence": "high",
    "source": "d1_verified",
    "matchedForm": {
      "form": "وهي",
      "tense": "present",
      "person": "3sg",
      "voice": "active"
    }
  }
}
```

### 3. D1 Table Structure

**Tables used for term detection:**

```sql
-- verbs_lexicon: Canonical verb metadata (from LingDocs)
CREATE TABLE verbs_lexicon (
  lemma TEXT PRIMARY KEY,        -- وهل
  verb_type TEXT,                -- dynamic_compound
  helper TEXT,                   -- کول
  transitivity TEXT,             -- transitive
  romanization TEXT,             -- wahul
  english_translation TEXT,      -- to hit
  lingdocs_id INTEGER,          -- 1527815399
  source_checksum TEXT,         -- SHA256 for verification
  stems TEXT,                   -- JSON: {"imperfective": "وه", "perfective": "واه"}
  examples TEXT                 -- JSON array
);

-- verb_forms: Pre-computed conjugations (237K+ forms)
CREATE TABLE verb_forms (
  id INTEGER PRIMARY KEY,
  lemma TEXT,                   -- وهل (foreign key to verbs_lexicon)
  form TEXT,                    -- وهي (actual conjugated form)
  tense TEXT,                   -- present
  person TEXT,                  -- 3sg
  voice TEXT,                   -- active
  gender TEXT,                  -- masculine
  helper TEXT,                  -- کول (for dynamic compounds)
  confidence REAL,              -- 1.0 (high confidence)
  source_word_id INTEGER,       -- 1527815399
  source_checksum TEXT          -- Verification hash
);

-- form_to_root: Reverse lookup (legacy)
CREATE TABLE form_to_root (
  word_form TEXT PRIMARY KEY,   -- وهي
  root_word TEXT,               -- وهل
  frequency INTEGER
);

-- nouns_lexicon: Noun metadata
CREATE TABLE nouns_lexicon (
  pashto_word TEXT PRIMARY KEY,
  gender TEXT,
  animacy TEXT,
  plural_type TEXT,
  romanization TEXT,
  english_translation TEXT
);
```

### 4. Integration Flow

**Step-by-step implementation:**

#### A. Add Detection to Search Page

```tsx
// In ClientHome.tsx or your main search component

import DictionaryTermDetection, { DictionaryTerm } from '@/components/DictionaryTermDetection';
import { useState, useEffect } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [detectedTerm, setDetectedTerm] = useState<DictionaryTerm | null>(null);
  const [includeRelated, setIncludeRelated] = useState(false);
  const [results, setResults] = useState([]);

  // Detect dictionary term when user types
  useEffect(() => {
    if (query.length > 1) {
      fetch(`/api/detect-term?term=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => setDetectedTerm(data.term))
        .catch(err => console.error('Detection failed:', err));
    } else {
      setDetectedTerm(null);
    }
  }, [query]);

  // Execute search (exact term only by default)
  const handleSearch = async () => {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        includeRelated: includeRelated, // Only true if user clicked "expand"
        scope: 'all'
      })
    });
    const data = await response.json();
    setResults(data.results);
  };

  // User clicks "Search all forms"
  const handleExpandForms = () => {
    setIncludeRelated(true);
    // Trigger new search with all forms
    setTimeout(handleSearch, 0);
  };

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <button onClick={handleSearch}>Search</button>

      {/* Show detection banner */}
      <DictionaryTermDetection
        term={detectedTerm}
        searchedTerm={query}
        onExpandForms={handleExpandForms}
        isExpanded={includeRelated}
      />

      {/* Results */}
      <ResultsList results={results} />
    </div>
  );
}
```

#### B. Modify Search API to Use D1 Forms

```typescript
// In /api/search/route.ts

async function getVerbVariantsFromD1(db: D1Database, lemma: string) {
  const results = await db
    .prepare(
      `SELECT form, tense, person, voice, gender, helper
       FROM verb_forms
       WHERE lemma = ?
       ORDER BY tense, person`
    )
    .bind(lemma)
    .all();

  if (!results.results || results.results.length === 0) {
    console.warn(`No D1 forms for ${lemma}, falling back to generation`);
    return generateVerbVariants(lemma); // Fallback to old method
  }

  return results.results.map(row => ({
    form: row.form,
    tense: row.tense,
    person: row.person,
    voice: row.voice,
    gender: row.gender,
    helper: row.helper,
    pos: 'verb' as const
  }));
}
```

## Example User Flow

### Scenario: User searches for "وهي" (3rd person singular present of "to hit")

**Step 1: Initial Search**
```
User types: وهي
Search executes: Exact match only
Results: 23 verses containing "وهي"
```

**Step 2: Detection Banner Appears**
```
┌──────────────────────────────────────────────────────────────┐
│ 🔄 Found verb: وهل (wahul) - "to hit"                       │
│    Dynamic compound verb • Helper: کول • transitive         │
│    [Search all 47 conjugations →]                           │
│    📖 View in LingDocs: https://dictionary.lingdocs.com/... │
└──────────────────────────────────────────────────────────────┘
```

**Step 3: User Clicks "Search all 47 conjugations"**
```
API fetches from verb_forms:
- وهي (present 3sg)
- ووهي (subjunctive 3sg)
- وهې (present 2sg)
- واهي (past 3sg)
- ... (43 more forms)

New search executes across all forms
Results: 487 verses (expanded from 23)
```

**Step 4: Results with Grammar Tooltips**
```
Genesis 4:8 - Afghan 2023
...او قابیل خپل ورور هابیل ته ووهه...
                          ^^^^
Tooltip: ووهه
- Form of: وهل (to hit)
- Tense: Past perfective
- Person: 3rd singular
- Voice: Active
- Helper: Not used in this form
[View conjugation table]
```

## Visual Conjugation Table

When user clicks "View conjugation table", show organized grid:

```
┌─────────────────────────────────────────────────────────────┐
│                    وهل (wahul) - "to hit"                   │
│                     Dynamic Compound Verb                    │
├─────────────────────────────────────────────────────────────┤
│  Present Tense (Imperfective Stem: وه)                     │
│  ┌───────────┬──────────────┬──────────────┐              │
│  │  Person   │  Masculine   │  Feminine    │              │
│  ├───────────┼──────────────┼──────────────┤              │
│  │  1sg (I)  │  وهم         │  وهم         │              │
│  │  2sg (you)│  وهې         │  وهې         │              │
│  │  3sg (he) │  وهي         │  وهي         │              │
│  │  1pl (we) │  وهو         │  وهو         │              │
│  │  2pl (you)│  وهئ         │  وهئ         │              │
│  │  3pl (they)│ وهي         │  وهي         │              │
│  └───────────┴──────────────┴──────────────┘              │
│                                                             │
│  Past Tense (Perfective Stem: واه)                        │
│  ... (similar table)                                       │
└─────────────────────────────────────────────────────────────┘
```

## Verification Against LingDocs

**Weekly/CI Verification Script:**

```typescript
// scripts/verify-lingdocs-sync.ts

import { computeChecksum } from './utils/checksum';

async function verifyVerb(db: D1Database, lingdocsId: number) {
  // 1. Fetch fresh data from LingDocs
  const fresh = await fetch(`https://storage.lingdocs.com/dictionary/words/${lingdocsId}.json`);
  const freshData = await fresh.json();
  const freshChecksum = computeChecksum(freshData);

  // 2. Get stored checksum from D1
  const stored = await db
    .prepare(`SELECT source_checksum, lemma FROM verbs_lexicon WHERE lingdocs_id = ?`)
    .bind(lingdocsId)
    .first();

  // 3. Compare
  if (freshChecksum !== stored.source_checksum) {
    console.warn(`⚠️ Drift detected for ${stored.lemma} (ID: ${lingdocsId})`);
    console.warn(`  Stored:  ${stored.source_checksum}`);
    console.warn(`  Fresh:   ${freshChecksum}`);

    // 4. Re-ingest (optional)
    await ingestLingDocsWord(db, lingdocsId, freshData, freshChecksum);
    console.log(`✅ Re-ingested ${stored.lemma}`);
  } else {
    console.log(`✓ ${stored.lemma} is in sync`);
  }
}

// Verify all verbs
const verbs = await db.prepare(`SELECT DISTINCT lingdocs_id FROM verbs_lexicon WHERE lingdocs_id IS NOT NULL`).all();
for (const verb of verbs.results) {
  await verifyVerb(db, verb.lingdocs_id);
}
```

## Benefits

1. **Accuracy**: All conjugations verified against LingDocs canonical data
2. **Performance**: 237K+ pre-computed forms = instant lookup (no runtime generation)
3. **User Experience**: Smart detection + optional expansion (not forced)
4. **Educational**: Shows grammar metadata, tooltips, conjugation tables
5. **Maintainable**: Checksum-based verification detects drift
6. **Traceable**: Every form links back to source (`lingdocsId`, `source_checksum`)

## Next Steps

1. **Populate D1**: Run `scripts/integrate-lingdocs-complete.ts` to ingest high-frequency verbs
2. **Test Detection**: Search for "وهي", "کول", "تلل" to see banners
3. **Add Visualization**: Implement conjugation table modal
4. **Batch Import**: Process top 100 verbs from word frequency list
5. **CI Verification**: Set up weekly GitHub Action to check for drift

## Example Verbs to Import

Start with these common verbs:

```typescript
const HIGH_PRIORITY_VERBS = [
  1527815399, // وهل - to hit
  1527812752, // کول - to do
  1527815348, // تلل - to go
  1527819674, // راتلل - to come
  1527813418, // لیدل - to see
  1527816122, // ویل - to say
  1527815406, // اخیستل - to take
  1527814617, // ورکول - to give
  // ... more
];

for (const id of HIGH_PRIORITY_VERBS) {
  await pullAndIngestWord(db, id);
}
```
