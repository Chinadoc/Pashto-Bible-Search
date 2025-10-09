#!/usr/bin/env python3
"""
Upload OT verse audio files to Supabase storage and update database.
"""

import os
import json
import time
import requests
from pathlib import Path
from urllib.parse import quote
import sys

def upload_ot_audio_files():
    """Upload OT verse audio files to Supabase storage."""
    print("--- Starting OT audio upload ---")

    # Configuration
    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

    if not supabase_url or not service_key:
        print("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables")
        return False

    audio_dir = Path("ot_audio_files")

    if not audio_dir.exists():
        print(f"❌ Audio directory not found: {audio_dir}")
        return False

    print(f"🎵 Starting upload from: {audio_dir}")

    # Headers for Supabase API
    session = requests.Session()
    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "audio/mpeg",
        "x-upsert": "true",
        "Cache-Control": "max-age=31536000"
    }

    upload_count = 0
    error_count = 0

    # Process each book directory
    for book_dir in sorted(audio_dir.iterdir()):
        if not book_dir.is_dir():
            continue

        book_slug = book_dir.name
        print(f"\n📖 Processing {book_slug.upper()}...")

        # Process each chapter directory
        for chapter_dir in sorted(book_dir.iterdir()):
            if not chapter_dir.is_dir() or not chapter_dir.name.startswith('chapter-'):
                continue

            chapter_match = chapter_dir.name.split('chapter-')[1].split('-')[0]
            chapter = int(chapter_match)

            # Find all verse MP3 files in this chapter
            for audio_file in sorted(chapter_dir.glob("*.mp3")):
                try:
                    filename = audio_file.name

                    # Upload to Supabase storage
                    storage_path = f"ot/{book_slug}/{chapter_dir.name}/{filename}"
                    upload_url = f"{supabase_url}/storage/v1/object/audio/{quote(storage_path)}"

                    # Small delay to avoid hammering Supabase
                    time.sleep(0.05)

                    # Check if file already exists in storage
                    check_url = f"{supabase_url}/storage/v1/object/audio/{quote(storage_path)}"
                    check_response = session.head(check_url, headers={"apikey": service_key, "Authorization": f"Bearer {service_key}"})

                    if check_response.status_code == 200:
                        # File already exists, skip upload
                        upload_count += 1
                        if upload_count % 25 == 0:
                            print(f"  ✅ Processed {upload_count} files (existing + new)...")
                        continue

                    # Retry logic for transient errors
                    success = False
                    for attempt in range(3):
                        with open(audio_file, 'rb') as f:
                            response = session.post(upload_url, headers=headers, data=f)
                        if response.status_code in [200, 201]:
                            success = True
                            break
                        elif response.status_code == 409:
                            # Conflict - file already exists
                            success = True
                            break
                        # For rate limiting (429) or gateway (502) wait longer
                        if response.status_code in (429, 502, 503):
                            wait = 0.5 * (attempt + 1)
                            print(f"    ⏳ Rate limited, waiting {wait}s before retry {attempt + 1}/3...")
                            time.sleep(wait)
                        else:
                            break

                    if success:
                        upload_count += 1
                        if upload_count % 25 == 0:
                            print(f"  ✅ Uploaded {upload_count} files...")
                    else:
                        error_count += 1
                        err_text = response.text.strip() if 'response' in locals() else ''
                        print(f"  ❌ Failed to upload {filename}: {response.status_code} {err_text}")

                except Exception as e:
                    error_count += 1
                    print(f"  ❌ Error uploading {audio_file.name}: {e}")

    print(f"\n🎉 Upload complete!")
    print(f"✅ Successfully processed: {upload_count} files")
    print(f"❌ Errors: {error_count} files")

    return error_count == 0

def update_database_urls():
    """Update database with OT audio URLs for each verse."""

    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

    if not supabase_url or not service_key:
        print("❌ Missing environment variables")
        return False

    print("\n📊 Updating database with OT audio URLs...")

    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }

    # OT Books mapping
    ot_books = {
        "genesis": "Genesis",
        "exodus": "Exodus",
        "leviticus": "Leviticus",
        "numbers": "Numbers",
        "deuteronomy": "Deuteronomy",
        "joshua": "Joshua",
        "judges": "Judges",
        "ruth": "Ruth",
        "1-samuel": "1 Samuel",
        "2-samuel": "2 Samuel",
        "1-kings": "1 Kings",
        "2-kings": "2 Kings",
        "1-chronicles": "1 Chronicles",
        "2-chronicles": "2 Chronicles",
        "ezra": "Ezra",
        "nehemiah": "Nehemiah",
        "esther": "Esther",
        "job": "Job",
        "psalms": "Psalms",
        "proverbs": "Proverbs",
        "ecclesiastes": "Ecclesiastes",
        "song-of-songs": "Song of Songs",
        "isaiah": "Isaiah",
        "jeremiah": "Jeremiah",
        "lamentations": "Lamentations",
        "ezekiel": "Ezekiel",
        "daniel": "Daniel",
        "hosea": "Hosea",
        "joel": "Joel",
        "amos": "Amos",
        "obadiah": "Obadiah",
        "jonah": "Jonah",
        "micah": "Micah",
        "nahum": "Nahum",
        "habakkuk": "Habakkuk",
        "zephaniah": "Zephaniah",
        "haggai": "Haggai",
        "zechariah": "Zechariah",
        "malachi": "Malachi"
    }

    update_count = 0
    error_count = 0

    # Process each book
    for book_slug, book_name in ot_books.items():
        print(f"  📖 Updating {book_name}...")

        # Get chapter count for this book (query the database)
        try:
            # First, find max chapter for this book
            chapter_query = f"SELECT MAX(chapter) as max_chapter FROM verses WHERE book = '{book_name}'"
            query_url = f"{supabase_url}/rest/v1/verses?select=chapter&book=eq.{quote(book_name)}&order=chapter.desc&limit=1"

            response = requests.get(query_url, headers=headers)
            if response.status_code != 200:
                print(f"    ❌ Failed to get chapter count for {book_name}: {response.status_code}")
                continue

            data = response.json()
            if not data:
                print(f"    ⚠️  No verses found for {book_name}")
                continue

            max_chapter = data[0]['chapter']

            # Process each chapter
            for chapter in range(1, max_chapter + 1):
                # Fetch verses for this chapter
                verses_url = f"{supabase_url}/rest/v1/verses?book=eq.{quote(book_name)}&chapter=eq.{chapter}&select=verse"

                try:
                    response = requests.get(verses_url, headers=headers)
                    if response.status_code != 200:
                        print(f"      ❌ Failed to fetch {book_name} {chapter}: {response.status_code}")
                        error_count += 1
                        continue

                    verses = response.json()

                    for verse_data in verses:
                        verse_num = verse_data['verse']

                        # Generate storage path
                        storage_filename = f"{book_slug}{chapter:03d}_verse_{verse_num:03d}.mp3"
                        storage_path = f"ot/{book_slug}/chapter-{chapter}-verses/{storage_filename}"
                        public_url = f"{supabase_url}/storage/v1/object/public/audio/{quote(storage_path)}"

                        # Update the verse with audio URL
                        update_data = {
                            "audio_verse_url": public_url,
                            "audio_storage_filename": storage_filename
                        }

                        update_url = f"{supabase_url}/rest/v1/verses?book=eq.{quote(book_name)}&chapter=eq.{chapter}&verse=eq.{verse_num}"

                        update_response = requests.patch(update_url, headers=headers, json=update_data)

                        if update_response.status_code in [200, 204]:
                            update_count += 1
                        else:
                            error_count += 1
                            if error_count <= 5:  # Only show first 5 errors
                                print(f"      ❌ Failed to update {book_name} {chapter}:{verse_num}: {update_response.status_code}")

                except Exception as e:
                    error_count += 1
                    print(f"      ❌ Error processing {book_name} {chapter}: {e}")

        except Exception as e:
            print(f"    ❌ Error processing {book_name}: {e}")
            error_count += 1

    print(f"\n✅ Updated {update_count} verses with OT audio URLs")
    if error_count > 0:
        print(f"❌ {error_count} errors occurred")
    return error_count == 0

def main():
    """Main function to upload OT audio and update database."""
    print("🎯 OT Audio Integration Script")
    print("==============================")

    if '--update-db-only' in sys.argv:
        print("\n🔄 DB-ONLY MODE: Skipping upload and updating database directly.")
        if update_database_urls():
            print("\n🎉 Database update complete! OT verses should now have individual audio clips.")
            print("🌐 Deploy to Vercel to see the changes live.")
        else:
            print("\n⚠️  Database update failed.")
        return

    # Step 1: Upload audio files
    if upload_ot_audio_files():
        print("\n🎵 OT audio upload successful!")

        # Step 2: Update database
        if update_database_urls():
            print("\n🎉 OT integration complete! All OT verses now have individual audio clips.")
            print("🌐 Deploy to Vercel to see the changes live.")
        else:
            print("\n⚠️  Audio uploaded but database update failed. Use --update-db-only to retry database update.")
    else:
        print("\n❌ OT audio upload failed. Check your Supabase credentials and try again.")

if __name__ == "__main__":
    main()

