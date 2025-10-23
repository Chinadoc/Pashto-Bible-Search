-- ========================================
-- PASHTO BIBLE AUDIO DATABASE SCHEMA
-- ========================================
-- Run this in your Supabase SQL Editor

-- Audio files table for storing Google Drive file IDs and metadata
CREATE TABLE IF NOT EXISTS audio_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  verse_reference TEXT NOT NULL,
  translation_key TEXT NOT NULL, -- 'afghan2023', 'yousafzai2019', etc.
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  google_drive_file_id TEXT,
  google_drive_url TEXT,
  supabase_storage_url TEXT,
  file_size_bytes INTEGER,
  duration_seconds DECIMAL,
  audio_quality TEXT, -- 'high', 'medium', 'low'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(verse_reference, translation_key)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audio_files_verse_ref ON audio_files(verse_reference);
CREATE INDEX IF NOT EXISTS idx_audio_files_translation ON audio_files(translation_key);
CREATE INDEX IF NOT EXISTS idx_audio_files_book_chapter_verse ON audio_files(book, chapter, verse);

-- Audio mapping view for audio URLs (updated to use audio_files table)
CREATE OR REPLACE VIEW audio_by_verse AS
SELECT
  v.id as verse_id,
  v.book || ' ' || v.chapter::text || ':' || v.verse::text as verse_ref,
  COALESCE(
    af.google_drive_url,
    af.supabase_storage_url,
    NULL
  ) as url,
  af.translation_key,
  af.audio_quality,
  af.duration_seconds
FROM verses v
LEFT JOIN audio_files af ON (
  af.verse_reference = v.book || ' ' || v.chapter::text || ':' || v.verse::text
  AND af.translation_key IN ('afghan2023', 'yousafzai2019')
)
WHERE v.book IS NOT NULL AND v.chapter IS NOT NULL AND v.verse IS NOT NULL;
