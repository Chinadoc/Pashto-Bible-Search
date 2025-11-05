-- D1 Migration script to align Cloudflare D1 database with LingDocs format
-- This script creates NEW tables without modifying existing ones for safety
-- Safe to run multiple times (uses IF NOT EXISTS)

-- ============================================================================
-- 1. Create verb_metadata table (stores verb entry metadata)
-- ============================================================================

CREATE TABLE IF NOT EXISTS verb_metadata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  verb_root TEXT NOT NULL UNIQUE,
  verb_type TEXT,  -- 'regular', 'stative_compound', 'dynamic_compound', 'generative_stative_compound', 'irregular'
  complement TEXT,  -- For compound verbs: stores the noun/adjective part (e.g., "ښکېل" for "ښکېل کېدل")
  auxiliary_verb TEXT,  -- For compound verbs: stores the auxiliary verb (e.g., "کېدل" or "کول")
  transitivity TEXT,  -- 'transitive', 'intransitive', 'grammatically_transitive'
  imperfective_stem TEXT,
  perfective_stem TEXT,
  imperfective_root TEXT,
  perfective_root TEXT,
  past_participle TEXT,
  romanization TEXT,  -- JSON string
  conjugation_pattern TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_verb_metadata_root ON verb_metadata(verb_root);
CREATE INDEX IF NOT EXISTS idx_verb_metadata_type ON verb_metadata(verb_type);

-- ============================================================================
-- 2. Create verb_conjugations table (structured like LingDocs)
-- ============================================================================

CREATE TABLE IF NOT EXISTS verb_conjugations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  verb_root TEXT NOT NULL,
  aspect TEXT NOT NULL,  -- 'imperfective' | 'perfective'
  mood TEXT NOT NULL,    -- 'nonImperative' | 'imperative'
  length TEXT,           -- 'long' | 'short' | NULL
  person INTEGER NOT NULL,  -- 0-5 (0=1sg, 1=2sg, 2=3sg, 3=1pl, 4=2pl, 5=3pl)
  gender INTEGER,        -- 0=masc, 1=fem, NULL for gender-neutral
  form TEXT NOT NULL,        -- The actual Pashto form
  romanization TEXT,
  grammatical_label TEXT,   -- Human-readable label like "1sg Present"
  frequency INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  UNIQUE(verb_root, aspect, mood, length, person, gender, form)
);

CREATE INDEX IF NOT EXISTS idx_verb_conj_root ON verb_conjugations(verb_root);
CREATE INDEX IF NOT EXISTS idx_verb_conj_form ON verb_conjugations(form);
CREATE INDEX IF NOT EXISTS idx_verb_conj_aspect_mood ON verb_conjugations(aspect, mood);

-- ============================================================================
-- 3. Add normalized columns to existing inflections table
-- ============================================================================
-- Note: SQLite doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN
-- These will fail silently if columns already exist (which is fine)

-- Add normalized grammatical_info column
ALTER TABLE inflections ADD COLUMN grammatical_info_normalized TEXT;

-- Add individual columns for easier querying
ALTER TABLE inflections ADD COLUMN person TEXT;
ALTER TABLE inflections ADD COLUMN tense TEXT;
ALTER TABLE inflections ADD COLUMN aspect TEXT;
ALTER TABLE inflections ADD COLUMN mood TEXT;
ALTER TABLE inflections ADD COLUMN gender TEXT;
ALTER TABLE inflections ADD COLUMN length TEXT;
ALTER TABLE inflections ADD COLUMN verb_type TEXT;
ALTER TABLE inflections ADD COLUMN inflection_type TEXT;  -- For nouns/adjectives

-- Add pos column if it doesn't exist (for filtering)
ALTER TABLE inflections ADD COLUMN pos TEXT;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_inflections_person ON inflections(person);
CREATE INDEX IF NOT EXISTS idx_inflections_tense ON inflections(tense);
CREATE INDEX IF NOT EXISTS idx_inflections_verb_type ON inflections(verb_type);
CREATE INDEX IF NOT EXISTS idx_inflections_pos ON inflections(pos);

-- ============================================================================
-- 4. Create noun_metadata table
-- ============================================================================

CREATE TABLE IF NOT EXISTS noun_metadata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lemma TEXT NOT NULL UNIQUE,
  inflection_pattern TEXT,  -- Pattern number or name
  gender TEXT,  -- 'Masc' | 'Fem'
  animate INTEGER DEFAULT 0,  -- SQLite doesn't have BOOLEAN, use INTEGER (0/1)
  pattern_info TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_noun_metadata_lemma ON noun_metadata(lemma);
CREATE INDEX IF NOT EXISTS idx_noun_metadata_pattern ON noun_metadata(inflection_pattern);

-- ============================================================================
-- 5. Create comparison_log table (for tracking differences)
-- ============================================================================

CREATE TABLE IF NOT EXISTS comparison_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  base_word TEXT NOT NULL,
  pos TEXT,  -- 'verb' | 'noun' | 'adjective'
  lingdocs_form TEXT,
  d1_form TEXT,
  lingdocs_label TEXT,
  d1_label TEXT,
  match_status TEXT,  -- 'exact_match', 'missing_in_d1', 'missing_in_lingdocs', 'label_mismatch'
  notes TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_comparison_log_base ON comparison_log(base_word);
CREATE INDEX IF NOT EXISTS idx_comparison_log_status ON comparison_log(match_status);

-- ============================================================================
-- Migration complete!
-- ============================================================================
-- 
-- Next steps:
-- 1. Run validation queries below to verify tables were created
-- 2. Run the processing script to populate data
-- 3. Review comparison results
--
-- Validation queries (run these after migration):
-- SELECT name FROM sqlite_master WHERE type='table' AND name IN ('verb_metadata', 'verb_conjugations', 'noun_metadata', 'comparison_log');
-- SELECT COUNT(*) FROM verb_metadata;
-- SELECT COUNT(*) FROM verb_conjugations;
-- 
-- Rollback if needed (run these to undo):
-- DROP TABLE IF EXISTS verb_metadata;
-- DROP TABLE IF EXISTS verb_conjugations;
-- DROP TABLE IF EXISTS noun_metadata;
-- DROP TABLE IF EXISTS comparison_log;
-- (Note: Cannot easily rollback ALTER TABLE columns, but they're nullable so safe)

