#!/bin/bash
set -a
source .env.local
set +a

echo "🚀 Running dictionary enrichment..."
echo "📡 Supabase URL: ${NEXT_PUBLIC_SUPABASE_URL:0:30}..."
echo "⏰ Started at: $(date)"

echo ""
echo "🔄 Processing dictionary entries..."
echo "   This may take 5-15 minutes depending on your internet connection"
echo "   Progress will be shown below..."
echo ""

npx ts-node scripts/enrich_dictionary_metadata.ts

echo ""
echo "✅ Dictionary enrichment completed at: $(date)"

