# LingDocs + Supabase Integration

## ✅ Why Integrate LingDocs into Supabase

Your codebase already has:
- **full_dictionary_enriched.json** – 20K+ entries with POS, definitions, examples
- **form_to_root_map.json** – Surface form → lemma/root  
- **verb_variants.ts**, **noun_variants.ts** – LingDocs inflection generators
- **extractRomanized()**, **extractEnglish()** – LingDocs field parsers

Currently, these are **loaded in memory at request time**. By ingesting them into Supabase, you gain:
- ✅ Instant POS filtering (show nouns only, not verbs)
- ✅ Lemma-based deduplication (خدا, خدائی, خدائې grouped)
- ✅ Morphological lookups (tense, gender, case visible in results)
- ✅ Batch inflection search (query 50 forms at once from DB)
- ✅ No duplication of logic (reuse existing adapters)

---

## 🗂️ Existing LingDocs Loaders in Your Codebase

### 1. **app/lib/data/load.ts**
```typescript
// Existing types and extractors:
type DictionaryEntry = {
  pashto: string;
  romanized: string;
  pos?: string;           // "Noun", "Verb", "Adjective"
  c?: string;             // Category
  english?: string;       // Definition
  ts?: number;            // LingDocs timestamp
  // ... other LingDocs fields (i, e, f, g, etc.)
};

// Existing extractors to reuse:
function extractRomanized(entry: any): string | undefined {
  // Handles: f_primary, f, g, romanized, pronunciation
}

function extractEnglish(entry: any): string | undefined {
  // Handles: e, english fields
}
```

### 2. **app/utils/noun_variants.ts** & **app/utils/verb_variants.ts**
```typescript
// Already handles:
async function initializeMaps() {
  // Loads inflections cache for both verb and noun forms
}

async function generateNounVariants(rootOrLemma: string, opts?) {
  // Returns all noun forms (plural, oblique, etc.)
}

async function generateVerbVariants(rootOrInfinitive: string, opts?) {
  // Returns all verb forms (tenses, aspects, etc.)
}
```

**Both load from:** `app/data/inflections_cache.json` (pre-computed from LingDocs)

### 3. **app/lib/variants/index.ts**
```typescript
// Existing function to leverage:
async function collectRelatedForms(term: string, options) {
  // Already finds related forms and variants
  // Returns: { baseForm, forms, inflections, ... }
}
```

---

## 🏗️ Proposed word_dictionary Schema

Add to Supabase (alongside existing verses & word_occurrence_index):

```sql
CREATE TABLE public.word_dictionary (
  -- Primary key
  word TEXT NOT NULL,                 -- Surface form: "خدا"
  translation_key TEXT NOT NULL,      -- 'afghan2023' or 'yousafzai2019'
  
  -- LingDocs metadata
  lemma TEXT,                         -- Base form: "خود"
  pos TEXT,                           -- POS: "Noun", "Verb", "Adjective"
  sub_pos TEXT,                       -- Sub-category (e.g., "Intransitive")
  
  -- Morphological data (for display)
  morphology JSONB,                   -- {"gender": "m", "number": "s", "case": "d"}
  
  -- Definition & examples
  definition_short TEXT,              -- First definition
  definition_full TEXT,               -- Full definition
  examples TEXT[],                    -- Example sentences: ["نه دا ده", "...]
  
  -- Romanization
  romanization TEXT,                  -- "khuda"
  
  -- Relationships
  root_word TEXT,                     -- Lemma/root for grouping
  inflection_type TEXT,               -- "singular", "plural", "past tense", etc.
  related_forms TEXT[],               -- Other forms of same lemma: ["خدائی", "خدائې"]
  
  -- LingDocs source info
  lingdocs_ts INTEGER,                -- LingDocs timestamp
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (word, translation_key)
);

-- Indexes for fast lookups
CREATE INDEX idx_word_dictionary_lemma ON public.word_dictionary (lemma, translation_key);
CREATE INDEX idx_word_dictionary_pos ON public.word_dictionary (pos, translation_key);
CREATE INDEX idx_word_dictionary_root ON public.word_dictionary (root_word, translation_key);
```

---

## 📝 Ingestion Step: Enrich word_occurrence_index with LingDocs

After the existing `buildWordOccurrenceIndex()` step, add:

```javascript
// enrich_lingdocs.js (new module)

async function enrichWordDictionary(supabase, frequencyData, translationKey) {
  console.log(`📚 Enriching word dictionary for ${translationKey}...`);

  // 1. Load LingDocs caches (reusing existing extractors)
  const dictionary = await loadFullDictionary(); // Existing from load.ts
  const formToRoot = await loadFormToRoot();      // Existing from load.ts
  const nounVariants = await generateNounVariants; // Existing from noun_variants.ts
  const verbVariants = await generateVerbVariants; // Existing from verb_variants.ts

  // 2. For each word in word_occurrence_index:
  const enrichedDictionary = [];

  for (const word of Object.keys(frequencyData[translationKey])) {
    const dictEntry = dictionary[word] || {};
    const lemma = formToRoot[word]?.[0]; // Get primary root
    const pos = dictEntry.pos || 'Unknown';

    // 3. Extract morphological info using existing functions
    const romanization = extractRomanized(dictEntry);
    const definition = extractEnglish(dictEntry);

    // 4. Collect related forms (nouns, verbs, etc.)
    let relatedForms = [];
    try {
      if (pos === 'Noun') {
        const nounForms = await generateNounVariants(lemma || word);
        relatedForms = nounForms.map(f => f.form);
      } else if (pos === 'Verb') {
        const verbForms = await generateVerbVariants(lemma || word);
        relatedForms = verbForms.map(f => f.form);
      }
    } catch (error) {
      // Forms generation might fail for non-standard words, that's OK
    }

    enrichedDictionary.push({
      word,
      translation_key: translationKey,
      lemma: lemma || word,
      pos,
      definition_short: definition?.substring(0, 100),
      definition_full: definition,
      romanization,
      root_word: lemma || word,
      related_forms: relatedForms,
      morphology: dictEntry.morphology || {},
      lingdocs_ts: dictEntry.ts || null,
    });
  }

  // 5. Batch upsert to Supabase
  console.log(`  Upserting ${enrichedDictionary.length} dictionary entries...`);
  const batchSize = 1000;
  for (let i = 0; i < enrichedDictionary.length; i += batchSize) {
    const batch = enrichedDictionary.slice(i, i + batchSize);
    const { error } = await supabase
      .from('word_dictionary')
      .upsert(batch, { onConflict: 'word, translation_key' });

    if (error) {
      console.error(`❌ Error upserting batch:`, error);
    } else {
      console.log(`  ✅ Batch ${Math.floor(i / batchSize) + 1} upserted`);
    }
  }

  console.log(`✅ Dictionary enrichment complete\n`);
}
```

---

## 🔌 Update Ingestion Pipeline

Modify `ingest_to_production_schema.js` main() function:

```javascript
async function main() {
  try {
    const supabase = await createSupabaseClient();

    // Existing steps
    const { afghanData, yousafzaiData } = await loadVersesData();
    const audioMap = await loadAudioMapping();
    const frequencyData = await loadFrequencyData();

    await clearTables(supabase);
    const { afghanVerses, yousafzaiVerses } = await insertVerses(supabase, afghanData, yousafzaiData, audioMap);
    await buildWordOccurrenceIndex(supabase, frequencyData);

    // NEW: Enrich with LingDocs (optional, after word index)
    const enrichLingDocs = process.argv.includes('--with-lingdocs');
    if (enrichLingDocs) {
      await enrichWordDictionary(supabase, frequencyData, 'afghan2023');
      await enrichWordDictionary(supabase, frequencyData, 'yousafzai2019');
    }

    await verifyIngestion(supabase, frequencyData, afghanVerses, yousafzaiVerses, audioMap);

    console.log('🎉 Production data ingestion completed successfully!');
  } catch (error) {
    console.error('\n❌ Ingestion failed:', error.message);
    process.exit(1);
  }
}
```

**Usage:**
```bash
# Just verses + word index (MVP)
node ingest_to_production_schema.js

# Full enrichment with LingDocs
node ingest_to_production_schema.js --with-lingdocs
```

---

## 🔍 Update Search API to Use word_dictionary

Modify `app/api/search/route.ts`:

```typescript
// Option A: Simple join (when requesting enriched results)
async function enrichResults(supabase, verseRefs, translation, includeEnrichment = false) {
  if (!includeEnrichment) return verseRefs; // Return as-is

  // Join with word_dictionary for each word
  const enrichedRefs = [];
  for (const ref of verseRefs) {
    const { data: dict } = await supabase
      .from('word_dictionary')
      .select('pos, definition_short, romanization, related_forms')
      .eq('word', ref.word)
      .eq('translation_key', translation)
      .single();

    enrichedRefs.push({
      ...ref,
      ...dict,  // Add POS, definition, etc.
    });
  }
  return enrichedRefs;
}

// Option B: Filter by POS (if user requests "nouns only")
async function searchByPOS(supabase, query, pos, translation) {
  // First get word refs from word_occurrence_index
  const { data: wordData } = await supabase
    .from('word_occurrence_index')
    .select('verse_refs')
    .eq('word', query)
    .eq('translation_key', translation)
    .single();

  if (!wordData) return [];

  // Then filter by POS from word_dictionary
  const { data: dictEntry } = await supabase
    .from('word_dictionary')
    .select('verse_refs')
    .eq('word', query)
    .eq('translation_key', translation)
    .eq('pos', pos)
    .single();

  return dictEntry?.verse_refs || [];
}

// Option C: Lemma-based deduplication (find all forms of a lemma)
async function searchByLemma(supabase, lemma, translation) {
  // Get all forms of this lemma
  const { data: allForms } = await supabase
    .from('word_dictionary')
    .select('word, verse_refs')
    .eq('root_word', lemma)
    .eq('translation_key', translation);

  if (!allForms) return [];

  // Combine verse refs from all forms
  const allVerseRefs = new Set();
  for (const form of allForms) {
    form.verse_refs?.forEach(ref => allVerseRefs.add(ref));
  }

  return Array.from(allVerseRefs);
}
```

---

## 📊 Query Patterns

### Pattern 1: Basic word search (unchanged)
```sql
SELECT verse_refs FROM word_occurrence_index
WHERE word = 'خدا' AND translation_key = 'afghan2023'
LIMIT 100;
```
**Time:** 2-5ms

### Pattern 2: Word + POS filter
```sql
SELECT w.verse_refs FROM word_occurrence_index w
JOIN word_dictionary d ON w.word = d.word
WHERE w.word = 'خدا'
  AND w.translation_key = 'afghan2023'
  AND d.pos = 'Noun'
LIMIT 100;
```
**Time:** 5-10ms (adds small join cost)

### Pattern 3: Lemma-based search (all forms)
```sql
SELECT DISTINCT d.word, d.verse_refs FROM word_dictionary d
WHERE d.root_word = 'خود'
  AND d.translation_key = 'afghan2023';
```
**Time:** 3-8ms (indexed on root_word)

### Pattern 4: Morphological filter
```sql
SELECT verse_refs FROM word_dictionary
WHERE root_word = 'خود'
  AND translation_key = 'afghan2023'
  AND morphology->>'gender' = 'm'
  AND morphology->>'number' = 's'
LIMIT 100;
```
**Time:** 5-15ms (JSONB filter, index helps)

---

## 🎯 Three-Phase Rollout

### Phase 1: MVP (Current) ✅
- ✅ verses table (text + audio URLs)
- ✅ verses_yousafzai table
- ✅ word_occurrence_index (surface forms + TF-IDF)
- Query time: 2-5ms

### Phase 2: LingDocs Enrichment (Optional, reuse existing code)
- 🔄 Add word_dictionary table (reuse extractors)
- 🔄 Extend ingest with `--with-lingdocs` flag
- 🔄 Add POS/lemma filtering to search API
- Query time: 5-10ms (still sub-100ms)
- Effort: ~4-6 hours (minimal new code, mostly reuse)

### Phase 3: Advanced Linguistic Features (Future)
- 📅 Full morphological search
- 📅 Cross-translation lemma search
- 📅 Inflection suggestions

---

## 🔑 Key Insight: Reuse Existing Adapters

Your codebase **already has everything needed**:

| Need | Existing Code | Location |
|------|---------------|----------|
| Load dictionary | `readJson()`, `loadFullDictionary()` | app/lib/data/load.ts |
| Extract POS | `DictionaryEntry` type | app/lib/data/load.ts |
| Extract definition | `extractEnglish()` | app/lib/data/load.ts |
| Extract romanization | `extractRomanized()` | app/lib/data/load.ts |
| Generate inflections | `generateNounVariants()`, `generateVerbVariants()` | app/utils/{noun,verb}_variants.ts |
| Find related forms | `collectRelatedForms()` | app/lib/variants/index.ts |

**No reinvention needed.** The ingestion enrichment step just reuses these functions to populate word_dictionary.

---

## ✅ When to Implement Phase 2

Implement LingDocs enrichment when you need:
- POS filtering in search UI ("Show only nouns")
- Lemma grouping (show all forms of a word together)
- Morphological analysis (tense, gender, case visible)
- Cross-form search ("Find all forms of خود")

Until then, Phase 1 is production-ready and sufficient for fast word-based search.

---

## 📝 Next Steps

1. **Now:** Complete Phase 1 (preprocess + ingest verses + word index)
2. **Test:** Verify fast word search works (2-5ms)
3. **Later (if needed):** Implement Phase 2 enrichment
4. **Future:** Add linguistic features

The beauty: You can add Phase 2 **without changing existing tables or queries**. Just add a new column/table and update the search API when ready.
