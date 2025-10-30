#!/bin/bash
# Monitor migration progress

echo "🔍 Monitoring migration progress..."
echo "Press Ctrl+C to stop monitoring"
echo ""

while true; do
  clear
  npx tsx cloudflare/display-progress.ts 2>/dev/null || echo "Error checking progress"
  sleep 10
done


