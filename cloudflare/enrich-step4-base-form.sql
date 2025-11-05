-- Step 4: Update base_form from inflection_reasons
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






