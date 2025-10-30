#!/bin/bash
# Execute all D1 migration SQL files in batches

DB_NAME="pashto-bible-db"
MIGRATION_DIR="cloudflare"
BATCH_SIZE=10  # Execute 10 files at a time with delays

echo "🚀 Starting D1 migration execution..."
echo "Database: $DB_NAME"
echo ""

# Count total files
TOTAL_FILES=$(ls -1 ${MIGRATION_DIR}/d1-migration-data-part*.sql 2>/dev/null | wc -l | tr -d ' ')
echo "📊 Found $TOTAL_FILES migration files"

if [ "$TOTAL_FILES" -eq 0 ]; then
  echo "❌ No migration files found!"
  exit 1
fi

SUCCESS=0
FAILED=0

# Execute files in batches
for file in ${MIGRATION_DIR}/d1-migration-data-part*.sql; do
  echo ""
  echo "📝 Executing: $(basename $file)..."
  
  if npx wrangler d1 execute $DB_NAME --remote --file="$file" > /dev/null 2>&1; then
    SUCCESS=$((SUCCESS + 1))
    echo "   ✅ Success ($SUCCESS/$TOTAL_FILES)"
  else
    FAILED=$((FAILED + 1))
    echo "   ❌ Failed ($FAILED failed)"
    # Show error
    npx wrangler d1 execute $DB_NAME --remote --file="$file" 2>&1 | tail -3
  fi
  
  # Small delay to avoid rate limits
  sleep 0.5
done

echo ""
echo "📊 Migration Summary:"
echo "   ✅ Successful: $SUCCESS"
echo "   ❌ Failed: $FAILED"
echo "   📁 Total: $TOTAL_FILES"

if [ "$FAILED" -eq 0 ]; then
  echo ""
  echo "✅ All migrations completed successfully!"
  echo ""
  echo "Verify with:"
  echo "   npx wrangler d1 execute $DB_NAME --remote --command=\"SELECT COUNT(*) FROM verses;\""
else
  echo ""
  echo "⚠️  Some migrations failed. Review errors above."
fi


