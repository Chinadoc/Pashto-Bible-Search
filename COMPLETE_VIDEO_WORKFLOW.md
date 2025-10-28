# Complete Video Processing Workflow

## 🎯 Overview

This workflow processes a YouTube video from start to finish:
1. Download video from YouTube
2. Extract audio and transcribe with Eleven Labs
3. Create sentence clips
4. Upload clips to Google Drive
5. Save metadata to Supabase

## 📋 Prerequisites

✅ Google Drive API credentials (`token.json`)  
✅ Eleven Labs API key configured  
✅ Supabase credentials configured  
✅ Python dependencies (`yt-dlp`, `pydub`, `requests`)  
✅ Database migration applied (`add_google_drive_to_video_transcripts.sql`)

## 🚀 How to Process a Video

### Option 1: Automated (Recommended)

```bash
# Process the video
node process_and_upload_video.js "https://www.youtube.com/watch?v=ZmM_DQ0aRvk"
```

This runs the complete pipeline automatically.

### Option 2: Manual Steps

```bash
# Step 1: Process video with Python
python3 process_video_offline.py "https://www.youtube.com/watch?v=ZmM_DQ0aRvk"

# Step 2: Upload clips to Google Drive and save to Supabase
npm run upload-video-clips
```

## 📊 What Gets Created

### Local Files
- `processed_videos/{video_id}_results.json` - Complete results with transcripts
- `sentence_clips/*.wav` - Individual audio clips (one per sentence)

### Google Drive
- Folder: "Pashto Video Clips"
- All audio files uploaded and made public
- Accessible via: `https://drive.google.com/uc?id={file_id}&export=download`

### Supabase Database
- Table: `video_transcripts`
- Fields stored:
  - `video_id` - YouTube video ID
  - `video_title` - Video title
  - `transcript_text` - Pashto transcript
  - `google_drive_file_id` - File ID for recovery
  - `google_drive_url` - Direct download URL
  - `start_time_seconds` - Clip start time
  - `end_time_seconds` - Clip end time
  - `audio_file_path` - View URL
  - `transcript_file_path` - Filename

## 🔍 Verify Results

### Check Supabase
```sql
SELECT video_id, COUNT(*) as clip_count 
FROM video_transcripts 
WHERE google_drive_file_id IS NOT NULL 
GROUP BY video_id;
```

### Check Google Drive
Visit: https://drive.google.com/drive/folders/1Wb09vyqP2HqEMRQ2B-SViEgxmVkuKMgN

## ⚠️ Important Notes

1. **Transcript Data**: The upload script reads from `processed_videos/{video_id}_results.json` to get transcript text
2. **Audio Size**: Eleven Labs has a 25MB limit - clips are automatically segmented
3. **Pashto Validation**: The system validates that transcripts contain Pashto characters
4. **Rate Limits**: Uploads process in batches of 50 to avoid Google API limits
5. **Recovery**: If clips are lost, you can recover them from Supabase using `google_drive_file_id`

## 🐛 Troubleshooting

### No transcript data found
Make sure `processed_videos/{video_id}_results.json` exists and contains a `clips` array.

### Upload fails
Check Google Drive API credentials in `token.json`.

### Supabase errors
Ensure migration `add_google_drive_to_video_transcripts.sql` has been applied.

## ✅ Confidence Level

**HIGH** - All components are in place and tested:
- ✅ Python processing script working
- ✅ Eleven Labs integration working
- ✅ Google Drive upload script fixed
- ✅ Supabase integration working
- ✅ Metadata includes transcripts
- ✅ Complete workflow tested end-to-end

Ready to process videos! 🎬

