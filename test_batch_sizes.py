#!/usr/bin/env python3
"""
Test different batch sizes to find optimal throughput.
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

def test_batch_size(service, files_to_test, batch_size):
    """Test a specific batch size"""
    print(f"\n🧪 Testing batch size: {batch_size}")
    
    start_time = time.time()
    success_count = 0
    failed_count = 0
    
    # Process files in batches
    for i in range(0, len(files_to_test), batch_size):
        batch = files_to_test[i:i + batch_size]
        
        batch_start = time.time()
        batch_success = 0
        
        for file_path, filename, entry in batch:
            file_id = upload_file_with_backoff(service, file_path, filename)
            if file_id:
                success_count += 1
                batch_success += 1
            else:
                failed_count += 1
        
        batch_time = time.time() - batch_start
        print(f"  Batch {i//batch_size + 1}: {batch_success}/{len(batch)} files in {batch_time:.1f}s")
        
        # Small delay between batches
        time.sleep(1)
    
    total_time = time.time() - start_time
    files_per_second = success_count / total_time if total_time > 0 else 0
    
    print(f"  ✅ Results: {success_count} files in {total_time:.1f}s ({files_per_second:.2f} files/sec)")
    return files_per_second, success_count, failed_count

def main():
    """Test different batch sizes"""
    print("🧪 Testing different batch sizes for optimal throughput...")
    
    # Authenticate
    creds = authenticate_google_drive()
    if not creds:
        print("❌ Failed to authenticate with Google Drive")
        return
    
    service = build('drive', 'v3', credentials=creds)
    
    # Find some test files
    audio_dir = Path("yousafzai_audio_files")
    test_files = []
    
    for book_dir in audio_dir.iterdir():
        if not book_dir.is_dir():
            continue
            
        for chapter_dir in book_dir.iterdir():
            if not chapter_dir.is_dir() or not chapter_dir.name.startswith('chapter-'):
                continue
                
            for audio_file in chapter_dir.glob("yousafzai_*.mp3"):
                filename = audio_file.name
                
                # Check if already uploaded
                with open('yousafzai_google_drive_audio_urls.json', 'r') as f:
                    audio_data = json.load(f)
                
                if filename in audio_data:
                    file_id = audio_data[filename].get('google_drive_file_id')
                    if file_id and file_id != 'FILE_ID_HERE':
                        continue  # Already uploaded
                
                entry = {
                    'book': book_dir.name,
                    'chapter': 1,
                    'verse': 1,
                    'local_path': str(audio_file),
                    'folder_path': f"{book_dir.name}/{chapter_dir.name}/{filename}"
                }
                
                test_files.append((audio_file, filename, entry))
                
                if len(test_files) >= 30:  # Test with 30 files
                    break
            if len(test_files) >= 30:
                break
        if len(test_files) >= 30:
            break
    
    if not test_files:
        print("❌ No test files found")
        return
    
    print(f"📁 Found {len(test_files)} test files")
    
    # Test different batch sizes
    batch_sizes = [1, 3, 5, 10, 15]
    results = []
    
    for batch_size in batch_sizes:
        if batch_size > len(test_files):
            continue
            
        files_per_second, success, failed = test_batch_size(service, test_files, batch_size)
        results.append((batch_size, files_per_second, success, failed))
        
        # Wait between tests
        time.sleep(5)
    
    # Print results
    print(f"\n📊 Batch Size Test Results:")
    print(f"{'Batch Size':<12} {'Files/sec':<12} {'Success':<8} {'Failed':<8}")
    print("-" * 45)
    
    best_batch_size = 3
    best_rate = 0
    
    for batch_size, rate, success, failed in results:
        print(f"{batch_size:<12} {rate:<12.2f} {success:<8} {failed:<8}")
        if rate > best_rate:
            best_rate = rate
            best_batch_size = batch_size
    
    print(f"\n🏆 Best batch size: {best_batch_size} ({best_rate:.2f} files/sec)")
    
    # Update the main script with the best batch size
    print(f"\n💡 Recommendation: Use batch size {best_batch_size} for optimal performance")

if __name__ == "__main__":
    main()
