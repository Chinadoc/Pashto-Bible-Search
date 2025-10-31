# Railway Deployment Guide

## Quick Setup

1. **On Railway.app:**
   - Click "GitHub Repository"
   - Select this repository
   - Railway will auto-detect the Dockerfile in `video-processor-service/`
   - Set the root directory to `video-processor-service` in Railway settings

2. **Environment Variables:**
   Set these in Railway:
   - `ELEVENLABS_API_KEY` - Your ElevenLabs API key
   - `CLOUDFLARE_WORKER_URL` - Your Cloudflare Worker URL (default: https://pashtobiblesearch.jeremy-samuels17.workers.dev)

3. **Deploy:**
   - Railway will build and deploy automatically
   - Copy the service URL (e.g., `https://your-service.railway.app`)
   - Update `PROCESSING_SERVICE_URL` in Next.js environment variables

## Manual Deployment

If Railway doesn't auto-detect, manually set:
- **Root Directory:** `video-processor-service`
- **Build Command:** (none, Docker handles it)
- **Start Command:** (none, Docker handles it)

## Testing

Once deployed, test the service:
```bash
curl https://your-service.railway.app/health
```

Should return: `{"status":"ok","service":"pashto-video-processor"}`

