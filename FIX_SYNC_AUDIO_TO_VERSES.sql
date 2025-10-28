-- Fix: Sync audio_files table data to verses_yousafzai and verses tables
-- This ensures audio URLs are available directly on the verses tables

-- 1. First, update verses_yousafzai with audio from audio_files table
UPDATE verses_yousafzai v
SET 
  audio_public_url = af.google_drive_url,
  audio_storage_path = af.supabase_storage_url
FROM audio_files af
WHERE 
  af.book = v.book 
  AND af.chapter = v.chapter 
  AND af.verse = v.verse
  AND af.translation_key = 'yousafzai2019'
  AND v.audio_public_url IS NULL;  -- Only update if currently empty/wrong

-- 2. Update verses (Afghan 2023) with audio from audio_files table
UPDATE verses v
SET 
  audio_public_url = af.google_drive_url,
  audio_storage_path = af.supabase_storage_url
FROM audio_files af
WHERE 
  af.book = v.book 
  AND af.chapter = v.chapter 
  AND af.verse = v.verse
  AND af.translation_key = 'afghan2023'
  AND v.audio_public_url IS NULL;  -- Only update if currently empty/wrong

-- 3. Verify the update - check a sample
SELECT 
  'verses_yousafzai' as table_name,
  COUNT(*) as total_verses,
  SUM(CASE WHEN audio_public_url IS NOT NULL THEN 1 ELSE 0 END) as with_audio
FROM verses_yousafzai

UNION ALL

SELECT 
  'verses' as table_name,
  COUNT(*) as total_verses,
  SUM(CASE WHEN audio_public_url IS NOT NULL THEN 1 ELSE 0 END) as with_audio
FROM verses;

-- 4. Check for any verses with wrong/stale audio URLs
SELECT 
  book, 
  chapter, 
  verse,
  COUNT(*) as duplicate_count
FROM verses_yousafzai
GROUP BY book, chapter, verse
HAVING COUNT(*) > 1;
