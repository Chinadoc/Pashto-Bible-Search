#!/bin/bash
# Continuously run migration until completion
# Auto-restarts if migration stops

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

MAX_ITERATIONS=1000  # Prevent infinite loops
ITERATION=0

echo "🚀 Starting continuous migration process..."
echo "This will keep running until all data is migrated"
echo "Press Ctrl+C to stop"
echo ""

while [ $ITERATION -lt $MAX_ITERATIONS ]; do
  ITERATION=$((ITERATION + 1))
  
  echo "════════════════════════════════════════════════════════════"
  echo "Migration Run #$ITERATION"
  echo "════════════════════════════════════════════════════════════"
  
  # Check current progress
  echo "Current status:"
  npx tsx cloudflare/display-progress.ts 2>/dev/null | grep -E "Overall Progress|Total:" | head -3
  
  # Run migration
  echo ""
  echo "Starting migration..."
  npx tsx cloudflare/migrate-comprehensive-to-d1.ts >> cloudflare/migration.log 2>&1
  
  EXIT_CODE=$?
  
  echo ""
  echo "Migration run completed with exit code: $EXIT_CODE"
  
  # Check if we're done
  TOTAL=$(npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as total FROM verses;" 2>&1 | grep -o '"total":[0-9]*' | grep -o '[0-9]*' | head -1)
  EXPECTED=54570
  
  if [ ! -z "$TOTAL" ] && [ "$TOTAL" -ge "$EXPECTED" ]; then
    echo "✅ Migration appears complete! ($TOTAL verses)"
    echo "Checking other data..."
    sleep 5
    npx tsx cloudflare/display-progress.ts
    echo ""
    echo "🎉 Migration completed successfully!"
    exit 0
  fi
  
  # Wait before next iteration
  echo "Waiting 30 seconds before next run..."
  sleep 30
done

echo "⚠️  Reached max iterations. Check migration status manually."


