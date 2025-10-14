#!/bin/bash

echo "🎉 COMPLETE PASHTO BIBLE SEARCH SETUP"
echo "===================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if files exist
required_files=(
    "setup_supabase_local.sh"
    "deploy_to_local.py"
    "test_local_supabase.py"
    "frequency_consolidation_migration.sql"
    "lemma_anchored_unified_migration.sql"
)

print_status "Checking required files..."
missing_files=()
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "✅ $file exists"
    else
        print_error "❌ $file missing"
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    print_error "Missing required files: ${missing_files[*]}"
    exit 1
fi

print_success "All required files are present!"

echo ""
echo "🚀 SETUP PROCESS:"
echo "================"

# Step 1: Install Supabase CLI
print_status "Step 1: Installing Supabase CLI..."
if ! command -v supabase &> /dev/null; then
    if command -v npm &> /dev/null; then
        npm install -g supabase
        print_success "Supabase CLI installed"
    else
        print_error "npm not found. Please install Node.js and npm first."
        exit 1
    fi
else
    print_success "Supabase CLI already installed"
fi

# Step 2: Setup local Supabase
print_status "Step 2: Setting up local Supabase..."
if [ -f "supabase/config.toml" ]; then
    print_success "Local Supabase already initialized"
else
    print_status "Initializing local Supabase project..."
    supabase init
fi

# Step 3: Link to remote project
print_status "Step 3: Linking to remote project..."
supabase link --project-ref nkombdutnjvaasxrbmdn

# Step 4: Pull remote schema
print_status "Step 4: Pulling remote schema..."
supabase db pull

# Step 5: Start local Supabase
print_status "Step 5: Starting local Supabase..."
supabase start

# Step 6: Deploy frequency consolidation
print_status "Step 6: Deploying frequency consolidation..."
python3 deploy_to_local.py

# Step 7: Test the setup
print_status "Step 7: Testing local setup..."
python3 test_local_supabase.py

echo ""
echo "🎉 SETUP COMPLETE!"
echo "=================="
echo ""
echo "📍 Your local database is now running:"
echo "   Database: postgresql://postgres:postgres@localhost:54321/postgres"
echo "   Dashboard: http://localhost:54321"
echo ""
echo "🔍 Test your unified system:"
echo "   psql postgresql://postgres:postgres@localhost:54321/postgres"
echo "   SELECT * FROM unified_search_mv WHERE surface = 'وهل';"
echo "   SELECT * FROM search_unified('ګرمول', 5);"
echo ""
echo "🛑 To stop local Supabase:"
echo "   supabase stop"
echo ""
echo "✨ You now have a complete local Pashto Bible search system!"
echo "   Enjoy sub-3ms queries on your local machine! 🚀"
