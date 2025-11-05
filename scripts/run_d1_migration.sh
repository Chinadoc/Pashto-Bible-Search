#!/bin/bash
# Run D1 migration and processing
# Usage: ./scripts/run_d1_migration.sh [options]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🚀 Starting D1 LingDocs Migration"
echo "=================================="
echo ""

# Step 1: Run database migration
echo "📋 Step 1: Running database migration..."
cd "$PROJECT_ROOT"

if command -v wrangler &> /dev/null; then
  echo "  Applying migration to D1 database..."
  wrangler d1 execute pashto-bible-db --file=scripts/migrate_d1_to_lingdocs.sql
  
  echo "  ✅ Migration applied"
  echo ""
  
  # Step 2: Verify tables were created
  echo "📊 Step 2: Verifying tables..."
  wrangler d1 execute pashto-bible-db --command="SELECT name FROM sqlite_master WHERE type='table' AND name IN ('verb_metadata', 'verb_conjugations', 'noun_metadata', 'comparison_log');" || true
  
  echo ""
  echo "✅ Migration complete!"
  echo ""
  echo "Next steps:"
  echo "  1. Deploy your Worker with the migration endpoint"
  echo "  2. Call POST /api/migrate-lingdocs with action='process_verbs'"
  echo "  3. Call POST /api/migrate-lingdocs with action='normalize_inflections'"
  echo ""
  echo "Example curl commands:"
  echo "  curl -X POST https://your-worker.workers.dev/api/migrate-lingdocs \\"
  echo "    -H 'Content-Type: application/json' \\"
  echo "    -d '{\"action\": \"process_verbs\", \"batchSize\": 100}'"
  
else
  echo "  ⚠️  Wrangler CLI not found. Install it with:"
  echo "    npm install -g wrangler"
  echo ""
  echo "  Or run migration manually:"
  echo "    wrangler d1 execute pashto-bible-db --file=scripts/migrate_d1_to_lingdocs.sql"
fi

