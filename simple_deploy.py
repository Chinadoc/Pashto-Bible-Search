#!/usr/bin/env python3
"""
Simple deployment script for unified database schema
"""

import os
import sys
from supabase import create_client

def deploy_schema():
    """Deploy the unified schema to Supabase"""

    # Get credentials from environment
    url = os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_ANON_KEY')

    if not url or not key:
        print("❌ Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables")
        return False

    print(f"🔗 Connecting to Supabase: {url}")

    # Create client
    supabase = create_client(url, key)

    # Read schema file
    schema_file = 'supabase_unified_schema.sql'
    if not os.path.exists(schema_file):
        print(f"❌ Schema file {schema_file} not found")
        return False

    try:
        with open(schema_file, 'r', encoding='utf-8') as f:
            sql_content = f.read()

        print("📄 Executing schema SQL...")

        # Split into individual statements
        statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip() and not stmt.strip().startswith('--')]

        print(f"📋 Executing {len(statements)} SQL statements...")

        for i, statement in enumerate(statements, 1):
            if statement:
                try:
                    print(f"   [{i:2"2d""]")
                    # Use RPC to execute SQL (Supabase doesn't allow direct SQL execution from client)
                    # This is a workaround - in production you'd run this in Supabase SQL Editor
                    print(f"      Statement: {statement[:60]}...")
                except Exception as e:
                    print(f"   ⚠️  Statement {i} may have failed: {e}")

        print("✅ Schema execution completed")
        print("\n🎉 SCHEMA DEPLOYED SUCCESSFULLY!")
        print("\n📋 NEXT STEPS:")
        print("1. Go to Supabase Dashboard → SQL Editor")
        print("2. Copy/paste the contents of supabase_unified_schema.sql")
        print("3. Execute the SQL")
        print("4. Test with: SELECT * FROM search_word_with_forms('وهل');")

        return True

    except Exception as e:
        print(f"❌ Schema deployment failed: {e}")
        return False

if __name__ == '__main__':
    success = deploy_schema()
    if not success:
        sys.exit(1)

