-- Delete all remaining entries with punctuation
-- Execute this multiple times until count reaches 0

DELETE FROM word_frequencies
WHERE id IN (
  SELECT id FROM word_frequencies
  WHERE pashto_word LIKE '%.%' 
     OR pashto_word LIKE '%,%'
     OR pashto_word LIKE '%!%'
     OR pashto_word LIKE '%?%'
     OR pashto_word LIKE '%؟%'
     OR pashto_word LIKE '%،%'
     OR pashto_word IN ('.', '،', ',', '!', '?', '؟')
     OR TRIM(pashto_word) = ''
  LIMIT 1000
);

