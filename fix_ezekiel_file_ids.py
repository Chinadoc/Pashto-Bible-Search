#!/usr/bin/env python3
"""
Fix Ezekiel file IDs in google_drive_audio_urls.json

This script helps replace placeholder file IDs with real Google Drive file IDs
for Ezekiel audio files.
"""

import json
import re
from pathlib import Path

def fix_ezekiel_file_ids(audio_urls_file="google_drive_audio_urls.json"):
    """
    Update Ezekiel entries with real Google Drive file IDs.

    Args:
        audio_urls_file: Path to the audio URLs JSON file
    """

    # Load current audio URLs
    with open(audio_urls_file, 'r', encoding='utf-8') as f:
        audio_data = json.load(f)

    print(f"📊 Loaded {len(audio_data)} audio entries")

    # Count Ezekiel entries with placeholders
    ezekiel_placeholders = 0
    ezekiel_real_ids = 0

    for filename, data in audio_data.items():
        if data.get('book') == 'ezekiel':
            file_id = data.get('google_drive_file_id')
            url = data.get('google_drive_url', '')

            if not file_id or file_id == 'TEST_ID' or 'FILE_ID_HERE' in (file_id or ''):
                ezekiel_placeholders += 1
            else:
                ezekiel_real_ids += 1

    print(f"📈 Ezekiel entries: {ezekiel_placeholders} placeholders, {ezekiel_real_ids} real IDs")

    if ezekiel_placeholders == 0:
        print("✅ All Ezekiel entries already have real file IDs!")
        return

    print("\n🔧 Instructions:")
    print("=" * 50)
    print("To fix the Ezekiel file IDs, you need to:")
    print("1. Upload the Ezekiel verse files to Google Drive")
    print("2. Get the file IDs for each uploaded file")
    print("3. Update this script with the real file IDs")
    print("\n📋 Ezekiel files that need file IDs:")

    # List all Ezekiel files that need file IDs
    ezekiel_files = []
    for filename, data in audio_data.items():
        if data.get('book') == 'ezekiel':
            file_id = data.get('google_drive_file_id')
            url = data.get('google_drive_url', '')

            if not file_id or file_id == 'TEST_ID' or 'FILE_ID_HERE' in (file_id or ''):
                ezekiel_files.append((filename, data))

    for filename, data in sorted(ezekiel_files):
        chapter = data.get('chapter', '??')
        verse = data.get('verse', '??')
        current_url = data.get('google_drive_url', '')
        print(f"  {filename} (Ezekiel {chapter}:{verse})")
        print(f"    Current URL: {current_url}")

        # Extract placeholder from URL if present
        if 'FILE_ID_HERE' in current_url:
            print("    ⚠️  Has placeholder file ID")
    print("\n💡 To get the real file ID:")
    print("1. Upload the file to Google Drive")
    print("2. Right-click the file → 'Get shareable link'")
    print("3. The link will be: https://drive.google.com/file/d/FILE_ID/view?usp=sharing")
    print("4. Extract the FILE_ID from the URL")
    print("5. Update the 'google_drive_file_id' field in the JSON file")
    print("\n📝 Example:")
    print("   Current: https://drive.google.com/uc?id=FILE_ID_HERE&export=download")
    print("   Replace FILE_ID_HERE with: 1fuq76y9buDqWX_E_Pa8KWtZy6qZq0lQx")
    print("   Result:  https://drive.google.com/uc?id=1fuq76y9buDqWX_E_Pa8KWtZy6qZq0lQx&export=download")

    # Save a backup
    backup_file = audio_urls_file.replace('.json', '_backup.json')
    with open(backup_file, 'w', encoding='utf-8') as f:
        json.dump(audio_data, f, indent=2, ensure_ascii=False)
    print(f"\n💾 Created backup: {backup_file}")

    print(f"\n📋 Total files needing file IDs: {len(ezekiel_files)}")
    print("✨ Once you've updated the file IDs, the audio integration will work automatically!")

if __name__ == "__main__":
    fix_ezekiel_file_ids()
