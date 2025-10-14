#!/bin/bash

# 🎯 AUTOMATED DOCKER + SUPABASE SETUP SCRIPT
# Run this AFTER installing Docker Desktop

echo "🔧 SETTING UP DOCKER + SUPABASE CLI..."
echo ""

# Check if Docker is running
echo "1️⃣  Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please:"
    echo "   1. Open Docker Desktop from Applications"
    echo "   2. Wait for it to fully start (2-5 minutes)"
    echo "   3. Run this script again"
    exit 1
fi
echo "✅ Docker is running!"

# Test Docker with hello world
echo ""
echo "2️⃣  Testing Docker..."
docker run --rm hello-world > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Docker test successful!"
else
    echo "❌ Docker test failed"
    exit 1
fi

# Update Supabase CLI
echo ""
echo "3️⃣  Updating Supabase CLI..."
npm install -g supabase@latest

# Navigate to project directory
cd /Users/jeremysamuels/Documents/pashto-bible-search

# Link to remote project
echo ""
echo "4️⃣  Linking to remote Supabase project..."
supabase link --project-ref nkombdutnjvaasxrbmdn

# Test connection
echo ""
echo "5️⃣  Testing connection..."
supabase status

echo ""
echo "🎯 SETUP COMPLETE!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Deploy frequency data: supabase db push"
echo "2. Test your schemas: supabase db diff --linked"
echo ""
echo "✅ Your local Docker + remote Supabase setup is ready!"
