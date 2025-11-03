#!/usr/bin/env python3
"""
Master Script: Populate Word Frequencies Database

This script orchestrates the complete database population process:
1. Fills missing romanization and POS (quick win)
2. Classifies all verbs with comprehensive data
3. Provides summary of what was populated

Goal: Fill word_frequencies with robust, categorized data for rapid searching
"""

import subprocess
import sys
from pathlib import Path

def run_script(script_path: str, description: str) -> bool:
    """Run a Python script and report results"""
    print(f"\n{'='*60}")
    print(f"📋 {description}")
    print(f"{'='*60}\n")
    
    script_full_path = Path(__file__).parent / script_path
    
    if not script_full_path.exists():
        print(f"   ⚠️  Script not found: {script_path}")
        return False
    
    try:
        result = subprocess.run(
            [sys.executable, str(script_full_path)],
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        
        print(result.stdout)
        
        if result.stderr:
            print("STDERR:", result.stderr)
        
        if result.returncode == 0:
            print(f"   ✅ {description} completed successfully")
            return True
        else:
            print(f"   ❌ {description} failed with exit code {result.returncode}")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"   ⚠️  {description} timed out after 5 minutes")
        return False
    except Exception as e:
        print(f"   ❌ Error running {description}: {e}")
        return False

def main():
    print("="*60)
    print("🚀 MASTER SCRIPT: Populate Word Frequencies Database")
    print("="*60)
    print("\nThis script will:")
    print("  1. Fill missing romanization and POS data (quick win)")
    print("  2. Classify all verbs with comprehensive data")
    print("  3. Generate SQL files for database updates")
    print("\nGoal: Rapid searching through pre-categorized data\n")
    
    # Step 1: Fill missing data
    success1 = run_script(
        "fill-missing-data.py",
        "Fill Missing Romanization and POS Data"
    )
    
    # Step 2: Populate verb classifications
    success2 = run_script(
        "populate-verb-classifications.py",
        "Populate Verb Classifications"
    )
    
    # Summary
    print("\n" + "="*60)
    print("📊 SUMMARY")
    print("="*60)
    
    if success1 and success2:
        print("\n✅ All scripts completed successfully!")
        print("\n📋 Next steps:")
        print("   1. Review generated SQL files:")
        print("      - cloudflare/fill-missing-data.sql")
        print("      - cloudflare/populate-verb-classifications.sql")
        print("\n   2. Execute SQL files:")
        print("      wrangler d1 execute pashto-bible-db --remote --file cloudflare/fill-missing-data.sql")
        print("      wrangler d1 execute pashto-bible-db --remote --file cloudflare/populate-verb-classifications.sql")
        print("\n   3. Verify in Cloudflare D1 Studio:")
        print("      - Check that NULL values are filled")
        print("      - Verify verb classifications are populated")
        print("      - Test rapid searching/filtering")
    else:
        print("\n⚠️  Some scripts encountered issues. Check output above.")
        if not success1:
            print("   - fill-missing-data.py failed")
        if not success2:
            print("   - populate-verb-classifications.py failed")
    
    print("\n" + "="*60)

if __name__ == '__main__':
    main()

