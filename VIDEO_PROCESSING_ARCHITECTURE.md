# Video Processing Architecture Options

## Current Architecture
```
User → Next.js API (/api/process-video-cloudflare)
  → Downloads with yt-dlp (local)
  → Transcribes with ElevenLabs
  → Segments with ffmpeg (local)
  → Uploads to Cloudflare R2
  → Stores metadata in Cloudflare D1
```

**Problem:** Vercel serverless functions don't support `yt-dlp`/`ffmpeg` natively.

## Why Cloudflare Workers Can't Run yt-dlp/ffmpeg

- **V8 Isolates**: Workers run in isolated JavaScript runtime, not a full OS
- **No System Commands**: Cannot execute shell commands like `yt-dlp` or `ffmpeg`
- **No File System**: Cannot create temporary files or write to disk
- **Limited Runtime**: Designed for lightweight HTTP request handling

## Solution Options

### Option 1: Separate Processing Service (Recommended ⭐)

Deploy a Node.js service that has yt-dlp/ffmpeg available:

**Services that support this:**
- **Railway** (supports Docker with yt-dlp/ffmpeg)
- **Render** (supports Docker)
- **Fly.io** (supports Docker)
- **VPS** (DigitalOcean, Linode, etc.)
- **AWS Lambda** (with Layers for ffmpeg)
- **Google Cloud Functions** (with custom runtime)

**Architecture:**
```
User → Next.js API → Processing Service (Railway/Render/etc.)
  → Downloads with yt-dlp
  → Transcribes with ElevenLabs  
  → Segments with ffmpeg
  → Uploads to Cloudflare R2
  → Calls Cloudflare Worker to store metadata in D1
```

### Option 2: Use ffmpeg.wasm in Cloudflare Workers

**Pros:**
- Can run in Cloudflare Workers
- No external service needed

**Cons:**
- Still need YouTube audio extraction (can't use yt-dlp)
- Limited by Worker memory/timeout limits
- Slower than native ffmpeg

**Implementation:**
- Use YouTube API or proxy service for audio
- Use `@ffmpeg/ffmpeg` WASM in Cloudflare Worker
- Process and store in R2/D1

### Option 3: Client-Side Processing (Not Recommended)

Use browser-based processing:
- **Problem**: Large files, memory limits, user's device burden

## Recommended Implementation

### Step 1: Create Processing Service

Create a simple Node.js service (can deploy to Railway/Render):

```typescript
// processing-service/src/index.ts
import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import FormData from 'form-data';
import { createReadStream } from 'fs';

const execAsync = promisify(exec);
const app = express();

app.post('/process-video', async (req, res) => {
  const { youtubeUrl, videoId, apiKeys } = req.body;
  
  // 1. Download audio
  const audioFile = await downloadAudio(youtubeUrl, videoId);
  
  // 2. Transcribe
  const transcript = await transcribeWithElevenLabs(audioFile, apiKeys.elevenlabs);
  
  // 3. Get duration
  const duration = await getDuration(audioFile);
  
  // 4. Segment
  const segments = await segmentAudio(audioFile, transcript, duration);
  
  // 5. Upload to R2
  const r2Keys = await uploadToR2(segments, videoId);
  
  // 6. Store metadata in D1 (via Cloudflare Worker)
  await storeMetadata(youtubeUrl, videoId, transcript, segments, r2Keys);
  
  res.json({ success: true, videoId, segments });
});

app.listen(3001);
```

### Step 2: Update Next.js API Route

Modify `/api/process-video-cloudflare/route.ts` to call the processing service:

```typescript
export async function POST(request: NextRequest) {
  const { youtubeUrl, apiKeys } = await request.json();
  
  // Call processing service
  const response = await fetch('https://your-processing-service.railway.app/process-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ youtubeUrl, apiKeys })
  });
  
  return NextResponse.json(await response.json());
}
```

### Step 3: Deploy Processing Service

**Railway Example:**
```dockerfile
FROM node:18

# Install yt-dlp and ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg python3-pip && \
    pip3 install yt-dlp && \
    apt-get clean

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "src/index.ts"]
```

## Quick Start: Railway Deployment

1. Create account at railway.app
2. Create new project
3. Connect GitHub repo with processing service
4. Railway auto-detects Dockerfile
5. Set environment variables (API keys)
6. Deploy!

The processing service will have `yt-dlp` and `ffmpeg` available.

## Alternative: Keep Current Architecture

If you want to keep processing on Vercel:
- Use Vercel's Docker runtime (if available)
- Or use a GitHub Action that runs processing on push
- Or run processing locally and upload results

