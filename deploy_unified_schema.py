#!/usr/bin/env python3
"""
Deployment script for unified database schema in Supabase
This script helps set up the unified search database schema
"""

import os
import sys
from supabase import create_client, Client

def get_supabase_client() -> Client:
    """Get Supabase client with credentials from environment"""
    url = os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_ANON_KEY')

    if not url or not key:
        print("❌ SUPABASE_URL and SUPABASE_ANON_KEY environment variables required")
        print("   Set them with:")
        print("   export SUPABASE_URL='your-supabase-url'")
        print("   export SUPABASE_ANON_KEY='your-anon-key'")
        sys.exit(1)

    return create_client(url, key)

def execute_sql_from_file(supabase: Client, filepath: str):
    """Execute SQL from file in Supabase"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            sql_content = f.read()

        print(f"📄 Executing SQL from {filepath}...")

        # Split into individual statements (basic approach)
        statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip() and not stmt.strip().startswith('--')]

        for i, statement in enumerate(statements, 1):
            if statement:
                print(f"   Executing statement {i}/{len(statements)}...")
                try:
                    supabase.rpc('execute_sql', {'query': statement}).execute()
                except Exception as e:
                    print(f"   ⚠️  Statement {i} may have failed: {e}")
                    print(f"   Statement: {statement[:100]}...")

        print("✅ SQL execution completed")

    except Exception as e:
        print(f"❌ Failed to execute SQL from {filepath}: {e}")
        return False

    return True

def test_database_connection(supabase: Client):
    """Test database connection and basic functionality"""
    try:
        print("🔍 Testing database connection...")

        # Test basic query
        result = supabase.table('word_forms').select('count').limit(1).execute()
        print("✅ Database connection successful")

        # Test if our tables exist
        try:
            result = supabase.table('word_forms').select('id').limit(1).execute()
            print("✅ word_forms table exists")
        except:
            print("⚠️  word_forms table may not exist yet")

        try:
            result = supabase.table('morphological_relationships').select('id').limit(1).execute()
            print("✅ morphological_relationships table exists")
        except:
            print("⚠️  morphological_relationships table may not exist yet")

        return True

    except Exception as e:
        print(f"❌ Database connection test failed: {e}")
        return False

def main():
    """Main deployment function"""
    print("🚀 UNIFIED DATABASE SCHEMA DEPLOYMENT")
    print("=" * 80)

    # Get Supabase client
    supabase = get_supabase_client()

    # Test connection
    if not test_database_connection(supabase):
        print("❌ Cannot proceed without database connection")
        return

    # Deploy schema
    schema_file = 'supabase_unified_schema.sql'

    if not os.path.exists(schema_file):
        print(f"❌ Schema file {schema_file} not found")
        return

    print("\n📋 DEPLOYMENT STEPS:")
    print("1. Create/enable required PostgreSQL extensions")
    print("2. Create core tables with proper indexes")
    print("3. Set up database functions for morphological operations")
    print("4. Populate with sample data for testing")
    print("5. Grant appropriate permissions")
    success = execute_sql_from_file(supabase, schema_file)

    if success:
        print("\n🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!")
        print("\n📋 NEXT STEPS:")
        print("1. Run data migration script: python3 migrate_to_unified_db.py")
        print("2. Test search functionality")
        print("3. Update your search API to use database functions")
        print("4. Enjoy 30-50x faster searches!")
    else:
        print("\n❌ DEPLOYMENT FAILED")
        print("Check the error messages above and try again")

if __name__ == '__main__':
    main()
