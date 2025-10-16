#!/usr/bin/env python3
"""
Script to restore original transcripts that were overwritten by fix_audio_timestamps.py
"""

import requests
import json
import os
from pathlib import Path

# Supabase configuration
SUPABASE_URL = "https://nkombdutnjvaasxrbmdn.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rb21iZHV0bmp2YWFzeHJibWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzMxNDMsImV4cCI6MjA3MjA0OTE0M30.dBdCCD8hJAWV4Y8sRNVi2uUSnDrZbUM4TxR6vl8-ENg"

def get_original_transcripts():
    """Get original transcripts from segments_summary.json"""
    summary_file = Path("sentence_clips/segments_summary.json")
    transcripts = {}
    
    if not summary_file.exists():
        print("segments_summary.json not found")
        return transcripts
    
    try:
        with open(summary_file, 'r', encoding='utf-8') as f:
            segments_data = json.load(f)
        
        for segment in segments_data:
            filename = segment['filename']
            # Use transcribed_text if available, otherwise original_text
            transcript = segment.get('transcribed_text') or segment.get('original_text', '')
            if transcript and transcript.strip():
                transcripts[filename] = transcript.strip()
        
        print(f"Found {len(transcripts)} transcripts in segments_summary.json")
        
    except Exception as e:
        print(f"Error reading segments_summary.json: {e}")
    
    return transcripts

def restore_transcripts():
    """Restore original transcripts to Supabase"""
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json'
    }
    
    # Get original transcripts
    original_transcripts = get_original_transcripts()
    
    if not original_transcripts:
        print("No original transcripts found")
        return
    
    print(f"Found {len(original_transcripts)} original transcripts")
    
    # Get current segments from Supabase
    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/audio_mappings",
        headers=headers,
        params={
            'verse_reference': 'like.*video_*_sentence_*',
            'select': 'id,verse_reference,audio_filename,audio_path'
        }
    )
    
    if response.status_code != 200:
        print(f"Error fetching segments: {response.status_code}")
        print(response.text)
        return
    
    segments = response.json()
    print(f"Found {len(segments)} segments in Supabase")
    
    restored_count = 0
    
    for segment in segments:
        audio_filename = segment['audio_filename']
        
        if audio_filename in original_transcripts:
            original_transcript = original_transcripts[audio_filename]
            
            # Update the segment with original transcript
            update_response = requests.patch(
                f"{SUPABASE_URL}/rest/v1/audio_mappings",
                headers=headers,
                params={'id': f'eq.{segment["id"]}'},
                json={'audio_path': original_transcript}
            )
            
            if update_response.status_code in [200, 204]:
                restored_count += 1
                print(f"Restored transcript for {audio_filename}")
            else:
                print(f"Error updating {audio_filename}: {update_response.status_code}")
    
    print(f"Restored {restored_count} transcripts")

if __name__ == "__main__":
    restore_transcripts()
