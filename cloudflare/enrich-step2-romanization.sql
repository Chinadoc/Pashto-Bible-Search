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

