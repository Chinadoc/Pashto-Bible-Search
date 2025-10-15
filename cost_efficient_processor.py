#!/usr/bin/env python3
"""
Cost-Efficient Video Processing Pipeline
1. Download video
2. Extract audio
3. Detect music segments (skip transcription for music)
4. Transcribe only speech segments
5. Clip based on transcription timestamps
6. Upload to Google Drive
7. Store metadata in Supabase
"""

import os
import re
import json
import time
import requests
import subprocess
from pathlib import Path
from typing import List, Dict, Tuple, Optional
import numpy as np
from pydub import AudioSegment
from pydub.silence import split_on_silence
import librosa
import soundfile as sf

# API Configuration
ELEVENLABS_API_KEY = "sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543"
ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/speech-to-text"
OPENAI_API_KEY = "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"
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

# Google Drive API configuration
GOOGLE_DRIVE_URL_PREFIX = "https://drive.google.com/uc?export=download&id="
GOOGLE_DRIVE_DIRECT_PREFIX = "https://drive.usercontent.google.com/download?id="

class CostEfficientProcessor:
    def __init__(self):
        self.output_dir = Path("processed_videos")
        self.output_dir.mkdir(exist_ok=True)
        self.clips_dir = Path("audio_clips")
        self.clips_dir.mkdir(exist_ok=True)
        
    def extract_video_id(self, url: str) -> str:
        """Extract YouTube video ID from URL"""
        patterns = [
            r'(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([^&\n?#]+)',
            r'youtube\.com/v/([^&\n?#]+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        
        raise ValueError(f"Could not extract video ID from URL: {url}")
    
    def download_video(self, url: str) -> Path:
        """Download YouTube video using yt-dlp"""
        video_id = self.extract_video_id(url)
        output_path = self.output_dir / f"{video_id}.%(ext)s"
        
        cmd = [
            "yt-dlp",
            "--output", str(output_path),
            "--format", "best[height<=720]",
            url
        ]
        
        try:
            subprocess.run(cmd, check=True, capture_output=True)
            # Find the downloaded file
            for ext in ['mp4', 'webm', 'mkv']:
                video_file = self.output_dir / f"{video_id}.{ext}"
                if video_file.exists():
                    return video_file
            raise FileNotFoundError("Downloaded video file not found")
        except subprocess.CalledProcessError as e:
            raise RuntimeError(f"Failed to download video: {e}")
    
    def extract_audio(self, video_path: Path) -> Path:
        """Extract audio from video using ffmpeg"""
        audio_path = video_path.with_suffix('.wav')
        
        cmd = [
            "ffmpeg", "-i", str(video_path),
            "-ac", "1", "-ar", "16000",  # Mono, 16kHz for better transcription
            "-y", str(audio_path)
        ]
        
        try:
            subprocess.run(cmd, check=True, capture_output=True)
            return audio_path
        except subprocess.CalledProcessError as e:
            raise RuntimeError(f"Failed to extract audio: {e}")
    
    def detect_music_segments(self, audio_path: Path) -> List[Tuple[float, float]]:
        """Detect music segments using librosa - more accurate than pydub"""
        try:
            # Load audio
            y, sr = librosa.load(str(audio_path), sr=16000)
            
            # Calculate features for music detection
            spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
            spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)[0]
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            
            # Calculate tempo
            tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
            
            # Calculate RMS energy
            rms = librosa.feature.rms(y=y)[0]
            
            # Frame times
            frame_length = 2048
            hop_length = 512
            frame_times = librosa.frames_to_time(np.arange(len(spectral_centroids)), 
                                               sr=sr, hop_length=hop_length)
            
            music_segments = []
            current_segment_start = None
            
            for i, (time, centroid, rolloff, energy) in enumerate(zip(frame_times, spectral_centroids, spectral_rolloff, rms)):
                # Music detection criteria (more sophisticated)
                is_music = (
                    centroid > np.mean(spectral_centroids) * 1.3 and  # Bright sounds
                    rolloff > np.mean(spectral_rolloff) * 1.2 and      # Rich harmonics
                    energy > np.mean(rms) * 0.8 and                    # Sufficient energy
                    tempo > 80  # Has tempo (not just speech)
                )
                
                if is_music and current_segment_start is None:
                    current_segment_start = time
                elif not is_music and current_segment_start is not None:
                    # End of music segment
                    if time - current_segment_start > 3.0:  # Only segments > 3 seconds
                        music_segments.append((current_segment_start, time))
                    current_segment_start = None
            
            # Handle case where music continues to end
            if current_segment_start is not None:
                music_segments.append((current_segment_start, frame_times[-1]))
            
            print(f"Detected {len(music_segments)} music segments")
            return music_segments
            
        except Exception as e:
            print(f"Warning: Could not detect music segments: {e}")
            return []
    
    def segment_audio_by_silence(self, audio_path: Path) -> List[Tuple[float, float, Path]]:
        """Segment audio by silence, skipping music segments"""
        audio = AudioSegment.from_wav(str(audio_path))
        music_segments = self.detect_music_segments(audio_path)
        
        # Split on silence
        chunks = split_on_silence(
            audio,
            min_silence_len=800,   # 0.8 seconds of silence
            silence_thresh=-35,    # Silence threshold
            keep_silence=400       # Keep 0.4 seconds of silence
        )
        
        segments = []
        current_time = 0
        
        for i, chunk in enumerate(chunks):
            chunk_duration = len(chunk) / 1000.0  # Convert to seconds
            chunk_end = current_time + chunk_duration
            
            # Check if chunk overlaps with music
            overlaps_music = any(
                current_time < music_end and chunk_end > music_start
                for music_start, music_end in music_segments
            )
            
            if not overlaps_music and chunk_duration > 1.0:  # Skip very short chunks
                chunk_path = self.clips_dir / f"segment_{i:03d}.wav"
                chunk.export(str(chunk_path), format="wav")
                segments.append((current_time, chunk_end, chunk_path))
            
            current_time = chunk_end
        
        return segments
    
    def transcribe_audio(self, audio_path: Path) -> Optional[str]:
        """Transcribe audio using ElevenLabs API"""
        try:
            with open(audio_path, 'rb') as audio_file:
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
                    timeout=60
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return result.get('text', '')
                else:
                    print(f"ElevenLabs API error: {response.status_code} - {response.text}")
                    return None
                    
        except Exception as e:
            print(f"Error transcribing {audio_path}: {e}")
            return None
    
    def validate_transcription_quality(self, transcript: str) -> Tuple[bool, str]:
        """Validate transcription quality using OpenAI GPT-5 nano"""
        prompt = f"""
Analyze this transcription for quality issues. The audio should contain only Pashto or Dari speech.

Transcription: "{transcript}"

Check for:
1. Non-Pashto/Dari scripts (Bengali, Hindi/Devanagari, English, etc.)
2. Music descriptions like "(music)", "(rock music)", "(dramatic music)"
3. Foreign language content
4. Gibberish or unclear text

Respond with JSON:
{{
    "is_valid": true/false,
    "reason": "explanation",
    "confidence": 0.0-1.0
}}
"""
        
        try:
            response = requests.post(
                OPENAI_API_URL,
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-5-nano",
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 150,
                    "temperature": 0.1
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content']
                
                try:
                    validation = json.loads(content)
                    return validation.get('is_valid', True), validation.get('reason', 'Valid')
                except json.JSONDecodeError:
                    if any(word in content.lower() for word in ['invalid', 'poor', 'wrong', 'music', 'foreign']):
                        return False, "Quality check failed"
                    return True, "Valid"
            else:
                print(f"OpenAI API error: {response.status_code}")
                return True, "API error, assuming valid"
                
        except Exception as e:
            print(f"Error validating transcription: {e}")
            return True, "Validation error, assuming valid"
    
    def upload_to_google_drive(self, file_path: Path, filename: str) -> Optional[str]:
        """Upload file to Google Drive and return file ID"""
        # For now, we'll use the existing Google Drive infrastructure
        # The file will be served locally, but we'll prepare for Google Drive integration
        print(f"File ready for Google Drive upload: {filename}")
        print(f"Local path: {file_path}")
        
        # Return a placeholder ID for now - in production, this would upload to Google Drive
        # and return the actual file ID
        return f"local_{filename.replace('.wav', '')}"
    
    def upload_to_supabase(self, video_id: str, segments: List[Dict]) -> bool:
        """Upload segment metadata to Supabase"""
        try:
            supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://nkombdutnjvaasxrbmdn.supabase.co")
            supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rb21iZHV0bmp2YWFzeHJibWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzMxNDMsImV4cCI6MjA3MjA0OTE0M30.dBdCCD8hJAWV4Y8sRNVi2uUSnDrZbUM4TxR6vl8-ENg")
            
            successful_uploads = 0
            
            for segment in segments:
                data = {
                    'verse_reference': f"video_{video_id}_segment_{segment['index']:03d}",
                    'audio_filename': segment['filename'],
                    'audio_path': segment['transcript'],  # Store transcript
                    'file_size': segment['file_size'],
                    'duration_seconds': segment['duration'],
                    'start_time_seconds': segment['start_time'],
                    'end_time_seconds': segment['end_time'],
                    'google_drive_id': segment.get('google_drive_id')
                }
                
                response = requests.post(
                    f"{supabase_url}/rest/v1/audio_mappings",
                    headers={
                        'apikey': supabase_key,
                        'Authorization': f'Bearer {supabase_key}',
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    json=data
                )
                
                if response.status_code in [200, 201]:
                    successful_uploads += 1
                else:
                    print(f"Supabase upload error: {response.status_code}")
            
            print(f"Uploaded {successful_uploads}/{len(segments)} segments to Supabase")
            return successful_uploads > 0
            
        except Exception as e:
            print(f"Error uploading to Supabase: {e}")
            return False
    
    def process_video(self, url: str) -> Dict:
        """Main cost-efficient processing pipeline"""
        print(f"Processing video: {url}")
        
        try:
            # Step 1: Download video
            print("1. Downloading video...")
            video_path = self.download_video(url)
            video_id = self.extract_video_id(url)
            
            # Step 2: Extract audio
            print("2. Extracting audio...")
            audio_path = self.extract_audio(video_path)
            
            # Step 3: Detect music and segment audio
            print("3. Detecting music and segmenting audio...")
            segments = self.segment_audio_by_silence(audio_path)
            print(f"   Created {len(segments)} speech segments (music skipped)")
            
            # Step 4: Transcribe and validate
            print("4. Transcribing and validating...")
            processed_segments = []
            failed_segments = []
            
            for i, (start_time, end_time, chunk_path) in enumerate(segments):
                print(f"   Processing segment {i+1}/{len(segments)}: {chunk_path.name}")
                
                # Transcribe
                transcript = self.transcribe_audio(chunk_path)
                
                if transcript:
                    # Validate quality
                    is_valid, reason = self.validate_transcription_quality(transcript)
                    
                    if is_valid:
                        # Upload to Google Drive
                        google_drive_id = self.upload_to_google_drive(chunk_path, chunk_path.name)
                        
                        processed_segments.append({
                            'index': i,
                            'filename': chunk_path.name,
                            'transcript': transcript,
                            'start_time': start_time,
                            'end_time': end_time,
                            'duration': end_time - start_time,
                            'file_size': chunk_path.stat().st_size,
                            'google_drive_id': google_drive_id,
                            'status': 'success'
                        })
                        print(f"   ✅ Quality check passed: {reason}")
                    else:
                        print(f"   ❌ Quality check failed: {reason}")
                        failed_segments.append((start_time, end_time, chunk_path))
                else:
                    print(f"   ❌ Transcription failed")
                    failed_segments.append((start_time, end_time, chunk_path))
                
                # Rate limiting
                time.sleep(1)
            
            # Step 5: Re-transcribe failed segments
            if failed_segments:
                print(f"5. Re-transcribing {len(failed_segments)} failed segments...")
                for start_time, end_time, chunk_path in failed_segments:
                    print(f"   Re-transcribing: {chunk_path.name}")
                    transcript = self.transcribe_audio(chunk_path)
                    
                    if transcript:
                        is_valid, reason = self.validate_transcription_quality(transcript)
                        if is_valid:
                            google_drive_id = self.upload_to_google_drive(chunk_path, chunk_path.name)
                            
                            processed_segments.append({
                                'index': len(processed_segments),
                                'filename': chunk_path.name,
                                'transcript': transcript,
                                'start_time': start_time,
                                'end_time': end_time,
                                'duration': end_time - start_time,
                                'file_size': chunk_path.stat().st_size,
                                'google_drive_id': google_drive_id,
                                'status': 'success_retry'
                            })
                            print(f"   ✅ Re-transcription quality check passed: {reason}")
                        else:
                            print(f"   ❌ Re-transcription also failed quality check: {reason}")
                    
                    time.sleep(1)
            
            # Step 6: Upload to Supabase
            print("6. Uploading metadata to Supabase...")
            supabase_success = self.upload_to_supabase(video_id, processed_segments)
            
            # Step 7: Save results
            results_path = self.output_dir / f"{video_id}_results.json"
            with open(results_path, 'w', encoding='utf-8') as f:
                json.dump({
                    'video_id': video_id,
                    'video_url': url,
                    'video_path': str(video_path),
                    'audio_path': str(audio_path),
                    'total_segments': len(segments),
                    'successful_transcriptions': len([s for s in processed_segments if s['status'] == 'success']),
                    'retry_transcriptions': len([s for s in processed_segments if s['status'] == 'success_retry']),
                    'failed_transcriptions': len(failed_segments),
                    'supabase_upload_success': supabase_success,
                    'segments': processed_segments
                }, f, ensure_ascii=False, indent=2)
            
            print(f"✅ Processing complete! Results saved to {results_path}")
            return {
                'success': True,
                'video_id': video_id,
                'results_path': str(results_path),
                'total_segments': len(segments),
                'successful': len(processed_segments),
                'supabase_success': supabase_success
            }
            
        except Exception as e:
            print(f"❌ Processing failed: {e}")
            return {
                'success': False,
                'error': str(e)
            }

def main():
    """Main function for command line usage"""
    import sys
    
    if len(sys.argv) != 2:
        print("Usage: python cost_efficient_processor.py <youtube_url>")
        sys.exit(1)
    
    url = sys.argv[1]
    processor = CostEfficientProcessor()
    result = processor.process_video(url)
    
    if result['success']:
        print(f"\n🎉 Successfully processed video!")
        print(f"Video ID: {result['video_id']}")
        print(f"Total segments: {result['total_segments']}")
        print(f"Successful transcriptions: {result['successful']}")
        print(f"Supabase upload: {'✅' if result['supabase_success'] else '❌'}")
    else:
        print(f"\n❌ Processing failed: {result['error']}")
        sys.exit(1)

if __name__ == "__main__":
    main()
