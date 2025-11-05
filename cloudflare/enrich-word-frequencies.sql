-- Enrich word_frequencies using data from other tables
-- This script cross-references nouns_lexicon, form_occurrences, inflection_reasons, etc.
-- to populate missing fields in word_frequencies

-- Step 1: Update inflection_type from nouns_lexicon (if word exists there)
UPDATE word_frequencies
SET inflection_type = (
  SELECT inflection_type 
  FROM nouns_lexicon 
  WHERE nouns_lexicon.pashto_word = word_frequencies.pashto_word
  LIMIT 1
)
WHERE inflection_type IS NULL 
AND EXISTS (
  SELECT 1 FROM nouns_lexicon 
  WHERE nouns_lexicon.pashto_word = word_frequencies.pashto_word
);

-- Step 2: Update romanization from nouns_lexicon
UPDATE word_frequencies
SET romanization = (
  SELECT romanized 
  FROM nouns_lexicon 
  WHERE nouns_lexicon.pashto_word = word_frequencies.pashto_word
  LIMIT 1
)
WHERE (romanization IS NULL OR romanization = '')
AND EXISTS (
  SELECT 1 FROM nouns_lexicon 
  WHERE nouns_lexicon.pashto_word = word_frequencies.pashto_word
);

-- Step 3: Update POS from nouns_lexicon (infer from gender)
UPDATE word_frequencies
SET pos = CASE 
  WHEN (SELECT gender FROM nouns_lexicon WHERE nouns_lexicon.pashto_word = word_frequencies.pashto_word LIMIT 1) IN ('m', 'f') 
  THEN 'n. ' || (SELECT gender FROM nouns_lexicon WHERE nouns_lexicon.pashto_word = word_frequencies.pashto_word LIMIT 1)
  ELSE pos
END
WHERE (pos IS NULL OR pos = '')
AND EXISTS (
  SELECT 1 FROM nouns_lexicon 
  WHERE nouns_lexicon.pashto_word = word_frequencies.pashto_word
);

-- Step 4: Update base_form from inflection_reasons (if base_word is known)
UPDATE word_frequencies
SET base_form = (
  SELECT base_word 
  FROM inflection_reasons 
  WHERE inflection_reasons.pashto_form = word_frequencies.pashto_word
  LIMIT 1
)
WHERE (base_form IS NULL OR base_form = '')
AND EXISTS (
  SELECT 1 FROM inflection_reasons 
  WHERE inflection_reasons.pashto_form = word_frequencies.pashto_word
);

-- Step 5: Update inflection_type from inflection_reasons (if word is inflected)
UPDATE word_frequencies
SET inflection_type = (
  SELECT inflection_type 
  FROM inflection_reasons 
  WHERE inflection_reasons.pashto_form = word_frequencies.pashto_word
  LIMIT 1
)
WHERE inflection_type IS NULL 
AND EXISTS (
  SELECT 1 FROM inflection_reasons 
  WHERE inflection_reasons.pashto_form = word_frequencies.pashto_word
);

-- Step 6: Update verse_count from form_occurrences
UPDATE word_frequencies
SET verse_count = (
  SELECT COUNT(*) 
  FROM (
    SELECT json_each.value as verse_ref
    FROM form_occurrences, json_each(json('[' || verse_refs || ']'))
    WHERE form_occurrences.pashto_form = word_frequencies.pashto_word
  )
)
WHERE verse_count = 0 
OR verse_count IS NULL
AND EXISTS (
  SELECT 1 FROM form_occurrences 
  WHERE form_occurrences.pashto_form = word_frequencies.pashto_word
);

-- Step 7: Update word_type based on inflection_type
UPDATE word_frequencies
SET word_type = CASE
  WHEN inflection_type IN ('1st', '2nd') THEN 'inflected'
  WHEN inflection_type = 'plain' THEN 'noun'
  ELSE word_type
END
WHERE word_type IS NULL OR word_type = 'simple';

-- Step 8: Clear issue flags if we've now populated missing data
UPDATE word_frequencies
SET has_issues = 0,
    issue_flags = '[]'
WHERE has_issues = 1
AND (
  (inflection_type IS NOT NULL AND inflection_type != '')
  OR (romanization IS NOT NULL AND romanization != '')
  OR (pos IS NOT NULL AND pos != '')
)
AND issue_flags LIKE '%no_dictionary_match%';

-- Step 9: Update issue flags to remove resolved issues
UPDATE word_frequencies
SET issue_flags = CASE
  WHEN inflection_type IS NOT NULL AND inflection_type != '' 
    AND romanization IS NOT NULL AND romanization != ''
    AND pos IS NOT NULL AND pos != ''
    THEN '[]'
  ELSE issue_flags
END
WHERE issue_flags != '[]';

-- Show statistics
SELECT 
  'After enrichment' as status,
  COUNT(*) as total_words,
  COUNT(CASE WHEN inflection_type IS NOT NULL THEN 1 END) as with_inflection_type,
  COUNT(CASE WHEN romanization IS NOT NULL AND romanization != '' THEN 1 END) as with_romanization,
  COUNT(CASE WHEN pos IS NOT NULL AND pos != '' THEN 1 END) as with_pos,
  COUNT(CASE WHEN base_form IS NOT NULL AND base_form != '' THEN 1 END) as with_base_form,
  COUNT(CASE WHEN verse_count > 0 THEN 1 END) as with_verse_count,
  COUNT(CASE WHEN has_issues = 0 THEN 1 END) as without_issues
FROM word_frequencies
WHERE word_type IN ('noun', 'adjective', 'simple', 'inflected')
   OR pos LIKE '%noun%'
   OR pos LIKE '%adj%'
   OR pos LIKE '%n.%'
   OR pos LIKE '%a.%';

-- Show inflection type distribution
SELECT 
  inflection_type,
  COUNT(*) as count
FROM word_frequencies
WHERE (word_type IN ('noun', 'adjective', 'simple', 'inflected')
   OR pos LIKE '%noun%'
   OR pos LIKE '%adj%'
   OR pos LIKE '%n.%'
   OR pos LIKE '%a.%')
GROUP BY inflection_type
ORDER BY count DESC;






