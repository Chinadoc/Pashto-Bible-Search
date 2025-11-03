-- Add source tracking to word_frequencies
-- This allows tracking which sources (bible, video, poem) contribute to each word's frequency

-- Option 1: Add source tracking columns to word_frequencies
-- Note: SQLite doesn't support IF NOT EXISTS for ALTER TABLE
-- Run these only if columns don't exist:
-- ALTER TABLE word_frequencies ADD COLUMN sources TEXT; -- JSON array: ["bible", "video", "poem"]
-- ALTER TABLE word_frequencies ADD COLUMN source_counts TEXT; -- JSON: {"bible": 100, "video": 5, "poem": 2}

-- Option 2: Create separate word_source_mapping table (RECOMMENDED)
-- This provides granular tracking of individual word occurrences by source

CREATE TABLE IF NOT EXISTS word_source_mapping (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pashto_word TEXT NOT NULL,
  source_type TEXT NOT NULL, -- 'bible', 'video', 'poem', 'verse', etc.
  source_id TEXT, -- video_id, poem_id, verse_ref, etc.
  frequency INTEGER DEFAULT 1, -- occurrences in this specific source
  translation_key TEXT, -- 'afghan2023', 'yousafzai2019', or NULL for non-bible sources
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_word_source_word ON word_source_mapping (pashto_word);
CREATE INDEX IF NOT EXISTS idx_word_source_type ON word_source_mapping (source_type);
CREATE INDEX IF NOT EXISTS idx_word_source_id ON word_source_mapping (source_id);
CREATE INDEX IF NOT EXISTS idx_word_source_translation ON word_source_mapping (translation_key);

-- Function to recalculate word_frequencies from word_source_mapping
-- This can be called after adding/deleting videos or other sources
CREATE TABLE IF NOT EXISTS word_frequency_update_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  words_updated INTEGER DEFAULT 0
);

-- Note: SQLite doesn't support stored procedures, so this would need to be
-- implemented in application code or via a Cloudflare Worker

-- Example: Recalculate frequency for a specific word
-- UPDATE word_frequencies 
-- SET frequency = (
--   SELECT COALESCE(SUM(frequency), 0) 
--   FROM word_source_mapping 
--   WHERE word_source_mapping.pashto_word = word_frequencies.pashto_word
-- )
-- WHERE pashto_word = ?;

-- Example: Recalculate all frequencies
-- UPDATE word_frequencies 
-- SET frequency = (
--   SELECT COALESCE(SUM(frequency), 0) 
--   FROM word_source_mapping 
--   WHERE word_source_mapping.pashto_word = word_frequencies.pashto_word
-- );

-- Example: Get frequency breakdown by source for a word
-- SELECT source_type, SUM(frequency) as count
-- FROM word_source_mapping
-- WHERE pashto_word = ?
-- GROUP BY source_type;

