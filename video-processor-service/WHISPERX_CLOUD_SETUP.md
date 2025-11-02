# WhisperX Cloud API Setup

## Overview

WhisperX forced alignment provides the most accurate word-level timestamps. This service can run on Railway (cloud) or locally.

## Strategy

1. **Get high-quality transcription** from ElevenLabs ✅
2. **Use WhisperX forced alignment** to get accurate timestamps
3. **No need for Deepgram** - WhisperX handles alignment perfectly

## Cloud Deployment (Railway)

### Option 1: Separate WhisperX Service (Recommended)

1. **Create new Railway service:**
   - Connect to this repo
   - Set root directory to `video-processor-service/whisperx-api`
   - Use `Dockerfile.whisperx` as Dockerfile
   - Railway will auto-detect Python

2. **Environment Variables:**
   - None required (uses CPU by default)
   - GPU available on Railway Pro plans

3. **Get the service URL:**
   - Copy Railway service URL (e.g., `https://whisperx-api.railway.app`)
   - Set `WHISPERX_API_URL` in your main video processor service

### Option 2: Add to Existing Service

Add WhisperX to your existing Railway service:
- Update Dockerfile to include WhisperX dependencies
- Add FastAPI route for alignment
- More complex but single service

## Local Usage

If `WHISPERX_API_URL` is not set, the code will try to use local Python script:
```bash
pip install whisperx torch
```

## Configuration

Set environment variable in your video processor service:
```bash
WHISPERX_API_URL=https://your-whisperx-service.railway.app
```

## Benefits

- ✅ **Accurate timestamps** - WhisperX forced alignment is the gold standard
- ✅ **Cloud processing** - No local dependencies needed
- ✅ **ElevenLabs quality** - Uses your high-quality Pashto transcription
- ✅ **Automatic fallback** - Falls back to local if cloud unavailable

## Cost

- Railway free tier: Limited hours/month
- Railway Pro: $20/month for unlimited
- WhisperX API: Free (self-hosted)

## Testing

Test the API:
```bash
curl -X POST "https://your-whisperx-service.railway.app/align" \
  -F "audio=@audio.mp3" \
  -F "transcription=Your transcription text here" \
  -F "language=ps"
```

