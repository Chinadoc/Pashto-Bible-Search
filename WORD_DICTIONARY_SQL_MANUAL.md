# Manual SQL Setup for Word Dictionary

## ⚠️ Table Creation Issue

The `word_dictionary` table needs to be created manually in your Supabase SQL Editor.

## Steps

1. **Go to Supabase Console**
   - https://supabase.com/dashboard

2. **Select Your Project**
   - Select: `pashto-bible-search`

3. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar

4. **Run This SQL**

Copy and paste the entire SQL block below, then click "Run":

```sql
-- Drop if exists
DROP TABLE IF EXISTS public.word_dictionary CASCADE;

-- Create word_dictionary table
CREATE TABLE public.word_dictionary (
  id BIGSERIAL PRIMARY KEY,
  pashto_word TEXT NOT NULL UNIQUE,
  romanized TEXT,
  english TEXT,
  pos TEXT,
  past BOOLEAN,
  perfective BOOLEAN,
  imperfective BOOLEAN,
  gender TEXT,
  animacy TEXT,
  number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_word_dictionary_pashto ON public.word_dictionary (pashto_word);
CREATE INDEX idx_word_dictionary_pos ON public.word_dictionary (pos);
CREATE INDEX idx_word_dictionary_english ON public.word_dictionary USING GIN (to_tsvector('english', english));

-- Add fulltext search column
ALTER TABLE public.word_dictionary 
  ADD COLUMN english_tsv tsvector 
  GENERATED ALWAYS AS (to_tsvector('english', COALESCE(english, ''))) STORED;
```

5. **Verify**
   - Look for "✅ Success" message in Supabase

6. **Then Ingest Data**

Once table is created, run:
```bash
node scripts/ingest_word_dictionary.js
```

---

## What This Does

| Step | Creates | Rows |
|------|---------|------|
| DROP TABLE | Removes old table if exists | - |
| CREATE TABLE | New word_dictionary | - |
| Indexes | 3 indexes for fast queries | - |
| ALTER TABLE | Fulltext search column | - |
| Ingest Script | Populates 18,688 words | 18,688 |

---

## Expected Output from Ingestion

```
📚 INGESTING LINGDOCS WORD DICTIONARY

📖 Loading LingDocs POS morphology...
   ✅ Loaded 18688 entries

📥 Inserting into word_dictionary...
   100% (18688/18688)
   ✅ Inserted: 18688

📊 VERIFICATION:
   Total in table: 18688
```

---

**Once complete, your database will have:**
- ✅ 54,570 verses with audio URLs
- ✅ 9,990 indexed words with frequency
- ✅ 18,688 words with POS/morphology
