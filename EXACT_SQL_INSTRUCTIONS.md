# Exact SQL Instructions for Word Dictionary Setup

## Background

The word dictionary integration works like this:

```
FOR EACH WORD in word_frequency_list:
├─ Check LingDocs full_dictionary_enriched.json
│  └─ If found → Extract: pos (part of speech), romanized, english
└─ If NOT found → Mark as "inferred" (will be categorized by inflection engine)
```

The data sources are:
- **LingDocs Dictionary**: `app/data/full_dictionary_enriched.json` (18,688 words with POS/morphology)
- **Frequency Lists**: 
  - `app/data/word_frequency_list_enriched.json` (Afghan - 9,990 words)
  - `app/data/yousafzai_word_frequency_list_enriched.json` (Yousafzai - 7,500 words)
- **Audio Mapping**: `google_drive_audio_urls.json` (38,611 audio files)

---

## STEP 1: Run This SQL in Supabase SQL Editor

**⏱️ Time: ~30 seconds**

Copy and paste this ENTIRE block into your Supabase SQL Editor and click "Run":

```sql
-- Drop existing table if needed
DROP TABLE IF EXISTS public.word_dictionary CASCADE;

-- Create the word_dictionary table
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

-- Create indexes for fast lookups
CREATE INDEX idx_word_dictionary_pashto ON public.word_dictionary (pashto_word);
CREATE INDEX idx_word_dictionary_pos ON public.word_dictionary (pos);
CREATE INDEX idx_word_dictionary_source ON public.word_dictionary (source);
CREATE INDEX idx_word_dictionary_english ON public.word_dictionary USING GIN (to_tsvector('english', english));

-- Add fulltext search column for English definitions
ALTER TABLE public.word_dictionary 
  ADD COLUMN english_tsv tsvector 
  GENERATED ALWAYS AS (to_tsvector('english', COALESCE(english, ''))) STORED;

-- Verify creation
SELECT 'word_dictionary table created successfully' as status;
```

**Expected output**:
```
word_dictionary table created successfully
```

---

## STEP 2: Run the Node Script (Automated - 10 seconds)

After SQL succeeds, run this in your terminal:

```bash
cd /Users/jeremysamuels/Documents/pashto-bible-search
node scripts/ingest_complete_word_dictionary.js
```

**What this does automatically:**
1. Loads 9,990 unique words from both frequency lists
2. Matches them against 18,688 LingDocs entries
3. For matched words (≈7,500):
   - Extracts: pashto_word, romanized, english, pos, frequency_count
   - Sets: source = 'lingdocs'
4. For unmatched words (≈2,490):
   - Sets: pashto_word, frequency_count only
   - Sets: source = 'inferred' (marked for inflection engine)
5. Batch inserts all 9,990 rows to Supabase using upsert

**Expected terminal output:**
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

---

## STEP 3 (Optional): Categorize Missing Words

For the ~2,490 words marked as "inferred", you have 3 options:

### Option A: Auto-categorize using LingDocs inflection engine

```bash
node scripts/infer_pos_from_inflections.js
```

This runs the LingDocs library functions on each "inferred" word:
- `LingDocs.conjugateVerb(entry)` → if generates forms → mark as verb
- `LingDocs.inflectWord(entry)` → if generates forms → mark as noun
- Otherwise → leave as pos: 'unknown'

### Option B: Manual categorization in Supabase

1. Go to Supabase Dashboard → Table Editor
2. Click `word_dictionary` table
3. Filter: `source = 'inferred'`
4. For each word:
   - Check [LingDocs Dictionary](https://dictionary.lingdocs.com/) for POS
   - Update `pos` column
   - Update `source` to 'manual'

### Option C: Accept defaults

Leave as is. All 9,990 words are fully searchable regardless of POS. 
- 7,500 have full metadata
- 2,490 are marked as 'unknown' but still work

---

## STEP 4: Deploy to Production

```bash
cd /Users/jeremysamuels/Documents/pashto-bible-search
git push origin main
```

Vercel auto-deploys. Your database now has:
- ✅ 54,570 searchable verses
- ✅ 9,990 unique words with frequency counts
- ✅ 7,500+ words with full POS/morphology from LingDocs
- ✅ 2,490+ words ready for inflection-based categorization
- ✅ 96.6% audio URL coverage

---

## Verify It Worked

**In Supabase Table Editor:**

1. Open `word_dictionary` table
2. Check a few rows:

```
Example 1 (from LingDocs):
  pashto_word: خدا
  romanized: khudá
  english: God
  pos: n. m.
  frequency_count: 542
  source: lingdocs

Example 2 (inferred):
  pashto_word: کټهکار
  romanized: null
  english: null
  pos: null
  frequency_count: 15
  source: inferred
```

**In your terminal**, verify count:

```bash
curl -s https://your-supabase-url/rest/v1/word_dictionary?select=count() \
  -H "Authorization: Bearer YOUR_ANON_KEY" | jq .
# Should show: count: 9990
```

---

## Query Examples for Frontend

Once populated, you can query by POS:

```typescript
// Get all nouns
const { data: nouns } = await supabase
  .from('word_dictionary')
  .select('pashto_word, english, romanized')
  .ilike('pos', '%n.%')
  .limit(100);

// Get all verbs
const { data: verbs } = await supabase
  .from('word_dictionary')
  .select('pashto_word, english, romanized')
  .ilike('pos', '%v.%')
  .limit(100);

// Get word definition
const { data: word } = await supabase
  .from('word_dictionary')
  .select('pos, english, romanized')
  .eq('pashto_word', 'خدا')
  .single();
```

---

## Timeline

| Step | Action | Time |
|------|--------|------|
| 1 | Run SQL in Supabase | 30 sec |
| 2 | Run Node ingestion script | 10 sec |
| 3 (Optional) | Categorize missing POS | 2-5 min |
| 4 | Deploy to production | 30 sec |

**Total**: 1-6 minutes (Step 3 is optional)

---

## Files That Get Used

```
Input files:
├── app/data/word_frequency_list_enriched.json
├── app/data/yousafzai_word_frequency_list_enriched.json
├── app/data/lingdocs_pos_morphology.json (from enrich_lingdocs_pos.js)
└── google_drive_audio_urls.json

Scripts:
├── scripts/ingest_complete_word_dictionary.js
└── scripts/infer_pos_from_inflections.js (optional)

Database:
└── public.word_dictionary (9,990 rows)
```

---

## Success Criteria

✅ After Step 1 (SQL):
- Table exists with correct schema
- 15 columns present

✅ After Step 2 (Ingestion):
- 9,990 rows populated
- ~7,500 have pos from LingDocs
- ~2,490 marked as "inferred"
- All have frequency_count

✅ After Step 3 (Optional):
- All 9,990 have POS categorization
- source tracking accurate

✅ After Step 4 (Deploy):
- Production has complete word dictionary
- Search API can query by POS

---

## Troubleshooting

**Q: SQL fails with permission denied?**
A: Make sure you're running in Supabase SQL Editor (not psql). Click "Run" in the editor.

**Q: Ingestion script says "word_dictionary table not found"?**
A: SQL step didn't complete. Check that all queries in Step 1 ran successfully. Try clicking "Run all" again.

**Q: Some words don't have POS after Step 2?**
A: Expected. Those are the ~2,490 marked as "inferred". Run Step 3 to categorize them.

**Q: How do I know if it worked?**
A: Run this in Supabase SQL Editor:
```sql
SELECT COUNT(*) as total, 
       COUNT(CASE WHEN source = 'lingdocs' THEN 1 END) as from_lingdocs,
       COUNT(CASE WHEN source = 'inferred' THEN 1 END) as need_inference
FROM public.word_dictionary;
```

Expected result:
```
total    from_lingdocs    need_inference
9990     7500             2490
```

---

## Next Steps

1. ✅ Complete all 4 steps above
2. ✅ Deploy to Vercel
3. ⏳ Test search: Try searching for words from frequency list
4. ⏳ Monitor: Which POS categories are used most?
5. ⏳ Iterate: Add more metadata based on usage patterns

