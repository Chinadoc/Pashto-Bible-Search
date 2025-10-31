# Railway Deployment Steps

## Where to Deploy the Video Processor Service

The video processor service is in the `video-processor-service/` directory. You need to create a **NEW service** in Railway (not use the existing one).

### Step-by-Step:

1. **Go to Railway Dashboard**
   - You're currently viewing the "Pashto-Bible-Search" project
   - You need to add a NEW service to this project

2. **Add New Service:**
   - In the Railway project dashboard, click **"New"** or **"+"** button
   - Select **"GitHub Repository"**
   - Select the same repository: `Chinadoc/Pashto-Bible-Search`

3. **Configure the Service:**
   - **Service Name:** `video-processor` (or any name you prefer)
   - **Root Directory:** `video-processor-service` ← **IMPORTANT!**
     - Go to Settings → Service Settings
     - Under "Source", set **Root Directory** to: `video-processor-service`
   
4. **Set Environment Variables:**
   - Go to Settings → Variables
   - Add:
     ```
     ELEVENLABS_API_KEY=sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543
     CLOUDFLARE_WORKER_URL=https://pashtobiblesearch.jeremy-samuels17.workers.dev
     ```

5. **Deploy:**
   - Railway will automatically detect the Dockerfile
   - It will build and deploy
   - Wait for deployment to complete

6. **Get the Service URL:**
   - Once deployed, go to Settings → Networking
   - Copy the **Public Domain** URL (e.g., `https://video-processor-production.up.railway.app`)

7. **Update Vercel:**
   - Go to Vercel project settings → Environment Variables
   - Add: `PROCESSING_SERVICE_URL` = your Railway service URL

## Quick Reference

- **Service Location:** `video-processor-service/` directory in your repo
- **Root Directory:** `video-processor-service` (in Railway settings)
- **Dockerfile:** Already created in `video-processor-service/Dockerfile`
- **Port:** 3001 (configured in the service)

## Current Status

Looking at your screenshot, you have the main "Pashto-Bible-Search" service. You need to add a **second service** for the video processor.

The failed deployment you see is likely the main Next.js app trying to build, which doesn't have yt-dlp/ffmpeg - that's expected! The video processor needs to be a separate service.

