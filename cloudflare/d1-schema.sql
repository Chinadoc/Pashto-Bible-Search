-- Cloudflare D1 Schema for Pashto Bible Search
-- Comprehensive schema with all tables

CREATE TABLE IF NOT EXISTS verses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref TEXT NOT NULL UNIQUE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  text_normalized TEXT,
  text_html TEXT,
  testament TEXT NOT NULL CHECK (testament IN ('OT', 'NT')),
  translation_key TEXT NOT NULL, -- 'afghan2023' or 'yousafzai2019'
  dialect TEXT,
  tags TEXT DEFAULT '[]', -- JSON string
  audio_r2_key TEXT, -- R2 object key instead of URL
  audio_public_url TEXT, -- Public R2 URL (signed or public)
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_verses_ref ON verses(ref);
CREATE INDEX IF NOT EXISTS idx_verses_book_chapter ON verses(book, chapter);
CREATE INDEX IF NOT EXISTS idx_verses_translation ON verses(translation_key);
CREATE INDEX IF NOT EXISTS idx_verses_testament ON verses(testament);
CREATE INDEX IF NOT EXISTS idx_verses_audio_r2_key ON verses(audio_r2_key);

CREATE TABLE IF NOT EXISTS word_frequencies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pashto_word TEXT NOT NULL,
  frequency INTEGER NOT NULL DEFAULT 0,
  frequency_rank INTEGER NOT NULL DEFAULT 0,
  romanization TEXT,
  pos TEXT,
  translation_key TEXT, -- 'afghan2023' or 'yousafzai2019'
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  UNIQUE(pashto_word, translation_key)
);

CREATE INDEX IF NOT EXISTS idx_word_freq_word ON word_frequencies(pashto_word);
CREATE INDEX IF NOT EXISTS idx_word_freq_frequency ON word_frequencies(frequency DESC);

CREATE TABLE IF NOT EXISTS form_occurrences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  form TEXT NOT NULL,
  lemma TEXT,
  root TEXT,
  pos TEXT,
  translation_key TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  UNIQUE(form, lemma, translation_key)
);

CREATE INDEX IF NOT EXISTS idx_form_occurrences_form ON form_occurrences(form);

CREATE TABLE IF NOT EXISTS form_to_root (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  form TEXT NOT NULL,
  root TEXT NOT NULL,
  translation_key TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  UNIQUE(form, root, translation_key)
);

CREATE INDEX IF NOT EXISTS idx_form_to_root_form ON form_to_root(form);
CREATE INDEX IF NOT EXISTS idx_form_to_root_root ON form_to_root(root);

CREATE TABLE IF NOT EXISTS dictionary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pashto_word TEXT NOT NULL,
  english_translation TEXT,
  pos TEXT,
  root TEXT,
  notes TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  UNIQUE(pashto_word, english_translation)
);

CREATE INDEX IF NOT EXISTS idx_dictionary_word ON dictionary(pashto_word);

CREATE TABLE IF NOT EXISTS inflections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  base_form TEXT NOT NULL,
  inflected_form TEXT NOT NULL,
  inflection_type TEXT,
  pos TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  UNIQUE(base_form, inflected_form)
);

CREATE INDEX IF NOT EXISTS idx_inflections_base ON inflections(base_form);
CREATE INDEX IF NOT EXISTS idx_inflections_inflected ON inflections(inflected_form);

CREATE TABLE IF NOT EXISTS irregular_verbs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  root TEXT NOT NULL,
  past_form TEXT,
  present_form TEXT,
  past_participle TEXT,
  notes TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS nouns_lexicon (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  singular TEXT NOT NULL,
  plural TEXT,
  root TEXT,
  gender TEXT,
  translation TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  UNIQUE(singular, plural)
);

CREATE TABLE IF NOT EXISTS verbs_lexicon (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  infinitive TEXT NOT NULL,
  root TEXT,
  past_stem TEXT,
  present_stem TEXT,
  translation TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  UNIQUE(infinitive)
);

CREATE TABLE IF NOT EXISTS grammar_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rule_type TEXT NOT NULL,
  description TEXT,
  examples TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS video_transcripts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id TEXT NOT NULL,
  transcript_text TEXT,
  language TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  UNIQUE(video_id)
);
