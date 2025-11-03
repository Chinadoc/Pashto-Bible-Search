-- Cleanup using temporary table approach
-- This ensures all punctuation is removed properly

-- Step 1: Create temp table with cleaned words
CREATE TEMP TABLE cleaned_words_temp AS
SELECT 
  id,
  REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(pashto_word), '.', ''), '،', ''), ',', ''), '!', ''), '?', ''), '؟', '') AS cleaned_word,
  pashto_word AS original_word,
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
  issue_flags
FROM word_frequencies
WHERE pashto_word LIKE '%.%' 
   OR pashto_word LIKE '%,%'
   OR pashto_word LIKE '%!%'
   OR pashto_word LIKE '%?%'
   OR pashto_word LIKE '%؟%'
   OR pashto_word LIKE '%،%'
   OR pashto_word IN ('.', '،', ',', '!', '?', '؟')
   OR TRIM(pashto_word) = '';

-- Step 2: Group by cleaned word and sum frequencies
CREATE TEMP TABLE merged_words AS
SELECT 
  cleaned_word,
  SUM(frequency_total) AS total_freq,
  SUM(frequency_afghan2023_ot) AS total_afghan_ot,
  SUM(frequency_afghan2023_nt) AS total_afghan_nt,
  SUM(frequency_yousafzai2019_ot) AS total_yousafzai_ot,
  SUM(frequency_yousafzai2019_nt) AS total_yousafzai_nt,
  MIN(id) AS best_id,
  GROUP_CONCAT(id) AS all_ids
FROM cleaned_words_temp
WHERE cleaned_word != ''
GROUP BY cleaned_word;

-- Step 3: Delete all punctuated entries
DELETE FROM word_frequencies
WHERE id IN (SELECT id FROM cleaned_words_temp);

-- Step 4: Update existing cleaned words with merged frequencies
UPDATE word_frequencies
SET 
  frequency_total = frequency_total + (SELECT total_freq FROM merged_words WHERE merged_words.cleaned_word = word_frequencies.pashto_word),
  frequency_afghan2023_ot = frequency_afghan2023_ot + (SELECT total_afghan_ot FROM merged_words WHERE merged_words.cleaned_word = word_frequencies.pashto_word),
  frequency_afghan2023_nt = frequency_afghan2023_nt + (SELECT total_afghan_nt FROM merged_words WHERE merged_words.cleaned_word = word_frequencies.pashto_word),
  frequency_yousafzai2019_ot = frequency_yousafzai2019_ot + (SELECT total_yousafzai_ot FROM merged_words WHERE merged_words.cleaned_word = word_frequencies.pashto_word),
  frequency_yousafzai2019_nt = frequency_yousafzai2019_nt + (SELECT total_yousafzai_nt FROM merged_words WHERE merged_words.cleaned_word = word_frequencies.pashto_word),
  updated_at = strftime('%s', 'now')
WHERE pashto_word IN (SELECT cleaned_word FROM merged_words);

-- Step 5: Insert new cleaned words (ones that don't exist)
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
  mw.cleaned_word,
  mw.total_freq,
  mw.total_afghan_ot,
  mw.total_afghan_nt,
  mw.total_yousafzai_ot,
  mw.total_yousafzai_nt,
  (SELECT frequency_rank FROM cleaned_words_temp WHERE id = mw.best_id),
  (SELECT romanization FROM cleaned_words_temp WHERE id = mw.best_id),
  (SELECT pos FROM cleaned_words_temp WHERE id = mw.best_id),
  (SELECT word_type FROM cleaned_words_temp WHERE id = mw.best_id),
  (SELECT inflection_type FROM cleaned_words_temp WHERE id = mw.best_id),
  (SELECT compound_type FROM cleaned_words_temp WHERE id = mw.best_id),
  (SELECT base_form FROM cleaned_words_temp WHERE id = mw.best_id),
  (SELECT english_translation FROM cleaned_words_temp WHERE id = mw.best_id),
  (SELECT has_issues FROM cleaned_words_temp WHERE id = mw.best_id),
  (SELECT issue_flags FROM cleaned_words_temp WHERE id = mw.best_id),
  strftime('%s', 'now'),
  strftime('%s', 'now')
FROM merged_words mw
WHERE mw.cleaned_word NOT IN (SELECT pashto_word FROM word_frequencies);

-- Step 6: Clean up temp tables
DROP TABLE IF EXISTS cleaned_words_temp;
DROP TABLE IF EXISTS merged_words;

-- Step 7: Recalculate ranks
UPDATE word_frequencies
SET frequency_rank = (
  SELECT COUNT(*) + 1
  FROM word_frequencies wf2
  WHERE wf2.frequency_total > word_frequencies.frequency_total
);

