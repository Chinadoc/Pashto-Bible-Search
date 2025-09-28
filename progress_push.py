#!/usr/bin/env python3
"""
🎯 PROGRESS-TRACKED GIT PUSH
Monitors git push progress and provides real-time feedback
"""

import subprocess
import time
import threading
import sys
from typing import Optional

class ProgressTracker:
    def __init__(self):
        self.start_time = time.time()
        self.last_update = 0
        self.stage = "Initializing"

    def update_progress(self, line: str):
        """Parse git output and update progress"""
        current_time = time.time()

        # Parse different git push stages
        if "Counting objects" in line:
            self.stage = "📊 Counting objects"
        elif "Compressing objects" in line:
            self.stage = "🗜️  Compressing"
        elif "Writing objects" in line:
            self.stage = "📝 Writing objects"
        elif "remote: Resolving deltas" in line:
            self.stage = "🔄 Processing on server"
        elif "remote: Updating references" in line:
            self.stage = "✅ Finalizing"

        # Show progress every second
        if current_time - self.last_update > 1.0:
            elapsed = current_time - self.start_time
            print(f"\r⏱️  {elapsed:.1f}s | {self.stage}", end="", flush=True)
            self.last_update = current_time

def run_push_with_progress():
    """Run git push with real-time progress tracking"""
    tracker = ProgressTracker()

    try:
        # Start git push process
        process = subprocess.Popen(
            ["git", "push", "origin", "main"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            universal_newlines=True
        )

        print("🚀 STARTING GIT PUSH...")
        print("📊 Monitoring progress...\n")

        # Monitor output
        while True:
            output = process.stdout.readline()
            if output == '' and process.poll() is not None:
                break
            if output:
                tracker.update_progress(output.strip())

        # Final status
        if process.returncode == 0:
            elapsed = time.time() - tracker.start_time
            print("\n\n🎉 PUSH COMPLETED SUCCESSFULLY!")
            print(f"⏱️  Total time: {elapsed:.1f} seconds")
            return True
        else:
            print(f"\n\n❌ PUSH FAILED (exit code: {process.returncode})")
            return False

    except KeyboardInterrupt:
        print("\n\n⚠️  PUSH INTERRUPTED BY USER")
        process.terminate()
        return False
    except Exception as e:
        print(f"\n\n💥 PUSH ERROR: {e}")
        return False

def check_push_requirements():
    """Check if push can proceed"""
    print("🔍 CHECKING PUSH REQUIREMENTS...")

    try:
        # Check if we're ahead of remote
        result = subprocess.run(
            ["git", "rev-list", "--count", "origin/main..HEAD"],
            capture_output=True, text=True
        )
        commits_ahead = int(result.stdout.strip()) if result.returncode == 0 else 0

        # Check repository size
        result = subprocess.run(["du", "-sh", ".git"], capture_output=True, text=True)
        repo_size = result.stdout.strip() if result.returncode == 0 else "unknown"

        print(f"📊 Commits to push: {commits_ahead}")
        print(f"📊 Repository size: {repo_size}")

        if commits_ahead == 0:
            print("ℹ️  No commits to push")
            return False

        return True

    except Exception as e:
        print(f"⚠️  Check failed: {e}")
        return False

def main():
    """Main push function"""
    print("🎯 ROBUST GIT PUSH WITH PROGRESS TRACKING")
    print("=" * 50)

    if not check_push_requirements():
        print("\n❌ Cannot proceed with push")
        return

    print("\n🚀 STARTING PUSH...")
    print("💡 Press Ctrl+C to cancel\n")

    success = run_push_with_progress()

    if success:
        print("\n🌐 CHANGES PUSHED TO GITHUB")
        print("🎉 Vercel will auto-deploy: https://pashto-bible-search.vercel.app")
    else:
        print("\n💡 ALTERNATIVE: Use GitHub web interface")
        print("   Go to: https://github.com/Chinadoc/Pashto-Bible-Search")
        print("   Upload files from: essential_files.txt")

if __name__ == "__main__":
    main()
