#!/usr/bin/env python3
"""
Continuous Yousafzai audio upload monitor.
Monitors for new audio files and uploads them to Google Drive automatically.
"""

import os
import json
import time
import random
from pathlib import Path
from datetime import datetime
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError

# Google Drive API scopes
SCOPES = ['https://www.googleapis.com/auth/drive']

def authenticate_google_drive():
    """Authenticate with Google Drive API"""
    creds = None

    # Check for existing credentials
    if os.path.exists('token.json'):
        with open('token.json', 'r') as token:
            creds_data = json.load(token)
            if isinstance(creds_data, str):
                creds_data = json.loads(creds_data)
            creds = Credentials.from_authorized_user_info(creds_data, SCOPES)

    # If no valid credentials, authenticate
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)

        # Save credentials
        with open('token.json', 'w') as token:
            json.dump(creds.to_json(), token)

    return creds

def upload_file_with_backoff(service, file_path, filename, max_retries=5):
    """Upload a single file with exponential backoff"""
    for attempt in range(max_retries):
        try:
            file_metadata = {'name': filename}
            media = MediaFileUpload(str(file_path), mimetype='audio/mpeg')
            
            # Add exponential backoff with jitter
            if attempt > 0:
                delay = (2 ** attempt) + random.uniform(0, 2)
                print(f"  ⏳ Retrying in {delay:.1f}s (attempt {attempt + 1}/{max_retries})")
                time.sleep(delay)
            
            file = service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id'
            ).execute()
            
            return file.get('id')
            
        except HttpError as e:
            error_details = e.error_details if hasattr(e, 'error_details') else str(e)
            print(f"  ❌ Attempt {attempt + 1} failed: {e}")
            
            if e.resp.status == 403:
                if 'quota' in str(e).lower() or 'rate' in str(e).lower():
                    # Rate limit - wait longer
                    wait_time = 60 + random.uniform(0, 30)
                    print(f"  ⏳ Rate limit hit, waiting {wait_time:.1f}s")
                    time.sleep(wait_time)
                    continue
                elif 'insufficient' in str(e).lower():
                    print(f"  🔑 Authentication issue, re-authenticating...")
                    return None  # Force re-auth
                else:
                    print(f"  🚫 Permission denied: {error_details}")
                    return None
            elif e.resp.status == 429:
                # Rate limit
                wait_time = 60 + random.uniform(0, 30)
                print(f"  ⏳ Rate limit (429), waiting {wait_time:.1f}s")
                time.sleep(wait_time)
                continue
            elif e.resp.status >= 500:
                # Server error - retry
                wait_time = 10 + random.uniform(0, 10)
                print(f"  🔄 Server error, waiting {wait_time:.1f}s")
                time.sleep(wait_time)
                continue
            else:
                print(f"  ❌ Non-retryable error: {error_details}")
                return None
        except Exception as e:
            print(f"  ❌ Unexpected error: {e}")
            if attempt == max_retries - 1:
                return None
            time.sleep(5)
    
    return None

def load_existing_audio_map():
    """Load existing audio map or create new one"""
    audio_file = 'yousafzai_google_drive_audio_urls.json'
    
    if os.path.exists(audio_file):
        with open(audio_file, 'r') as f:
            return json.load(f)
    else:
        return {}

def save_audio_map(audio_data):
    """Save audio map to file"""
    audio_file = 'yousafzai_google_drive_audio_urls.json'
    with open(audio_file, 'w') as f:
        json.dump(audio_data, f, indent=2)

def scan_for_new_files(audio_data):
    """Scan for new Yousafzai audio files that haven't been uploaded"""
    audio_dir = Path("yousafzai_audio_files")
    
    if not audio_dir.exists():
        return []
    
    new_files = []
    
    # Scan for verse files
    for book_dir in audio_dir.iterdir():
        if not book_dir.is_dir():
            continue
            
        book_name = book_dir.name
        
        for chapter_dir in book_dir.iterdir():
            if not chapter_dir.is_dir() or not chapter_dir.name.startswith('chapter-'):
                continue
                
            chapter_num = int(chapter_dir.name.split('-')[1].split('-')[0])
            
            for audio_file in chapter_dir.glob("yousafzai_*.mp3"):
                filename = audio_file.name
                
                # Check if file already exists in our map
                if filename in audio_data:
                    # Check if it has a valid file ID
                    file_id = audio_data[filename].get('google_drive_file_id')
                    if file_id and file_id != 'FILE_ID_HERE' and not file_id.startswith('TEST_ID'):
                        continue  # Already uploaded
                
                # Parse filename: yousafzai_genesis001_verse_001.mp3
                parts = filename.replace('yousafzai_', '').replace('.mp3', '').split('_')
                if len(parts) >= 3 and parts[1] == 'verse':
                    verse_num = int(parts[2])
                    
                    entry = {
                        'book': book_name,
                        'chapter': chapter_num,
                        'verse': verse_num,
                        'local_path': str(audio_file),
                        'folder_path': f"{book_name}/{chapter_dir.name}/{filename}"
                    }
                    
                    new_files.append((audio_file, filename, entry))
    
    return new_files

def upload_new_files(service, new_files, audio_data):
    """Upload new files and update audio map"""
    if not new_files:
        return 0
    
    print(f"📦 Found {len(new_files)} new files to upload")
    
    success_count = 0
    failed_count = 0
    batch_size = 15
    
    # Upload files in batches to optimize throughput
    for i in range(0, len(new_files), batch_size):
        batch = new_files[i:i + batch_size]
        print(f"\n📦 Processing batch {i//batch_size + 1}: {len(batch)} files")
        
        batch_success = 0
        for file_path, filename, entry in batch:
            file_id = upload_file_with_backoff(service, file_path, filename)
            
            if file_id:
                # Update the entry
                audio_data[filename] = {
                    'book': entry.get('book'),
                    'chapter': entry.get('chapter'),
                    'verse': entry.get('verse'),
                    'google_drive_file_id': file_id,
                    'google_drive_url': f"https://drive.google.com/uc?id={file_id}&export=download",
                    'local_path': entry.get('local_path'),
                    'folder_path': entry.get('folder_path')
                }
                success_count += 1
                batch_success += 1
                print(f"  ✅ {filename}: {file_id}")
            else:
                failed_count += 1
                print(f"  ❌ {filename}: Failed")
        
        print(f"  💾 Batch complete: {batch_success}/{len(batch)} uploaded")
        
        # Save progress after each batch
        save_audio_map(audio_data)
        
        # Rate limiting between batches
        if i + batch_size < len(new_files):
            time.sleep(2 + random.uniform(0, 1))
    
    print(f"\n📊 Upload Summary:")
    print(f"✅ Successfully uploaded: {success_count}")
    print(f"❌ Failed: {failed_count}")
    
    return success_count

def main():
    """Main continuous monitoring loop"""
    print("🔄 Starting continuous Yousafzai audio upload monitor...")
    print("📁 Monitoring: yousafzai_audio_files/")
    print("💾 Output: yousafzai_google_drive_audio_urls.json")
    print("⏰ Check interval: 30 seconds")
    print("🛑 Press Ctrl+C to stop")
    print()
    
    # Authenticate
    creds = authenticate_google_drive()
    if not creds:
        print("❌ Failed to authenticate with Google Drive")
        return
    
    service = build('drive', 'v3', credentials=creds)
    
    # Load existing audio map
    audio_data = load_existing_audio_map()
    print(f"📊 Loaded existing map with {len(audio_data)} files")
    
    total_uploaded = 0
    check_count = 0
    
    try:
        while True:
            check_count += 1
            print(f"\n🔍 Check #{check_count} - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            
            # Scan for new files
            new_files = scan_for_new_files(audio_data)
            
            if new_files:
                print(f"📦 Found {len(new_files)} new files to upload")
                uploaded = upload_new_files(service, new_files, audio_data)
                total_uploaded += uploaded
                print(f"📈 Total uploaded this session: {total_uploaded}")
            else:
                print("✅ No new files found")
            
            # Wait before next check
            print("⏳ Waiting 30 seconds before next check...")
            time.sleep(30)
            
    except KeyboardInterrupt:
        print(f"\n🛑 Stopping monitor...")
        print(f"📊 Total files uploaded this session: {total_uploaded}")
        print(f"💾 Final audio map saved with {len(audio_data)} files")
        print("✅ Monitor stopped successfully")

if __name__ == "__main__":
    main()
