
-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شړى.“';

-- Ensure 'شړى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شړى', 0);
-- Add frequency to 'شړى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'شړى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'غواړې.“' (5 occurrences) into: غواړې, “

-- Insert '“' into word_verse_mapping for same verses as 'غواړې.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'غواړې.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'غواړې' WHERE pashto_word = 'غواړې.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'غواړې.“';

-- Ensure 'غواړې' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غواړې', 0);
-- Add frequency to 'غواړې' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'غواړې';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'سره، په' (5 occurrences) into: سره, په

-- Insert 'په' into word_verse_mapping for same verses as 'سره، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'سره، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'سره' WHERE pashto_word = 'سره، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'سره، په';

-- Ensure 'سره' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سره', 0);
-- Add frequency to 'سره' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'سره';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'په';

-- Split 'وهى.“' (5 occurrences) into: وهى, “

-- Insert '“' into word_verse_mapping for same verses as 'وهى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وهى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وهى' WHERE pashto_word = 'وهى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وهى.“';

-- Ensure 'وهى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وهى', 0);
-- Add frequency to 'وهى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'وهى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'راکوى.“' (5 occurrences) into: راکوى, “

-- Insert '“' into word_verse_mapping for same verses as 'راکوى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راکوى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راکوى' WHERE pashto_word = 'راکوى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راکوى.“';

-- Ensure 'راکوى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکوى', 0);
-- Add frequency to 'راکوى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'راکوى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'اخلم.“' (5 occurrences) into: اخلم, “

-- Insert '“' into word_verse_mapping for same verses as 'اخلم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'اخلم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'اخلم' WHERE pashto_word = 'اخلم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'اخلم.“';

-- Ensure 'اخلم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخلم', 0);
-- Add frequency to 'اخلم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'اخلم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'کړو. په' (5 occurrences) into: کړو, په

-- Insert 'په' into word_verse_mapping for same verses as 'کړو. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کړو. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کړو' WHERE pashto_word = 'کړو. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کړو. په';

-- Ensure 'کړو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کړو', 0);
-- Add frequency to 'کړو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'کړو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'په';

-- Split 'ولېږم.“' (5 occurrences) into: ولېږم, “

-- Insert '“' into word_verse_mapping for same verses as 'ولېږم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ولېږم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ولېږم' WHERE pashto_word = 'ولېږم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ولېږم.“';

-- Ensure 'ولېږم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولېږم', 0);
-- Add frequency to 'ولېږم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'ولېږم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'اوره. په' (5 occurrences) into: اوره, په

-- Insert 'په' into word_verse_mapping for same verses as 'اوره. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'اوره. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'اوره' WHERE pashto_word = 'اوره. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'اوره. په';

-- Ensure 'اوره' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوره', 0);
-- Add frequency to 'اوره' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'اوره';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'په';

-- Split 'مُنافقانو، په' (5 occurrences) into: مُنافقانو, په

-- Insert 'په' into word_verse_mapping for same verses as 'مُنافقانو، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'مُنافقانو، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'مُنافقانو' WHERE pashto_word = 'مُنافقانو، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'مُنافقانو، په';

-- Ensure 'مُنافقانو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مُنافقانو', 0);
-- Add frequency to 'مُنافقانو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'مُنافقانو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'په';

-- Split 'کیږی، په' (5 occurrences) into: کیږی, په

-- Insert 'په' into word_verse_mapping for same verses as 'کیږی، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کیږی، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کیږی' WHERE pashto_word = 'کیږی، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کیږی، په';

-- Ensure 'کیږی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کیږی', 0);
-- Add frequency to 'کیږی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'کیږی';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'په';

-- Split 'شی،“' (5 occurrences) into: شی, “

-- Insert '“' into word_verse_mapping for same verses as 'شی،“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شی،“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شی' WHERE pashto_word = 'شی،“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شی،“';

-- Ensure 'شی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شی', 0);
-- Add frequency to 'شی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'شی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'يی،“' (5 occurrences) into: يی, “

-- Insert '“' into word_verse_mapping for same verses as 'يی،“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'يی،“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'يی' WHERE pashto_word = 'يی،“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'يی،“';

-- Ensure 'يی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يی', 0);
-- Add frequency to 'يی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'يی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'کړی،“' (5 occurrences) into: کړی, “

-- Insert '“' into word_verse_mapping for same verses as 'کړی،“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کړی،“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کړی' WHERE pashto_word = 'کړی،“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کړی،“';

-- Ensure 'کړی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کړی', 0);
-- Add frequency to 'کړی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'کړی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'يرېږی.“' (5 occurrences) into: يرېږی, “

-- Insert '“' into word_verse_mapping for same verses as 'يرېږی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'يرېږی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'يرېږی' WHERE pashto_word = 'يرېږی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'يرېږی.“';

-- Ensure 'يرېږی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يرېږی', 0);
-- Add frequency to 'يرېږی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'يرېږی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'کښېنی.“' (5 occurrences) into: کښېنی, “

-- Insert '“' into word_verse_mapping for same verses as 'کښېنی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کښېنی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کښېنی' WHERE pashto_word = 'کښېنی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کښېنی.“';

-- Ensure 'کښېنی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کښېنی', 0);
-- Add frequency to 'کښېنی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'کښېنی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'ووژنی.“' (5 occurrences) into: ووژنی, “

-- Insert '“' into word_verse_mapping for same verses as 'ووژنی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ووژنی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ووژنی' WHERE pashto_word = 'ووژنی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ووژنی.“';

-- Ensure 'ووژنی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووژنی', 0);
-- Add frequency to 'ووژنی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'ووژنی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'ورکوی.“' (5 occurrences) into: ورکوی, “

-- Insert '“' into word_verse_mapping for same verses as 'ورکوی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ورکوی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ورکوی' WHERE pashto_word = 'ورکوی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ورکوی.“';

-- Ensure 'ورکوی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکوی', 0);
-- Add frequency to 'ورکوی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'ورکوی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'وايی.“' (5 occurrences) into: وايی, “

-- Insert '“' into word_verse_mapping for same verses as 'وايی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وايی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وايی' WHERE pashto_word = 'وايی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وايی.“';

-- Ensure 'وايی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وايی', 0);
-- Add frequency to 'وايی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'وايی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'واوری.“' (5 occurrences) into: واوری, “

-- Insert '“' into word_verse_mapping for same verses as 'واوری.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'واوری.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'واوری' WHERE pashto_word = 'واوری.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'واوری.“';

-- Ensure 'واوری' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واوری', 0);
-- Add frequency to 'واوری' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'واوری';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'پایى.“' (5 occurrences) into: پایى, “

-- Insert '“' into word_verse_mapping for same verses as 'پایى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'پایى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'پایى' WHERE pashto_word = 'پایى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'پایى.“';

-- Ensure 'پایى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پایى', 0);
-- Add frequency to 'پایى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = 'پایى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 5 WHERE pashto_word = '“';

-- Split 'خدایه! په' (4 occurrences) into: خدایه, په

-- Insert 'په' into word_verse_mapping for same verses as 'خدایه! په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'خدایه! په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'خدایه' WHERE pashto_word = 'خدایه! په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'خدایه! په';

-- Ensure 'خدایه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خدایه', 0);
-- Add frequency to 'خدایه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'خدایه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'په';

-- Split 'وکړه. په' (4 occurrences) into: وکړه, په

-- Insert 'په' into word_verse_mapping for same verses as 'وکړه. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وکړه. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وکړه' WHERE pashto_word = 'وکړه. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وکړه. په';

-- Ensure 'وکړه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکړه', 0);
-- Add frequency to 'وکړه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'وکړه';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'په';

-- Split 'دوستانو، په' (4 occurrences) into: دوستانو, په

-- Insert 'په' into word_verse_mapping for same verses as 'دوستانو، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'دوستانو، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'دوستانو' WHERE pashto_word = 'دوستانو، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'دوستانو، په';

-- Ensure 'دوستانو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دوستانو', 0);
-- Add frequency to 'دوستانو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'دوستانو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'په';

-- Split 'خدایه! ته' (4 occurrences) into: خدایه, ته

-- Insert 'ته' into word_verse_mapping for same verses as 'خدایه! ته'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'ته', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'خدایه! ته'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'ته'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'خدایه' WHERE pashto_word = 'خدایه! ته';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'خدایه! ته';

-- Ensure 'خدایه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خدایه', 0);
-- Add frequency to 'خدایه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'خدایه';
-- Ensure 'ته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 0);
-- Add frequency to 'ته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'ته';

-- Split 'کېدل. په' (4 occurrences) into: کېدل, په

-- Insert 'په' into word_verse_mapping for same verses as 'کېدل. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کېدل. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کېدل' WHERE pashto_word = 'کېدل. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کېدل. په';

-- Ensure 'کېدل' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېدل', 0);
-- Add frequency to 'کېدل' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'کېدل';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'په';

-- Split 'ورکړم، په' (4 occurrences) into: ورکړم, په

-- Insert 'په' into word_verse_mapping for same verses as 'ورکړم، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ورکړم، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ورکړم' WHERE pashto_word = 'ورکړم، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړم، په';

-- Ensure 'ورکړم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکړم', 0);
-- Add frequency to 'ورکړم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'ورکړم';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'په';

-- Split 'کړم، په' (4 occurrences) into: کړم, په

-- Insert 'په' into word_verse_mapping for same verses as 'کړم، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کړم، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کړم' WHERE pashto_word = 'کړم، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کړم، په';

-- Ensure 'کړم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کړم', 0);
-- Add frequency to 'کړم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'کړم';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'په';

-- Split 'پرېږده.“' (4 occurrences) into: پرېږده, “

-- Insert '“' into word_verse_mapping for same verses as 'پرېږده.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'پرېږده.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'پرېږده' WHERE pashto_word = 'پرېږده.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'پرېږده.“';

-- Ensure 'پرېږده' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېږده', 0);
-- Add frequency to 'پرېږده' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'پرېږده';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'راولېږى.“' (4 occurrences) into: راولېږى, “

-- Insert '“' into word_verse_mapping for same verses as 'راولېږى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راولېږى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راولېږى' WHERE pashto_word = 'راولېږى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راولېږى.“';

-- Ensure 'راولېږى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راولېږى', 0);
-- Add frequency to 'راولېږى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'راولېږى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'بليږى.“' (4 occurrences) into: بليږى, “

-- Insert '“' into word_verse_mapping for same verses as 'بليږى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'بليږى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'بليږى' WHERE pashto_word = 'بليږى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'بليږى.“';

-- Ensure 'بليږى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بليږى', 0);
-- Add frequency to 'بليږى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'بليږى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'اخلى.“' (4 occurrences) into: اخلى, “

-- Insert '“' into word_verse_mapping for same verses as 'اخلى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'اخلى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'اخلى' WHERE pashto_word = 'اخلى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'اخلى.“';

-- Ensure 'اخلى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخلى', 0);
-- Add frequency to 'اخلى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'اخلى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'کېږم.“' (4 occurrences) into: کېږم, “

-- Insert '“' into word_verse_mapping for same verses as 'کېږم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کېږم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کېږم' WHERE pashto_word = 'کېږم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کېږم.“';

-- Ensure 'کېږم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېږم', 0);
-- Add frequency to 'کېږم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'کېږم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'راوباسه.“' (4 occurrences) into: راوباسه, “

-- Insert '“' into word_verse_mapping for same verses as 'راوباسه.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راوباسه.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راوباسه' WHERE pashto_word = 'راوباسه.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راوباسه.“';

-- Ensure 'راوباسه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوباسه', 0);
-- Add frequency to 'راوباسه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'راوباسه';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'ګرځى.“' (4 occurrences) into: ګرځى, “

-- Insert '“' into word_verse_mapping for same verses as 'ګرځى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ګرځى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ګرځى' WHERE pashto_word = 'ګرځى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ګرځى.“';

-- Ensure 'ګرځى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګرځى', 0);
-- Add frequency to 'ګرځى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'ګرځى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'ورکوم،“' (4 occurrences) into: ورکوم, “

-- Insert '“' into word_verse_mapping for same verses as 'ورکوم،“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ورکوم،“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ورکوم' WHERE pashto_word = 'ورکوم،“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ورکوم،“';

-- Ensure 'ورکوم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکوم', 0);
-- Add frequency to 'ورکوم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'ورکوم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'جوړوى.“' (4 occurrences) into: جوړوى, “

-- Insert '“' into word_verse_mapping for same verses as 'جوړوى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'جوړوى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'جوړوى' WHERE pashto_word = 'جوړوى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'جوړوى.“';

-- Ensure 'جوړوى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جوړوى', 0);
-- Add frequency to 'جوړوى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'جوړوى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'راګرځېدم.“' (4 occurrences) into: راګرځېدم, “

-- Insert '“' into word_verse_mapping for same verses as 'راګرځېدم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راګرځېدم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راګرځېدم' WHERE pashto_word = 'راګرځېدم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راګرځېدم.“';

-- Ensure 'راګرځېدم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راګرځېدم', 0);
-- Add frequency to 'راګرځېدم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'راګرځېدم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'پاک، په' (4 occurrences) into: پاک, په

-- Insert 'په' into word_verse_mapping for same verses as 'پاک، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'پاک، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'پاک' WHERE pashto_word = 'پاک، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'پاک، په';

-- Ensure 'پاک' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پاک', 0);
-- Add frequency to 'پاک' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'پاک';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'په';

-- Split 'وليدله.“' (4 occurrences) into: وليدله, “

-- Insert '“' into word_verse_mapping for same verses as 'وليدله.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وليدله.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وليدله' WHERE pashto_word = 'وليدله.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وليدله.“';

-- Ensure 'وليدله' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وليدله', 0);
-- Add frequency to 'وليدله' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'وليدله';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'اوسيږو.“' (4 occurrences) into: اوسيږو, “

-- Insert '“' into word_verse_mapping for same verses as 'اوسيږو.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'اوسيږو.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'اوسيږو' WHERE pashto_word = 'اوسيږو.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'اوسيږو.“';

-- Ensure 'اوسيږو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسيږو', 0);
-- Add frequency to 'اوسيږو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'اوسيږو';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'دينه.“' (4 occurrences) into: دينه, “

-- Insert '“' into word_verse_mapping for same verses as 'دينه.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'دينه.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'دينه' WHERE pashto_word = 'دينه.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'دينه.“';

-- Ensure 'دينه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دينه', 0);
-- Add frequency to 'دينه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'دينه';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'مالِکه،“' (4 occurrences) into: مالِکه, “

-- Insert '“' into word_verse_mapping for same verses as 'مالِکه،“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'مالِکه،“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'مالِکه' WHERE pashto_word = 'مالِکه،“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'مالِکه،“';

-- Ensure 'مالِکه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مالِکه', 0);
-- Add frequency to 'مالِکه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'مالِکه';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'لرى.“' (4 occurrences) into: لرى, “

-- Insert '“' into word_verse_mapping for same verses as 'لرى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'لرى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'لرى' WHERE pashto_word = 'لرى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'لرى.“';

-- Ensure 'لرى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لرى', 0);
-- Add frequency to 'لرى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'لرى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'واخلى.“' (4 occurrences) into: واخلى, “

-- Insert '“' into word_verse_mapping for same verses as 'واخلى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'واخلى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'واخلى' WHERE pashto_word = 'واخلى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'واخلى.“';

-- Ensure 'واخلى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واخلى', 0);
-- Add frequency to 'واخلى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'واخلى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'وګوره.“' (4 occurrences) into: وګوره, “

-- Insert '“' into word_verse_mapping for same verses as 'وګوره.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وګوره.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وګوره' WHERE pashto_word = 'وګوره.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وګوره.“';

-- Ensure 'وګوره' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګوره', 0);
-- Add frequency to 'وګوره' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'وګوره';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'ولېږه.“' (4 occurrences) into: ولېږه, “

-- Insert '“' into word_verse_mapping for same verses as 'ولېږه.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ولېږه.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ولېږه' WHERE pashto_word = 'ولېږه.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ولېږه.“';

-- Ensure 'ولېږه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولېږه', 0);
-- Add frequency to 'ولېږه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'ولېږه';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'زويه.“' (4 occurrences) into: زويه, “

-- Insert '“' into word_verse_mapping for same verses as 'زويه.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'زويه.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'زويه' WHERE pashto_word = 'زويه.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'زويه.“';

-- Ensure 'زويه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زويه', 0);
-- Add frequency to 'زويه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'زويه';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'ووايم.“' (4 occurrences) into: ووايم, “

-- Insert '“' into word_verse_mapping for same verses as 'ووايم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ووايم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ووايم' WHERE pashto_word = 'ووايم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ووايم.“';

-- Ensure 'ووايم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووايم', 0);
-- Add frequency to 'ووايم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'ووايم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'راولم.“' (4 occurrences) into: راولم, “

-- Insert '“' into word_verse_mapping for same verses as 'راولم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راولم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راولم' WHERE pashto_word = 'راولم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راولم.“';

-- Ensure 'راولم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راولم', 0);
-- Add frequency to 'راولم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'راولم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'کېږده.“' (4 occurrences) into: کېږده, “

-- Insert '“' into word_verse_mapping for same verses as 'کېږده.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کېږده.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کېږده' WHERE pashto_word = 'کېږده.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کېږده.“';

-- Ensure 'کېږده' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېږده', 0);
-- Add frequency to 'کېږده' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'کېږده';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'وسوزوى. په' (4 occurrences) into: وسوزوى, په

-- Insert 'په' into word_verse_mapping for same verses as 'وسوزوى. په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وسوزوى. په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وسوزوى' WHERE pashto_word = 'وسوزوى. په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وسوزوى. په';

-- Ensure 'وسوزوى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسوزوى', 0);
-- Add frequency to 'وسوزوى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'وسوزوى';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'په';

-- Split 'اوسېږم.“' (4 occurrences) into: اوسېږم, “

-- Insert '“' into word_verse_mapping for same verses as 'اوسېږم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'اوسېږم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'اوسېږم' WHERE pashto_word = 'اوسېږم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېږم.“';

-- Ensure 'اوسېږم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسېږم', 0);
-- Add frequency to 'اوسېږم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'اوسېږم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'کړو، په' (4 occurrences) into: کړو, په

-- Insert 'په' into word_verse_mapping for same verses as 'کړو، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کړو، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کړو' WHERE pashto_word = 'کړو، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کړو، په';

-- Ensure 'کړو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کړو', 0);
-- Add frequency to 'کړو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'کړو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'په';

-- Split 'شه،“' (4 occurrences) into: شه, “

-- Insert '“' into word_verse_mapping for same verses as 'شه،“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شه،“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شه' WHERE pashto_word = 'شه،“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شه،“';

-- Ensure 'شه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شه', 0);
-- Add frequency to 'شه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'شه';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'غواړُو.“' (4 occurrences) into: غواړُو, “

-- Insert '“' into word_verse_mapping for same verses as 'غواړُو.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'غواړُو.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'غواړُو' WHERE pashto_word = 'غواړُو.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'غواړُو.“';

-- Ensure 'غواړُو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غواړُو', 0);
-- Add frequency to 'غواړُو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'غواړُو';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'وخوره.“' (4 occurrences) into: وخوره, “

-- Insert '“' into word_verse_mapping for same verses as 'وخوره.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وخوره.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وخوره' WHERE pashto_word = 'وخوره.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وخوره.“';

-- Ensure 'وخوره' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخوره', 0);
-- Add frequency to 'وخوره' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'وخوره';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'وکړل.“' (4 occurrences) into: وکړل, “

-- Insert '“' into word_verse_mapping for same verses as 'وکړل.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وکړل.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وکړل' WHERE pashto_word = 'وکړل.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وکړل.“';

-- Ensure 'وکړل' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکړل', 0);
-- Add frequency to 'وکړل' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'وکړل';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'يوسم.“' (4 occurrences) into: يوسم, “

-- Insert '“' into word_verse_mapping for same verses as 'يوسم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'يوسم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'يوسم' WHERE pashto_word = 'يوسم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'يوسم.“';

-- Ensure 'يوسم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يوسم', 0);
-- Add frequency to 'يوسم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'يوسم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'کښېنى.“' (4 occurrences) into: کښېنى, “

-- Insert '“' into word_verse_mapping for same verses as 'کښېنى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'کښېنى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'کښېنى' WHERE pashto_word = 'کښېنى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'کښېنى.“';

-- Ensure 'کښېنى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کښېنى', 0);
-- Add frequency to 'کښېنى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'کښېنى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'وينى.“' (4 occurrences) into: وينى, “

-- Insert '“' into word_verse_mapping for same verses as 'وينى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وينى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وينى' WHERE pashto_word = 'وينى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وينى.“';

-- Ensure 'وينى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وينى', 0);
-- Add frequency to 'وينى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'وينى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'ومومى.“' (4 occurrences) into: ومومى, “

-- Insert '“' into word_verse_mapping for same verses as 'ومومى.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ومومى.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ومومى' WHERE pashto_word = 'ومومى.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ومومى.“';

-- Ensure 'ومومى' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ومومى', 0);
-- Add frequency to 'ومومى' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'ومومى';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'شوم.“' (4 occurrences) into: شوم, “

-- Insert '“' into word_verse_mapping for same verses as 'شوم.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شوم.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شوم' WHERE pashto_word = 'شوم.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شوم.“';

-- Ensure 'شوم' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شوم', 0);
-- Add frequency to 'شوم' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'شوم';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'یو، په' (4 occurrences) into: یو, په

-- Insert 'په' into word_verse_mapping for same verses as 'یو، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'یو، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'یو' WHERE pashto_word = 'یو، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'یو، په';

-- Ensure 'یو' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یو', 0);
-- Add frequency to 'یو' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'یو';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'په';

-- Split 'څښتنه! ته' (4 occurrences) into: څښتنه, ته

-- Insert 'ته' into word_verse_mapping for same verses as 'څښتنه! ته'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'ته', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'څښتنه! ته'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'ته'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'څښتنه' WHERE pashto_word = 'څښتنه! ته';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'څښتنه! ته';

-- Ensure 'څښتنه' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څښتنه', 0);
-- Add frequency to 'څښتنه' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'څښتنه';
-- Ensure 'ته' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 0);
-- Add frequency to 'ته' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'ته';

-- Split 'ونیسی، په' (4 occurrences) into: ونیسی, په

-- Insert 'په' into word_verse_mapping for same verses as 'ونیسی، په'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT 'په', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ونیسی، په'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = 'په'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ونیسی' WHERE pashto_word = 'ونیسی، په';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ونیسی، په';

-- Ensure 'ونیسی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونیسی', 0);
-- Add frequency to 'ونیسی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'ونیسی';
-- Ensure 'په' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('په', 0);
-- Add frequency to 'په' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'په';

-- Split 'اوسېږی.“' (4 occurrences) into: اوسېږی, “

-- Insert '“' into word_verse_mapping for same verses as 'اوسېږی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'اوسېږی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'اوسېږی' WHERE pashto_word = 'اوسېږی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېږی.“';

-- Ensure 'اوسېږی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسېږی', 0);
-- Add frequency to 'اوسېږی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'اوسېږی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'ولېږی.“' (4 occurrences) into: ولېږی, “

-- Insert '“' into word_verse_mapping for same verses as 'ولېږی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'ولېږی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'ولېږی' WHERE pashto_word = 'ولېږی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'ولېږی.“';

-- Ensure 'ولېږی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولېږی', 0);
-- Add frequency to 'ولېږی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'ولېږی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'وساتی.“' (4 occurrences) into: وساتی, “

-- Insert '“' into word_verse_mapping for same verses as 'وساتی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'وساتی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'وساتی' WHERE pashto_word = 'وساتی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'وساتی.“';

-- Ensure 'وساتی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وساتی', 0);
-- Add frequency to 'وساتی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'وساتی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'پرېږدی.“' (4 occurrences) into: پرېږدی, “

-- Insert '“' into word_verse_mapping for same verses as 'پرېږدی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'پرېږدی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'پرېږدی' WHERE pashto_word = 'پرېږدی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'پرېږدی.“';

-- Ensure 'پرېږدی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېږدی', 0);
-- Add frequency to 'پرېږدی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'پرېږدی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'شوی.“' (4 occurrences) into: شوی, “

-- Insert '“' into word_verse_mapping for same verses as 'شوی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'شوی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'شوی' WHERE pashto_word = 'شوی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'شوی.“';

-- Ensure 'شوی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شوی', 0);
-- Add frequency to 'شوی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'شوی';
-- Ensure '“' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('“', 0);
-- Add frequency to '“' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = '“';

-- Split 'راتلی.“' (4 occurrences) into: راتلی, “

-- Insert '“' into word_verse_mapping for same verses as 'راتلی.“'
INSERT INTO word_verse_mapping (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form)
SELECT '“', verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, base_form
FROM word_verse_mapping
WHERE pashto_word = 'راتلی.“'
  AND NOT EXISTS (
    SELECT 1 FROM word_verse_mapping wvm2
    WHERE wvm2.pashto_word = '“'
      AND wvm2.verse_id = word_verse_mapping.verse_id
  );

-- Step 2: Update original to first part
UPDATE word_verse_mapping SET pashto_word = 'راتلی' WHERE pashto_word = 'راتلی.“';

-- Delete original combined word from word_frequencies
DELETE FROM word_frequencies WHERE pashto_word = 'راتلی.“';

-- Ensure 'راتلی' exists in word_frequencies
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راتلی', 0);
-- Add frequency to 'راتلی' (each part appears in all verses where original appeared)
UPDATE word_frequencies SET frequency_total = frequency_total + 4 WHERE pashto_word = 'راتلی';
