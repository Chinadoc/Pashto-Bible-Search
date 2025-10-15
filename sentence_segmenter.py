#!/usr/bin/env python3
"""
Sentence-based Audio Segmenter for Pashto Bible Search
Breaks existing 5-minute audio segments into 10-20 second sentence-based chunks
"""

import os
import sys
import subprocess
import requests
from pathlib import Path
from typing import List, Dict, Optional
import re
import time

# Configuration
AUDIO_CLIPS_DIR = "audio_clips"
SENTENCE_CLIPS_DIR = "sentence_clips"
TARGET_DURATION_MIN = 10  # Minimum 10 seconds
TARGET_DURATION_MAX = 20  # Maximum 20 seconds
ELEVENLABLS_API_KEY = "sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543"

class SentenceSegmenter:
    def __init__(self, elevenlabs_api_key: str):
        self.elevenlabs_api_key = elevenlabs_api_key
        self.audio_clips_dir = Path(AUDIO_CLIPS_DIR)
        self.sentence_clips_dir = Path(SENTENCE_CLIPS_DIR)
        self.sentence_clips_dir.mkdir(exist_ok=True)
        
    def check_dependencies(self) -> bool:
        """Check if required tools are installed."""
        try:
            subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("❌ ffmpeg not found. Please install ffmpeg first.")
            return False
    
    def detect_sentences(self, text: str) -> List[str]:
        """Detect sentence boundaries in Pashto text."""
        # Pashto sentence endings
        sentence_endings = ['.', '!', '?', '۔', '؟', '!']
        
        sentences = []
        current_sentence = ""
        
        for char in text:
            current_sentence += char
            if char in sentence_endings:
                sentence = current_sentence.strip()
                if sentence and len(sentence) > 10:  # Minimum sentence length
                    sentences.append(sentence)
                current_sentence = ""
        
        # Add remaining text as last sentence if it exists
        if current_sentence.strip() and len(current_sentence.strip()) > 10:
            sentences.append(current_sentence.strip())
            
        return sentences
    
    def estimate_speech_duration(self, text: str) -> float:
        """Estimate speech duration based on text length."""
        # Rough estimate: 3-4 characters per second for Pashto
        chars_per_second = 3.5
        return len(text) / chars_per_second
    
    def split_audio_by_sentences(self, audio_file: Path, transcript: str) -> List[Dict]:
        """Split audio file into sentence-based segments."""
        sentences = self.detect_sentences(transcript)
        
        if not sentences:
            print(f"⚠️ No sentences detected in transcript for {audio_file.name}")
            return []
        
        segments = []
        current_start = 0.0
        segment_index = 1
        
        for sentence in sentences:
            estimated_duration = self.estimate_speech_duration(sentence)
            
            # If sentence is too long, split it further
            if estimated_duration > TARGET_DURATION_MAX:
                # Split long sentence by commas or other punctuation
                sub_sentences = self.split_long_sentence(sentence)
                for sub_sentence in sub_sentences:
                    sub_duration = self.estimate_speech_duration(sub_sentence)
                    if sub_duration <= TARGET_DURATION_MAX:
                        segments.append({
                            'text': sub_sentence,
                            'start_time': current_start,
                            'end_time': current_start + sub_duration,
                            'duration': sub_duration
                        })
                        current_start += sub_duration
                        segment_index += 1
            else:
                segments.append({
                    'text': sentence,
                    'start_time': current_start,
                    'end_time': current_start + estimated_duration,
                    'duration': estimated_duration
                })
                current_start += estimated_duration
                segment_index += 1
        
        return segments
    
    def split_long_sentence(self, sentence: str) -> List[str]:
        """Split long sentences by punctuation."""
        # Split by common punctuation marks
        split_patterns = [',', '،', ';', '؛', ':', '：']
        
        for pattern in split_patterns:
            if pattern in sentence:
                parts = sentence.split(pattern)
                return [part.strip() + pattern for part in parts[:-1]] + [parts[-1].strip()]
        
        # If no punctuation, split by words (roughly)
        words = sentence.split()
        if len(words) > 20:  # If more than 20 words
            mid_point = len(words) // 2
            return [' '.join(words[:mid_point]), ' '.join(words[mid_point:])]
        
        return [sentence]
    
    def extract_audio_segment(self, input_file: Path, start_time: float, duration: float, output_file: Path) -> bool:
        """Extract audio segment using ffmpeg."""
        try:
            cmd = [
                'ffmpeg',
                '-i', str(input_file),
                '-ss', str(start_time),
                '-t', str(duration),
                '-c', 'copy',
                '-y',  # Overwrite output file
                str(output_file)
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            return result.returncode == 0
            
        except Exception as e:
            print(f"❌ Error extracting audio segment: {e}")
            return False
    
    def transcribe_audio(self, audio_file: Path) -> Optional[str]:
        """Transcribe audio using ElevenLabs API."""
        try:
            with open(audio_file, 'rb') as f:
                files = {'file': f}
                data = {
                    'language': 'ps',  # Pashto
                    'model_id': 'scribe_v1'
                }
                
                response = requests.post(
                    'https://api.elevenlabs.io/v1/speech-to-text',
                    headers={'xi-api-key': self.elevenlabs_api_key},
                    files=files,
                    data=data
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return result.get('text', '')
                else:
                    print(f"❌ ElevenLabs API error: {response.status_code} - {response.text}")
                    return None
                    
        except Exception as e:
            print(f"❌ Error transcribing audio: {e}")
            return None
    
    def process_segment(self, audio_file: Path, transcript: str) -> List[Dict]:
        """Process a single audio segment into sentence-based chunks."""
        print(f"📝 Processing {audio_file.name}...")
        
        # Split into sentence-based segments
        segments = self.split_audio_by_sentences(audio_file, transcript)
        
        if not segments:
            return []
        
        processed_segments = []
        
        for i, segment in enumerate(segments, 1):
            # Create output filename
            base_name = audio_file.stem
            output_name = f"{base_name}_sentence_{i:03d}.wav"
            output_file = self.sentence_clips_dir / output_name
            
            # Extract audio segment
            if self.extract_audio_segment(audio_file, segment['start_time'], segment['duration'], output_file):
                # Transcribe the extracted segment
                transcribed_text = self.transcribe_audio(output_file)
                
                if transcribed_text:
                    processed_segments.append({
                        'filename': output_name,
                        'start_time': segment['start_time'],
                        'end_time': segment['end_time'],
                        'duration': segment['duration'],
                        'original_text': segment['text'],
                        'transcribed_text': transcribed_text,
                        'file_path': str(output_file)
                    })
                    print(f"✅ Created sentence segment {i}: {segment['duration']:.1f}s")
                else:
                    print(f"⚠️ Failed to transcribe sentence segment {i}")
            else:
                print(f"❌ Failed to extract sentence segment {i}")
        
        return processed_segments
    
    def process_all_segments(self):
        """Process all audio segments in the audio_clips directory."""
        if not self.check_dependencies():
            return
        
        audio_files = list(self.audio_clips_dir.glob("*.wav"))
        
        if not audio_files:
            print("❌ No audio files found in audio_clips directory")
            return
        
        print(f"🎵 Found {len(audio_files)} audio files to process")
        
        all_processed_segments = []
        
        for audio_file in audio_files:
            # Read corresponding transcript from poems directory
            transcript_file = Path("poems") / f"{audio_file.stem}.txt"
            
            if not transcript_file.exists():
                print(f"⚠️ Transcript file not found: {transcript_file}")
                continue
            
            with open(transcript_file, 'r', encoding='utf-8') as f:
                transcript = f.read().strip()
            
            # Process the segment
            segments = self.process_segment(audio_file, transcript)
            all_processed_segments.extend(segments)
            
            # Small delay to avoid overwhelming the API
            time.sleep(1)
        
        print(f"\n📊 Processing completed: {len(all_processed_segments)} sentence segments created")
        
        # Save results to a summary file
        summary_file = self.sentence_clips_dir / "segments_summary.json"
        with open(summary_file, 'w', encoding='utf-8') as f:
            import json
            json.dump(all_processed_segments, f, ensure_ascii=False, indent=2)
        
        print(f"📄 Summary saved to: {summary_file}")

def main():
    if len(sys.argv) > 1:
        api_key = sys.argv[1]
    else:
        api_key = ELEVENLABLS_API_KEY
    
    segmenter = SentenceSegmenter(api_key)
    segmenter.process_all_segments()

if __name__ == "__main__":
    main()
