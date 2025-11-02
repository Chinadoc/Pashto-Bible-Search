# Speech-to-Text Providers for Pashto with Word-Level Timestamps

## ✅ Deepgram Whisper Cloud (Recommended)

**Models Available**: `whisper-tiny`, `whisper-base`, `whisper-small`, `whisper-medium`, `whisper-large`

**Features**:
- Fully managed Whisper API
- Faster than OpenAI's native API
- Built-in diarization
- Accurate word-level timestamps
- Support for files up to 2GB
- Cost-effective and scalable

**Pashto Support**: ✅ Yes (via Whisper models)

**API Usage**:
```
https://api.deepgram.com/v1/listen?model=whisper-large&language=auto&timestamps=true
```

**Cost**: More cost-effective than OpenAI Whisper API

## OpenAI Whisper API

**Models Available**: `whisper-1`

**Features**:
- Excellent Pashto support
- Word-level timestamps
- Reliable

**Cost**: ~$0.006/minute

## Hugging Face Options

Hugging Face hosts Whisper models but requires:
- Self-hosting or using Inference API
- More setup complexity
- Can use models like `openai/whisper-large-v2`
- Free if self-hosted, but requires infrastructure

**Popular Models**:
- `openai/whisper-large-v2` - Best accuracy
- `openai/whisper-medium` - Good balance
- `openai/whisper-base` - Faster, less accurate

## Veed.io

**What They Use**: Not publicly disclosed
- They have their own AI transcription service
- Supports 100+ languages
- Focus on accuracy and user experience
- No public API for direct integration

## Recommendation Priority:

1. **Deepgram Whisper Cloud** (`whisper-large`) - Best balance of cost, speed, and accuracy
2. **OpenAI Whisper API** - Reliable fallback
3. **AssemblyAI** - Good alternative
4. **Hugging Face** - If you want to self-host

