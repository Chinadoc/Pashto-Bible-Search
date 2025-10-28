# 🔄 ElevenLabs Retry Workflow

## Overview

Automatic quality validation identifies low-confidence clips and recommends ElevenLabs retry for better transcription quality.

## How It Works

### 1. Initial Processing (AssemblyAI)
When you process a video, each clip is automatically validated:

```javascript
{
  validation_score: 45,      // Confidence 0-100%
  needs_retry: true,         // Flagged for retry
  retry_reason: "Low Pashto confidence...",
  transcription_service: "assemblyai"
}
```

### 2. Validation Criteria

Clips are flagged for retry if:
- Confidence score < 60%
- Missing Pashto script (no Arabic characters)
- No common Pashto words detected
- Too short (< 3 words)

### 3. Retry Options

**Option A: Automatic Retry (Recommended)**
Clips with `needs_retry: true` will automatically use ElevenLabs in future processing.

**Option B: Manual Retry**
Call the API endpoint to retry specific clips:

```bash
POST /api/retry-clips-elevenlabs
{
  "videoId": "ZmM_DQ0aRvk",
  "clipIds": [1, 3, 5]  // Optional: specific clips, or retry all flagged
}
```

### 4. Retry Process

1. Fetch low-confidence clips
2. Download audio files from Google Drive
3. Send to ElevenLabs for better transcription
4. Update clip with new transcript
5. Increase retry_count
6. Update needs_retry flag

## Validation Scoring

```
Has Pashto Script:      +40 points
Has Common Words:       +30 points
Word Count >= 3:        +20 points
Length > 10 chars:      +10 points
─────────────────────────────────
Total:                  0-100%
```

### Thresholds

- **90-100%**: Excellent ✅ (no retry needed)
- **70-89%**: Good ✅ (no retry needed)
- **60-69%**: Acceptable ⚠️ (optional retry)
- **< 60%**: Poor ❌ (automatic retry flag)

## API Endpoints

### POST /api/retry-clips-elevenlabs

Retry low-confidence clips with ElevenLabs.

**Request:**
```json
{
  "videoId": "ZmM_DQ0aRvk",
  "clipIds": [1, 3, 5]  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "retried": 3,
  "total": 5,
  "message": "Successfully retried 3 clips with ElevenLabs"
}
```

## UI Integration

The Videos tab will show:
- ✅ Green badge for high-confidence clips
- ⚠️ Yellow badge for clips needing retry
- 🔄 Retry button for manual retry
- 📊 Confidence score display

## Example Workflow

### Step 1: Process Video
```bash
POST /api/process-video-complete
{
  "youtubeUrl": "https://youtube.com/watch?v=ZmM_DQ0aRvk"
}
```

Result: 15 clips created, 5 flagged for retry

### Step 2: Check Low-Confidence Clips
Console shows:
```
✅ Created 15 clip records (5 flagged for ElevenLabs retry)
```

### Step 3: Retry Low-Confidence Clips
```bash
POST /api/retry-clips-elevenlabs
{
  "videoId": "ZmM_DQ0aRvk"
}
```

Result: 5 clips retried with ElevenLabs, better transcription quality

### Step 4: View Improved Results
Videos tab shows updated transcripts with:
- Improved accuracy
- Higher confidence scores
- Retry count updated

## Benefits

✅ **Automatic Quality Control** - No manual review needed
✅ **Smart Retry Logic** - Only retry clips that need it
✅ **Cost Efficient** - Use ElevenLabs only when needed
✅ **Better Accuracy** - AssemblyAI + ElevenLabs best of both
✅ **Track Retries** - Know which clips were improved

## Cost Optimization

- **AssemblyAI**: Cheap first pass (~$0.10/video)
- **ElevenLabs**: Expensive but accurate (~$0.50/video)
- **Hybrid**: Use ElevenLabs only for 30% of clips needing retry
- **Total Cost**: ~$0.25/video (much cheaper than all ElevenLabs)

## Future Enhancements

1. **Automatic Retry** - Background job to retry flagged clips
2. **Bulk Retry** - Retry multiple videos at once
3. **Quality Metrics** - Track improvement stats
4. **ML Model** - Learn which clips consistently need retry
5. **User Feedback** - Let users vote on transcription quality
