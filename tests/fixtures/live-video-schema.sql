-- Copied from live pashto-bible-db on 2026-11-06 (schema only).
CREATE TABLE "word_frequencies" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pashto_word TEXT NOT NULL UNIQUE,
  frequency_total INTEGER NOT NULL DEFAULT 0,
  frequency_afghan2023_ot INTEGER DEFAULT 0,
  frequency_afghan2023_nt INTEGER DEFAULT 0,
  frequency_yousafzai2019_ot INTEGER DEFAULT 0,
  frequency_yousafzai2019_nt INTEGER DEFAULT 0,
  frequency_rank INTEGER NOT NULL DEFAULT 0,
  romanization TEXT,
  pos TEXT,
  dictionary_id INTEGER,
  english_translation TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
, base_form TEXT, word_type TEXT, confidence_score REAL DEFAULT 1.0, has_issues INTEGER DEFAULT 0, issue_flags TEXT DEFAULT '[]', inflection_type TEXT, compound_type TEXT, verse_count INTEGER DEFAULT 0, base_verb TEXT, imperfective_stem TEXT, perfective_stem TEXT, perfective_root TEXT, past_participle TEXT, verb_type TEXT, transitivity TEXT, yul_ending INTEGER DEFAULT 0, idiosyncratic_3sg_masc TEXT, complement_text TEXT, aux_verb TEXT, form_type TEXT, gender TEXT, number TEXT, plural_forms TEXT, inflection_pattern INTEGER);
CREATE INDEX idx_word_freq_new_base ON "word_frequencies"(base_form);
CREATE INDEX idx_word_freq_new_type ON "word_frequencies"(word_type);
CREATE INDEX idx_word_freq_new_issues ON "word_frequencies"(has_issues);
CREATE INDEX idx_word_freq_word ON word_frequencies(pashto_word);
CREATE INDEX idx_word_freq_base ON word_frequencies(base_form);
CREATE INDEX idx_word_freq_type ON word_frequencies(word_type);
CREATE INDEX idx_word_freq_frequency ON word_frequencies(frequency_total DESC);
CREATE INDEX idx_word_freq_dict ON word_frequencies(dictionary_id);
CREATE INDEX idx_word_freq_issues ON word_frequencies(has_issues);
CREATE INDEX idx_word_freq_inflection_type ON word_frequencies(inflection_type);
CREATE INDEX idx_word_freq_compound_type ON word_frequencies(compound_type);
CREATE INDEX idx_word_freq_verse_count ON word_frequencies(verse_count);
CREATE INDEX idx_word_frequencies_base_verb ON word_frequencies (base_verb);
CREATE INDEX idx_word_frequencies_word_type ON word_frequencies (word_type);
CREATE INDEX idx_word_frequencies_imperfective_stem ON word_frequencies (imperfective_stem);
CREATE INDEX idx_word_frequencies_perfective_stem ON word_frequencies (perfective_stem);
CREATE INDEX idx_word_frequencies_verb_type ON word_frequencies (verb_type);
CREATE INDEX idx_word_frequencies_transitivity ON word_frequencies (transitivity);
CREATE INDEX idx_word_frequencies_complement_text ON word_frequencies (complement_text);
CREATE INDEX idx_word_frequencies_form_type ON word_frequencies (form_type);
CREATE TABLE word_frequency_update_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  words_updated INTEGER DEFAULT 0
);
CREATE TABLE video_word_mappings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        video_id TEXT NOT NULL,
        pashto_word TEXT NOT NULL,
        frequency INTEGER DEFAULT 1,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now')),
        UNIQUE(video_id, pashto_word)
      );
CREATE INDEX idx_video_word_video ON video_word_mappings(video_id);
CREATE INDEX idx_video_word_word ON video_word_mappings(pashto_word);
CREATE TABLE videos (
        video_id TEXT PRIMARY KEY,
        youtube_url TEXT,
        title TEXT,
        description TEXT,
        thumbnail_url TEXT,
        transcript_text TEXT,
        segments_json TEXT,
        words_json TEXT,
        r2_audio_key TEXT,
        duration REAL,
        language_code TEXT,
        status TEXT DEFAULT 'completed',
        created_at TEXT,
        updated_at TEXT
      );
