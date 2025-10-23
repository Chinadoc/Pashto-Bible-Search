-- ========================================
-- OPTIMIZED PASHTO BIBLE SEARCH SCHEMA
-- ========================================
-- Replaces the current fragmented setup with a production-ready structure
-- Run this in Supabase SQL editor: https://supabase.com/dashboard/project/nkombdutnjvaasxrbmdn/database/tables

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ========================================
-- 1. VERSES TABLE (Afghan 2023 Translation)
-- ========================================

CREATE TABLE IF NOT EXISTS public.verses (
  id BIGSERIAL PRIMARY KEY,
  ref TEXT NOT NULL UNIQUE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  text_normalized TEXT,
  testament TEXT NOT NULL CHECK (testament IN ('OT', 'NT')),
  translation_key TEXT NOT NULL DEFAULT 'afghan2023',
  dialect TEXT DEFAULT 'afghan',
  audio_storage_path TEXT,
  audio_public_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Core indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_verses_ref ON verses (ref);
CREATE INDEX IF NOT EXISTS idx_verses_book_chapter_verse ON verses (book, chapter, verse);
CREATE INDEX IF NOT EXISTS idx_verses_testament ON verses (testament);
CREATE INDEX IF NOT EXISTS idx_verses_translation ON verses (translation_key);
CREATE INDEX IF NOT EXISTS idx_verses_text_search ON verses USING GIN (to_tsvector('simple', text));
CREATE INDEX IF NOT EXISTS idx_verses_normalized_search ON verses USING GIN (to_tsvector('simple', text_normalized));

-- ========================================
-- 2. VERSES_YOUSAFZAI TABLE (Yousafzai 2019 Translation)
-- ========================================

CREATE TABLE IF NOT EXISTS public.verses_yousafzai (
  id BIGSERIAL PRIMARY KEY,
  ref TEXT NOT NULL UNIQUE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  text_normalized TEXT,
  testament TEXT NOT NULL CHECK (testament IN ('OT', 'NT')),
  translation_key TEXT NOT NULL DEFAULT 'yousafzai2019',
  dialect TEXT DEFAULT 'yousafzai',
  tags JSONB DEFAULT '[]', -- For timing metadata and other verse-specific data
  audio_storage_path TEXT,
  audio_public_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Identical indexes to verses table
CREATE INDEX IF NOT EXISTS idx_verses_yousafzai_ref ON verses_yousafzai (ref);
CREATE INDEX IF NOT EXISTS idx_verses_yousafzai_book_chapter_verse ON verses_yousafzai (book, chapter, verse);
CREATE INDEX IF NOT EXISTS idx_verses_yousafzai_testament ON verses_yousafzai (testament);
CREATE INDEX IF NOT EXISTS idx_verses_yousafzai_translation ON verses_yousafzai (translation_key);
CREATE INDEX IF NOT EXISTS idx_verses_yousafzai_text_search ON verses_yousafzai USING GIN (to_tsvector('simple', text));
CREATE INDEX IF NOT EXISTS idx_verses_yousafzai_normalized_search ON verses_yousafzai USING GIN (to_tsvector('simple', text_normalized));
CREATE INDEX IF NOT EXISTS idx_verses_yousafzai_tags ON verses_yousafzai USING GIN (tags);

-- ========================================
-- 3. UNION VIEW FOR BOTH TRANSLATIONS
-- ========================================

CREATE OR REPLACE VIEW public.all_verses AS
SELECT
  id,
  ref,
  book,
  chapter,
  verse,
  text,
  text_normalized,
  testament,
  translation_key,
  dialect,
  audio_storage_path,
  audio_public_url,
  created_at,
  updated_at,
  'afghan2023' as source_table
FROM verses
UNION ALL
SELECT
  id,
  ref,
  book,
  chapter,
  verse,
  text,
  text_normalized,
  testament,
  translation_key,
  dialect,
  audio_storage_path,
  audio_public_url,
  created_at,
  updated_at,
  'yousafzai2019' as source_table
FROM verses_yousafzai;

-- Index on the union view for cross-translation searches
CREATE INDEX IF NOT EXISTS idx_all_verses_search ON all_verses USING GIN (to_tsvector('simple', text));
CREATE INDEX IF NOT EXISTS idx_all_verses_book_chapter ON all_verses (book, chapter);
CREATE INDEX IF NOT EXISTS idx_all_verses_ref ON all_verses (ref);

-- ========================================
-- 4. WORD OCCURRENCE INDEX (Ultra-fast lookups)
-- ========================================

CREATE TABLE IF NOT EXISTS public.word_occurrence_index (
  id BIGSERIAL PRIMARY KEY,
  word TEXT NOT NULL,
  translation_key TEXT NOT NULL,
  frequency INTEGER NOT NULL DEFAULT 0,
  verse_ids BIGINT[] NOT NULL,
  verse_refs TEXT[] NOT NULL,
  tf_idf_scores REAL[],
  primary_verse_id BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(word, translation_key)
);

-- GIN indexes for fast array operations
CREATE INDEX IF NOT EXISTS idx_word_occurrence_word ON word_occurrence_index USING GIN (word gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_word_occurrence_translation ON word_occurrence_index (translation_key);
CREATE INDEX IF NOT EXISTS idx_word_occurrence_frequency ON word_occurrence_index (frequency DESC);
CREATE INDEX IF NOT EXISTS idx_word_occurrence_verse_ids ON word_occurrence_index USING GIN (verse_ids);
CREATE INDEX IF NOT EXISTS idx_word_occurrence_verse_refs ON word_occurrence_index USING GIN (verse_refs);

-- ========================================
-- 5. VARIANT INDEX (Pre-computed inflections)
-- ========================================

CREATE TABLE IF NOT EXISTS public.variant_index (
  id BIGSERIAL PRIMARY KEY,
  base_word TEXT NOT NULL,
  translation_key TEXT NOT NULL,
  pos TEXT, -- part of speech: verb, noun, adjective, etc.
  variants JSONB NOT NULL, -- Array of variant objects with form, frequency, etc.
  verse_ids BIGINT[] NOT NULL, -- All verses containing any variant
  total_occurrences INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(base_word, translation_key, pos)
);

-- Indexes for variant searches
CREATE INDEX IF NOT EXISTS idx_variant_base_word ON variant_index (base_word);
CREATE INDEX IF NOT EXISTS idx_variant_translation ON variant_index (translation_key);
CREATE INDEX IF NOT EXISTS idx_variant_pos ON variant_index (pos);
CREATE INDEX IF NOT EXISTS idx_variant_verse_ids ON variant_index USING GIN (verse_ids);
CREATE INDEX IF NOT EXISTS idx_variant_variants ON variant_index USING GIN (variants);

-- ========================================
-- 6. SEARCH FUNCTIONS
-- ========================================

-- Fast word search using word_occurrence_index
CREATE OR REPLACE FUNCTION search_verses_by_word_fast(
  search_word TEXT,
  search_translation TEXT DEFAULT 'afghan2023',
  max_results INTEGER DEFAULT 100
)
RETURNS TABLE (
  id BIGINT,
  ref TEXT,
  book TEXT,
  chapter INTEGER,
  verse INTEGER,
  text TEXT,
  testament TEXT,
  audio_storage_path TEXT,
  audio_public_url TEXT,
  score REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.id,
    v.ref,
    v.book,
    v.chapter,
    v.verse,
    v.text,
    v.testament,
    v.audio_storage_path,
    v.audio_public_url,
    woi.tf_idf_scores[array_position(woi.verse_ids, v.id)] as score
  FROM word_occurrence_index woi
  JOIN verses v ON v.id = ANY(woi.verse_ids)
  WHERE woi.word = search_word
    AND woi.translation_key = search_translation
    AND v.translation_key = search_translation
  ORDER BY woi.tf_idf_scores[array_position(woi.verse_ids, v.id)] DESC NULLS LAST
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Cross-translation search
CREATE OR REPLACE FUNCTION search_verses_cross_translation(
  search_word TEXT,
  max_results INTEGER DEFAULT 100
)
RETURNS TABLE (
  id BIGINT,
  ref TEXT,
  book TEXT,
  chapter INTEGER,
  verse INTEGER,
  text TEXT,
  testament TEXT,
  translation_key TEXT,
  dialect TEXT,
  audio_storage_path TEXT,
  audio_public_url TEXT,
  score REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    av.id,
    av.ref,
    av.book,
    av.chapter,
    av.verse,
    av.text,
    av.testament,
    av.translation_key,
    av.dialect,
    av.audio_storage_path,
    av.audio_public_url,
    ts_rank(to_tsvector('simple', av.text), plainto_tsquery('simple', search_word)) as score
  FROM all_verses av
  WHERE av.text ILIKE '%' || search_word || '%'
  ORDER BY score DESC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Get variants for inflection search
CREATE OR REPLACE FUNCTION get_variants_for_search(
  base_word TEXT,
  search_translation TEXT DEFAULT 'afghan2023'
)
RETURNS TABLE (
  base_word TEXT,
  pos TEXT,
  variants JSONB,
  total_verses INTEGER,
  total_occurrences INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    vi.base_word,
    vi.pos,
    vi.variants,
    array_length(vi.verse_ids, 1) as total_verses,
    vi.total_occurrences
  FROM variant_index vi
  WHERE vi.base_word = base_word
    AND vi.translation_key = search_translation;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 7. UPDATE TRIGGERS
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_verses_updated_at
  BEFORE UPDATE ON verses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verses_yousafzai_updated_at
  BEFORE UPDATE ON verses_yousafzai
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_word_occurrence_index_updated_at
  BEFORE UPDATE ON word_occurrence_index
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_variant_index_updated_at
  BEFORE UPDATE ON variant_index
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 8. MATERIALIZED VIEWS FOR PERFORMANCE
-- ========================================

-- Materialized view for common words (refreshed periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS common_words AS
SELECT
  word,
  translation_key,
  frequency,
  array_length(verse_ids, 1) as verse_count
FROM word_occurrence_index
WHERE frequency > 10
ORDER BY frequency DESC;

CREATE INDEX IF NOT EXISTS idx_common_words_word ON common_words (word);
CREATE INDEX IF NOT EXISTS idx_common_words_translation ON common_words (translation_key);

-- Refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_common_words()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW common_words;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 9. PERMISSIONS
-- ========================================

-- Grant permissions to authenticated and anonymous users
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL VIEWS IN SCHEMA public TO anon;
GRANT SELECT ON ALL VIEWS IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- ========================================
-- 10. COMMENTS
-- ========================================

COMMENT ON TABLE verses IS 'Afghan 2023 translation with audio metadata';
COMMENT ON TABLE verses_yousafzai IS 'Yousafzai 2019 translation with timing tags';
COMMENT ON TABLE all_verses IS 'Union view of both translations';
COMMENT ON TABLE word_occurrence_index IS 'Pre-computed word frequencies and verse lists for ultra-fast searches';
COMMENT ON TABLE variant_index IS 'Pre-computed morphological variants for inflection searches';

COMMENT ON FUNCTION search_verses_by_word_fast IS 'Ultra-fast word search using pre-computed occurrence index';
COMMENT ON FUNCTION search_verses_cross_translation IS 'Cross-translation search with relevance scoring';
COMMENT ON FUNCTION get_variants_for_search IS 'Retrieve pre-computed variants for inflection search';

-- ========================================
-- 11. SAMPLE DATA INSERTION
-- ========================================

-- Function to populate tables from JSON (will be called by ingestion script)
CREATE OR REPLACE FUNCTION insert_verse_data(
  verse_ref TEXT,
  verse_book TEXT,
  verse_chapter INTEGER,
  verse_verse INTEGER,
  verse_text TEXT,
  verse_testament TEXT,
  verse_translation TEXT,
  verse_dialect TEXT DEFAULT NULL,
  verse_audio_path TEXT DEFAULT NULL,
  verse_tags JSONB DEFAULT '[]'
)
RETURNS BIGINT AS $$
DECLARE
  new_id BIGINT;
BEGIN
  IF verse_translation = 'afghan2023' THEN
    INSERT INTO verses (
      ref, book, chapter, verse, text, testament,
      translation_key, dialect, audio_storage_path
    ) VALUES (
      verse_ref, verse_book, verse_chapter, verse_verse, verse_text, verse_testament,
      verse_translation, verse_dialect, verse_audio_path
    ) RETURNING id INTO new_id;
  ELSIF verse_translation = 'yousafzai2019' THEN
    INSERT INTO verses_yousafzai (
      ref, book, chapter, verse, text, testament,
      translation_key, dialect, audio_storage_path, tags
    ) VALUES (
      verse_ref, verse_book, verse_chapter, verse_verse, verse_text, verse_testament,
      verse_translation, verse_dialect, verse_audio_path, verse_tags
    ) RETURNING id INTO new_id;
  ELSE
    RAISE EXCEPTION 'Invalid translation key: %', verse_translation;
  END IF;

  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- SETUP COMPLETE
-- ========================================

-- Verification query
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'verses', 'verses_yousafzai', 'word_occurrence_index', 'variant_index'
  )
ORDER BY tablename;
