-- One row per job accepted by ElevenLabs. Monthly hours and daily submissions count from here.
CREATE TABLE IF NOT EXISTS transcription_jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_transcription_jobs_created_at ON transcription_jobs (created_at);
