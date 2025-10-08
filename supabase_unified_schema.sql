-- ========================================
-- UNIFIED PASHTO BIBLE SEARCH DATABASE SCHEMA
-- ========================================
-- This schema implements the unified search approach for instant morphological analysis

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ========================================
-- CORE TABLES
-- ========================================

-- 1. Word Forms (individual words with morphological analysis)
CREATE TABLE IF NOT EXISTS public.word_forms (
  id BIGSERIAL PRIMARY KEY,
  form_pashto TEXT NOT NULL,
  form_romanized TEXT,
  pos TEXT, -- verb, noun, adjective, etc.
  lemma_root TEXT, -- root form
  frequency_count INTEGER DEFAULT 0,
  search_vector TSVECTOR,
  UNIQUE(form_pashto, lemma_root)
);

-- 2. Morphological Relationships (links between forms)
CREATE TABLE IF NOT EXISTS public.morphological_relationships (
  id BIGSERIAL PRIMARY KEY,
  root_form TEXT NOT NULL,
  related_form TEXT NOT NULL,
  relationship_type TEXT, -- conjugation, declension, etc.
  confidence_score FLOAT DEFAULT 1.0,
  UNIQUE(root_form, related_form, relationship_type)
);

-- 3. Bible Verses (for context and search)
CREATE TABLE IF NOT EXISTS public.verses (
  id BIGSERIAL PRIMARY KEY,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  testament TEXT NOT NULL CHECK (testament IN ('OT', 'NT')),
  UNIQUE(book, chapter, verse)
);

-- 4. Word Occurrences (which words appear in which verses)
CREATE TABLE IF NOT EXISTS public.word_occurrences (
  id BIGSERIAL PRIMARY KEY,
  word_form_id BIGINT REFERENCES word_forms(id) ON DELETE CASCADE,
  verse_id BIGINT REFERENCES verses(id) ON DELETE CASCADE,
  position_in_verse INTEGER,
  UNIQUE(word_form_id, verse_id, position_in_verse)
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Core search indexes
CREATE INDEX IF NOT EXISTS idx_word_forms_search ON word_forms USING GIN (form_pashto gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_word_forms_lemma ON word_forms (lemma_root);
CREATE INDEX IF NOT EXISTS idx_word_forms_frequency ON word_forms (frequency_count DESC);
CREATE INDEX IF NOT EXISTS idx_word_forms_pos ON word_forms (pos);

-- Relationship indexes
CREATE INDEX IF NOT EXISTS idx_morph_rel_root ON morphological_relationships (root_form);
CREATE INDEX IF NOT EXISTS idx_morph_rel_related ON morphological_relationships (related_form);

-- Verse indexes
CREATE INDEX IF NOT EXISTS idx_verses_book_chapter ON verses (book, chapter);
CREATE INDEX IF NOT EXISTS idx_verses_testament ON verses (testament);

-- Occurrence indexes
CREATE INDEX IF NOT EXISTS idx_word_occurrences_verse ON word_occurrences (verse_id);
CREATE INDEX IF NOT EXISTS idx_word_occurrences_form ON word_occurrences (word_form_id);

-- ========================================
-- AUTOMATIC UPDATES
-- ========================================

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_word_form_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('simple', COALESCE(NEW.form_pashto, '') || ' ' || COALESCE(NEW.form_romanized, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update search vectors
CREATE TRIGGER trigger_update_search_vector
  BEFORE INSERT OR UPDATE ON word_forms
  FOR EACH ROW EXECUTE FUNCTION update_word_form_search_vector();

-- ========================================
-- CORE SEARCH FUNCTIONS
-- ========================================

-- 1. Find word with all its related forms
CREATE OR REPLACE FUNCTION search_word_with_forms(target_word TEXT)
RETURNS TABLE (
  form_pashto TEXT,
  frequency_count INTEGER,
  related_forms TEXT[],
  verse_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    wf.form_pashto,
    wf.frequency_count,
    array_agg(DISTINCT mr.related_form ORDER BY mr.related_form) as related_forms,
    COUNT(DISTINCT wo.verse_id)::INTEGER as verse_count
  FROM word_forms wf
  LEFT JOIN morphological_relationships mr ON mr.root_form = wf.form_pashto
  LEFT JOIN word_occurrences wo ON wo.word_form_id = wf.id
  WHERE wf.form_pashto = target_word
     OR mr.related_form = target_word
  GROUP BY wf.id, wf.form_pashto, wf.frequency_count;
END;
$$ LANGUAGE plpgsql;

-- 2. Fuzzy search for similar words
CREATE OR REPLACE FUNCTION fuzzy_search_words(search_term TEXT, max_results INTEGER DEFAULT 20)
RETURNS TABLE (
  form_pashto TEXT,
  similarity_score REAL,
  frequency_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    wf.form_pashto,
    similarity(wf.form_pashto, search_term) as similarity_score,
    wf.frequency_count
  FROM word_forms wf
  WHERE similarity(wf.form_pashto, search_term) > 0.3
  ORDER BY similarity_score DESC, wf.frequency_count DESC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- 3. Get words by frequency (for autocomplete)
CREATE OR REPLACE FUNCTION get_frequent_words(limit_count INTEGER DEFAULT 100)
RETURNS TABLE (
  form_pashto TEXT,
  frequency_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    wf.form_pashto,
    wf.frequency_count
  FROM word_forms wf
  WHERE wf.frequency_count > 0
  ORDER BY wf.frequency_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 4. Find all forms of a root word
CREATE OR REPLACE FUNCTION get_forms_for_root(root_word TEXT)
RETURNS TABLE (
  form_pashto TEXT,
  pos TEXT,
  frequency_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    wf.form_pashto,
    wf.pos,
    wf.frequency_count
  FROM word_forms wf
  WHERE wf.lemma_root = root_word
  ORDER BY wf.frequency_count DESC;
END;
$$ LANGUAGE plpgsql;

-- 5. Complex morphological search
CREATE OR REPLACE FUNCTION morphological_search(
  search_term TEXT,
  pos_filter TEXT DEFAULT NULL,
  min_frequency INTEGER DEFAULT 1
)
RETURNS TABLE (
  form_pashto TEXT,
  pos TEXT,
  frequency_count INTEGER,
  related_forms TEXT[],
  morphological_score REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    wf.form_pashto,
    wf.pos,
    wf.frequency_count,
    array_agg(DISTINCT mr.related_form ORDER BY mr.related_form) as related_forms,
    (
      -- Base score from frequency
      LEAST(wf.frequency_count::REAL / 1000.0, 1.0) * 0.4 +
      -- Boost for exact matches
      CASE WHEN wf.form_pashto = search_term THEN 1.0 ELSE 0.0 END * 0.6 +
      -- Boost for related forms
      CASE WHEN EXISTS(
        SELECT 1 FROM morphological_relationships mr2
        WHERE mr2.related_form = search_term AND mr2.root_form = wf.form_pashto
      ) THEN 0.8 ELSE 0.0 END
    ) as morphological_score
  FROM word_forms wf
  LEFT JOIN morphological_relationships mr ON mr.root_form = wf.form_pashto
  WHERE (
    wf.form_pashto ILIKE '%' || search_term || '%' OR
    wf.lemma_root ILIKE '%' || search_term || '%' OR
    mr.related_form ILIKE '%' || search_term || '%'
  )
  AND (pos_filter IS NULL OR wf.pos = pos_filter)
  AND wf.frequency_count >= min_frequency
  GROUP BY wf.id, wf.form_pashto, wf.pos, wf.frequency_count
  ORDER BY morphological_score DESC, wf.frequency_count DESC;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- VIEWS FOR COMPLEX QUERIES
-- ========================================

-- Comprehensive word analysis view
CREATE OR REPLACE VIEW word_analysis AS
SELECT
  wf.form_pashto,
  wf.form_romanized,
  wf.pos,
  wf.lemma_root,
  wf.frequency_count,
  COUNT(DISTINCT wo.verse_id) as verse_count,
  COUNT(DISTINCT mr.related_form) as related_forms_count,
  array_agg(DISTINCT mr.related_form ORDER BY mr.related_form) as related_forms
FROM word_forms wf
LEFT JOIN word_occurrences wo ON wo.word_form_id = wf.id
LEFT JOIN morphological_relationships mr ON mr.root_form = wf.form_pashto
GROUP BY wf.id, wf.form_pashto, wf.form_romanized, wf.pos, wf.lemma_root, wf.frequency_count;

-- Search helper view
CREATE OR REPLACE VIEW searchable_content AS
SELECT
  v.id as verse_id,
  v.book,
  v.chapter,
  v.verse,
  v.text,
  v.testament,
  array_agg(DISTINCT wf.form_pashto ORDER BY wf.form_pashto) as word_forms,
  array_agg(DISTINCT wf.lemma_root ORDER BY wf.lemma_root) as lemmas,
  sum(wf.frequency_count) as total_word_frequency
FROM verses v
JOIN word_occurrences wo ON wo.verse_id = v.id
JOIN word_forms wf ON wf.id = wo.word_form_id
GROUP BY v.id, v.book, v.chapter, v.verse, v.text, v.testament;

-- Audio mapping view for audio URLs
CREATE OR REPLACE VIEW audio_by_verse AS
SELECT
  v.book || ' ' || v.chapter::text || ':' || v.verse::text as verse_ref,
  NULL as url -- Placeholder for audio URLs, can be populated later
FROM verses v
WHERE v.book IS NOT NULL AND v.chapter IS NOT NULL AND v.verse IS NOT NULL;

-- ========================================
-- SAMPLE DATA POPULATION
-- ========================================

-- Populate with sample وهل data for testing
INSERT INTO word_forms (form_pashto, form_romanized, pos, lemma_root, frequency_count) VALUES
('وهل', 'wahul', 'verb', 'وهل', 156),
('وهم', 'wahum', 'verb', 'وهل', 45),
('وهو', 'wahoo', 'verb', 'وهل', 23),
('وهې', 'wahe', 'verb', 'وهل', 12),
('وهي', 'wahee', 'verb', 'وهل', 8),
('وهلم', 'wahlam', 'verb', 'وهل', 5),
('وهلو', 'wahloo', 'verb', 'وهل', 3),
('وهلې', 'wahle', 'verb', 'وهل', 2),
('وهلی', 'wahlay', 'verb', 'وهل', 1),
('کول', 'kawul', 'verb', 'کول', 2847),
('کوم', 'koom', 'verb', 'کول', 892)
ON CONFLICT (form_pashto, lemma_root) DO NOTHING;

-- Create morphological relationships
INSERT INTO morphological_relationships (root_form, related_form, relationship_type, confidence_score) VALUES
('وهل', 'وهم', 'conjugation', 1.0),
('وهل', 'وهو', 'conjugation', 1.0),
('وهل', 'وهې', 'conjugation', 1.0),
('وهل', 'وهي', 'conjugation', 1.0),
('وهل', 'وهلم', 'conjugation', 1.0),
('وهل', 'وهلو', 'conjugation', 1.0),
('وهل', 'وهلې', 'conjugation', 1.0),
('وهل', 'وهلی', 'conjugation', 1.0),
('کول', 'کوم', 'conjugation', 1.0)
ON CONFLICT (root_form, related_form, relationship_type) DO NOTHING;

-- ========================================
-- PERMISSIONS
-- ========================================

-- Grant permissions for the search API
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE word_forms IS 'Individual word forms with morphological analysis and frequency data';
COMMENT ON TABLE morphological_relationships IS 'Links between root forms and their morphological variants';
COMMENT ON TABLE verses IS 'Bible verses with text and metadata';
COMMENT ON TABLE word_occurrences IS 'Tracks which words appear in which verses';

COMMENT ON FUNCTION search_word_with_forms IS 'Finds a word and all its related morphological forms with frequency data';
COMMENT ON FUNCTION fuzzy_search_words IS 'Performs fuzzy search across all word forms using trigram similarity';
COMMENT ON FUNCTION get_frequent_words IS 'Returns most frequent words for autocomplete and suggestions';
COMMENT ON FUNCTION get_forms_for_root IS 'Finds all forms (conjugations, declensions) of a root word';
COMMENT ON FUNCTION morphological_search IS 'Performs comprehensive morphological search with filtering options';

