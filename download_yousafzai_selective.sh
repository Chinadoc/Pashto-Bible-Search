#!/bin/bash

# Download Selected Yousafzai 2019 Audio Files from Afghan Bibles
# Usage: ./download_yousafzai_selective.sh [book1] [book2] ... [--start-chapter N] [--end-chapter N]

set -e  # Exit on any error

echo "🕌 Yousafzai 2019 Selective Audio Download"
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

# Default values
BOOKS=()
START_CHAPTER=1
END_CHAPTER=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --start-chapter)
            START_CHAPTER="$2"
            shift 2
            ;;
        --end-chapter)
            END_CHAPTER="$2"
            shift 2
            ;;
        *)
            BOOKS+=("$1")
            shift
            ;;
    esac
done

# If no books specified, show usage
if [ ${#BOOKS[@]} -eq 0 ]; then
    echo "Usage: $0 [book1] [book2] ... [--start-chapter N] [--end-chapter N]"
    echo ""
    echo "Examples:"
    echo "  $0 genesis exodus                    # Download Genesis and Exodus"
    echo "  $0 psalms --start-chapter 1 --end-chapter 10  # Download Psalms chapters 1-10"
    echo "  $0 matthew mark luke john            # Download all Gospels"
    echo ""
    echo "Available books:"
    echo "  Old Testament: genesis exodus leviticus numbers deuteronomy joshua judges ruth"
    echo "                  1-samuel 2-samuel 1-kings 2-kings 1-chronicles 2-chronicles"
    echo "                  ezra nehemiah esther job psalms proverbs ecclesiastes song-of-songs"
    echo "                  isaiah jeremiah lamentations ezekiel daniel hosea joel amos"
    echo "                  obadiah jonah micah nahum habakkuk zephaniah haggai zechariah malachi"
    echo ""
    echo "  New Testament: matthew mark luke john acts romans 1-corinthians 2-corinthians"
    echo "                  galatians ephesians philippians colossians 1-thessalonians 2-thessalonians"
    echo "                  1-timothy 2-timothy titus philemon hebrews james 1-peter 2-peter"
    echo "                  1-john 2-john 3-john jude revelation"
    exit 1
fi

# Create output directory
mkdir -p yousafzai_audio_files

echo "📁 Output directory: yousafzai_audio_files/"
echo "📚 Books to download: ${BOOKS[*]}"
if [ "$START_CHAPTER" != "1" ] || [ -n "$END_CHAPTER" ]; then
    echo "📖 Chapter range: $START_CHAPTER${END_CHAPTER:+-$END_CHAPTER}"
fi
echo ""

# Build Python command
PYTHON_CMD="python3 download_yousafzai_audio.py --books ${BOOKS[*]} --start-chapter $START_CHAPTER"
if [ -n "$END_CHAPTER" ]; then
    PYTHON_CMD="$PYTHON_CMD --end-chapter $END_CHAPTER"
fi

echo "🚀 Starting download..."
echo "   Command: $PYTHON_CMD"
echo ""

# Run the Python downloader
eval $PYTHON_CMD

echo ""
echo "✅ Yousafzai 2019 selective download complete!"
echo ""
echo "📊 Summary:"
echo "   - Books downloaded: ${BOOKS[*]}"
echo "   - Files saved to: yousafzai_audio_files/"
echo "   - Individual verse files organized by book/chapter"
echo ""
echo "🔍 To check downloaded files:"
for book in "${BOOKS[@]}"; do
    echo "   ls yousafzai_audio_files/$book/"
done
echo ""
echo "🎉 Done!"
