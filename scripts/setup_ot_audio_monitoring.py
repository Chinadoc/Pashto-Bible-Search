#!/usr/bin/env python3
"""
Setup OT Audio Monitoring System

This script sets up the complete OT audio monitoring system for Afghan Bibles integration.
It configures cron jobs, validates the setup, and performs initial monitoring.
"""

import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Dict, List

def run_command(cmd: str, cwd: str = None) -> bool:
    """Run a shell command and return success status"""
    try:
        result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Command failed: {cmd}")
            print(f"Error: {result.stderr}")
            return False
        return True
    except Exception as e:
        print(f"Exception running command '{cmd}': {e}")
        return False

def validate_environment() -> bool:
    """Validate that all required components are available"""
    print("🔍 Validating environment...")

    # Check Python
    if not run_command("python3 --version"):
        print("❌ Python 3 not available")
        return False

    # Check Node.js
    if not run_command("node --version"):
        print("❌ Node.js not available")
        return False

    # Check required Python packages
    try:
        import requests
        import aiohttp
    except ImportError as e:
        print(f"❌ Missing required Python package: {e}")
        print("Install with: pip install requests aiohttp")
        return False

    # Check required scripts exist
    required_scripts = [
        "scripts/monitor_ot_audio.py",
        "scripts/update_ot_audio_map.py",
        "external_monitoring_service.py",
        "external_monitoring_config.json"
    ]

    for script in required_scripts:
        if not Path(script).exists():
            print(f"❌ Required script not found: {script}")
            return False

    # Check external monitoring config
    config_file = Path("external_monitoring_config.json")
    if config_file.exists():
        try:
            with open(config_file, 'r') as f:
                config = json.load(f)
            if not config.get('monitoring', {}).get('enabled', False):
                print("⚠️  External monitoring is disabled in config")
        except Exception as e:
            print(f"❌ Error reading config: {e}")
            return False

    print("✅ Environment validation passed")
    return True

def setup_directories() -> bool:
    """Create necessary directories"""
    print("📁 Setting up directories...")

    directories = [
        "ot_audio_files",
        "cache",
        "backups"
    ]

    for dir_name in directories:
        Path(dir_name).mkdir(exist_ok=True)
        print(f"✅ Created directory: {dir_name}")

    return True

def test_ot_audio_monitoring() -> bool:
    """Test the OT audio monitoring system"""
    print("🧪 Testing OT audio monitoring...")

    # Test basic monitoring (without download)
    test_cmd = "python3 scripts/monitor_ot_audio.py --books genesis"
    if not run_command(test_cmd):
        print("❌ OT audio monitor test failed")
        return False

    print("✅ OT audio monitor test passed")
    return True

def update_external_monitoring_config() -> bool:
    """Update external monitoring config to include OT audio monitoring"""
    print("⚙️  Updating external monitoring configuration...")

    config_file = Path("external_monitoring_config.json")
    if not config_file.exists():
        print("❌ External monitoring config not found")
        return False

    try:
        with open(config_file, 'r') as f:
            config = json.load(f)

        # Ensure OT books are included in monitoring
        ot_books = [
            "genesis", "exodus", "leviticus", "numbers", "deuteronomy",
            "joshua", "judges", "ruth", "1-samuel", "2-samuel",
            "1-kings", "2-kings", "1-chronicles", "2-chronicles",
            "ezra", "nehemiah", "esther", "job", "psalms", "proverbs",
            "ecclesiastes", "song-of-songs", "isaiah", "jeremiah",
            "lamentations", "ezekiel", "daniel", "hosea", "joel",
            "amos", "obadiah", "jonah", "micah", "nahum", "habakkuk",
            "zephaniah", "haggai", "zechariah", "malachi"
        ]

        current_books = config.get('monitoring', {}).get('books_to_monitor', [])
        missing_books = [book for book in ot_books if book not in current_books]

        if missing_books:
            current_books.extend(missing_books)
            config['monitoring']['books_to_monitor'] = sorted(list(set(current_books)))
            print(f"✅ Added {len(missing_books)} OT books to monitoring config")

        # Ensure audio content type is included
        content_types = config.get('monitoring', {}).get('content_types', [])
        if 'audio' not in content_types:
            content_types.append('audio')
            config['monitoring']['content_types'] = content_types
            print("✅ Added audio content type to monitoring config")

        # Save updated config
        with open(config_file, 'w') as f:
            json.dump(config, f, indent=2)

        print("✅ External monitoring config updated")
        return True

    except Exception as e:
        print(f"❌ Failed to update config: {e}")
        return False

def setup_cron_jobs() -> bool:
    """Set up cron jobs for automated monitoring"""
    print("⏰ Setting up automated monitoring...")

    # Create cron job script
    cron_script = """#!/bin/bash
# OT Audio Monitoring Cron Job
# This script runs the OT audio monitoring system

cd /path/to/pashto-bible-search

# Run OT audio monitoring
python3 scripts/monitor_ot_audio.py --download --webhook

# Update audio file map
python3 scripts/update_ot_audio_map.py

echo "OT audio monitoring completed at $(date)" >> ot_audio_monitor.log
"""

    cron_script_path = Path("scripts/cron_ot_audio_monitor.sh")
    try:
        with open(cron_script_path, 'w') as f:
            f.write(cron_script)
        cron_script_path.chmod(0o755)
        print("✅ Created cron script: scripts/cron_ot_audio_monitor.sh")
    except Exception as e:
        print(f"❌ Failed to create cron script: {e}")
        return False

    # Display cron job setup instructions
    print("\n📋 To set up automated monitoring, add this to your crontab:")
    print("   crontab -e")
    print("   Add this line to run daily at 2 AM:")
    print("   0 2 * * * /path/to/pashto-bible-search/scripts/cron_ot_audio_monitor.sh")
    print("\n   Replace /path/to/pashto-bible-search with the actual path")

    return True

def perform_initial_monitoring() -> bool:
    """Perform initial monitoring to establish baseline"""
    print("🔍 Performing initial OT audio monitoring...")

    # Run initial monitoring for a few books to test
    test_books = ["genesis", "psalms", "isaiah"]
    for book in test_books:
        print(f"📖 Monitoring {book}...")
        cmd = f"python3 scripts/monitor_ot_audio.py --books {book}"
        if not run_command(cmd):
            print(f"⚠️  Initial monitoring failed for {book}, continuing...")

    print("✅ Initial monitoring completed")
    return True

def create_monitoring_dashboard() -> bool:
    """Create a simple monitoring dashboard/status script"""
    print("📊 Creating monitoring dashboard...")

    dashboard_script = """#!/usr/bin/env python3
\"\"\"
OT Audio Monitoring Dashboard

Displays the status of OT audio monitoring and recent activity.
\"\"\"

import json
import os
from datetime import datetime, timedelta
from pathlib import Path

def load_cache(cache_file: str) -> dict:
    \"\"\"Load monitoring cache\"\"\"
    if Path(cache_file).exists():
        try:
            with open(cache_file, 'r') as f:
                return json.load(f)
        except:
            pass
    return {}

def main():
    print("🎵 Pashto Bible Search - OT Audio Monitoring Dashboard")
    print("=" * 60)

    # Load caches
    ot_cache = load_cache('ot_audio_cache.json')
    external_cache = load_cache('external_content_cache.json')

    # Count OT audio files
    ot_audio_count = len([k for k in external_cache.keys() if k.startswith('audio_')])
    ot_text_count = len([k for k in external_cache.keys() if not k.startswith('audio_') and any(book in k for book in ['genesis', 'exodus', 'psalms', 'isaiah'])])

    print(f"📁 OT Audio Files: {ot_audio_count}")
    print(f"📄 OT Text Chapters: {ot_text_count}")

    # Show recent activity (last 24 hours)
    recent_cutoff = datetime.now() - timedelta(hours=24)
    recent_updates = []

    for key, data in external_cache.items():
        if key.startswith('audio_'):
            last_checked = data.get('timestamp')
            if last_checked:
                try:
                    checked_time = datetime.fromisoformat(last_checked.replace('Z', '+00:00'))
                    if checked_time > recent_cutoff:
                        recent_updates.append((key, checked_time))
                except:
                    pass

    if recent_updates:
        print(f"\\n🕐 Recent Activity (last 24h): {len(recent_updates)} files checked")
        for key, timestamp in sorted(recent_updates, key=lambda x: x[1], reverse=True)[:5]:
            print(f"   {timestamp.strftime('%H:%M')} - {key}")
    else:
        print("\\n🕐 No recent activity in the last 24 hours")

    # Show cache file sizes
    cache_files = ['ot_audio_cache.json', 'external_content_cache.json', 'audio_file_map.json']
    print("\\n💾 Cache Files:")
    for cache_file in cache_files:
        path = Path(cache_file)
        if path.exists():
            size_kb = path.stat().st_size / 1024
            print(f"   {cache_file}: {size_kb:.1f} KB")
        else:
            print(f"   {cache_file}: Not found")

    print("\\n✅ Dashboard complete")

if __name__ == "__main__":
    main()
"""

    dashboard_path = Path("scripts/ot_audio_dashboard.py")
    try:
        with open(dashboard_path, 'w') as f:
            f.write(dashboard_script)
        dashboard_path.chmod(0o755)
        print("✅ Created monitoring dashboard: scripts/ot_audio_dashboard.py")
        return True
    except Exception as e:
        print(f"❌ Failed to create dashboard: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Setting up OT Audio Monitoring System for Afghan Bibles")
    print("=" * 60)

    steps = [
        ("Validate Environment", validate_environment),
        ("Setup Directories", setup_directories),
        ("Update Config", update_external_monitoring_config),
        ("Test Monitoring", test_ot_audio_monitoring),
        ("Initial Monitoring", perform_initial_monitoring),
        ("Setup Cron Jobs", setup_cron_jobs),
        ("Create Dashboard", create_monitoring_dashboard)
    ]

    success_count = 0
    for step_name, step_func in steps:
        print(f"\\n📋 Step: {step_name}")
        if step_func():
            success_count += 1
        else:
            print(f"❌ Step failed: {step_name}")
            break

    print(f"\\n{'='*60}")
    if success_count == len(steps):
        print("🎉 OT Audio Monitoring System setup completed successfully!")
        print("\\n📝 Next steps:")
        print("1. Review the configuration in external_monitoring_config.json")
        print("2. Set up cron jobs for automated monitoring")
        print("3. Run 'python3 scripts/ot_audio_dashboard.py' to check status")
        print("4. Monitor logs in ot_audio_monitor.log")
    else:
        print(f"❌ Setup failed at step {success_count + 1}. Please fix issues and try again.")
        return 1

    return 0

if __name__ == "__main__":
    sys.exit(main())

