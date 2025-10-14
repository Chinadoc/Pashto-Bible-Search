#!/bin/bash
# Setup automated OT Audio Pipeline cron job

echo "⏰ Setting up OT Audio Pipeline cron job..."
echo ""

# Get the absolute path to the project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPT_PATH="$PROJECT_DIR/scripts/automate_ot_audio.py"

echo "Project directory: $PROJECT_DIR"
echo "Script path: $SCRIPT_PATH"
echo ""

# Check if script exists
if [ ! -f "$SCRIPT_PATH" ]; then
    echo "❌ Script not found: $SCRIPT_PATH"
    exit 1
fi

# Check if python3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ python3 not found in PATH"
    exit 1
fi

# Create cron job entry
CRON_JOB="0 3 * * * cd \"$PROJECT_DIR\" && python3 \"$SCRIPT_PATH\" >> \"$PROJECT_DIR/ot_audio_cron.log\" 2>&1"

echo "📋 Cron job to add:"
echo "   $CRON_JOB"
echo ""
echo "This will run the OT audio pipeline daily at 3:00 AM."
echo ""

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "automate_ot_audio.py"; then
    echo "⚠️  OT audio cron job already exists. Remove it first if you want to update:"
    echo "   crontab -e  # Then delete the line with automate_ot_audio.py"
    exit 1
fi

# Add to crontab
echo "Adding cron job..."
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

if [ $? -eq 0 ]; then
    echo "✅ Cron job added successfully!"
    echo ""
    echo "📅 Current cron jobs:"
    crontab -l
    echo ""
    echo "📊 Monitor the pipeline:"
    echo "   tail -f \"$PROJECT_DIR/ot_audio_cron.log\""
    echo ""
    echo "🔄 Test the pipeline manually:"
    echo "   cd \"$PROJECT_DIR\" && python3 \"$SCRIPT_PATH\""
else
    echo "❌ Failed to add cron job"
    exit 1
fi

