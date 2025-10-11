#!/usr/bin/env python3
"""
Update Google Drive URLs with actual file IDs.

This script helps you update the google_drive_audio_urls.json file
with actual Google Drive file IDs extracted from shareable links.
"""

import json
import re
import sys
from pathlib import Path

def extract_file_id_from_url(url):
    """Extract file ID from Google Drive shareable link"""
    # Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    match = re.search(r'/file/d/([^/]+)', url)
    if match:
        return match.group(1)
    return None

def update_url_mapping_with_file_ids(url_mapping_file):
    """Update URL mapping with file IDs from user input"""
    print("🔧 Google Drive URL Updater")
    print("=" * 30)

    # Load existing mapping
    try:
        with open(url_mapping_file, 'r') as f:
            url_mapping = json.load(f)
    except FileNotFoundError:
        print(f"❌ URL mapping file not found: {url_mapping_file}")
        return

    print(f"📊 Loaded {len(url_mapping)} file mappings")

    # Group files by book for easier processing
    files_by_book = {}
    for filename, file_info in url_mapping.items():
        book = file_info['book']
        if book not in files_by_book:
            files_by_book[book] = []
        files_by_book[book].append((filename, file_info))

    # Process each book
    total_updated = 0

    for book in sorted(files_by_book.keys()):
        print(f"\n📖 Processing {book.upper()}...")

        book_files = files_by_book[book]
        print(f"   Files in {book}: {len(book_files)}")

        # Ask user if they want to process this book
        response = input(f"   Process {book} files? (y/n): ").lower().strip()
        if response != 'y':
            print(f"   ⏭️  Skipping {book}")
            continue

        print(f"\n📝 For {book} files, provide shareable links:")
        print("   Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing")
        print("   Or just the file ID if you have it")
        print()

        for filename, file_info in book_files:
            current_url = file_info['google_drive_url']
            print(f"🔍 File: {filename}")

            # Get file ID from user
            while True:
                file_input = input(f"   File ID for {filename}: ").strip()

                if file_input.startswith('https://drive.google.com'):
                    file_id = extract_file_id_from_url(file_input)
                    if file_id:
                        break
                    else:
                        print("   ❌ Could not extract file ID from URL")
                else:
                    # Assume it's just the file ID
                    file_id = file_input
                    break

            # Update the URL
            new_url = current_url.replace('FILE_ID_HERE', file_id)
            file_info['google_drive_url'] = new_url
            file_info['google_drive_file_id'] = file_id

            print(f"   ✅ Updated: {file_id}")
            total_updated += 1

    # Save updated mapping
    with open(url_mapping_file, 'w') as f:
        json.dump(url_mapping, f, indent=2)

    print(f"\n🎉 Successfully updated {total_updated} file URLs!")
    print(f"💾 Saved to: {url_mapping_file}")
    print("✅ Your Google Drive audio integration is ready!")

    return total_updated

def show_batch_processing_example():
    """Show example of batch processing"""
    print("\n=== BATCH PROCESSING EXAMPLE ===")
    print()
    print("📋 If you have many files, you can:")
    print()
    print("1️⃣  Get shareable links for all files in a book")
    print("2️⃣  Copy all the URLs to a text file")
    print("3️⃣  Use a script to extract all file IDs at once")
    print()
    print("Example batch file processing:")
    print("   https://drive.google.com/file/d/ABC123/view")
    print("   https://drive.google.com/file/d/DEF456/view")
    print("   https://drive.google.com/file/d/GHI789/view")
    print()

if __name__ == "__main__":
    print("🎵 Google Drive URL Batch Updater")
    print("=" * 35)

    url_mapping_file = "google_drive_audio_urls.json"

    if len(sys.argv) > 1 and sys.argv[1] == '--help':
        print("Usage: python3 update_google_drive_urls.py")
        print()
        print("This script will guide you through updating Google Drive file IDs")
        print("for all your audio files interactively.")
        print()
        show_batch_processing_example()
        sys.exit(0)

    updated = update_url_mapping_with_file_ids(url_mapping_file)

    if updated > 0:
        print(f"\n🚀 Ready to integrate {updated} audio files with your app!")
    else:
        print("\n❌ No files were updated.")
