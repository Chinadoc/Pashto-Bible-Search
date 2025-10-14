#!/usr/bin/env python3
"""
Upload Isaiah audio files to Supabase Storage and update database
"""

import os
import sys
import json
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_supabase_client() -> Client:
    """Initialize Supabase client"""
    url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # Use service role for uploads
    
    if not url or not key:
        print("❌ Missing Supabase credentials")
        print("Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY")
        sys.exit(1)
    
    return create_client(url, key)

def upload_isaiah_audio_files():
    """Upload Isaiah audio files to Supabase Storage"""
    supabase = get_supabase_client()
    
    # Path to Isaiah audio files
    isaiah_dir = Path("ot_audio_files/isaiah")
    
    if not isaiah_dir.exists():
        print(f"❌ Isaiah directory not found: {isaiah_dir}")
        return
    
    uploaded_count = 0
    failed_count = 0
    
    # Walk through all chapter directories
    for chapter_dir in isaiah_dir.iterdir():
        if not chapter_dir.is_dir() or not chapter_dir.name.startswith("chapter-"):
            continue
            
        print(f"📁 Processing {chapter_dir.name}")
        
        # Upload all MP3 files in this chapter
        for audio_file in chapter_dir.glob("*.mp3"):
            try:
                # Read the audio file
                with open(audio_file, 'rb') as f:
                    file_data = f.read()
                
                # Upload to Supabase Storage
                result = supabase.storage.from_("audio").upload(
                    audio_file.name,
                    file_data,
                    file_options={"content-type": "audio/mpeg"}
                )
                
                if result.get('error'):
                    print(f"❌ Failed to upload {audio_file.name}: {result['error']}")
                    failed_count += 1
                else:
                    print(f"✅ Uploaded {audio_file.name}")
                    uploaded_count += 1
                    
            except Exception as e:
                print(f"❌ Error uploading {audio_file.name}: {e}")
                failed_count += 1
    
    print(f"\n📊 Upload Summary:")
    print(f"✅ Successfully uploaded: {uploaded_count}")
    print(f"❌ Failed uploads: {failed_count}")

def update_verses_table():
    """Update verses table with audio filenames for Isaiah"""
    supabase = get_supabase_client()
    
    # Get all Isaiah verses
    result = supabase.table("verses").select("id, book, chapter, verse").eq("book", "Isaiah").execute()
    
    if result.data:
        updated_count = 0
        for verse in result.data:
            chapter = verse['chapter']
            verse_num = verse['verse']
            
            # Generate expected filename
            filename = f"isaiah{chapter:03d}_verse_{verse_num:03d}.mp3"
            
            # Update the verse with the audio filename
            update_result = supabase.table("verses").update({
                "audio_filename": filename
            }).eq("id", verse['id']).execute()
            
            if update_result.data:
                updated_count += 1
        
        print(f"✅ Updated {updated_count} Isaiah verses with audio filenames")
    else:
        print("❌ No Isaiah verses found in database")

def main():
    """Main function"""
    print("🚀 Starting Isaiah audio upload process...")
    
    # Upload audio files
    upload_isaiah_audio_files()
    
    # Update database
    update_verses_table()
    
    print("✅ Isaiah audio upload process completed!")

if __name__ == "__main__":
    main()
