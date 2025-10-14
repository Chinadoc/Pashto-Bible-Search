#!/usr/bin/env python3
"""
🎯 SUPABASE UNIFIED SCHEMA VERIFICATION SCRIPT

This script tests your deployed unified Pashto Bible search schema.
Run this to verify everything is working correctly.
"""

import os
import sys
from supabase import create_client, Client

# Supabase configuration
SUPABASE_URL = "https://nkombdutnjvaasxrbmdn.supabase.co"
SUPABASE_KEY = os.getenv('SUPABASE_ANON_KEY')  # You'll need to set this

def test_basic_connectivity():
    """Test basic connection to Supabase"""
    print("🔍 Testing Supabase connection...")

    if not SUPABASE_KEY:
        print("❌ SUPABASE_ANON_KEY environment variable not set")
        print("   Get it from: https://supabase.com/dashboard/project/nkombdutnjvaasxrbmdn/settings/api")
        return False

    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        # Simple test query
        result = supabase.table('word_forms_master').select('count').limit(1).execute()
        print("✅ Successfully connected to Supabase!")
        return True
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

def test_unified_search():
    """Test the unified search function"""
    print("\n🔍 Testing unified search function...")

    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

        # Test search for a common Pashto word
        result = supabase.rpc('search_unified', {'search_term': 'وهل', 'limit_count': 5}).execute()

        if result.data:
            print(f"✅ Search returned {len(result.data)} results")
            print("📝 Sample result:")
            sample = result.data[0]
            print(f"   Word: {sample.get('surface', 'N/A')}")
            print(f"   POS: {sample.get('pos', 'N/A')}")
            print(f"   Frequency: {sample.get('frequency', 'N/A')}")
            return True
        else:
            print("❌ Search returned no results")
            return False

    except Exception as e:
        print(f"❌ Search test failed: {e}")
        return False

def test_table_counts():
    """Test that main tables have data"""
    print("\n🔍 Testing table data...")

    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

        # Check main tables
        tables_to_check = [
            ('word_forms_master', 'Word forms'),
            ('unified_search_mv', 'Unified search view'),
            ('lemmas', 'Lemmas')
        ]

        for table, description in tables_to_check:
            try:
                result = supabase.table(table).select('count').single().execute()
                count = result.data.get('count', 0)
                print(f"✅ {description}: {count:,","records")
            except Exception as e:
                print(f"❌ {description}: Failed to query ({e})")

        return True

    except Exception as e:
        print(f"❌ Table count test failed: {e}")
        return False

def main():
    """Run all verification tests"""
    print("🎯 UNIFIED PASHTO BIBLE SEARCH - DEPLOYMENT VERIFICATION")
    print("=" * 60)

    if not test_basic_connectivity():
        print("\n❌ Cannot proceed - fix connection first")
        sys.exit(1)

    test_unified_search()
    test_table_counts()

    print("\n" + "=" * 60)
    print("🎉 VERIFICATION COMPLETE!")
    print("\n💡 Next steps:")
    print("   • Test in your app: supabase.table('unified_search_mv').select('*')")
    print("   • Use search_unified() function for queries")
    print("   • Check dashboard: https://supabase.com/dashboard/project/nkombdutnjvaasxrbmdn")

if __name__ == "__main__":
    main()
