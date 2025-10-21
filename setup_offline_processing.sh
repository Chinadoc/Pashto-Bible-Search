#!/bin/bash

echo "🎬 Setting up offline video processing..."

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if pip is available
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is required but not installed."
    exit 1
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install -r requirements_offline.txt

# Check if yt-dlp is available
if ! command -v yt-dlp &> /dev/null; then
    echo "❌ yt-dlp is required but not installed."
    echo "Please install it manually: pip3 install yt-dlp"
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p processed_videos
mkdir -p audio_clips
mkdir -p sentence_clips

echo "✅ Setup complete!"
echo ""
echo "🚀 To process a video, run:"
echo "   python3 process_video_offline.py"
echo ""
echo "🔄 To retry transcription for a video, run:"
echo "   python3 process_video_offline.py --retry <video_id>"
echo ""
echo "📺 The script will process: https://www.youtube.com/watch?v=0tvvnixN7iw&t=724s"

