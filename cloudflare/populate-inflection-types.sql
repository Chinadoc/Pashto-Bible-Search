-- Populate Inflection Types for Nouns/Adjectives
-- Based on: https://grammar.lingdocs.com/inflection/inflection-intro/
--
-- Inflection types:
-- - plain: Base form (no inflection endings)
-- - 1st: Direct case (ends with ې, ي, or ه)
-- - 2nd: Oblique case (ends with و, یو, or يو)
--
-- This SQL uses CASE statements to determine inflection type based on word endings

UPDATE word_frequencies
SET inflection_type = CASE
  -- 2nd inflection (oblique case) - check longer endings first
  WHEN pashto_word LIKE '%یو' AND LENGTH(pashto_word) >= 3 THEN '2nd'
  WHEN pashto_word LIKE '%يو' AND LENGTH(pashto_word) >= 3 THEN '2nd'
  WHEN pashto_word LIKE '%و' 
       AND pashto_word NOT LIKE '%وو'  -- Exclude وو (verb forms)
       AND LENGTH(pashto_word) >= 3 THEN '2nd'
  
  -- 1st inflection (direct case)
  WHEN pashto_word LIKE '%ې' AND LENGTH(pashto_word) >= 3 THEN '1st'
  WHEN pashto_word LIKE '%ه' AND LENGTH(pashto_word) >= 3 THEN '1st'
  -- ي is trickier - only mark as 1st if it's clearly inflectional
  -- (ends with وي or ېي pattern, which are inflectional)
  WHEN pashto_word LIKE '%وي' AND LENGTH(pashto_word) >= 4 THEN '1st'
  WHEN pashto_word LIKE '%ېي' AND LENGTH(pashto_word) >= 4 THEN '1st'
  
  -- Default to plain (base form)
  ELSE 'plain'
END
WHERE (word_type IN ('noun', 'adjective')
   OR pos LIKE '%noun%'
   OR pos LIKE '%adj%'
   OR pos LIKE '%n.%'
   OR pos LIKE '%a.%')
   AND (inflection_type IS NULL OR inflection_type = '');

-- Show statistics
SELECT 
  inflection_type,
  COUNT(*) as count
FROM word_frequencies
WHERE (word_type IN ('noun', 'adjective')
   OR pos LIKE '%noun%'
   OR pos LIKE '%adj%'
   OR pos LIKE '%n.%'
   OR pos LIKE '%a.%')
GROUP BY inflection_type
ORDER BY count DESC;


