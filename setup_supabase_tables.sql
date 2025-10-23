-- ========================================
-- PASHTO BIBLE SEARCH - SUPABASE SETUP
-- ========================================
-- Run this script in your Supabase SQL editor to set up the required tables
-- URL: https://supabase.com/dashboard/project/nkombdutnjvaasxrbmdn/database/tables

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ========================================
-- 1. VERSES TABLE (Main Bible verses)
-- ========================================

CREATE TABLE IF NOT EXISTS public.verses (
  id BIGSERIAL PRIMARY KEY,
  ref TEXT NOT NULL UNIQUE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  testament TEXT NOT NULL CHECK (testament IN ('OT', 'NT')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 2. WORD INDEX TABLE (For ultra-fast lookups)
-- ========================================

CREATE TABLE IF NOT EXISTS public.word_index (
  id BIGSERIAL PRIMARY KEY,
  word TEXT NOT NULL,
  verse_refs TEXT[] NOT NULL,
  frequency INTEGER NOT NULL DEFAULT 0,
  tf_idf_score REAL[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(word)
);

-- ========================================
-- 3. SEARCH INDEX TABLE (For less common words)
-- ========================================

CREATE TABLE IF NOT EXISTS public.search_index (
  id BIGSERIAL PRIMARY KEY,
  term TEXT NOT NULL,
  verse_ids BIGINT[] NOT NULL,
  tf_idf_scores REAL[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(term)
);

-- ========================================
-- 4. LEMMAS TABLE (Dictionary entries)
-- ========================================

CREATE TABLE IF NOT EXISTS public.lemmas (
  id BIGSERIAL PRIMARY KEY,
  headword_pashto TEXT NOT NULL,
  headword_roman TEXT,
  pos TEXT NOT NULL,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(headword_pashto, pos)
);

-- ========================================
-- 5. WORD FORMS TABLE (Inflected forms)
-- ========================================

CREATE TABLE IF NOT EXISTS public.word_forms (
  id BIGSERIAL PRIMARY KEY,
  form_pashto TEXT NOT NULL,
  form_romanized TEXT,
  lemma_id BIGINT REFERENCES lemmas(id) ON DELETE CASCADE,
  features JSONB DEFAULT '{}',
  frequency_count INTEGER DEFAULT 0,
  search_vector TSVECTOR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(form_pashto, lemma_id)
);

-- ========================================
-- 6. PHRASE FORMS TABLE (Multi-word forms)
-- ========================================

CREATE TABLE IF NOT EXISTS public.phrase_forms (
  id BIGSERIAL PRIMARY KEY,
  phrase_pashto TEXT NOT NULL,
  lemma_id BIGINT REFERENCES lemmas(id) ON DELETE CASCADE,
  token_count SMALLINT NOT NULL,
  features JSONB DEFAULT '{}',
  frequency_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(phrase_pashto, lemma_id)
);

-- ========================================
-- 7. WORD OCCURRENCES TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS public.word_occurrences (
  id BIGSERIAL PRIMARY KEY,
  word_form_id BIGINT REFERENCES word_forms(id) ON DELETE CASCADE,
  verse_id BIGINT REFERENCES verses(id) ON DELETE CASCADE,
  position_in_verse INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(word_form_id, verse_id, position_in_verse)
);

-- ========================================
-- 8. PHRASE OCCURRENCES TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS public.phrase_occurrences (
  id BIGSERIAL PRIMARY KEY,
  phrase_id BIGINT REFERENCES phrase_forms(id) ON DELETE CASCADE,
  verse_id BIGINT REFERENCES verses(id) ON DELETE CASCADE,
  start_pos INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(phrase_id, verse_id, start_pos)
);

-- ========================================
-- 9. LEMMA RELATIONS TABLE (Compound relationships)
-- ========================================

CREATE TABLE IF NOT EXISTS public.lemma_relations (
  id BIGSERIAL PRIMARY KEY,
  src_lemma_id BIGINT NOT NULL REFERENCES lemmas(id) ON DELETE CASCADE,
  dst_lemma_id BIGINT NOT NULL REFERENCES lemmas(id) ON DELETE CASCADE,
  rel TEXT NOT NULL,
  weight REAL DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(src_lemma_id, dst_lemma_id, rel)
);

-- ========================================
-- 10. PERFORMANCE INDEXES
-- ========================================

-- Core search indexes
CREATE INDEX IF NOT EXISTS idx_word_index_word ON word_index USING GIN (word gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_word_index_frequency ON word_index (frequency DESC);

CREATE INDEX IF NOT EXISTS idx_search_index_term ON search_index USING GIN (term gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_verses_book_chapter ON verses (book, chapter);
CREATE INDEX IF NOT EXISTS idx_verses_testament ON verses (testament);
CREATE INDEX IF NOT EXISTS idx_verses_ref ON verses (ref);

CREATE INDEX IF NOT EXISTS idx_word_forms_search ON word_forms USING GIN (form_pashto gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_word_forms_lemma ON word_forms (lemma_id);
CREATE INDEX IF NOT EXISTS idx_word_forms_features ON word_forms USING GIN (features jsonb_path_ops);

CREATE INDEX IF NOT EXISTS idx_phrase_forms_search ON phrase_forms USING GIN (phrase_pashto gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_phrase_forms_features ON phrase_forms USING GIN (features jsonb_path_ops);

CREATE INDEX IF NOT EXISTS idx_lemmas_pos ON lemmas (pos);
CREATE INDEX IF NOT EXISTS idx_lemmas_headword ON lemmas (headword_pashto);

CREATE INDEX IF NOT EXISTS idx_word_occurrences_verse ON word_occurrences (verse_id);
CREATE INDEX IF NOT EXISTS idx_phrase_occurrences_verse ON phrase_occurrences (verse_id);

-- ========================================
-- 11. FUNCTIONS FOR AUTOMATIC UPDATES
-- ========================================

CREATE OR REPLACE FUNCTION update_word_form_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('simple',
    COALESCE(NEW.form_pashto, '') || ' ' ||
    COALESCE(NEW.form_romanized, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_word_form_search_vector
  BEFORE INSERT OR UPDATE ON word_forms
  FOR EACH ROW EXECUTE FUNCTION update_word_form_search_vector();

-- ========================================
-- 12. SEARCH FUNCTIONS
-- ========================================

CREATE OR REPLACE FUNCTION search_verses_by_word(word_query TEXT)
RETURNS TABLE (
  id BIGINT,
  ref TEXT,
  book TEXT,
  chapter INTEGER,
  verse INTEGER,
  text TEXT,
  testament TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT v.id, v.ref, v.book, v.chapter, v.verse, v.text, v.testament
  FROM verses v
  WHERE v.text ILIKE '%' || word_query || '%'
  ORDER BY v.testament, v.book, v.chapter, v.verse;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 13. SAMPLE DATA (Optional - for testing)
-- ========================================

-- Insert sample verses (replace with your actual data)
-- INSERT INTO verses (ref, book, chapter, verse, text, testament) VALUES
-- ('Genesis 1:1', 'Genesis', 1, 1, 'په پیل کې خدای اسمان او ځمکه پیدا کړه', 'OT'),
-- ('John 3:16', 'John', 3, 16, 'ځکه چې خدای نړۍ دومره محبت کړې ده', 'NT');

-- ========================================
-- 14. PERMISSIONS
-- ========================================

-- Grant permissions to authenticated and anonymous users
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- ========================================
-- 15. COMMENTS
-- ========================================

COMMENT ON TABLE verses IS 'Bible verses with testament classification';
COMMENT ON TABLE word_index IS 'Ultra-fast word lookup index for common words';
COMMENT ON TABLE search_index IS 'Fallback search index for less common words';
COMMENT ON TABLE lemmas IS 'Canonical lemma entries with metadata';
COMMENT ON TABLE word_forms IS 'Single-token word forms with morphological features';
COMMENT ON TABLE phrase_forms IS 'Multi-token phrase forms (perfect series, negatives, etc.)';

-- ========================================
-- SETUP COMPLETE
-- ========================================

-- Check table creation
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'verses', 'word_index', 'search_index', 'lemmas',
    'word_forms', 'phrase_forms', 'word_occurrences',
    'phrase_occurrences', 'lemma_relations'
  )
ORDER BY tablename;
