-- Fix compound biblical names: update to proper_noun and delete parts
-- This fixes issues where compound forms exist but are misclassified,
-- and ensures parts are deleted as they should be

-- Step 1: Update compound forms to proper_noun (they're currently misclassified as verbs)
UPDATE word_frequencies 
SET word_type = 'proper_noun', 
    pos = 'n. prop.',
    has_issues = 0,
    issue_flags = '[]'
WHERE pashto_word IN ('اخى‌اب', 'حنن‌ايل', 'حنم‌ايل', 'بيت‌ايل', 'اِلى‌عالى', 'شلتى‌اېل', 'اِفتاح‌اېل', 'بتو‌اېل')
  AND word_type != 'proper_noun';

-- Set romanization for compound forms
UPDATE word_frequencies SET romanization = 'Ahab' WHERE pashto_word = 'اخى‌اب' AND romanization IS NULL;
UPDATE word_frequencies SET romanization = 'Elealeh' WHERE pashto_word = 'اِلى‌عالى' AND romanization IS NULL;
UPDATE word_frequencies SET romanization = 'Bethel' WHERE pashto_word = 'بيت‌ايل' AND romanization IS NULL;
UPDATE word_frequencies SET romanization = 'Hananeel' WHERE pashto_word = 'حنم‌ايل' AND romanization IS NULL;
UPDATE word_frequencies SET romanization = 'Hananeel' WHERE pashto_word = 'حنن‌ايل' AND romanization IS NULL;
UPDATE word_frequencies SET romanization = 'Shealtiel' WHERE pashto_word = 'شلتى‌اېل' AND romanization IS NULL;
UPDATE word_frequencies SET romanization = 'Ithiel' WHERE pashto_word = 'اِفتاح‌اېل' AND romanization IS NULL;
UPDATE word_frequencies SET romanization = 'Bethel' WHERE pashto_word = 'بتو‌اېل' AND romanization IS NULL;

-- Step 2: Delete parts from word_verse_mapping first (to avoid orphaned references)
DELETE FROM word_verse_mapping WHERE pashto_word IN ('اخى', 'ايل', 'اِلى', 'اېل', 'اِفتاح', 'بتو');

-- Step 3: Delete parts from word_frequencies
-- ايل is part of: حنن‌ايل, حنم‌ايل, بيت‌ايل
DELETE FROM word_frequencies WHERE pashto_word = 'ايل';

-- اخى is part of: اخى‌اب
DELETE FROM word_frequencies WHERE pashto_word = 'اخى';

-- اِلى is part of: اِلى‌عالى
DELETE FROM word_frequencies WHERE pashto_word = 'اِلى';

-- اېل is part of: شلتى‌اېل
DELETE FROM word_frequencies WHERE pashto_word = 'اېل';

-- اِفتاح is part of: اِفتاح‌اېل
DELETE FROM word_frequencies WHERE pashto_word = 'اِفتاح';

-- بتو is part of: بتو‌اېل
DELETE FROM word_frequencies WHERE pashto_word = 'بتو';

-- Note: اب is kept because it appears in verb phrases ("اب ورکړ") and is not exclusively a compound name part
-- Note: عزر is kept because it doesn't appear to be part of a compound name

