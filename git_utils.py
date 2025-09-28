#!/usr/bin/env python3
"""
🎯 GIT UTILITY FUNCTIONS
Provides robust git operations with timeout and error handling
"""

import subprocess
import time
import sys
from typing import Optional

def run_git_command(cmd: list, timeout: int = 60) -> bool:
    """Run git command with timeout and better error handling"""
    try:
        print(f"🔄 Running: {' '.join(cmd)}")
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout
        )

        if result.returncode == 0:
            print("✅ Command completed successfully")
            if result.stdout:
                print(f"📤 Output: {result.stdout.strip()}")
            return True
        else:
            print(f"❌ Command failed with code {result.returncode}")
            if result.stderr:
                print(f"⚠️  Error: {result.stderr.strip()}")
            return False

    except subprocess.TimeoutExpired:
        print(f"⏰ Command timed out after {timeout} seconds")
        return False
    except Exception as e:
        print(f"💥 Unexpected error: {e}")
        return False

def push_with_retry(max_attempts: int = 3) -> bool:
    """Try to push with multiple attempts and different strategies"""
    strategies = [
        ["git", "push", "origin", "main"],
        ["git", "push", "--force-with-lease", "origin", "main"],
        ["git", "push", "origin", "main", "--verbose"]
    ]

    for attempt in range(max_attempts):
        print(f"\n🔄 Push attempt {attempt + 1}/{max_attempts}")

        for strategy in strategies:
            print(f"📋 Trying: {' '.join(strategy)}")
            if run_git_command(strategy, timeout=120):
                return True
            time.sleep(2)  # Brief pause between attempts

    return False

def check_repo_health() -> dict:
    """Check repository health and provide diagnostics"""
    print("🔍 CHECKING REPOSITORY HEALTH...")

    health = {
        "git_size": "unknown",
        "commits_ahead": 0,
        "large_files": [],
        "remote_connected": False
    }

    try:
        # Check git size
        result = subprocess.run(["du", "-sh", ".git"],
                              capture_output=True, text=True)
        health["git_size"] = result.stdout.strip() if result.returncode == 0 else "error"

        # Check commits ahead
        result = subprocess.run(["git", "rev-list", "--count", "origin/main..HEAD"],
                              capture_output=True, text=True)
        health["commits_ahead"] = int(result.stdout.strip()) if result.returncode == 0 else 0

        # Check remote connection
        result = subprocess.run(["git", "remote", "get-url", "origin"],
                              capture_output=True, text=True)
        health["remote_connected"] = result.returncode == 0

        # Find large files in git
        result = subprocess.run(["git", "rev-list", "--objects", "--all"],
                              capture_output=True, text=True)
        if result.returncode == 0:
            objects = result.stdout.strip().split('\n')
            large_files = []
            for obj in objects:
                if obj and len(obj.split()) >= 2:
                    size = len(obj.split()[0]) * 4  # Rough estimate
                    if size > 100 * 1024 * 1024:  # > 100MB
                        large_files.append(obj.split()[1])
            health["large_files"] = large_files[:5]  # Top 5

    except Exception as e:
        print(f"⚠️  Health check error: {e}")

    return health

def main():
    """Main utility function"""
    print("🎯 GIT UTILITY - ROBUST OPERATIONS")
    print("=" * 40)

    health = check_repo_health()

    print("
📊 REPOSITORY HEALTH:"    print(f"   Git size: {health['git_size']}")
    print(f"   Commits ahead: {health['commits_ahead']}")
    print(f"   Remote connected: {health['remote_connected']}")
    if health['large_files']:
        print(f"   Large files found: {len(health['large_files'])}")

    if health['commits_ahead'] == 0:
        print("\n✅ No commits to push")
        return

    print(f"\n🚀 {health['commits_ahead']} commits ready to push")

    response = input("\n🔄 Attempt robust push? (y/n): ").lower().strip()
    if response == 'y':
        if push_with_retry():
            print("\n🎉 PUSH COMPLETED SUCCESSFULLY!")
            print("🌐 Your changes are now on GitHub")
        else:
            print("\n❌ ALL PUSH ATTEMPTS FAILED")
            print("💡 Try manual approach or GitHub web interface")
    else:
        print("\n👋 Push canceled")

if __name__ == "__main__":
    main()
