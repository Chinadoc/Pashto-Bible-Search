# Video Processor Service

This service handles YouTube video processing with `yt-dlp` and `ffmpeg`.

## Setup for Railway

1. **Connect Repository:**
   - On Railway, click "GitHub Repository"
   - Select this repository
   - **Important:** Set root directory to `video-processor-service` in Railway settings

2. **Environment Variables:**
   Add these in Railway:
   ```
   ELEVENLABS_API_KEY=sk_your_key_here
   CLOUDFLARE_WORKER_URL=https://pashtobiblesearch.jeremy-samuels17.workers.dev
   ```

3. **Deploy:**
   - Railway auto-detects Dockerfile
   - Builds and deploys automatically
   - Copy the service URL (e.g., `https://your-service.up.railway.app`)

4. **Update Next.js:**
   Add to Vercel environment variables:
   ```
   PROCESSING_SERVICE_URL=https://your-service.up.railway.app
   ```

## Testing

Test the service:
```bash
curl https://your-service.up.railway.app/health
```

Should return: `{"status":"ok","service":"pashto-video-processor"}`

## Architecture

```
User → Next.js API → Railway Service → Cloudflare R2/D1
                          ↓
                    yt-dlp + ffmpeg
                    ElevenLabs API
```

