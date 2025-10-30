#!/bin/bash
# Simple progress checker

echo "📊 Migration Progress"
echo "===================="
echo ""

# Get counts from JSON output
VERSE_OUTPUT=$(npx wrangler d1 execute pashto-bible-db --remote --command="SELECT translation_key, COUNT(*) as count FROM verses GROUP BY translation_key;" 2>&1)
TOTAL_OUTPUT=$(npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as total FROM verses;" 2>&1)

# Extract counts (simple grep approach)
YOUSAFZAI=$(echo "$VERSE_OUTPUT" | grep -o '"yousafzai2019".*"count":[0-9]*' | grep -o '[0-9]*' | head -1)
AFGHAN=$(echo "$VERSE_OUTPUT" | grep -o '"afghan2023".*"count":[0-9]*' | grep -o '[0-9]*' | head -1)
TOTAL=$(echo "$TOTAL_OUTPUT" | grep -o '"total":[0-9]*' | grep -o '[0-9]*' | head -1)

echo "📖 Verses:"
echo "   Yousafzai 2019: ${YOUSAFZAI:-0} / 30,410"
echo "   Afghan 2023: ${AFGHAN:-0} / 24,160"
echo "   Total: ${TOTAL:-0} / 54,570"
echo ""

# Calculate percentage
if [ ! -z "$TOTAL" ] && [ "$TOTAL" -gt 0 ]; then
  PERCENT=$(echo "scale=1; $TOTAL * 100 / 54570" | bc 2>/dev/null || echo "0")
  echo "   Progress: ${PERCENT}%"
fi

echo ""
echo "💡 Migration appears to have stopped at 300 verses."
echo "   To continue, run: npx tsx cloudflare/migrate-comprehensive-to-d1.ts"


