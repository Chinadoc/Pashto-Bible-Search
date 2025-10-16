#!/usr/bin/env python3
"""
Upload sentence-based segments to Supabase
"""

import requests
import json
import os
from pathlib import Path

def upload_sentence_segments():
    # Supabase credentials
    supabase_url = "https://nkombdutnjvaasxrbmdn.supabase.co"
    supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rb21iZHV0bmp2YWFzeHJibWRuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ3MzE0MywiZXhwIjoyMDcyMDQ5MTQzfQ.kbjqsXvPXVi9cOUV1C0H1uR4dD-ufn2wb4R9dOvpGZw"
    
    headers = {
        'apikey': supabase_key,
        'Authorization': f'Bearer {supabase_key}',
        'Content-Type': 'application/json'
    }
    
    # Read segments summary
    summary_file = Path("sentence_clips/segments_summary.json")
    
    if not summary_file.exists():
        print("❌ Segments summary file not found")
        return
    
    with open(summary_file, 'r', encoding='utf-8') as f:
        segments_data = json.load(f)
    
    print(f"📝 Found {len(segments_data)} sentence segments to upload")
    
    video_id = "Xqn_-onV9DQ"
    video_title = "Afghanistan - Pakistan War | Torkham Durand Line | د افغانستان پاکستان جنګ"
    
    uploaded_count = 0
    failed_count = 0
    
    for i, segment in enumerate(segments_data, 1):
        try:
            # Extract segment number from filename
            filename = segment['filename']
            # Format: Afghanistan - Pakistan War ｜ Torkham Durand Line  ｜ د افغانستان پاکستان جنګ_segment_XXX_sentence_YYY.wav
            parts = filename.split('_segment_')
            if len(parts) >= 2:
                segment_part = parts[1].split('_sentence_')[0]
                sentence_part = parts[1].split('_sentence_')[1].split('.')[0]
                segment_num = int(segment_part)
                sentence_num = int(sentence_part)
            else:
                segment_num = 1
                sentence_num = i
            
            # Calculate global timestamp
            global_start_time = (segment_num - 1) * 300 + segment['start_time']
            global_end_time = (segment_num - 1) * 300 + segment['end_time']
            
            # Prepare data for audio_mappings table
            audio_mapping_data = {
                'verse_reference': f"video_{video_id}_sentence_{segment_num}_{sentence_num}",
                'audio_filename': filename,
                'audio_path': segment.get('transcribed_text', segment.get('original_text', '')),
                'file_size': len(segment.get('transcribed_text', segment.get('original_text', ''))),
                'duration_seconds': int(segment['duration']),
                'start_time_seconds': global_start_time,
                'end_time_seconds': global_end_time
            }
            
            response = requests.post(
                f"{supabase_url}/rest/v1/audio_mappings",
                headers=headers,
                json=audio_mapping_data
            )
            
            if response.status_code in [200, 201]:
                print(f"✅ Uploaded sentence {i}: {filename} ({segment['duration']:.1f}s)")
                uploaded_count += 1
            else:
                print(f"❌ Failed to upload sentence {i}: {response.status_code}")
                print(f"Response: {response.text}")
                failed_count += 1
                
        except Exception as e:
            print(f"❌ Error processing sentence {i}: {e}")
            failed_count += 1
    
    print(f"\n📊 Upload completed: {uploaded_count}/{len(segments_data)} segments uploaded")
    if failed_count > 0:
        print(f"❌ Failed uploads: {failed_count}")

if __name__ == "__main__":
    upload_sentence_segments()
