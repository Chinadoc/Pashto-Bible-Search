# Pashto Video Processing Setup

## Overview
This system processes YouTube videos containing Pashto content with intelligent transcription, music detection, and cost optimization.

## Key Features
✅ **Multiple Video Support** - Handles multiple videos without conflicts
✅ **Pashto-Optimized Transcription** - Enhanced accuracy for Pashto content
✅ **Cost-Effective Processing** - Skips music segments to save transcription costs
✅ **Quality Validation** - Validates transcriptions for accuracy
✅ **Automatic Re-transcription** - Retries failed segments automatically

## Processing the New Video

The system is now set up to process the specific video: **https://www.youtube.com/watch?v=0tvvnixN7iw&t=252s**

### Option 1: Web Interface (Recommended)
1. Navigate to the **Videos/Audio** tab in the application
2. The video URL is already pre-filled in the "Process New Video" section
3. Click **"Process Video"** to start processing
4. Monitor progress in real-time

### Option 2: Command Line
```bash
# Process the specific video
python3 process_specific_video.py

# Or use the enhanced cost-efficient processor directly
python3 cost_efficient_processor.py "https://www.youtube.com/watch?v=0tvvnixN7iw&t=252s"
```

## Expected Results
- **Video ID**: `0tvvnixN7iw`
- **Content**: Should be entirely in Pashto (no Dari as mentioned)
- **Processing**: Music segments will be automatically detected and skipped
- **Transcription**: Enhanced Pashto character detection and validation
- **Cost Savings**: Music exclusion should save ~$0.01 per second of music

## Technical Enhancements Made

### 1. Video Organization
- Added unique filename generation with timestamps
- Better directory structure for multiple video processing
- Enhanced file naming to prevent conflicts

### 2. Pashto Transcription Optimization
- Enhanced transcription method with Pashto character validation
- Added real-time feedback during processing
- Improved segment-by-segment processing for accuracy

### 3. Cost-Effective Music Exclusion
- Advanced music detection using spectral analysis
- Detailed cost tracking and reporting
- Visual indicators for skipped vs. processed segments

### 4. Quality Assurance
- Automatic re-transcription of failed segments
- Pashto content validation
- Comprehensive error handling and logging

## Monitoring and Troubleshooting

### Check Processing Status
```bash
# View processing logs
tail -f processed_videos/0tvvnixN7iw_results.json

# Check for any errors in the logs
grep -r "ERROR\|❌" processed_videos/
```

### Verify Pashto Content
The system will automatically validate that transcriptions contain Pashto characters and flag any non-Pashto content for review.

### Cost Analysis
The system provides detailed cost analysis showing:
- Total speech duration processed
- Music duration skipped
- Estimated cost savings from music exclusion

## Next Steps
1. **Process the video** using either method above
2. **Review the results** in the Videos/Audio tab
3. **Check transcript quality** in the Transcripts sub-tab
4. **Verify Pashto content** in the processed segments

The system is now optimized for processing Pashto content with maximum accuracy and cost efficiency!
