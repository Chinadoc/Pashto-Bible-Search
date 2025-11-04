-- Add frequency_video column to word_frequencies table
-- This tracks video frequencies separately from Bible frequencies
-- Migration: Add frequency_video column

-- Step 1: Add frequency_video column
ALTER TABLE word_frequencies ADD COLUMN frequency_video INTEGER DEFAULT 0;

-- Step 2: Create index for performance
CREATE INDEX IF NOT EXISTS idx_word_frequencies_video ON word_frequencies(frequency_video DESC);

-- Step 3: Populate frequency_video from video_word_mappings
-- This calculates the total video frequency for each word
UPDATE word_frequencies
SET frequency_video = (
  SELECT COALESCE(SUM(frequency), 0)
  FROM video_word_mappings
  WHERE video_word_mappings.pashto_word = word_frequencies.pashto_word
);

-- Step 4: Update frequency_total to be Bible frequencies + video frequencies
-- This ensures frequency_total = sum of all Bible columns + frequency_video
UPDATE word_frequencies
SET frequency_total = COALESCE(frequency_afghan2023_ot, 0) + 
                      COALESCE(frequency_afghan2023_nt, 0) + 
                      COALESCE(frequency_yousafzai2019_ot, 0) + 
                      COALESCE(frequency_yousafzai2019_nt, 0) + 
                      COALESCE(frequency_video, 0);

-- Note: The video_word_mappings table already tracks which videos each word comes from
-- via the video_id column. We use that for cleanup when videos are deleted.

