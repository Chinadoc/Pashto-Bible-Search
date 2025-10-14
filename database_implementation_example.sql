-- Database Implementation Example for Unified Search
-- Shows how to set up the schema in Supabase

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 2. Create the core tables (simplified version for demo)
CREATE TABLE IF NOT EXISTS word_forms (
  id BIGSERIAL PRIMARY KEY,
  form_pashto TEXT NOT NULL,
  form_romanized TEXT,
  pos TEXT, -- verb, noun, adjective, etc.
  lemma_root TEXT, -- root form
  frequency_count INTEGER DEFAULT 0,
  search_vector TSVECTOR,
  UNIQUE(form_pashto, lemma_root)
);

CREATE TABLE IF NOT EXISTS morphological_relationships (
  id BIGSERIAL PRIMARY KEY,
  root_form TEXT NOT NULL,
  related_form TEXT NOT NULL,
  relationship_type TEXT, -- conjugation, declension, etc.
  confidence_score FLOAT DEFAULT 1.0,
  UNIQUE(root_form, related_form, relationship_type)
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_word_forms_search ON word_forms USING GIN (form_pashto gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_word_forms_lemma ON word_forms (lemma_root);
CREATE INDEX IF NOT EXISTS idx_word_forms_frequency ON word_forms (frequency_count DESC);

-- 4. Function to update search vector
CREATE OR REPLACE FUNCTION update_word_form_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('simple', COALESCE(NEW.form_pashto, '') || ' ' || COALESCE(NEW.form_romanized, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_search_vector
  BEFORE INSERT OR UPDATE ON word_forms
  FOR EACH ROW EXECUTE FUNCTION update_word_form_search_vector();

-- 5. Core search functions
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

-- 6. Fuzzy search function
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

-- 7. Populate with sample data (وهل example)
INSERT INTO word_forms (form_pashto, form_romanized, pos, lemma_root, frequency_count) VALUES
('وهل', 'wahul', 'verb', 'وهل', 156),
('وهم', 'wahum', 'verb', 'وهل', 45),
('وهو', 'wahoo', 'verb', 'وهل', 23),
('وهې', 'wahe', 'verb', 'وهل', 12),
('وهي', 'wahee', 'verb', 'وهل', 8),
('وهلم', 'wahlam', 'verb', 'وهل', 5),
('وهلو', 'wahloo', 'verb', 'وهل', 3),
('وهلې', 'wahle', 'verb', 'وهل', 2),
('وهلی', 'wahlay', 'verb', 'وهل', 1)
ON CONFLICT (form_pashto, lemma_root) DO NOTHING;

-- 8. Create morphological relationships
INSERT INTO morphological_relationships (root_form, related_form, relationship_type, confidence_score) VALUES
('وهل', 'وهم', 'conjugation', 1.0),
('وهل', 'وهو', 'conjugation', 1.0),
('وهل', 'وهې', 'conjugation', 1.0),
('وهل', 'وهي', 'conjugation', 1.0),
('وهل', 'وهلم', 'conjugation', 1.0),
('وهل', 'وهلو', 'conjugation', 1.0),
('وهل', 'وهلې', 'conjugation', 1.0),
('وهل', 'وهلی', 'conjugation', 1.0)
ON CONFLICT (root_form, related_form, relationship_type) DO NOTHING;

-- 9. Grant permissions
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;

COMMENT ON TABLE word_forms IS 'Individual word forms with morphological analysis';
COMMENT ON TABLE morphological_relationships IS 'Links between root forms and their variants';
COMMENT ON FUNCTION search_word_with_forms IS 'Finds a word and all its related forms with frequency data';
COMMENT ON FUNCTION fuzzy_search_words IS 'Performs fuzzy search across all word forms';

