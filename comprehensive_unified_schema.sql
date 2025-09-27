-- 🎯 COMPREHENSIVE UNIFIED PASHTO BIBLE SEARCH SCHEMA
-- This schema combines frequency, verse occurrences, and morphological data
-- into a single, highly optimized table structure for sub-3ms searches

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 1. MASTER WORD FORMS TABLE (Single source of truth)
CREATE TABLE IF NOT EXISTS public.word_forms_master (
  id bigserial PRIMARY KEY,

  -- Core word identification
  form_pashto text NOT NULL,           -- Surface form in Pashto
  form_romanized text,                 -- Romanized version
  form_normalized text GENERATED ALWAYS AS (upper(trim(form_pashto))) STORED,

  -- Frequency data (consolidated)
  total_frequency integer NOT NULL DEFAULT 0,
  ot_frequency integer NOT NULL DEFAULT 0,
  nt_frequency integer NOT NULL DEFAULT 0,

  -- Morphological analysis (JSONB for rich features)
  morphology jsonb, -- Rich morphological features

  -- Part of speech and category
  pos text,                           -- Part of speech
  category text,                      -- Verb, Noun, Adjective, etc.
  subcategory text,                    -- Transitive, Intransitive, etc.

  -- Lemma and root relationships
  lemma_id text,                      -- Canonical lemma
  root_form text,                     -- Root/stem form
  related_forms jsonb,                -- Array of related surface forms

  -- Grammatical features (for verbs, nouns, etc.)
  grammatical_features jsonb,         -- Rich grammatical analysis

  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', form_pashto), 'A') ||
    setweight(to_tsvector('simple', COALESCE(form_romanized, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(lemma_id, '')), 'C')
  ) STORED,

  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. VERSE OCCURRENCES TABLE (Where each form appears)
CREATE TABLE IF NOT EXISTS public.verse_occurrences (
  id bigserial PRIMARY KEY,
  word_form_id bigint NOT NULL REFERENCES word_forms_master(id) ON DELETE CASCADE,

  -- Bible reference
  book text NOT NULL,
  chapter integer NOT NULL,
  verse integer NOT NULL,
  testament text NOT NULL CHECK (testament IN ('OT', 'NT')),

  -- Position in verse
  position_in_verse integer NOT NULL DEFAULT 0,

  -- Context (for phrase analysis)
  context_before text,                -- Words before this occurrence
  context_after text,                 -- Words after this occurrence

  -- Enhanced with morphological context
  morphological_context jsonb,        -- Surrounding morphological analysis

  -- Metadata
  created_at timestamptz DEFAULT now()
);

-- 3. PHRASE FORMS TABLE (Multi-token morphological units)
CREATE TABLE IF NOT EXISTS public.phrase_forms (
  id bigserial PRIMARY KEY,

  -- Phrase identification
  phrase_pashto text NOT NULL,        -- Full phrase text
  phrase_romanized text,
  phrase_type text NOT NULL,          -- compound_verb, negative_construction, etc.

  -- Component words
  component_forms jsonb NOT NULL,     -- Array of word form IDs that make up this phrase

  -- Frequency and occurrences
  total_occurrences integer NOT NULL DEFAULT 0,
  ot_occurrences integer NOT NULL DEFAULT 0,
  nt_occurrences integer NOT NULL DEFAULT 0,

  -- Morphological analysis
  morphology jsonb,                   -- Rich morphological features for the phrase
  grammatical_features jsonb,

  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', phrase_pashto), 'A') ||
    setweight(to_tsvector('simple', COALESCE(phrase_romanized, '')), 'B')
  ) STORED,

  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. PHRASE OCCURRENCES TABLE
CREATE TABLE IF NOT EXISTS public.phrase_occurrences (
  id bigserial PRIMARY KEY,
  phrase_form_id bigint NOT NULL REFERENCES phrase_forms(id) ON DELETE CASCADE,

  -- Bible reference
  book text NOT NULL,
  chapter integer NOT NULL,
  verse integer NOT NULL,
  testament text NOT NULL CHECK (testament IN ('OT', 'NT')),

  -- Position and context
  position_in_verse integer NOT NULL DEFAULT 0,
  context_before text,
  context_after text,

  -- Metadata
  created_at timestamptz DEFAULT now()
);

-- 5. MATERIALIZED VIEWS FOR PERFORMANCE
CREATE MATERIALIZED VIEW IF NOT EXISTS word_form_stats AS
SELECT
  wfm.id,
  wfm.form_pashto,
  wfm.total_frequency,
  wfm.ot_frequency,
  wfm.nt_frequency,
  COUNT(vo.id) as total_occurrences,
  COUNT(CASE WHEN vo.testament = 'OT' THEN 1 END) as ot_occurrences,
  COUNT(CASE WHEN vo.testament = 'NT' THEN 1 END) as nt_occurrences,
  wfm.pos,
  wfm.category
FROM word_forms_master wfm
LEFT JOIN verse_occurrences vo ON vo.word_form_id = wfm.id
GROUP BY wfm.id, wfm.form_pashto, wfm.total_frequency, wfm.ot_frequency,
         wfm.nt_frequency, wfm.pos, wfm.category;

CREATE MATERIALIZED VIEW IF NOT EXISTS phrase_form_stats AS
SELECT
  pf.id,
  pf.phrase_pashto,
  pf.total_occurrences,
  pf.ot_occurrences,
  pf.nt_occurrences,
  pf.phrase_type,
  pf.category
FROM phrase_forms pf;

-- 6. COMPREHENSIVE SEARCH FUNCTIONS
CREATE OR REPLACE FUNCTION search_word_with_forms(
  query text,
  limit_count integer DEFAULT 20,
  include_phrases boolean DEFAULT true
)
RETURNS TABLE (
  form_pashto text,
  form_romanized text,
  total_frequency integer,
  total_occurrences integer,
  pos text,
  category text,
  is_phrase boolean,
  morphology jsonb
) AS $$
SELECT
  wfm.form_pashto,
  wfm.form_romanized,
  wfm.total_frequency,
  wfs.total_occurrences,
  wfm.pos,
  wfm.category,
  false as is_phrase,
  wfm.morphology
FROM word_forms_master wfm
JOIN word_form_stats wfs ON wfs.id = wfm.id
WHERE wfm.search_vector @@ plainto_tsquery('simple', query)
ORDER BY
  wfm.total_frequency DESC,
  wfs.total_occurrences DESC
LIMIT limit_count

UNION ALL

SELECT
  pf.phrase_pashto,
  pf.phrase_romanized,
  pf.total_occurrences as total_frequency,
  pfs.total_occurrences,
  'phrase' as pos,
  pf.phrase_type as category,
  true as is_phrase,
  pf.morphology
FROM phrase_forms pf
JOIN phrase_form_stats pfs ON pfs.id = pf.id
WHERE include_phrases = true
  AND pf.search_vector @@ plainto_tsquery('simple', query)
ORDER BY pfs.total_occurrences DESC
LIMIT limit_count;
$$ LANGUAGE sql;

-- 7. FUZZY SEARCH WITH MORPHOLOGICAL AWARENESS
CREATE OR REPLACE FUNCTION fuzzy_search_words(
  query text,
  limit_count integer DEFAULT 10,
  include_roman boolean DEFAULT true
)
RETURNS TABLE (
  form_pashto text,
  form_romanized text,
  similarity_score real,
  total_frequency integer,
  total_occurrences integer,
  pos text,
  is_phrase boolean
) AS $$
SELECT
  wfm.form_pashto,
  wfm.form_romanized,
  similarity(wfm.form_pashto, query) as similarity_score,
  wfm.total_frequency,
  wfs.total_occurrences,
  wfm.pos,
  false as is_phrase
FROM word_forms_master wfm
JOIN word_form_stats wfs ON wfs.id = wfm.id
WHERE similarity(wfm.form_pashto, query) > 0.1
   OR (include_roman = true AND wfm.form_romanized IS NOT NULL
       AND similarity(wfm.form_romanized, query) > 0.1)
ORDER BY similarity_score DESC, wfm.total_frequency DESC
LIMIT limit_count

UNION ALL

SELECT
  pf.phrase_pashto,
  pf.phrase_romanized,
  similarity(pf.phrase_pashto, query) as similarity_score,
  pf.total_occurrences as total_frequency,
  pfs.total_occurrences,
  'phrase' as pos,
  true as is_phrase
FROM phrase_forms pf
JOIN phrase_form_stats pfs ON pfs.id = pf.id
WHERE similarity(pf.phrase_pashto, query) > 0.1
ORDER BY similarity_score DESC, pfs.total_occurrences DESC
LIMIT limit_count;
$$ LANGUAGE sql;

-- 8. MORPHOLOGICAL SEARCH
CREATE OR REPLACE FUNCTION morphological_search(
  query text,
  pos_filter text DEFAULT NULL,
  category_filter text DEFAULT NULL,
  limit_count integer DEFAULT 20
)
RETURNS TABLE (
  form_pashto text,
  form_romanized text,
  pos text,
  category text,
  morphology jsonb,
  total_frequency integer
) AS $$
SELECT
  wfm.form_pashto,
  wfm.form_romanized,
  wfm.pos,
  wfm.category,
  wfm.morphology,
  wfm.total_frequency
FROM word_forms_master wfm
WHERE (pos_filter IS NULL OR wfm.pos = pos_filter)
  AND (category_filter IS NULL OR wfm.category = category_filter)
  AND wfm.search_vector @@ plainto_tsquery('simple', query)
ORDER BY wfm.total_frequency DESC
LIMIT limit_count;
$$ LANGUAGE sql;

-- 9. VERSE CONTEXT SEARCH
CREATE OR REPLACE FUNCTION search_verses_with_word(
  word_form text,
  limit_count integer DEFAULT 50
)
RETURNS TABLE (
  book text,
  chapter integer,
  verse integer,
  text text,
  testament text,
  occurrences jsonb
) AS $$
SELECT
  v.book,
  v.chapter,
  v.verse,
  v.text,
  v.testament,
  jsonb_agg(
    jsonb_build_object(
      'word_form', vo.word_form_id,
      'position', vo.position_in_verse,
      'context_before', vo.context_before,
      'context_after', vo.context_after
    )
  ) as occurrences
FROM verses_yousafzai v
JOIN verse_occurrences vo ON vo.book = v.book
  AND vo.chapter = v.chapter
  AND vo.verse = v.verse
JOIN word_forms_master wfm ON wfm.id = vo.word_form_id
WHERE wfm.form_pashto = word_form
GROUP BY v.book, v.chapter, v.verse, v.text, v.testament
ORDER BY v.book, v.chapter, v.verse
LIMIT limit_count;
$$ LANGUAGE sql;

-- 10. PERFORMANCE OPTIMIZED INDEXES
CREATE UNIQUE INDEX IF NOT EXISTS word_forms_master_form_idx
  ON word_forms_master (form_pashto);

CREATE INDEX IF NOT EXISTS word_forms_master_search_idx
  ON word_forms_master USING gin (search_vector);

CREATE INDEX IF NOT EXISTS word_forms_master_pos_idx
  ON word_forms_master (pos);

CREATE INDEX IF NOT EXISTS word_forms_master_category_idx
  ON word_forms_master (category);

CREATE INDEX IF NOT EXISTS word_forms_master_frequency_idx
  ON word_forms_master (total_frequency DESC);

CREATE INDEX IF NOT EXISTS word_forms_master_lemma_idx
  ON word_forms_master (lemma_id);

-- Phrase indexes
CREATE UNIQUE INDEX IF NOT EXISTS phrase_forms_phrase_idx
  ON phrase_forms (phrase_pashto);

CREATE INDEX IF NOT EXISTS phrase_forms_search_idx
  ON phrase_forms USING gin (search_vector);

CREATE INDEX IF NOT EXISTS phrase_forms_type_idx
  ON phrase_forms (phrase_type);

-- Verse occurrence indexes
CREATE INDEX IF NOT EXISTS verse_occurrences_word_form_idx
  ON verse_occurrences (word_form_id);

CREATE INDEX IF NOT EXISTS verse_occurrences_book_chapter_verse_idx
  ON verse_occurrences (book, chapter, verse);

CREATE INDEX IF NOT EXISTS phrase_occurrences_phrase_form_idx
  ON phrase_occurrences (phrase_form_id);

-- 11. MIGRATION HELPERS
CREATE OR REPLACE FUNCTION migrate_frequency_data()
RETURNS text AS $$
BEGIN
  -- Insert consolidated frequency data into word_forms_master
  INSERT INTO word_forms_master (
    form_pashto, total_frequency, ot_frequency, nt_frequency,
    romanization, pos, english_translation, morphology
  )
  SELECT
    pashto_word,
    total_frequency,
    ot_frequency,
    nt_frequency,
    romanization,
    pos,
    english_translation,
    metadata
  FROM word_frequencies_unified
  ON CONFLICT (form_pashto) DO UPDATE SET
    total_frequency = EXCLUDED.total_frequency,
    ot_frequency = EXCLUDED.ot_frequency,
    nt_frequency = EXCLUDED.nt_frequency,
    romanization = EXCLUDED.romanization,
    pos = EXCLUDED.pos,
    english_translation = EXCLUDED.english_translation,
    morphology = EXCLUDED.morphology,
    updated_at = now();

  RETURN 'Frequency data with POS migrated successfully';
END;
$$ LANGUAGE plpgsql;

-- 12. ADDITIONAL SEARCH FUNCTIONS FOR POS-AWARE SEARCHES
CREATE OR REPLACE FUNCTION search_by_pos(
  query text,
  pos_filter text,
  limit_count integer DEFAULT 20
)
RETURNS TABLE (
  form_pashto text,
  form_romanized text,
  total_frequency integer,
  total_occurrences integer,
  pos text,
  english_translation text
) AS $$
SELECT
  wfm.form_pashto,
  wfm.form_romanized,
  wfm.total_frequency,
  wfs.total_occurrences,
  wfm.pos,
  wfm.english_translation
FROM word_forms_master wfm
JOIN word_form_stats wfs ON wfs.id = wfm.id
WHERE wfm.pos = pos_filter
  AND wfm.search_vector @@ plainto_tsquery('simple', query)
ORDER BY wfm.total_frequency DESC
LIMIT limit_count;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION get_verb_forms(
  limit_count integer DEFAULT 50
)
RETURNS TABLE (
  form_pashto text,
  form_romanized text,
  total_frequency integer,
  pos text,
  category text
) AS $$
SELECT
  wfm.form_pashto,
  wfm.form_romanized,
  wfm.total_frequency,
  wfm.pos,
  wfm.category
FROM word_forms_master wfm
WHERE wfm.pos IN ('v.', 'verb', 'Verb')
ORDER BY wfm.total_frequency DESC
LIMIT limit_count;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION get_noun_forms(
  limit_count integer DEFAULT 50
)
RETURNS TABLE (
  form_pashto text,
  form_romanized text,
  total_frequency integer,
  pos text,
  category text
) AS $$
SELECT
  wfm.form_pashto,
  wfm.form_romanized,
  wfm.total_frequency,
  wfm.pos,
  wfm.category
FROM word_forms_master wfm
WHERE wfm.pos IN ('n.', 'noun', 'Noun', 'Noun_Feminine', 'Noun_Plural')
ORDER BY wfm.total_frequency DESC
LIMIT limit_count;
$$ LANGUAGE sql;

-- 13. GRANTS
GRANT SELECT ON word_forms_master TO anon;
GRANT SELECT ON verse_occurrences TO anon;
GRANT SELECT ON phrase_forms TO anon;
GRANT SELECT ON phrase_occurrences TO anon;
GRANT SELECT ON word_form_stats TO anon;
GRANT SELECT ON phrase_form_stats TO anon;
GRANT EXECUTE ON FUNCTION search_word_with_forms(text, integer, boolean) TO anon;
GRANT EXECUTE ON FUNCTION fuzzy_search_words(text, integer, boolean) TO anon;
GRANT EXECUTE ON FUNCTION morphological_search(text, text, text, integer) TO anon;
GRANT EXECUTE ON FUNCTION search_verses_with_word(text, integer) TO anon;
GRANT EXECUTE ON FUNCTION search_by_pos(text, text, integer) TO anon;
GRANT EXECUTE ON FUNCTION get_verb_forms(integer) TO anon;
GRANT EXECUTE ON FUNCTION get_noun_forms(integer) TO anon;

COMMENT ON TABLE word_forms_master IS 'Master table combining frequency, morphological, and occurrence data';
COMMENT ON TABLE verse_occurrences IS 'Individual word occurrences in Bible verses with context';
COMMENT ON TABLE phrase_forms IS 'Multi-token morphological units (compound verbs, etc.)';
COMMENT ON TABLE phrase_occurrences IS 'Phrase occurrences in Bible verses';
