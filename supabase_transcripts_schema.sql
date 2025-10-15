-- Supabase schema for storing YouTube video transcripts with timestamps
-- This table will store transcribed Pashto text from audio clips

CREATE TABLE IF NOT EXISTS video_transcripts (
    id BIGSERIAL PRIMARY KEY,
    video_id VARCHAR(255) NOT NULL, -- YouTube video ID
    video_title TEXT NOT NULL, -- Original video title
    segment_number INTEGER NOT NULL, -- Segment number (1, 2, 3, etc.)
    start_time_seconds INTEGER NOT NULL, -- Start time in seconds
    end_time_seconds INTEGER NOT NULL, -- End time in seconds
    transcript_text TEXT NOT NULL, -- Transcribed Pashto text
    audio_file_path TEXT NOT NULL, -- Path to audio file
    transcript_file_path TEXT NOT NULL, -- Path to transcript file
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient searching
CREATE INDEX IF NOT EXISTS idx_video_transcripts_video_id ON video_transcripts(video_id);
CREATE INDEX IF NOT EXISTS idx_video_transcripts_segment ON video_transcripts(segment_number);
CREATE INDEX IF NOT EXISTS idx_video_transcripts_time ON video_transcripts(start_time_seconds, end_time_seconds);

-- Create full-text search index for Pashto text
CREATE INDEX IF NOT EXISTS idx_video_transcripts_text_search ON video_transcripts USING gin(to_tsvector('simple', transcript_text));

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_video_transcripts_updated_at 
    BEFORE UPDATE ON video_transcripts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE video_transcripts ENABLE ROW LEVEL SECURITY;

-- Create a view for easier querying with formatted time
CREATE OR REPLACE VIEW video_transcripts_formatted AS
SELECT 
    id,
    video_id,
    video_title,
    segment_number,
    start_time_seconds,
    end_time_seconds,
    transcript_text,
    audio_file_path,
    transcript_file_path,
    -- Format time as MM:SS
    LPAD((start_time_seconds / 60)::TEXT, 2, '0') || ':' || LPAD((start_time_seconds % 60)::TEXT, 2, '0') as start_time_formatted,
    LPAD((end_time_seconds / 60)::TEXT, 2, '0') || ':' || LPAD((end_time_seconds % 60)::TEXT, 2, '0') as end_time_formatted,
    created_at,
    updated_at
FROM video_transcripts;

-- Create a function to search transcripts
CREATE OR REPLACE FUNCTION search_transcripts(search_query TEXT)
RETURNS TABLE (
    id BIGINT,
    video_id VARCHAR(255),
    video_title TEXT,
    segment_number INTEGER,
    start_time_seconds INTEGER,
    end_time_seconds INTEGER,
    transcript_text TEXT,
    audio_file_path TEXT,
    transcript_file_path TEXT,
    start_time_formatted TEXT,
    end_time_formatted TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        vt.id,
        vt.video_id,
        vt.video_title,
        vt.segment_number,
        vt.start_time_seconds,
        vt.end_time_seconds,
        vt.transcript_text,
        vt.audio_file_path,
        vt.transcript_file_path,
        LPAD((vt.start_time_seconds / 60)::TEXT, 2, '0') || ':' || LPAD((vt.start_time_seconds % 60)::TEXT, 2, '0') as start_time_formatted,
        LPAD((vt.end_time_seconds / 60)::TEXT, 2, '0') || ':' || LPAD((vt.end_time_seconds % 60)::TEXT, 2, '0') as end_time_formatted,
        vt.created_at,
        vt.updated_at,
        ts_rank(to_tsvector('simple', vt.transcript_text), plainto_tsquery('simple', search_query)) as rank
    FROM video_transcripts vt
    WHERE to_tsvector('simple', vt.transcript_text) @@ plainto_tsquery('simple', search_query)
    ORDER BY rank DESC, vt.start_time_seconds ASC;
END;
$$ LANGUAGE plpgsql;
