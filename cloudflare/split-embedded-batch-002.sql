-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 7 WHERE pashto_word = '“';

-- Split 'واخلم.“' (7 occurrences) into: واخلم, “

-- Insert '“' into word_verse_mapping for same verses as 'واخلم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'واخلم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'واخلم' WHERE pashto_word = 'واخلم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'واخلم.“';

-- Ensure 'واخلم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واخلم', 0);
-- Add frequency to 'واخلم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 7 WHERE pashto_word = 'واخلم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 7 WHERE pashto_word = '“';

-- Split 'یې، په' (7 occurrences) into: یې, په

-- Insert 'په' into word_verse_mapping for same verses as 'یې، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'یې، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'یې' WHERE pashto_word = 'یې، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'یې، په';

-- Ensure 'یې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یې', 0);
-- Add frequency to 'یې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 7 WHERE pashto_word = 'یې';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 7 WHERE pashto_word = 'په';

-- Split 'زویه، په' (7 occurrences) into: زویه, په

-- Insert 'په' into word_verse_mapping for same verses as 'زویه، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'زویه، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'زویه' WHERE pashto_word = 'زویه، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'زویه، په';

-- Ensure 'زویه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زویه', 0);
-- Add frequency to 'زویه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 7 WHERE pashto_word = 'زویه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 7 WHERE pashto_word = 'په';

-- Split 'کیږی. په' (7 occurrences) into: کیږی, په

-- Insert 'په' into word_verse_mapping for same verses as 'کیږی. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کیږی. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کیږی' WHERE pashto_word = 'کیږی. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کیږی. په';

-- Ensure 'کیږی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کیږی', 0);
-- Add frequency to 'کیږی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 7 WHERE pashto_word = 'کیږی';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 7 WHERE pashto_word = 'په';

-- Split 'وکړی. په' (7 occurrences) into: وکړی, په

-- Insert 'په' into word_verse_mapping for same verses as 'وکړی. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وکړی. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وکړی' WHERE pashto_word = 'وکړی. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وکړی. په';

-- Ensure 'وکړی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکړی', 0);
-- Add frequency to 'وکړی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 7 WHERE pashto_word = 'وکړی';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 7 WHERE pashto_word = 'په';

-- Split 'وایى.“' (7 occurrences) into: وایى, “

-- Insert '“' into word_verse_mapping for same verses as 'وایى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وایى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وایى' WHERE pashto_word = 'وایى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وایى.“';

-- Ensure 'وایى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وایى', 0);
-- Add frequency to 'وایى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 7 WHERE pashto_word = 'وایى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 7 WHERE pashto_word = '“';

-- Split 'اوسی.“' (7 occurrences) into: اوسی, “

-- Insert '“' into word_verse_mapping for same verses as 'اوسی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'اوسی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'اوسی' WHERE pashto_word = 'اوسی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'اوسی.“';

-- Ensure 'اوسی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسی', 0);
-- Add frequency to 'اوسی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 7 WHERE pashto_word = 'اوسی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 7 WHERE pashto_word = '“';

-- Split 'وي. په' (6 occurrences) into: وي, په

-- Insert 'په' into word_verse_mapping for same verses as 'وي. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وي. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وي' WHERE pashto_word = 'وي. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وي. په';

-- Ensure 'وي' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وي', 0);
-- Add frequency to 'وي' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'وي';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'په';

-- Split 'وې، په' (6 occurrences) into: وې, په

-- Insert 'په' into word_verse_mapping for same verses as 'وې، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وې، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وې' WHERE pashto_word = 'وې، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وې، په';

-- Ensure 'وې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وې', 0);
-- Add frequency to 'وې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'وې';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'په';

-- Split 'وې. په' (6 occurrences) into: وې, په

-- Insert 'په' into word_verse_mapping for same verses as 'وې. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وې. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وې' WHERE pashto_word = 'وې. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وې. په';

-- Ensure 'وې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وې', 0);
-- Add frequency to 'وې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'وې';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'په';

-- Split 'زویه! په' (6 occurrences) into: زویه, په

-- Insert 'په' into word_verse_mapping for same verses as 'زویه! په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'زویه! په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'زویه' WHERE pashto_word = 'زویه! په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'زویه! په';

-- Ensure 'زویه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زویه', 0);
-- Add frequency to 'زویه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'زویه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'په';

-- Split 'سلامت.“' (6 occurrences) into: سلامت, “

-- Insert '“' into word_verse_mapping for same verses as 'سلامت.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'سلامت.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'سلامت' WHERE pashto_word = 'سلامت.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'سلامت.“';

-- Ensure 'سلامت' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سلامت', 0);
-- Add frequency to 'سلامت' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'سلامت';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = '“';

-- Split 'آدمه، په' (6 occurrences) into: آدمه, په

-- Insert 'په' into word_verse_mapping for same verses as 'آدمه، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'آدمه، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'آدمه' WHERE pashto_word = 'آدمه، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'آدمه، په';

-- Ensure 'آدمه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آدمه', 0);
-- Add frequency to 'آدمه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'آدمه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'په';

-- Split 'کړه. په' (6 occurrences) into: کړه, په

-- Insert 'په' into word_verse_mapping for same verses as 'کړه. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کړه. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کړه' WHERE pashto_word = 'کړه. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کړه. په';

-- Ensure 'کړه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کړه', 0);
-- Add frequency to 'کړه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'کړه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'په';

-- Split 'نه، په' (6 occurrences) into: نه, په

-- Insert 'په' into word_verse_mapping for same verses as 'نه، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'نه، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'نه' WHERE pashto_word = 'نه، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'نه، په';

-- Ensure 'نه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نه', 0);
-- Add frequency to 'نه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'نه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'په';

-- Split 'ته، په' (6 occurrences) into: ته, په

-- Insert 'په' into word_verse_mapping for same verses as 'ته، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ته، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ته' WHERE pashto_word = 'ته، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ته، په';

-- Ensure 'ته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 0);
-- Add frequency to 'ته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'ته';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'په';

-- Split 'څښتنه، په' (6 occurrences) into: څښتنه, په

-- Insert 'په' into word_verse_mapping for same verses as 'څښتنه، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'څښتنه، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'څښتنه' WHERE pashto_word = 'څښتنه، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'څښتنه، په';

-- Ensure 'څښتنه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څښتنه', 0);
-- Add frequency to 'څښتنه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'څښتنه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'په';

-- Split 'ګورى.“' (6 occurrences) into: ګورى, “

-- Insert '“' into word_verse_mapping for same verses as 'ګورى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ګورى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ګورى' WHERE pashto_word = 'ګورى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ګورى.“';

-- Ensure 'ګورى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګورى', 0);
-- Add frequency to 'ګورى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'ګورى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = '“';

-- Split 'رسيږى.“' (6 occurrences) into: رسيږى, “

-- Insert '“' into word_verse_mapping for same verses as 'رسيږى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'رسيږى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'رسيږى' WHERE pashto_word = 'رسيږى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'رسيږى.“';

-- Ensure 'رسيږى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رسيږى', 0);
-- Add frequency to 'رسيږى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'رسيږى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = '“';

-- Split 'ځُو.“' (6 occurrences) into: ځُو, “

-- Insert '“' into word_verse_mapping for same verses as 'ځُو.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ځُو.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ځُو' WHERE pashto_word = 'ځُو.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ځُو.“';

-- Ensure 'ځُو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځُو', 0);
-- Add frequency to 'ځُو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'ځُو';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = '“';

-- Split 'ختميږى.“' (6 occurrences) into: ختميږى, “

-- Insert '“' into word_verse_mapping for same verses as 'ختميږى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ختميږى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ختميږى' WHERE pashto_word = 'ختميږى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ختميږى.“';

-- Ensure 'ختميږى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ختميږى', 0);
-- Add frequency to 'ختميږى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'ختميږى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = '“';

-- Split 'راوړه.“' (6 occurrences) into: راوړه, “

-- Insert '“' into word_verse_mapping for same verses as 'راوړه.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راوړه.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راوړه' WHERE pashto_word = 'راوړه.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راوړه.“';

-- Ensure 'راوړه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوړه', 0);
-- Add frequency to 'راوړه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'راوړه';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = '“';

-- Split 'راوله.“' (6 occurrences) into: راوله, “

-- Insert '“' into word_verse_mapping for same verses as 'راوله.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راوله.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راوله' WHERE pashto_word = 'راوله.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راوله.“';

-- Ensure 'راوله' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوله', 0);
-- Add frequency to 'راوله' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'راوله';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = '“';

-- Split 'ځى.“' (6 occurrences) into: ځى, “

-- Insert '“' into word_verse_mapping for same verses as 'ځى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ځى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ځى' WHERE pashto_word = 'ځى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ځى.“';

-- Ensure 'ځى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځى', 0);
-- Add frequency to 'ځى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'ځى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = '“';

-- Split 'يم، په' (6 occurrences) into: يم, په

-- Insert 'په' into word_verse_mapping for same verses as 'يم، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'يم، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'يم' WHERE pashto_word = 'يم، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'يم، په';

-- Ensure 'يم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يم', 0);
-- Add frequency to 'يم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'يم';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'په';

-- Split 'واخله.“' (6 occurrences) into: واخله, “

-- Insert '“' into word_verse_mapping for same verses as 'واخله.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'واخله.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'واخله' WHERE pashto_word = 'واخله.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'واخله.“';

-- Ensure 'واخله' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واخله', 0);
-- Add frequency to 'واخله' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'واخله';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = '“';

-- Split 'اورى.“' (6 occurrences) into: اورى, “

-- Insert '“' into word_verse_mapping for same verses as 'اورى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'اورى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'اورى' WHERE pashto_word = 'اورى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'اورى.“';

-- Ensure 'اورى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اورى', 0);
-- Add frequency to 'اورى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'اورى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = '“';

-- Split 'وايه.“' (6 occurrences) into: وايه, “

-- Insert '“' into word_verse_mapping for same verses as 'وايه.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وايه.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وايه' WHERE pashto_word = 'وايه.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وايه.“';

-- Ensure 'وايه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وايه', 0);
-- Add frequency to 'وايه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'وايه';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = '“';

-- Split 'خوېندو، په' (6 occurrences) into: خوېندو, په

-- Insert 'په' into word_verse_mapping for same verses as 'خوېندو، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'خوېندو، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'خوېندو' WHERE pashto_word = 'خوېندو، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'خوېندو، په';

-- Ensure 'خوېندو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوېندو', 0);
-- Add frequency to 'خوېندو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'خوېندو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'په';

-- Split '”راشه.“' (6 occurrences) into: ”راشه, “

-- Insert '“' into word_verse_mapping for same verses as '”راشه.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = '”راشه.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = '”راشه' WHERE pashto_word = '”راشه.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = '”راشه.“';

-- Ensure '”راشه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”راشه', 0);
-- Add frequency to '”راشه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = '”راشه';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = '“';

-- Split 'دی. ته' (6 occurrences) into: دی, ته

-- Insert 'ته' into word_verse_mapping for same verses as 'دی. ته'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'ته', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'دی. ته'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'ته'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'دی' WHERE pashto_word = 'دی. ته';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'دی. ته';

-- Ensure 'دی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دی', 0);
-- Add frequency to 'دی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'دی';
-- Ensure 'ته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 0);
-- Add frequency to 'ته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'ته';

-- Split 'اوسیږی، په' (6 occurrences) into: اوسیږی, په

-- Insert 'په' into word_verse_mapping for same verses as 'اوسیږی، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'اوسیږی، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'اوسیږی' WHERE pashto_word = 'اوسیږی، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'اوسیږی، په';

-- Ensure 'اوسیږی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسیږی', 0);
-- Add frequency to 'اوسیږی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'اوسیږی';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'په';

-- Split 'شی. په' (6 occurrences) into: شی, په

-- Insert 'په' into word_verse_mapping for same verses as 'شی. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شی. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شی' WHERE pashto_word = 'شی. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شی. په';

-- Ensure 'شی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شی', 0);
-- Add frequency to 'شی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'شی';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'په';

-- Split 'کوی، په' (6 occurrences) into: کوی, په

-- Insert 'په' into word_verse_mapping for same verses as 'کوی، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کوی، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کوی' WHERE pashto_word = 'کوی، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کوی، په';

-- Ensure 'کوی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوی', 0);
-- Add frequency to 'کوی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'کوی';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'په';

-- Split 'راشی.“' (6 occurrences) into: راشی, “

-- Insert '“' into word_verse_mapping for same verses as 'راشی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راشی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راشی' WHERE pashto_word = 'راشی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راشی.“';

-- Ensure 'راشی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راشی', 0);
-- Add frequency to 'راشی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'راشی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = '“';

-- Split 'ووينی.“' (6 occurrences) into: ووينی, “

-- Insert '“' into word_verse_mapping for same verses as 'ووينی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ووينی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ووينی' WHERE pashto_word = 'ووينی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ووينی.“';

-- Ensure 'ووينی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووينی', 0);
-- Add frequency to 'ووينی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'ووينی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = '“';

-- Split 'یی، په' (6 occurrences) into: یی, په

-- Insert 'په' into word_verse_mapping for same verses as 'یی، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'یی، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'یی' WHERE pashto_word = 'یی، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'یی، په';

-- Ensure 'یی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یی', 0);
-- Add frequency to 'یی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'یی';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 6 WHERE pashto_word = 'په';

-- Split 'کوله، په' (5 occurrences) into: کوله, په

-- Insert 'په' into word_verse_mapping for same verses as 'کوله، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کوله، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کوله' WHERE pashto_word = 'کوله، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کوله، په';

-- Ensure 'کوله' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوله', 0);
-- Add frequency to 'کوله' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'کوله';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'په';

-- Split 'وکړه، په' (5 occurrences) into: وکړه, په

-- Insert 'په' into word_verse_mapping for same verses as 'وکړه، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وکړه، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وکړه' WHERE pashto_word = 'وکړه، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وکړه، په';

-- Ensure 'وکړه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکړه', 0);
-- Add frequency to 'وکړه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'وکړه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'په';

-- Split 'وه، په' (5 occurrences) into: وه, په

-- Insert 'په' into word_verse_mapping for same verses as 'وه، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وه، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وه' WHERE pashto_word = 'وه، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وه، په';

-- Ensure 'وه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وه', 0);
-- Add frequency to 'وه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'وه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'په';

-- Split 'شول، په' (5 occurrences) into: شول, په

-- Insert 'په' into word_verse_mapping for same verses as 'شول، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شول، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شول' WHERE pashto_word = 'شول، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شول، په';

-- Ensure 'شول' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شول', 0);
-- Add frequency to 'شول' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'شول';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'په';

-- Split 'یې، ته' (5 occurrences) into: یې, ته

-- Insert 'ته' into word_verse_mapping for same verses as 'یې، ته'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'ته', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'یې، ته'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'ته'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'یې' WHERE pashto_word = 'یې، ته';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'یې، ته';

-- Ensure 'یې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یې', 0);
-- Add frequency to 'یې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'یې';
-- Ensure 'ته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 0);
-- Add frequency to 'ته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'ته';

-- Split 'ګوره، ته' (5 occurrences) into: ګوره, ته

-- Insert 'ته' into word_verse_mapping for same verses as 'ګوره، ته'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'ته', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ګوره، ته'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'ته'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ګوره' WHERE pashto_word = 'ګوره، ته';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ګوره، ته';

-- Ensure 'ګوره' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګوره', 0);
-- Add frequency to 'ګوره' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'ګوره';
-- Ensure 'ته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 0);
-- Add frequency to 'ته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'ته';

-- Split 'کړه، په' (5 occurrences) into: کړه, په

-- Insert 'په' into word_verse_mapping for same verses as 'کړه، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کړه، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کړه' WHERE pashto_word = 'کړه، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کړه، په';

-- Ensure 'کړه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کړه', 0);
-- Add frequency to 'کړه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'کړه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'په';

-- Split 'کړې. په' (5 occurrences) into: کړې, په

-- Insert 'په' into word_verse_mapping for same verses as 'کړې. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کړې. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کړې' WHERE pashto_word = 'کړې. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کړې. په';

-- Ensure 'کړې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کړې', 0);
-- Add frequency to 'کړې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'کړې';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'په';

-- Split 'یې. ته' (5 occurrences) into: یې, ته

-- Insert 'ته' into word_verse_mapping for same verses as 'یې. ته'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'ته', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'یې. ته'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'ته'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'یې' WHERE pashto_word = 'یې. ته';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'یې. ته';

-- Ensure 'یې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یې', 0);
-- Add frequency to 'یې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'یې';
-- Ensure 'ته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 0);
-- Add frequency to 'ته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'ته';

-- Split 'کړ. په' (5 occurrences) into: کړ, په

-- Insert 'په' into word_verse_mapping for same verses as 'کړ. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کړ. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کړ' WHERE pashto_word = 'کړ. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کړ. په';

-- Ensure 'کړ' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کړ', 0);
-- Add frequency to 'کړ' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'کړ';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'په';

-- Split 'ووژل. په' (5 occurrences) into: ووژل, په

-- Insert 'په' into word_verse_mapping for same verses as 'ووژل. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ووژل. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ووژل' WHERE pashto_word = 'ووژل. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ووژل. په';

-- Ensure 'ووژل' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووژل', 0);
-- Add frequency to 'ووژل' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'ووژل';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'په';

-- Split 'وښودله. په' (5 occurrences) into: وښودله, په

-- Insert 'په' into word_verse_mapping for same verses as 'وښودله. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وښودله. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وښودله' WHERE pashto_word = 'وښودله. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وښودله. په';

-- Ensure 'وښودله' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وښودله', 0);
-- Add frequency to 'وښودله' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'وښودله';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'په';

-- Split 'مالِکه، په' (5 occurrences) into: مالِکه, په

-- Insert 'په' into word_verse_mapping for same verses as 'مالِکه، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'مالِکه، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'مالِکه' WHERE pashto_word = 'مالِکه، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'مالِکه، په';

-- Ensure 'مالِکه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مالِکه', 0);
-- Add frequency to 'مالِکه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'مالِکه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'په';

-- Split 'يې. په' (5 occurrences) into: يې, په

-- Insert 'په' into word_verse_mapping for same verses as 'يې. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'يې. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'يې' WHERE pashto_word = 'يې. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'يې. په';

-- Ensure 'يې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يې', 0);
-- Add frequency to 'يې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'يې';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'په';

-- Split 'کوي، په' (5 occurrences) into: کوي, په

-- Insert 'په' into word_verse_mapping for same verses as 'کوي، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کوي، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کوي' WHERE pashto_word = 'کوي، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کوي، په';

-- Ensure 'کوي' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوي', 0);
-- Add frequency to 'کوي' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'کوي';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'په';

-- Split 'اورشلیمه، ته' (5 occurrences) into: اورشلیمه, ته

-- Insert 'ته' into word_verse_mapping for same verses as 'اورشلیمه، ته'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'ته', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'اورشلیمه، ته'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'ته'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'اورشلیمه' WHERE pashto_word = 'اورشلیمه، ته';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'اورشلیمه، ته';

-- Ensure 'اورشلیمه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اورشلیمه', 0);
-- Add frequency to 'اورشلیمه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'اورشلیمه';
-- Ensure 'ته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 0);
-- Add frequency to 'ته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'ته';

-- Split 'خدایه، ته' (5 occurrences) into: خدایه, ته

-- Insert 'ته' into word_verse_mapping for same verses as 'خدایه، ته'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'ته', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'خدایه، ته'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'ته'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'خدایه' WHERE pashto_word = 'خدایه، ته';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'خدایه، ته';

-- Ensure 'خدایه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خدایه', 0);
-- Add frequency to 'خدایه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'خدایه';
-- Ensure 'ته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 0);
-- Add frequency to 'ته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'ته';

-- Split 'واچوه.“' (5 occurrences) into: واچوه, “

-- Insert '“' into word_verse_mapping for same verses as 'واچوه.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'واچوه.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'واچوه' WHERE pashto_word = 'واچوه.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'واچوه.“';

-- Ensure 'واچوه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واچوه', 0);
-- Add frequency to 'واچوه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'واچوه';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'کولو.“' (5 occurrences) into: کولو, “

-- Insert '“' into word_verse_mapping for same verses as 'کولو.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کولو.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کولو' WHERE pashto_word = 'کولو.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کولو.“';

-- Ensure 'کولو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کولو', 0);
-- Add frequency to 'کولو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'کولو';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'وم.“' (5 occurrences) into: وم, “

-- Insert '“' into word_verse_mapping for same verses as 'وم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وم' WHERE pashto_word = 'وم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وم.“';

-- Ensure 'وم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وم', 0);
-- Add frequency to 'وم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'وم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'نيولو.“' (5 occurrences) into: نيولو, “

-- Insert '“' into word_verse_mapping for same verses as 'نيولو.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'نيولو.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'نيولو' WHERE pashto_word = 'نيولو.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'نيولو.“';

-- Ensure 'نيولو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نيولو', 0);
-- Add frequency to 'نيولو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'نيولو';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'وتښتى.“' (5 occurrences) into: وتښتى, “

-- Insert '“' into word_verse_mapping for same verses as 'وتښتى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وتښتى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وتښتى' WHERE pashto_word = 'وتښتى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وتښتى.“';

-- Ensure 'وتښتى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وتښتى', 0);
-- Add frequency to 'وتښتى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'وتښتى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'وژنم.“' (5 occurrences) into: وژنم, “

-- Insert '“' into word_verse_mapping for same verses as 'وژنم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وژنم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وژنم' WHERE pashto_word = 'وژنم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وژنم.“';

-- Ensure 'وژنم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وژنم', 0);
-- Add frequency to 'وژنم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'وژنم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'بوځم.“' (5 occurrences) into: بوځم, “

-- Insert '“' into word_verse_mapping for same verses as 'بوځم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'بوځم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'بوځم' WHERE pashto_word = 'بوځم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'بوځم.“';

-- Ensure 'بوځم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بوځم', 0);
-- Add frequency to 'بوځم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'بوځم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'راکوې.“' (5 occurrences) into: راکوې, “

-- Insert '“' into word_verse_mapping for same verses as 'راکوې.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راکوې.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راکوې' WHERE pashto_word = 'راکوې.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راکوې.“';

-- Ensure 'راکوې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکوې', 0);
-- Add frequency to 'راکوې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'راکوې';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'کوم،“' (5 occurrences) into: کوم, “

-- Insert '“' into word_verse_mapping for same verses as 'کوم،“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کوم،“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کوم' WHERE pashto_word = 'کوم،“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کوم،“';

-- Ensure 'کوم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوم', 0);
-- Add frequency to 'کوم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'کوم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'کړې، په' (5 occurrences) into: کړې, په

-- Insert 'په' into word_verse_mapping for same verses as 'کړې، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کړې، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کړې' WHERE pashto_word = 'کړې، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کړې، په';

-- Ensure 'کړې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کړې', 0);
-- Add frequency to 'کړې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'کړې';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'په';

-- Split 'راکړې.“' (5 occurrences) into: راکړې, “

-- Insert '“' into word_verse_mapping for same verses as 'راکړې.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راکړې.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راکړې' WHERE pashto_word = 'راکړې.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راکړې.“';

-- Ensure 'راکړې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکړې', 0);
-- Add frequency to 'راکړې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'راکړې';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'راشم.“' (5 occurrences) into: راشم, “

-- Insert '“' into word_verse_mapping for same verses as 'راشم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راشم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راشم' WHERE pashto_word = 'راشم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راشم.“';

-- Ensure 'راشم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راشم', 0);
-- Add frequency to 'راشم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'راشم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'څمله.“' (5 occurrences) into: څمله, “

-- Insert '“' into word_verse_mapping for same verses as 'څمله.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'څمله.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'څمله' WHERE pashto_word = 'څمله.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'څمله.“';

-- Ensure 'څمله' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څمله', 0);
-- Add frequency to 'څمله' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'څمله';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'مرى.“' (5 occurrences) into: مرى, “

-- Insert '“' into word_verse_mapping for same verses as 'مرى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'مرى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'مرى' WHERE pashto_word = 'مرى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'مرى.“';

-- Ensure 'مرى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مرى', 0);
-- Add frequency to 'مرى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'مرى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'ورکړې.“' (5 occurrences) into: ورکړې, “

-- Insert '“' into word_verse_mapping for same verses as 'ورکړې.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ورکړې.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ورکړې' WHERE pashto_word = 'ورکړې.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړې.“';

-- Ensure 'ورکړې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکړې', 0);
-- Add frequency to 'ورکړې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'ورکړې';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'دپاره.“' (5 occurrences) into: دپاره, “

-- Insert '“' into word_verse_mapping for same verses as 'دپاره.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'دپاره.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'دپاره' WHERE pashto_word = 'دپاره.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'دپاره.“';

-- Ensure 'دپاره' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دپاره', 0);
-- Add frequency to 'دپاره' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'دپاره';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'وڅښى.“' (5 occurrences) into: وڅښى, “

-- Insert '“' into word_verse_mapping for same verses as 'وڅښى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وڅښى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وڅښى' WHERE pashto_word = 'وڅښى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وڅښى.“';

-- Ensure 'وڅښى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وڅښى', 0);
-- Add frequency to 'وڅښى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'وڅښى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'شړى.“' (5 occurrences) into: شړى, “

-- Insert '“' into word_verse_mapping for same verses as 'شړى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شړى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شړى' WHERE pashto_word = 'شړى.“';
