#!/usr/bin/env python3
"""
Offline Video Processing Pipeline
1. Download video from YouTube
2. Extract audio and remove long silent portions
3. Send audio segments to ElevenLabs for transcription
4. Clip audio into 5-15 second segments based on transcripts
5. Handle re-transcription requests for non-Pashto results
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

# API Configuration
ELEVENLABS_API_KEY = "sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543"
ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/speech-to-text"

class OfflineVideoProcessor:
    def __init__(self):
        self.output_dir = Path("processed_videos")
        self.output_dir.mkdir(exist_ok=True)
        self.clips_dir = Path("audio_clips")
        self.clips_dir.mkdir(exist_ok=True)
        self.sentence_clips_dir = Path("sentence_clips")
        self.sentence_clips_dir.mkdir(exist_ok=True)
        
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
    
    def download_video(self, video_id: str) -> str:
        """Download video using yt-dlp"""
        print(f"📥 Downloading video: {video_id}")
        
        output_path = self.output_dir / f"{video_id}.%(ext)s"
        
        cmd = [
            "yt-dlp",
            "--extract-audio",
            "--audio-format", "wav",
            "--output", str(output_path),
            f"https://www.youtube.com/watch?v={video_id}"
        ]
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            if result.returncode != 0:
                raise Exception(f"yt-dlp failed: {result.stderr}")
            
            # Find the downloaded file
            audio_files = list(self.output_dir.glob(f"{video_id}.*"))
            if not audio_files:
                raise Exception("No audio file found after download")
            
            audio_file = audio_files[0]
            print(f"✅ Downloaded: {audio_file}")
            return str(audio_file)
            
        except subprocess.TimeoutExpired:
            raise Exception("Video download timed out")
        except Exception as e:
            raise Exception(f"Download failed: {e}")
    
    def remove_long_silence(self, audio_file: str, min_silence_len: int = 2000, silence_thresh: int = -40) -> str:
        """Remove long silent portions from audio"""
        print(f"🔇 Removing long silence from: {audio_file}")
        
        audio = AudioSegment.from_file(audio_file)
        
        # Split on silence
        chunks = split_on_silence(
            audio,
            min_silence_len=min_silence_len,
            silence_thresh=silence_thresh,
            keep_silence=500  # Keep 500ms of silence between chunks
        )
        
        if not chunks:
            print("⚠️ No speech chunks found, returning original audio")
            return audio_file
        
        # Combine chunks with short gaps
        combined = AudioSegment.empty()
        for i, chunk in enumerate(chunks):
            if i > 0:
                combined += AudioSegment.silent(duration=500)  # 500ms gap
            combined += chunk
        
        # Save processed audio
        processed_file = self.output_dir / f"{Path(audio_file).stem}_processed.wav"
        combined.export(str(processed_file), format="wav")
        
        print(f"✅ Processed audio saved: {processed_file}")
        print(f"📊 Original duration: {len(audio)/1000:.1f}s, Processed: {len(combined)/1000:.1f}s")
        
        return str(processed_file)
    
    def send_to_elevenlabs(self, audio_file: str, attempt: int = 1) -> Dict:
        """Send audio to ElevenLabs for transcription"""
        print(f"🎤 Sending to ElevenLabs (attempt {attempt}): {audio_file}")
        
        headers = {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "audio/wav"
        }
        
        try:
            with open(audio_file, 'rb') as f:
                response = requests.post(
                    ELEVENLABS_API_URL,
                    headers=headers,
                    data=f,
                    timeout=60
                )
            
            if response.status_code == 200:
                result = response.json()
                transcript = result.get('text', '').strip()
                
                print(f"✅ Transcription received: {transcript[:100]}...")
                return {
                    'success': True,
                    'transcript': transcript,
                    'attempt': attempt,
                    'timestamp': time.time()
                }
            else:
                print(f"❌ ElevenLabs API error: {response.status_code} - {response.text}")
                return {
                    'success': False,
                    'error': f"API error: {response.status_code}",
                    'attempt': attempt
                }
                
        except Exception as e:
            print(f"❌ ElevenLabs request failed: {e}")
            return {
                'success': False,
                'error': str(e),
                'attempt': attempt
            }
    
    def is_pashto_text(self, text: str) -> bool:
        """Check if text contains Pashto characters"""
        # Pashto uses Arabic script (U+0600-U+06FF)
        pashto_chars = sum(1 for char in text if 0x0600 <= ord(char) <= 0x06FF)
        total_chars = len([c for c in text if c.isalpha()])
        
        if total_chars == 0:
            return False
        
        return (pashto_chars / total_chars) > 0.3  # At least 30% Pashto characters
    
    def create_sentence_clips(self, audio_file: str, transcript: str, video_id: str) -> List[Dict]:
        """Create 5-15 second clips based on transcript"""
        print(f"✂️ Creating sentence clips from transcript")
        
        # Simple sentence splitting (can be improved)
        sentences = re.split(r'[.!?]+\s*', transcript)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        audio = AudioSegment.from_file(audio_file)
        total_duration = len(audio)
        
        clips = []
        current_time = 0
        
        for i, sentence in enumerate(sentences):
            if not sentence:
                continue
            
            # Estimate duration based on sentence length (rough estimate)
            estimated_duration = max(5000, min(15000, len(sentence) * 100))  # 5-15 seconds
            
            # Ensure we don't exceed audio length
            end_time = min(current_time + estimated_duration, total_duration)
            
            if current_time >= total_duration:
                break
            
            # Extract clip
            clip = audio[current_time:end_time]
            
            # Save clip
            clip_filename = f"{video_id}_sentence_{i+1:03d}.wav"
            clip_path = self.sentence_clips_dir / clip_filename
            clip.export(str(clip_path), format="wav")
            
            clips.append({
                'sentence_number': i + 1,
                'sentence': sentence,
                'start_time': current_time / 1000,
                'end_time': end_time / 1000,
                'duration': (end_time - current_time) / 1000,
                'filename': clip_filename,
                'file_path': str(clip_path)
            })
            
            current_time = end_time
        
        print(f"✅ Created {len(clips)} sentence clips")
        return clips
    
    def process_video(self, youtube_url: str) -> Dict:
        """Main processing pipeline"""
        print(f"🎬 Starting offline video processing: {youtube_url}")
        
        try:
            # Extract video ID
            video_id = self.extract_video_id(youtube_url)
            print(f"📋 Video ID: {video_id}")
            
            # Download video
            audio_file = self.download_video(video_id)
            
            # Remove long silence
            processed_audio = self.remove_long_silence(audio_file)
            
            # Send to ElevenLabs
            transcription_result = self.send_to_elevenlabs(processed_audio)
            
            if not transcription_result['success']:
                return {
                    'success': False,
                    'error': f"Transcription failed: {transcription_result['error']}",
                    'video_id': video_id
                }
            
            transcript = transcription_result['transcript']
            is_pashto = self.is_pashto_text(transcript)
            
            # Create sentence clips
            clips = self.create_sentence_clips(processed_audio, transcript, video_id)
            
            # Save results
            results = {
                'success': True,
                'video_id': video_id,
                'youtube_url': youtube_url,
                'audio_file': processed_audio,
                'transcription': {
                    'attempt': transcription_result['attempt'],
                    'transcript': transcript,
                    'is_pashto': is_pashto,
                    'timestamp': transcription_result['timestamp']
                },
                'clips': clips,
                'total_clips': len(clips),
                'total_duration': sum(clip['duration'] for clip in clips)
            }
            
            # Save to JSON file
            results_file = self.output_dir / f"{video_id}_results.json"
            with open(results_file, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Processing complete!")
            print(f"📊 Video ID: {video_id}")
            print(f"📝 Transcript: {transcript[:100]}...")
            print(f"🔤 Is Pashto: {is_pashto}")
            print(f"✂️ Clips created: {len(clips)}")
            print(f"⏱️ Total duration: {results['total_duration']:.1f}s")
            
            return results
            
        except Exception as e:
            print(f"❌ Processing failed: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def retry_transcription(self, video_id: str, audio_file: str, attempt: int = 2) -> Dict:
        """Retry transcription for a specific video"""
        print(f"🔄 Retrying transcription for {video_id} (attempt {attempt})")
        
        transcription_result = self.send_to_elevenlabs(audio_file, attempt)
        
        if not transcription_result['success']:
            return transcription_result
        
        transcript = transcription_result['transcript']
        is_pashto = self.is_pashto_text(transcript)
        
        # Load existing results
        results_file = self.output_dir / f"{video_id}_results.json"
        if results_file.exists():
            with open(results_file, 'r', encoding='utf-8') as f:
                results = json.load(f)
        else:
            return {
                'success': False,
                'error': 'No existing results found for retry'
            }
        
        # Add new transcription attempt
        if 'transcription_attempts' not in results:
            results['transcription_attempts'] = []
        
        results['transcription_attempts'].append({
            'attempt': attempt,
            'transcript': transcript,
            'is_pashto': is_pashto,
            'timestamp': transcription_result['timestamp']
        })
        
        # Update current transcription
        results['transcription'] = {
            'attempt': attempt,
            'transcript': transcript,
            'is_pashto': is_pashto,
            'timestamp': transcription_result['timestamp']
        }
        
        # Save updated results
        with open(results_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Retry complete!")
        print(f"📝 New transcript: {transcript[:100]}...")
        print(f"🔤 Is Pashto: {is_pashto}")
        
        return {
            'success': True,
            'transcript': transcript,
            'is_pashto': is_pashto,
            'attempt': attempt
        }

def main():
    """Main function to process the specific video"""
    video_url = "https://www.youtube.com/watch?v=0tvvnixN7iw&t=724s"
    
    processor = OfflineVideoProcessor()
    
    print("🎬 Starting offline video processing")
    print(f"📺 Video URL: {video_url}")
    print("=" * 50)
    
    # Process the video
    result = processor.process_video(video_url)
    
    if result['success']:
        print("\n" + "=" * 50)
        print("✅ PROCESSING COMPLETE!")
        print(f"📊 Video ID: {result['video_id']}")
        print(f"📝 Transcript: {result['transcription']['transcript']}")
        print(f"🔤 Is Pashto: {result['transcription']['is_pashto']}")
        print(f"✂️ Clips created: {result['total_clips']}")
        print(f"⏱️ Total duration: {result['total_duration']:.1f}s")
        
        if not result['transcription']['is_pashto']:
            print("\n⚠️ WARNING: Transcript doesn't appear to be Pashto!")
            print("🔄 You can retry transcription by running:")
            print(f"   python3 process_video_offline.py --retry {result['video_id']}")
    else:
        print("\n" + "=" * 50)
        print("❌ PROCESSING FAILED!")
        print(f"Error: {result['error']}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--retry":
        if len(sys.argv) < 3:
            print("Usage: python3 process_video_offline.py --retry <video_id>")
            sys.exit(1)
        
        video_id = sys.argv[2]
        processor = OfflineVideoProcessor()
        
        # Find the audio file
        audio_files = list(processor.output_dir.glob(f"{video_id}*processed.wav"))
        if not audio_files:
            print(f"❌ No processed audio file found for video ID: {video_id}")
            sys.exit(1)
        
        audio_file = str(audio_files[0])
        print(f"🔄 Retrying transcription for {video_id}")
        print(f"📁 Audio file: {audio_file}")
        
        result = processor.retry_transcription(video_id, audio_file)
        
        if result['success']:
            print("✅ Retry successful!")
            print(f"📝 New transcript: {result['transcript']}")
            print(f"🔤 Is Pashto: {result['is_pashto']}")
        else:
            print(f"❌ Retry failed: {result['error']}")
    else:
        main()
