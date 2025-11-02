# Two-Pass Transcription Setup

This document explains how to use the two-pass transcription system for accurate timestamps.

## Overview

The system uses:
1. **Timestamp Provider** (AssemblyAI/Deepgram/Whisper) - for accurate word-level timestamps
2. **ElevenLabs** - for quality Pashto transcription
3. **Alignment** - matches ElevenLabs text with timestamp provider timestamps

## Timestamp Provider Options

### Option 1: AssemblyAI (Recommended - Excellent Word-Level Timestamps)

**Pricing**: $0.00025 per second (~$0.015/minute)
**Pros**: 
- Excellent word-level timestamp accuracy
- Auto-detects Pashto
- Fast processing
- Very reliable

**Setup**:
```bash
export ASSEMBLYAI_API_KEY=your-key-here
```

Get API key: https://www.assemblyai.com/

### Option 2: Deepgram (Fast & Cost-Efficient)

**Pricing**: $0.0043 per minute (Nova model)
**Pros**:
- Very fast
- Cost-efficient
- Good accuracy
- Supports Pashto

**Setup**:
```bash
export DEEPGRAM_API_KEY=your-key-here
```

Get API key: https://deepgram.com/

### Option 3: Whisper (Local or API)

**Pricing**: 
- Local: Free (uses CPU)
- OpenAI API: ~$0.006/minute

**Setup**:
```bash
# Local
brew install whisper
export USE_LOCAL_WHISPER=true

# Or API
export OPENAI_API_KEY=sk-...
```

## Priority Order

The system tries providers in this order:
1. **AssemblyAI** (if `ASSEMBLYAI_API_KEY` is set)
2. **Deepgram** (if `DEEPGRAM_API_KEY` is set)
3. **Whisper** (local or API)

## Cost Comparison (4-minute video)

- **AssemblyAI**: ~$0.06
- **Deepgram**: ~$0.017
- **Whisper API**: ~$0.024
- **Local Whisper**: Free
- **ElevenLabs**: ~$0.20

**Total with AssemblyAI**: ~$0.26 per video
**Total with Deepgram**: ~$0.217 per video

## Benefits

✅ Accurate word-level timestamps from chosen provider
✅ High-quality Pashto transcription from ElevenLabs
✅ Automatic alignment of text with timestamps
✅ Fallback to single-pass if timestamp provider unavailable

## Usage

The system automatically detects which timestamp provider to use based on environment variables. Just set the API key for your preferred provider and process videos as usual.
