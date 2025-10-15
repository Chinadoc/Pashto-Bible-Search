# YouTube Audio Processing for Pashto Bible Search

This feature allows you to download YouTube videos, split them into 5-minute segments, extract audio, and transcribe the audio to Pashto text using the ElevenLabs API.

## Features

- 🎥 Download YouTube videos using `yt-dlp`
- ✂️ Split videos into 5-minute segments for quality preservation
- 🎵 Extract audio from video segments
- 🎤 Transcribe audio to Pashto text using ElevenLabs API
- 📝 Display audio clips and transcripts in the website tabs

## Setup

### 1. Install Dependencies

Run the setup script to install required dependencies:

```bash
./setup_audio_processing.sh
```

This will install:
- `yt-dlp` for YouTube video downloading
- `ffmpeg` for video/audio processing
- Python dependencies from `requirements_audio.txt`

### 2. Get ElevenLabs API Key

1. Sign up at [ElevenLabs](https://elevenlabs.io/)
2. Get your API key from the dashboard
3. Set it as an environment variable or pass it as a parameter

## Usage

### Process YouTube Video

```bash
# Using environment variable
export ELEVENLABS_API_KEY=your_api_key_here
python3 youtube_audio_processor.py

# Or pass API key directly
python3 youtube_audio_processor.py --elevenlabs-key your_api_key_here

# Process a different video
python3 youtube_audio_processor.py --url "https://www.youtube.com/watch?v=VIDEO_ID"
```

### What the Script Does

1. **Downloads** the YouTube video to `videos/` directory
2. **Splits** the video into 5-minute segments
3. **Extracts** audio from each segment to `audio_clips/` directory
4. **Transcribes** each audio clip to Pashto text using ElevenLabs API
5. **Saves** transcripts to `poems/` directory
6. **Creates** metadata file with processing information

### Output Structure

```
audio_clips/          # Audio files (.wav format)
├── video_segment_001.wav
├── video_segment_002.wav
└── ...

poems/               # Transcribed text files (.txt format)
├── video_segment_001.txt
├── video_segment_002.txt
└── ...

videos/              # Video segments and metadata
├── original_video.mp4
├── video_segment_001.mp4
├── video_segment_002.mp4
└── processing_metadata.json
```

## Website Integration

The processed content automatically appears in the website tabs:

### Videos/Audio Tab
- Displays all audio clips with playback controls
- Shows file size and creation date
- Provides download links

### Poems Tab
- Displays transcribed Pashto text
- Shows character count and creation date
- Formatted for easy reading

## API Endpoints

The website provides API endpoints to serve the processed content:

- `GET /api/audio-clips` - List all audio clips
- `GET /api/audio-clips/[filename]` - Serve specific audio file
- `GET /api/poems` - List all poems/transcripts

## Configuration

### Video Quality
The script downloads videos in 720p or lower for faster processing. You can modify the quality in `youtube_audio_processor.py`:

```python
'--format', 'best[height<=720]'  # Change height limit
```

### Segment Duration
Default is 5 minutes (300 seconds). Change `SEGMENT_DURATION` in the script:

```python
SEGMENT_DURATION = 300  # 5 minutes in seconds
```

### Audio Format
Audio is extracted as 16kHz mono WAV files optimized for speech recognition.

## Troubleshooting

### Missing Dependencies
```bash
# Install yt-dlp
pip3 install yt-dlp

# Install ffmpeg
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

### API Rate Limits
ElevenLabs has rate limits. The script includes delays between requests. If you hit limits:
- Wait and retry
- Process fewer segments at once
- Consider upgrading your ElevenLabs plan

### Audio Quality Issues
- Ensure the source video has good audio quality
- Check that the video isn't too long (very long videos may have quality degradation)
- Verify the ElevenLabs API key is valid

## File Sizes

- Video segments: ~50-100MB each (depending on source quality)
- Audio clips: ~5-10MB each (16kHz WAV)
- Transcripts: ~1-5KB each (text files)

## Security Notes

- Only audio files (.wav, .mp3, .m4a) are served by the API
- File paths are validated to prevent directory traversal
- API keys should be kept secure and not committed to version control

## Support

For issues or questions:
1. Check the console output for error messages
2. Verify all dependencies are installed
3. Ensure the ElevenLabs API key is valid
4. Check that the YouTube URL is accessible
