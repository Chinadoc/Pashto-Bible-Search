#!/bin/bash
# Upload audio files to Cloudflare R2 using Wrangler
# Usage: ./upload-audio-to-r2.sh <translation> <local-directory>
# Example: ./upload-audio-to-r2.sh afghan2023 ./audio-files/afghan2023/

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check arguments
if [ "$#" -lt 2 ]; then
    echo -e "${RED}Error: Missing arguments${NC}"
    echo "Usage: $0 <translation> <local-directory>"
    echo "  translation: 'afghan2023' or 'yousafzai2019'"
    echo "  local-directory: Path to directory containing audio files"
    echo ""
    echo "Example:"
    echo "  $0 afghan2023 ./audio-files/afghan2023/nt/"
    echo "  $0 yousafzai2019 ./audio-files/yousafzai/ot/"
    exit 1
fi

TRANSLATION="$1"
LOCAL_DIR="$2"

# Validate translation
if [[ "$TRANSLATION" != "afghan2023" && "$TRANSLATION" != "yousafzai2019" ]]; then
    echo -e "${RED}Error: Invalid translation '$TRANSLATION'${NC}"
    echo "Must be 'afghan2023' or 'yousafzai2019'"
    exit 1
fi

# Check if directory exists
if [ ! -d "$LOCAL_DIR" ]; then
    echo -e "${RED}Error: Directory '$LOCAL_DIR' does not exist${NC}"
    exit 1
fi

# Determine testament based on translation (can be overridden with env var)
if [ -z "$TESTAMENT" ]; then
    if [[ "$TRANSLATION" == "afghan2023" ]]; then
        TESTAMENT="nt"
    else
        TESTAMENT="ot"
    fi
fi

echo -e "${GREEN}=== Cloudflare R2 Audio Upload ===${NC}"
echo "Translation: $TRANSLATION"
echo "Testament: $TESTAMENT"
echo "Local directory: $LOCAL_DIR"
echo "R2 Bucket: pashto-bible-audio"
echo ""

# Count files
FILE_COUNT=$(find "$LOCAL_DIR" -name "*.mp3" | wc -l)
echo -e "Found ${YELLOW}$FILE_COUNT${NC} MP3 files"
echo ""

# Confirmation
read -p "Do you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Upload cancelled"
    exit 0
fi

# Upload files
SUCCESS_COUNT=0
ERROR_COUNT=0

echo ""
echo -e "${GREEN}Starting upload...${NC}"
echo ""

# Find all MP3 files and upload them
find "$LOCAL_DIR" -name "*.mp3" | while read -r FILE_PATH; do
    # Get filename
    FILENAME=$(basename "$FILE_PATH")

    # Construct R2 key
    R2_KEY="${TRANSLATION}/${TESTAMENT}/${FILENAME}"

    # Upload using wrangler
    echo -n "Uploading: $FILENAME -> $R2_KEY ... "

    if wrangler r2 object put "pashto-bible-audio/$R2_KEY" --file="$FILE_PATH" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
        ((SUCCESS_COUNT++))
    else
        echo -e "${RED}✗${NC}"
        ((ERROR_COUNT++))
    fi
done

echo ""
echo -e "${GREEN}=== Upload Complete ===${NC}"
echo -e "Successful: ${GREEN}$SUCCESS_COUNT${NC}"
echo -e "Failed: ${RED}$ERROR_COUNT${NC}"
echo ""

# Verify uploads
echo "Verifying uploads in R2..."
wrangler r2 object list pashto-bible-audio --prefix="${TRANSLATION}/${TESTAMENT}/" | head -20

echo ""
echo -e "${GREEN}Done!${NC}"
