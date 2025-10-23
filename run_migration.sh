#!/bin/bash
echo "🚀 Running Pashto Bible Audio Migration"
echo "========================================"

# Check if credentials are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Missing Supabase credentials"
    echo "Please set these environment variables:"
    echo "  export NEXT_PUBLIC_SUPABASE_URL='your-supabase-url'"
    echo "  export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'"
    echo ""
    echo "You can find these in your Supabase dashboard:"
    echo "  - URL: Project Settings > API > Project URL"
    echo "  - Service Role Key: Project Settings > API > service_role secret"
    exit 1
fi

echo "✅ Credentials found"
echo "📡 Supabase URL: $NEXT_PUBLIC_SUPABASE_URL"

# Run the migration script
echo "🔄 Running database migration..."
node migrate_audio_to_database.js

if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully!"
    echo ""
    echo "🧪 Test the integration:"
    echo "curl 'https://pashto-bible-search.vercel.app/api/get_yousafzai_aud?clear_cache=1'"
    echo ""
    echo "📊 Expected: Should return audio URLs for Yousafzai translation"
else
    echo "❌ Migration failed"
    exit 1
fi
