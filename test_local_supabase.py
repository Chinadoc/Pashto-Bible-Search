#!/usr/bin/env python3
"""
Test script to verify local Supabase setup
"""

import os
import psycopg2
from supabase import create_client

def test_local_connection():
    """Test connection to local Supabase database"""

    # Test direct PostgreSQL connection
    try:
        conn = psycopg2.connect(
            host="localhost",
            port=54321,
            database="postgres",
            user="postgres",
            password="postgres"
        )
        cursor = conn.cursor()

        # Check if we can query existing tables
        cursor.execute("SELECT COUNT(*) FROM verses_yousafzai;")
        count = cursor.fetchone()[0]

        conn.close()

        print("✅ Direct PostgreSQL connection successful!")
        print(f"   Found {count} verses in verses_yousafzai table")

        return True

    except Exception as e:
        print(f"❌ Direct PostgreSQL connection failed: {e}")
        return False

def test_supabase_client():
    """Test Supabase client connection"""

    try:
        # Use local Supabase URL
        url = "http://localhost:54321"
        key = "your-anon-key"  # This might not work locally

        supabase = create_client(url, key)

        # Try to query verses table
        result = supabase.table('verses_yousafzai').select('count').limit(1).execute()

        print("✅ Supabase client connection successful!")
        return True

    except Exception as e:
        print(f"⚠️  Supabase client test failed: {e}")
        print("   (This is expected if using default anon key)")
        return False

def main():
    print("🧪 TESTING LOCAL SUPABASE SETUP")
    print("=" * 40)

    # Test 1: Direct PostgreSQL connection
    direct_ok = test_local_connection()

    # Test 2: Supabase client (may fail with default key)
    client_ok = test_supabase_client()

    print()
    if direct_ok:
        print("🎉 Local Supabase is working!")
        print()
        print("🔍 You can now run queries like:")
        print("   psql postgresql://postgres:postgres@localhost:54321/postgres")
        print("   SELECT * FROM unified_search_mv WHERE surface = 'وهل';")
        print()
        print("💻 Or in your app:")
        print("   supabase.from('unified_search_mv').select('*').eq('surface', 'وهل')")
    else:
        print("❌ Local Supabase setup needs attention")
        print("   Make sure Supabase is running: supabase status")

if __name__ == "__main__":
    main()
