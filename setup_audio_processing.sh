#!/bin/bash

# Setup script for YouTube audio processing
echo "🎵 Setting up YouTube Audio Processing for Pashto Bible Search"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is required but not installed."
    exit 1
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install -r requirements_audio.txt

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  ffmpeg is not installed. Please install it:"
    echo "   macOS: brew install ffmpeg"
    echo "   Ubuntu/Debian: sudo apt install ffmpeg"
    echo "   Windows: Download from https://ffmpeg.org/download.html"
    echo ""
    echo "After installing ffmpeg, run this script again."
    exit 1
fi

# Check if yt-dlp is installed
if ! command -v yt-dlp &> /dev/null; then
    echo "❌ yt-dlp installation failed. Please install manually:"
    echo "   pip3 install yt-dlp"
    exit 1
fi

echo "✅ All dependencies installed successfully!"
echo ""
echo "🚀 To process the YouTube video, run:"
echo "   python3 youtube_audio_processor.py --elevenlabs-key YOUR_API_KEY"
echo ""
echo "💡 You can also set the API key as an environment variable:"
echo "   export ELEVENLABS_API_KEY=your_api_key_here"
echo "   python3 youtube_audio_processor.py"
echo ""
echo "📁 The script will create:"
echo "   - audio_clips/ - Audio files extracted from video segments"
echo "   - poems/ - Transcribed Pashto text files"
echo "   - videos/ - Video segments and metadata"
