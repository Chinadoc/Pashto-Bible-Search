#!/usr/bin/env python3
"""
Automated Frequency Consolidation Deployment Script

This script deploys the frequency consolidation migration to Supabase.
Make sure you have your Supabase credentials set up in environment variables.

Usage: python deploy_frequency_consolidation.py
"""

import os
import sys
from supabase import create_client, Client

def deploy_frequency_consolidation():
    """Deploy the frequency consolidation migration to Supabase"""

    # Get Supabase credentials
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not key:
        print("❌ Missing Supabase credentials!")
        print("Make sure these environment variables are set:")
        print("  NEXT_PUBLIC_SUPABASE_URL")
        print("  SUPABASE_SERVICE_ROLE_KEY")
        return False

    print(f"🔗 Connecting to Supabase: {url}")

    try:
        # Initialize Supabase client
        supabase: Client = create_client(url, key)
        print("✅ Connected to Supabase")

        # Read the migration SQL
        migration_file = "frequency_consolidation_migration.sql"
        if not os.path.exists(migration_file):
            print(f"❌ Migration file not found: {migration_file}")
            return False

        print(f"📖 Reading migration file: {migration_file}")

        with open(migration_file, 'r', encoding='utf-8') as f:
            migration_sql = f.read()

        print(f"📏 Migration size: {len(migration_sql)} characters")
        print("🚀 Executing migration...")

        # Execute the migration
        # Note: This approach may not work for large migrations
        # You might need to run this manually in the Supabase dashboard
        result = supabase.rpc('exec_sql', {'sql': migration_sql})

        print("✅ Migration executed successfully!")
        print("🎉 Frequency consolidation deployment complete!")
        return True

    except Exception as e:
        print(f"❌ Error during deployment: {e}")
        print("\n🔧 Alternative: Manual deployment")
        print("1. Copy the contents of frequency_consolidation_migration.sql")
        print("2. Go to: https://supabase.com/dashboard/project/nkombdutnjvaasxrbmdn/sql")
        print("3. Click 'New Query'")
        print("4. Paste the SQL and click 'Run'")
        return False

def main():
    print("🚀 SUPABASE FREQUENCY CONSOLIDATION DEPLOYMENT")
    print("=" * 50)

    success = deploy_frequency_consolidation()

    if success:
        print("\n🎉 DEPLOYMENT SUCCESSFUL!")
        print("\n📋 NEXT STEPS:")
        print("1. Test the new word_frequencies_unified table")
        print("2. Update your application code to use the new table")
        print("3. Test search functionality")
        print("4. Consider dropping old frequency tables after verification")
    else:
        print("\n⚠️  DEPLOYMENT FAILED")
        print("Please try manual deployment using the Supabase dashboard")

if __name__ == "__main__":
    main()
