-- Simple direct cleanup: Remove punctuation from all words and delete duplicates
-- Execute this script directly via wrangler

-- Step 1: Delete punctuation-only words immediately
DELETE FROM word_frequencies 
WHERE pashto_word IN ('.', '،', ',', '!', '?', '؟') 
   OR TRIM(pashto_word) = ''
   OR LENGTH(TRIM(pashto_word)) = 0;

-- Step 2: Clean punctuation from all words in place
UPDATE word_frequencies
SET pashto_word = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(pashto_word), '.', ''), '،', ''), ',', ''), '!', ''), '?', ''), '؟', ''),
    updated_at = strftime('%s', 'now')
WHERE pashto_word GLOB '*[.,!?؟،]*' OR pashto_word != TRIM(pashto_word);

-- Step 3: Delete any that became empty
DELETE FROM word_frequencies WHERE pashto_word = '' OR TRIM(pashto_word) = '';

-- Step 4: Merge duplicates - update first occurrence with sum of all frequencies
UPDATE word_frequencies wf1
SET 
  frequency_total = (SELECT SUM(frequency_total) FROM word_frequencies wf2 WHERE wf2.pashto_word = wf1.pashto_word),
  frequency_afghan2023_ot = (SELECT SUM(frequency_afghan2023_ot) FROM word_frequencies wf2 WHERE wf2.pashto_word = wf1.pashto_word),
  frequency_afghan2023_nt = (SELECT SUM(frequency_afghan2023_nt) FROM word_frequencies wf2 WHERE wf2.pashto_word = wf1.pashto_word),
  frequency_yousafzai2019_ot = (SELECT SUM(frequency_yousafzai2019_ot) FROM word_frequencies wf2 WHERE wf2.pashto_word = wf1.pashto_word),
  frequency_yousafzai2019_nt = (SELECT SUM(frequency_yousafzai2019_nt) FROM word_frequencies wf2 WHERE wf2.pashto_word = wf1.pashto_word),
  updated_at = strftime('%s', 'now')
WHERE wf1.id = (SELECT MIN(id) FROM word_frequencies wf3 WHERE wf3.pashto_word = wf1.pashto_word)
AND EXISTS (SELECT 1 FROM word_frequencies wf4 WHERE wf4.pashto_word = wf1.pashto_word AND wf4.id != wf1.id);

-- Step 5: Delete duplicate entries (keep only the one with minimum id)
DELETE FROM word_frequencies
WHERE id NOT IN (SELECT MIN(id) FROM word_frequencies GROUP BY pashto_word);

-- Step 6: Final cleanup - remove any remaining punctuation
DELETE FROM word_frequencies
WHERE pashto_word GLOB '*[.,!?؟،]*' 
   OR pashto_word = ''
   OR TRIM(pashto_word) = ''
   OR LENGTH(TRIM(pashto_word)) = 0;

-- Step 7: Trim whitespace
UPDATE word_frequencies
SET pashto_word = TRIM(pashto_word),
    updated_at = strftime('%s', 'now')
WHERE pashto_word != TRIM(pashto_word);

-- Step 8: Recalculate ranks
UPDATE word_frequencies
SET frequency_rank = (
  SELECT COUNT(*) + 1
  FROM word_frequencies wf2
  WHERE wf2.frequency_total > word_frequencies.frequency_total
);

