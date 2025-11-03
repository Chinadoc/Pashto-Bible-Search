-- Generate split statements for phrases
-- This creates a temporary table with phrases to split, then generates INSERT statements

-- Create temp table with phrases to split
CREATE TEMP TABLE phrases_to_split AS
SELECT 
  id,
  pashto_word,
  frequency_total,
  pos
FROM word_frequencies
WHERE pashto_word LIKE '% %'
  AND (pos = 'phrase' OR pos = 'postposition_phrase' OR pos = 'particle_phrase' OR pos IS NULL OR pos = '' OR pos = 'unknown')
  AND pashto_word NOT LIKE 'په%کې'
  AND pashto_word NOT LIKE 'د%دپاره'
  AND pashto_word NOT LIKE 'پر%باندې'
  AND pashto_word NOT LIKE 'د%په اړه'
  AND pashto_word NOT LIKE 'د%په بارې کې'
  AND pashto_word NOT LIKE 'پر%سربېره'
  AND pashto_word NOT LIKE 'له%سره'
  AND (pos IS NULL OR pos != 'circumposition')
  AND LENGTH(pashto_word) - LENGTH(REPLACE(pashto_word, ' ', '')) = 1
ORDER BY frequency_total DESC
LIMIT 100;

-- Show sample
SELECT pashto_word, frequency_total, pos FROM phrases_to_split LIMIT 20;

