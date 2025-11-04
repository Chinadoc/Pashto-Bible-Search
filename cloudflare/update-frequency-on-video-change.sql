-- Helper queries for updating frequency_video when videos are added/updated/deleted
-- These queries should be called from the API when videos are processed

-- ========================================
-- WHEN VIDEO IS ADDED/UPDATED:
-- ========================================

-- Step 1: Update frequency_video for each word in the video
-- (This should be done after video_word_mappings is updated)
-- Example for a specific video:
/*
UPDATE word_frequencies
SET frequency_video = (
  SELECT COALESCE(SUM(frequency), 0)
  FROM video_word_mappings
  WHERE video_word_mappings.pashto_word = word_frequencies.pashto_word
),
frequency_total = COALESCE(frequency_afghan2023_ot, 0) + 
                  COALESCE(frequency_afghan2023_nt, 0) + 
                  COALESCE(frequency_yousafzai2019_ot, 0) + 
                  COALESCE(frequency_yousafzai2019_nt, 0) + 
                  COALESCE(frequency_video, 0)
WHERE pashto_word IN (
  SELECT DISTINCT pashto_word
  FROM video_word_mappings
  WHERE video_id = 'VIDEO_ID_HERE'
);
*/

-- ========================================
-- WHEN VIDEO IS DELETED:
-- ========================================

-- Step 1: Get words affected by this video
-- SELECT pashto_word, frequency FROM video_word_mappings WHERE video_id = 'VIDEO_ID_HERE';

-- Step 2: Decrement frequency_video for each word
-- UPDATE word_frequencies 
-- SET frequency_video = MAX(0, COALESCE(frequency_video, 0) - VIDEO_FREQ_HERE),
--     frequency_total = MAX(0, COALESCE(frequency_total, 0) - VIDEO_FREQ_HERE)
-- WHERE pashto_word = 'WORD_HERE';

-- Step 3: Delete video_word_mappings entries
-- DELETE FROM video_word_mappings WHERE video_id = 'VIDEO_ID_HERE';

-- Step 4: Recalculate frequency_total for affected words
-- UPDATE word_frequencies
-- SET frequency_total = COALESCE(frequency_afghan2023_ot, 0) + 
--                       COALESCE(frequency_afghan2023_nt, 0) + 
--                       COALESCE(frequency_yousafzai2019_ot, 0) + 
--                       COALESCE(frequency_yousafzai2019_nt, 0) + 
--                       COALESCE(frequency_video, 0)
-- WHERE pashto_word IN (SELECT DISTINCT pashto_word FROM video_word_mappings WHERE video_id = 'VIDEO_ID_HERE');

-- ========================================
-- RECALCULATE ALL VIDEO FREQUENCIES:
-- ========================================

-- Use this to recalculate all frequency_video values from scratch
-- (Useful after bulk operations or data fixes)

UPDATE word_frequencies
SET frequency_video = (
  SELECT COALESCE(SUM(frequency), 0)
  FROM video_word_mappings
  WHERE video_word_mappings.pashto_word = word_frequencies.pashto_word
);

UPDATE word_frequencies
SET frequency_total = COALESCE(frequency_afghan2023_ot, 0) + 
                      COALESCE(frequency_afghan2023_nt, 0) + 
                      COALESCE(frequency_yousafzai2019_ot, 0) + 
                      COALESCE(frequency_yousafzai2019_nt, 0) + 
                      COALESCE(frequency_video, 0);

