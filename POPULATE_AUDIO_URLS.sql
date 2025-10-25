-- Populate Audio URLs in Supabase Verses Tables
-- This script copies audio_url data to audio_public_url and audio_storage_path

-- For Afghan 2023 (verses table)
UPDATE public.verses
SET 
  audio_public_url = audio_url,
  audio_storage_path = CONCAT('audio/afghan2023/', book, '_', chapter, '_', verse, '.mp3')
WHERE audio_url IS NOT NULL AND audio_public_url IS NULL;

-- For Yousafzai 2019 (verses_yousafzai table)
UPDATE public.verses_yousafzai
SET 
  audio_public_url = audio_url,
  audio_storage_path = CONCAT('audio/yousafzai2019/', book, '_', chapter, '_', verse, '.mp3')
WHERE audio_url IS NOT NULL AND audio_public_url IS NULL;

-- Verify the updates
SELECT 
  'Afghan 2023' as translation,
  COUNT(*) as total_verses,
  COUNT(CASE WHEN audio_public_url IS NOT NULL THEN 1 END) as verses_with_audio,
  ROUND(100.0 * COUNT(CASE WHEN audio_public_url IS NOT NULL THEN 1 END) / COUNT(*), 1) as percentage
FROM public.verses

UNION ALL

SELECT 
  'Yousafzai 2019' as translation,
  COUNT(*) as total_verses,
  COUNT(CASE WHEN audio_public_url IS NOT NULL THEN 1 END) as verses_with_audio,
  ROUND(100.0 * COUNT(CASE WHEN audio_public_url IS NOT NULL THEN 1 END) / COUNT(*), 1) as percentage
FROM public.verses_yousafzai;
