# Railway WhisperX Deployment - Step by Step

## Step 1: Create New Railway Service

1. Go to [Railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `Pashto-Bible-Search`
5. Click **"Add Service"**

## Step 2: Configure the Service

1. Railway will show multiple services - click **"Add Service"** again
2. Select **"Dockerfile"**
3. Configure:
   - **Name:** `whisperx-api` (or any name you prefer)
   - **Root Directory:** `video-processor-service`
   - **Dockerfile Path:** `Dockerfile.whisperx`
   - **Port:** `8000` (default)

## Step 3: Deploy

1. Railway will automatically:
   - Build the Docker image
   - Install WhisperX and dependencies
   - Start the FastAPI service
2. Wait for deployment (first time may take 5-10 minutes)
3. Once deployed, Railway will show a URL like:
   ```
   https://whisperx-api-production.up.railway.app
   ```

## Step 4: Configure Main Service

1. Go back to your main video processor service in Railway
2. Click **"Variables"** tab
3. Add new variable:
   - **Key:** `WHISPERX_API_URL`
   - **Value:** `https://your-whisperx-service.railway.app` (use the URL from Step 3)
4. Save

## Step 5: Test

The WhisperX API will be used automatically when processing videos. You can also test it manually:

```bash
curl -X POST "https://your-whisperx-service.railway.app/align" \
  -F "audio=@audio.mp3" \
  -F "transcription=Your transcription text" \
  -F "language=ps"
```

## Troubleshooting

**If deployment fails:**
- Check Railway logs for errors
- Ensure `Dockerfile.whisperx` exists in `video-processor-service/`
- Ensure `whisperx-api/` directory exists with `main.py` and `requirements.txt`

**If models don't load:**
- First request is slow (downloads models)
- Models are cached for subsequent requests
- Check `/health` endpoint to verify service is running

**If alignment fails:**
- Pashto may not be fully supported - try `language=auto`
- Check Railway logs for specific error messages

## Cost

- **Free Tier:** 500 hours/month (good for testing)
- **Pro Plan:** $20/month for unlimited + GPU support (faster alignment)

## Next Steps

Once deployed, reprocess videos and they will automatically use WhisperX for per-segment refinement!
