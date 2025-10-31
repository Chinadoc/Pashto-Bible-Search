-- Populate Inflection Types in nouns_lexicon
-- Generated: 2025-10-31T02:38:15.119Z
-- Syncs inflection_type from word_frequencies to nouns_lexicon

UPDATE nouns_lexicon
SET inflection_type = (
  SELECT inflection_type
  FROM word_frequencies
  WHERE word_frequencies.pashto_word = nouns_lexicon.pashto_word
    AND word_frequencies.word_type IN ('noun', 'adjective')
  LIMIT 1
)
WHERE EXISTS (
  SELECT 1
  FROM word_frequencies
  WHERE word_frequencies.pashto_word = nouns_lexicon.pashto_word
    AND word_frequencies.word_type IN ('noun', 'adjective')
    AND word_frequencies.inflection_type IS NOT NULL
);
