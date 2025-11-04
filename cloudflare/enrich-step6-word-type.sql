-- Step 6: Update word_type based on inflection_type
UPDATE word_frequencies
SET word_type = CASE
  WHEN inflection_type IN ('1st', '2nd') THEN 'inflected'
  WHEN inflection_type = 'plain' AND (pos LIKE '%noun%' OR pos LIKE '%n.%') THEN 'noun'
  WHEN inflection_type = 'plain' AND (pos LIKE '%adj%' OR pos LIKE '%a.%') THEN 'adjective'
  ELSE word_type
END
WHERE word_type IS NULL OR word_type = 'simple';


