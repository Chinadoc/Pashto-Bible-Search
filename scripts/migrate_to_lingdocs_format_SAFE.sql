-- SAFE Migration script to align D1 database with LingDocs format
-- This version includes safety checks and handles both D1 and Supabase schemas
-- 
-- BEFORE RUNNING:
-- 1. Backup your database
-- 2. Test on a development copy first
-- 3. Review the output of PRAGMA commands below

-- ============================================================================
-- 0. Pre-flight checks - Run these first and review output
-- ============================================================================

-- Check current inflections table structure
PRAGMA table_info(inflections);

-- Check current verbs_lexicon table structure
PRAGMA table_info(verbs_lexicon);

-- Sample existing data to verify column names
SELECT * FROM inflections LIMIT 1;
SELECT * FROM verbs_lexicon LIMIT 1;

-- ============================================================================
-- 1. Determine schema type and add verb metadata columns
-- ============================================================================

-- For D1 schema (has 'infinitive' column):
-- ALTER TABLE verbs_lexicon ADD COLUMN verb_type TEXT;
-- ALTER TABLE verbs_lexicon ADD COLUMN complement TEXT;
-- ALTER TABLE verbs_lexicon ADD COLUMN auxiliary_verb TEXT;
-- ALTER TABLE verbs_lexicon ADD COLUMN transitivity TEXT;

-- For Supabase schema (has 'verb_root' column):
-- Columns may already exist, so we create a new table approach

-- Create new verb_metadata table (works for both schemas)
CREATE TABLE IF NOT EXISTS verb_metadata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  verb_root TEXT NOT NULL UNIQUE,
  verb_type TEXT,  -- 'regular', 'stative_compound', 'dynamic_compound', etc.
  complement TEXT,  -- For compound verbs
  auxiliary_verb TEXT,  -- For compound verbs
  transitivity TEXT,
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
-- 3. Create inflections_normalized table (new table to avoid conflicts)
-- ============================================================================
-- Instead of altering existing inflections table, create a new one
-- This preserves existing data and allows gradual migration

CREATE TABLE IF NOT EXISTS inflections_normalized (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  base_word TEXT NOT NULL,  -- Standardized column name
  inflected_form TEXT NOT NULL,
  grammatical_info TEXT,  -- Original grammatical info (for reference)
  grammatical_info_normalized TEXT,  -- Standardized JSON
  person TEXT,
  tense TEXT,
  aspect TEXT,
  mood TEXT,
  gender TEXT,
  length TEXT,
  verb_type TEXT,
  inflection_type TEXT,  -- For nouns/adjectives
  pos TEXT,  -- 'verb', 'noun', 'adjective'
  frequency INTEGER DEFAULT 0,
  romanization TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  UNIQUE(base_word, inflected_form, pos)
);

CREATE INDEX IF NOT EXISTS idx_inflections_norm_base ON inflections_normalized(base_word);
CREATE INDEX IF NOT EXISTS idx_inflections_norm_form ON inflections_normalized(inflected_form);
CREATE INDEX IF NOT EXISTS idx_inflections_norm_person ON inflections_normalized(person);
CREATE INDEX IF NOT EXISTS idx_inflections_norm_tense ON inflections_normalized(tense);
CREATE INDEX IF NOT EXISTS idx_inflections_norm_verb_type ON inflections_normalized(verb_type);
CREATE INDEX IF NOT EXISTS idx_inflections_norm_pos ON inflections_normalized(pos);

-- ============================================================================
-- 4. Create noun_metadata table
-- ============================================================================

CREATE TABLE IF NOT EXISTS noun_metadata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lemma TEXT NOT NULL UNIQUE,
  inflection_pattern TEXT,  -- Pattern number or name
  gender TEXT,  -- 'Masc' | 'Fem'
  animate BOOLEAN,
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
-- 6. Migration helper views (optional - for data migration)
-- ============================================================================

-- View to map existing inflections to normalized format
CREATE VIEW IF NOT EXISTS v_inflections_migration AS
SELECT 
  id,
  COALESCE(base_word, base_form) as base_word,  -- Handle both column names
  inflected_form,
  grammatical_info,
  pos,
  created_at
FROM inflections;

-- ============================================================================
-- 7. Post-migration validation queries
-- ============================================================================

-- After running migration, run these to verify:

-- Count new tables
-- SELECT 'verb_metadata' as table_name, COUNT(*) as count FROM verb_metadata
-- UNION ALL
-- SELECT 'verb_conjugations', COUNT(*) FROM verb_conjugations
-- UNION ALL
-- SELECT 'inflections_normalized', COUNT(*) FROM inflections_normalized
-- UNION ALL
-- SELECT 'noun_metadata', COUNT(*) FROM noun_metadata
-- UNION ALL
-- SELECT 'comparison_log', COUNT(*) FROM comparison_log;

-- Check for any NULL verb_types in populated records
-- SELECT COUNT(*) as null_verb_types FROM verb_metadata WHERE verb_type IS NULL;

-- Sample normalized inflections
-- SELECT * FROM inflections_normalized LIMIT 10;

-- ============================================================================
-- NOTES
-- ============================================================================

-- 1. This script creates NEW tables instead of altering existing ones
--    This allows you to:
--    - Keep existing data intact
--    - Migrate gradually
--    - Rollback easily (just drop new tables)

-- 2. To use normalized inflections in your app:
--    - Query inflections_normalized instead of inflections
--    - Or create a migration script to copy data
--    - Or create a UNION view combining both

-- 3. Rollback steps if needed:
--    DROP TABLE IF EXISTS verb_metadata;
--    DROP TABLE IF EXISTS verb_conjugations;
--    DROP TABLE IF EXISTS inflections_normalized;
--    DROP TABLE IF EXISTS noun_metadata;
--    DROP TABLE IF EXISTS comparison_log;
--    DROP VIEW IF EXISTS v_inflections_migration;

-- 4. Once migration is complete and verified:
--    - You can rename inflections to inflections_old
--    - Rename inflections_normalized to inflections
--    - Or keep both and use views

