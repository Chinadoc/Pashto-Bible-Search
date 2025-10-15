#!/bin/bash

# Download All Yousafzai 2019 Audio Files from Afghan Bibles
# This script downloads audio files for all books (Genesis to Revelation) 
# and splits them into individual verse files

set -e  # Exit on any error

echo "🕌 Starting Yousafzai 2019 Audio Download"
echo "=========================================="

# Check if Python script exists
if [ ! -f "download_yousafzai_audio.py" ]; then
    echo "❌ Error: download_yousafzai_audio.py not found"
    exit 1
fi

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ Error: ffmpeg is required but not installed"
    echo "   Install with: brew install ffmpeg (macOS) or sudo apt install ffmpeg (Ubuntu)"
    exit 1
fi

# Create output directory
mkdir -p yousafzai_audio_files

echo "📁 Output directory: yousafzai_audio_files/"
echo ""

# Download all books
echo "🚀 Starting download of all Yousafzai 2019 books..."
echo "   This may take several hours depending on your internet connection."
echo ""

# Run the Python downloader for all books
python3 download_yousafzai_audio.py

echo ""
echo "✅ Yousafzai 2019 audio download complete!"
echo ""
echo "📊 Summary:"
echo "   - All books downloaded to: yousafzai_audio_files/"
echo "   - Individual verse files organized by book/chapter"
echo "   - Naming convention: yousafzai_<book><chapter>_verse_<verse>.mp3"
echo ""
echo "📝 Next steps:"
echo "   1. Review downloaded files"
echo "   2. Upload to Supabase storage (if needed)"
echo "   3. Update database with audio URLs"
echo ""
echo "🔍 To check specific books:"
echo "   ls yousafzai_audio_files/<book>/"
echo ""
echo "🎉 Done!"
