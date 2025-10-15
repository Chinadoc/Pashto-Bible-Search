#!/usr/bin/env python3
"""
Batch upload Yousafzai audio files to Google Drive with optimized rate limiting and exponential backoff.
"""

import os
import json
import time
import random
from pathlib import Path
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

def upload_file_batch(service, file_paths, batch_size=3):
    """Upload multiple files in batches with exponential backoff"""
    results = []
    
    for i in range(0, len(file_paths), batch_size):
        batch = file_paths[i:i + batch_size]
        print(f"\n📦 Processing batch {i//batch_size + 1}: {len(batch)} files")
        
        batch_results = []
        for file_path, filename, entry in batch:
            try:
                file_id = upload_file_with_backoff(service, file_path, filename)
                
                if file_id:
                    batch_results.append((filename, file_id, entry))
                    print(f"  ✅ {filename}: {file_id}")
                else:
                    batch_results.append((filename, None, entry))
                    print(f"  ❌ {filename}: Failed after all retries")
                
            except Exception as e:
                print(f"  ❌ {filename}: {e}")
                batch_results.append((filename, None, entry))
        
        results.extend(batch_results)
        
        # Save progress after each batch
        update_yousafzai_audio_map(batch_results)
        
        # Rate limiting between batches
        if i + batch_size < len(file_paths):
            wait_time = 3 + random.uniform(0, 2)
            print(f"  ⏳ Waiting {wait_time:.1f}s before next batch")
            time.sleep(wait_time)
    
    return results

def update_yousafzai_audio_map(results):
    """Update the Yousafzai audio map with successful uploads"""
    output_file = 'yousafzai_google_drive_audio_urls.json'
    
    # Load existing data or create new
    if os.path.exists(output_file):
        with open(output_file, 'r') as f:
            audio_data = json.load(f)
    else:
        audio_data = {}
    
    updated_count = 0
    for filename, file_id, entry in results:
        if file_id:
            audio_data[filename] = {
                'book': entry.get('book'),
                'chapter': entry.get('chapter'),
                'verse': entry.get('verse'),
                'google_drive_file_id': file_id,
                'google_drive_url': f"https://drive.google.com/uc?id={file_id}&export=download",
                'local_path': entry.get('local_path'),
                'folder_path': entry.get('folder_path')
            }
            updated_count += 1
    
    with open(output_file, 'w') as f:
        json.dump(audio_data, f, indent=2)
    
    print(f"  💾 Updated {updated_count} files in Yousafzai audio map")

def scan_yousafzai_files():
    """Scan for Yousafzai audio files and prepare upload list"""
    audio_dir = Path("yousafzai_audio_files")
    
    if not audio_dir.exists():
        print(f"❌ Yousafzai audio directory not found: {audio_dir}")
        return []
    
    files_to_upload = []
    
    # Scan for verse files
    for book_dir in audio_dir.iterdir():
        if not book_dir.is_dir():
            continue
            
        book_name = book_dir.name
        print(f"📖 Scanning {book_name}...")
        
        for chapter_dir in book_dir.iterdir():
            if not chapter_dir.is_dir() or not chapter_dir.name.startswith('chapter-'):
                continue
                
            chapter_num = int(chapter_dir.name.split('-')[1].split('-')[0])
            
            for audio_file in chapter_dir.glob("yousafzai_*.mp3"):
                filename = audio_file.name
                
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
                    
                    files_to_upload.append((audio_file, filename, entry))
    
    return files_to_upload

def main():
    """Main function to batch upload Yousafzai files"""
    print("🚀 Starting batch upload of Yousafzai audio files...")
    
    # Scan for files to upload
    files_to_upload = scan_yousafzai_files()
    
    print(f"📊 Found {len(files_to_upload)} Yousafzai files to upload")
    
    if not files_to_upload:
        print("✅ No Yousafzai files to upload!")
        return
    
    # Authenticate
    creds = authenticate_google_drive()
    if not creds:
        print("❌ Failed to authenticate with Google Drive")
        return
    
    service = build('drive', 'v3', credentials=creds)
    
    # Upload in batches
    results = upload_file_batch(service, files_to_upload, batch_size=3)
    
    # Final summary
    success_count = sum(1 for _, file_id, _ in results if file_id)
    failed_count = len(results) - success_count
    
    print(f"\n📊 Final Summary:")
    print(f"✅ Successfully uploaded: {success_count}")
    print(f"❌ Failed: {failed_count}")
    print(f"📈 Success rate: {success_count/len(results)*100:.1f}%")
    print(f"📁 Output file: yousafzai_google_drive_audio_urls.json")

if __name__ == "__main__":
    main()
