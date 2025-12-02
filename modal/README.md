# Modal.com YouTube Processor

This Modal function handles YouTube audio extraction and processing for the Pashto Bible Search app.

## Why Modal?

YouTube blocks direct audio extraction from serverless environments (Vercel, Cloudflare Workers) by detecting their IP ranges. Modal.com provides:

- **Real VM IP addresses** - Not blocked by YouTube
- **yt-dlp pre-installed** - Industry-standard YouTube downloader
- **ffmpeg support** - For audio conversion
- **Serverless pricing** - Only pay for actual usage

## Setup

### 1. Install Modal CLI

```bash
pip install modal
```

### 2. Create Modal Account

Sign up at [modal.com](https://modal.com) and authenticate:

```bash
modal setup
```

### 3. Configure Secrets

Create a secret named `cloudflare-credentials` in Modal's dashboard with:

```
CLOUDFLARE_ACCOUNT_ID=3ac1a6fafce90adf6b1c8f1280dfc94d
CLOUDFLARE_R2_ACCESS_KEY_ID=your_r2_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_r2_secret_key
CLOUDFLARE_WORKER_URL=https://pashtobiblesearch.jeremy-samuels17.workers.dev
```

To get R2 credentials:
1. Go to Cloudflare Dashboard → R2 → Manage R2 API Tokens
2. Create a new API token with Object Read & Write access
3. Copy the Access Key ID and Secret Access Key

### 4. Deploy

```bash
cd modal
modal deploy youtube_processor.py
```

After deployment, you'll get a webhook URL like:
```
https://YOUR_USERNAME--pashto-youtube-processor-process-video-webhook.modal.run
```

## How It Works

```
┌─────────────────┐     ┌──────────────────┐     ┌────────────────────┐
│   Website UI    │────▶│   Modal Worker   │────▶│  Cloudflare R2     │
│ (Vercel)        │     │  (VM with yt-dlp)│     │  (Audio Storage)   │
└─────────────────┘     └──────────────────┘     └────────────────────┘
                                │                         │
                                │                         │
                                ▼                         ▼
                        ┌──────────────────┐     ┌────────────────────┐
                        │ Cloudflare Worker│◀────│   Transcription    │
                        │ (Transcription)  │     │   (ElevenLabs)     │
                        └──────────────────┘     └────────────────────┘
```

1. **User submits YouTube URL** on the website
2. **Modal webhook** receives the URL and starts processing
3. **yt-dlp downloads** the audio (works because Modal has real IPs)
4. **Audio uploaded** to Cloudflare R2 storage
5. **Cloudflare Worker** retrieves from R2 and sends to ElevenLabs
6. **Transcript stored** in D1 database with word-level timestamps

## API Endpoints

### Process Video (Modal Webhook)
```bash
POST https://YOUR_USERNAME--pashto-youtube-processor-process-video-webhook.modal.run
Content-Type: application/json

{
  "youtube_url": "https://www.youtube.com/watch?v=..."
}
```

### Transcribe R2 Audio (Cloudflare Worker)
```bash
POST https://pashtobiblesearch.jeremy-samuels17.workers.dev/api/transcribe-r2-audio
Content-Type: application/json

{
  "video_id": "abc123",
  "r2_key": "videos/abc123/audio.mp3",
  "youtube_url": "https://www.youtube.com/watch?v=...",
  "title": "Video Title"
}
```

## Local Testing

```bash
cd modal
python youtube_processor.py
```

## Costs

Modal pricing is usage-based:
- ~$0.000024/sec for CPU
- First $30/month is free

A typical 10-minute video:
- Download: ~30 seconds
- Upload: ~10 seconds
- Total: ~$0.001 per video

## Troubleshooting

### "Video unavailable"
- The video might be private, region-locked, or deleted
- Try a different video to test

### "R2 upload failed"
- Check that the R2 credentials are correct
- Verify the bucket name is `pashto-bible-audio`

### "Transcription failed"
- Check ElevenLabs API key in the Cloudflare Worker
- Verify the audio file is under 100MB

