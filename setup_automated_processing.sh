#!/bin/bash

echo "🚀 Setting up automated video processing dependencies..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is required but not installed"
    exit 1
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install librosa numpy pydub nltk requests

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  ffmpeg not found. Installing via brew..."
    if command -v brew &> /dev/null; then
        brew install ffmpeg
    else
        echo "❌ Please install ffmpeg manually: https://ffmpeg.org/download.html"
        exit 1
    fi
fi

# Check if yt-dlp is installed
if ! command -v yt-dlp &> /dev/null; then
    echo "⚠️  yt-dlp not found. Installing..."
    if command -v pipx &> /dev/null; then
        pipx install yt-dlp
    else
        pip3 install yt-dlp
    fi
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p processed_videos
mkdir -p sentence_clips
mkdir -p audio_clips

# Set up environment variables
echo "🔑 Setting up environment variables..."
if [ ! -f .env.local ]; then
    echo "OPENAI_API_KEY=your_openai_api_key_here" > .env.local
    echo "Created .env.local file. Please add your OpenAI API key."
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your OpenAI API key to .env.local"
echo "2. Test the processor: python3 automated_video_processor.py 'https://www.youtube.com/watch?v=Xqn_-onV9DQ'"
echo "3. Use the web interface to process new videos"
