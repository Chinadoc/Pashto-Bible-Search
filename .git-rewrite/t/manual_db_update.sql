-- Add audio_verse_url columns to verses_yousafzai table
ALTER TABLE public.verses_yousafzai 
ADD COLUMN IF NOT EXISTS audio_verse_url text,
ADD COLUMN IF NOT EXISTS audio_storage_filename text;

-- For testing, update a few verses manually with a sample URL pattern
UPDATE public.verses_yousafzai 
SET 
  audio_verse_url = 'https://nkombdutnjvaasxrbmdn.supabase.co/storage/v1/object/public/audio/yousafzai/yousafzai_psalms' || LPAD(chapter::text, 3, '0') || '_verse_' || LPAD(verse::text, 3, '0') || '.mp3',
  audio_storage_filename = 'yousafzai_psalms' || LPAD(chapter::text, 3, '0') || '_verse_' || LPAD(verse::text, 3, '0') || '.mp3'
WHERE book = 'Psalms' AND chapter = 2 AND verse = 12;
