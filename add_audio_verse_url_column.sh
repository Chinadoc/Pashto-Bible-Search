#!/bin/bash
# Add audio_verse_url and audio_storage_filename columns to verses_yousafzai table

# Get Supabase credentials from environment or prompt
SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}"
SUPABASE_SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

if [ -z "$SUPABASE_URL" ]; then
    echo "Please set NEXT_PUBLIC_SUPABASE_URL environment variable"
    exit 1
fi

if [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "Please set SUPABASE_SERVICE_ROLE_KEY environment variable"
    exit 1
fi

# Execute SQL to add columns
curl -X POST "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "ALTER TABLE public.verses_yousafzai ADD COLUMN IF NOT EXISTS audio_verse_url text, ADD COLUMN IF NOT EXISTS audio_storage_filename text;"
  }'

echo "Columns added successfully!"
