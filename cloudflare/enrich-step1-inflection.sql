-- Step 1: Update inflection_type from nouns_lexicon
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


