#!/usr/bin/env python3
"""
Create video_transcripts table in Supabase
"""

import requests
import os

def create_table():
    # Supabase credentials
    supabase_url = "https://nkombdutnjvaasxrbmdn.supabase.co"
    supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rb21iZHV0bmp2YWFzeHJibWRuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ3MzE0MywiZXhwIjoyMDcyMDQ5MTQzfQ.kbjqsXvPXVi9cOUV1C0H1uR4dD-ufn2wb4R9dOvpGZw"
    
    # SQL to create the table
    sql = """
    CREATE TABLE IF NOT EXISTS video_transcripts (
        id BIGSERIAL PRIMARY KEY,
        video_id VARCHAR(255) NOT NULL,
        video_title TEXT NOT NULL,
        segment_number INTEGER NOT NULL,
        start_time_seconds INTEGER NOT NULL,
        end_time_seconds INTEGER NOT NULL,
        transcript_text TEXT NOT NULL,
        audio_file_path TEXT NOT NULL,
        transcript_file_path TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_video_transcripts_video_id ON video_transcripts(video_id);
    CREATE INDEX IF NOT EXISTS idx_video_transcripts_segment ON video_transcripts(segment_number);
    CREATE INDEX IF NOT EXISTS idx_video_transcripts_time ON video_transcripts(start_time_seconds, end_time_seconds);
    CREATE INDEX IF NOT EXISTS idx_video_transcripts_text_search ON video_transcripts USING gin(to_tsvector('simple', transcript_text));
    """
    
    headers = {
        'apikey': supabase_key,
        'Authorization': f'Bearer {supabase_key}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(
            f"{supabase_url}/rest/v1/rpc/exec_sql",
            headers=headers,
            json={'sql': sql}
        )
        
        if response.status_code == 200:
            print("✅ Table created successfully")
            return True
        else:
            print(f"❌ Error creating table: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    create_table()
