#!/usr/bin/env python3
"""
YouTube Audio Processor for Pashto Bible Search
Downloads YouTube videos, splits them into 5-minute segments, extracts audio,
and transcribes using ElevenLabs API to Pashto text.
"""

import os
import sys
import json
import subprocess
import requests
from pathlib import Path
from typing import List, Dict, Optional
import time
import argparse
from urllib.parse import urlparse, parse_qs

# Configuration
YOUTUBE_URL = "https://www.youtube.com/watch?v=Xqn_-onV9DQ"
SEGMENT_DURATION = 300  # 5 minutes in seconds
AUDIO_CLIPS_DIR = "audio_clips"
POEMS_DIR = "poems"
VIDEO_DIR = "videos"

class YouTubeAudioProcessor:
    def __init__(self, elevenlabs_api_key: Optional[str] = None, supabase_url: Optional[str] = None, supabase_key: Optional[str] = None):
        self.elevenlabs_api_key = elevenlabs_api_key
        self.supabase_url = supabase_url
        self.supabase_key = supabase_key
        self.audio_clips_dir = Path(AUDIO_CLIPS_DIR)
        self.poems_dir = Path(POEMS_DIR)
        self.video_dir = Path(VIDEO_DIR)
        
        # Create directories
        self.audio_clips_dir.mkdir(exist_ok=True)
        self.poems_dir.mkdir(exist_ok=True)
        self.video_dir.mkdir(exist_ok=True)
        
    def check_dependencies(self) -> bool:
        """Check if required tools are installed."""
        # Try common installation paths
        tool_paths = {
            'yt-dlp': ['yt-dlp', '/opt/homebrew/bin/yt-dlp', '/usr/local/bin/yt-dlp'],
            'ffmpeg': ['ffmpeg', '/opt/homebrew/bin/ffmpeg', '/usr/local/bin/ffmpeg']
        }
        
        missing_tools = []
        
        for tool, paths in tool_paths.items():
            found = False
            for path in paths:
                try:
                    if tool == 'ffmpeg':
                        subprocess.run([path, '-version'], 
                                     capture_output=True, check=True)
                    else:
                        subprocess.run([path, '--version'], 
                                     capture_output=True, check=True)
                    found = True
                    break
                except (subprocess.CalledProcessError, FileNotFoundError):
                    continue
            
            if not found:
                missing_tools.append(tool)
        
        if missing_tools:
            print(f"❌ Missing required tools: {', '.join(missing_tools)}")
            print("Please install them:")
            print("  pip install yt-dlp")
            print("  # Install ffmpeg from https://ffmpeg.org/download.html")
            return False
        
        return True
    
    def download_video(self, url: str) -> Optional[str]:
        """Download YouTube video using yt-dlp."""
        print(f"📥 Downloading video from {url}")
        
        output_template = str(self.video_dir / "%(title)s.%(ext)s")
        
        try:
            # Find yt-dlp path
            ytdlp_path = None
            for path in ['yt-dlp', '/opt/homebrew/bin/yt-dlp', '/usr/local/bin/yt-dlp']:
                try:
                    subprocess.run([path, '--version'], capture_output=True, check=True)
                    ytdlp_path = path
                    break
                except (subprocess.CalledProcessError, FileNotFoundError):
                    continue
            
            if not ytdlp_path:
                print("❌ yt-dlp not found")
                return None
            
            cmd = [
                ytdlp_path,
                '--output', output_template,
                url
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            print("✅ Video downloaded successfully")
            
            # Find the downloaded file
            for file in self.video_dir.glob("*"):
                if file.suffix in ['.mp4', '.webm', '.mkv']:
                    return str(file)
            
            print("❌ Could not find downloaded video file")
            return None
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Error downloading video: {e}")
            print(f"stderr: {e.stderr}")
            return None
    
    def get_video_duration(self, video_path: str) -> float:
        """Get video duration using ffprobe."""
        try:
            # Find ffprobe path
            ffprobe_path = None
            for path in ['ffprobe', '/opt/homebrew/bin/ffprobe', '/usr/local/bin/ffprobe']:
                try:
                    subprocess.run([path, '-version'], capture_output=True, check=True)
                    ffprobe_path = path
                    break
                except (subprocess.CalledProcessError, FileNotFoundError):
                    continue
            
            if not ffprobe_path:
                print("❌ ffprobe not found")
                return 0.0
            
            cmd = [
                ffprobe_path, '-v', 'quiet', '-show_entries', 
                'format=duration', '-of', 'csv=p=0', video_path
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return float(result.stdout.strip())
        except (subprocess.CalledProcessError, ValueError):
            print(f"❌ Could not get duration for {video_path}")
            return 0.0
    
    def split_video(self, video_path: str) -> List[str]:
        """Split video into 5-minute segments."""
        print(f"✂️ Splitting video into {SEGMENT_DURATION}-second segments")
        
        duration = self.get_video_duration(video_path)
        if duration == 0:
            return []
        
        segments = []
        segment_count = int(duration // SEGMENT_DURATION) + (1 if duration % SEGMENT_DURATION > 0 else 0)
        
        video_name = Path(video_path).stem
        
        for i in range(segment_count):
            start_time = i * SEGMENT_DURATION
            output_path = self.video_dir / f"{video_name}_segment_{i+1:03d}.mp4"
            
            try:
                # Find ffmpeg path
                ffmpeg_path = None
                for path in ['ffmpeg', '/opt/homebrew/bin/ffmpeg', '/usr/local/bin/ffmpeg']:
                    try:
                        subprocess.run([path, '-version'], capture_output=True, check=True)
                        ffmpeg_path = path
                        break
                    except (subprocess.CalledProcessError, FileNotFoundError):
                        continue
                
                if not ffmpeg_path:
                    print(f"❌ ffmpeg not found for segment {i+1}")
                    continue
                
                cmd = [
                    ffmpeg_path, '-i', video_path,
                    '-ss', str(start_time),
                    '-t', str(SEGMENT_DURATION),
                    '-c', 'copy',  # Copy without re-encoding for speed
                    '-avoid_negative_ts', 'make_zero',
                    str(output_path),
                    '-y'  # Overwrite output files
                ]
                
                subprocess.run(cmd, capture_output=True, check=True)
                segments.append(str(output_path))
                print(f"✅ Created segment {i+1}/{segment_count}: {output_path.name}")
                
            except subprocess.CalledProcessError as e:
                print(f"❌ Error creating segment {i+1}: {e}")
                continue
        
        return segments
    
    def extract_audio(self, video_path: str) -> Optional[str]:
        """Extract audio from video segment."""
        video_name = Path(video_path).stem
        audio_path = self.audio_clips_dir / f"{video_name}.wav"
        
        try:
            # Find ffmpeg path
            ffmpeg_path = None
            for path in ['ffmpeg', '/opt/homebrew/bin/ffmpeg', '/usr/local/bin/ffmpeg']:
                try:
                    subprocess.run([path, '-version'], capture_output=True, check=True)
                    ffmpeg_path = path
                    break
                except (subprocess.CalledProcessError, FileNotFoundError):
                    continue
            
            if not ffmpeg_path:
                print("❌ ffmpeg not found")
                return None
            
            cmd = [
                ffmpeg_path, '-i', video_path,
                '-vn',  # No video
                '-acodec', 'pcm_s16le',  # 16-bit PCM
                '-ar', '16000',  # 16kHz sample rate (good for speech)
                '-ac', '1',  # Mono
                str(audio_path),
                '-y'
            ]
            
            subprocess.run(cmd, capture_output=True, check=True)
            return str(audio_path)
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Error extracting audio from {video_path}: {e}")
            return None
    
    def transcribe_with_elevenlabs(self, audio_path: str) -> Optional[str]:
        """Transcribe audio using ElevenLabs API."""
        if not self.elevenlabs_api_key:
            print("❌ ElevenLabs API key not provided")
            return None
        
        print(f"🎤 Transcribing {Path(audio_path).name} with ElevenLabs")
        
        try:
            # ElevenLabs Speech-to-Text API endpoint
            url = "https://api.elevenlabs.io/v1/speech-to-text"
            
            headers = {
                "xi-api-key": self.elevenlabs_api_key
            }
            
            with open(audio_path, 'rb') as audio_file:
                files = {
                    'file': (Path(audio_path).name, audio_file, 'audio/wav')
                }
                
                # Add language parameter for Pashto
                data = {
                    'language': 'ps',  # Pashto language code
                    'model_id': 'scribe_v1'  # Use available model
                }
                
                response = requests.post(url, headers=headers, files=files, data=data)
                
                if response.status_code == 200:
                    result = response.json()
                    transcript = result.get('text', '')
                    print(f"✅ Transcription completed: {len(transcript)} characters")
                    return transcript
                else:
                    print(f"❌ ElevenLabs API error: {response.status_code}")
                    print(f"Response: {response.text}")
                    return None
                    
        except Exception as e:
            print(f"❌ Error transcribing with ElevenLabs: {e}")
            return None
    
    def save_transcript(self, transcript: str, audio_path: str) -> str:
        """Save transcript to file."""
        audio_name = Path(audio_path).stem
        transcript_path = self.poems_dir / f"{audio_name}.txt"
        
        with open(transcript_path, 'w', encoding='utf-8') as f:
            f.write(transcript)
        
        print(f"💾 Saved transcript: {transcript_path}")
        return str(transcript_path)
    
    def extract_video_id(self, url: str) -> Optional[str]:
        """Extract YouTube video ID from URL."""
        try:
            parsed_url = urlparse(url)
            if parsed_url.hostname in ['www.youtube.com', 'youtube.com']:
                query_params = parse_qs(parsed_url.query)
                return query_params.get('v', [None])[0]
            elif parsed_url.hostname in ['youtu.be']:
                return parsed_url.path[1:]  # Remove leading slash
        except Exception:
            pass
        return None
    
    def upload_to_supabase(self, video_id: str, video_title: str, segment_number: int, 
                          start_time: int, end_time: int, transcript: str, 
                          audio_path: str, transcript_path: str) -> bool:
        """Upload transcript data to Supabase."""
        if not self.supabase_url or not self.supabase_key:
            print("⚠️ Supabase credentials not provided, skipping database upload")
            return False
        
        try:
            data = {
                'video_id': video_id,
                'video_title': video_title,
                'segment_number': segment_number,
                'start_time_seconds': start_time,
                'end_time_seconds': end_time,
                'transcript_text': transcript,
                'audio_file_path': str(audio_path),
                'transcript_file_path': str(transcript_path)
            }
            
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(
                f"{self.supabase_url}/rest/v1/video_transcripts",
                headers=headers,
                json=data
            )
            
            if response.status_code in [200, 201]:
                print(f"✅ Uploaded transcript to Supabase: segment {segment_number}")
                return True
            else:
                print(f"❌ Supabase upload failed: {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error uploading to Supabase: {e}")
            return False
    
    def process_video(self, url: str) -> Dict[str, List[str]]:
        """Main processing pipeline."""
        print("🚀 Starting YouTube audio processing pipeline")
        
        # Check dependencies
        if not self.check_dependencies():
            return {"error": "Missing dependencies"}
        
        # Download video
        video_path = self.download_video(url)
        if not video_path:
            return {"error": "Failed to download video"}
        
        # Split video
        segments = self.split_video(video_path)
        if not segments:
            return {"error": "Failed to split video"}
        
        # Extract video metadata
        video_id = self.extract_video_id(url)
        video_title = Path(video_path).stem if video_path else "Unknown Video"
        
        # Process each segment
        audio_files = []
        transcript_files = []
        supabase_uploads = 0
        
        for i, segment_path in enumerate(segments, 1):
            print(f"\n📝 Processing segment {i}/{len(segments)}")
            
            # Extract audio
            audio_path = self.extract_audio(segment_path)
            if not audio_path:
                continue
            
            audio_files.append(audio_path)
            
            # Transcribe audio
            transcript = self.transcribe_with_elevenlabs(audio_path)
            if transcript:
                transcript_path = self.save_transcript(transcript, audio_path)
                transcript_files.append(transcript_path)
                
                # Upload to Supabase
                start_time = (i - 1) * SEGMENT_DURATION
                end_time = i * SEGMENT_DURATION
                
                if self.upload_to_supabase(
                    video_id or "unknown",
                    video_title,
                    i,
                    start_time,
                    end_time,
                    transcript,
                    audio_path,
                    transcript_path
                ):
                    supabase_uploads += 1
            
            # Add delay to avoid rate limiting
            time.sleep(1)
        
        return {
            "video_segments": segments,
            "audio_files": audio_files,
            "transcript_files": transcript_files,
            "total_segments": len(segments),
            "processed_segments": len(audio_files),
            "supabase_uploads": supabase_uploads,
            "video_id": video_id,
            "video_title": video_title
        }
    
    def create_metadata(self, results: Dict) -> str:
        """Create metadata file for the processed content."""
        metadata = {
            "youtube_url": YOUTUBE_URL,
            "processed_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "segment_duration_seconds": SEGMENT_DURATION,
            "results": results
        }
        
        metadata_path = self.video_dir / "processing_metadata.json"
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)
        
        return str(metadata_path)

def main():
    parser = argparse.ArgumentParser(description="Process YouTube video for Pashto transcription")
    parser.add_argument("--elevenlabs-key", help="ElevenLabs API key")
    parser.add_argument("--supabase-url", help="Supabase URL")
    parser.add_argument("--supabase-key", help="Supabase anon key")
    parser.add_argument("--url", default=YOUTUBE_URL, help="YouTube URL to process")
    
    args = parser.parse_args()
    
    # Get API keys from environment if not provided
    elevenlabs_key = args.elevenlabs_key or os.getenv('ELEVENLABS_API_KEY')
    supabase_url = args.supabase_url or os.getenv('SUPABASE_URL')
    supabase_key = args.supabase_key or os.getenv('SUPABASE_ANON_KEY')
    
    processor = YouTubeAudioProcessor(elevenlabs_key, supabase_url, supabase_key)
    results = processor.process_video(args.url)
    
    if "error" in results:
        print(f"❌ Processing failed: {results['error']}")
        sys.exit(1)
    
    # Create metadata
    metadata_path = processor.create_metadata(results)
    
    print("\n🎉 Processing completed!")
    print(f"📊 Results:")
    print(f"  - Video segments: {results['total_segments']}")
    print(f"  - Audio files: {results['processed_segments']}")
    print(f"  - Transcripts: {len(results['transcript_files'])}")
    print(f"  - Supabase uploads: {results['supabase_uploads']}")
    print(f"  - Video ID: {results['video_id']}")
    print(f"  - Video Title: {results['video_title']}")
    print(f"  - Metadata: {metadata_path}")
    
    print(f"\n📁 Files created:")
    print(f"  - Audio clips: {AUDIO_CLIPS_DIR}/")
    print(f"  - Transcripts: {POEMS_DIR}/")
    print(f"  - Video segments: {VIDEO_DIR}/")

if __name__ == "__main__":
    main()
