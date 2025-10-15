#!/usr/bin/env python3
"""
Upload processed video results to Supabase
"""

import json
import requests
import os
from pathlib import Path
from typing import Dict, List

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "your-anon-key")

def upload_to_supabase(results_data: Dict) -> bool:
    """Upload processed results to Supabase"""
    
    video_id = results_data['video_id']
    results = results_data['results']
    
    successful_uploads = 0
    
    for result in results:
        if result['status'] in ['success', 'success_retry']:
            # Extract chunk information
            chunk_path = Path(result['chunk_path'])
            chunk_index = result['chunk_index']
            
            # Create verse reference for sentence-level segments
            verse_reference = f"video_{video_id}_sentence_1_{chunk_index + 1}"
            
            # Get audio file info
            audio_filename = chunk_path.name
            file_size = chunk_path.stat().st_size
            duration_seconds = 10  # Default duration for sentence segments
            
            # Upload to Supabase
            data = {
                'verse_reference': verse_reference,
                'audio_filename': audio_filename,
                'audio_path': result['transcript'],  # Store transcript in audio_path field
                'file_size': file_size,
                'duration_seconds': duration_seconds,
                'start_time_seconds': chunk_index * 10,  # 10 seconds per chunk
                'end_time_seconds': (chunk_index + 1) * 10
            }
            
            try:
                response = requests.post(
                    f"{SUPABASE_URL}/rest/v1/audio_mappings",
                    headers={
                        'apikey': SUPABASE_KEY,
                        'Authorization': f'Bearer {SUPABASE_KEY}',
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    json=data
                )
                
                if response.status_code in [200, 201]:
                    successful_uploads += 1
                    print(f"✅ Uploaded chunk {chunk_index + 1}")
                else:
                    print(f"❌ Failed to upload chunk {chunk_index + 1}: {response.status_code}")
                    
            except Exception as e:
                print(f"❌ Error uploading chunk {chunk_index + 1}: {e}")
    
    print(f"\n📊 Upload Summary:")
    print(f"Total chunks: {len(results)}")
    print(f"Successful uploads: {successful_uploads}")
    print(f"Failed uploads: {len(results) - successful_uploads}")
    
    return successful_uploads > 0

def main():
    """Main function"""
    import sys
    
    if len(sys.argv) != 2:
        print("Usage: python upload_processed_results.py <results_json_file>")
        sys.exit(1)
    
    results_file = Path(sys.argv[1])
    
    if not results_file.exists():
        print(f"❌ Results file not found: {results_file}")
        sys.exit(1)
    
    # Load results
    with open(results_file, 'r', encoding='utf-8') as f:
        results_data = json.load(f)
    
    print(f"📁 Processing results from: {results_file}")
    print(f"🎬 Video ID: {results_data['video_id']}")
    print(f"📊 Total chunks: {results_data['total_chunks']}")
    print(f"✅ Successful transcriptions: {results_data['successful_transcriptions']}")
    
    # Upload to Supabase
    success = upload_to_supabase(results_data)
    
    if success:
        print("\n🎉 Upload completed successfully!")
    else:
        print("\n❌ Upload failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
