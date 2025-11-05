-- Migration script to align D1 database with LingDocs format
-- Run this to add new columns and tables for LingDocs-compatible structure

-- ============================================================================
-- 1. Add verb metadata columns to verbs_lexicon table
-- ============================================================================

ALTER TABLE verbs_lexicon ADD COLUMN verb_type TEXT;
-- Values: 'regular', 'stative_compound', 'dynamic_compound', 'generative_stative_compound', 'irregular'

ALTER TABLE verbs_lexicon ADD COLUMN complement TEXT;
-- For compound verbs: stores the noun/adjective part (e.g., "ښکېل" for "ښکېل کېدل")

ALTER TABLE verbs_lexicon ADD COLUMN auxiliary_verb TEXT;
-- For compound verbs: stores the auxiliary verb (e.g., "کېدل" or "کول")

ALTER TABLE verbs_lexicon ADD COLUMN transitivity TEXT;
-- Values: 'transitive', 'intransitive', 'grammatically_transitive'

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
-- 3. Create verb_metadata table (stores verb entry metadata)
-- ============================================================================

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
-- 4. Update inflections table: normalize grammatical_info structure
-- ============================================================================

-- Add new columns for easier querying
ALTER TABLE inflections ADD COLUMN grammatical_info_normalized TEXT;
-- JSON string with standardized structure:
-- {
--   "person": "1sg" | "2sg" | "3sg" | "1pl" | "2pl" | "3pl" | null,
--   "tense": "Present" | "Subjunctive" | "Past" | "Imperative" | "Future" | null,
--   "aspect": "Imperfective" | "Perfective" | null,
--   "mood": "Indicative" | "Subjunctive" | "Imperative" | null,
--   "gender": "Masc" | "Fem" | null,
--   "length": "long" | "short" | null,
--   "verb_type": "regular" | "stative_compound" | "dynamic_compound" | null,
--   "participle_type": "past" | "present" | null,
--   "inflection_type": "plain" | "1st" | "2nd" | "plural" | "vocative" | "bundled" | null,
--   "pos": "verb" | "noun" | "adjective"
-- }

ALTER TABLE inflections ADD COLUMN person TEXT;
ALTER TABLE inflections ADD COLUMN tense TEXT;
ALTER TABLE inflections ADD COLUMN aspect TEXT;
ALTER TABLE inflections ADD COLUMN mood TEXT;
ALTER TABLE inflections ADD COLUMN gender TEXT;
ALTER TABLE inflections ADD COLUMN length TEXT;
ALTER TABLE inflections ADD COLUMN verb_type TEXT;
ALTER TABLE inflections ADD COLUMN inflection_type TEXT;  -- For nouns/adjectives

CREATE INDEX IF NOT EXISTS idx_inflections_person ON inflections(person);
CREATE INDEX IF NOT EXISTS idx_inflections_tense ON inflections(tense);
CREATE INDEX IF NOT EXISTS idx_inflections_verb_type ON inflections(verb_type);
CREATE INDEX IF NOT EXISTS idx_inflections_pos ON inflections(pos);

-- ============================================================================
-- 5. Create noun_metadata table (similar structure for nouns)
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
-- 6. Create comparison_log table (for tracking differences)
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

