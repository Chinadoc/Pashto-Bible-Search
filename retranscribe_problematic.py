#!/usr/bin/env python3
"""
Re-transcribe problematic segments with improved settings
"""

import json
import requests
import time
from pathlib import Path

# ElevenLabs API configuration
ELEVENLABS_API_KEY = "sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543"
ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/speech-to-text"

def transcribe_audio_file(audio_file_path, max_retries=3):
    """Transcribe audio file using ElevenLabs API with retries"""
    for attempt in range(max_retries):
        try:
            with open(audio_file_path, 'rb') as audio_file:
                files = {'file': audio_file}
                data = {
                    'language': 'ps',  # Pashto
                    'model_id': 'scribe_v1'
                }
                
                response = requests.post(
                    ELEVENLABS_API_URL,
                    files=files,
                    data=data,
                    headers={'xi-api-key': ELEVENLABS_API_KEY},
                    timeout=60  # 60 second timeout
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return result.get('text', '')
                else:
                    print(f"  Attempt {attempt + 1} failed: {response.status_code} - {response.text}")
                    if attempt < max_retries - 1:
                        time.sleep(2)  # Wait before retry
                    
        except Exception as e:
            print(f"  Attempt {attempt + 1} exception: {e}")
            if attempt < max_retries - 1:
                time.sleep(2)  # Wait before retry
    
    return None

def main():
    """Re-transcribe problematic segments"""
    
    # Load problematic segments
    with open("problematic_segments.json", "r", encoding="utf-8") as f:
        problematic_files = json.load(f)
    
    print(f"Found {len(problematic_files)} problematic files to re-transcribe")
    
    successful_retranscriptions = []
    failed_retranscriptions = []
    
    for i, item in enumerate(problematic_files):
        audio_file = Path(item['file'])
        print(f"\n[{i+1}/{len(problematic_files)}] Re-transcribing {audio_file.name}...")
        print(f"  Original issues: {', '.join(item['issues'])}")
        print(f"  Original transcript: {item['transcript'][:100]}...")
        
        # Re-transcribe
        new_transcript = transcribe_audio_file(audio_file)
        
        if new_transcript:
            print(f"  ✓ New transcript: {new_transcript[:100]}...")
            successful_retranscriptions.append({
                'file': str(audio_file),
                'original_transcript': item['transcript'],
                'new_transcript': new_transcript,
                'issues': item['issues']
            })
        else:
            print(f"  ✗ Failed to re-transcribe")
            failed_retranscriptions.append(item)
        
        # Rate limiting - wait between requests
        time.sleep(1)
    
    # Save results
    with open("retranscription_results.json", "w", encoding="utf-8") as f:
        json.dump({
            'successful': successful_retranscriptions,
            'failed': failed_retranscriptions,
            'summary': {
                'total': len(problematic_files),
                'successful': len(successful_retranscriptions),
                'failed': len(failed_retranscriptions)
            }
        }, f, ensure_ascii=False, indent=2)
    
    print(f"\n=== SUMMARY ===")
    print(f"Total problematic files: {len(problematic_files)}")
    print(f"Successfully re-transcribed: {len(successful_retranscriptions)}")
    print(f"Failed to re-transcribe: {len(failed_retranscriptions)}")
    print(f"Results saved to retranscription_results.json")

if __name__ == "__main__":
    main()
