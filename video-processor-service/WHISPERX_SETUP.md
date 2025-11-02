# WhisperX Forced Alignment Setup

## Overview

WhisperX provides **forced alignment** - the best method for getting accurate word-level timestamps from an existing transcription. It uses phoneme-based ASR models (wav2vec2.0) to align your text with audio.

## Installation

```bash
cd video-processor-service
pip install whisperx torch
```

## How It Works

1. **Get high-quality transcription** (ElevenLabs) ✅ You already have this
2. **Use WhisperX forced alignment** to get accurate timestamps
3. **No need for two-pass transcription** - just align existing text!

## Usage

The code automatically tries WhisperX first, then falls back to text-based alignment if unavailable.

## Pashto Support

WhisperX uses wav2vec2.0 models which support Pashto. The alignment model will be automatically downloaded when first used.

## Finding Pashto Whisper Models on Hugging Face

Unfortunately, there don't appear to be any fine-tuned Pashto Whisper models on Hugging Face yet. However:

1. **WhisperX forced alignment** is better than fine-tuning for your use case
2. **Forced alignment** takes existing transcription + audio → accurate timestamps
3. **No need to retrain** - just align!

## Alternative: CrisperWhisper

If you want to fine-tune Whisper specifically for Pashto:
- GitHub: https://github.com/nyrahealth/CrisperWhisper
- Requires training data and GPU resources
- Forced alignment is faster and easier

## Best Approach for Your Use Case

**Recommended: WhisperX Forced Alignment**
- ✅ Takes your existing ElevenLabs transcription
- ✅ Gets accurate word-level timestamps
- ✅ No training needed
- ✅ Works with Pashto

The code now prioritizes WhisperX forced alignment, falling back to text-based alignment if Python/WhisperX aren't available.

