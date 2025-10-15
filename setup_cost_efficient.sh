#!/bin/bash

echo "🚀 Setting up cost-efficient video processing..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
echo "📦 Installing dependencies..."
source venv/bin/activate

# Install basic dependencies first
pip install numpy requests pydub

# Try to install librosa (may fail on some systems)
echo "🎵 Installing audio processing libraries..."
pip install librosa soundfile scipy || {
    echo "⚠️  librosa installation failed, using fallback method"
    echo "The processor will use pydub-only mode"
}

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
        pip install yt-dlp
    fi
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p processed_videos
mkdir -p audio_clips
mkdir -p sentence_clips

# Set up environment variables
echo "🔑 Setting up environment variables..."
if [ ! -f .env.local ]; then
    cat > .env.local << EOF
# OpenAI API Key for GPT-5 nano quality validation
OPENAI_API_KEY=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

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://nkombdutnjvaasxrbmdn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rb21iZHV0bmp2YWFzeHJibWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzMxNDMsImV4cCI6MjA3MjA0OTE0M30.dBdCCD8hJAWV4Y8sRNVi2uUSnDrZbUM4TxR6vl8-ENg
EOF
    echo "Created .env.local file with existing Supabase configuration."
fi

echo "✅ Setup complete!"
echo ""
echo "Cost-efficient features:"
echo "• Music detection skips transcription for music segments"
echo "• GPT-5 nano for fast, cheap quality validation"
echo "• Google Drive integration for file storage"
echo "• Supabase for metadata and search"
echo ""
echo "Next steps:"
echo "1. Add your API keys to .env.local"
echo "2. Test: python3 cost_efficient_processor.py 'https://www.youtube.com/watch?v=Xqn_-onV9DQ'"
echo "3. Use the web interface to process new videos"
