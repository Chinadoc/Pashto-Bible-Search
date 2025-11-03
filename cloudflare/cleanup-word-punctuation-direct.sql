-- Direct cleanup: Delete all entries with punctuation and punctuation-only words
-- This is simpler and more direct than the merge approach

-- Step 1: Delete words that are ONLY punctuation or empty
DELETE FROM word_frequencies
WHERE pashto_word IN ('.', '،', ',', '!', '?', '؟')
   OR TRIM(pashto_word) = ''
   OR LENGTH(TRIM(pashto_word)) = 0;

-- Step 2: Clean punctuation from words and update them in place
-- First, update words to remove punctuation
UPDATE word_frequencies
SET pashto_word = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(pashto_word), '.', ''), '،', ''), ',', ''), '!', ''), '?', ''), '؟', ''),
    updated_at = strftime('%s', 'now')
WHERE pashto_word LIKE '%.%' 
   OR pashto_word LIKE '%,%'
   OR pashto_word LIKE '%!%'
   OR pashto_word LIKE '%?%'
   OR pashto_word LIKE '%؟%'
   OR pashto_word LIKE '%،%';

-- Step 3: Delete any that became empty after cleaning
DELETE FROM word_frequencies
WHERE pashto_word = ''
   OR TRIM(pashto_word) = ''
   OR LENGTH(TRIM(pashto_word)) = 0;

-- Step 4: Merge duplicates created by cleaning (group by cleaned word, sum frequencies)
-- Create a temporary view to identify duplicates
CREATE TEMP TABLE IF NOT EXISTS word_groups AS
SELECT 
  pashto_word,
  SUM(frequency_total) AS total_freq,
  SUM(frequency_afghan2023_ot) AS total_afghan_ot,
  SUM(frequency_afghan2023_nt) AS total_afghan_nt,
  SUM(frequency_yousafzai2019_ot) AS total_yousafzai_ot,
  SUM(frequency_yousafzai2019_nt) AS total_yousafzai_nt,
  MIN(id) AS keep_id,
  GROUP_CONCAT(id) AS all_ids
FROM word_frequencies
GROUP BY pashto_word
HAVING COUNT(*) > 1;

-- Step 5: Update the first occurrence with merged frequencies
UPDATE word_frequencies
SET 
  frequency_total = (
    SELECT total_freq FROM word_groups WHERE keep_id = word_frequencies.id
  ),
  frequency_afghan2023_ot = (
    SELECT total_afghan_ot FROM word_groups WHERE keep_id = word_frequencies.id
  ),
  frequency_afghan2023_nt = (
    SELECT total_afghan_nt FROM word_groups WHERE keep_id = word_frequencies.id
  ),
  frequency_yousafzai2019_ot = (
    SELECT total_yousafzai_ot FROM word_groups WHERE keep_id = word_frequencies.id
  ),
  frequency_yousafzai2019_nt = (
    SELECT total_yousafzai_nt FROM word_groups WHERE keep_id = word_frequencies.id
  ),
  updated_at = strftime('%s', 'now')
WHERE id IN (SELECT keep_id FROM word_groups);

-- Step 6: Delete duplicate entries (keep only the first one)
DELETE FROM word_frequencies
WHERE id IN (
  SELECT wf.id FROM word_frequencies wf
  JOIN word_groups wg ON wf.pashto_word = wg.pashto_word
  WHERE wf.id != wg.keep_id
);

-- Step 7: Clean up temp table
DROP TABLE IF EXISTS word_groups;

-- Step 8: Remove any remaining leading/trailing whitespace
UPDATE word_frequencies
SET pashto_word = TRIM(pashto_word),
    updated_at = strftime('%s', 'now')
WHERE pashto_word != TRIM(pashto_word);

-- Step 9: Recalculate frequency ranks
UPDATE word_frequencies
SET frequency_rank = (
  SELECT COUNT(*) + 1
  FROM word_frequencies wf2
  WHERE wf2.frequency_total > word_frequencies.frequency_total
);

-- Step 10: Final cleanup - delete any remaining problematic entries
DELETE FROM word_frequencies
WHERE pashto_word LIKE '%.%' 
   OR pashto_word LIKE '%,%'
   OR pashto_word LIKE '%!%'
   OR pashto_word LIKE '%?%'
   OR pashto_word LIKE '%؟%'
   OR pashto_word LIKE '%،%'
   OR TRIM(pashto_word) = ''
   OR LENGTH(TRIM(pashto_word)) = 0
   OR pashto_word IN ('.', '،', ',', '!', '?', '؟');

