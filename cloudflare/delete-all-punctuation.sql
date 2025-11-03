-- Final cleanup: Delete all entries with punctuation in one go
-- This script removes ALL punctuation from the database

-- Step 1: Delete all entries with punctuation marks
DELETE FROM word_frequencies
WHERE pashto_word LIKE '%.%' 
   OR pashto_word LIKE '%,%'
   OR pashto_word LIKE '%!%'
   OR pashto_word LIKE '%?%'
   OR pashto_word LIKE '%؟%'
   OR pashto_word LIKE '%،%'
   OR pashto_word IN ('.', '،', ',', '!', '?', '؟')
   OR TRIM(pashto_word) = ''
   OR LENGTH(TRIM(pashto_word)) = 0;

-- Step 2: Recalculate ranks
UPDATE word_frequencies
SET frequency_rank = (
  SELECT COUNT(*) + 1
  FROM word_frequencies wf2
  WHERE wf2.frequency_total > word_frequencies.frequency_total
);

