#!/usr/bin/env python3
"""
Upload existing transcripts to Supabase
"""

import requests
import json
import os
from pathlib import Path

def upload_transcripts():
    # Supabase credentials
    supabase_url = "https://nkombdutnjvaasxrbmdn.supabase.co"
    supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rb21iZHV0bmp2YWFzeHJibWRuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ3MzE0MywiZXhwIjoyMDcyMDQ5MTQzfQ.kbjqsXvPXVi9cOUV1C0H1uR4dD-ufn2wb4R9dOvpGZw"
    
    headers = {
        'apikey': supabase_key,
        'Authorization': f'Bearer {supabase_key}',
        'Content-Type': 'application/json'
    }
    
    # Read transcripts from poems directory
    poems_dir = Path("poems")
    audio_clips_dir = Path("audio_clips")
    
    if not poems_dir.exists():
        print("❌ Poems directory not found")
        return
    
    transcript_files = list(poems_dir.glob("*.txt"))
    print(f"📝 Found {len(transcript_files)} transcript files")
    
    video_id = "Xqn_-onV9DQ"
    video_title = "Afghanistan - Pakistan War ｜ Torkham Durand Line  ｜ د افغانستان پاکستان جنګ"
    
    uploaded_count = 0
    
    for i, transcript_file in enumerate(sorted(transcript_files), 1):
        try:
            # Read transcript content
            with open(transcript_file, 'r', encoding='utf-8') as f:
                transcript_text = f.read().strip()
            
            # Find corresponding audio file
            audio_name = transcript_file.stem
            audio_file = audio_clips_dir / f"{audio_name}.wav"
            
            if not audio_file.exists():
                print(f"⚠️ Audio file not found: {audio_file}")
                continue
            
            # Calculate timestamps
            start_time = (i - 1) * 300  # 5 minutes = 300 seconds
            end_time = i * 300
            
            # Prepare data
            data = {
                'video_id': video_id,
                'video_title': video_title,
                'segment_number': i,
                'start_time_seconds': start_time,
                'end_time_seconds': end_time,
                'transcript_text': transcript_text,
                'audio_file_path': str(audio_file),
                'transcript_file_path': str(transcript_file)
            }
            
            # Try to upload to Supabase using audio_mappings table
            # We'll store transcript data in the audio_path field for now
            audio_mapping_data = {
                'verse_reference': f"video_{video_id}_segment_{i}",
                'audio_filename': audio_file.name,
                'audio_path': transcript_text,  # Store transcript in audio_path field
                'file_size': len(transcript_text),
                'duration_seconds': 300  # 5 minutes
            }
            
            response = requests.post(
                f"{supabase_url}/rest/v1/audio_mappings",
                headers=headers,
                json=audio_mapping_data
            )
            
            if response.status_code in [200, 201]:
                print(f"✅ Uploaded segment {i}: {len(transcript_text)} characters")
                uploaded_count += 1
            else:
                print(f"❌ Failed to upload segment {i}: {response.status_code}")
                print(f"Response: {response.text}")
                
        except Exception as e:
            print(f"❌ Error processing segment {i}: {e}")
    
    print(f"\n📊 Upload completed: {uploaded_count}/{len(transcript_files)} segments uploaded")

if __name__ == "__main__":
    upload_transcripts()
