#!/usr/bin/env python3
"""
Batch upload remaining failed files with optimized rate limiting.
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

def upload_file_batch(service, file_paths, batch_size=5):
    """Upload multiple files in batches"""
    results = []
    
    for i in range(0, len(file_paths), batch_size):
        batch = file_paths[i:i + batch_size]
        print(f"\n📦 Processing batch {i//batch_size + 1}: {len(batch)} files")
        
        batch_results = []
        for file_path, filename, entry in batch:
            try:
                file_metadata = {'name': filename}
                media = MediaFileUpload(str(file_path), mimetype='audio/mpeg')
                
                file = service.files().create(
                    body=file_metadata,
                    media_body=media,
                    fields='id'
                ).execute()
                
                file_id = file.get('id')
                batch_results.append((filename, file_id, entry))
                print(f"  ✅ {filename}: {file_id}")
                
            except HttpError as e:
                print(f"  ❌ {filename}: {e}")
                batch_results.append((filename, None, entry))
                
                # Handle rate limiting
                if e.resp.status == 429 or 'quota' in str(e).lower():
                    wait_time = 60 + random.uniform(0, 30)
                    print(f"  ⏳ Rate limit hit, waiting {wait_time:.1f}s")
                    time.sleep(wait_time)
        
        results.extend(batch_results)
        
        # Save progress after each batch
        update_audio_map(batch_results)
        
        # Rate limiting between batches
        if i + batch_size < len(file_paths):
            wait_time = 2 + random.uniform(0, 2)
            print(f"  ⏳ Waiting {wait_time:.1f}s before next batch")
            time.sleep(wait_time)
    
    return results

def update_audio_map(results):
    """Update the audio map with successful uploads"""
    with open('google_drive_audio_urls.json', 'r') as f:
        audio_data = json.load(f)
    
    updated_count = 0
    for filename, file_id, entry in results:
        if file_id:
            audio_data[filename]['google_drive_file_id'] = file_id
            audio_data[filename]['google_drive_url'] = f"https://drive.google.com/uc?id={file_id}&export=download"
            updated_count += 1
    
    with open('google_drive_audio_urls.json', 'w') as f:
        json.dump(audio_data, f, indent=2)
    
    print(f"  💾 Updated {updated_count} files in audio map")

def main():
    """Main function to batch upload remaining files"""
    print("🚀 Starting batch upload of remaining files...")
    
    # Load the audio URLs file
    with open('google_drive_audio_urls.json', 'r') as f:
        audio_data = json.load(f)
    
    # Find failed files
    failed_files = []
    for filename, entry in audio_data.items():
        if entry.get('google_drive_file_id') == 'FILE_ID_HERE':
            local_path = entry.get('local_path')
            if local_path and os.path.exists(local_path):
                failed_files.append((Path(local_path), filename, entry))
    
    print(f"📊 Found {len(failed_files)} failed files to upload")
    
    if not failed_files:
        print("✅ No failed files to upload!")
        return
    
    # Authenticate
    creds = authenticate_google_drive()
    if not creds:
        print("❌ Failed to authenticate with Google Drive")
        return
    
    service = build('drive', 'v3', credentials=creds)
    
    # Upload in batches
    results = upload_file_batch(service, failed_files, batch_size=3)
    
    # Final summary
    success_count = sum(1 for _, file_id, _ in results if file_id)
    failed_count = len(results) - success_count
    
    print(f"\n📊 Final Summary:")
    print(f"✅ Successfully uploaded: {success_count}")
    print(f"❌ Failed: {failed_count}")
    print(f"📈 Success rate: {success_count/len(results)*100:.1f}%")

if __name__ == "__main__":
    main()

