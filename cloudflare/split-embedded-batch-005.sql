-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'لاړو، په' (3 occurrences) into: لاړو, په

-- Insert 'په' into word_verse_mapping for same verses as 'لاړو، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'لاړو، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'لاړو' WHERE pashto_word = 'لاړو، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'لاړو، په';

-- Ensure 'لاړو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لاړو', 0);
-- Add frequency to 'لاړو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'لاړو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'څښم.“' (3 occurrences) into: څښم, “

-- Insert '“' into word_verse_mapping for same verses as 'څښم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'څښم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'څښم' WHERE pashto_word = 'څښم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'څښم.“';

-- Ensure 'څښم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څښم', 0);
-- Add frequency to 'څښم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'څښم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'شه. په' (3 occurrences) into: شه, په

-- Insert 'په' into word_verse_mapping for same verses as 'شه. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شه. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شه' WHERE pashto_word = 'شه. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شه. په';

-- Ensure 'شه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شه', 0);
-- Add frequency to 'شه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'شه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'آمين.“' (3 occurrences) into: آمين, “

-- Insert '“' into word_verse_mapping for same verses as 'آمين.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'آمين.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'آمين' WHERE pashto_word = 'آمين.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'آمين.“';

-- Ensure 'آمين' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آمين', 0);
-- Add frequency to 'آمين' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'آمين';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'استعماليږى.“' (3 occurrences) into: استعماليږى, “

-- Insert '“' into word_verse_mapping for same verses as 'استعماليږى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'استعماليږى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'استعماليږى' WHERE pashto_word = 'استعماليږى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'استعماليږى.“';

-- Ensure 'استعماليږى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('استعماليږى', 0);
-- Add frequency to 'استعماليږى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'استعماليږى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'کولو، په' (3 occurrences) into: کولو, په

-- Insert 'په' into word_verse_mapping for same verses as 'کولو، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کولو، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کولو' WHERE pashto_word = 'کولو، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کولو، په';

-- Ensure 'کولو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کولو', 0);
-- Add frequency to 'کولو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'کولو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'وکړو، په' (3 occurrences) into: وکړو, په

-- Insert 'په' into word_verse_mapping for same verses as 'وکړو، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وکړو، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وکړو' WHERE pashto_word = 'وکړو، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وکړو، په';

-- Ensure 'وکړو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکړو', 0);
-- Add frequency to 'وکړو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'وکړو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'ولګوى.“' (3 occurrences) into: ولګوى, “

-- Insert '“' into word_verse_mapping for same verses as 'ولګوى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ولګوى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ولګوى' WHERE pashto_word = 'ولګوى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ولګوى.“';

-- Ensure 'ولګوى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولګوى', 0);
-- Add frequency to 'ولګوى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ولګوى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'يريږى، په' (3 occurrences) into: يريږى, په

-- Insert 'په' into word_verse_mapping for same verses as 'يريږى، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'يريږى، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'يريږى' WHERE pashto_word = 'يريږى، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'يريږى، په';

-- Ensure 'يريږى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يريږى', 0);
-- Add frequency to 'يريږى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'يريږى';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'وښايم.“' (3 occurrences) into: وښايم, “

-- Insert '“' into word_verse_mapping for same verses as 'وښايم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وښايم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وښايم' WHERE pashto_word = 'وښايم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وښايم.“';

-- Ensure 'وښايم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وښايم', 0);
-- Add frequency to 'وښايم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'وښايم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'ځو.“' (3 occurrences) into: ځو, “

-- Insert '“' into word_verse_mapping for same verses as 'ځو.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ځو.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ځو' WHERE pashto_word = 'ځو.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ځو.“';

-- Ensure 'ځو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځو', 0);
-- Add frequency to 'ځو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ځو';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'شان.“' (3 occurrences) into: شان, “

-- Insert '“' into word_verse_mapping for same verses as 'شان.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شان.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شان' WHERE pashto_word = 'شان.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شان.“';

-- Ensure 'شان' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شان', 0);
-- Add frequency to 'شان' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'شان';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'ګڼى.“' (3 occurrences) into: ګڼى, “

-- Insert '“' into word_verse_mapping for same verses as 'ګڼى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ګڼى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ګڼى' WHERE pashto_word = 'ګڼى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ګڼى.“';

-- Ensure 'ګڼى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګڼى', 0);
-- Add frequency to 'ګڼى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ګڼى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'يُو، په' (3 occurrences) into: يُو, په

-- Insert 'په' into word_verse_mapping for same verses as 'يُو، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'يُو، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'يُو' WHERE pashto_word = 'يُو، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'يُو، په';

-- Ensure 'يُو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يُو', 0);
-- Add frequency to 'يُو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'يُو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'واچوى.“' (3 occurrences) into: واچوى, “

-- Insert '“' into word_verse_mapping for same verses as 'واچوى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'واچوى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'واچوى' WHERE pashto_word = 'واچوى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'واچوى.“';

-- Ensure 'واچوى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واچوى', 0);
-- Add frequency to 'واچوى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'واچوى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'ورځ،“' (3 occurrences) into: ورځ, “

-- Insert '“' into word_verse_mapping for same verses as 'ورځ،“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ورځ،“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ورځ' WHERE pashto_word = 'ورځ،“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ورځ،“';

-- Ensure 'ورځ' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورځ', 0);
-- Add frequency to 'ورځ' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ورځ';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'ته.“' (3 occurrences) into: ته, “

-- Insert '“' into word_verse_mapping for same verses as 'ته.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ته.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ته' WHERE pashto_word = 'ته.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ته.“';

-- Ensure 'ته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 0);
-- Add frequency to 'ته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ته';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'ووهلې.“' (3 occurrences) into: ووهلې, “

-- Insert '“' into word_verse_mapping for same verses as 'ووهلې.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ووهلې.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ووهلې' WHERE pashto_word = 'ووهلې.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ووهلې.“';

-- Ensure 'ووهلې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووهلې', 0);
-- Add frequency to 'ووهلې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ووهلې';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'پېژنم.“' (3 occurrences) into: پېژنم, “

-- Insert '“' into word_verse_mapping for same verses as 'پېژنم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'پېژنم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'پېژنم' WHERE pashto_word = 'پېژنم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'پېژنم.“';

-- Ensure 'پېژنم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پېژنم', 0);
-- Add frequency to 'پېژنم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'پېژنم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'راوځه.“' (3 occurrences) into: راوځه, “

-- Insert '“' into word_verse_mapping for same verses as 'راوځه.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راوځه.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راوځه' WHERE pashto_word = 'راوځه.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راوځه.“';

-- Ensure 'راوځه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوځه', 0);
-- Add frequency to 'راوځه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'راوځه';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'منى.“' (3 occurrences) into: منى, “

-- Insert '“' into word_verse_mapping for same verses as 'منى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'منى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'منى' WHERE pashto_word = 'منى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'منى.“';

-- Ensure 'منى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('منى', 0);
-- Add frequency to 'منى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'منى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'زويه. په' (3 occurrences) into: زويه, په

-- Insert 'په' into word_verse_mapping for same verses as 'زويه. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'زويه. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'زويه' WHERE pashto_word = 'زويه. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'زويه. په';

-- Ensure 'زويه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زويه', 0);
-- Add frequency to 'زويه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'زويه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'بادشاه.“' (3 occurrences) into: بادشاه, “

-- Insert '“' into word_verse_mapping for same verses as 'بادشاه.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'بادشاه.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'بادشاه' WHERE pashto_word = 'بادشاه.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'بادشاه.“';

-- Ensure 'بادشاه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بادشاه', 0);
-- Add frequency to 'بادشاه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'بادشاه';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'شو،“' (3 occurrences) into: شو, “

-- Insert '“' into word_verse_mapping for same verses as 'شو،“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شو،“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شو' WHERE pashto_word = 'شو،“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شو،“';

-- Ensure 'شو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شو', 0);
-- Add frequency to 'شو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'شو';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'وتښتی. په' (3 occurrences) into: وتښتی, په

-- Insert 'په' into word_verse_mapping for same verses as 'وتښتی. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وتښتی. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وتښتی' WHERE pashto_word = 'وتښتی. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وتښتی. په';

-- Ensure 'وتښتی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وتښتی', 0);
-- Add frequency to 'وتښتی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'وتښتی';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'اوسېږی، په' (3 occurrences) into: اوسېږی, په

-- Insert 'په' into word_verse_mapping for same verses as 'اوسېږی، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'اوسېږی، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'اوسېږی' WHERE pashto_word = 'اوسېږی، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېږی، په';

-- Ensure 'اوسېږی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسېږی', 0);
-- Add frequency to 'اوسېږی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'اوسېږی';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'وڅښی.“' (3 occurrences) into: وڅښی, “

-- Insert '“' into word_verse_mapping for same verses as 'وڅښی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وڅښی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وڅښی' WHERE pashto_word = 'وڅښی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وڅښی.“';

-- Ensure 'وڅښی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وڅښی', 0);
-- Add frequency to 'وڅښی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'وڅښی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'نيسی.“' (3 occurrences) into: نيسی, “

-- Insert '“' into word_verse_mapping for same verses as 'نيسی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'نيسی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'نيسی' WHERE pashto_word = 'نيسی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'نيسی.“';

-- Ensure 'نيسی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نيسی', 0);
-- Add frequency to 'نيسی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'نيسی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'يرېږی. په' (3 occurrences) into: يرېږی, په

-- Insert 'په' into word_verse_mapping for same verses as 'يرېږی. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'يرېږی. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'يرېږی' WHERE pashto_word = 'يرېږی. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'يرېږی. په';

-- Ensure 'يرېږی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يرېږی', 0);
-- Add frequency to 'يرېږی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'يرېږی';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'واخلی.“' (3 occurrences) into: واخلی, “

-- Insert '“' into word_verse_mapping for same verses as 'واخلی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'واخلی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'واخلی' WHERE pashto_word = 'واخلی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'واخلی.“';

-- Ensure 'واخلی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واخلی', 0);
-- Add frequency to 'واخلی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'واخلی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'وغږوی. په' (3 occurrences) into: وغږوی, په

-- Insert 'په' into word_verse_mapping for same verses as 'وغږوی. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وغږوی. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وغږوی' WHERE pashto_word = 'وغږوی. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وغږوی. په';

-- Ensure 'وغږوی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغږوی', 0);
-- Add frequency to 'وغږوی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'وغږوی';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'وباسی.“' (3 occurrences) into: وباسی, “

-- Insert '“' into word_verse_mapping for same verses as 'وباسی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وباسی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وباسی' WHERE pashto_word = 'وباسی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وباسی.“';

-- Ensure 'وباسی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وباسی', 0);
-- Add frequency to 'وباسی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'وباسی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'ولګوی.“' (3 occurrences) into: ولګوی, “

-- Insert '“' into word_verse_mapping for same verses as 'ولګوی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ولګوی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ولګوی' WHERE pashto_word = 'ولګوی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ولګوی.“';

-- Ensure 'ولګوی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولګوی', 0);
-- Add frequency to 'ولګوی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ولګوی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'جوړَوی.“' (3 occurrences) into: جوړَوی, “

-- Insert '“' into word_verse_mapping for same verses as 'جوړَوی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'جوړَوی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'جوړَوی' WHERE pashto_word = 'جوړَوی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'جوړَوی.“';

-- Ensure 'جوړَوی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جوړَوی', 0);
-- Add frequency to 'جوړَوی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'جوړَوی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'بوځی.“' (3 occurrences) into: بوځی, “

-- Insert '“' into word_verse_mapping for same verses as 'بوځی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'بوځی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'بوځی' WHERE pashto_word = 'بوځی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'بوځی.“';

-- Ensure 'بوځی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بوځی', 0);
-- Add frequency to 'بوځی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'بوځی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'يوسی.“' (3 occurrences) into: يوسی, “

-- Insert '“' into word_verse_mapping for same verses as 'يوسی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'يوسی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'يوسی' WHERE pashto_word = 'يوسی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'يوسی.“';

-- Ensure 'يوسی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يوسی', 0);
-- Add frequency to 'يوسی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'يوسی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'ګڼلی.“' (3 occurrences) into: ګڼلی, “

-- Insert '“' into word_verse_mapping for same verses as 'ګڼلی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ګڼلی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ګڼلی' WHERE pashto_word = 'ګڼلی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ګڼلی.“';

-- Ensure 'ګڼلی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګڼلی', 0);
-- Add frequency to 'ګڼلی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ګڼلی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'يی. په' (3 occurrences) into: يی, په

-- Insert 'په' into word_verse_mapping for same verses as 'يی. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'يی. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'يی' WHERE pashto_word = 'يی. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'يی. په';

-- Ensure 'يی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يی', 0);
-- Add frequency to 'يی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'يی';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'وویيل.“' (3 occurrences) into: وویيل, “

-- Insert '“' into word_verse_mapping for same verses as 'وویيل.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وویيل.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وویيل' WHERE pashto_word = 'وویيل.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وویيل.“';

-- Ensure 'وویيل' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وویيل', 0);
-- Add frequency to 'وویيل' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'وویيل';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'واچوی.“' (3 occurrences) into: واچوی, “

-- Insert '“' into word_verse_mapping for same verses as 'واچوی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'واچوی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'واچوی' WHERE pashto_word = 'واچوی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'واچوی.“';

-- Ensure 'واچوی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واچوی', 0);
-- Add frequency to 'واچوی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'واچوی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'رسوی.“' (3 occurrences) into: رسوی, “

-- Insert '“' into word_verse_mapping for same verses as 'رسوی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'رسوی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'رسوی' WHERE pashto_word = 'رسوی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'رسوی.“';

-- Ensure 'رسوی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رسوی', 0);
-- Add frequency to 'رسوی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'رسوی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'اخلی.“' (3 occurrences) into: اخلی, “

-- Insert '“' into word_verse_mapping for same verses as 'اخلی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'اخلی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'اخلی' WHERE pashto_word = 'اخلی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'اخلی.“';

-- Ensure 'اخلی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخلی', 0);
-- Add frequency to 'اخلی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'اخلی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'واوری. په' (3 occurrences) into: واوری, په

-- Insert 'په' into word_verse_mapping for same verses as 'واوری. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'واوری. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'واوری' WHERE pashto_word = 'واوری. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'واوری. په';

-- Ensure 'واوری' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واوری', 0);
-- Add frequency to 'واوری' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'واوری';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'ورسوو. په' (2 occurrences) into: ورسوو, په

-- Insert 'په' into word_verse_mapping for same verses as 'ورسوو. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ورسوو. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ورسوو' WHERE pashto_word = 'ورسوو. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ورسوو. په';

-- Ensure 'ورسوو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسوو', 0);
-- Add frequency to 'ورسوو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ورسوو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'شولو. په' (2 occurrences) into: شولو, په

-- Insert 'په' into word_verse_mapping for same verses as 'شولو. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شولو. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شولو' WHERE pashto_word = 'شولو. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شولو. په';

-- Ensure 'شولو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شولو', 0);
-- Add frequency to 'شولو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'شولو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'لاړو. په' (2 occurrences) into: لاړو, په

-- Insert 'په' into word_verse_mapping for same verses as 'لاړو. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'لاړو. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'لاړو' WHERE pashto_word = 'لاړو. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'لاړو. په';

-- Ensure 'لاړو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لاړو', 0);
-- Add frequency to 'لاړو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'لاړو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'شاووله! ته' (2 occurrences) into: شاووله, ته

-- Insert 'ته' into word_verse_mapping for same verses as 'شاووله! ته'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'ته', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شاووله! ته'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'ته'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شاووله' WHERE pashto_word = 'شاووله! ته';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شاووله! ته';

-- Ensure 'شاووله' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شاووله', 0);
-- Add frequency to 'شاووله' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'شاووله';
-- Ensure 'ته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 0);
-- Add frequency to 'ته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ته';

-- Split 'اورېدل، په' (2 occurrences) into: اورېدل, په

-- Insert 'په' into word_verse_mapping for same verses as 'اورېدل، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'اورېدل، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'اورېدل' WHERE pashto_word = 'اورېدل، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'اورېدل، په';

-- Ensure 'اورېدل' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اورېدل', 0);
-- Add frequency to 'اورېدل' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'اورېدل';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'غلامانو، په' (2 occurrences) into: غلامانو, په

-- Insert 'په' into word_verse_mapping for same verses as 'غلامانو، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'غلامانو، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'غلامانو' WHERE pashto_word = 'غلامانو، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'غلامانو، په';

-- Ensure 'غلامانو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غلامانو', 0);
-- Add frequency to 'غلامانو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'غلامانو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'لري، په' (2 occurrences) into: لري, په

-- Insert 'په' into word_verse_mapping for same verses as 'لري، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'لري، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'لري' WHERE pashto_word = 'لري، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'لري، په';

-- Ensure 'لري' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لري', 0);
-- Add frequency to 'لري' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'لري';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'وه، دې' (2 occurrences) into: وه, دې

-- Insert 'دې' into word_verse_mapping for same verses as 'وه، دې'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'دې', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وه، دې'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'دې'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وه' WHERE pashto_word = 'وه، دې';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وه، دې';

-- Ensure 'وه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وه', 0);
-- Add frequency to 'وه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'وه';
-- Ensure 'دې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دې', 0);
-- Add frequency to 'دې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'دې';

-- Split 'شوې، په' (2 occurrences) into: شوې, په

-- Insert 'په' into word_verse_mapping for same verses as 'شوې، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شوې، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شوې' WHERE pashto_word = 'شوې، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شوې، په';

-- Ensure 'شوې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شوې', 0);
-- Add frequency to 'شوې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'شوې';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'شمعونه، ته' (2 occurrences) into: شمعونه, ته

-- Insert 'ته' into word_verse_mapping for same verses as 'شمعونه، ته'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'ته', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شمعونه، ته'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'ته'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شمعونه' WHERE pashto_word = 'شمعونه، ته';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شمعونه، ته';

-- Ensure 'شمعونه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شمعونه', 0);
-- Add frequency to 'شمعونه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'شمعونه';
-- Ensure 'ته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 0);
-- Add frequency to 'ته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ته';

-- Split 'ده، دې' (2 occurrences) into: ده, دې

-- Insert 'دې' into word_verse_mapping for same verses as 'ده، دې'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'دې', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ده، دې'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'دې'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ده' WHERE pashto_word = 'ده، دې';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ده، دې';

-- Ensure 'ده' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ده', 0);
-- Add frequency to 'ده' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ده';
-- Ensure 'دې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دې', 0);
-- Add frequency to 'دې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'دې';

-- Split 'وای، په' (2 occurrences) into: وای, په

-- Insert 'په' into word_verse_mapping for same verses as 'وای، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وای، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وای' WHERE pashto_word = 'وای، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وای، په';

-- Ensure 'وای' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وای', 0);
-- Add frequency to 'وای' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'وای';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'راشي، په' (2 occurrences) into: راشي, په

-- Insert 'په' into word_verse_mapping for same verses as 'راشي، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راشي، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راشي' WHERE pashto_word = 'راشي، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راشي، په';

-- Ensure 'راشي' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راشي', 0);
-- Add frequency to 'راشي' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'راشي';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'وي.» په' (2 occurrences) into: وي, په

-- Insert 'په' into word_verse_mapping for same verses as 'وي.» په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وي.» په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وي' WHERE pashto_word = 'وي.» په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وي.» په';

-- Ensure 'وي' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وي', 0);
-- Add frequency to 'وي' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'وي';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'کوه، په' (2 occurrences) into: کوه, په

-- Insert 'په' into word_verse_mapping for same verses as 'کوه، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کوه، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کوه' WHERE pashto_word = 'کوه، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کوه، په';

-- Ensure 'کوه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوه', 0);
-- Add frequency to 'کوه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'کوه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'شیطانه! ته' (2 occurrences) into: شیطانه, ته

-- Insert 'ته' into word_verse_mapping for same verses as 'شیطانه! ته'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'ته', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شیطانه! ته'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'ته'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شیطانه' WHERE pashto_word = 'شیطانه! ته';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شیطانه! ته';

-- Ensure 'شیطانه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شیطانه', 0);
-- Add frequency to 'شیطانه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'شیطانه';
-- Ensure 'ته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 0);
-- Add frequency to 'ته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ته';

-- Split 'شه، په' (2 occurrences) into: شه, په

-- Insert 'په' into word_verse_mapping for same verses as 'شه، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شه، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شه' WHERE pashto_word = 'شه، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شه، په';

-- Ensure 'شه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شه', 0);
-- Add frequency to 'شه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'شه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'اوسه، ته' (2 occurrences) into: اوسه, ته

-- Insert 'ته' into word_verse_mapping for same verses as 'اوسه، ته'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'ته', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'اوسه، ته'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'ته'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'اوسه' WHERE pashto_word = 'اوسه، ته';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'اوسه، ته';

-- Ensure 'اوسه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسه', 0);
-- Add frequency to 'اوسه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'اوسه';
-- Ensure 'ته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 0);
-- Add frequency to 'ته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ته';

-- Split 'وسوځوي. په' (2 occurrences) into: وسوځوي, په

-- Insert 'په' into word_verse_mapping for same verses as 'وسوځوي. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وسوځوي. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وسوځوي' WHERE pashto_word = 'وسوځوي. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وسوځوي. په';

-- Ensure 'وسوځوي' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسوځوي', 0);
-- Add frequency to 'وسوځوي' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'وسوځوي';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'ښاره! په' (2 occurrences) into: ښاره, په

-- Insert 'په' into word_verse_mapping for same verses as 'ښاره! په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ښاره! په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ښاره' WHERE pashto_word = 'ښاره! په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ښاره! په';

-- Ensure 'ښاره' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښاره', 0);
-- Add frequency to 'ښاره' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ښاره';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'ووژنم. په' (2 occurrences) into: ووژنم, په

-- Insert 'په' into word_verse_mapping for same verses as 'ووژنم. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ووژنم. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ووژنم' WHERE pashto_word = 'ووژنم. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ووژنم. په';

-- Ensure 'ووژنم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووژنم', 0);
-- Add frequency to 'ووژنم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ووژنم';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'کوې. ته' (2 occurrences) into: کوې, ته

-- Insert 'ته' into word_verse_mapping for same verses as 'کوې. ته'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'ته', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کوې. ته'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'ته'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کوې' WHERE pashto_word = 'کوې. ته';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کوې. ته';

-- Ensure 'کوې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوې', 0);
-- Add frequency to 'کوې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'کوې';
-- Ensure 'ته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 0);
-- Add frequency to 'ته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ته';

-- Split 'راولي. په' (2 occurrences) into: راولي, په

-- Insert 'په' into word_verse_mapping for same verses as 'راولي. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راولي. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راولي' WHERE pashto_word = 'راولي. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راولي. په';

-- Ensure 'راولي' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راولي', 0);
-- Add frequency to 'راولي' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'راولي';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'ده، ته' (2 occurrences) into: ده, ته

-- Insert 'ته' into word_verse_mapping for same verses as 'ده، ته'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'ته', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ده، ته'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'ته'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ده' WHERE pashto_word = 'ده، ته';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ده، ته';

-- Ensure 'ده' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ده', 0);
-- Add frequency to 'ده' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ده';
-- Ensure 'ته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 0);
-- Add frequency to 'ته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ته';

-- Split 'خورې، په' (2 occurrences) into: خورې, په

-- Insert 'په' into word_verse_mapping for same verses as 'خورې، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'خورې، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'خورې' WHERE pashto_word = 'خورې، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'خورې، په';

-- Ensure 'خورې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خورې', 0);
-- Add frequency to 'خورې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'خورې';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'شوه. په' (2 occurrences) into: شوه, په

-- Insert 'په' into word_verse_mapping for same verses as 'شوه. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شوه. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شوه' WHERE pashto_word = 'شوه. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شوه. په';

-- Ensure 'شوه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شوه', 0);
-- Add frequency to 'شوه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'شوه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'خلکو، دې' (2 occurrences) into: خلکو, دې

-- Insert 'دې' into word_verse_mapping for same verses as 'خلکو، دې'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'دې', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'خلکو، دې'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'دې'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'خلکو' WHERE pashto_word = 'خلکو، دې';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'خلکو، دې';

-- Ensure 'خلکو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خلکو', 0);
-- Add frequency to 'خلکو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'خلکو';
-- Ensure 'دې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دې', 0);
-- Add frequency to 'دې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'دې';

-- Split 'وو،نۀ' (2 occurrences) into: وو, نۀ

-- Insert 'نۀ' into word_verse_mapping for same verses as 'وو،نۀ'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'نۀ', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وو،نۀ'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'نۀ'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وو' WHERE pashto_word = 'وو،نۀ';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وو،نۀ';

-- Ensure 'وو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وو', 0);
-- Add frequency to 'وو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'وو';
-- Ensure 'نۀ' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نۀ', 0);
-- Add frequency to 'نۀ' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'نۀ';

-- Split 'وو،نۀ مې' (2 occurrences) into: وو, نۀ, مې

-- Insert 'نۀ' into word_verse_mapping for same verses as 'وو،نۀ مې'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'نۀ', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وو،نۀ مې'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'نۀ'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );
