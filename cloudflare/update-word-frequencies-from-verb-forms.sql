-- Fill base_verb and form_type in word_frequencies using precomputed verb_forms
-- Base verb: only set when currently null
UPDATE word_frequencies
SET base_verb = (
  SELECT base_verb FROM verb_forms vf
  WHERE vf.form = word_frequencies.pashto_word
  LIMIT 1
)
WHERE base_verb IS NULL
  AND pashto_word IN (SELECT form FROM verb_forms);

-- Form type: only fill when missing
UPDATE word_frequencies
SET form_type = (
  SELECT form_type FROM verb_forms vf
  WHERE vf.form = word_frequencies.pashto_word
  LIMIT 1
)
WHERE form_type IS NULL
  AND pashto_word IN (SELECT form FROM verb_forms);

-- Mark matched entries as verbs when they now have a base verb
UPDATE word_frequencies
SET word_type = COALESCE(word_type, 'verb')
WHERE base_verb IS NOT NULL
  AND (word_type IS NULL OR word_type = '');
