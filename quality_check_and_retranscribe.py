#!/usr/bin/env python3
"""
Quality check and re-transcription script for problematic segments
"""

import os
import re
import requests
import json
from pathlib import Path

# ElevenLabs API configuration
ELEVENLABS_API_KEY = "sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543"
ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/speech-to-text"

def check_transcript_quality(transcript):
    """Check if transcript contains problematic content"""
    issues = []
    
    # Check for non-Pashto scripts (Devanagari, etc.)
    devanagari_pattern = r'[\u0900-\u097F]+'
    if re.search(devanagari_pattern, transcript):
        issues.append("Contains Devanagari script")
    
    # Check for English content
    english_words = ['rock music', 'music', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']
    transcript_lower = transcript.lower()
    for word in english_words:
        if word in transcript_lower:
            issues.append(f"Contains English word: {word}")
    
    # Check for mixed language patterns
    if re.search(r'[a-zA-Z]{3,}', transcript):
        issues.append("Contains English text")
    
    return issues

def transcribe_audio_file(audio_file_path):
    """Transcribe audio file using ElevenLabs API"""
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
                headers={'xi-api-key': ELEVENLABS_API_KEY}
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get('text', '')
            else:
                print(f"Error transcribing {audio_file_path}: {response.status_code} - {response.text}")
                return None
                
    except Exception as e:
        print(f"Exception transcribing {audio_file_path}: {e}")
        return None

def main():
    """Main function to check and re-transcribe problematic segments"""
    
    # Get all sentence clips
    sentence_clips_dir = Path("sentence_clips")
    if not sentence_clips_dir.exists():
        print("sentence_clips directory not found")
        return
    
    problematic_files = []
    
    # Check each audio file
    for audio_file in sentence_clips_dir.glob("*.wav"):
        print(f"Checking {audio_file.name}...")
        
        # Transcribe the audio
        transcript = transcribe_audio_file(audio_file)
        
        if transcript:
            # Check for quality issues
            issues = check_transcript_quality(transcript)
            
            if issues:
                print(f"  Issues found: {', '.join(issues)}")
                print(f"  Transcript: {transcript[:100]}...")
                problematic_files.append({
                    'file': str(audio_file),
                    'transcript': transcript,
                    'issues': issues
                })
            else:
                print(f"  ✓ Quality OK")
        else:
            print(f"  ✗ Failed to transcribe")
    
    print(f"\nFound {len(problematic_files)} problematic files")
    
    # Save problematic files list
    with open("problematic_segments.json", "w", encoding="utf-8") as f:
        json.dump(problematic_files, f, ensure_ascii=False, indent=2)
    
    print("Problematic segments saved to problematic_segments.json")

if __name__ == "__main__":
    main()
