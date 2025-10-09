#!/usr/bin/env python3
"""
OT Audio Monitoring Dashboard

Displays the status of OT audio monitoring and recent activity.
"""

import json
import os
from datetime import datetime, timedelta
from pathlib import Path

def load_cache(cache_file: str) -> dict:
    """Load monitoring cache"""
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
        print(f"\n🕐 Recent Activity (last 24h): {len(recent_updates)} files checked")
        for key, timestamp in sorted(recent_updates, key=lambda x: x[1], reverse=True)[:5]:
            print(f"   {timestamp.strftime('%H:%M')} - {key}")
    else:
        print("\n🕐 No recent activity in the last 24 hours")

    # Show cache file sizes
    cache_files = ['ot_audio_cache.json', 'external_content_cache.json', 'audio_file_map.json']
    print("\n💾 Cache Files:")
    for cache_file in cache_files:
        path = Path(cache_file)
        if path.exists():
            size_kb = path.stat().st_size / 1024
            print(f"   {cache_file}: {size_kb:.1f} KB")
        else:
            print(f"   {cache_file}: Not found")

    # Count verse files
    ot_audio_dir = Path('ot_audio_files')
    verse_count = 0
    if ot_audio_dir.exists():
        for root, dirs, files in os.walk(ot_audio_dir):
            for file in files:
                if file.endswith('.mp3') and '_verse_' in file:
                    verse_count += 1

    print(f"\n🎵 Individual Verse Files: {verse_count}")

    print("\n✅ Dashboard complete")

if __name__ == "__main__":
    main()
