#!/usr/bin/env python3
"""
Automated Video Processing Pipeline with Quality Checks
- Downloads YouTube videos
- Segments into optimal chunks to prevent quality loss
- Detects and removes music segments
- Transcribes with ElevenLabs
- Validates transcription quality with OpenAI
- Automatically re-transcribes poor quality segments
"""

import os
import re
import json
import time
import requests
import subprocess
from pathlib import Path
from typing import List, Dict, Tuple, Optional
import librosa
import numpy as np
from pydub import AudioSegment
from pydub.silence import split_on_silence
import nltk
from nltk.tokenize import sent_tokenize

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

# API Configuration
ELEVENLABS_API_KEY = "sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543"
ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/speech-to-text"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")  # Get from environment
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

class AutomatedVideoProcessor:
    def __init__(self):
        self.output_dir = Path("processed_videos")
        self.output_dir.mkdir(exist_ok=True)
        
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
        """Detect music segments using audio analysis"""
        try:
            # Load audio with librosa
            y, sr = librosa.load(str(audio_path), sr=16000)
            
            # Calculate spectral features
            spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
            spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)[0]
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            
            # Calculate tempo (music typically has consistent tempo)
            tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
            
            # Detect music based on:
            # 1. High spectral centroid (bright sounds)
            # 2. Consistent tempo
            # 3. High spectral rolloff (rich harmonics)
            
            frame_length = 2048
            hop_length = 512
            frame_times = librosa.frames_to_time(np.arange(len(spectral_centroids)), 
                                               sr=sr, hop_length=hop_length)
            
            music_segments = []
            current_segment_start = None
            
            for i, (time, centroid, rolloff) in enumerate(zip(frame_times, spectral_centroids, spectral_rolloff)):
                # Music detection criteria
                is_music = (
                    centroid > np.mean(spectral_centroids) * 1.2 and  # Bright sounds
                    rolloff > np.mean(spectral_rolloff) * 1.1 and      # Rich harmonics
                    tempo > 60  # Has tempo (not just speech)
                )
                
                if is_music and current_segment_start is None:
                    current_segment_start = time
                elif not is_music and current_segment_start is not None:
                    # End of music segment
                    if time - current_segment_start > 2.0:  # Only segments > 2 seconds
                        music_segments.append((current_segment_start, time))
                    current_segment_start = None
            
            # Handle case where music continues to end
            if current_segment_start is not None:
                music_segments.append((current_segment_start, frame_times[-1]))
            
            return music_segments
            
        except Exception as e:
            print(f"Warning: Could not detect music segments: {e}")
            return []
    
    def segment_audio_optimally(self, audio_path: Path, max_duration: int = 300) -> List[Path]:
        """Segment audio into optimal chunks to prevent quality loss"""
        audio = AudioSegment.from_wav(str(audio_path))
        
        # Detect music segments
        music_segments = self.detect_music_segments(audio_path)
        
        # Split on silence first
        chunks = split_on_silence(
            audio,
            min_silence_len=1000,  # 1 second of silence
            silence_thresh=-40,    # Silence threshold
            keep_silence=500       # Keep 0.5 seconds of silence
        )
        
        # Further segment chunks that are too long
        final_chunks = []
        chunk_index = 0
        
        for chunk in chunks:
            if len(chunk) <= max_duration * 1000:  # Convert to milliseconds
                final_chunks.append(chunk)
            else:
                # Split long chunks into smaller ones
                num_splits = (len(chunk) // (max_duration * 1000)) + 1
                split_duration = len(chunk) // num_splits
                
                for i in range(num_splits):
                    start_time = i * split_duration
                    end_time = min((i + 1) * split_duration, len(chunk))
                    final_chunks.append(chunk[start_time:end_time])
        
        # Save chunks and avoid music segments
        chunk_paths = []
        for i, chunk in enumerate(final_chunks):
            chunk_start_time = sum(len(c) for c in final_chunks[:i]) / 1000.0
            chunk_end_time = chunk_start_time + len(chunk) / 1000.0
            
            # Check if chunk overlaps with music
            overlaps_music = any(
                chunk_start_time < music_end and chunk_end_time > music_start
                for music_start, music_end in music_segments
            )
            
            if not overlaps_music:
                chunk_path = audio_path.parent / f"{audio_path.stem}_chunk_{i:03d}.wav"
                chunk.export(str(chunk_path), format="wav")
                chunk_paths.append(chunk_path)
            else:
                print(f"Skipping chunk {i} due to music overlap")
        
        return chunk_paths
    
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
        """Validate transcription quality using OpenAI"""
        if not OPENAI_API_KEY:
            print("Warning: No OpenAI API key found, skipping quality validation")
            return True, "No validation performed"
        
        # Check for non-Pashto/Dari content
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
                    "model": "gpt-3.5-turbo",
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 150,
                    "temperature": 0.1
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content']
                
                # Parse JSON response
                try:
                    validation = json.loads(content)
                    return validation.get('is_valid', True), validation.get('reason', 'Valid')
                except json.JSONDecodeError:
                    # Fallback: simple text analysis
                    if any(word in content.lower() for word in ['invalid', 'poor', 'wrong', 'music', 'foreign']):
                        return False, "Quality check failed"
                    return True, "Valid"
            else:
                print(f"OpenAI API error: {response.status_code}")
                return True, "API error, assuming valid"
                
        except Exception as e:
            print(f"Error validating transcription: {e}")
            return True, "Validation error, assuming valid"
    
    def process_video(self, url: str) -> Dict:
        """Main processing pipeline"""
        print(f"Processing video: {url}")
        
        try:
            # Step 1: Download video
            print("1. Downloading video...")
            video_path = self.download_video(url)
            video_id = self.extract_video_id(url)
            
            # Step 2: Extract audio
            print("2. Extracting audio...")
            audio_path = self.extract_audio(video_path)
            
            # Step 3: Segment audio optimally
            print("3. Segmenting audio...")
            chunk_paths = self.segment_audio_optimally(audio_path)
            print(f"   Created {len(chunk_paths)} audio chunks")
            
            # Step 4: Transcribe and validate
            print("4. Transcribing and validating...")
            results = []
            failed_chunks = []
            
            for i, chunk_path in enumerate(chunk_paths):
                print(f"   Processing chunk {i+1}/{len(chunk_paths)}: {chunk_path.name}")
                
                # Transcribe
                transcript = self.transcribe_audio(chunk_path)
                
                if transcript:
                    # Validate quality
                    is_valid, reason = self.validate_transcription_quality(transcript)
                    
                    if is_valid:
                        results.append({
                            'chunk_index': i,
                            'chunk_path': str(chunk_path),
                            'transcript': transcript,
                            'status': 'success'
                        })
                    else:
                        print(f"   Quality check failed: {reason}")
                        failed_chunks.append(chunk_path)
                else:
                    print(f"   Transcription failed")
                    failed_chunks.append(chunk_path)
                
                # Rate limiting
                time.sleep(1)
            
            # Step 5: Re-transcribe failed chunks
            if failed_chunks:
                print(f"5. Re-transcribing {len(failed_chunks)} failed chunks...")
                for chunk_path in failed_chunks:
                    print(f"   Re-transcribing: {chunk_path.name}")
                    transcript = self.transcribe_audio(chunk_path)
                    
                    if transcript:
                        is_valid, reason = self.validate_transcription_quality(transcript)
                        if is_valid:
                            chunk_index = int(re.search(r'chunk_(\d+)', chunk_path.name).group(1))
                            results.append({
                                'chunk_index': chunk_index,
                                'chunk_path': str(chunk_path),
                                'transcript': transcript,
                                'status': 'success_retry'
                            })
                        else:
                            print(f"   Re-transcription also failed quality check: {reason}")
                    
                    time.sleep(1)
            
            # Step 6: Save results
            results_path = self.output_dir / f"{video_id}_results.json"
            with open(results_path, 'w', encoding='utf-8') as f:
                json.dump({
                    'video_id': video_id,
                    'video_url': url,
                    'video_path': str(video_path),
                    'audio_path': str(audio_path),
                    'total_chunks': len(chunk_paths),
                    'successful_transcriptions': len([r for r in results if r['status'] == 'success']),
                    'retry_transcriptions': len([r for r in results if r['status'] == 'success_retry']),
                    'failed_transcriptions': len(failed_chunks),
                    'results': results
                }, f, ensure_ascii=False, indent=2)
            
            print(f"✅ Processing complete! Results saved to {results_path}")
            return {
                'success': True,
                'video_id': video_id,
                'results_path': str(results_path),
                'total_chunks': len(chunk_paths),
                'successful': len(results)
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
        print("Usage: python automated_video_processor.py <youtube_url>")
        sys.exit(1)
    
    url = sys.argv[1]
    processor = AutomatedVideoProcessor()
    result = processor.process_video(url)
    
    if result['success']:
        print(f"\n🎉 Successfully processed video!")
        print(f"Video ID: {result['video_id']}")
        print(f"Total chunks: {result['total_chunks']}")
        print(f"Successful transcriptions: {result['successful']}")
    else:
        print(f"\n❌ Processing failed: {result['error']}")
        sys.exit(1)

if __name__ == "__main__":
    main()
