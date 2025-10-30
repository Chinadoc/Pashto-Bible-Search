#!/bin/bash
# Watch migration progress continuously

cd "$(dirname "$0")/.."

echo "🔍 Watching migration progress..."
echo "Press Ctrl+C to stop"
echo ""

while true; do
  clear
  npx tsx cloudflare/display-progress.ts 2>/dev/null
  
  # Check if migration is still running
  if ! ps aux | grep -q "[m]igrate-comprehensive"; then
    echo ""
    echo "⚠️  Migration process not found. Starting new one..."
    nohup npx tsx cloudflare/migrate-comprehensive-to-d1.ts >> cloudflare/migration.log 2>&1 &
    echo "✅ Restarted migration (PID: $!)"
  fi
  
  sleep 10
done


