-- Clean up entries with whitespace and brackets
-- Step 1: Remove brackets/parentheses
UPDATE word_frequencies
SET pashto_word = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(pashto_word), '[', ''), ']', ''), '(', ''), ')', ''), '{', ''), '}', ''), '«', ''), '»', ''),
    updated_at = strftime('%s', 'now')
WHERE pashto_word LIKE '%[%' 
   OR pashto_word LIKE '%]%'
   OR pashto_word LIKE '%(%'
   OR pashto_word LIKE '%)%'
   OR pashto_word LIKE '%{%'
   OR pashto_word LIKE '%}%'
   OR pashto_word LIKE '%«%'
   OR pashto_word LIKE '%»%';

-- Step 2: Remove leading/trailing whitespace and normalize internal whitespace
UPDATE word_frequencies
SET pashto_word = TRIM(REPLACE(REPLACE(REPLACE(pashto_word, '\n', ' '), '\t', ' '), '  ', ' ')),
    updated_at = strftime('%s', 'now')
WHERE pashto_word LIKE '% %'
   OR pashto_word LIKE '%\n%'
   OR pashto_word LIKE '%\t%'
   OR pashto_word != TRIM(pashto_word);

-- Step 3: Delete entries that are just whitespace or brackets
DELETE FROM word_frequencies
WHERE TRIM(pashto_word) = ''
   OR pashto_word IN ('[', ']', '(', ')', '{', '}', '«', '»')
   OR LENGTH(TRIM(pashto_word)) = 0;

-- Step 4: Merge duplicates created by cleaning (using temporary table to avoid UNIQUE constraint issues)
CREATE TEMP TABLE temp_cleaned_words AS
SELECT 
  MIN(id) as id,
  pashto_word,
  SUM(frequency_total) as frequency_total,
  SUM(frequency_afghan2023_ot) as frequency_afghan2023_ot,
  SUM(frequency_afghan2023_nt) as frequency_afghan2023_nt,
  SUM(frequency_yousafzai2019_ot) as frequency_yousafzai2019_ot,
  SUM(frequency_yousafzai2019_nt) as frequency_yousafzai2019_nt,
  MAX(updated_at) as updated_at
FROM word_frequencies
GROUP BY pashto_word;

DELETE FROM word_frequencies;

INSERT INTO word_frequencies (
  id, pashto_word, frequency_total, frequency_afghan2023_ot, frequency_afghan2023_nt,
  frequency_yousafzai2019_ot, frequency_yousafzai2019_nt, frequency_rank,
  romanization, pos, word_type, inflection_type, compound_type,
  base_form, english_translation, has_issues, issue_flags,
  created_at, updated_at
)
SELECT 
  t.id,
  t.pashto_word,
  t.frequency_total,
  t.frequency_afghan2023_ot,
  t.frequency_afghan2023_nt,
  t.frequency_yousafzai2019_ot,
  t.frequency_yousafzai2019_nt,
  (SELECT COUNT(*) + 1 FROM temp_cleaned_words t2 WHERE t2.frequency_total > t.frequency_total),
  NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '[]',
  strftime('%s', 'now'),
  t.updated_at
FROM temp_cleaned_words t;

DROP TABLE temp_cleaned_words;

-- Step 5: Recalculate ranks
UPDATE word_frequencies
SET frequency_rank = (
  SELECT COUNT(*) + 1
  FROM word_frequencies wf2
  WHERE wf2.frequency_total > word_frequencies.frequency_total
);

