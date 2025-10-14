#!/usr/bin/env python3
"""
Generate Google Drive URLs for OT audio files.

This script helps create the proper Google Drive file URLs for all your audio files
after you've uploaded them to Google Drive.
"""

import os
import json
import re
from pathlib import Path

def generate_google_drive_urls(google_drive_base_url, output_file="google_drive_audio_urls.json"):
    """
    Generate Google Drive URL mapping for all audio files.

    Args:
        google_drive_base_url: The base Google Drive folder URL (e.g., https://drive.google.com/drive/folders/YOUR_FOLDER_ID)
        output_file: Where to save the URL mapping
    """

    # Extract folder ID from the Google Drive URL
    # Format: https://drive.google.com/drive/folders/FOLDER_ID
    if 'folders/' in google_drive_base_url:
        folder_id = google_drive_base_url.split('folders/')[1].split('?')[0]
    else:
        print("❌ Please provide a valid Google Drive folder URL")
        print("   Example: https://drive.google.com/drive/folders/YOUR_FOLDER_ID")
        return None

    print(f"📁 Using Google Drive folder ID: {folder_id}")

    audio_dir = Path("ot_audio_files")
    if not audio_dir.exists():
        print(f"❌ Audio directory not found: {audio_dir}")
        return None

    url_mapping = {}

    # Process each verse file
    verse_files = list(audio_dir.rglob("*verse*.mp3"))
    print(f"🔍 Processing {len(verse_files)} verse files...")

    for audio_file in sorted(verse_files):
        # Extract book, chapter, verse from filename
        # Format: book_slug + chapter + _verse_ + verse + .mp3
        filename = audio_file.name
        name_without_ext = filename.replace('.mp3', '')

        # Split by underscore
        parts = name_without_ext.split('_')

        if len(parts) == 3 and parts[1] == 'verse':
            # Format: genesis048_verse_014
            combined = parts[0]  # genesis048
            verse = parts[2]     # 014

            # Extract book name and chapter from combined string
            # Find where the chapter number starts (last 1-3 digits)
            match = re.match(r'^([a-z]+)(\d+)$', combined)
            if match:
                book_slug = match.group(1)
                chapter = match.group(2).lstrip('0')
            else:
                # Fallback: assume last 3 characters are chapter
                book_slug = combined[:-3]
                chapter = combined[-3:].lstrip('0')

            # Generate placeholder Google Drive file URL
            # Users will need to replace FILE_ID_HERE with actual Google Drive file IDs
            google_drive_url = f"https://drive.google.com/uc?id=FILE_ID_HERE&export=download"

            url_mapping[filename] = {
                'book': book_slug,
                'chapter': int(chapter),
                'verse': int(verse),
                'google_drive_url': google_drive_url,
                'local_path': str(audio_file),
                'folder_path': str(audio_file.relative_to(audio_dir))
            }
        else:
            print(f"⚠️  Skipping file with unexpected format: {filename}")

    # Save the mapping
    with open(output_file, 'w') as f:
        json.dump(url_mapping, f, indent=2)

    print(f"✅ Generated URL mapping for {len(url_mapping)} files")
    print(f"💾 Saved to: {output_file}")
    print(f"📝 Next step: Replace 'FILE_ID_HERE' with actual Google Drive file IDs")

    return url_mapping

def show_integration_example():
    """Show how to integrate Google Drive URLs with your app"""
    print("\n=== INTEGRATION EXAMPLE ===")
    print()
    print("🔧 Update your audio URLs in the database:")
    print()
    print("Instead of Supabase URLs like:")
    print("  https://your-project.supabase.co/storage/v1/object/public/audio/...")
    print()
    print("Use Google Drive URLs like:")
    print("  https://drive.google.com/uc?id=FILE_ID&export=download")
    print()
    print("📝 In your verses table, update audio_verse_url column")
    print("🎵 Audio player will stream directly from Google Drive")

if __name__ == "__main__":
    import sys

    print("🎵 Google Drive Audio URL Generator")
    print("=" * 40)

    if len(sys.argv) > 1:
        google_drive_url = sys.argv[1]
        mapping = generate_google_drive_urls(google_drive_url)
    else:
        print("Usage: python3 generate_google_drive_urls.py 'YOUR_GOOGLE_DRIVE_FOLDER_URL'")
        print()
        print("Example:")
        print("  python3 generate_google_drive_urls.py 'https://drive.google.com/drive/folders/1ABC123'")
        print()
        show_integration_example()

    print("\n" + "=" * 40)
