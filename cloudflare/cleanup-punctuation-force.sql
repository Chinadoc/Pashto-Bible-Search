-- Force cleanup: Remove ALL punctuation in batches
-- This uses a more aggressive approach

-- Batch 1: Delete punctuation-only entries
DELETE FROM word_frequencies WHERE pashto_word = '.' OR pashto_word = '،' OR pashto_word = ',' OR pashto_word = '!' OR pashto_word = '?' OR pashto_word = '؟';

-- Batch 2: Clean words ending with punctuation
UPDATE word_frequencies SET pashto_word = RTRIM(pashto_word, '.،,!?؟'), updated_at = strftime('%s', 'now') WHERE pashto_word LIKE '%.' OR pashto_word LIKE '%،' OR pashto_word LIKE '%,' OR pashto_word LIKE '%!' OR pashto_word LIKE '%?' OR pashto_word LIKE '%؟';

-- Batch 3: Clean words starting with punctuation  
UPDATE word_frequencies SET pashto_word = LTRIM(pashto_word, '.،,!?؟'), updated_at = strftime('%s', 'now') WHERE pashto_word LIKE '.%' OR pashto_word LIKE '،%' OR pashto_word LIKE ',%' OR pashto_word LIKE '!%' OR pashto_word LIKE '?%' OR pashto_word LIKE '؟%';

-- Batch 4: Remove any remaining punctuation using REPLACE
UPDATE word_frequencies 
SET pashto_word = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(pashto_word, '.', ''), '،', ''), ',', ''), '!', ''), '?', ''), '؟', ''),
    updated_at = strftime('%s', 'now')
WHERE pashto_word LIKE '%.%' OR pashto_word LIKE '%,%' OR pashto_word LIKE '%!%' OR pashto_word LIKE '%?%' OR pashto_word LIKE '%؟%' OR pashto_word LIKE '%،%';

-- Batch 5: Delete empty entries
DELETE FROM word_frequencies WHERE pashto_word = '' OR TRIM(pashto_word) = '' OR LENGTH(TRIM(pashto_word)) = 0;

-- Batch 6: Merge duplicates
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

DELETE FROM word_frequencies WHERE id NOT IN (SELECT MIN(id) FROM word_frequencies GROUP BY pashto_word);

-- Batch 7: Final cleanup
DELETE FROM word_frequencies WHERE pashto_word LIKE '%.%' OR pashto_word LIKE '%,%' OR pashto_word LIKE '%!%' OR pashto_word LIKE '%?%' OR pashto_word LIKE '%؟%' OR pashto_word LIKE '%،%';

-- Batch 8: Trim whitespace
UPDATE word_frequencies SET pashto_word = TRIM(pashto_word), updated_at = strftime('%s', 'now') WHERE pashto_word != TRIM(pashto_word);

-- Batch 9: Recalculate ranks
UPDATE word_frequencies SET frequency_rank = (SELECT COUNT(*) + 1 FROM word_frequencies wf2 WHERE wf2.frequency_total > word_frequencies.frequency_total);

