#!/bin/bash

echo "🚀 SETTING UP SUPABASE LOCALLY..."
echo "================================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
else
    echo "✅ Supabase CLI already installed"
fi

# Initialize local project (if not already done)
if [ ! -f "supabase/config.toml" ]; then
    echo "🔧 Initializing local Supabase project..."
    supabase init
else
    echo "✅ Local Supabase project already initialized"
fi

# Link to remote project
echo "🔗 Linking to remote project..."
supabase link --project-ref nkombdutnjvaasxrbmdn

# Pull remote schema and data
echo "📥 Pulling remote schema..."
supabase db pull

# Start local Supabase
echo "🏃 Starting local Supabase..."
supabase start

echo ""
echo "🎉 SUPABASE LOCAL SETUP COMPLETE!"
echo "=================================="
echo ""
echo "📍 Your local database:"
echo "   URL: postgresql://postgres:postgres@localhost:54321/postgres"
echo "   Dashboard: http://localhost:54321"
echo ""
echo "🔧 Useful commands:"
echo "   supabase start    - Start local instance"
echo "   supabase stop     - Stop local instance"
echo "   supabase status   - Check status"
echo ""
echo "📊 Test your setup:"
echo "   psql postgresql://postgres:postgres@localhost:54321/postgres -c 'SELECT COUNT(*) FROM verses_yousafzai;'"
