-- Analyze verb: نومېدل (noomedul) - to be called (a name)
-- Verb type: Intransitive
-- Reference: https://grammar.lingdocs.com/verbs/

-- Add word_type column if missing
ALTER TABLE word_frequencies ADD COLUMN word_type TEXT;

-- Base verb: نومېدل
-- Update with verb information
UPDATE word_frequencies SET word_type = 'verb', pos = 'v. intrans.', has_issues = 0 WHERE pashto_word = 'نومېدل';


-- Create index
CREATE INDEX IF NOT EXISTS idx_word_frequencies_word_type ON word_frequencies (word_type);