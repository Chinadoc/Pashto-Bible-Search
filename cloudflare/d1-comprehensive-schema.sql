-- ========================================
-- COMPREHENSIVE CLOUDFLARE D1 DATABASE SCHEMA
-- ========================================
-- Single unified schema with ALL linguistic data
-- Supports adding/deleting records as needed

-- ========================================
-- 1. VERSES TABLE (Unified - supports both translations)
-- ========================================

CREATE TABLE IF NOT EXISTS verses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref TEXT NOT NULL UNIQUE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  text_normalized TEXT,
  text_html TEXT, -- HTML version if available
  testament TEXT NOT NULL CHECK (testament IN ('OT', 'NT')),
  translation_key TEXT NOT NULL, -- 'afghan2023' or 'yousafzai2019'
  dialect TEXT DEFAULT 'afghan', -- 'afghan' or 'yousafzai'
  tags TEXT DEFAULT '[]', -- JSON string for additional metadata
  audio_r2_key TEXT, -- R2 object key: e.g., 'yousafzai/nt/genesis001_verse_001.mp3'
  audio_public_url TEXT, -- Public R2 URL (for direct streaming)
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_verses_ref ON verses (ref);
CREATE INDEX IF NOT EXISTS idx_verses_book_chapter_verse ON verses (book, chapter, verse);
CREATE INDEX IF NOT EXISTS idx_verses_testament ON verses (testament);
CREATE INDEX IF NOT EXISTS idx_verses_translation ON verses (translation_key);
CREATE INDEX IF NOT EXISTS idx_verses_text ON verses (text);
CREATE INDEX IF NOT EXISTS idx_verses_text_normalized ON verses (text_normalized);
CREATE INDEX IF NOT EXISTS idx_verses_audio_r2_key ON verses (audio_r2_key) WHERE audio_r2_key IS NOT NULL;

-- ========================================
-- 2. WORD FREQUENCY TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS word_frequencies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pashto_word TEXT NOT NULL,
  frequency INTEGER NOT NULL DEFAULT 0,
  frequency_rank INTEGER DEFAULT 0,
  romanization TEXT,
  pos TEXT, -- Part of speech
  translation_key TEXT, -- 'afghan2023' or 'yousafzai2019' or NULL for combined
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  UNIQUE(pashto_word, translation_key)
);

CREATE INDEX IF NOT EXISTS idx_word_frequencies_word ON word_frequencies (pashto_word);
CREATE INDEX IF NOT EXISTS idx_word_frequencies_frequency ON word_frequencies (frequency DESC);
CREATE INDEX IF NOT EXISTS idx_word_frequencies_translation ON word_frequencies (translation_key);

-- ========================================
-- 3. DICTIONARY TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS dictionary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word TEXT NOT NULL,
  pos TEXT NOT NULL, -- Part of speech
  definition TEXT NOT NULL,
  romanization TEXT,
  frequency INTEGER DEFAULT 0,
  examples TEXT, -- JSON string
  enriched_info TEXT, -- JSON string with additional metadata
  translation_key TEXT, -- Which translation this dictionary entry applies to
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_dictionary_word ON dictionary (word);
CREATE INDEX IF NOT EXISTS idx_dictionary_pos ON dictionary (pos);
CREATE INDEX IF NOT EXISTS idx_dictionary_translation ON dictionary (translation_key);

-- ========================================
-- 4. FORM OCCURRENCE INDEX
-- ========================================

CREATE TABLE IF NOT EXISTS form_occurrences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pashto_form TEXT NOT NULL,
  verse_refs TEXT NOT NULL, -- JSON array of verse references
  frequency INTEGER NOT NULL DEFAULT 0,
  translation_key TEXT, -- 'afghan2023' or 'yousafzai189' or NULL
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_form_occurrences_form ON form_occurrences (pashto_form);
CREATE INDEX IF NOT EXISTS idx_form_occurrences_frequency ON form_occurrences (frequency DESC);
CREATE INDEX IF NOT EXISTS idx_form_occurrences_translation ON form_occurrences (translation_key);

-- ========================================
-- INFLECTION REASONS ANALYSIS
-- ========================================

CREATE TABLE IF NOT EXISTS inflection_reasons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pashto_form TEXT NOT NULL,
  base_word TEXT NOT NULL,
  verse_ref TEXT NOT NULL,
  inflection_type TEXT NOT NULL, -- "1st" or "2nd"
  is_plural INTEGER DEFAULT 0,
  is_in_sandwich INTEGER DEFAULT 0,
  sandwich_type TEXT,
  is_subject_transitive_past INTEGER DEFAULT 0,
  context_sentence TEXT,
  word_position INTEGER,
  translation_key TEXT, -- 'afghan2023' or 'yousafzai2019'
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_inflection_reasons_form ON inflection_reasons (pashto_form);
CREATE INDEX IF NOT EXISTS idx_inflection_reasons_base ON inflection_reasons (base_word);
CREATE INDEX IF NOT EXISTS idx_inflection_reasons_verse ON inflection_reasons (verse_ref);
CREATE INDEX IF NOT EXISTS idx_inflection_reasons_translation ON inflection_reasons (translation_key);

-- ========================================
-- 5. FORM TO ROOT MAPPING
-- ========================================

CREATE TABLE IF NOT EXISTS form_to_root (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word_form TEXT NOT NULL,
  root_word TEXT NOT NULL,
  frequency INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  UNIQUE(word_form, root_word)
);

CREATE INDEX IF NOT EXISTS idx_form_to_root_form ON form_to_root (word_form);
CREATE INDEX IF NOT EXISTS idx_form_to_root_root ON form_to_root (root_word);

-- ========================================
-- 6. INFLECTIONS CACHE
-- ========================================

CREATE TABLE IF NOT EXISTS inflections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  base_word TEXT NOT NULL,
  inflected_form TEXT NOT NULL,
  grammatical_info TEXT, -- JSON string
  frequency INTEGER DEFAULT 0,
  examples TEXT, -- JSON string
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_inflections_base ON inflections (base_word);
CREATE INDEX IF NOT EXISTS idx_inflections_form ON inflections (inflected_form);

-- ========================================
-- 7. VERBS LEXICON
-- ========================================

CREATE TABLE IF NOT EXISTS verbs_lexicon (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  verb_root TEXT NOT NULL,
  stems TEXT, -- JSON string
  roots TEXT, -- JSON string
  past_participle TEXT,
  romanization TEXT, -- JSON string
  conjugation_pattern TEXT,
  examples TEXT, -- JSON string
  notes TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_verbs_lexicon_root ON verbs_lexicon (verb_root);

-- ========================================
-- 8. IRREGULAR VERBS
-- ========================================

CREATE TABLE IF NOT EXISTS irregular_verbs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  verb_root TEXT NOT NULL,
  stems TEXT, -- JSON string
  roots TEXT, -- JSON string
  past_participle TEXT NOT NULL,
  romanization TEXT, -- JSON string
  irregularity_type TEXT NOT NULL,
  conjugation_pattern TEXT NOT NULL,
  examples TEXT, -- JSON string
  notes TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_irregular_verbs_root ON irregular_verbs (verb_root);

-- ========================================
-- 9. NOUNS LEXICON
-- ========================================

CREATE TABLE IF NOT EXISTS nouns_lexicon (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pashto_word TEXT NOT NULL,
  romanized TEXT,
  gender TEXT NOT NULL,
  number TEXT NOT NULL,
  plural_forms TEXT, -- JSON string
  inflection_pattern INTEGER DEFAULT 1, -- 0=None, 1=Basic, 2=Unstressed ی, 3=Stressed ی, 4=Pashtoon, 5=Squish, 6=Feminine Inanimate ي
  frequency INTEGER DEFAULT 0,
  examples TEXT, -- JSON string
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_nouns_lexicon_word ON nouns_lexicon (pashto_word);

-- ========================================
-- 10. GRAMMAR RULES
-- ========================================

CREATE TABLE IF NOT EXISTS grammar_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rule_name TEXT NOT NULL,
  part_of_speech TEXT NOT NULL,
  pattern_description TEXT NOT NULL,
  transformation_rules TEXT, -- JSON string
  priority INTEGER DEFAULT 0,
  examples TEXT, -- JSON string
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_grammar_rules_pos ON grammar_rules (part_of_speech);

-- ========================================
-- 11. VIDEO TRANSCRIPTS (if applicable)
-- ========================================

CREATE TABLE IF NOT EXISTS video_transcripts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id TEXT NOT NULL,
  video_url TEXT,
  transcript_text TEXT NOT NULL,
  transcript_json TEXT, -- JSON string with structured transcript
  language TEXT DEFAULT 'pashto',
  duration_seconds INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_video_transcripts_video_id ON video_transcripts (video_id);

-- ========================================
-- NOTES:
-- - All tables support adding/deleting records as needed
-- - Audio R2 keys stored in verses table: audio_r2_key
-- - JSON data stored as TEXT (SQLite doesn't have native JSONB)
-- - Translation_key used to distinguish between Afghan 2023 and Yousafzai 2019
-- - Created_at and updated_at are Unix timestamps (INTEGER)
-- ========================================


