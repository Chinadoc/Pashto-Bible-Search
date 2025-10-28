-- Add validation fields to video_transcripts table
ALTER TABLE video_transcripts ADD COLUMN IF NOT EXISTS needs_retry BOOLEAN DEFAULT FALSE;
ALTER TABLE video_transcripts ADD COLUMN IF NOT EXISTS retry_reason TEXT;
ALTER TABLE video_transcripts ADD COLUMN IF NOT EXISTS validation_score REAL;
ALTER TABLE video_transcripts ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0;
ALTER TABLE video_transcripts ADD COLUMN IF NOT EXISTS transcription_service TEXT DEFAULT 'elevenlabs';

-- Create index on needs_retry for quick lookup
CREATE INDEX IF NOT EXISTS idx_video_transcripts_needs_retry ON video_transcripts(needs_retry) WHERE needs_retry = TRUE;

-- Add comments
COMMENT ON COLUMN video_transcripts.needs_retry IS 'Flag indicating if transcription needs to be retried';
COMMENT ON COLUMN video_transcripts.retry_reason IS 'Reason why retry is needed';
COMMENT ON COLUMN video_transcripts.validation_score IS 'Confidence score from validation (0-1)';
COMMENT ON COLUMN video_transcripts.retry_count IS 'Number of retry attempts';
COMMENT ON COLUMN video_transcripts.transcription_service IS 'Service used for transcription (elevenlabs, whisper, etc.)';

