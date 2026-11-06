-- Async ElevenLabs transcription: additive columns only.
ALTER TABLE videos ADD COLUMN transcription_id TEXT;
ALTER TABLE videos ADD COLUMN error_message TEXT;
-- The word indexer already writes this column; live was missing it, so indexing failed.
ALTER TABLE video_word_mappings ADD COLUMN audio_r2_key TEXT;
