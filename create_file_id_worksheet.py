#!/usr/bin/env python3
"""
Create a file ID worksheet for Google Drive audio files.

This script creates a simple text file where you can paste Google Drive
file IDs for each audio file. Much faster than individual entry!
"""

import json
import os
from pathlib import Path

def create_file_id_worksheet():
    """Create a worksheet file for manual file ID entry"""
    print("📝 Creating File ID Worksheet")
    print("=" * 30)

    # Load existing URL mapping
    try:
        with open('google_drive_audio_urls.json', 'r') as f:
            url_mapping = json.load(f)
    except FileNotFoundError:
        print("❌ URL mapping file not found")
        return

    print(f"📊 Processing {len(url_mapping)} audio files")

    # Group files by book for easier processing
    files_by_book = {}
    for filename, file_info in url_mapping.items():
        book = file_info['book']
        if book not in files_by_book:
            files_by_book[book] = []
        files_by_book[book].append((filename, file_info))

    # Create worksheet file
    with open('file_ids_worksheet.txt', 'w') as f:
        f.write("GOOGLE DRIVE FILE ID WORKSHEET\n")
        f.write("=" * 40 + "\n\n")
        f.write("INSTRUCTIONS:\n")
        f.write("1. Go to your Google Drive folder\n")
        f.write("2. Get shareable links for ALL files in each book\n")
        f.write("3. Copy the FILE_ID from each URL (format: https://drive.google.com/file/d/FILE_ID/view)\n")
        f.write("4. Paste the FILE_IDs in the corresponding lines below\n")
        f.write("5. Run: python3 batch_update_file_ids.py file_ids_worksheet.txt\n\n")

        f.write("FORMAT: filename.mp3:FILE_ID\n\n")

        # Process each book
        for book in sorted(files_by_book.keys()):
            book_files = files_by_book[book]
            f.write(f"=== {book.upper()} ===\n")
            f.write(f"Files in {book}: {len(book_files)}\n\n")

            for filename, file_info in book_files:
                f.write(f"{filename}:FILE_ID_HERE\n")

            f.write("\n" + "-" * 50 + "\n\n")

    print(f"✅ Created file_ids_worksheet.txt")
    print(f"📊 Contains {len(url_mapping)} entries")
    print("💡 Edit this file and replace 'FILE_ID_HERE' with actual file IDs")
    print("🎯 Then run: python3 batch_update_file_ids.py file_ids_worksheet.txt")

if __name__ == "__main__":
    create_file_id_worksheet()
