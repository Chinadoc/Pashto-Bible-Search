#!/bin/bash
# Upload bulk SQL files with proper delays to avoid rate limits

cd "$(dirname "$0")/.."

echo "🚀 Uploading bulk SQL files to D1..."
echo "This will take time but won't hit rate limits"
echo ""

TOTAL_FILES=$(ls cloudflare/bulk-*.sql 2>/dev/null | wc -l | tr -d ' ')
CURRENT=0

for file in cloudflare/bulk-yousafzai-part*.sql cloudflare/bulk-afghan-part*.sql; do
  if [ ! -f "$file" ]; then
    continue
  fi
  
  CURRENT=$((CURRENT + 1))
  echo "[$CURRENT/$TOTAL_FILES] Processing $file..."
  
  # Upload with retries
  SUCCESS=false
  for attempt in {1..5}; do
    if npx wrangler d1 execute pashto-bible-db --remote --file="$file" 2>&1 | grep -q "success"; then
      echo "   ✅ Success!"
      SUCCESS=true
      break
    else
      if [ $attempt -lt 5 ]; then
        WAIT_TIME=$((attempt * 5))
        echo "   ⚠️  Attempt $attempt failed, waiting ${WAIT_TIME}s..."
        sleep $WAIT_TIME
      else
        echo "   ❌ Failed after 5 attempts"
      fi
    fi
  done
  
  # Check progress
  if [ $((CURRENT % 2)) -eq 0 ]; then
    COUNT=$(npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM verses;" 2>&1 | grep -o '"count":[0-9]*' | grep -o '[0-9]*' | head -1)
    echo "   📊 Database now has: $COUNT verses"
  fi
  
  # Longer delay between files to avoid rate limits
  sleep 3
done

echo ""
echo "✅ Bulk upload complete!"
echo "Check progress: npx tsx cloudflare/display-progress.ts"


