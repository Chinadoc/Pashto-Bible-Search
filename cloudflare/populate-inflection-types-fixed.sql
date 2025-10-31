-- Populate Inflection Types for Nouns/Adjectives
-- Based on: https://grammar.lingdocs.com/inflection/inflection-intro/
--
-- Inflection types:
-- - plain: Base form (no inflection endings)
-- - 1st: Direct case (ends with ې, ي, or ه)
-- - 2nd: Oblique case (ends with و, یو, or يو)
--
-- IMPORTANT: First check if word is a base form in nouns_lexicon
-- Only apply inflection rules if word is NOT in nouns_lexicon (i.e., it's an inflected form)

-- Step 1: Mark all words that exist in nouns_lexicon as 'plain' (base forms)
UPDATE word_frequencies
SET inflection_type = 'plain'
WHERE pashto_word IN (
  SELECT pashto_word FROM nouns_lexicon
)
AND (word_type IN ('noun', 'adjective')
   OR pos LIKE '%noun%'
   OR pos LIKE '%adj%'
   OR pos LIKE '%n.%'
   OR pos LIKE '%a.%')
AND (inflection_type IS NULL OR inflection_type = '');

-- Step 2: For remaining words, determine inflection type based on endings
-- Only apply to words NOT in nouns_lexicon (they are likely inflected forms)
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
  -- For words ending in ه, only mark as 1st if they're NOT in nouns_lexicon
  -- (meaning they're inflected forms, not base forms)
  WHEN pashto_word LIKE '%ه' 
       AND pashto_word NOT IN (SELECT pashto_word FROM nouns_lexicon)
       AND LENGTH(pashto_word) >= 3 THEN '1st'
  -- ي is trickier - only mark as 1st if it's clearly inflectional
  WHEN pashto_word LIKE '%وي' AND LENGTH(pashto_word) >= 4 THEN '1st'
  WHEN pashto_word LIKE '%ېي' AND LENGTH(pashto_word) >= 4 THEN '1st'
  
  -- Default to plain (base form)
  ELSE 'plain'
END
WHERE pashto_word NOT IN (SELECT pashto_word FROM nouns_lexicon)
AND (word_type IN ('noun', 'adjective')
   OR pos LIKE '%noun%'
   OR pos LIKE '%adj%'
   OR pos LIKE '%n.%'
   OR pos LIKE '%a.%')
AND (inflection_type IS NULL OR inflection_type = '');

-- Step 3: Handle special cases - words that might be base forms but not in nouns_lexicon
-- For words ending in ه that are not in nouns_lexicon, double-check:
-- If they look like they could be base forms (common patterns), mark as plain
UPDATE word_frequencies
SET inflection_type = 'plain'
WHERE pashto_word LIKE '%ه'
AND pashto_word NOT IN (SELECT pashto_word FROM nouns_lexicon)
AND (word_type IN ('noun', 'adjective')
   OR pos LIKE '%noun%'
   OR pos LIKE '%adj%'
   OR pos LIKE '%n.%'
   OR pos LIKE '%a.%')
AND inflection_type = '1st'
-- Only override if word doesn't look like a clear inflection pattern
AND pashto_word NOT LIKE '%ېه'
AND pashto_word NOT LIKE '%وه';

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

-- Show examples of problematic words
SELECT pashto_word, inflection_type, word_type, pos
FROM word_frequencies
WHERE pashto_word IN ('خانه', 'رسم', 'خانې', 'رسمو')
ORDER BY pashto_word;

