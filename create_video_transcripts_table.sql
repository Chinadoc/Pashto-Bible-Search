-- Create table for storing video transcripts and metadata
CREATE TABLE IF NOT EXISTS video_transcripts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    video_id TEXT NOT NULL,
    video_url TEXT,
    transcript TEXT NOT NULL,
    segments JSONB,
    audio_segments JSONB,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on video_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_video_transcripts_video_id ON video_transcripts(video_id);

-- Create index on created_at for chronological ordering
CREATE INDEX IF NOT EXISTS idx_video_transcripts_created_at ON video_transcripts(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE video_transcripts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users (adjust as needed)
CREATE POLICY "Allow all operations for authenticated users" ON video_transcripts
    FOR ALL USING (true);

-- Create policy to allow read access for anonymous users
CREATE POLICY "Allow read access for anonymous users" ON video_transcripts
    FOR SELECT USING (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_video_transcripts_updated_at
    BEFORE UPDATE ON video_transcripts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
