-- Import Verb Stems/Roots from Dictionary to Word Frequencies
-- This adds base verb information (stems/roots) from dictionary to word_frequencies
-- Reference: https://grammar.lingdocs.com/verbs/master-chart/

-- Add columns if missing (ignore errors if they already exist)
-- Note: SQLite doesn't support IF NOT EXISTS for ALTER TABLE, so we'll use a different approach
-- We'll try to add them, and if they exist, the UPDATE statements will still work

-- First, let's add the columns one by one (will fail silently if they exist)
-- base_verb TEXT;
-- imperfective_stem TEXT;
-- perfective_stem TEXT;
-- perfective_root TEXT;
-- past_participle TEXT;
-- word_type already exists

-- Now update the verbs

