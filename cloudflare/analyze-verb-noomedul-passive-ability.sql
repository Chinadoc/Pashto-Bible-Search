-- Verb Analysis: نومېدل - Passive Voice & Ability Forms
-- Reference: https://grammar.lingdocs.com/verbs/passive-voice/
-- Reference: https://grammar.lingdocs.com/verbs/ability/

-- Add word_type column if missing
ALTER TABLE word_frequencies ADD COLUMN word_type TEXT;


-- Create index
CREATE INDEX IF NOT EXISTS idx_word_frequencies_word_type ON word_frequencies (word_type);