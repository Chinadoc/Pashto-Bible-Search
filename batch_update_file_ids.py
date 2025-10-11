#!/usr/bin/env python3
"""
Batch update Google Drive file IDs from a text file.

This script reads file IDs from a text file and updates the google_drive_audio_urls.json
file with the actual Google Drive file IDs.
"""

import json
import sys
from pathlib import Path

def batch_update_file_ids(mapping_file, ids_file):
    """Update URL mapping with file IDs from a batch file"""
    print("🔧 Batch File ID Updater")
    print("=" * 25)

    # Load existing mapping
    try:
        with open(mapping_file, 'r') as f:
            url_mapping = json.load(f)
    except FileNotFoundError:
        print(f"❌ URL mapping file not found: {mapping_file}")
        return 0

    # Load file IDs from text file
    file_ids = {}
    try:
        with open(ids_file, 'r') as f:
            for line in f:
                line = line.strip()
                if ':' in line and line.count(':') == 1:
                    filename, file_id = line.split(':', 1)
                    filename = filename.strip()
                    file_id = file_id.strip()
                    file_ids[filename] = file_id
    except FileNotFoundError:
        print(f"❌ File IDs file not found: {ids_file}")
        return 0

    print(f"📊 Loaded {len(url_mapping)} URL mappings")
    print(f"🔑 Loaded {len(file_ids)} file IDs")

    if len(file_ids) == 0:
        print("❌ No file IDs found in the input file")
        return 0

    # Update mappings with file IDs
    updated_count = 0
    matched_count = 0

    for filename, file_info in url_mapping.items():
        if filename in file_ids:
            file_id = file_ids[filename]
            old_url = file_info['google_drive_url']
            new_url = old_url.replace('FILE_ID_HERE', file_id)
            file_info['google_drive_url'] = new_url
            file_info['google_drive_file_id'] = file_id
            updated_count += 1
            matched_count += 1
        else:
            print(f"⚠️  No file ID found for: {filename}")

    # Save updated mapping
    with open(mapping_file, 'w') as f:
        json.dump(url_mapping, f, indent=2)

    print(f"\n✅ Successfully updated {updated_count} file URLs with Google Drive IDs!")
    print(f"💾 Saved to: {mapping_file}")

    if matched_count < len(url_mapping):
        print(f"⚠️  {len(url_mapping) - matched_count} files still need file IDs")

    return updated_count

def show_file_format_example():
    """Show the expected format for the file IDs file"""
    print("\n=== FILE FORMAT EXAMPLE ===")
    print()
    print("📋 Create a file 'file_ids.txt' with this format:")
    print()
    print("amos001_verse_001.mp3:1ABC123def456")
    print("amos001_verse_002.mp3:1DEF789ghi012")
    print("amos001_verse_003.mp3:1GHI345jkl678")
    print("amos002_verse_001.mp3:1JKL901mno234")
    print("...")
    print()
    print("💡 Tips:")
    print("   • One file per line")
    print("   • Format: filename.mp3:file_id")
    print("   • Get file IDs from Google Drive shareable links")
    print()

def generate_template_file_ids():
    """Generate a template file with all the filenames for easy editing"""
    print("📝 Generating template file_ids.txt...")

    # Load existing mapping
    try:
        with open('google_drive_audio_urls.json', 'r') as f:
            url_mapping = json.load(f)
    except FileNotFoundError:
        print("❌ URL mapping file not found")
        return

    # Generate template file
    with open('file_ids_template.txt', 'w') as f:
        for filename in sorted(url_mapping.keys()):
            f.write(f"{filename}:FILE_ID_HERE\n")

    print(f"✅ Generated template file: file_ids_template.txt")
    print(f"📊 Contains {len(url_mapping)} entries")
    print("💡 Edit this file and replace 'FILE_ID_HERE' with actual file IDs")

if __name__ == "__main__":
    print("🎵 Google Drive Batch File ID Updater")
    print("=" * 40)

    if len(sys.argv) > 1 and sys.argv[1] == '--help':
        print("Usage:")
        print("  python3 batch_update_file_ids.py file_ids.txt")
        print("  python3 batch_update_file_ids.py --template  # Generate template")
        print()
        show_file_format_example()
        sys.exit(0)

    if len(sys.argv) > 1 and sys.argv[1] == '--template':
        generate_template_file_ids()
    elif len(sys.argv) > 1:
        ids_file = sys.argv[1]
        mapping_file = "google_drive_audio_urls.json"

        print(f"📂 Processing file IDs from: {ids_file}")
        updated = batch_update_file_ids(mapping_file, ids_file)

        if updated > 0:
            print(f"\n🎉 Successfully processed {updated} files!")
            print("✅ Your Google Drive audio integration is ready!")
        else:
            print("\n❌ No files were updated. Check your file format.")
    else:
        print("Usage: python3 batch_update_file_ids.py file_ids.txt")
        print("       python3 batch_update_file_ids.py --template")
        print()
        show_file_format_example()
