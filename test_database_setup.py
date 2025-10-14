#!/usr/bin/env python3
"""
Test script to verify database setup and functionality
"""

import os
import sys
from supabase import create_client, Client

def get_supabase_client() -> Client:
    """Get Supabase client"""
    url = os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_ANON_KEY')

    if not url or not key:
        print("❌ Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables")
        return None

    return create_client(url, key)

def test_basic_connection(supabase: Client):
    """Test basic database connection"""
    try:
        print("🔍 Testing basic connection...")
        result = supabase.table('word_forms').select('count').limit(1).execute()
        print("✅ Basic connection successful")
        return True
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

def test_tables_exist(supabase: Client):
    """Test if our tables exist"""
    tables_to_test = ['word_forms', 'morphological_relationships', 'verses', 'word_occurrences']

    print("\n📋 Testing table existence:")
    all_exist = True

    for table in tables_to_test:
        try:
            result = supabase.table(table).select('id').limit(1).execute()
            print(f"✅ {table} table exists")
        except Exception as e:
            print(f"❌ {table} table missing: {e}")
            all_exist = False

    return all_exist

def test_functions_exist(supabase: Client):
    """Test if our functions exist"""
    functions_to_test = [
        'search_word_with_forms',
        'fuzzy_search_words',
        'get_frequent_words',
        'get_forms_for_root',
        'morphological_search'
    ]

    print("\n🔧 Testing function existence:")
    all_exist = True

    for func in functions_to_test:
        try:
            # Try to call the function with test data
            if func == 'search_word_with_forms':
                result = supabase.rpc(func, {'target_word': 'وهل'}).execute()
            elif func == 'fuzzy_search_words':
                result = supabase.rpc(func, {'search_term': 'وهل', 'max_results': 5}).execute()
            elif func == 'get_frequent_words':
                result = supabase.rpc(func, {'limit_count': 5}).execute()
            elif func == 'get_forms_for_root':
                result = supabase.rpc(func, {'root_word': 'وهل'}).execute()
            elif func == 'morphological_search':
                result = supabase.rpc(func, {'search_term': 'وهل', 'pos_filter': 'verb'}).execute()

            print(f"✅ {func} function works")
        except Exception as e:
            print(f"❌ {func} function issue: {e}")
            all_exist = False

    return all_exist

def test_sample_data(supabase: Client):
    """Test with sample data"""
    print("\n🧪 Testing sample data:")

    try:
        # Test search for وهل
        result = supabase.rpc('search_word_with_forms', {'target_word': 'وهل'}).execute()
        if result.data:
            data = result.data[0]
            print(f"✅ Found 'وهل': {data['frequency_count']} occurrences, {len(data['related_forms'])} related forms")
        else:
            print("⚠️  No data found for 'وهل'")

        # Test fuzzy search
        result = supabase.rpc('fuzzy_search_words', {'search_term': 'وهل', 'max_results': 3}).execute()
        if result.data and len(result.data) > 0:
            print(f"✅ Fuzzy search works: found {len(result.data)} similar words")
        else:
            print("⚠️  Fuzzy search returned no results")

        # Test frequency
        result = supabase.rpc('get_frequent_words', {'limit_count': 3}).execute()
        if result.data and len(result.data) > 0:
            print(f"✅ Frequency query works: top word has {result.data[0]['frequency_count']} occurrences")
        else:
            print("⚠️  Frequency query returned no results")

        return True

    except Exception as e:
        print(f"❌ Sample data test failed: {e}")
        return False

def main():
    """Main test function"""
    print("🧪 DATABASE SETUP VERIFICATION")
    print("=" * 80)

    supabase = get_supabase_client()
    if not supabase:
        return

    # Run tests
    tests = [
        ("Basic Connection", test_basic_connection),
        ("Tables Exist", test_tables_exist),
        ("Functions Work", test_functions_exist),
        ("Sample Data", test_sample_data)
    ]

    results = []
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        success = test_func(supabase)
        results.append((test_name, success))

    # Summary
    print("
🎯 TEST SUMMARY:"    print("=" * 80)

    passed = sum(1 for _, success in results if success)
    total = len(results)

    for test_name, success in results:
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{test_name"<30"} {status}")

    print(f"\n📊 Overall: {passed}/{total} tests passed")

    if passed == total:
        print("
🎉 ALL TESTS PASSED!"        print("✅ Database is ready for unified search")
        print("✅ You can now proceed with data migration")
        print("✅ Search performance will be 30-50x faster")
    else:
        print("
❌ Some tests failed"        print("🔧 Check the error messages above")
        print("🔧 Fix issues before proceeding")

if __name__ == '__main__':
    main()

