# Railway Deployment Guide for WhisperX API Service

## Quick Setup

1. **Create New Railway Service:**
   - Go to Railway.app → New Project
   - Click "Deploy from GitHub repo"
   - Select this repository
   - Click "Add Service" → "Dockerfile"

2. **Configure Service:**
   - **Root Directory:** `video-processor-service`
   - **Dockerfile Path:** `Dockerfile.whisperx`
   - **Name:** `whisperx-api` (or your preferred name)

3. **Environment Variables:**
   - None required (uses CPU by default)
   - For GPU support, Railway Pro plan needed

4. **Get Service URL:**
   - Once deployed, Railway will provide a URL like: `https://whisperx-api-production.up.railway.app`
   - Copy this URL

5. **Configure Main Service:**
   - Go to your main video processor service in Railway
   - Add environment variable:
     ```
     WHISPERX_API_URL=https://your-whisperx-service.railway.app
     ```

## Testing

Test the WhisperX API:
```bash
curl -X POST "https://your-whisperx-service.railway.app/align" \
  -F "audio=@audio.mp3" \
  -F "transcription=Your transcription text here" \
  -F "language=ps"
```

## Manual Deployment (if needed)

If Railway doesn't auto-detect:

1. **Settings → Root Directory:** `video-processor-service`
2. **Settings → Dockerfile Path:** `Dockerfile.whisperx`
3. **Deploy**

## Cost

- **Free Tier:** Limited hours/month (good for testing)
- **Pro Plan:** $20/month for unlimited hours + GPU support

## Notes

- First request will be slower (downloads models)
- Models are cached for subsequent requests
- Pashto alignment model will be downloaded automatically on first use

