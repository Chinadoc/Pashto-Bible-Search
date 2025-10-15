#!/usr/bin/env python3
"""
Concurrent Yousafzai Old Testament audio uploader with multiple parallel processes.
"""

import os
import json
import time
import random
import multiprocessing as mp
from pathlib import Path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError

# Google Drive API scopes
SCOPES = ['https://www.googleapis.com/auth/drive']

# Old Testament books (excluding New Testament)
NEW_TESTAMENT_BOOKS = [
    'matthew', 'mark', 'luke', 'john', 'acts', 'romans', '1-corinthians', 
    '2-corinthians', 'galatians', 'ephesians', 'philippians', 'colossians',
    '1-thessalonians', '2-thessalonians', '1-timothy', '2-timothy', 'titus',
    'philemon', 'hebrews', 'james', '1-peter', '2-peter', '1-john', '2-john',
    '3-john', 'jude', 'revelation'
]

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

def upload_file_with_backoff(service, file_path, filename, max_retries=3):
    """Upload a single file with exponential backoff"""
    for attempt in range(max_retries):
        try:
            file_metadata = {'name': filename}
            media = MediaFileUpload(str(file_path), mimetype='audio/mpeg')
            
            # Add exponential backoff with jitter
            if attempt > 0:
                delay = (2 ** attempt) + random.uniform(0, 1)
                time.sleep(delay)
            
            file = service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id'
            ).execute()
            
            return file.get('id')
            
        except HttpError as e:
            if e.resp.status == 403:
                if 'quota' in str(e).lower() or 'rate' in str(e).lower():
                    wait_time = 30 + random.uniform(0, 10)
                    time.sleep(wait_time)
                    continue
                else:
                    return None
            elif e.resp.status == 429:
                wait_time = 30 + random.uniform(0, 10)
                time.sleep(wait_time)
                continue
            elif e.resp.status >= 500:
                wait_time = 5 + random.uniform(0, 5)
                time.sleep(wait_time)
                continue
            else:
                return None
        except Exception as e:
            if attempt == max_retries - 1:
                return None
            time.sleep(2)
    
    return None

def worker_process(worker_id, file_queue, result_queue, credentials_data):
    """Worker process for uploading files"""
    print(f"🚀 Worker {worker_id} started")
    
    # Create service with credentials
    creds = Credentials.from_authorized_user_info(credentials_data, SCOPES)
    service = build('drive', 'v3', credentials=creds)
    
    success_count = 0
    failed_count = 0
    
    while True:
        try:
            # Get file from queue
            file_data = file_queue.get(timeout=5)
            if file_data is None:  # Poison pill
                break
                
            file_path, filename, entry = file_data
            
            # Upload file
            file_id = upload_file_with_backoff(service, file_path, filename)
            
            if file_id:
                result_queue.put({
                    'filename': filename,
                    'file_id': file_id,
                    'entry': entry,
                    'worker_id': worker_id,
                    'success': True
                })
                success_count += 1
                print(f"  Worker {worker_id}: ✅ {filename}: {file_id}")
            else:
                result_queue.put({
                    'filename': filename,
                    'file_id': None,
                    'entry': entry,
                    'worker_id': worker_id,
                    'success': False
                })
                failed_count += 1
                print(f"  Worker {worker_id}: ❌ {filename}: Failed")
                
        except Exception as e:
            print(f"  Worker {worker_id}: Error: {e}")
            break
    
    print(f"🏁 Worker {worker_id} finished: {success_count} success, {failed_count} failed")
    return success_count, failed_count

def save_audio_map(audio_data):
    """Save audio map to JSON file"""
    with open('yousafzai_google_drive_audio_urls.json', 'w') as f:
        json.dump(audio_data, f, indent=2)

def get_ot_files_to_upload():
    """Get list of Old Testament files that need to be uploaded"""
    files_to_upload = []
    audio_dir = Path("yousafzai_audio_files")
    
    # Load existing audio map
    if os.path.exists('yousafzai_google_drive_audio_urls.json'):
        with open('yousafzai_google_drive_audio_urls.json', 'r') as f:
            audio_data = json.load(f)
    else:
        audio_data = {}
    
    print(f"Audio map has {len(audio_data)} entries")
    
    # Find Old Testament audio files (exclude New Testament books)
    for book_dir in audio_dir.iterdir():
        if not book_dir.is_dir():
            continue
            
        # Check if this is NOT a New Testament book
        if book_dir.name in NEW_TESTAMENT_BOOKS:
            continue
            
        print(f"Processing OT book: {book_dir.name}")
        
        for chapter_dir in book_dir.iterdir():
            if not chapter_dir.is_dir() or not chapter_dir.name.startswith('chapter-'):
                continue
                
            for audio_file in chapter_dir.glob("yousafzai_*.mp3"):
                filename = audio_file.name
                
                # Check if already uploaded
                if filename in audio_data:
                    file_id = audio_data[filename].get('google_drive_file_id')
                    if file_id and file_id != 'FILE_ID_HERE':
                        continue  # Already uploaded
                
                # Parse filename to extract book, chapter, verse
                try:
                    # Remove prefix and suffix
                    name_part = filename.replace('yousafzai_', '').replace('.mp3', '')
                    
                    # Split by underscore to get parts
                    parts = name_part.split('_')
                    
                    # The format is: book_chapter_verse_verse_num
                    # Example: genesis001_verse_001
                    if len(parts) >= 3 and parts[-2] == 'verse':
                        # Find the verse part (last part should be a number)
                        verse_num = int(parts[-1])
                        
                        # The chapter is embedded in the first part (e.g., "genesis001")
                        # Extract the number at the end
                        first_part = parts[0]
                        chapter_num = int(first_part[-3:])  # Last 3 digits
                        
                        # Book name is everything before the chapter number
                        book_slug = first_part[:-3]
                    else:
                        continue
                except:
                    continue
                
                entry = {
                    'book': book_dir.name,
                    'chapter': chapter_num,
                    'verse': verse_num,
                    'local_path': str(audio_file),
                    'folder_path': f"{book_dir.name}/{chapter_dir.name}/{filename}"
                }
                
                files_to_upload.append((audio_file, filename, entry))
                
                if len(files_to_upload) <= 5:
                    print(f"  Found: {filename}")
    
    print(f"Total OT files to upload: {len(files_to_upload)}")
    return files_to_upload, audio_data

def main():
    """Main concurrent upload function"""
    print("🚀 Starting concurrent Yousafzai Old Testament audio uploader...")
    
    # Get credentials
    creds = authenticate_google_drive()
    if not creds:
        print("❌ Failed to authenticate with Google Drive")
        return
    
    credentials_data = json.loads(creds.to_json())
    
    # Get files to upload
    files_to_upload, audio_data = get_ot_files_to_upload()
    
    if not files_to_upload:
        print("✅ No Old Testament files to upload")
        return
    
    print(f"📁 Found {len(files_to_upload)} Old Testament files to upload")
    
    # Determine number of workers (use CPU count, but cap at 4 for API rate limits)
    num_workers = min(4, mp.cpu_count())
    print(f"👥 Using {num_workers} worker processes")
    
    # Create queues
    file_queue = mp.Queue()
    result_queue = mp.Queue()
    
    # Add files to queue
    for file_data in files_to_upload:
        file_queue.put(file_data)
    
    # Add poison pills
    for _ in range(num_workers):
        file_queue.put(None)
    
    # Start worker processes
    processes = []
    for i in range(num_workers):
        p = mp.Process(target=worker_process, args=(i+1, file_queue, result_queue, credentials_data))
        p.start()
        processes.append(p)
    
    # Process results
    success_count = 0
    failed_count = 0
    processed_count = 0
    
    print(f"📦 Processing {len(files_to_upload)} Old Testament files with {num_workers} workers...")
    
    while processed_count < len(files_to_upload):
        try:
            result = result_queue.get(timeout=10)
            processed_count += 1
            
            if result['success']:
                # Update audio data
                filename = result['filename']
                file_id = result['file_id']
                entry = result['entry']
                
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
            else:
                failed_count += 1
            
            # Save progress every 50 files
            if processed_count % 50 == 0:
                save_audio_map(audio_data)
                print(f"💾 Progress saved: {processed_count}/{len(files_to_upload)} processed")
                
        except Exception as e:
            print(f"Error processing result: {e}")
            break
    
    # Wait for all processes to complete
    for p in processes:
        p.join()
    
    # Final save
    save_audio_map(audio_data)
    
    print(f"\n📊 Old Testament Upload Summary:")
    print(f"✅ Successfully uploaded: {success_count}")
    print(f"❌ Failed: {failed_count}")
    print(f"📁 Total processed: {processed_count}")

if __name__ == "__main__":
    main()
