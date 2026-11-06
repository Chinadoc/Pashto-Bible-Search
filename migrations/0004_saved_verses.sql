-- Saved verses and review progress, keyed by the Google id in the JWT session.
-- No foreign key to users: JWT sessions never write that table.
CREATE TABLE IF NOT EXISTS saved_verses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  verse_ref TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, verse_ref)
);

CREATE TABLE IF NOT EXISTS srs_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  verse_ref TEXT NOT NULL,
  next_review DATETIME NOT NULL,
  interval INTEGER NOT NULL DEFAULT 1,
  ease_factor REAL NOT NULL DEFAULT 2.5,
  repetitions INTEGER NOT NULL DEFAULT 0,
  last_reviewed DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, verse_ref)
);
