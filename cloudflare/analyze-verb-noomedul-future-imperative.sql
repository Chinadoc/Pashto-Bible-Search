-- Extended Verb Analysis: نومېدل - Future & Imperative Forms
-- Reference: https://grammar.lingdocs.com/verbs/future-verbs/
-- Reference: https://grammar.lingdocs.com/verbs/imperative-verbs/

-- Add word_type column if missing
ALTER TABLE word_frequencies ADD COLUMN word_type TEXT;


-- Create index
CREATE INDEX IF NOT EXISTS idx_word_frequencies_word_type ON word_frequencies (word_type);