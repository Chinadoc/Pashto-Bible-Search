-- Fill missing romanization and pos from multiple sources
-- Priority: verb_forms+verbs_lexicon > nouns_lexicon > dictionary lookup

-- Fill verb forms via verb_forms -> verbs_lexicon

UPDATE word_frequencies
SET 
  romanization = (
    SELECT vl.romanization 
    FROM verb_forms vf
    JOIN verbs_lexicon vl ON vf.base_verb = vl.verb_root
    WHERE vf.form = word_frequencies.pashto_word
    LIMIT 1
  ),
  pos = 'verb'
WHERE (romanization IS NULL OR romanization = '')
  AND pashto_word IN (SELECT form FROM verb_forms);


-- Fill from nouns_lexicon

UPDATE word_frequencies
SET 
  romanization = COALESCE(romanization, (SELECT nl.romanized FROM nouns_lexicon nl WHERE nl.pashto_word = word_frequencies.pashto_word LIMIT 1)),
  pos = COALESCE(NULLIF(pos, ''), 'noun')
WHERE (romanization IS NULL OR romanization = '')
  AND pashto_word IN (SELECT pashto_word FROM nouns_lexicon);


-- Fill base verbs from verbs_lexicon

UPDATE word_frequencies
SET 
  romanization = COALESCE(romanization, (SELECT vl.romanization FROM verbs_lexicon vl WHERE vl.verb_root = word_frequencies.pashto_word LIMIT 1)),
  pos = COALESCE(NULLIF(pos, ''), (SELECT vl.pos FROM verbs_lexicon vl WHERE vl.verb_root = word_frequencies.pashto_word LIMIT 1))
WHERE (romanization IS NULL OR romanization = '')
  AND pashto_word IN (SELECT verb_root FROM verbs_lexicon);


-- Fill inflected forms using existing base_verb

UPDATE word_frequencies
SET 
  romanization = COALESCE(romanization, (SELECT vl.romanization FROM verbs_lexicon vl WHERE vl.verb_root = word_frequencies.base_verb LIMIT 1)),
  pos = COALESCE(NULLIF(pos, ''), (SELECT vl.pos FROM verbs_lexicon vl WHERE vl.verb_root = word_frequencies.base_verb LIMIT 1))
WHERE (romanization IS NULL OR romanization = '')
  AND base_verb IS NOT NULL
  AND base_verb IN (SELECT verb_root FROM verbs_lexicon);


-- Fill diacritic variants (match common variants)

-- خُدای -> خدای
UPDATE word_frequencies
SET 
  romanization = COALESCE(romanization, (SELECT nl.romanized FROM nouns_lexicon nl WHERE nl.pashto_word = 'خدای' LIMIT 1)),
  pos = COALESCE(NULLIF(pos, ''), 'noun')
WHERE pashto_word IN ('خُدای', 'خدای')
  AND (romanization IS NULL OR romanization = '');

-- مالِک -> مالک
UPDATE word_frequencies
SET 
  romanization = COALESCE(romanization, (SELECT nl.romanized FROM nouns_lexicon nl WHERE nl.pashto_word = 'مالک' LIMIT 1)),
  pos = COALESCE(NULLIF(pos, ''), 'noun')
WHERE pashto_word IN ('مالِک', 'مالک')
  AND (romanization IS NULL OR romanization = '');


-- Fill common pronouns/demonstratives
UPDATE word_frequencies SET romanization = 'wee', pos = 'pronoun' WHERE pashto_word = 'وی' AND (romanization IS NULL OR romanization = '');
UPDATE word_frequencies SET romanization = 'haghá', pos = 'pronoun' WHERE pashto_word = 'هغۀ' AND (romanization IS NULL OR romanization = '');
UPDATE word_frequencies SET romanization = 'haghé', pos = 'pronoun' WHERE pashto_word = 'هغې' AND (romanization IS NULL OR romanization = '');
UPDATE word_frequencies SET romanization = 'nee', pos = 'pronoun' WHERE pashto_word = 'نی' AND (romanization IS NULL OR romanization = '');
UPDATE word_frequencies SET romanization = 'zu', pos = 'pronoun' WHERE pashto_word = 'زۀ' AND (romanization IS NULL OR romanization = '');
UPDATE word_frequencies SET romanization = 'tsú', pos = 'pronoun' WHERE pashto_word = 'څۀ' AND (romanization IS NULL OR romanization = '');
UPDATE word_frequencies SET romanization = 'oo', pos = 'pronoun' WHERE pashto_word = 'ؤ' AND (romanization IS NULL OR romanization = '');
UPDATE word_frequencies SET romanization = 'woo', pos = 'pronoun' WHERE pashto_word = 'وُو' AND (romanization IS NULL OR romanization = '');
UPDATE word_frequencies SET romanization = 'baan', pos = 'noun' WHERE pashto_word = 'بان' AND (romanization IS NULL OR romanization = '');

-- Fill past tense verbs (و prefix)
-- Note: This matches words starting with 'و' followed by a verb root
UPDATE word_frequencies
SET 
  romanization = (
    SELECT vl.romanization 
    FROM verbs_lexicon vl 
    WHERE word_frequencies.pashto_word LIKE 'و' || vl.verb_root || '%'
    LIMIT 1
  ),
  pos = COALESCE(NULLIF(pos, ''), (
    SELECT vl.pos 
    FROM verbs_lexicon vl 
    WHERE word_frequencies.pashto_word LIKE 'و' || vl.verb_root || '%'
    LIMIT 1
  ))
WHERE (romanization IS NULL OR romanization = '')
  AND word_type = 'verb'
  AND pashto_word LIKE 'و%'
  AND EXISTS (
    SELECT 1 FROM verbs_lexicon vl 
    WHERE word_frequencies.pashto_word LIKE 'و' || vl.verb_root || '%'
  );
