# Supabase Architecture: Current State & Roadmap

## ✅ What's Currently Indexed

### 1. **verses table** (Afghan 2023)
```sql
CREATE TABLE public.verses (
  id BIGSERIAL PRIMARY KEY,
  ref TEXT NOT NULL UNIQUE,           -- "Genesis 1:1"
  book TEXT,
  chapter INTEGER,
  verse INTEGER,
  text TEXT NOT NULL,                 -- Full verse text
  text_normalized TEXT,               -- Lowercased for search
  testament TEXT,                     -- "OT" or "NT"
  translation_key TEXT DEFAULT 'afghan2023',
  dialect TEXT,
  audio_url TEXT,                     -- Google Drive URL
  audio_source TEXT,                  -- "google_drive"
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**What you can do:**
- Fast lookup by book/chapter/verse
- Full-text search on verse text
- Instant audio URL retrieval
- Filter by testament

**What you CANNOT do:**
- Find all verses containing a specific lemma (e.g., "go" in all forms: go, went, going)
- Filter by part-of-speech
- Access morphological data

---

### 2. **verses_yousafzai table** (Yousafzai 2019)
Same structure as Afghan, with `translation_key = 'yousafzai2019'`

---

### 3. **word_occurrence_index table**
```sql
CREATE TABLE public.word_occurrence_index (
  word TEXT NOT NULL,                 -- Surface form: "خدا"
  translation_key TEXT NOT NULL,      -- 'afghan2023' or 'yousafzai2019'
  frequency INTEGER,                  -- Total count: 500
  verse_refs TEXT[],                  -- Array: ["Genesis 1:1", "Genesis 1:3", ...]
  tf_idf_scores NUMERIC[],            -- Array: [0.95, 0.92, ...]
  primary_verse_ref TEXT,             -- First verse with this word
  updated_at TIMESTAMPTZ,
  PRIMARY KEY (word, translation_key)
);
```

**What you can do:**
- Instant word lookup: "Find all verses with خدا"
- Get TF-IDF relevance scores
- Rank results by relevance
- Batch lookup multiple words
- Get frequency count

**What you CANNOT do:**
- Find related forms (خدا, خدائی, خدائې are all the same lemma)
- Get part-of-speech
- Access morphological data
- Look up by lemma instead of surface form

---

## ❌ What's NOT Indexed: LingDocs Gap

Your LingDocs data includes:
- **full_dictionary_enriched.json** – 20K+ entries with POS, definitions, examples
- **form_to_root_map.json** – Surface form → lemma/root mappings
- **form_roots_combined.json** – Lemma → all inflected forms
- Other morphological & semantic data

**Currently:** None of this is in Supabase. The `word_occurrence_index` table only stores the surface form (خدا) with verse refs.

**Impact:**
- ✅ Search for exact word "خدا" works instantly
- ❌ Search for "خدا" with POS filter (noun only) requires client-side filtering
- ❌ Find all forms of a lemma requires fallback to JSON in-memory
- ❌ Morphological lookup (verb tense, gender, case) unavailable

---

## 🗺️ Current Data Flow

```
┌─────────────────────────────────────┐
│ Local JSON Files                    │
├─────────────────────────────────────┤
│ • public/verses.json.gz             │
│ • app/data/yousafzai_all_verses.json│
│ • app/data/word_frequency_list.json │
│ • google_drive_audio_urls.json      │
│ • full_dictionary_enriched.json     │ ← NOT USED BY INGESTION
│ • form_to_root_map.json             │ ← NOT USED BY INGESTION
└────────────┬────────────────────────┘
             │
             ↓
     ┌───────────────────────┐
     │ Preprocessing Script  │
     │ precompute_*.js       │
     │                       │
     │ • Loads verses        │
     │ • Maps words→verses   │
     │ • Computes TF-IDF     │
     │ • Generates verse_refs│
     └────────────┬──────────┘
             │
             ↓
     ┌────────────────────────────┐
     │ Enriched Frequencies       │
     │ (with verse_refs & TF-IDF) │
     │                            │
     │ NO LingDocs data here ❌   │
     └────────────┬───────────────┘
             │
             ↓
     ┌────────────────────────┐
     │ Ingestion Script       │
     │ ingest_*.js            │
     │                        │
     │ • Insert verses        │
     │ • Insert word index    │
     │ • Load audio URLs      │
     └────────────┬───────────┘
             │
             ↓
     ┌──────────────────────────┐
     │ Supabase Tables          │
     │                          │
     │ • verses                 │
     │ • verses_yousafzai       │
     │ • word_occurrence_index  │
     │                          │
     │ LingDocs metadata: NULL  │
     └──────────────────────────┘
```

---

## 🔮 Optional Phase 2: LingDocs Enrichment

### When You Might Need It

- **Morphological search:** "Find all forms of خدا"
- **POS filtering:** "Show nouns only, not verbs"
- **Lemmatization:** Store root/base form alongside surface form
- **Linguistic analysis:** Extract gender, tense, case
- **Search UI improvements:** Show POS/definitions in results

### Three Approaches

#### Option A: Enrich word_occurrence_index (Simplest)
Add columns to existing table:
```sql
ALTER TABLE public.word_occurrence_index ADD COLUMN IF NOT EXISTS (
  lemma TEXT,                 -- Base form
  pos TEXT,                   -- Part of speech
  definition_short TEXT,      -- First definition
  forms_count INTEGER         -- How many inflected forms exist
);
```

**Pros:** Single table, minimal schema change
**Cons:** Data duplication (same lemma appears once per surface form)

#### Option B: Create separate dictionary table (Recommended)
```sql
CREATE TABLE public.word_dictionary (
  word TEXT NOT NULL,
  translation_key TEXT NOT NULL,
  lemma TEXT,                 -- Base form
  pos TEXT,                   -- Noun, Verb, Adj, etc.
  definition TEXT,
  definition_short TEXT,
  romanization TEXT,
  examples TEXT[],            -- Example sentences
  morphology JSONB,           -- Tense, gender, case, etc.
  created_at TIMESTAMPTZ,
  PRIMARY KEY (word, translation_key)
);
```

**Pros:** Normalized, avoids duplication, query-time lookup
**Cons:** Extra join required (word_occurrence_index → word_dictionary)

#### Option C: Embedded JSONB (Most Flexible)
Store morphological data as JSONB in word_occurrence_index:
```sql
ALTER TABLE public.word_occurrence_index ADD COLUMN IF NOT EXISTS
  metadata JSONB DEFAULT '{}';

-- Stores:
{
  "lemma": "خدا",
  "pos": "noun",
  "definition": "God",
  "romanization": "khuda",
  "forms": ["خدا", "خدائی", "خدائې"],
  "morphology": {
    "gender": "masculine",
    "number": "singular"
  }
}
```

**Pros:** Flexible, no joins, all data in one record
**Cons:** Larger row size, harder to filter by POS

---

## 📋 Recommended Path Forward

### Phase 1 (Current): ✅ Done
- ✅ Verse indexing (verses table)
- ✅ Word frequency indexing (word_occurrence_index)
- ✅ TF-IDF scores
- ✅ Audio URLs
- ✅ Basic search by word

### Phase 2 (When needed): 🔄 Optional
- 🔄 LingDocs enrichment (choose Option A, B, or C above)
- 🔄 Create enrichment pipeline: LingDocs JSON → Supabase
- 🔄 Update search API to use enriched data
- 🔄 Add POS/lemma filtering to search UI

### Phase 3 (Future): 📅 Optional
- 📅 Full morphological search
- 📅 Spell-correction via lemma lookup
- 📅 Cross-translation lemma search

---

## 🚀 If You Want LingDocs Data in Supabase

Create an enrichment script (will be similar to `precompute_word_frequencies.js`):

```javascript
// enrich_word_dictionary.js
async function enrichFrequencies() {
  // 1. Load word_frequency_list.json
  // 2. Load full_dictionary_enriched.json
  // 3. Load form_to_root_map.json
  
  // 4. For each word in frequencies:
  for (const [word, freq] of Object.entries(frequencies)) {
    const dictEntry = dictionary[word];
    const lemma = form_to_root_map[word];
    
    enrichedData[word] = {
      ...freq,                          // Existing: frequency, verse_refs, tf_idf_scores
      lemma,
      pos: dictEntry?.pos,
      definition: dictEntry?.definition,
      romanization: dictEntry?.romanization,
      examples: dictEntry?.examples
    };
  }
  
  // 5. Insert into word_dictionary table (Option B)
  //    OR add to word_occurrence_index metadata (Option C)
}
```

**Effort:** ~2-4 hours to build + test
**Data volume:** +5-10MB depending on what you include
**Query impact:** Minimal (optional filter, no join required if using JSONB)

---

## 🎯 Decision Matrix

| Need | Current | Phase 2 (Option A) | Phase 2 (Option B) | Phase 2 (Option C) |
|------|---------|-------------------|-------------------|-------------------|
| Word search | ✅ | ✅ | ✅ | ✅ |
| Lemma lookup | ❌ | ✅ | ✅ | ✅ |
| POS filter | ❌ | ✅ | ✅ | ✅ |
| Morphology | ❌ | ⚠️ Limited | ✅ | ✅ |
| Query complexity | Simple | Minimal | Join | No join |
| Storage size | Smaller | +25% | +20% | +15% |
| Update frequency | Per-release | Per-release | Per-release | Per-release |

---

## ✅ Current State: Good for MVP

Your current setup (after preprocessing + ingestion) is **sufficient for:**
- Fast word-based search
- Verse retrieval with audio
- Simple UI (search box → results)
- Scalable to millions of queries

**Limitations:**
- No morphological search
- No POS filtering
- No lemma-based deduplication

**These are nice-to-haves, not blockers.**

---

## 📝 Next Steps

1. **Now:** Run preprocessing script (transforms frequency data)
2. **Now:** Run ingestion script (populates Supabase)
3. **Now:** Test basic search (word → verses)
4. **Later:** If needed, add LingDocs enrichment (pick Option A/B/C)
5. **Later:** Update search UI to expose enriched data

The beauty of this design: **You can add LingDocs later without changing the existing tables**. Just add a new column or table, and the search API can optionally use it.
