-- Comprehensive cleanup of word_frequencies - removes all punctuation and edge cases
-- This script handles:
-- 1. Words with punctuation marks
-- 2. Words that are ONLY punctuation
-- 3. Empty or whitespace-only words
-- 4. Edge cases

-- Step 1: Delete words that are only punctuation or empty
DELETE FROM word_frequencies
WHERE TRIM(pashto_word) = ''
   OR pashto_word IN ('.', '،', ',', '!', '?', '؟', ' ', '  ', '   ')
   OR LENGTH(TRIM(pashto_word)) = 0;

-- Step 2: Update existing words by merging frequencies from punctuated versions
UPDATE word_frequencies
SET 
  frequency_total = frequency_total + (
    SELECT COALESCE(SUM(frequency_total), 0)
    FROM word_frequencies wf2
    WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(wf2.pashto_word), '.', ''), '،', ''), ',', ''), '!', ''), '?', ''), '؟', ''), ' ', '') = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(word_frequencies.pashto_word), '.', ''), '،', ''), ',', ''), '!', ''), '?', ''), '؟', ''), ' ', '')
      AND wf2.id != word_frequencies.id
      AND (wf2.pashto_word LIKE '%.%' 
           OR wf2.pashto_word LIKE '%,%'
           OR wf2.pashto_word LIKE '%!%'
           OR wf2.pashto_word LIKE '%?%'
           OR wf2.pashto_word LIKE '%؟%'
           OR wf2.pashto_word LIKE '%،%'
           OR TRIM(wf2.pashto_word) = ''
           OR LENGTH(TRIM(wf2.pashto_word)) = 0)
  ),
  frequency_afghan2023_ot = frequency_afghan2023_ot + (
    SELECT COALESCE(SUM(frequency_afghan2023_ot), 0)
    FROM word_frequencies wf2
    WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(wf2.pashto_word), '.', ''), '،', ''), ',', ''), '!', ''), '?', ''), '؟', ''), ' ', '') = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(word_frequencies.pashto_word), '.', ''), '،', ''), ',', ''), '!', ''), '?', ''), '؟', ''), ' ', '')
      AND wf2.id != word_frequencies.id
      AND (wf2.pashto_word LIKE '%.%' 
           OR wf2.pashto_word LIKE '%,%'
           OR wf2.pashto_word LIKE '%!%'
           OR wf2.pashto_word LIKE '%?%'
           OR wf2.pashto_word LIKE '%؟%'
           OR wf2.pashto_word LIKE '%،%'
           OR TRIM(wf2.pashto_word) = ''
           OR LENGTH(TRIM(wf2.pashto_word)) = 0)
  ),
  frequency_afghan2023_nt = frequency_afghan2023_nt + (
    SELECT COALESCE(SUM(frequency_afghan2023_nt), 0)
    FROM word_frequencies wf2
    WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(wf2.pashto_word), '.', ''), '،', ''), ',', ''), '!', ''), '?', ''), '؟', ''), ' ', '') = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(word_frequencies.pashto_word), '.', ''), '،', ''), ',', ''), '!', ''), '?', ''), '؟', ''), ' ', '')
      AND wf2.id != word_frequencies.id
      AND (wf2.pashto_word LIKE '%.%' 
           OR wf2.pashto_word LIKE '%,%'
           OR wf2.pashto_word LIKE '%!%'
           OR wf2.pashto_word LIKE '%?%'
           OR wf2.pashto_word LIKE '%؟%'
           OR wf2.pashto_word LIKE '%،%'
           OR TRIM(wf2.pashto_word) = ''
           OR LENGTH(TRIM(wf2.pashto_word)) = 0)
  ),
  frequency_yousafzai2019_ot = frequency_yousafzai2019_ot + (
    SELECT COALESCE(SUM(frequency_yousafzai2019_ot), 0)
    FROM word_frequencies wf2
    WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(wf2.pashto_word), '.', ''), '،', ''), ',', ''), '!', ''), '?', ''), '؟', ''), ' ', '') = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(word_frequencies.pashto_word), '.', ''), '،', ''), ',', ''), '!', ''), '?', ''), '؟', ''), ' ', '')
      AND wf2.id != word_frequencies.id
      AND (wf2.pashto_word LIKE '%.%' 
           OR wf2.pashto_word LIKE '%,%'
           OR wf2.pashto_word LIKE '%!%'
           OR wf2.pashto_word LIKE '%?%'
           OR wf2.pashto_word LIKE '%؟%'
           OR wf2.pashto_word LIKE '%،%'
           OR TRIM(wf2.pashto_word) = ''
           OR LENGTH(TRIM(wf2.pashto_word)) = 0)
  ),
  frequency_yousafzai2019_nt = frequency_yousafzai2019_nt + (
    SELECT COALESCE(SUM(frequency_yousafzai2019_nt), 0)
    FROM word_frequencies wf2
    WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(wf2.pashto_word), '.', ''), '،', ''), ',', ''), '!', ''), '?', ''), '؟', ''), ' ', '') = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(word_frequencies.pashto_word), '.', ''), '،', ''), ',', ''), '!', ''), '?', ''), '؟', ''), ' ', '')
      AND wf2.id != word_frequencies.id
      AND (wf2.pashto_word LIKE '%.%' 
           OR wf2.pashto_word LIKE '%,%'
           OR wf2.pashto_word LIKE '%!%'
           OR wf2.pashto_word LIKE '%?%'
           OR wf2.pashto_word LIKE '%؟%'
           OR wf2.pashto_word LIKE '%،%'
           OR TRIM(wf2.pashto_word) = ''
           OR LENGTH(TRIM(wf2.pashto_word)) = 0)
  ),
  pashto_word = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(pashto_word), '.', ''), '،', ''), ',', ''), '!', ''), '?', ''), '؟', ''), ' ', ''),
  updated_at = strftime('%s', 'now')
WHERE pashto_word LIKE '%.%' 
   OR pashto_word LIKE '%,%'
   OR pashto_word LIKE '%!%'
   OR pashto_word LIKE '%?%'
   OR pashto_word LIKE '%؟%'
   OR pashto_word LIKE '%،%'
   OR TRIM(pashto_word) = ''
   OR LENGTH(TRIM(pashto_word)) = 0;

-- Step 3: Insert new cleaned words (for ones that don't exist yet)
INSERT INTO word_frequencies (
  pashto_word,
  frequency_total,
  frequency_afghan2023_ot,
  frequency_afghan2023_nt,
  frequency_yousafzai2019_ot,
  frequency_yousafzai2019_nt,
  frequency_rank,
  romanization,
  pos,
  word_type,
  inflection_type,
  compound_type,
  base_form,
  english_translation,
  has_issues,
  issue_flags,
  created_at,
  updated_at
)
SELECT 
  REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(wf1.pashto_word), '.', ''), '،', ''), ',', ''), '!', ''), '?', ''), '؟', ''), ' ', '') AS cleaned_word,
  SUM(wf1.frequency_total) AS total_freq,
  SUM(wf1.frequency_afghan2023_ot) AS total_afghan_ot,
  SUM(wf1.frequency_afghan2023_nt) AS total_afghan_nt,
  SUM(wf1.frequency_yousafzai2019_ot) AS total_yousafzai_ot,
  SUM(wf1.frequency_yousafzai2019_nt) AS total_yousafzai_nt,
  MAX(wf1.frequency_rank) AS best_rank,
  MAX(wf1.romanization) AS romanization,
  MAX(wf1.pos) AS pos,
  MAX(wf1.word_type) AS word_type,
  MAX(wf1.inflection_type) AS inflection_type,
  MAX(wf1.compound_type) AS compound_type,
  MAX(wf1.base_form) AS base_form,
  MAX(wf1.english_translation) AS english_translation,
  MAX(wf1.has_issues) AS has_issues,
  MAX(wf1.issue_flags) AS issue_flags,
  strftime('%s', 'now'),
  strftime('%s', 'now')
FROM word_frequencies wf1
WHERE (wf1.pashto_word LIKE '%.%' 
       OR wf1.pashto_word LIKE '%,%'
       OR wf1.pashto_word LIKE '%!%'
       OR wf1.pashto_word LIKE '%?%'
       OR wf1.pashto_word LIKE '%؟%'
       OR wf1.pashto_word LIKE '%،%'
       OR TRIM(wf1.pashto_word) = ''
       OR LENGTH(TRIM(wf1.pashto_word)) = 0)
  AND REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(wf1.pashto_word), '.', ''), '،', ''), ',', ''), '!', ''), '?', ''), '؟', ''), ' ', '') NOT IN (
    SELECT pashto_word FROM word_frequencies wf2
    WHERE wf2.pashto_word = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(wf1.pashto_word), '.', ''), '،', ''), ',', ''), '!', ''), '?', ''), '؟', ''), ' ', '')
  )
  AND REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(wf1.pashto_word), '.', ''), '،', ''), ',', ''), '!', ''), '?', ''), '؟', ''), ' ', '') != ''
GROUP BY cleaned_word
HAVING cleaned_word != '';

-- Step 4: Delete all entries with punctuation, empty, or whitespace-only
DELETE FROM word_frequencies
WHERE pashto_word LIKE '%.%' 
   OR pashto_word LIKE '%,%'
   OR pashto_word LIKE '%!%'
   OR pashto_word LIKE '%?%'
   OR pashto_word LIKE '%؟%'
   OR pashto_word LIKE '%،%'
   OR TRIM(pashto_word) = ''
   OR LENGTH(TRIM(pashto_word)) = 0
   OR pashto_word IN ('.', '،', ',', '!', '?', '؟', ' ', '  ', '   ');

-- Step 5: Remove any remaining leading/trailing whitespace from all words
UPDATE word_frequencies
SET pashto_word = TRIM(pashto_word),
    updated_at = strftime('%s', 'now')
WHERE pashto_word != TRIM(pashto_word);

-- Step 6: Recalculate frequency ranks
UPDATE word_frequencies
SET frequency_rank = (
  SELECT COUNT(*) + 1
  FROM word_frequencies wf2
  WHERE wf2.frequency_total > word_frequencies.frequency_total
);

-- Step 7: Final verification - count remaining problematic entries
SELECT COUNT(*) as remaining_problematic FROM word_frequencies 
WHERE pashto_word LIKE '%.%' 
   OR pashto_word LIKE '%,%'
   OR pashto_word LIKE '%!%'
   OR pashto_word LIKE '%?%'
   OR pashto_word LIKE '%؟%'
   OR pashto_word LIKE '%،%'
   OR TRIM(pashto_word) = ''
   OR LENGTH(TRIM(pashto_word)) = 0;

