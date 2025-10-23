-- ========================================
-- PASHTO BIBLE SEARCH - PRODUCTION SCHEMA
-- ========================================
-- Three-table architecture for optimal performance:
-- 1. verses (Afghan 2023) - main translation with audio URLs
-- 2. verses_yousafzai (Yousafzai 2019) - second translation with audio URLs
-- 3. word_occurrence_index - pre-computed word frequencies for fast lookups

-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/nkombdutnjvaasxrbmdn/sql/new

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
  audio_url TEXT, -- Direct audio URL (Google Drive)
  audio_source TEXT, -- Source of the audio (e.g., 'google_drive', 'supabase_storage')
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
CREATE INDEX IF NOT EXISTS idx_verses_audio_url ON verses (audio_url) WHERE audio_url IS NOT NULL;

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
  audio_url TEXT, -- Direct audio URL (Google Drive)
  audio_source TEXT, -- Source of the audio
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
CREATE INDEX IF NOT EXISTS idx_verses_yousafzai_audio_url ON verses_yousafzai (audio_url) WHERE audio_url IS NOT NULL;

-- ========================================
-- 3. WORD OCCURRENCE INDEX (Ultra-fast word lookups)
-- ========================================

CREATE TABLE IF NOT EXISTS public.word_occurrence_index (
  id BIGSERIAL PRIMARY KEY,
  word TEXT NOT NULL,
  translation_key TEXT NOT NULL,
  frequency INTEGER NOT NULL DEFAULT 0,
  verse_refs TEXT[] NOT NULL,
  tf_idf_scores REAL[],
  primary_verse_ref TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(word, translation_key)
);

-- GIN indexes for fast array operations and text search
CREATE INDEX IF NOT EXISTS idx_word_occurrence_word ON word_occurrence_index USING GIN (word gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_word_occurrence_translation ON word_occurrence_index (translation_key);
CREATE INDEX IF NOT EXISTS idx_word_occurrence_frequency ON word_occurrence_index (frequency DESC);
CREATE INDEX IF NOT EXISTS idx_word_occurrence_verse_refs ON word_occurrence_index USING GIN (verse_refs);

-- ========================================
-- 4. SEARCH FUNCTIONS (Ultra-fast lookups)
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
  audio_url TEXT,
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
    v.audio_url,
    woi.tf_idf_scores[array_position(woi.verse_refs, v.ref)] as score
  FROM word_occurrence_index woi
  JOIN verses v ON v.ref = ANY(woi.verse_refs)
  WHERE woi.word = search_word
    AND woi.translation_key = search_translation
    AND v.translation_key = search_translation
  ORDER BY woi.tf_idf_scores[array_position(woi.verse_refs, v.ref)] DESC NULLS LAST
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
  audio_url TEXT,
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
    av.audio_url,
    ts_rank(to_tsvector('simple', av.text), plainto_tsquery('simple', search_word)) as score
  FROM (
    SELECT * FROM verses WHERE text ILIKE '%' || search_word || '%'
    UNION ALL
    SELECT * FROM verses_yousafzai WHERE text ILIKE '%' || search_word || '%'
  ) av
  ORDER BY score DESC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Get verses by chapter (optimized)
CREATE OR REPLACE FUNCTION get_verses_by_chapter(
  search_book TEXT,
  search_chapter INTEGER,
  search_translation TEXT DEFAULT 'afghan2023'
)
RETURNS TABLE (
  id BIGINT,
  ref TEXT,
  book TEXT,
  chapter INTEGER,
  verse INTEGER,
  text TEXT,
  testament TEXT,
  audio_url TEXT
) AS $$
BEGIN
  IF search_translation = 'afghan2023' THEN
    RETURN QUERY
    SELECT
      v.id,
      v.ref,
      v.book,
      v.chapter,
      v.verse,
      v.text,
      v.testament,
      v.audio_url
    FROM verses v
    WHERE v.book = search_book
      AND v.chapter = search_chapter
    ORDER BY v.verse;
  ELSE
    RETURN QUERY
    SELECT
      vy.id,
      vy.ref,
      vy.book,
      vy.chapter,
      vy.verse,
      vy.text,
      vy.testament,
      vy.audio_url
    FROM verses_yousafzai vy
    WHERE vy.book = search_book
      AND vy.chapter = search_chapter
    ORDER BY vy.verse;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 5. UPDATE TRIGGERS
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

-- ========================================
-- 6. MATERIALIZED VIEWS FOR PERFORMANCE
-- ========================================

-- Materialized view for common words (refreshed periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS common_words AS
SELECT
  word,
  translation_key,
  frequency,
  array_length(verse_refs, 1) as verse_count
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
-- 7. PERMISSIONS
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
-- 8. COMMENTS
-- ========================================

COMMENT ON TABLE verses IS 'Afghan 2023 translation with direct audio URLs for single-query performance';
COMMENT ON TABLE verses_yousafzai IS 'Yousafzai 2019 translation with timing tags and direct audio URLs';
COMMENT ON TABLE word_occurrence_index IS 'Pre-computed word frequencies and verse lists for ultra-fast searches';

COMMENT ON FUNCTION search_verses_by_word_fast IS 'Ultra-fast word search using pre-computed occurrence index';
COMMENT ON FUNCTION search_verses_cross_translation IS 'Cross-translation search with relevance scoring';
COMMENT ON FUNCTION get_verses_by_chapter IS 'Optimized chapter verse retrieval with audio URLs';

-- ========================================
-- 9. SAMPLE DATA INSERTION FUNCTIONS
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
  verse_audio_url TEXT DEFAULT NULL,
  verse_tags JSONB DEFAULT '[]'
)
RETURNS BIGINT AS $$
DECLARE
  new_id BIGINT;
BEGIN
  IF verse_translation = 'afghan2023' THEN
    INSERT INTO verses (
      ref, book, chapter, verse, text, testament,
      translation_key, dialect, audio_url
    ) VALUES (
      verse_ref, verse_book, verse_chapter, verse_verse, verse_text, verse_testament,
      verse_translation, verse_dialect, verse_audio_url
    ) RETURNING id INTO new_id;
  ELSIF verse_translation = 'yousafzai2019' THEN
    INSERT INTO verses_yousafzai (
      ref, book, chapter, verse, text, testament,
      translation_key, dialect, audio_url, tags
    ) VALUES (
      verse_ref, verse_book, verse_chapter, verse_verse, verse_text, verse_testament,
      verse_translation, verse_dialect, verse_audio_url, verse_tags
    ) RETURNING id INTO new_id;
  ELSE
    RAISE EXCEPTION 'Invalid translation key: %', verse_translation;
  END IF;

  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 10. VERIFICATION QUERIES
-- ========================================

-- Check table creation
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'verses', 'verses_yousafzai', 'word_occurrence_index'
  )
ORDER BY tablename;

-- Check indexes
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'verses', 'verses_yousafzai', 'word_occurrence_index'
  )
ORDER BY tablename, indexname;

-- Check row counts (run after data ingestion)
SELECT
  'verses' as table_name,
  COUNT(*) as row_count
FROM verses
UNION ALL
SELECT
  'verses_yousafzai' as table_name,
  COUNT(*) as row_count
FROM verses_yousafzai
UNION ALL
SELECT
  'word_occurrence_index' as table_name,
  COUNT(*) as row_count
FROM word_occurrence_index;

-- Test fast search function
SELECT * FROM search_verses_by_word_fast('خدا', 'afghan2023', 5);

-- Test chapter function
SELECT * FROM get_verses_by_chapter('Genesis', 1, 'afghan2023') LIMIT 5;
