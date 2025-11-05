#!/bin/bash
# Main script to run LingDocs dictionary processing and database migration
# Usage: ./scripts/run_lingdocs_migration.sh [options]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Default options
COMPARE_ONLY=false
UPDATE_ONLY=false
BATCH_SIZE=1000
DICT_URL=""
DB_PATH=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --compare-only)
      COMPARE_ONLY=true
      shift
      ;;
    --update-only)
      UPDATE_ONLY=true
      shift
      ;;
    --batch-size)
      BATCH_SIZE="$2"
      shift 2
      ;;
    --dict-url)
      DICT_URL="$2"
      shift 2
      ;;
    --db-path)
      DB_PATH="$2"
      shift 2
      ;;
    --help)
      echo "Usage: $0 [options]"
      echo ""
      echo "Options:"
      echo "  --compare-only    Only compare without updating"
      echo "  --update-only     Only update without comparing"
      echo "  --batch-size N    Process N records at a time (default: 1000)"
      echo "  --dict-url URL    Custom dictionary URL"
      echo "  --db-path PATH    Path to D1 database file"
      echo "  --help            Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

echo "🚀 Starting LingDocs Migration Script"
echo "======================================"
echo ""

# Step 1: Run database migration
echo "📋 Step 1: Running database migration..."
if [ -f "$SCRIPT_DIR/migrate_to_lingdocs_format.sql" ]; then
  if [ -n "$DB_PATH" ]; then
    echo "  Applying migration to $DB_PATH..."
    sqlite3 "$DB_PATH" < "$SCRIPT_DIR/migrate_to_lingdocs_format.sql"
    echo "  ✅ Migration applied"
  else
    echo "  ⚠️  No database path provided. Skipping migration."
    echo "  To apply migration manually, run:"
    echo "    sqlite3 <your-db>.db < scripts/migrate_to_lingdocs_format.sql"
  fi
else
  echo "  ⚠️  Migration file not found: $SCRIPT_DIR/migrate_to_lingdocs_format.sql"
fi

echo ""

# Step 2: Process LingDocs dictionary
echo "📚 Step 2: Processing LingDocs dictionary..."
if command -v node &> /dev/null; then
  cd "$PROJECT_ROOT"
  
  # Build the TypeScript files if needed
  if [ -f "tsconfig.json" ]; then
    echo "  Building TypeScript files..."
    npx tsc --noEmit --skipLibCheck scripts/process_lingdocs_dictionary.ts scripts/compare_lingdocs_d1.ts scripts/normalize_existing_data.ts scripts/main_processing.ts 2>/dev/null || true
  fi
  
  # Run the processing script
  echo "  Running processing script..."
  NODE_OPTIONS="--loader ts-node/esm" node -r ts-node/register scripts/main_processing.ts \
    --batch-size "$BATCH_SIZE" \
    ${COMPARE_ONLY:+--compare-only} \
    ${UPDATE_ONLY:+--update-only} \
    ${DICT_URL:+--dict-url "$DICT_URL"} \
    ${DB_PATH:+--db-path "$DB_PATH"}
  
  echo "  ✅ Dictionary processing complete"
else
  echo "  ⚠️  Node.js not found. Skipping dictionary processing."
  echo "  Install Node.js and run manually:"
  echo "    node scripts/main_processing.ts"
fi

echo ""
echo "✅ Migration script complete!"
echo ""
echo "Next steps:"
echo "  1. Review comparison results in the output above"
echo "  2. Check comparison_log table for detailed differences"
echo "  3. Update any remaining mismatches manually if needed"

