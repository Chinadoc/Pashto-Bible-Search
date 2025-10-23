-- Migration: Add audio_url column to verses tables
-- This simplifies the architecture by storing audio URLs directly with verses
-- instead of requiring a separate join to audio_mappings table

-- ============================================================================
-- STEP 1: Add audio_url column to verses (Afghan 2023)
-- ============================================================================

ALTER TABLE verses
ADD COLUMN IF NOT EXISTS audio_url TEXT;

COMMENT ON COLUMN verses.audio_url IS 'Google Drive URL for verse audio (direct download link)';

-- ============================================================================
-- STEP 2: Add audio_url column to verses_yousafzai (Yousafzai 2019)
-- ============================================================================

ALTER TABLE verses_yousafzai
ADD COLUMN IF NOT EXISTS audio_url TEXT;

COMMENT ON COLUMN verses_yousafzai.audio_url IS 'Google Drive URL for verse audio (direct download link)';

-- ============================================================================
-- STEP 3: Populate audio_url from audio_mappings for verses (Afghan 2023)
-- ============================================================================

-- Create verse_ref for matching (format: "Book Chapter:Verse")
UPDATE verses v
SET audio_url = am.audio_url
FROM audio_mappings am
WHERE am.verse_ref = (v.book || ' ' || v.chapter || ':' || v.verse)
  AND am.source = 'afghan2023';

-- ============================================================================
-- STEP 4: Populate audio_url from audio_mappings for verses_yousafzai
-- ============================================================================

UPDATE verses_yousafzai v
SET audio_url = am.audio_url
FROM audio_mappings am
WHERE am.verse_ref = (v.book || ' ' || v.chapter || ':' || v.verse)
  AND am.source = 'yousafzai2019';

-- ============================================================================
-- STEP 5: Create indexes for performance (optional but recommended)
-- ============================================================================

-- Index for verses.audio_url (useful for finding verses without audio)
CREATE INDEX IF NOT EXISTS idx_verses_audio_url
ON verses(audio_url)
WHERE audio_url IS NOT NULL;

-- Index for verses_yousafzai.audio_url
CREATE INDEX IF NOT EXISTS idx_verses_yousafzai_audio_url
ON verses_yousafzai(audio_url)
WHERE audio_url IS NOT NULL;

-- ============================================================================
-- VERIFICATION QUERIES (Run these to check the migration)
-- ============================================================================

-- Check how many verses have audio URLs
-- SELECT
--   COUNT(*) as total_verses,
--   COUNT(audio_url) as verses_with_audio,
--   ROUND(100.0 * COUNT(audio_url) / COUNT(*), 2) as coverage_percentage
-- FROM verses;

-- Check sample verses with audio
-- SELECT book, chapter, verse,
--        LEFT(text, 50) as text_preview,
--        LEFT(audio_url, 60) as audio_url_preview
-- FROM verses
-- WHERE audio_url IS NOT NULL
-- LIMIT 10;

-- Check Yousafzai coverage
-- SELECT
--   COUNT(*) as total_verses,
--   COUNT(audio_url) as verses_with_audio,
--   ROUND(100.0 * COUNT(audio_url) / COUNT(*), 2) as coverage_percentage
-- FROM verses_yousafzai;

-- ============================================================================
-- NOTES
-- ============================================================================
--
-- After running this migration:
-- 1. The verses and verses_yousafzai tables will have audio_url column
-- 2. API endpoints can fetch verses + audio in a single query
-- 3. The audio_mappings table can remain for reference but is no longer needed
-- 4. Performance improves: 1 query instead of 2 (verses + audio_mappings)
--
-- Rollback (if needed):
-- ALTER TABLE verses DROP COLUMN IF EXISTS audio_url;
-- ALTER TABLE verses_yousafzai DROP COLUMN IF EXISTS audio_url;
--
