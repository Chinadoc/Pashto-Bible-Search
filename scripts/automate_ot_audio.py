#!/usr/bin/env python3
"""
Automated OT Audio Pipeline

This script runs the complete OT audio monitoring and integration pipeline:
1. Monitor for new/updated OT audio files
2. Download and split into individual verses
3. Upload to Supabase storage
4. Update database with audio URLs
5. Clean up temporary files

Designed to be run automatically via cron or CI/CD.
"""

import os
import sys
import time
import subprocess
from pathlib import Path
from datetime import datetime

def run_command(cmd, description, cwd=None):
    """Run a command with logging"""
    print(f"\\n🔄 {description}")
    print(f"   Command: {cmd}")

    try:
        start_time = time.time()
        result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
        duration = time.time() - start_time

        if result.returncode == 0:
            print(f"   ✅ Success ({duration:.1f}s)")
            if result.stdout.strip():
                print(f"   Output: {result.stdout.strip()[:200]}...")
            return True
        else:
            print(f"   ❌ Failed ({duration:.1f}s)")
            print(f"   Error: {result.stderr.strip()}")
            return False

    except Exception as e:
        print(f"   💥 Exception: {e}")
        return False

def cleanup_old_files():
    """Clean up old temporary files"""
    print("\\n🧹 Cleaning up old temporary files...")

    # Remove files older than 7 days from ot_audio_files
    import shutil
    from datetime import timedelta

    audio_dir = Path("ot_audio_files")
    if audio_dir.exists():
        cutoff = datetime.now() - timedelta(days=7)

        for file_path in audio_dir.rglob("*"):
            if file_path.is_file():
                try:
                    # Keep chapter files for 7 days, verse files for 1 day
                    if "verse" in file_path.name:
                        file_cutoff = datetime.now() - timedelta(days=1)
                    else:
                        file_cutoff = cutoff

                    if file_path.stat().st_mtime < file_cutoff.timestamp():
                        file_path.unlink()
                        print(f"   🗑️  Removed old file: {file_path}")
                except Exception as e:
                    print(f"   ⚠️  Could not remove {file_path}: {e}")

    print("   ✅ Cleanup complete")

def send_notification(message, success=True):
    """Send notification about pipeline completion"""
    print(f"\\n📢 {'✅' if success else '❌'} {message}")

    # Here you could add Slack, Discord, or email notifications
    # For now, just log to a file
    log_file = Path("ot_audio_pipeline.log")
    timestamp = datetime.now().isoformat()

    with open(log_file, 'a') as f:
        f.write(f"{timestamp} - {'SUCCESS' if success else 'FAILED'} - {message}\\n")

def main():
    """Run the complete OT audio pipeline"""
    print("🚀 OT Audio Pipeline - Automated Processing")
    print("=" * 50)
    print(f"Started at: {datetime.now().isoformat()}")

    pipeline_start = time.time()
    steps_completed = 0
    total_steps = 6

    try:
        # Step 1: Monitor for new OT audio files
        if run_command(
            "python3 scripts/monitor_ot_audio.py --books isaiah --download",
            f"Step 1/{total_steps}: Monitor and download OT audio"
        ):
            steps_completed += 1
        else:
            send_notification("Failed to monitor/download OT audio", False)
            return 1

        # Step 2: Update audio file map
        if run_command(
            "python3 scripts/update_ot_audio_map.py",
            f"Step 2/{total_steps}: Update audio file map"
        ):
            steps_completed += 1
        else:
            send_notification("Failed to update audio file map", False)
            return 1

        # Step 3: Upload to Supabase storage
        if run_command(
            "python3 scripts/upload_ot_audio.py",
            f"Step 3/{total_steps}: Upload audio files to Supabase"
        ):
            steps_completed += 1
        else:
            send_notification("Failed to upload audio to Supabase", False)
            return 1

        # Step 4: Update database URLs
        if run_command(
            "python3 scripts/upload_ot_audio.py --update-db-only",
            f"Step 4/{total_steps}: Update database with audio URLs"
        ):
            steps_completed += 1
        else:
            send_notification("Failed to update database URLs", False)
            return 1

        # Step 5: Trigger data rebuild (optional)
        if run_command(
            "python3 rebuild_data_indexes.py",
            f"Step 5/{total_steps}: Rebuild search indexes",
            cwd="."
        ):
            steps_completed += 1
        else:
            print("   ⚠️  Index rebuild failed, but continuing...")

        # Step 6: Cleanup
        cleanup_old_files()
        steps_completed += 1

        # Success!
        total_time = time.time() - pipeline_start
        success_msg = f"OT Audio Pipeline completed successfully in {total_time:.1f}s ({steps_completed}/{total_steps} steps)"
        send_notification(success_msg, True)

        print(f"\\n🎉 Pipeline completed successfully!")
        print(f"   Duration: {total_time:.1f} seconds")
        print(f"   Steps: {steps_completed}/{total_steps} completed")

        return 0

    except KeyboardInterrupt:
        send_notification("OT Audio Pipeline interrupted by user", False)
        return 1
    except Exception as e:
        send_notification(f"OT Audio Pipeline failed with exception: {e}", False)
        return 1

if __name__ == "__main__":
    exit_code = main()

    # Optional: Send to external monitoring
    if exit_code == 0 and os.getenv('EXTERNAL_UPDATE_WEBHOOK_URL'):
        try:
            import requests
            webhook_url = os.getenv('EXTERNAL_UPDATE_WEBHOOK_URL')
            requests.post(webhook_url, json={
                'source': 'ot_audio_pipeline',
                'status': 'completed' if exit_code == 0 else 'failed',
                'timestamp': datetime.now().isoformat()
            }, timeout=10)
        except:
            pass  # Don't fail the pipeline if webhook fails

    sys.exit(exit_code)

