#!/usr/bin/env python3
"""
Fix audio timestamps for existing sentence segments
This script updates the Supabase database with proper start_time_seconds and end_time_seconds
for sentence-level segments that were uploaded without proper timestamps.
"""

import requests
import json
from pathlib import Path

def fix_audio_timestamps():
    # Supabase credentials
    supabase_url = "https://nkombdutnjvaasxrbmdn.supabase.co"
    supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rb21iZHV0bmp2YWFzeHJibWRuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ3MzE0MywiZXhwIjoyMDcyMDQ5MTQzfQ.kbjqsXvPXVi9cOUV1C0H1uR4dD-ufn2wb4R9dOvpGZw"
    
    headers = {
        'apikey': supabase_key,
        'Authorization': f'Bearer {supabase_key}',
        'Content-Type': 'application/json'
    }
    
    # Read segments summary to get actual timestamps
    summary_file = Path("sentence_clips/segments_summary.json")
    
    if not summary_file.exists():
        print("❌ Segments summary file not found. Run sentence_segmenter.py first.")
        return
    
    with open(summary_file, 'r', encoding='utf-8') as f:
        segments_data = json.load(f)
    
    print(f"📝 Found {len(segments_data)} sentence segments to fix")
    
    # Create a mapping from filename to segment data
    segment_map = {}
    for segment in segments_data:
        segment_map[segment['filename']] = segment
    
    # Get all existing sentence segments from Supabase
    response = requests.get(
        f"{supabase_url}/rest/v1/audio_mappings",
        headers=headers,
        params={
            'verse_reference': 'like.*video_*_sentence_*',
            'select': 'id,verse_reference,audio_filename,duration_seconds,audio_path'
        }
    )
    
    if response.status_code != 200:
        print(f"❌ Failed to fetch existing segments: {response.status_code}")
        print(f"Response: {response.text}")
        return
    
    existing_segments = response.json()
    print(f"📊 Found {len(existing_segments)} existing sentence segments in database")
    
    fixed_count = 0
    skipped_count = 0
    
    for segment in existing_segments:
        try:
            filename = segment['audio_filename']
            verse_ref = segment['verse_reference']
            
            # Only process YouTube video segments, skip Bible verse segments
            if not verse_ref.startswith('video_') or '_sentence_' not in verse_ref:
                continue
                
            # Extract segment and sentence numbers
            parts = verse_ref.split('_sentence_')
            if len(parts) >= 2:
                segment_part = parts[1].split('_')[0]
                sentence_part = parts[1].split('_')[1]
                segment_num = int(segment_part)
                sentence_num = int(sentence_part)
            else:
                print(f"⚠️ Could not parse verse_reference: {verse_ref}")
                continue
            
            # Check if we have the segment data
            if filename not in segment_map:
                print(f"⚠️ No segment data found for {filename}")
                skipped_count += 1
                continue
            
            segment_data = segment_map[filename]
            
            # Calculate global timestamps
            global_start_time = (segment_num - 1) * 300 + segment_data['start_time']
            global_end_time = (segment_num - 1) * 300 + segment_data['end_time']
            
            # Update the segment in Supabase
            # Note: We'll store timestamps in the audio_path field temporarily
            # until we can add proper timestamp columns to the schema
            timestamp_info = f"[TIMESTAMPS:start={global_start_time:.1f},end={global_end_time:.1f},duration={segment_data['duration']:.1f}]"
            existing_transcript = segment.get('audio_path', '')
            updated_transcript = f"{timestamp_info} {existing_transcript}"
            
            update_data = {
                'audio_path': updated_transcript,
                'duration_seconds': int(segment_data['duration'])
            }
            
            update_response = requests.patch(
                f"{supabase_url}/rest/v1/audio_mappings",
                headers=headers,
                params={'id': f'eq.{segment["id"]}'},
                json=update_data
            )
            
            if update_response.status_code in [200, 204]:
                print(f"✅ Fixed timestamps for {filename}: {global_start_time:.1f}s - {global_end_time:.1f}s")
                fixed_count += 1
            else:
                print(f"❌ Failed to update {filename}: {update_response.status_code}")
                print(f"Response: {update_response.text}")
                
        except Exception as e:
            print(f"❌ Error processing {segment.get('audio_filename', 'unknown')}: {e}")
    
    print(f"\n📊 Fix completed: {fixed_count}/{len(existing_segments)} segments updated")
    if skipped_count > 0:
        print(f"⚠️ Skipped: {skipped_count} segments (no matching data)")

if __name__ == "__main__":
    fix_audio_timestamps()
