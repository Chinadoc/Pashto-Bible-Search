# Two-Pass Transcription Setup

This document explains how to use the two-pass transcription system for accurate timestamps.

## Overview

The system uses:
1. **Whisper** (local or API) - for accurate word-level timestamps
2. **ElevenLabs** - for quality Pashto transcription
3. **Alignment** - matches ElevenLabs text with Whisper timestamps

## Setup Options

### Option 1: Local Whisper (Free, Fastest)

Install whisper.cpp:
```bash
# macOS
brew install whisper

# Or build from source
git clone https://github.com/ggerganov/whisper.cpp.git
cd whisper.cpp
make
```

Set environment variable:
```bash
export USE_LOCAL_WHISPER=true
```

### Option 2: OpenAI Whisper API (Cheap, $0.006/minute)

Get API key from https://platform.openai.com/api-keys

Set environment variable:
```bash
export OPENAI_API_KEY=sk-...
```

## Usage

The system automatically:
1. Tries local Whisper first (if `USE_LOCAL_WHISPER=true` or no `OPENAI_API_KEY`)
2. Falls back to OpenAI Whisper API if local fails
3. Falls back to single-pass (ElevenLabs + proportional timing) if both fail

## Cost Comparison

- **Local Whisper**: Free (uses your CPU)
- **OpenAI Whisper API**: ~$0.006/minute (very cheap)
- **ElevenLabs**: ~$0.05/minute (for quality transcription)

For a 4-minute video:
- Whisper API: ~$0.024
- ElevenLabs: ~$0.20
- **Total**: ~$0.224 per video

## Benefits

✅ Accurate word-level timestamps from Whisper
✅ High-quality Pashto transcription from ElevenLabs
✅ Automatic alignment of text with timestamps
✅ Fallback to single-pass if Whisper unavailable

