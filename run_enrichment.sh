#!/bin/bash
set -a
source .env.local
set +a

echo "🚀 Running dictionary enrichment..."
echo "📡 Supabase URL: ${NEXT_PUBLIC_SUPABASE_URL:0:30}..."

npx ts-node scripts/enrich_dictionary_metadata.ts

