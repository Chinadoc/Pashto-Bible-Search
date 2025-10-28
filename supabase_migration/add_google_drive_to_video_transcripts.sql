-- Add Google Drive fields to video_transcripts table
ALTER TABLE video_transcripts ADD COLUMN IF NOT EXISTS google_drive_file_id TEXT;
ALTER TABLE video_transcripts ADD COLUMN IF NOT EXISTS google_drive_url TEXT;

-- Create index on google_drive_file_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_video_transcripts_google_drive_id ON video_transcripts(google_drive_file_id);

-- Add comment
COMMENT ON COLUMN video_transcripts.google_drive_file_id IS 'Google Drive file ID for the audio clip';
COMMENT ON COLUMN video_transcripts.google_drive_url IS 'Direct Google Drive download URL';

