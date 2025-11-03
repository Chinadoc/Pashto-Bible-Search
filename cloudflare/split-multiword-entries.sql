-- Split multi-word entries into individual words
-- Keeps circumpositions (په ... کې) as single entries
-- Splits postpositions (... ته), prepositions (د ...), and particles (... به)

-- This SQL will:
-- 1. Find entries to split
-- 2. Create INSERT statements for each word
-- 3. Mark original as split

-- Note: This is a template. Actual splitting requires:
-- - Processing each entry individually
-- - Checking if split words already exist
-- - Updating word_verse_mapping
-- - Distributing frequency counts

-- Sample entries to split (run separately for each):

-- Example: Split "هغه به" into "هغه" + "به"

-- Step 1: Ensure "هغه" exists
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total, frequency_a, frequency_y, frequency_r, pos)
SELECT 'هغه', 0, 0, 0, 0, NULL
WHERE NOT EXISTS (SELECT 1 FROM word_frequencies WHERE pashto_word = 'هغه');

-- Step 2: Ensure "به" exists  
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total, frequency_a, frequency_y, frequency_r, pos)
SELECT 'به', 0, 0, 0, 0, 'particle'
WHERE NOT EXISTS (SELECT 1 FROM word_frequencies WHERE pashto_word = 'به');

-- Step 3: Mark original as split
UPDATE word_frequencies 
SET pos = 'split', pashto_word = pashto_word || ' [SPLIT]'
WHERE pashto_word = 'هغه به';


-- Example: Split "ما ته" into "ما" + "ته"

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total, frequency_a, frequency_y, frequency_r, pos)
SELECT 'ما', 0, 0, 0, 0, NULL
WHERE NOT EXISTS (SELECT 1 FROM word_frequencies WHERE pashto_word = 'ما');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total, frequency_a, frequency_y, frequency_r, pos)
SELECT 'ته', 0, 0, 0, 0, 'postposition'
WHERE NOT EXISTS (SELECT 1 FROM word_frequencies WHERE pashto_word = 'ته');

UPDATE word_frequencies 
SET pos = 'split', pashto_word = pashto_word || ' [SPLIT]'
WHERE pashto_word = 'ما ته';


-- Example: Split "د یوسف" into "د" + "یوسف"

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total, frequency_a, frequency_y, frequency_r, pos)
SELECT 'د', 0, 0, 0, 0, 'preposition'
WHERE NOT EXISTS (SELECT 1 FROM word_frequencies WHERE pashto_word = 'د');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total, frequency_a, frequency_y, frequency_r, pos)
SELECT 'یوسف', 0, 0, 0, 0, 'proper_noun'
WHERE NOT EXISTS (SELECT 1 FROM word_frequencies WHERE pashto_word = 'یوسف');

UPDATE word_frequencies 
SET pos = 'split', pashto_word = pashto_word || ' [SPLIT]'
WHERE pashto_word = 'د یوسف';


-- To generate SQL for all entries, use this query to find candidates:

SELECT 
  id,
  pashto_word,
  frequency_total,
  CASE 
    WHEN pashto_word LIKE '% ته' THEN 'postposition'
    WHEN pashto_word LIKE '% به' OR pashto_word LIKE 'به %' THEN 'particle'
    WHEN pashto_word LIKE 'د %' OR pashto_word LIKE 'په %' OR pashto_word LIKE 'پر %' OR pashto_word LIKE 'له %' THEN 'preposition'
    ELSE 'other'
  END as split_type
FROM word_frequencies
WHERE pashto_word LIKE '% %'
  AND (pos = 'phrase' OR pos IS NULL OR pos = '')
  AND pashto_word NOT LIKE 'په%کې'
  AND pashto_word NOT LIKE 'د%دپاره'
  AND pashto_word NOT LIKE 'پر%باندې'
  AND pashto_word NOT LIKE 'د%په اړه'
  AND pashto_word NOT LIKE 'د%په بارې کې'
  AND pashto_word NOT LIKE 'پر%سربېره'
  AND pashto_word NOT LIKE 'له%سره'
  AND LENGTH(pashto_word) - LENGTH(REPLACE(pashto_word, ' ', '')) = 1
ORDER BY frequency_total DESC
LIMIT 100;
