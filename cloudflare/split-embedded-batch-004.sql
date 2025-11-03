-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'ونيسی.“' (4 occurrences) into: ونيسی, “

-- Insert '“' into word_verse_mapping for same verses as 'ونيسی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ونيسی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ونيسی' WHERE pashto_word = 'ونيسی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ونيسی.“';

-- Ensure 'ونيسی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونيسی', 0);
-- Add frequency to 'ونيسی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'ونيسی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'راغلی.“' (4 occurrences) into: راغلی, “

-- Insert '“' into word_verse_mapping for same verses as 'راغلی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راغلی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راغلی' WHERE pashto_word = 'راغلی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راغلی.“';

-- Ensure 'راغلی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راغلی', 0);
-- Add frequency to 'راغلی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'راغلی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'ورکړی.“' (4 occurrences) into: ورکړی, “

-- Insert '“' into word_verse_mapping for same verses as 'ورکړی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ورکړی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ورکړی' WHERE pashto_word = 'ورکړی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړی.“';

-- Ensure 'ورکړی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکړی', 0);
-- Add frequency to 'ورکړی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'ورکړی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'غلی،“' (4 occurrences) into: غلی, “

-- Insert '“' into word_verse_mapping for same verses as 'غلی،“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'غلی،“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'غلی' WHERE pashto_word = 'غلی،“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'غلی،“';

-- Ensure 'غلی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غلی', 0);
-- Add frequency to 'غلی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'غلی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'ورونو! په' (3 occurrences) into: ورونو, په

-- Insert 'په' into word_verse_mapping for same verses as 'ورونو! په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ورونو! په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ورونو' WHERE pashto_word = 'ورونو! په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ورونو! په';

-- Ensure 'ورونو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورونو', 0);
-- Add frequency to 'ورونو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ورونو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'باندې. په' (3 occurrences) into: باندې, په

-- Insert 'په' into word_verse_mapping for same verses as 'باندې. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'باندې. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'باندې' WHERE pashto_word = 'باندې. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'باندې. په';

-- Ensure 'باندې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('باندې', 0);
-- Add frequency to 'باندې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'باندې';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'ورکړ. په' (3 occurrences) into: ورکړ, په

-- Insert 'په' into word_verse_mapping for same verses as 'ورکړ. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ورکړ. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ورکړ' WHERE pashto_word = 'ورکړ. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړ. په';

-- Ensure 'ورکړ' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکړ', 0);
-- Add frequency to 'ورکړ' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ورکړ';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'کوله. په' (3 occurrences) into: کوله, په

-- Insert 'په' into word_verse_mapping for same verses as 'کوله. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کوله. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کوله' WHERE pashto_word = 'کوله. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کوله. په';

-- Ensure 'کوله' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوله', 0);
-- Add frequency to 'کوله' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'کوله';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'کړ، په' (3 occurrences) into: کړ, په

-- Insert 'په' into word_verse_mapping for same verses as 'کړ، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کړ، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کړ' WHERE pashto_word = 'کړ، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کړ، په';

-- Ensure 'کړ' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کړ', 0);
-- Add frequency to 'کړ' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'کړ';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'شي، په' (3 occurrences) into: شي, په

-- Insert 'په' into word_verse_mapping for same verses as 'شي، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شي، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شي' WHERE pashto_word = 'شي، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شي، په';

-- Ensure 'شي' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شي', 0);
-- Add frequency to 'شي' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'شي';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'یې! ته' (3 occurrences) into: یې, ته

-- Insert 'ته' into word_verse_mapping for same verses as 'یې! ته'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'ته', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'یې! ته'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'ته'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'یې' WHERE pashto_word = 'یې! ته';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'یې! ته';

-- Ensure 'یې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یې', 0);
-- Add frequency to 'یې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'یې';
-- Ensure 'ته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 0);
-- Add frequency to 'ته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ته';

-- Split 'کومي، په' (3 occurrences) into: کومي, په

-- Insert 'په' into word_verse_mapping for same verses as 'کومي، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کومي، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کومي' WHERE pashto_word = 'کومي، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کومي، په';

-- Ensure 'کومي' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کومي', 0);
-- Add frequency to 'کومي' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'کومي';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'باداره! په' (3 occurrences) into: باداره, په

-- Insert 'په' into word_verse_mapping for same verses as 'باداره! په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'باداره! په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'باداره' WHERE pashto_word = 'باداره! په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'باداره! په';

-- Ensure 'باداره' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('باداره', 0);
-- Add frequency to 'باداره' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'باداره';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'لاړ، په' (3 occurrences) into: لاړ, په

-- Insert 'په' into word_verse_mapping for same verses as 'لاړ، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'لاړ، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'لاړ' WHERE pashto_word = 'لاړ، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'لاړ، په';

-- Ensure 'لاړ' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لاړ', 0);
-- Add frequency to 'لاړ' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'لاړ';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'کړي. ته' (3 occurrences) into: کړي, ته

-- Insert 'ته' into word_verse_mapping for same verses as 'کړي. ته'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'ته', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کړي. ته'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'ته'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کړي' WHERE pashto_word = 'کړي. ته';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کړي. ته';

-- Ensure 'کړي' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کړي', 0);
-- Add frequency to 'کړي' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'کړي';
-- Ensure 'ته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 0);
-- Add frequency to 'ته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ته';

-- Split 'راځي، په' (3 occurrences) into: راځي, په

-- Insert 'په' into word_verse_mapping for same verses as 'راځي، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راځي، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راځي' WHERE pashto_word = 'راځي، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راځي، په';

-- Ensure 'راځي' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راځي', 0);
-- Add frequency to 'راځي' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'راځي';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'وکړل. په' (3 occurrences) into: وکړل, په

-- Insert 'په' into word_verse_mapping for same verses as 'وکړل. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وکړل. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وکړل' WHERE pashto_word = 'وکړل. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وکړل. په';

-- Ensure 'وکړل' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکړل', 0);
-- Add frequency to 'وکړل' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'وکړل';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'افسوس، په' (3 occurrences) into: افسوس, په

-- Insert 'په' into word_verse_mapping for same verses as 'افسوس، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'افسوس، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'افسوس' WHERE pashto_word = 'افسوس، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'افسوس، په';

-- Ensure 'افسوس' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('افسوس', 0);
-- Add frequency to 'افسوس' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'افسوس';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'کوي. په' (3 occurrences) into: کوي, په

-- Insert 'په' into word_verse_mapping for same verses as 'کوي. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کوي. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کوي' WHERE pashto_word = 'کوي. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کوي. په';

-- Ensure 'کوي' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوي', 0);
-- Add frequency to 'کوي' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'کوي';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'خلکو! په' (3 occurrences) into: خلکو, په

-- Insert 'په' into word_verse_mapping for same verses as 'خلکو! په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'خلکو! په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'خلکو' WHERE pashto_word = 'خلکو! په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'خلکو! په';

-- Ensure 'خلکو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خلکو', 0);
-- Add frequency to 'خلکو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'خلکو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'خدایه، په' (3 occurrences) into: خدایه, په

-- Insert 'په' into word_verse_mapping for same verses as 'خدایه، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'خدایه، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'خدایه' WHERE pashto_word = 'خدایه، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'خدایه، په';

-- Ensure 'خدایه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خدایه', 0);
-- Add frequency to 'خدایه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'خدایه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'کېښودل، په' (3 occurrences) into: کېښودل, په

-- Insert 'په' into word_verse_mapping for same verses as 'کېښودل، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کېښودل، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کېښودل' WHERE pashto_word = 'کېښودل، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کېښودل، په';

-- Ensure 'کېښودل' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېښودل', 0);
-- Add frequency to 'کېښودل' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'کېښودل';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'شوم، په' (3 occurrences) into: شوم, په

-- Insert 'په' into word_verse_mapping for same verses as 'شوم، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شوم، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شوم' WHERE pashto_word = 'شوم، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شوم، په';

-- Ensure 'شوم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شوم', 0);
-- Add frequency to 'شوم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'شوم';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'ګورې.“' (3 occurrences) into: ګورې, “

-- Insert '“' into word_verse_mapping for same verses as 'ګورې.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ګورې.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ګورې' WHERE pashto_word = 'ګورې.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ګورې.“';

-- Ensure 'ګورې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګورې', 0);
-- Add frequency to 'ګورې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ګورې';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'وروستو، به' (3 occurrences) into: وروستو, به

-- Insert 'به' into word_verse_mapping for same verses as 'وروستو، به'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'به', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وروستو، به'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'به'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وروستو' WHERE pashto_word = 'وروستو، به';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وروستو، به';

-- Ensure 'وروستو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وروستو', 0);
-- Add frequency to 'وروستو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'وروستو';
-- Ensure 'به' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('به', 0);
-- Add frequency to 'به' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'به';

-- Split 'حقله.“' (3 occurrences) into: حقله, “

-- Insert '“' into word_verse_mapping for same verses as 'حقله.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'حقله.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'حقله' WHERE pashto_word = 'حقله.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'حقله.“';

-- Ensure 'حقله' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حقله', 0);
-- Add frequency to 'حقله' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'حقله';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'ورکړه. په' (3 occurrences) into: ورکړه, په

-- Insert 'په' into word_verse_mapping for same verses as 'ورکړه. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ورکړه. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ورکړه' WHERE pashto_word = 'ورکړه. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړه. په';

-- Ensure 'ورکړه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکړه', 0);
-- Add frequency to 'ورکړه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ورکړه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split '”آو،“' (3 occurrences) into: ”آو, “

-- Insert '“' into word_verse_mapping for same verses as '”آو،“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = '”آو،“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = '”آو' WHERE pashto_word = '”آو،“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = '”آو،“';

-- Ensure '”آو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”آو', 0);
-- Add frequency to '”آو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '”آو';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'وکړ. په' (3 occurrences) into: وکړ, په

-- Insert 'په' into word_verse_mapping for same verses as 'وکړ. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وکړ. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وکړ' WHERE pashto_word = 'وکړ. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وکړ. په';

-- Ensure 'وکړ' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکړ', 0);
-- Add frequency to 'وکړ' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'وکړ';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'شې. ته' (3 occurrences) into: شې, ته

-- Insert 'ته' into word_verse_mapping for same verses as 'شې. ته'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'ته', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شې. ته'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'ته'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شې' WHERE pashto_word = 'شې. ته';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شې. ته';

-- Ensure 'شې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شې', 0);
-- Add frequency to 'شې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'شې';
-- Ensure 'ته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 0);
-- Add frequency to 'ته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ته';

-- Split 'ولګى.“' (3 occurrences) into: ولګى, “

-- Insert '“' into word_verse_mapping for same verses as 'ولګى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ولګى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ولګى' WHERE pashto_word = 'ولګى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ولګى.“';

-- Ensure 'ولګى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولګى', 0);
-- Add frequency to 'ولګى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ولګى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'راورسيږى.“' (3 occurrences) into: راورسيږى, “

-- Insert '“' into word_verse_mapping for same verses as 'راورسيږى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راورسيږى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راورسيږى' WHERE pashto_word = 'راورسيږى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راورسيږى.“';

-- Ensure 'راورسيږى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راورسيږى', 0);
-- Add frequency to 'راورسيږى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'راورسيږى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'ورکړُو.“' (3 occurrences) into: ورکړُو, “

-- Insert '“' into word_verse_mapping for same verses as 'ورکړُو.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ورکړُو.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ورکړُو' WHERE pashto_word = 'ورکړُو.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړُو.“';

-- Ensure 'ورکړُو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکړُو', 0);
-- Add frequency to 'ورکړُو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ورکړُو';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'واورېده.“' (3 occurrences) into: واورېده, “

-- Insert '“' into word_verse_mapping for same verses as 'واورېده.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'واورېده.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'واورېده' WHERE pashto_word = 'واورېده.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'واورېده.“';

-- Ensure 'واورېده' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واورېده', 0);
-- Add frequency to 'واورېده' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'واورېده';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'کوم. په' (3 occurrences) into: کوم, په

-- Insert 'په' into word_verse_mapping for same verses as 'کوم. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کوم. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کوم' WHERE pashto_word = 'کوم. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کوم. په';

-- Ensure 'کوم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوم', 0);
-- Add frequency to 'کوم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'کوم';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'يادوم.“' (3 occurrences) into: يادوم, “

-- Insert '“' into word_verse_mapping for same verses as 'يادوم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'يادوم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'يادوم' WHERE pashto_word = 'يادوم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'يادوم.“';

-- Ensure 'يادوم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يادوم', 0);
-- Add frequency to 'يادوم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'يادوم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'راغلل، په' (3 occurrences) into: راغلل, په

-- Insert 'په' into word_verse_mapping for same verses as 'راغلل، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راغلل، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راغلل' WHERE pashto_word = 'راغلل، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راغلل، په';

-- Ensure 'راغلل' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راغلل', 0);
-- Add frequency to 'راغلل' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'راغلل';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'لرى. په' (3 occurrences) into: لرى, په

-- Insert 'په' into word_verse_mapping for same verses as 'لرى. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'لرى. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'لرى' WHERE pashto_word = 'لرى. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'لرى. په';

-- Ensure 'لرى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لرى', 0);
-- Add frequency to 'لرى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'لرى';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'پوهيږى.“' (3 occurrences) into: پوهيږى, “

-- Insert '“' into word_verse_mapping for same verses as 'پوهيږى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'پوهيږى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'پوهيږى' WHERE pashto_word = 'پوهيږى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'پوهيږى.“';

-- Ensure 'پوهيږى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پوهيږى', 0);
-- Add frequency to 'پوهيږى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'پوهيږى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'کوى،“' (3 occurrences) into: کوى, “

-- Insert '“' into word_verse_mapping for same verses as 'کوى،“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کوى،“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کوى' WHERE pashto_word = 'کوى،“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کوى،“';

-- Ensure 'کوى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوى', 0);
-- Add frequency to 'کوى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'کوى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'يُو،“' (3 occurrences) into: يُو, “

-- Insert '“' into word_verse_mapping for same verses as 'يُو،“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'يُو،“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'يُو' WHERE pashto_word = 'يُو،“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'يُو،“';

-- Ensure 'يُو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يُو', 0);
-- Add frequency to 'يُو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'يُو';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'وپېژنى.“' (3 occurrences) into: وپېژنى, “

-- Insert '“' into word_verse_mapping for same verses as 'وپېژنى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وپېژنى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وپېژنى' WHERE pashto_word = 'وپېژنى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وپېژنى.“';

-- Ensure 'وپېژنى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وپېژنى', 0);
-- Add frequency to 'وپېژنى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'وپېژنى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'راوغورزولې. په' (3 occurrences) into: راوغورزولې, په

-- Insert 'په' into word_verse_mapping for same verses as 'راوغورزولې. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راوغورزولې. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راوغورزولې' WHERE pashto_word = 'راوغورزولې. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راوغورزولې. په';

-- Ensure 'راوغورزولې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغورزولې', 0);
-- Add frequency to 'راوغورزولې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'راوغورزولې';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'وکړې،“' (3 occurrences) into: وکړې, “

-- Insert '“' into word_verse_mapping for same verses as 'وکړې،“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وکړې،“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وکړې' WHERE pashto_word = 'وکړې،“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وکړې،“';

-- Ensure 'وکړې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکړې', 0);
-- Add frequency to 'وکړې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'وکړې';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'اسراییلو، په' (3 occurrences) into: اسراییلو, په

-- Insert 'په' into word_verse_mapping for same verses as 'اسراییلو، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'اسراییلو، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'اسراییلو' WHERE pashto_word = 'اسراییلو، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'اسراییلو، په';

-- Ensure 'اسراییلو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اسراییلو', 0);
-- Add frequency to 'اسراییلو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'اسراییلو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'اوسېږم،“' (3 occurrences) into: اوسېږم, “

-- Insert '“' into word_verse_mapping for same verses as 'اوسېږم،“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'اوسېږم،“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'اوسېږم' WHERE pashto_word = 'اوسېږم،“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېږم،“';

-- Ensure 'اوسېږم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسېږم', 0);
-- Add frequency to 'اوسېږم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'اوسېږم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'وغواړى.“' (3 occurrences) into: وغواړى, “

-- Insert '“' into word_verse_mapping for same verses as 'وغواړى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وغواړى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وغواړى' WHERE pashto_word = 'وغواړى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وغواړى.“';

-- Ensure 'وغواړى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغواړى', 0);
-- Add frequency to 'وغواړى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'وغواړى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'لورې، په' (3 occurrences) into: لورې, په

-- Insert 'په' into word_verse_mapping for same verses as 'لورې، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'لورې، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'لورې' WHERE pashto_word = 'لورې، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'لورې، په';

-- Ensure 'لورې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لورې', 0);
-- Add frequency to 'لورې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'لورې';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'وروستو، په' (3 occurrences) into: وروستو, په

-- Insert 'په' into word_verse_mapping for same verses as 'وروستو، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وروستو، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وروستو' WHERE pashto_word = 'وروستو، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وروستو، په';

-- Ensure 'وروستو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وروستو', 0);
-- Add frequency to 'وروستو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'وروستو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'ووينم.“' (3 occurrences) into: ووينم, “

-- Insert '“' into word_verse_mapping for same verses as 'ووينم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ووينم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ووينم' WHERE pashto_word = 'ووينم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ووينم.“';

-- Ensure 'ووينم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووينم', 0);
-- Add frequency to 'ووينم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ووينم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'راوړم.“' (3 occurrences) into: راوړم, “

-- Insert '“' into word_verse_mapping for same verses as 'راوړم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راوړم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راوړم' WHERE pashto_word = 'راوړم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راوړم.“';

-- Ensure 'راوړم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوړم', 0);
-- Add frequency to 'راوړم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'راوړم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'ووژنم.“' (3 occurrences) into: ووژنم, “

-- Insert '“' into word_verse_mapping for same verses as 'ووژنم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ووژنم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ووژنم' WHERE pashto_word = 'ووژنم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ووژنم.“';

-- Ensure 'ووژنم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووژنم', 0);
-- Add frequency to 'ووژنم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ووژنم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'وساته.“' (3 occurrences) into: وساته, “

-- Insert '“' into word_verse_mapping for same verses as 'وساته.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وساته.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وساته' WHERE pashto_word = 'وساته.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وساته.“';

-- Ensure 'وساته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وساته', 0);
-- Add frequency to 'وساته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'وساته';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'وى. دې' (3 occurrences) into: وى, دې

-- Insert 'دې' into word_verse_mapping for same verses as 'وى. دې'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'دې', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وى. دې'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'دې'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وى' WHERE pashto_word = 'وى. دې';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وى. دې';

-- Ensure 'وى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وى', 0);
-- Add frequency to 'وى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'وى';
-- Ensure 'دې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دې', 0);
-- Add frequency to 'دې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'دې';

-- Split 'وليدل.“' (3 occurrences) into: وليدل, “

-- Insert '“' into word_verse_mapping for same verses as 'وليدل.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وليدل.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وليدل' WHERE pashto_word = 'وليدل.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وليدل.“';

-- Ensure 'وليدل' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وليدل', 0);
-- Add frequency to 'وليدل' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'وليدل';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'راوويستلو.“' (3 occurrences) into: راوويستلو, “

-- Insert '“' into word_verse_mapping for same verses as 'راوويستلو.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راوويستلو.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راوويستلو' WHERE pashto_word = 'راوويستلو.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راوويستلو.“';

-- Ensure 'راوويستلو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوويستلو', 0);
-- Add frequency to 'راوويستلو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'راوويستلو';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'ښايم.“' (3 occurrences) into: ښايم, “

-- Insert '“' into word_verse_mapping for same verses as 'ښايم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ښايم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ښايم' WHERE pashto_word = 'ښايم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ښايم.“';

-- Ensure 'ښايم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښايم', 0);
-- Add frequency to 'ښايم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ښايم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'ورسوې.“' (3 occurrences) into: ورسوې, “

-- Insert '“' into word_verse_mapping for same verses as 'ورسوې.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ورسوې.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ورسوې' WHERE pashto_word = 'ورسوې.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ورسوې.“';

-- Ensure 'ورسوې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسوې', 0);
-- Add frequency to 'ورسوې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ورسوې';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'راولى.“' (3 occurrences) into: راولى, “

-- Insert '“' into word_verse_mapping for same verses as 'راولى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راولى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راولى' WHERE pashto_word = 'راولى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راولى.“';

-- Ensure 'راولى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راولى', 0);
-- Add frequency to 'راولى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'راولى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'شان، په' (3 occurrences) into: شان, په

-- Insert 'په' into word_verse_mapping for same verses as 'شان، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شان، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شان' WHERE pashto_word = 'شان، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شان، په';

-- Ensure 'شان' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شان', 0);
-- Add frequency to 'شان' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'شان';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'په';

-- Split 'ودريږى.“' (3 occurrences) into: ودريږى, “

-- Insert '“' into word_verse_mapping for same verses as 'ودريږى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ودريږى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ودريږى' WHERE pashto_word = 'ودريږى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ودريږى.“';

-- Ensure 'ودريږى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودريږى', 0);
-- Add frequency to 'ودريږى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ودريږى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'لېږم.“' (3 occurrences) into: لېږم, “

-- Insert '“' into word_verse_mapping for same verses as 'لېږم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'لېږم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'لېږم' WHERE pashto_word = 'لېږم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'لېږم.“';

-- Ensure 'لېږم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لېږم', 0);
-- Add frequency to 'لېږم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'لېږم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'ووژنه.“' (3 occurrences) into: ووژنه, “

-- Insert '“' into word_verse_mapping for same verses as 'ووژنه.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ووژنه.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ووژنه' WHERE pashto_word = 'ووژنه.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ووژنه.“';

-- Ensure 'ووژنه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووژنه', 0);
-- Add frequency to 'ووژنه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ووژنه';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'ووژنو.“' (3 occurrences) into: ووژنو, “

-- Insert '“' into word_verse_mapping for same verses as 'ووژنو.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ووژنو.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ووژنو' WHERE pashto_word = 'ووژنو.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ووژنو.“';

-- Ensure 'ووژنو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووژنو', 0);
-- Add frequency to 'ووژنو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ووژنو';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'زما.“' (3 occurrences) into: زما, “

-- Insert '“' into word_verse_mapping for same verses as 'زما.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'زما.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'زما' WHERE pashto_word = 'زما.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'زما.“';

-- Ensure 'زما' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زما', 0);
-- Add frequency to 'زما' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'زما';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'وګورى.“' (3 occurrences) into: وګورى, “

-- Insert '“' into word_verse_mapping for same verses as 'وګورى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وګورى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وګورى' WHERE pashto_word = 'وګورى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وګورى.“';

-- Ensure 'وګورى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګورى', 0);
-- Add frequency to 'وګورى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'وګورى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'ورسوى.“' (3 occurrences) into: ورسوى, “

-- Insert '“' into word_verse_mapping for same verses as 'ورسوى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ورسوى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ورسوى' WHERE pashto_word = 'ورسوى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ورسوى.“';

-- Ensure 'ورسوى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسوى', 0);
-- Add frequency to 'ورسوى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ورسوى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'ياديږى.“' (3 occurrences) into: ياديږى, “

-- Insert '“' into word_verse_mapping for same verses as 'ياديږى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ياديږى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ياديږى' WHERE pashto_word = 'ياديږى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ياديږى.“';

-- Ensure 'ياديږى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ياديږى', 0);
-- Add frequency to 'ياديږى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'ياديږى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'زنده‌باد.“' (3 occurrences) into: زنده, باد, “

-- Insert 'باد' into word_verse_mapping for same verses as 'زنده‌باد.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'باد', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'زنده‌باد.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'باد'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Insert '“' into word_verse_mapping for same verses as 'زنده‌باد.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'زنده‌باد.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'زنده' WHERE pashto_word = 'زنده‌باد.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'زنده‌باد.“';

-- Ensure 'زنده' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زنده', 0);
-- Add frequency to 'زنده' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'زنده';
-- Ensure 'باد' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('باد', 0);
-- Add frequency to 'باد' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'باد';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split 'وګورم.“' (3 occurrences) into: وګورم, “

-- Insert '“' into word_verse_mapping for same verses as 'وګورم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وګورم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وګورم' WHERE pashto_word = 'وګورم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وګورم.“';

-- Ensure 'وګورم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګورم', 0);
-- Add frequency to 'وګورم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = 'وګورم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '“';

-- Split '”آو.“' (3 occurrences) into: ”آو, “

-- Insert '“' into word_verse_mapping for same verses as '”آو.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = '”آو.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = '”آو' WHERE pashto_word = '”آو.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = '”آو.“';

-- Ensure '”آو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”آو', 0);
-- Add frequency to '”آو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 3 WHERE pashto_word = '”آو';
