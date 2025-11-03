-- Complete Verb Analysis: نومېدل - Perfect Forms & Negatives
-- Reference: https://grammar.lingdocs.com/verbs/perfect-verbs-intro/
-- Reference: https://grammar.lingdocs.com/verbs/all-perfect-verbs/
-- Reference: https://grammar.lingdocs.com/verbs/negatives/
-- Reference: https://grammar.lingdocs.com/phrase-structure/vp/

-- Add word_type column if missing
ALTER TABLE word_frequencies ADD COLUMN word_type TEXT;


-- Create index
CREATE INDEX IF NOT EXISTS idx_word_frequencies_word_type ON word_frequencies (word_type);