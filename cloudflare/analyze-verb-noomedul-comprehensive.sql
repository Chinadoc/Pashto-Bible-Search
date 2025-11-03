-- Comprehensive Verb Analysis: نومېدل (noomedul)
-- Verb type: Intransitive
-- Reference: https://grammar.lingdocs.com/verbs/

-- Add word_type column if missing
ALTER TABLE word_frequencies ADD COLUMN word_type TEXT;

-- Base verb: نومېدل
UPDATE word_frequencies SET word_type = 'verb', pos = 'v. intrans.', has_issues = 0 WHERE pashto_word = 'نومېدل';

-- PERFECT forms:
UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = 'نومېده';
UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = 'نومېده،';
UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = 'نومېده.';

-- NEGATIVE forms:
UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = 'نومونه یې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = 'نومونه دې';

-- OTHER forms:
UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = 'نومې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = 'نوم یې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = 'نومېدله';
UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = 'نوم دې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = 'نومېد';
UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = 'نوم مې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = 'نومېدله.';
UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = 'نومېدله،';
UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = 'نوموړې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = 'نومېدل.';


-- Create index
CREATE INDEX IF NOT EXISTS idx_word_frequencies_word_type ON word_frequencies (word_type);