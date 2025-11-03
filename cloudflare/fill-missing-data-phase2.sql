-- Phase 2: Fill remaining missing data patterns
-- Handles: inflected forms, و prefix verbs, multi-word phrases, punctuation cleanup

-- 1. Fill inflected forms using base_verb (retry with better query)
UPDATE word_frequencies
SET 
  romanization = (
    SELECT vl.romanization 
    FROM verbs_lexicon vl 
    WHERE vl.verb_root = word_frequencies.base_verb 
    LIMIT 1
  ),
  pos = COALESCE(NULLIF(pos, ''), (
    SELECT vl.pos 
    FROM verbs_lexicon vl 
    WHERE vl.verb_root = word_frequencies.base_verb 
    LIMIT 1
  ))
WHERE base_verb IS NOT NULL 
  AND (romanization IS NULL OR romanization = '')
  AND base_verb IN (SELECT verb_root FROM verbs_lexicon);

-- 2. Fill nouns using base_verb (for possessive/inflected nouns)
UPDATE word_frequencies
SET 
  romanization = (
    SELECT nl.romanized 
    FROM nouns_lexicon nl 
    WHERE nl.pashto_word = word_frequencies.base_verb 
    LIMIT 1
  ),
  pos = COALESCE(NULLIF(pos, ''), 'noun')
WHERE base_verb IS NOT NULL 
  AND (romanization IS NULL OR romanization = '')
  AND base_verb IN (SELECT pashto_word FROM nouns_lexicon);

-- 3. Handle و prefix verbs (strip و and match base)
UPDATE word_frequencies
SET 
  romanization = (
    SELECT vl.romanization 
    FROM verbs_lexicon vl 
    WHERE vl.verb_root = SUBSTR(word_frequencies.pashto_word, 2)
    LIMIT 1
  ),
  pos = COALESCE(NULLIF(pos, ''), (
    SELECT vl.pos 
    FROM verbs_lexicon vl 
    WHERE vl.verb_root = SUBSTR(word_frequencies.pashto_word, 2)
    LIMIT 1
  ))
WHERE pashto_word LIKE 'و%' 
  AND LENGTH(pashto_word) > 1
  AND word_type = 'verb'
  AND (romanization IS NULL OR romanization = '')
  AND SUBSTR(pashto_word, 2) IN (SELECT verb_root FROM verbs_lexicon);

-- 4. Handle و prefix that IS the base verb (like وویيل, وفرمایيل)
UPDATE word_frequencies
SET 
  romanization = (
    SELECT vl.romanization 
    FROM verbs_lexicon vl 
    WHERE vl.verb_root = word_frequencies.pashto_word
    LIMIT 1
  ),
  pos = COALESCE(NULLIF(pos, ''), (
    SELECT vl.pos 
    FROM verbs_lexicon vl 
    WHERE vl.verb_root = word_frequencies.pashto_word
    LIMIT 1
  ))
WHERE pashto_word LIKE 'و%'
  AND word_type = 'verb'
  AND (romanization IS NULL OR romanization = '')
  AND pashto_word IN (SELECT verb_root FROM verbs_lexicon);

-- 5. Mark multi-word phrases
UPDATE word_frequencies
SET pos = 'phrase'
WHERE pashto_word LIKE '% %' 
  AND (pos IS NULL OR pos = '' OR pos = 'unknown');

-- 6. Fill common high-frequency words manually
UPDATE word_frequencies SET romanization = 'tsaa', pos = 'pronoun' WHERE pashto_word = 'چا' AND (romanization IS NULL OR romanization = '');
UPDATE word_frequencies SET romanization = 'ku', pos = 'conjunction' WHERE pashto_word = 'کۀ' AND (romanization IS NULL OR romanization = '');
UPDATE word_frequencies SET romanization = 'yawá', pos = 'numeral' WHERE pashto_word = 'یوه' AND (romanization IS NULL OR romanization = '');
UPDATE word_frequencies SET romanization = 'khalkóo', pos = 'noun' WHERE pashto_word = 'خلکو' AND (romanization IS NULL OR romanization = '');
UPDATE word_frequencies SET romanization = 'banáy', pos = 'verb' WHERE pashto_word = 'بنی' AND (romanization IS NULL OR romanization = '');
UPDATE word_frequencies SET romanization = 'kéeGee', pos = 'verb' WHERE pashto_word = 'کیږی' AND (romanization IS NULL OR romanization = '');
UPDATE word_frequencies SET romanization = 'khabúRe', pos = 'noun' WHERE pashto_word = 'خبرې' AND (romanization IS NULL OR romanization = '');
UPDATE word_frequencies SET romanization = 'mulúk', pos = 'noun' WHERE pashto_word = 'مُلک' AND (romanization IS NULL OR romanization = '');

-- 7. Handle verb forms that have base but form wasn't in verb_forms (edge cases)
-- Check کړل exists in verbs_lexicon
UPDATE word_frequencies
SET 
  romanization = COALESCE(romanization, (SELECT vl.romanization FROM verbs_lexicon vl WHERE vl.verb_root = 'کړل' LIMIT 1)),
  pos = COALESCE(NULLIF(pos, ''), 'verb')
WHERE pashto_word IN ('کړل', 'کړې', 'کړو')
  AND base_verb = 'کړل'
  AND (romanization IS NULL OR romanization = '');

-- 8. Handle proper nouns (mark as proper noun)
UPDATE word_frequencies
SET pos = 'proper_noun'
WHERE pashto_word LIKE '%اییل%' 
  AND (pos IS NULL OR pos = '' OR pos = 'unknown');

-- 9. Clean up punctuation artifacts (remove trailing punctuation from word itself)
-- Note: This updates the pashto_word column, use with caution
-- UPDATE word_frequencies
-- SET pashto_word = TRIM(pashto_word, ':;.,!?')
-- WHERE pashto_word LIKE '%[:;.,!?]';

-- Instead, just fill romanization for common punctuation words
UPDATE word_frequencies SET romanization = '[punctuation]', pos = 'punctuation' WHERE pashto_word IN ('"', '''', ':', ';', '.', ',', '!', '?') AND (romanization IS NULL OR romanization = '');

