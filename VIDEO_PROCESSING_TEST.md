# Video Processing Workflow - Local Test Results

## What We Built

A complete cloud-based video processing system that:

1. **Downloads YouTube videos** using `yt-dlp`
2. **Transcribes audio** using AssemblyAI API
3. **Segments transcript** into clips (5-15 seconds each)
4. **Extracts audio segments** using `ffmpeg`
5. **Uploads to Cloudflare R2** using `wrangler` CLI
6. **Stores metadata in Cloudflare D1** via Worker API

## Test Script: `test_video_processing.py`

The script processes the YouTube video `https://www.youtube.com/watch?v=u9sU5l92Th4` and:

- Downloads audio to `temp/u9sU5l92Th4.mp3`
- Uploads audio to AssemblyAI and waits for transcription
- Segments the transcript into clips
- Extracts audio segments using ffmpeg
- Uploads segments to R2 bucket `pashto-bible-audio`
- Stores metadata in D1 via Worker endpoint

## Expected Output

```
🎬 Starting local video processing test...

📺 Video URL: https://www.youtube.com/watch?v=u9sU5l92Th4

📥 Step 1: Downloading video audio...
✅ Audio downloaded: temp/u9sU5l92Th4.mp3

🎤 Step 2: Transcribing with AssemblyAI...
   Uploading audio file...
   Audio uploaded: https://cdn.assemblyai.com/upload/...
   Transcription job started: <job-id>
   ⏳ Waiting... (X minutes elapsed)
✅ Transcription completed!
   Transcript preview: <Pashto text>...

✂️ Step 3: Segmenting transcript...
✅ Created X segments

🎵 Step 4: Extracting audio segments...
   ✓ Segment 1/X: 0s - 5s
   ✓ Segment 2/X: 5s - 10s
   ...
✅ Extracted X audio segments

☁️ Step 5: Uploading to Cloudflare R2...
   ✓ Uploaded segment 1 to R2: videos/u9sU5l92Th4/segment_1.mp3
   ✓ Uploaded segment 2 to R2: videos/u9sU5l92Th4/segment_2.mp3
   ...
✅ Upload complete!

💾 Step 6: Storing metadata in Cloudflare D1...
✅ Metadata stored in D1
   Video ID: u9sU5l92Th4
   Segments: X

✅ Video processing complete!

📊 Summary:
   Video ID: u9sU5l92Th4
   Transcript preview: <Pashto text>...
   Segments: X
   Audio clips: X

🌐 Metadata stored in Cloudflare D1
📁 Audio clips stored in Cloudflare R2
```

## Verification Steps

### 1. Check Cloudflare D1

```bash
wrangler d1 execute pashto-bible-db --command "SELECT * FROM video_transcripts WHERE video_id = 'u9sU5l92Th4'"
```

### 2. Check Cloudflare R2

```bash
wrangler r2 object list pashto-bible-audio --prefix videos/u9sU5l92Th4/
```

### 3. List via Worker API

```bash
curl https://pashtobiblesearch.jeremy-samuels17.workers.dev/api/video/list
```

## Files Created/Modified

1. **`test_video_processing.py`** - Complete test script
2. **`cloudflare/worker-api.ts`** - Added video processing endpoints
3. **`app/api/process-video-cloudflare/route.ts`** - Next.js API route
4. **`app/api/configure-api-keys/route.ts`** - API key management
5. **`components/VideosPanel.tsx`** - UI for video processing

## Dependencies Required

- `yt-dlp` - YouTube downloader
- `ffmpeg` - Audio processing
- `wrangler` - Cloudflare CLI
- `python3` with `requests` library

## Next Steps

1. Deploy Cloudflare Worker: `wrangler deploy`
2. Test via UI: Go to Videos tab, paste YouTube URL, click "Process Video via Cloudflare"
3. View results: Check Videos tab or query D1/R2 directly

## Notes

- Transcription can take 5-10 minutes depending on video length
- Audio segments are stored in R2 at `videos/{videoId}/segment_{N}.mp3`
- Metadata is stored in D1 `video_transcripts` table
- All processing happens in the cloud (no local dependencies for production)

