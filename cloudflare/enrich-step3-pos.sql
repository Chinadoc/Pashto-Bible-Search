-- Step 3: Update POS from nouns_lexicon (infer from gender)
UPDATE word_frequencies
SET pos = CASE 
  WHEN (SELECT gender FROM nouns_lexicon WHERE nouns_lexicon.pashto_word = word_frequencies.pashto_word LIMIT 1) = 'm' 
  THEN 'n. m.'
  WHEN (SELECT gender FROM nouns_lexicon WHERE nouns_lexicon.pashto_word = word_frequencies.pashto_word LIMIT 1) = 'f' 
  THEN 'n. f.'
  ELSE pos
END
WHERE (pos IS NULL OR pos = '')
AND EXISTS (
  SELECT 1 FROM nouns_lexicon 
  WHERE nouns_lexicon.pashto_word = word_frequencies.pashto_word
);


