#!/usr/bin/env python3
"""
WhisperX Forced Alignment for accurate word-level timestamps
Takes existing transcription text and audio, returns accurate timestamps
"""

import json
import sys
import argparse
from pathlib import Path

try:
    import whisperx
    import torch
except ImportError:
    print("ERROR: whisperx not installed. Run: pip install whisperx", file=sys.stderr)
    sys.exit(1)


def align_transcription(audio_path: str, transcription_text: str, language: str = "ps", device: str = "cpu"):
    """
    Use WhisperX forced alignment to get accurate word-level timestamps
    
    Args:
        audio_path: Path to audio file
        transcription_text: Existing transcription text (high quality, from ElevenLabs)
        language: Language code (default: "ps" for Pashto)
        device: Device to use ("cpu" or "cuda")
    
    Returns:
        Dictionary with aligned segments and words
    """
    try:
        # Load audio
        audio = whisperx.load_audio(audio_path)
        
        # Load alignment model (wav2vec2 for forced alignment)
        # WhisperX will use a phoneme-based ASR model for alignment
        model_a, metadata = whisperx.load_align_model(language_code=language, device=device)
        
        # Split transcription into sentences
        sentences = [s.strip() for s in transcription_text.split('.') if s.strip()]
        if not sentences:
            sentences = [transcription_text.strip()]
        
        # Align each sentence
        all_words = []
        all_segments = []
        current_time = 0.0
        
        for sentence in sentences:
            if not sentence:
                continue
                
            # Align sentence
            result = whisperx.align([sentence], model_a, metadata, audio, device=device, return_char_alignments=False)
            
            if result and "segments" in result and len(result["segments"]) > 0:
                segment = result["segments"][0]
                words = segment.get("words", [])
                
                if words:
                    # Extract word timestamps
                    segment_words = []
                    for word in words:
                        if "start" in word and "end" in word and "word" in word:
                            segment_words.append({
                                "word": word["word"],
                                "start": word["start"],
                                "end": word["end"]
                            })
                    
                    if segment_words:
                        all_words.extend(segment_words)
                        all_segments.append({
                            "text": sentence,
                            "start": segment_words[0]["start"],
                            "end": segment_words[-1]["end"],
                            "words": segment_words
                        })
        
        return {
            "text": transcription_text,
            "words": all_words,
            "segments": all_segments
        }
        
    except Exception as e:
        print(f"ERROR: WhisperX alignment failed: {str(e)}", file=sys.stderr)
        return None


def main():
    parser = argparse.ArgumentParser(description="WhisperX forced alignment for accurate timestamps")
    parser.add_argument("audio_path", help="Path to audio file")
    parser.add_argument("transcription_text", help="Existing transcription text")
    parser.add_argument("--language", default="ps", help="Language code (default: ps)")
    parser.add_argument("--device", default="cpu", help="Device: cpu or cuda (default: cpu)")
    
    args = parser.parse_args()
    
    # Check if audio file exists
    if not Path(args.audio_path).exists():
        print(f"ERROR: Audio file not found: {args.audio_path}", file=sys.stderr)
        sys.exit(1)
    
    # Perform alignment
    result = align_transcription(args.audio_path, args.transcription_text, args.language, args.device)
    
    if result:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print("ERROR: Alignment failed", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()

