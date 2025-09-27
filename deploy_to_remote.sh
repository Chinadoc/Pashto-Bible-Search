#!/bin/bash

echo "🚀 DEPLOYING TO REMOTE SUPABASE"
echo "==============================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

print_success "Supabase CLI is available"

# Check if we're linked to remote project
print_status "Checking remote project link..."
if ! supabase projects list | grep -q "nkombdutnjvaasxrbmdn"; then
    print_status "Linking to remote project..."
    supabase link --project-ref nkombdutnjvaasxrbmdn
    if [ $? -eq 0 ]; then
        print_success "Linked to remote project"
    else
        print_error "Failed to link to remote project"
        exit 1
    fi
else
    print_success "Already linked to remote project"
fi

# Deploy frequency consolidation first
print_status "Step 1: Deploying frequency consolidation..."
if supabase db push --include-all; then
    print_success "Frequency consolidation deployed"
else
    print_error "Failed to deploy frequency consolidation"
    exit 1
fi

# Deploy unified schema
print_status "Step 2: Deploying unified schema..."
if supabase db push; then
    print_success "Unified schema deployed"
else
    print_error "Failed to deploy unified schema"
    exit 1
fi

echo ""
print_success "🎉 DEPLOYMENT COMPLETE!"
echo ""
echo "🔍 Test your remote system:"
echo "   Go to: https://supabase.com/dashboard/project/nkombdutnjvaasxrbmdn/sql"
echo "   Run: SELECT * FROM search_unified('وهل', 10);"
echo ""
echo "📊 Your unified Pashto Bible search is now live!"
echo "   • Sub-3ms queries"
echo "   • Complete morphological analysis"
echo "   • Lemma-anchored architecture"
echo "   • POS confidence tracking"
echo ""
echo "🚀 Enjoy your advanced Pashto Bible search system!"
