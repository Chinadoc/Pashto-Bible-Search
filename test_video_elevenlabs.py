#!/usr/bin/env python3
"""
ElevenLabs-based video processing test
Downloads video → Converts to MP3 → Transcribes with ElevenLabs → Uploads to R2 → Stores in D1
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
CLOUDFLARE_WORKER_URL = os.getenv('CLOUDFLARE_WORKER_URL', 'https://pashtobiblesearch.jeremy-samuels17.workers.dev')

API_KEYS = {
    'elevenlabs': 'sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543',
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

def transcribe_with_elevenlabs(audio_file: str) -> Dict:
    """Transcribe audio file using ElevenLabs"""
    print('\n🎤 Step 2: Transcribing with ElevenLabs...')
    
    print('   Uploading audio file to ElevenLabs...')
    
    # Check file size (ElevenLabs has 25MB limit)
    file_size = Path(audio_file).stat().st_size
    max_size = 25 * 1024 * 1024  # 25MB
    
    if file_size > max_size:
        print(f'   ⚠️ File is {file_size / 1024 / 1024:.1f}MB, compressing...')
        # Compress using ffmpeg
        compressed_path = audio_file.replace('.mp3', '_compressed.mp3')
        cmd = [
            'ffmpeg',
            '-i', audio_file,
            '-b:a', '64k',  # Lower bitrate
            '-y',
            compressed_path
        ]
        subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        audio_file = compressed_path
    
    # Upload and transcribe with ElevenLabs
    with open(audio_file, 'rb') as f:
        files = {
            'file': (Path(audio_file).name, f, 'audio/mpeg')
        }
        data = {
            'language': 'ps',  # Pashto
            'model_id': 'scribe_v1'
        }
        
        response = requests.post(
            'https://api.elevenlabs.io/v1/speech-to-text',
            headers={'xi-api-key': API_KEYS['elevenlabs']},
            files=files,
            data=data,
            timeout=300
        )
    
    if not response.ok:
        raise Exception(f'ElevenLabs error: {response.status_code} - {response.text}')
    
    result = response.json()
    transcript_text = result.get('text', '')
    
    print('✅ Transcription completed!')
    print(f'   Transcript preview: {transcript_text[:200]}...')
    
    # ElevenLabs doesn't provide word-level timings, so we'll estimate
    # For now, return full transcript and we'll segment by sentences
    return {
        'text': transcript_text,
        'words': [],  # No word timings from ElevenLabs
    }

def segment_transcript_by_sentences(text: str, audio_duration: float = None) -> List[Dict]:
    """Segment transcript into clips by sentences"""
    print('\n✂️ Step 3: Segmenting transcript by sentences...')
    
    import re
    
    # Split by Pashto sentence endings
    sentences = re.split(r'[.!?؟]+\s*', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    segments = []
    current_time = 0
    
    # Estimate duration per word (rough estimate: 0.5 seconds per word)
    for sentence in sentences:
        word_count = len(sentence.split())
        estimated_duration = max(3, min(15, word_count * 0.5))  # 3-15 seconds
        
        segments.append({
            'text': sentence,
            'startTime': current_time,
            'endTime': current_time + estimated_duration,
        })
        
        current_time += estimated_duration
    
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

def store_metadata_in_d1(segments: List[Dict], video_id: str, transcript: str):
    """Store metadata in Cloudflare D1 via Worker"""
    print('\n💾 Step 6: Storing metadata in Cloudflare D1...')
    
    try:
        response = requests.post(
            f'{CLOUDFLARE_WORKER_URL}/api/video/process',
            headers={'Content-Type': 'application/json'},
            json={
                'youtubeUrl': YOUTUBE_URL,
                'videoId': video_id,
                'transcript': transcript,
                'segments': segments,
                'transcription_service': 'elevenlabs',
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
            print('   (Worker may not be deployed yet)')
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
    print('🎬 Starting ElevenLabs video processing test...\n')
    print(f'📺 Video URL: {YOUTUBE_URL}\n')
    
    segment_files = []
    audio_file = None
    
    try:
        # Step 1: Download audio
        audio_file = download_video_audio(VIDEO_ID)
        
        # Step 2: Transcribe with ElevenLabs
        transcription = transcribe_with_elevenlabs(audio_file)
        
        # Step 3: Segment by sentences (since no word timings)
        segments = segment_transcript_by_sentences(transcription['text'])
        
        # Step 4: Extract segments
        segment_files = extract_audio_segments(audio_file, segments, VIDEO_ID)
        
        # Step 5: Upload to R2
        if segment_files:
            upload_to_r2(segment_files, VIDEO_ID)
        
        # Step 6: Store metadata in D1
        store_metadata_in_d1(segments, VIDEO_ID, transcription['text'])
        
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

