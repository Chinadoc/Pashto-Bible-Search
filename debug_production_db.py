#!/usr/bin/env python3
"""
Debug production database issues
Test Supabase connection and data availability
"""

import os
import requests
from supabase import create_client

def test_supabase_connection():
    """Test basic Supabase connection"""
    print("🔍 Testing Supabase Connection...")

    try:
        supabase = create_client(
            os.environ.get('NEXT_PUBLIC_SUPABASE_URL'),
            os.environ.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')
        )
        print("✅ Supabase client created")

        # Test basic connection with a simple query
        result = supabase.table('verses').select('count', count='exact', head=True).execute()
        print(f"✅ Basic connection works. Verses table has {result.count} records")

        return supabase

    except Exception as e:
        print(f"❌ Supabase connection failed: {e}")
        return None

def check_database_tables(supabase):
    """Check what tables exist and their contents"""
    print("\n📊 Checking Database Tables...")

    tables_to_check = ['verses', 'verses_yousafzai', 'audio_by_verse']

    for table in tables_to_check:
        try:
            # Try to get count
            result = supabase.table(table).select('count', count='exact', head=True).execute()
            print(f"✅ Table '{table}': {result.count} records")

            if result.count > 0:
                # Get a sample record
                sample = supabase.table(table).select('*').limit(1).execute()
                if sample.data:
                    print(f"   📝 Sample record keys: {list(sample.data[0].keys())}")

        except Exception as e:
            print(f"❌ Table '{table}' error: {e}")

def test_search_functionality(supabase):
    """Test search functionality"""
    print("\n🔍 Testing Search Functionality...")

    test_queries = ['الله', 'د', 'و']

    for query in test_queries:
        try:
            # Test search_unified function if it exists
            result = supabase.rpc('search_unified', {'query': query, 'limit_param': 5}).execute()
            if result.data:
                print(f"✅ search_unified('{query}') returned {len(result.data)} results")
            else:
                print(f"⚠️  search_unified('{query}') returned no results")
        except Exception as e:
            print(f"❌ search_unified('{query}') failed: {e}")

def test_audio_map_api():
    """Test the audio map API endpoint"""
    print("\n🎵 Testing Audio Map API...")

    base_url = "https://pashto-bible-search.vercel.app"

    try:
        # Test audio map API
        response = requests.get(f"{base_url}/api/get_audio_map?clear_cache=1", timeout=10)
        print(f"🎵 Audio Map API: {response.status_code}")

        if response.status_code != 200:
            print(f"   ❌ Response: {response.text[:200]}...")
        else:
            data = response.json()
            print(f"   ✅ Returned {len(data)} audio mappings")

    except requests.exceptions.RequestException as e:
        print(f"❌ Audio Map API failed: {e}")

def test_search_api():
    """Test the search API endpoint"""
    print("\n🔍 Testing Search API...")

    base_url = "https://pashto-bible-search.vercel.app"

    test_payloads = [
        {"query": "الله", "scope": "all", "includeRelated": True, "enableFuzzy": False},
        {"query": "د", "scope": "all", "includeRelated": True, "enableFuzzy": False}
    ]

    for payload in test_payloads:
        try:
            response = requests.post(f"{base_url}/api/search", json=payload, timeout=10)
            print(f"🔍 Search API '{payload['query']}': {response.status_code}")

            if response.status_code == 200:
                data = response.json()
                results_count = len(data.get('results', []))
                print(f"   📊 Found {results_count} results")
            else:
                print(f"   ❌ Response: {response.text[:200]}...")

        except requests.exceptions.RequestException as e:
            print(f"❌ Search API '{payload['query']}' failed: {e}")

def check_environment_variables():
    """Check environment variables"""
    print("\n⚙️  Environment Variables...")

    vars_to_check = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY'
    ]

    for var in vars_to_check:
        value = os.environ.get(var)
        if value:
            # Mask the middle part for security
            if len(value) > 20:
                masked = value[:10] + "***" + value[-10:]
            else:
                masked = "***SET***"
            print(f"✅ {var}: {masked}")
        else:
            print(f"❌ {var}: Not set")

def main():
    """Main debugging function"""
    print("🔧 Production Database Debug Tool")
    print("=" * 40)

    # Check environment
    check_environment_variables()

    # Test Supabase connection
    supabase = test_supabase_connection()

    if supabase:
        # Check database contents
        check_database_tables(supabase)
        test_search_functionality(supabase)

    # Test API endpoints
    test_audio_map_api()
    test_search_api()

    print("\n🎯 Debug Summary:")
    print("- If Supabase connection fails: Check environment variables")
    print("- If tables are empty: Run data ingestion scripts")
    print("- If search returns 0 results: Data may not be loaded")
    print("- If APIs fail: Check Vercel function logs")

if __name__ == "__main__":
    main()

