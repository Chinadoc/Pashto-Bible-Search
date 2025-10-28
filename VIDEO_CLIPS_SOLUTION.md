# Video Clips Organization Solution

## ✅ What We Found

### Existing Video Processing System
- **Scripts**: `process_video_offline.py`, `cost_efficient_processor.py`
- **API Endpoint**: `app/api/transcribe-audio/route.ts`
- **Eleven Labs Integration**: ✅ Working
- **766 sentence clips** already generated locally

### Current Issue
- Uploading 766 files individually hits Google Drive API rate limits
- Files are local in `sentence_clips/` directory
- Need to organize them like we did for Bible audio

## 💡 Recommended Approach

### Option 1: Upload to Supabase Storage (Recommended)
Instead of Google Drive, use Supabase Storage which is built into your project:

```bash
# Use the existing API
npm run api:transcribe-audio <youtube_url>
```

This will:
1. Download video
2. Transcribe with Eleven Labs
3. Store in Supabase
4. Make clips accessible via URL

### Option 2: Manual Folder Organization
1. Create "Pashto Video Clips" folder in Google Drive
2. Upload files in batches of 50
3. Make folder public (like we did for Bible audio)

### Option 3: Use Existing Files
Your scripts already created 766 clips. You could:
1. Zip them
2. Upload zip to Google Drive
3. Serve from there

## 📝 Script Status

**Upload Script Status**: ⚠️ Needs debugging
- Error: `part.body.pipe is not a function`
- Fixed: Using `createReadStream`
- Testing: Ready to retry

**Next Step**: Run `npm run upload-video-clips` again to test the fix.

## 🎯 Recommendation

Use **Supabase Storage** for video clips since:
- Already integrated
- No API rate limits
- Better for streaming
- Already have the infrastructure

The Eleven Labs API is working perfectly - it just needs a storage solution.

