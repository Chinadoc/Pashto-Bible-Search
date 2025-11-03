-- Fix compound biblical names
-- These are names that appear as single words in Pashto but are compound
-- Example: اخى‌اب = Ahab (not اخى + اب as separate words)

-- Add word_type column if missing
ALTER TABLE word_frequencies ADD COLUMN word_type TEXT;

-- Add inflection_pattern column if missing
ALTER TABLE word_frequencies ADD COLUMN inflection_pattern TEXT;

-- Add inflection_label column if missing
ALTER TABLE word_frequencies ADD COLUMN inflection_label TEXT;

-- Add base_word column if missing
ALTER TABLE word_frequencies ADD COLUMN base_word TEXT;

-- Update compound biblical names
-- These compound names should be treated as single entries
-- اخى‌اب (Ahab) - compound of اخى + اب
INSERT OR IGNORE INTO word_frequencies (pashto_word, word_type, pos, romanization, has_issues, issue_flags)
VALUES ('اخى‌اب', 'proper_noun', 'n. prop.', 'Ahab', 0, '[]');

-- حنن‌ايل (Hananeel) - compound of حنن + ايل
INSERT OR IGNORE INTO word_frequencies (pashto_word, word_type, pos, romanization, has_issues, issue_flags)
VALUES ('حنن‌ايل', 'proper_noun', 'n. prop.', 'Hananeel', 0, '[]');

-- اِلى‌عالى (Elealeh) - compound of اِلى + عالى
INSERT OR IGNORE INTO word_frequencies (pashto_word, word_type, pos, romanization, has_issues, issue_flags)
VALUES ('اِلى‌عالى', 'proper_noun', 'n. prop.', 'Elealeh', 0, '[]');

-- شلتى‌اېل (Shealtiel) - compound of شلتى + اېل
INSERT OR IGNORE INTO word_frequencies (pashto_word, word_type, pos, romanization, has_issues, issue_flags)
VALUES ('شلتى‌اېل', 'proper_noun', 'n. prop.', 'Shealtiel', 0, '[]');

-- Note: If the individual parts (اخى, اب, etc.) exist, you may want to:
-- 1. Reduce their frequency counts by the compound frequency
-- 2. Add a note that they're part of a compound name
-- For now, we'll just ensure the compound entries exist

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_word_frequencies_word_type ON word_frequencies (word_type);
CREATE INDEX IF NOT EXISTS idx_word_frequencies_inflection_pattern ON word_frequencies (inflection_pattern);
CREATE INDEX IF NOT EXISTS idx_word_frequencies_inflection_label ON word_frequencies (inflection_label);
CREATE INDEX IF NOT EXISTS idx_word_frequencies_base_word ON word_frequencies (base_word);
