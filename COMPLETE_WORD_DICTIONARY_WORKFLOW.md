# Complete Word Dictionary Workflow

## Overview

This workflow populates `word_dictionary` table with **all 9,990 unique words** from the frequency lists, enriched with:
- ✅ POS labels (noun, verb, adjective, etc.)
- ✅ Morphology data (gender, animacy, tense forms)
- ✅ English definitions (where available)
- ✅ Frequency counts
- ✅ Audio URL linking
- ✅ Source tracking (LingDocs vs. inflection-inferred)

---

## Architecture

```
word_frequency_list (9,990 words)
    ↓
For each word:
    ├─ If IN LingDocs (18,688) → Get POS/morphology/definition ✅
    └─ If NOT in LingDocs → Mark for inflection inference ⏳
    ↓
word_dictionary table
    ├─ pashto_word (unique key)
    ├─ romanized (transliteration)
    ├─ english (definition)
    ├─ pos (part of speech)
    ├─ frequency_count (from word_frequency_list)
    ├─ source ('lingdocs' or 'inferred')
    └─ audio_url (optional, from google_drive_audio_urls.json)
```

---

## Step-by-Step Workflow

### Step 1: Create Table in Supabase (Manual)

Run this SQL in Supabase SQL Editor:

```sql
DROP TABLE IF EXISTS public.word_dictionary CASCADE;

CREATE TABLE public.word_dictionary (
  id BIGSERIAL PRIMARY KEY,
  pashto_word TEXT NOT NULL UNIQUE,
  romanized TEXT,
  english TEXT,
  pos TEXT,
  frequency_count INTEGER DEFAULT 0,
  source TEXT DEFAULT 'unknown',  -- 'lingdocs' or 'inferred'
  audio_url TEXT,
  audio_source TEXT,
  past BOOLEAN,
  perfective BOOLEAN,
  imperfective BOOLEAN,
  gender TEXT,
  animacy TEXT,
  number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_word_dictionary_pashto ON public.word_dictionary (pashto_word);
CREATE INDEX idx_word_dictionary_pos ON public.word_dictionary (pos);
CREATE INDEX idx_word_dictionary_source ON public.word_dictionary (source);
CREATE INDEX idx_word_dictionary_english ON public.word_dictionary USING GIN (to_tsvector('english', english));

ALTER TABLE public.word_dictionary 
  ADD COLUMN english_tsv tsvector 
  GENERATED ALWAYS AS (to_tsvector('english', COALESCE(english, ''))) STORED;
```

**Time**: ~30 seconds

---

### Step 2: Populate from LingDocs + Frequency Lists

```bash
node scripts/ingest_complete_word_dictionary.js
```

**What this does:**
1. Loads 9,990 unique words from both frequency lists
2. For each word:
   - If in LingDocs → stores POS/morphology/definition
   - If NOT in LingDocs → marks as "inferred" for later processing
3. Includes frequency counts from word_frequency_list
4. Inserts all rows with `source` tracking

**Expected output:**
```
📚 COMPLETE WORD DICTIONARY INGESTION

📊 Loading word frequency lists...
   ✅ Total unique words: 9990

📚 Loading LingDocs POS morphology...
   ✅ LingDocs entries: 18688

🎵 Loading audio URLs...
   ✅ Audio mappings: 38611

🔄 Processing words...
   ✅ Processed: 9990
      In LingDocs: ~7500 (75%)
      Need inflection: ~2490 (25%)

📥 Inserting into word_dictionary...
   ✅ Inserted: 9990

📊 VERIFICATION:
Total in table: 9990

By source:
  lingdocs: 7500
  inferred: 2490
```

**Time**: ~10 seconds

---

### Step 3: Infer POS for Missing Words (Optional)

For the ~2,490 words NOT in LingDocs, you can:

#### Option A: Auto-infer using LingDocs engine (Recommended)

```bash
node scripts/infer_pos_from_inflections.js
```

This runs the LingDocs verb conjugation and noun inflection engines on unknown words to categorize them.

**How it works:**
1. For each "inferred" word:
   - Try verb conjugation engine
   - If generates forms → mark as verb
   - Otherwise try noun inflection engine
   - If generates forms → mark as noun
   - Else → mark as "unknown"

#### Option B: Manual categorization in Supabase

1. Go to Supabase Table Editor
2. Filter by `source = 'inferred'`
3. Manually update `pos` column with linguistic categorization
4. Update `source` to 'manual' when done

#### Option C: Accept defaults

Leave as is - the dictionary still works fine with:
- 7,500 words with full metadata
- 2,490 words searchable but marked as "unknown" POS

**All words are fully searchable regardless of POS.**

---

### Step 4: Link Audio URLs (Optional)

```bash
node scripts/link_audio_to_words.js
```

This populates `audio_url` for words that appear in verses with audio.

**How it works:**
1. For each word in word_dictionary
2. Find all verses containing that word
3. If verse has audio_url → store it
4. Store which verse audio is from (reference only)

---

### Step 5: Deploy to Production

```bash
git push origin main
```

Vercel auto-deploys. Your production database now has:
- ✅ 54,570 searchable verses
- ✅ 9,990 unique words with metadata
- ✅ 96.6% with audio URLs
- ✅ 7,500+ words with full POS/morphology
- ✅ 2,490+ words with inferred categorization

---

## Data Quality Summary

| Category | Count | Completeness |
|----------|-------|--------------|
| Total words | 9,990 | 100% |
| With LingDocs data | 7,500 | 75% |
| With POS from LingDocs | 7,500 | 75% |
| Need inflection | 2,490 | 25% |
| With frequency counts | 9,990 | 100% |
| Potentially with audio | ~7,000* | 70%* |

*Audio URLs linked to verses, not individual words

---

## Integration with Search API

### Query: Get POS for a word

```typescript
const { data } = await supabase
  .from('word_dictionary')
  .select('pos, english, source')
  .eq('pashto_word', 'خدا');
// Returns: { pos: 'n. m.', english: 'God', source: 'lingdocs' }
```

### Query: Find all nouns

```typescript
const { data } = await supabase
  .from('word_dictionary')
  .select('pashto_word, english')
  .ilike('pos', '%n. m.%')
  .limit(100);
```

### Query: Find words by source

```typescript
const { data } = await supabase
  .from('word_dictionary')
  .select('pashto_word, pos, english')
  .eq('source', 'lingdocs')
  .order('frequency_count', { ascending: false });
```

---

## Timeline

| Step | Time | Status |
|------|------|--------|
| Create table (manual SQL) | 30 sec | ✅ Manual |
| Populate from frequency + LingDocs | 10 sec | ⏳ Run script |
| Infer POS for unknowns | 2-5 min | ⏳ Optional |
| Link audio URLs | 5-10 sec | ⏳ Optional |
| Deploy to production | 30 sec | ⏳ Push to main |

**Total**: ~6-15 minutes (depending on options chosen)

---

## Files Involved

```
scripts/
├── ingest_complete_word_dictionary.js    # Main: Load frequency + LingDocs
├── infer_pos_from_inflections.js         # Optional: Categorize unknowns
├── link_audio_to_words.js                # Optional: Link audio (future)

app/data/
├── word_frequency_list_enriched.json     # Afghan frequency (9,990 words)
├── yousafzai_word_frequency_list_enriched.json  # Yousafzai (7,500 words)
├── lingdocs_pos_morphology.json          # LingDocs metadata (18,688 words)

root/
└── google_drive_audio_urls.json          # Audio mappings (38,611 files)
```

---

## Success Criteria

✅ **Must Have:**
- [ ] word_dictionary table created with correct schema
- [ ] 9,990 rows populated with pashto_word and frequency_count
- [ ] 7,500+ rows with pos from LingDocs
- [ ] All unique frequency words represented
- [ ] source tracking accurate

✅ **Should Have:**
- [ ] 2,490 inferred words categorized
- [ ] Audio URLs linked where available
- [ ] Search API can query by POS
- [ ] Definition search functional

✅ **Nice to Have:**
- [ ] All morphology fields populated
- [ ] Romanization complete
- [ ] Confidence scores for inferred data

---

## Troubleshooting

**Q: What if ingestion fails halfway?**
A: The script uses `upsert` so you can re-run it - it will skip existing rows.

**Q: How do I handle words NOT in LingDocs?**
A: They get marked as `source: 'inferred'` and pos: 'unknown'. 
   - They're still searchable
   - You can manually categorize or auto-infer later

**Q: Can I update individual words later?**
A: Yes! Just run an UPDATE query in Supabase or manually edit in Table Editor.

**Q: What about audio URLs?**
A: Linking audio to words is optional. Words are fully functional without it.

---

## Next Steps After Completion

1. **Deploy to production** `git push origin main`
2. **Test in browser**: Search for words from frequency list
3. **Monitor usage**: Which words are most searched?
4. **Iterate**: Add more metadata based on user feedback

---

**Estimated Total Time**: 5-15 minutes  
**Production Ready**: After Step 2 (other steps are optional enhancements)

