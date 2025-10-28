# 🎬 Automated Video Processing Workflow

## Overview

This workflow automatically processes YouTube videos through a completely integrated pipeline:

1. **YouTube Video Download** → Extract audio
2. **Transcription** → Convert speech to Pashto text via Eleven Labs
3. **Validation** → Quality check for Pashto content
4. **Storage** → Save metadata to Supabase
5. **Display** → View in the Videos tab

## ✨ Key Features

### Automatic Quality Checking
- Validates that transcription is in Pashto script
- Assigns confidence score (0-100%)
- Flags low-confidence transcriptions for review
- Easy retry mechanism for failed transcriptions

### Integration Points
- **Frontend**: Videos tab displays all processed videos
- **Backend API**: `/api/transcribe-audio` for transcription
- **Storage**: Supabase `video_transcripts` table
- **Cloud**: Google Drive (for future audio clip uploads)

### Confidence Scoring
- **90-100%**: High confidence, ready to use
- **70-89%**: Medium confidence, usable with caution
- **<70%**: Flagged for review/retry

## 🚀 Quick Start

### From Videos Tab (Recommended)
1. Open the app at `http://localhost:3000`
2. Go to the **Videos** tab
3. Enter YouTube URL
4. Click "Analyze Audio" → "Transcribe with Eleven Labs"
5. Results auto-save to Supabase ✅

### From Command Line
```bash
npm run process-video "https://www.youtube.com/watch?v=VIDEO_ID"
```

## 📊 What Gets Stored

Each video transcript stores:
```
video_id               → YouTube video ID
video_title           → Video title  
video_url             → YouTube URL
transcript_text       → Full transcribed text
validation_score      → Quality score (0-100)
needs_retry          → Boolean flag if low confidence
retry_reason         → Why it needs retry
retry_count          → Number of retry attempts
transcription_service → Service used (elevenlabs)
created_at           → Timestamp
```

## 🔄 Retry Mechanism

Videos with confidence < 70% are automatically flagged:

### Manual Retry
```bash
npm run validate-transcription VIDEO_ID
npm run retry-transcription VIDEO_ID
```

### Automatic Process
1. Script detects low-confidence transcriptions
2. Re-transcribes with Eleven Labs
3. Updates validation score and retry count
4. Stores improved transcript

## 📱 Videos Tab Display

The Videos tab shows:
- **Video Title** with YouTube link
- **Transcription** preview
- **Confidence Score** with visual indicator
- **Clip Count** (when clips are uploaded)
- **Retry Option** if confidence is low

### Example Display
```
🎬 Pashto Sermon - Part 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Confidence: ██████░░░░ 85%
Transcript: "دا کتاب ډيزل د خدا کلام دی..."
Status: ✅ Ready | 🔄 Retry | 📊 Details

YouTube: https://youtube.com/watch?v=...
```

## 🛠 Technical Stack

### Frontend
- Next.js React component
- Videos tab in main UI
- Real-time API calls

### Backend
- `/api/transcribe-audio` - YouTube download + transcription
- `/api/store-video-transcript` - Metadata storage
- `/api/videos` - Fetch all videos
- `/api/retry-transcription` - Re-transcription

### External Services
- **Eleven Labs** - Speech-to-text (Pashto language)
- **YouTube** - Video hosting (yt-dlp download)
- **Google Drive** - Future file storage
- **Supabase** - Database + metadata

### Python Scripts (Local)
- `process_video_offline.py` - Offline processing (optional)
- For dependency-free operation, use API approach

## 📋 API Endpoints

### POST /api/transcribe-audio
Transcribes YouTube video or audio file
```json
{
  "youtubeUrl": "https://www.youtube.com/watch?v=...",
  // OR
  "audio": File // multipart form data
}
```

Response:
```json
{
  "success": true,
  "transcript": "پشتو متن...",
  "validation": {
    "confidence": 0.85,
    "isValid": true,
    "reason": "Transcription appears to be in Pashto"
  }
}
```

### POST /api/store-video-transcript
Stores transcript in Supabase
```json
{
  "videoId": "VIDEO_ID",
  "videoUrl": "https://youtube.com/watch?v=VIDEO_ID",
  "transcript": "پشتو متن...",
  "metadata": {
    "validation": { "confidence": 0.85, "isValid": true },
    "source": "elevenlabs"
  }
}
```

### GET /api/videos
Retrieves all video transcripts
Response:
```json
{
  "success": true,
  "videos": [
    {
      "video_id": "...",
      "video_title": "...",
      "youtube_url": "...",
      "total_clips": 0,
      "clips": []
    }
  ],
  "total": 5
}
```

## 🔐 Environment Variables Required

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Eleven Labs
ELEVENLABS_API_KEY=sk_xxx

# Google Drive (for future)
GOOGLE_DRIVE_API_KEY=xxx
GOOGLE_DRIVE_CLIENT_ID=xxx
GOOGLE_DRIVE_CLIENT_SECRET=xxx
```

## ✅ Quality Assurance Checklist

Before marking a video as "production ready":

- [ ] **Pashto Script**: Contains Pashto characters (ا، ب، پ، etc.)
- [ ] **Common Words**: Includes recognizable Pashto words
- [ ] **Confidence Score**: ≥ 80%
- [ ] **Sentence Structure**: Makes grammatical sense
- [ ] **No Artifacts**: No repeated words or gibberish
- [ ] **Correct Duration**: Matches video length

## 📈 Performance Notes

- **YouTube Download**: 2-5 minutes for 5-minute video
- **Transcription**: 1-2 minutes with Eleven Labs
- **Storage**: < 1 second
- **Total Time**: ~5-10 minutes for complete workflow

## 🐛 Troubleshooting

### "Failed to download YouTube video"
- Ensure video is public
- Check `yt-dlp` is installed: `yt-dlp --version`
- Try with different video

### "Transcription does not appear to be in Pashto"
- Video may not contain Pashto speech
- Confidence too low → auto-flagged for retry
- Try with clearer audio

### "Supabase error"
- Check environment variables
- Ensure `video_transcripts` table exists
- Verify service role key is valid

## 🚀 Future Enhancements

1. **Audio Clip Segmentation** - Split by sentences
2. **Google Drive Upload** - Auto-upload clips
3. **Batch Processing** - Process multiple videos
4. **Custom Validation** - User-defined quality rules
5. **Export Options** - Download transcripts as JSON/CSV

## 📞 Support

For issues, check:
1. Console logs: `npm run dev` → browser DevTools
2. Supabase logs: Dashboard → Edge Functions
3. Eleven Labs status: https://status.elevenlabs.io/
