-- Enhance Verb Schema for LingDocs Integration
-- Adds columns for comprehensive verb classification

-- Verb classification
ALTER TABLE word_frequencies ADD COLUMN verb_type TEXT;
ALTER TABLE word_frequencies ADD COLUMN transitivity TEXT;
ALTER TABLE word_frequencies ADD COLUMN yul_ending INTEGER DEFAULT 0;
ALTER TABLE word_frequencies ADD COLUMN idiosyncratic_3sg_masc TEXT;

-- Complement info (for compounds)
ALTER TABLE word_frequencies ADD COLUMN complement_text TEXT;
ALTER TABLE word_frequencies ADD COLUMN aux_verb TEXT;

-- Note: These columns may already exist from previous migrations:
-- base_verb, imperfective_stem, perfective_stem, perfective_root, past_participle, word_type

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_word_frequencies_verb_type ON word_frequencies (verb_type);
CREATE INDEX IF NOT EXISTS idx_word_frequencies_transitivity ON word_frequencies (transitivity);
CREATE INDEX IF NOT EXISTS idx_word_frequencies_complement_text ON word_frequencies (complement_text);

