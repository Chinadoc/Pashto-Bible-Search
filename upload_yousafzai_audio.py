#!/usr/bin/env python3
"""
Upload Yousafzai verse audio clips to Supabase storage and update database.
This script works around API authentication issues by providing a simple upload approach.
"""

import os
import json
import time
import requests
from pathlib import Path
from urllib.parse import quote
import sys

def upload_audio_files():
    """Upload all individual verse audio files to Supabase storage."""
    print("--- Starting upload_audio_files function ---")
    
    # Configuration
    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not service_key:
        print("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables")
        return False
    
    audio_dir = Path("/Users/jeremysamuels/Documents/Pashto Bible split into verses/yousafzai_split_audio")
    
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
    
    # Process each book
    for book_dir in ["psalms", "proverbs"]:
        book_path = audio_dir / book_dir
        if not book_path.exists():
            continue
            
        print(f"\n📖 Processing {book_dir.upper()}...")
        
        # Find all verse MP3 files
        for chapter_dir in book_path.iterdir():
            if not chapter_dir.is_dir():
                continue
                
            for audio_file in chapter_dir.glob("yousafzai_*.mp3"):
                try:
                    # Parse filename: yousafzai_psalms002_verse_003.mp3
                    filename = audio_file.name
                    
                    # Upload to Supabase storage
                    storage_path = f"yousafzai/{filename}"
                    upload_url = f"{supabase_url}/storage/v1/object/audio/{quote(storage_path)}"
                    
                    # Small delay to avoid hammering Supabase
                    time.sleep(0.05)

                    # Check if file already exists in storage
                    check_url = f"{supabase_url}/storage/v1/object/audio/{quote(storage_path)}"
                    check_response = session.head(check_url, headers={"apikey": service_key, "Authorization": f"Bearer {service_key}"})
                    
                    if check_response.status_code == 200:
                        # File already exists, skip upload
                        upload_count += 1
                        if upload_count % 50 == 0:
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
                        if upload_count % 50 == 0:
                            print(f"  ✅ Uploaded {upload_count} files...")
                    else:
                        error_count += 1
                        err_text = response.text.strip() if 'response' in locals() else ''
                        print(f"  ❌ Failed to upload {filename}: {response.status_code} {err_text}")
                        if error_count <= 5:  # Only show first 5 errors in detail
                            print(f"     URL: {upload_url}")
                            print(f"     Headers: {dict(response.headers) if 'response' in locals() else 'N/A'}")
                        
                except Exception as e:
                    error_count += 1
                    print(f"  ❌ Error uploading {audio_file.name}: {e}")
    
    print(f"\n🎉 Upload complete!")
    print(f"✅ Successfully uploaded: {upload_count} files")
    print(f"❌ Errors: {error_count} files")
    
    return error_count == 0

def update_database_urls():
    """Update database with audio_verse_url for each verse."""
    
    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not service_key:
        print("❌ Missing environment variables")
        return False
    
    print("\n📊 Updating database with audio URLs...")
    
    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    # Books and their chapter counts
    books = [
        {"slug": "psalms", "name": "Psalms", "chapters": 150},
        {"slug": "proverbs", "name": "Proverbs", "chapters": 31}
    ]
    
    update_count = 0
    
    for book in books:
        print(f"  📖 Updating {book['name']}...")
        
        for chapter in range(1, book['chapters'] + 1):
            # Fetch verses for this chapter
            verses_url = f"{supabase_url}/rest/v1/verses_yousafzai?book=eq.{book['name']}&chapter=eq.{chapter}"
            
            try:
                response = requests.get(verses_url, headers=headers)
                if response.status_code != 200:
                    print(f"    ❌ Failed to fetch {book['name']} {chapter}: {response.status_code}")
                    continue
                
                verses = response.json()
                
                for verse in verses:
                    verse_num = verse['verse']
                    
                    # Generate storage filename and URL
                    storage_filename = f"yousafzai_{book['slug']}{chapter:03d}_verse_{verse_num:03d}.mp3"
                    storage_path = f"yousafzai/{storage_filename}"
                    public_url = f"{supabase_url}/storage/v1/object/public/audio/{quote(storage_path)}"
                    
                    # Update the verse with audio URL
                    update_data = {
                        "audio_verse_url": public_url,
                        "audio_storage_filename": storage_filename
                    }
                    
                    update_url = f"{supabase_url}/rest/v1/verses_yousafzai?book=eq.{book['name']}&chapter=eq.{chapter}&verse=eq.{verse_num}"
                    
                    update_response = requests.patch(update_url, headers=headers, json=update_data)
                    
                    if update_response.status_code in [200, 204]:
                        update_count += 1
                    else:
                        print(f"    ❌ Failed to update {book['name']} {chapter}:{verse_num}: {update_response.status_code}")
                        
            except Exception as e:
                print(f"    ❌ Error processing {book['name']} {chapter}: {e}")
    
    print(f"\n✅ Updated {update_count} verses with audio URLs")
    return True

def upload_psalms_to_storage():
    """Upload Psalms chapter files to Supabase storage."""
    print("🎵 Uploading Psalms audio files to Supabase storage...")

    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

    if not supabase_url or not service_key:
        print("❌ Missing environment variables")
        return False

    audio_dir = Path("/Users/jeremysamuels/Documents/pashto-bible-search/yousafzai_split_audio")
    if not audio_dir.exists():
        print(f"❌ Audio directory not found: {audio_dir}")
        return False

    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "audio/mpeg"
    }

    uploaded_count = 0
    error_count = 0

    # Upload Psalms chapter files (psalms-1.mp3, psalms-2.mp3, etc.)
    for chapter in range(1, 151):  # Psalms has 150 chapters
        filename = f"psalms-{chapter}.mp3"
        file_path = audio_dir / filename

        if file_path.exists():
            print(f"  📖 Uploading {filename}...")

            # Upload to Supabase storage
            storage_path = f"yousafzai/{filename}"
            upload_url = f"{supabase_url}/storage/v1/object/audio/{quote(storage_path)}"

            try:
                with open(file_path, 'rb') as f:
                    response = requests.post(upload_url, headers=headers, data=f)

                if response.status_code in [200, 201]:
                    print(f"    ✅ Uploaded {filename}")
                    uploaded_count += 1
                else:
                    print(f"    ❌ Failed to upload {filename}: {response.status_code}")
                    print(f"    Response: {response.text}")
                    error_count += 1

            except Exception as e:
                print(f"    ❌ Error uploading {filename}: {e}")
                error_count += 1
        else:
            print(f"  ⚠️  File not found: {filename}")

    print(f"\n📊 Upload complete: {uploaded_count} uploaded, {error_count} errors")
    return error_count == 0

def update_psalms_audio_urls():
    """Update database with Psalms chapter audio URLs."""
    print("🔄 Updating Psalms audio URLs in database...")

    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

    if not supabase_url or not service_key:
        print("❌ Missing environment variables")
        return False

    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    update_count = 0
    error_count = 0

    # Update each Psalms chapter
    for chapter in range(1, 151):
        print(f"  📖 Updating Psalms chapter {chapter}...")

        # Generate storage URL for chapter file
        storage_filename = f"psalms-{chapter}.mp3"
        storage_path = f"yousafzai/{storage_filename}"
        public_url = f"{supabase_url}/storage/v1/object/public/audio/{quote(storage_path)}"

        # Update all verses in this chapter
        update_data = {
            "audio_chapter_url": public_url,
            "audio_storage_filename": storage_filename
        }

        update_url = f"{supabase_url}/rest/v1/verses_yousafzai?book=eq.Psalms&chapter=eq.{chapter}"
        try:
            update_response = requests.patch(update_url, headers=headers, json=update_data)

            if update_response.status_code in [200, 204]:
                print(f"    ✅ Updated Psalms chapter {chapter}")
                update_count += 1
            else:
                print(f"    ❌ Failed to update Psalms chapter {chapter}: {update_response.status_code}")
                error_count += 1

        except Exception as e:
            print(f"    ❌ Error updating Psalms chapter {chapter}: {e}")
            error_count += 1

    print(f"\n📊 Database update complete: {update_count} updated, {error_count} errors")
    return error_count == 0

def check_and_update_psalms_audio():
    """Check if individual Psalms verse clips exist and update database."""
    print("🔍 Checking Psalms individual verse clips...")

    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

    if not supabase_url or not service_key:
        print("❌ Missing environment variables")
        return False

    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    # Check Psalms chapters 1-5 for individual verse clips
    for chapter in range(1, 6):
        print(f"  📖 Checking Psalms chapter {chapter}...")

        # Get verses for this chapter
        verses_url = f"{supabase_url}/rest/v1/verses_yousafzai?book=eq.Psalms&chapter=eq.{chapter}&order=verse"
        response = requests.get(verses_url, headers=headers)

        if response.status_code != 200:
            print(f"    ❌ Failed to fetch Psalms {chapter}: {response.status_code}")
            continue

        verses = response.json()
        print(f"    Found {len(verses)} verses in chapter {chapter}")

        for verse in verses:
            verse_num = verse['verse']
            storage_filename = f"yousafzai_psalms{chapter:03d}_verse_{verse_num:03d}.mp3"
            storage_path = f"yousafzai/{storage_filename}"
            public_url = f"{supabase_url}/storage/v1/object/public/audio/{quote(storage_path)}"

            # Check if file exists in storage by trying to get it
            check_url = f"{supabase_url}/storage/v1/object/public/audio/{quote(storage_path)}"
            check_response = requests.head(check_url, headers={"apikey": service_key})

            if check_response.status_code == 200:
                # File exists, update database
                update_data = {
                    "audio_verse_url": public_url,
                    "audio_storage_filename": storage_filename
                }

                update_url = f"{supabase_url}/rest/v1/verses_yousafzai?book=eq.Psalms&chapter=eq.{chapter}&verse=eq.{verse_num}"
                update_response = requests.patch(update_url, headers=headers, json=update_data)

                if update_response.status_code in [200, 204]:
                    print(f"    ✅ Updated Psalms {chapter}:{verse_num} with individual clip")
                else:
                    print(f"    ❌ Failed to update Psalms {chapter}:{verse_num}: {update_response.status_code}")
            else:
                print(f"    ⚠️  No individual clip for Psalms {chapter}:{verse_num}")

def main():
    """Main function to upload audio and update database."""
    print("🎯 Yousafzai Audio Integration Script")
    print("=====================================")
    print("Available options:")
    print("1. Upload Psalms audio files to storage")
    print("2. Update Psalms audio URLs in database")
    print("3. Do both (upload then update)")
    print("4. Check and update Psalms individual verse clips")
    print("5. Run full integration (upload + update for all books)")
    print()

    if len(sys.argv) > 1:
        choice = sys.argv[1]
    else:
        choice = input("Enter choice (1-5): ").strip()

    if choice == '1':
        success = upload_psalms_to_storage()
        if success:
            print("\n✅ Psalms upload complete!")
    elif choice == '2':
        success = update_psalms_audio_urls()
        if success:
            print("\n✅ Psalms database update complete!")
    elif choice == '3':
        success1 = upload_psalms_to_storage()
        if success1:
            success2 = update_psalms_audio_urls()
            if success2:
                print("\n🎉 Psalms integration complete!")
    elif choice == '4':
        success = check_and_update_psalms_audio()
        if success:
            print("\n🎉 Psalms check complete!")
    elif choice == '5':
        if '--update-db-only' in sys.argv:
            print("\n🔄 --update-db-only flag detected. Skipping upload and updating database directly.")
            if update_database_urls():
                print("\n🎉 Database update complete! All verses should now have individual audio clips.")
                print("🌐 Deploy to Vercel to see the changes live.")
            else:
                print("\n⚠️  Database update failed.")
            return

        # Step 1: Upload audio files
        if upload_audio_files():
            print("\n🎵 Audio upload successful!")

            # Step 2: Update database
            if update_database_urls():
                print("\n🎉 Integration complete! All verses now have individual audio clips.")
                print("🌐 Deploy to Vercel to see the changes live.")
            else:
                print("\n⚠️  Audio uploaded but database update failed. Manual database update needed.")
        else:
            print("\n❌ Audio upload failed. Check your Supabase credentials and try again.")
    else:
        print("❌ Invalid choice")

if __name__ == "__main__":
    main()

