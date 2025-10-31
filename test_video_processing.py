#!/usr/bin/env python3
"""
Test script to process YouTube video locally and upload to Cloudflare
- Downloads video audio
- Transcribes with AssemblyAI (via API)
- Extracts audio segments
- Uploads segments to Cloudflare R2
- Stores metadata in Cloudflare D1
"""

import os
import sys
import json
import time
import requests
import subprocess
from pathlib import Path
from typing import List, Dict

YOUTUBE_URL = 'https://www.youtube.com/watch?v=u9sU5l92Th4'
VIDEO_ID = 'u9sU5l92Th4'
API_URL = 'http://localhost:3000'
CLOUDFLARE_WORKER_URL = os.getenv('CLOUDFLARE_WORKER_URL', 'https://pashtobiblesearch.jeremy-samuels17.workers.dev')

API_KEYS = {
    'elevenlabs': 'sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543',
    'assemblyai': '4c15846aff03429e99207a86450addae',
    'huggingface': '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',
    'deepseek': 'sk-9d567276d4ad41a08a074a0a83de1a67',
}

def download_video_audio(video_id: str) -> str:
    """Download video audio using yt-dlp"""
    print('📥 Step 1: Downloading video audio...')
    
    temp_dir = Path('temp')
    temp_dir.mkdir(exist_ok=True)
    output_path = temp_dir / f'{video_id}.mp3'
    
    try:
        cmd = [
            'yt-dlp',
            '--extract-audio',
            '--audio-format', 'mp3',
            '--output', str(output_path),
            YOUTUBE_URL
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        if result.returncode != 0:
            raise Exception(f'yt-dlp failed: {result.stderr}')
        
        print(f'✅ Audio downloaded: {output_path}')
        return str(output_path)
    except Exception as e:
        print(f'❌ Download failed: {e}')
        raise

def transcribe_with_assemblyai(audio_file: str) -> Dict:
    """Transcribe audio file using AssemblyAI"""
    print('\n🎤 Step 2: Transcribing with AssemblyAI...')
    
    # First, upload audio file to AssemblyAI
    print('   Uploading audio file...')
    with open(audio_file, 'rb') as f:
        upload_response = requests.post(
            'https://api.assemblyai.com/v2/upload',
            headers={'Authorization': API_KEYS['assemblyai']},
            files={'file': f},
            timeout=300
        )
    
    if not upload_response.ok:
        raise Exception(f'AssemblyAI upload error: {upload_response.status_code} - {upload_response.text}')
    
    upload_url = upload_response.json()['upload_url']
    print(f'   Audio uploaded: {upload_url}')
    
    # Start transcription
    response = requests.post(
        'https://api.assemblyai.com/v2/transcript',
        headers={
            'Authorization': API_KEYS['assemblyai'],
            'Content-Type': 'application/json',
        },
        json={
            'audio_url': upload_url,
            'language_code': 'ps',
            'word_boost': ['خدای', 'عیسی', 'پیغمبر', 'کتاب', 'تورات', 'انجیل'],
        },
        timeout=30
    )
    
    if not response.ok:
        raise Exception(f'AssemblyAI start error: {response.status_code} - {response.text}')
    
    job = response.json()
    transcript_id = job['id']
    print(f'   Transcription job started: {transcript_id}')
    
    # Poll for completion
    attempt = 0
    max_attempts = 120
    
    while attempt < max_attempts:
        time.sleep(5)
        
        status_response = requests.get(
            f'https://api.assemblyai.com/v2/transcript/{transcript_id}',
            headers={'Authorization': API_KEYS['assemblyai']},
            timeout=30
        )
        
        if not status_response.ok:
            raise Exception(f'AssemblyAI status error: {status_response.status_code}')
        
        status = status_response.json()
        
        if status['status'] == 'completed':
            print('✅ Transcription completed!')
            print(f'   Transcript preview: {status["text"][:100]}...')
            return {
                'text': status['text'],
                'words': status.get('words', []),
            }
        elif status['status'] == 'error':
            raise Exception(f'AssemblyAI error: {status.get("error", "Unknown error")}')
        
        attempt += 1
        if attempt % 12 == 0:
            print(f'   ⏳ Waiting... ({attempt * 5 // 60} minutes elapsed)')
    
    raise Exception('Transcription timeout after 10 minutes')

def segment_transcript(words: List[Dict]) -> List[Dict]:
    """Segment transcript into clips"""
    print('\n✂️ Step 3: Segmenting transcript...')
    
    segments = []
    current_segment = []
    
    for word in words:
        current_segment.append(word)
        
        end_of_sentence = word['text'].endswith('.') or word['text'].endswith('؟') or word['text'].endswith('!')
        too_many_words = len(current_segment) >= 15
        
        if (end_of_sentence and len(current_segment) >= 3) or (too_many_words and len(current_segment) >= 10):
            if current_segment:
                text = ' '.join(w['text'] for w in current_segment)
                start_time = current_segment[0]['start'] / 1000
                end_time = current_segment[-1]['end'] / 1000
                
                segments.append({
                    'text': text,
                    'startTime': start_time,
                    'endTime': end_time,
                })
                current_segment = []
    
    # Add remaining words
    if current_segment:
        text = ' '.join(w['text'] for w in current_segment)
        start_time = current_segment[0]['start'] / 1000
        end_time = current_segment[-1]['end'] / 1000
        segments.append({
            'text': text,
            'startTime': start_time,
            'endTime': end_time,
        })
    
    print(f'✅ Created {len(segments)} segments')
    return segments

def extract_audio_segments(audio_file: str, segments: List[Dict], video_id: str) -> List[str]:
    """Extract audio segments using ffmpeg"""
    print('\n🎵 Step 4: Extracting audio segments...')
    
    segment_files = []
    temp_dir = Path('temp')
    
    for i, segment in enumerate(segments):
        output_path = temp_dir / f'{video_id}_segment_{i + 1}.mp3'
        
        try:
            start = int(segment['startTime'])
            duration = int(segment['endTime'] - segment['startTime'])
            
            cmd = [
                'ffmpeg',
                '-i', audio_file,
                '-ss', str(start),
                '-t', str(duration),
                '-acodec', 'copy',
                str(output_path),
                '-y'
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            if result.returncode != 0:
                print(f'   ⚠ Failed to extract segment {i + 1}: {result.stderr[:100]}')
                continue
            
            segment_files.append(str(output_path))
            print(f'   ✓ Segment {i + 1}/{len(segments)}: {start}s - {start + duration}s')
        except Exception as e:
            print(f'   ✗ Failed to extract segment {i + 1}: {e}')
    
    print(f'✅ Extracted {len(segment_files)} audio segments')
    return segment_files

def upload_to_r2(segment_files: List[str], video_id: str):
    """Upload audio segments to Cloudflare R2 using wrangler"""
    print('\n☁️ Step 5: Uploading to Cloudflare R2...')
    
    for i, segment_file in enumerate(segment_files):
        r2_key = f'videos/{video_id}/segment_{i + 1}.mp3'
        
        try:
            cmd = [
                'wrangler', 'r2', 'object', 'put',
                f'pashto-bible-audio/{r2_key}',
                '--file', segment_file
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            if result.returncode != 0:
                print(f'   ⚠ Failed to upload segment {i + 1}: {result.stderr[:200]}')
                continue
            
            print(f'   ✓ Uploaded segment {i + 1} to R2: {r2_key}')
        except Exception as e:
            print(f'   ✗ Failed to upload segment {i + 1}: {e}')
    
    print('✅ Upload complete!')

def store_metadata_in_d1(segments: List[Dict], video_id: str):
    """Store metadata in Cloudflare D1 via Worker"""
    print('\n💾 Step 6: Storing metadata in Cloudflare D1...')
    
    try:
        # Combine transcript text
        transcript_text = ' '.join(s['text'] for s in segments)
        
        response = requests.post(
            f'{CLOUDFLARE_WORKER_URL}/api/video/process',
            headers={'Content-Type': 'application/json'},
            json={
                'youtubeUrl': YOUTUBE_URL,
                'videoId': video_id,
                'transcript': transcript_text,
                'segments': segments,
                'apiKeys': API_KEYS,
            },
            timeout=30
        )
        
        if response.ok:
            print('✅ Metadata stored in D1')
            result = response.json()
            print(f'   Video ID: {result.get("videoId", video_id)}')
            print(f'   Segments: {len(result.get("segments", []))}')
        else:
            print(f'⚠️ Failed to store metadata: {response.status_code} - {response.text[:200]}')
    except Exception as e:
        print(f'⚠️ Failed to store metadata: {e}')

def cleanup(files: List[str]):
    """Clean up temporary files"""
    print('\n🧹 Cleaning up temporary files...')
    
    for file_path in files:
        try:
            Path(file_path).unlink(missing_ok=True)
            print(f'   ✓ Deleted {file_path}')
        except Exception:
            pass

def main():
    print('🎬 Starting local video processing test...\n')
    print(f'📺 Video URL: {YOUTUBE_URL}\n')
    
    segment_files = []
    audio_file = None
    
    try:
        # Step 1: Download audio
        audio_file = download_video_audio(VIDEO_ID)
        
        # Step 2: Transcribe
        transcription = transcribe_with_assemblyai(audio_file)
        
        # Step 3: Segment
        segments = segment_transcript(transcription['words'])
        
        # Step 4: Extract segments
        segment_files = extract_audio_segments(audio_file, segments, VIDEO_ID)
        
        # Step 5: Upload to R2
        if segment_files:
            upload_to_r2(segment_files, VIDEO_ID)
        
        # Step 6: Store metadata in D1
        store_metadata_in_d1(segments, VIDEO_ID)
        
        # Summary
        print('\n✅ Video processing complete!')
        print(f'\n📊 Summary:')
        print(f'   Video ID: {VIDEO_ID}')
        print(f'   Transcript preview: {transcription["text"][:200]}...')
        print(f'   Segments: {len(segments)}')
        print(f'   Audio clips: {len(segment_files)}')
        print(f'\n🌐 Metadata stored in Cloudflare D1')
        print(f'📁 Audio clips stored in Cloudflare R2')
        
    except Exception as e:
        print(f'\n❌ Processing failed: {e}')
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        # Cleanup
        if audio_file:
            cleanup([audio_file] + segment_files)

if __name__ == '__main__':
    main()

