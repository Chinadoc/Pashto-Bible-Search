
-- Insert 'مې' into word_verse_mapping for same verses as 'وو،نۀ مې'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'مې', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وو،نۀ مې'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'مې'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وو' WHERE pashto_word = 'وو،نۀ مې';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وو،نۀ مې';

-- Ensure 'وو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وو', 0);
-- Add frequency to 'وو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'وو';
-- Ensure 'نۀ' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نۀ', 0);
-- Add frequency to 'نۀ' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'نۀ';
-- Ensure 'مې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مې', 0);
-- Add frequency to 'مې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'مې';

-- Split 'وګورم. په' (2 occurrences) into: وګورم, په

-- Insert 'په' into word_verse_mapping for same verses as 'وګورم. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وګورم. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وګورم' WHERE pashto_word = 'وګورم. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وګورم. په';

-- Ensure 'وګورم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګورم', 0);
-- Add frequency to 'وګورم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'وګورم';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'ورسيږى.“' (2 occurrences) into: ورسيږى, “

-- Insert '“' into word_verse_mapping for same verses as 'ورسيږى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ورسيږى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ورسيږى' WHERE pashto_word = 'ورسيږى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ورسيږى.“';

-- Ensure 'ورسيږى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسيږى', 0);
-- Add frequency to 'ورسيږى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ورسيږى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'دانياله، په' (2 occurrences) into: دانياله, په

-- Insert 'په' into word_verse_mapping for same verses as 'دانياله، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'دانياله، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'دانياله' WHERE pashto_word = 'دانياله، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'دانياله، په';

-- Ensure 'دانياله' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دانياله', 0);
-- Add frequency to 'دانياله' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'دانياله';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'بيلطشضر، په' (2 occurrences) into: بيلطشضر, په

-- Insert 'په' into word_verse_mapping for same verses as 'بيلطشضر، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'بيلطشضر، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'بيلطشضر' WHERE pashto_word = 'بيلطشضر، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'بيلطشضر، په';

-- Ensure 'بيلطشضر' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بيلطشضر', 0);
-- Add frequency to 'بيلطشضر' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'بيلطشضر';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'شدرک، په' (2 occurrences) into: شدرک, په

-- Insert 'په' into word_verse_mapping for same verses as 'شدرک، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شدرک، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شدرک' WHERE pashto_word = 'شدرک، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شدرک، په';

-- Ensure 'شدرک' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شدرک', 0);
-- Add frequency to 'شدرک' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'شدرک';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'ووايو.“' (2 occurrences) into: ووايو, “

-- Insert '“' into word_verse_mapping for same verses as 'ووايو.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ووايو.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ووايو' WHERE pashto_word = 'ووايو.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ووايو.“';

-- Ensure 'ووايو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووايو', 0);
-- Add frequency to 'ووايو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ووايو';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'کښې، به' (2 occurrences) into: کښې, به

-- Insert 'به' into word_verse_mapping for same verses as 'کښې، به'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'به', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کښې، به'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'به'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کښې' WHERE pashto_word = 'کښې، به';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کښې، به';

-- Ensure 'کښې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کښې', 0);
-- Add frequency to 'کښې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'کښې';
-- Ensure 'به' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('به', 0);
-- Add frequency to 'به' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'به';

-- Split '”بيلطشضره، په' (2 occurrences) into: ”بيلطشضره, په

-- Insert 'په' into word_verse_mapping for same verses as '”بيلطشضره، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = '”بيلطشضره، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = '”بيلطشضره' WHERE pashto_word = '”بيلطشضره، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = '”بيلطشضره، په';

-- Ensure '”بيلطشضره' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”بيلطشضره', 0);
-- Add frequency to '”بيلطشضره' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '”بيلطشضره';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'کېږه.“' (2 occurrences) into: کېږه, “

-- Insert '“' into word_verse_mapping for same verses as 'کېږه.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کېږه.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کېږه' WHERE pashto_word = 'کېږه.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کېږه.“';

-- Ensure 'کېږه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېږه', 0);
-- Add frequency to 'کېږه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'کېږه';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'سلامت، په' (2 occurrences) into: سلامت, په

-- Insert 'په' into word_verse_mapping for same verses as 'سلامت، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'سلامت، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'سلامت' WHERE pashto_word = 'سلامت، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'سلامت، په';

-- Ensure 'سلامت' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سلامت', 0);
-- Add frequency to 'سلامت' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'سلامت';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'خورې. په' (2 occurrences) into: خورې, په

-- Insert 'په' into word_verse_mapping for same verses as 'خورې. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'خورې. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'خورې' WHERE pashto_word = 'خورې. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'خورې. په';

-- Ensure 'خورې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خورې', 0);
-- Add frequency to 'خورې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'خورې';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'وساتله.“' (2 occurrences) into: وساتله, “

-- Insert '“' into word_verse_mapping for same verses as 'وساتله.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وساتله.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وساتله' WHERE pashto_word = 'وساتله.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وساتله.“';

-- Ensure 'وساتله' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وساتله', 0);
-- Add frequency to 'وساتله' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'وساتله';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'وم، په' (2 occurrences) into: وم, په

-- Insert 'په' into word_verse_mapping for same verses as 'وم، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وم، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وم' WHERE pashto_word = 'وم، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وم، په';

-- Ensure 'وم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وم', 0);
-- Add frequency to 'وم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'وم';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'اوسیږي. په' (2 occurrences) into: اوسیږي, په

-- Insert 'په' into word_verse_mapping for same verses as 'اوسیږي. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'اوسیږي. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'اوسیږي' WHERE pashto_word = 'اوسیږي. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'اوسیږي. په';

-- Ensure 'اوسیږي' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسیږي', 0);
-- Add frequency to 'اوسیږي' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'اوسیږي';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'وباسي، په' (2 occurrences) into: وباسي, په

-- Insert 'په' into word_verse_mapping for same verses as 'وباسي، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وباسي، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وباسي' WHERE pashto_word = 'وباسي، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وباسي، په';

-- Ensure 'وباسي' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وباسي', 0);
-- Add frequency to 'وباسي' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'وباسي';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'انسانه، دې' (2 occurrences) into: انسانه, دې

-- Insert 'دې' into word_verse_mapping for same verses as 'انسانه، دې'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'دې', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'انسانه، دې'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'دې'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'انسانه' WHERE pashto_word = 'انسانه، دې';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'انسانه، دې';

-- Ensure 'انسانه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('انسانه', 0);
-- Add frequency to 'انسانه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'انسانه';
-- Ensure 'دې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دې', 0);
-- Add frequency to 'دې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'دې';

-- Split 'کړې. ته' (2 occurrences) into: کړې, ته

-- Insert 'ته' into word_verse_mapping for same verses as 'کړې. ته'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'ته', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کړې. ته'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'ته'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کړې' WHERE pashto_word = 'کړې. ته';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کړې. ته';

-- Ensure 'کړې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کړې', 0);
-- Add frequency to 'کړې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'کړې';
-- Ensure 'ته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 0);
-- Add frequency to 'ته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ته';

-- Split 'دي، در' (2 occurrences) into: دي, در

-- Insert 'در' into word_verse_mapping for same verses as 'دي، در'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'در', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'دي، در'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'در'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'دي' WHERE pashto_word = 'دي، در';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'دي، در';

-- Ensure 'دي' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دي', 0);
-- Add frequency to 'دي' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'دي';
-- Ensure 'در' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('در', 0);
-- Add frequency to 'در' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'در';

-- Split 'انسانه، په' (2 occurrences) into: انسانه, په

-- Insert 'په' into word_verse_mapping for same verses as 'انسانه، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'انسانه، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'انسانه' WHERE pashto_word = 'انسانه، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'انسانه، په';

-- Ensure 'انسانه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('انسانه', 0);
-- Add frequency to 'انسانه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'انسانه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'بوتلم. په' (2 occurrences) into: بوتلم, په

-- Insert 'په' into word_verse_mapping for same verses as 'بوتلم. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'بوتلم. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'بوتلم' WHERE pashto_word = 'بوتلم. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'بوتلم. په';

-- Ensure 'بوتلم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بوتلم', 0);
-- Add frequency to 'بوتلم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'بوتلم';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'ورکړي. په' (2 occurrences) into: ورکړي, په

-- Insert 'په' into word_verse_mapping for same verses as 'ورکړي. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ورکړي. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ورکړي' WHERE pashto_word = 'ورکړي. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړي. په';

-- Ensure 'ورکړي' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکړي', 0);
-- Add frequency to 'ورکړي' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ورکړي';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'خلکو، په' (2 occurrences) into: خلکو, په

-- Insert 'په' into word_verse_mapping for same verses as 'خلکو، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'خلکو، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'خلکو' WHERE pashto_word = 'خلکو، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'خلکو، په';

-- Ensure 'خلکو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خلکو', 0);
-- Add frequency to 'خلکو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'خلکو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'شوه، په' (2 occurrences) into: شوه, په

-- Insert 'په' into word_verse_mapping for same verses as 'شوه، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شوه، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شوه' WHERE pashto_word = 'شوه، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شوه، په';

-- Ensure 'شوه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شوه', 0);
-- Add frequency to 'شوه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'شوه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'ګوري. په' (2 occurrences) into: ګوري, په

-- Insert 'په' into word_verse_mapping for same verses as 'ګوري. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ګوري. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ګوري' WHERE pashto_word = 'ګوري. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ګوري. په';

-- Ensure 'ګوري' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګوري', 0);
-- Add frequency to 'ګوري' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ګوري';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'شه! ته' (2 occurrences) into: شه, ته

-- Insert 'ته' into word_verse_mapping for same verses as 'شه! ته'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'ته', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شه! ته'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'ته'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شه' WHERE pashto_word = 'شه! ته';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شه! ته';

-- Ensure 'شه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شه', 0);
-- Add frequency to 'شه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'شه';
-- Ensure 'ته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 0);
-- Add frequency to 'ته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ته';

-- Split 'خُدايه.“' (2 occurrences) into: خُدايه, “

-- Insert '“' into word_verse_mapping for same verses as 'خُدايه.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'خُدايه.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'خُدايه' WHERE pashto_word = 'خُدايه.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'خُدايه.“';

-- Ensure 'خُدايه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خُدايه', 0);
-- Add frequency to 'خُدايه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'خُدايه';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'راوپاروله.“' (2 occurrences) into: راوپاروله, “

-- Insert '“' into word_verse_mapping for same verses as 'راوپاروله.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راوپاروله.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راوپاروله' WHERE pashto_word = 'راوپاروله.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راوپاروله.“';

-- Ensure 'راوپاروله' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوپاروله', 0);
-- Add frequency to 'راوپاروله' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'راوپاروله';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'ورېبلو.“' (2 occurrences) into: ورېبلو, “

-- Insert '“' into word_verse_mapping for same verses as 'ورېبلو.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ورېبلو.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ورېبلو' WHERE pashto_word = 'ورېبلو.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ورېبلو.“';

-- Ensure 'ورېبلو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورېبلو', 0);
-- Add frequency to 'ورېبلو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ورېبلو';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'نسل، په' (2 occurrences) into: نسل, په

-- Insert 'په' into word_verse_mapping for same verses as 'نسل، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'نسل، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'نسل' WHERE pashto_word = 'نسل، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'نسل، په';

-- Ensure 'نسل' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نسل', 0);
-- Add frequency to 'نسل' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'نسل';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'وليدلو. په' (2 occurrences) into: وليدلو, په

-- Insert 'په' into word_verse_mapping for same verses as 'وليدلو. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وليدلو. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وليدلو' WHERE pashto_word = 'وليدلو. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وليدلو. په';

-- Ensure 'وليدلو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وليدلو', 0);
-- Add frequency to 'وليدلو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'وليدلو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'شرموه، په' (2 occurrences) into: شرموه, په

-- Insert 'په' into word_verse_mapping for same verses as 'شرموه، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شرموه، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شرموه' WHERE pashto_word = 'شرموه، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شرموه، په';

-- Ensure 'شرموه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شرموه', 0);
-- Add frequency to 'شرموه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'شرموه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'يروه. په' (2 occurrences) into: يروه, په

-- Insert 'په' into word_verse_mapping for same verses as 'يروه. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'يروه. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'يروه' WHERE pashto_word = 'يروه. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'يروه. په';

-- Ensure 'يروه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يروه', 0);
-- Add frequency to 'يروه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'يروه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'اوسيږو، په' (2 occurrences) into: اوسيږو, په

-- Insert 'په' into word_verse_mapping for same verses as 'اوسيږو، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'اوسيږو، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'اوسيږو' WHERE pashto_word = 'اوسيږو، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'اوسيږو، په';

-- Ensure 'اوسيږو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسيږو', 0);
-- Add frequency to 'اوسيږو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'اوسيږو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'اورم.“' (2 occurrences) into: اورم, “

-- Insert '“' into word_verse_mapping for same verses as 'اورم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'اورم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'اورم' WHERE pashto_word = 'اورم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'اورم.“';

-- Ensure 'اورم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اورم', 0);
-- Add frequency to 'اورم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'اورم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'نيسو.“' (2 occurrences) into: نيسو, “

-- Insert '“' into word_verse_mapping for same verses as 'نيسو.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'نيسو.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'نيسو' WHERE pashto_word = 'نيسو.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'نيسو.“';

-- Ensure 'نيسو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نيسو', 0);
-- Add frequency to 'نيسو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'نيسو';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'درکړو.“' (2 occurrences) into: درکړو, “

-- Insert '“' into word_verse_mapping for same verses as 'درکړو.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'درکړو.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'درکړو' WHERE pashto_word = 'درکړو.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'درکړو.“';

-- Ensure 'درکړو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درکړو', 0);
-- Add frequency to 'درکړو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'درکړو';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'رسوم،“' (2 occurrences) into: رسوم, “

-- Insert '“' into word_verse_mapping for same verses as 'رسوم،“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'رسوم،“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'رسوم' WHERE pashto_word = 'رسوم،“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'رسوم،“';

-- Ensure 'رسوم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رسوم', 0);
-- Add frequency to 'رسوم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'رسوم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'واخلو.“' (2 occurrences) into: واخلو, “

-- Insert '“' into word_verse_mapping for same verses as 'واخلو.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'واخلو.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'واخلو' WHERE pashto_word = 'واخلو.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'واخلو.“';

-- Ensure 'واخلو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واخلو', 0);
-- Add frequency to 'واخلو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'واخلو';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'وسوزوم.“' (2 occurrences) into: وسوزوم, “

-- Insert '“' into word_verse_mapping for same verses as 'وسوزوم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وسوزوم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وسوزوم' WHERE pashto_word = 'وسوزوم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وسوزوم.“';

-- Ensure 'وسوزوم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسوزوم', 0);
-- Add frequency to 'وسوزوم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'وسوزوم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'خوروى.“' (2 occurrences) into: خوروى, “

-- Insert '“' into word_verse_mapping for same verses as 'خوروى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'خوروى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'خوروى' WHERE pashto_word = 'خوروى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'خوروى.“';

-- Ensure 'خوروى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوروى', 0);
-- Add frequency to 'خوروى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'خوروى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'پاک، دې' (2 occurrences) into: پاک, دې

-- Insert 'دې' into word_verse_mapping for same verses as 'پاک، دې'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'دې', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'پاک، دې'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'دې'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'پاک' WHERE pashto_word = 'پاک، دې';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'پاک، دې';

-- Ensure 'پاک' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پاک', 0);
-- Add frequency to 'پاک' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'پاک';
-- Ensure 'دې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دې', 0);
-- Add frequency to 'دې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'دې';

-- Split 'وجه، په' (2 occurrences) into: وجه, په

-- Insert 'په' into word_verse_mapping for same verses as 'وجه، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وجه، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وجه' WHERE pashto_word = 'وجه، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وجه، په';

-- Ensure 'وجه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وجه', 0);
-- Add frequency to 'وجه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'وجه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'اړول.“' (2 occurrences) into: اړول, “

-- Insert '“' into word_verse_mapping for same verses as 'اړول.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'اړول.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'اړول' WHERE pashto_word = 'اړول.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'اړول.“';

-- Ensure 'اړول' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اړول', 0);
-- Add frequency to 'اړول' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'اړول';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'وليدو. په' (2 occurrences) into: وليدو, په

-- Insert 'په' into word_verse_mapping for same verses as 'وليدو. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وليدو. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وليدو' WHERE pashto_word = 'وليدو. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وليدو. په';

-- Ensure 'وليدو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وليدو', 0);
-- Add frequency to 'وليدو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'وليدو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'درورسوم.“' (2 occurrences) into: درورسوم, “

-- Insert '“' into word_verse_mapping for same verses as 'درورسوم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'درورسوم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'درورسوم' WHERE pashto_word = 'درورسوم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'درورسوم.“';

-- Ensure 'درورسوم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درورسوم', 0);
-- Add frequency to 'درورسوم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'درورسوم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'ولګوم.“' (2 occurrences) into: ولګوم, “

-- Insert '“' into word_verse_mapping for same verses as 'ولګوم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ولګوم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ولګوم' WHERE pashto_word = 'ولګوم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ولګوم.“';

-- Ensure 'ولګوم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولګوم', 0);
-- Add frequency to 'ولګوم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ولګوم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'کړم.“ په' (2 occurrences) into: کړم, “, په

-- Insert '“' into word_verse_mapping for same verses as 'کړم.“ په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کړم.“ په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Insert 'په' into word_verse_mapping for same verses as 'کړم.“ په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کړم.“ په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کړم' WHERE pashto_word = 'کړم.“ په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کړم.“ په';

-- Ensure 'کړم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کړم', 0);
-- Add frequency to 'کړم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'کړم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'ولېږلو. په' (2 occurrences) into: ولېږلو, په

-- Insert 'په' into word_verse_mapping for same verses as 'ولېږلو. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ولېږلو. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ولېږلو' WHERE pashto_word = 'ولېږلو. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ولېږلو. په';

-- Ensure 'ولېږلو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولېږلو', 0);
-- Add frequency to 'ولېږلو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ولېږلو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'ايساريږى.“' (2 occurrences) into: ايساريږى, “

-- Insert '“' into word_verse_mapping for same verses as 'ايساريږى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ايساريږى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ايساريږى' WHERE pashto_word = 'ايساريږى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ايساريږى.“';

-- Ensure 'ايساريږى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ايساريږى', 0);
-- Add frequency to 'ايساريږى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ايساريږى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'کوم.“ په' (2 occurrences) into: کوم, “, په

-- Insert '“' into word_verse_mapping for same verses as 'کوم.“ په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کوم.“ په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Insert 'په' into word_verse_mapping for same verses as 'کوم.“ په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کوم.“ په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کوم' WHERE pashto_word = 'کوم.“ په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کوم.“ په';

-- Ensure 'کوم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوم', 0);
-- Add frequency to 'کوم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'کوم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'راولم، په' (2 occurrences) into: راولم, په

-- Insert 'په' into word_verse_mapping for same verses as 'راولم، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راولم، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راولم' WHERE pashto_word = 'راولم، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راولم، په';

-- Ensure 'راولم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راولم', 0);
-- Add frequency to 'راولم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'راولم';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'برېښيږى.“' (2 occurrences) into: برېښيږى, “

-- Insert '“' into word_verse_mapping for same verses as 'برېښيږى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'برېښيږى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'برېښيږى' WHERE pashto_word = 'برېښيږى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'برېښيږى.“';

-- Ensure 'برېښيږى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('برېښيږى', 0);
-- Add frequency to 'برېښيږى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'برېښيږى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'ولوستلو.“' (2 occurrences) into: ولوستلو, “

-- Insert '“' into word_verse_mapping for same verses as 'ولوستلو.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ولوستلو.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ولوستلو' WHERE pashto_word = 'ولوستلو.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ولوستلو.“';

-- Ensure 'ولوستلو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولوستلو', 0);
-- Add frequency to 'ولوستلو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ولوستلو';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'ولوله.“' (2 occurrences) into: ولوله, “

-- Insert '“' into word_verse_mapping for same verses as 'ولوله.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ولوله.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ولوله' WHERE pashto_word = 'ولوله.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ولوله.“';

-- Ensure 'ولوله' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولوله', 0);
-- Add frequency to 'ولوله' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'ولوله';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'وليکل.“' (2 occurrences) into: وليکل, “

-- Insert '“' into word_verse_mapping for same verses as 'وليکل.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وليکل.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وليکل' WHERE pashto_word = 'وليکل.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وليکل.“';

-- Ensure 'وليکل' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وليکل', 0);
-- Add frequency to 'وليکل' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'وليکل';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'وغواړه.“' (2 occurrences) into: وغواړه, “

-- Insert '“' into word_verse_mapping for same verses as 'وغواړه.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وغواړه.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وغواړه' WHERE pashto_word = 'وغواړه.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وغواړه.“';

-- Ensure 'وغواړه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغواړه', 0);
-- Add frequency to 'وغواړه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'وغواړه';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'کېږې.“' (2 occurrences) into: کېږې, “

-- Insert '“' into word_verse_mapping for same verses as 'کېږې.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کېږې.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کېږې' WHERE pashto_word = 'کېږې.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کېږې.“';

-- Ensure 'کېږې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېږې', 0);
-- Add frequency to 'کېږې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'کېږې';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'سلامت، دې' (2 occurrences) into: سلامت, دې

-- Insert 'دې' into word_verse_mapping for same verses as 'سلامت، دې'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'دې', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'سلامت، دې'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'دې'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'سلامت' WHERE pashto_word = 'سلامت، دې';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'سلامت، دې';

-- Ensure 'سلامت' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سلامت', 0);
-- Add frequency to 'سلامت' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'سلامت';
-- Ensure 'دې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دې', 0);
-- Add frequency to 'دې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'دې';

-- Split 'پرېښودلې.“' (2 occurrences) into: پرېښودلې, “

-- Insert '“' into word_verse_mapping for same verses as 'پرېښودلې.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'پرېښودلې.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'پرېښودلې' WHERE pashto_word = 'پرېښودلې.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'پرېښودلې.“';

-- Ensure 'پرېښودلې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېښودلې', 0);
-- Add frequency to 'پرېښودلې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'پرېښودلې';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'وسوزيږى.“' (2 occurrences) into: وسوزيږى, “

-- Insert '“' into word_verse_mapping for same verses as 'وسوزيږى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وسوزيږى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وسوزيږى' WHERE pashto_word = 'وسوزيږى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وسوزيږى.“';

-- Ensure 'وسوزيږى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسوزيږى', 0);
-- Add frequency to 'وسوزيږى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'وسوزيږى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'راوړُو.“' (2 occurrences) into: راوړُو, “

-- Insert '“' into word_verse_mapping for same verses as 'راوړُو.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راوړُو.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راوړُو' WHERE pashto_word = 'راوړُو.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راوړُو.“';

-- Ensure 'راوړُو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوړُو', 0);
-- Add frequency to 'راوړُو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'راوړُو';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'پټوم.“' (2 occurrences) into: پټوم, “

-- Insert '“' into word_verse_mapping for same verses as 'پټوم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'پټوم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'پټوم' WHERE pashto_word = 'پټوم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'پټوم.“';

-- Ensure 'پټوم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پټوم', 0);
-- Add frequency to 'پټوم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'پټوم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'کېدلوُ.“' (2 occurrences) into: کېدلوُ, “

-- Insert '“' into word_verse_mapping for same verses as 'کېدلوُ.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کېدلوُ.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کېدلوُ' WHERE pashto_word = 'کېدلوُ.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کېدلوُ.“';

-- Ensure 'کېدلوُ' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېدلوُ', 0);
-- Add frequency to 'کېدلوُ' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'کېدلوُ';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'راپرېوځى.“' (2 occurrences) into: راپرېوځى, “

-- Insert '“' into word_verse_mapping for same verses as 'راپرېوځى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راپرېوځى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راپرېوځى' WHERE pashto_word = 'راپرېوځى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راپرېوځى.“';

-- Ensure 'راپرېوځى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راپرېوځى', 0);
-- Add frequency to 'راپرېوځى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'راپرېوځى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'مخکښې، په' (2 occurrences) into: مخکښې, په

-- Insert 'په' into word_verse_mapping for same verses as 'مخکښې، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'مخکښې، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'مخکښې' WHERE pashto_word = 'مخکښې، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'مخکښې، په';

-- Ensure 'مخکښې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مخکښې', 0);
-- Add frequency to 'مخکښې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'مخکښې';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'وشرمېدو، په' (2 occurrences) into: وشرمېدو, په

-- Insert 'په' into word_verse_mapping for same verses as 'وشرمېدو، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وشرمېدو، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وشرمېدو' WHERE pashto_word = 'وشرمېدو، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وشرمېدو، په';

-- Ensure 'وشرمېدو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشرمېدو', 0);
-- Add frequency to 'وشرمېدو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'وشرمېدو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'اعلانوم.“' (2 occurrences) into: اعلانوم, “

-- Insert '“' into word_verse_mapping for same verses as 'اعلانوم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'اعلانوم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'اعلانوم' WHERE pashto_word = 'اعلانوم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'اعلانوم.“';

-- Ensure 'اعلانوم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اعلانوم', 0);
-- Add frequency to 'اعلانوم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'اعلانوم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'يمه.“' (2 occurrences) into: يمه, “

-- Insert '“' into word_verse_mapping for same verses as 'يمه.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'يمه.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'يمه' WHERE pashto_word = 'يمه.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'يمه.“';

-- Ensure 'يمه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يمه', 0);
-- Add frequency to 'يمه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'يمه';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = '“';

-- Split 'دشتو، په' (2 occurrences) into: دشتو, په

-- Insert 'په' into word_verse_mapping for same verses as 'دشتو، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'دشتو، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'دشتو' WHERE pashto_word = 'دشتو، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'دشتو، په';

-- Ensure 'دشتو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دشتو', 0);
-- Add frequency to 'دشتو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'دشتو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 2 WHERE pashto_word = 'په';

-- Split 'ووهى.“' (2 occurrences) into: ووهى, “

-- Insert '“' into word_verse_mapping for same verses as 'ووهى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ووهى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ووهى' WHERE pashto_word = 'ووهى.“';
