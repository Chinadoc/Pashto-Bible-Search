-- Unified Pashto Bible Linguistic Database Schema
-- This schema consolidates all morphological, lexical, and search data into a single, optimized structure

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ========================================
-- CORE TABLES
-- ========================================

-- 1. Bible Verses (main text storage)
CREATE TABLE IF NOT EXISTS public.verses (
  id BIGSERIAL PRIMARY KEY,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  text_normalized TEXT, -- normalized version for search
  testament TEXT NOT NULL CHECK (testament IN ('OT', 'NT')),
  translation TEXT, -- e.g., 'Yousafzai 2019'
  dialect TEXT, -- e.g., 'Yousafzai'
  UNIQUE(book, chapter, verse, translation, dialect)
);

-- 2. Word Forms (individual words with morphological analysis)
CREATE TABLE IF NOT EXISTS public.word_forms (
  id BIGSERIAL PRIMARY KEY,
  form_pashto TEXT NOT NULL,
  form_romanized TEXT,
  form_normalized TEXT, -- for search consistency

  -- Morphological classification
  pos TEXT, -- verb, noun, adjective, pronoun, etc.
  grammatical_category TEXT, -- present, past, singular, plural, etc.
  stem_type TEXT, -- imperfective, perfective, etc. for verbs

  -- Lexical relationships
  lemma_root TEXT, -- root form in lexicon
  root_word TEXT, -- ultimate root (e.g., for compound verbs)

  -- Frequency and usage data
  frequency_count INTEGER DEFAULT 0,
  book_frequency JSONB, -- frequency per book: {"Genesis": 10, "Exodus": 5}

  -- Search optimization
  search_vector TSVECTOR,
  trigram_index TEXT, -- for fuzzy search

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(form_pashto, pos, grammatical_category, lemma_root)
);

-- 3. Word Occurrences (verse-specific occurrences)
CREATE TABLE IF NOT EXISTS public.word_occurrences (
  id BIGSERIAL PRIMARY KEY,
  word_form_id BIGINT REFERENCES word_forms(id) ON DELETE CASCADE,
  verse_id BIGINT REFERENCES verses(id) ON DELETE CASCADE,
  position_in_verse INTEGER, -- word position in verse
  context_before TEXT, -- words before this occurrence
  context_after TEXT, -- words after this occurrence

  UNIQUE(word_form_id, verse_id, position_in_verse)
);

-- 4. Lexicon Entries (comprehensive morphological data)
CREATE TABLE IF NOT EXISTS public.lexicon_entries (
  id BIGSERIAL PRIMARY KEY,
  lemma_pashto TEXT NOT NULL,
  lemma_romanized TEXT,
  pos TEXT NOT NULL,

  -- Morphological patterns
  conjugation_pattern TEXT, -- for verbs
  declension_pattern TEXT, -- for nouns/adjectives

  -- Stems and roots
  imperfective_stem TEXT,
  perfective_stem TEXT,
  past_participle TEXT,

  -- Additional metadata
  etymology TEXT,
  notes TEXT,
  is_irregular BOOLEAN DEFAULT FALSE,
  is_compound BOOLEAN DEFAULT FALSE,

  -- JSON fields for complex data
  conjugation_data JSONB, -- full conjugation tables
  inflection_data JSONB, -- full declension tables
  related_forms JSONB, -- related words

  UNIQUE(lemma_pashto, pos)
);

-- 5. Variant Relationships (generated forms linked to roots)
CREATE TABLE IF NOT EXISTS public.variant_relationships (
  id BIGSERIAL PRIMARY KEY,
  root_form_id BIGINT REFERENCES word_forms(id) ON DELETE CASCADE,
  variant_form_id BIGINT REFERENCES word_forms(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL, -- conjugation, declension, derivation, etc.
  confidence_score FLOAT DEFAULT 1.0,

  UNIQUE(root_form_id, variant_form_id, relationship_type)
);

-- ========================================
-- SEARCH INDEXES
-- ========================================

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_verses_search ON verses USING GIN (to_tsvector('simple', text));

-- Fuzzy search indexes
CREATE INDEX IF NOT EXISTS idx_word_forms_trigram ON word_forms USING GIN (form_pashto gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_word_forms_romanized_trigram ON word_forms USING GIN (form_romanized gin_trgm_ops);

-- Morphological search indexes
CREATE INDEX IF NOT EXISTS idx_word_forms_pos ON word_forms (pos);
CREATE INDEX IF NOT EXISTS idx_word_forms_lemma ON word_forms (lemma_root);
CREATE INDEX IF NOT EXISTS idx_word_forms_frequency ON word_forms (frequency_count DESC);

-- Lexicon lookup indexes
CREATE INDEX IF NOT EXISTS idx_lexicon_entries_lemma ON lexicon_entries (lemma_pashto);
CREATE INDEX IF NOT EXISTS idx_lexicon_entries_pos ON lexicon_entries (pos);

-- ========================================
-- FUNCTIONS
-- ========================================

-- Function to update word form search vector
CREATE OR REPLACE FUNCTION update_word_form_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('simple', COALESCE(NEW.form_pashto, '') || ' ' || COALESCE(NEW.form_romanized, ''));
  NEW.trigram_index := NEW.form_pashto;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update search vectors
CREATE TRIGGER trigger_update_word_form_search_vector
  BEFORE INSERT OR UPDATE ON word_forms
  FOR EACH ROW EXECUTE FUNCTION update_word_form_search_vector();

-- Function to generate comprehensive morphological analysis
CREATE OR REPLACE FUNCTION generate_morphological_analysis(target_form TEXT)
RETURNS TABLE (
  form_id BIGINT,
  form_pashto TEXT,
  pos TEXT,
  lemma_root TEXT,
  confidence FLOAT,
  analysis_type TEXT
) AS $$
BEGIN
  -- Direct match in word_forms
  RETURN QUERY
  SELECT
    wf.id,
    wf.form_pashto,
    wf.pos,
    wf.lemma_root,
    1.0::FLOAT as confidence,
    'direct_match'::TEXT as analysis_type
  FROM word_forms wf
  WHERE wf.form_pashto = target_form;

  -- Morphological derivation (verb conjugation, noun declension)
  RETURN QUERY
  SELECT
    wf.id,
    wf.form_pashto,
    wf.pos,
    wf.lemma_root,
    0.8::FLOAT as confidence,
    'morphological_derivation'::TEXT as analysis_type
  FROM word_forms wf
  JOIN variant_relationships vr ON vr.variant_form_id = wf.id
  WHERE vr.root_form_id IN (
    SELECT id FROM word_forms WHERE form_pashto = target_form
  );

  -- Lexicon-based analysis
  RETURN QUERY
  SELECT
    NULL::BIGINT as form_id,
    le.lemma_pashto as form_pashto,
    le.pos,
    le.lemma_pashto as lemma_root,
    0.6::FLOAT as confidence,
    'lexicon_entry'::TEXT as analysis_type
  FROM lexicon_entries le
  WHERE le.lemma_pashto = target_form;
END;
$$ LANGUAGE plpgsql;

-- Function to find related forms (variants)
CREATE OR REPLACE FUNCTION find_related_forms(target_form TEXT, max_results INTEGER DEFAULT 20)
RETURNS TABLE (
  form_pashto TEXT,
  pos TEXT,
  relationship_type TEXT,
  confidence_score FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    wf.form_pashto,
    wf.pos,
    vr.relationship_type,
    vr.confidence_score
  FROM word_forms wf
  JOIN variant_relationships vr ON vr.variant_form_id = wf.id
  WHERE vr.root_form_id IN (
    SELECT id FROM word_forms WHERE form_pashto = target_form
  )
  ORDER BY vr.confidence_score DESC, wf.frequency_count DESC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Function to search verses by morphological criteria
CREATE OR REPLACE FUNCTION search_verses_morphological(
  search_term TEXT,
  pos_filter TEXT DEFAULT NULL,
  lemma_filter TEXT DEFAULT NULL,
  max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
  verse_id BIGINT,
  book TEXT,
  chapter INTEGER,
  verse INTEGER,
  text TEXT,
  testament TEXT,
  relevance_score FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.id,
    v.book,
    v.chapter,
    v.verse,
    v.text,
    v.testament,
    (
      -- Base relevance from word frequency
      COALESCE(wf.frequency_count, 0) * 0.3 +
      -- Boost for exact matches
      CASE WHEN v.text ILIKE '%' || search_term || '%' THEN 100 ELSE 0 END +
      -- Boost for morphological matches
      CASE WHEN wf.pos = pos_filter THEN 50 ELSE 0 END +
      -- Boost for lemma matches
      CASE WHEN wf.lemma_root = lemma_filter THEN 30 ELSE 0 END
    ) as relevance_score
  FROM verses v
  JOIN word_occurrences wo ON wo.verse_id = v.id
  JOIN word_forms wf ON wf.id = wo.word_form_id
  WHERE (
    wf.form_pashto ILIKE '%' || search_term || '%' OR
    wf.form_romanized ILIKE '%' || search_term || '%' OR
    wf.lemma_root ILIKE '%' || search_term || '%'
  )
  AND (pos_filter IS NULL OR wf.pos = pos_filter)
  AND (lemma_filter IS NULL OR wf.lemma_root = lemma_filter)
  ORDER BY relevance_score DESC, wf.frequency_count DESC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- VIEWS
-- ========================================

-- Comprehensive word analysis view
CREATE OR REPLACE VIEW word_analysis AS
SELECT
  wf.form_pashto,
  wf.form_romanized,
  wf.pos,
  wf.lemma_root,
  wf.frequency_count,
  le.conjugation_pattern,
  le.declension_pattern,
  COUNT(DISTINCT wo.verse_id) as verse_count,
  COUNT(DISTINCT vr.variant_form_id) as variant_count,
  JSON_OBJECT_AGG(
    v.book,
    COUNT(wo2.id)
  ) as book_distribution
FROM word_forms wf
LEFT JOIN lexicon_entries le ON le.lemma_pashto = wf.lemma_root
LEFT JOIN word_occurrences wo ON wo.word_form_id = wf.id
LEFT JOIN verses v ON v.id = wo.verse_id
LEFT JOIN word_occurrences wo2 ON wo2.verse_id = v.id
LEFT JOIN variant_relationships vr ON vr.root_form_id = wf.id
GROUP BY wf.id, wf.form_pashto, wf.form_romanized, wf.pos, wf.lemma_root,
         wf.frequency_count, le.conjugation_pattern, le.declension_pattern;

-- Search helper view
CREATE OR REPLACE VIEW searchable_content AS
SELECT
  v.id as verse_id,
  v.book,
  v.chapter,
  v.verse,
  v.text,
  v.testament,
  ARRAY_AGG(DISTINCT wf.form_pashto ORDER BY wf.form_pashto) as word_forms,
  ARRAY_AGG(DISTINCT wf.lemma_root ORDER BY wf.lemma_root) as lemmas,
  ARRAY_AGG(DISTINCT wf.pos ORDER BY wf.pos) as pos_tags,
  SUM(wf.frequency_count) as total_word_frequency
FROM verses v
JOIN word_occurrences wo ON wo.verse_id = v.id
JOIN word_forms wf ON wf.id = wo.word_form_id
GROUP BY v.id, v.book, v.chapter, v.verse, v.text, v.testament;

-- ========================================
-- INITIALIZATION
-- ========================================

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_word_occurrences_verse ON word_occurrences (verse_id);
CREATE INDEX IF NOT EXISTS idx_word_occurrences_form ON word_occurrences (word_form_id);
CREATE INDEX IF NOT EXISTS idx_variant_relationships_root ON variant_relationships (root_form_id);
CREATE INDEX IF NOT EXISTS idx_variant_relationships_variant ON variant_relationships (variant_form_id);

COMMENT ON TABLE verses IS 'Core Bible text with verse references';
COMMENT ON TABLE word_forms IS 'Individual word forms with morphological analysis';
COMMENT ON TABLE word_occurrences IS 'Specific occurrences of words in verses';
COMMENT ON TABLE lexicon_entries IS 'Comprehensive morphological and lexical data';
COMMENT ON TABLE variant_relationships IS 'Links between root forms and their variants';

COMMENT ON FUNCTION generate_morphological_analysis IS 'Analyzes a word form and returns possible morphological interpretations';
COMMENT ON FUNCTION find_related_forms IS 'Finds related forms (conjugations, declensions) for a given word';
COMMENT ON FUNCTION search_verses_morphological IS 'Searches verses using morphological criteria';
