#!/usr/bin/env python3
"""
Deploy migrations to local Supabase instance
"""

import subprocess
import sys

def run_migration(file_path):
    """Run a SQL migration file locally"""

    try:
        # Use psql to run the migration
        cmd = [
            'psql',
            'postgresql://postgres:postgres@localhost:54321/postgres',
            '-f', file_path
        ]

        print(f"📄 Running migration: {file_path}")
        result = subprocess.run(cmd, capture_output=True, text=True)

        if result.returncode == 0:
            print("✅ Migration completed successfully!")
            return True
        else:
            print(f"❌ Migration failed: {result.stderr}")
            return False

    except Exception as e:
        print(f"❌ Error running migration: {e}")
        return False

def main():
    print("🚀 DEPLOYING TO LOCAL SUPABASE")
    print("=" * 40)

    # Check if Supabase is running
    try:
        result = subprocess.run(['supabase', 'status'], capture_output=True, text=True)
        if 'running' not in result.stdout.lower():
            print("❌ Supabase is not running. Start it with: supabase start")
            return
    except:
        print("❌ Cannot check Supabase status. Make sure it's installed and running.")
        return

    print("✅ Supabase is running")

    # Deploy frequency consolidation first
    print("\n📊 Step 1: Deploying frequency consolidation...")
    if run_migration('frequency_consolidation_migration.sql'):
        print("   ✅ Frequency data deployed")

        # Deploy unified schema
        print("\n🏗️  Step 2: Deploying unified schema...")
        if run_migration('lemma_anchored_unified_migration.sql'):
            print("   ✅ Unified schema deployed")

            print("\n🎉 ALL MIGRATIONS COMPLETED!")
            print("\n🧪 Test your setup:")
            print("   python test_local_supabase.py")
            print("   psql postgresql://postgres:postgres@localhost:54321/postgres")
            print("   SELECT * FROM unified_search_mv WHERE surface = 'وهل';")
        else:
            print("   ❌ Failed to deploy unified schema")
    else:
        print("   ❌ Failed to deploy frequency consolidation")

if __name__ == "__main__":
    main()
