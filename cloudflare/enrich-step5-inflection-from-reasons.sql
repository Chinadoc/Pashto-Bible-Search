-- Step 5: Update inflection_type from inflection_reasons (if missing)
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

