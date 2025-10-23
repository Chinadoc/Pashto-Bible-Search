# Word Dictionary Table Setup

## Step 1: Create the table in Supabase

Run this SQL in your Supabase console:

```sql
-- Drop if exists
DROP TABLE IF EXISTS public.word_dictionary CASCADE;

-- Create word_dictionary table
CREATE TABLE public.word_dictionary (
  id BIGSERIAL PRIMARY KEY,
  pashto_word TEXT NOT NULL UNIQUE,
  romanized TEXT,
  english TEXT,
  pos TEXT,  -- part of speech (n. m., v. trans., adj., etc)
  -- Verb morphology
  past BOOLEAN,
  perfective BOOLEAN,
  imperfective BOOLEAN,
  -- Noun morphology
  gender TEXT,  -- m, f, or unisex
  animacy TEXT,  -- anim, inanim
  number TEXT,  -- sing, plur, etc
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for fast lookup
CREATE INDEX idx_word_dictionary_pashto ON public.word_dictionary (pashto_word);
CREATE INDEX idx_word_dictionary_pos ON public.word_dictionary (pos);
CREATE INDEX idx_word_dictionary_english ON public.word_dictionary USING GIN (to_tsvector('english', english));

-- Enable full text search on English definitions
ALTER TABLE public.word_dictionary ADD COLUMN english_tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', COALESCE(english, ''))) STORED;
```

## Step 2: Populate the table

Run this Node script:

```bash
node scripts/ingest_word_dictionary.js
```

This script will:
1. Load `app/data/lingdocs_pos_morphology.json` (18,688 words)
2. Batch insert into word_dictionary table
3. Track progress and verify results
