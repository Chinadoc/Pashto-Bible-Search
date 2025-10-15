#!/usr/bin/env python3
"""
Retry failed Google Drive uploads with improved error handling and rate limiting.
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

    # Check for existing credentials (try both pickle and json)
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            import pickle
            creds = pickle.load(token)
    elif os.path.exists('token.json'):
        with open('token.json', 'r') as token:
            creds_data = json.load(token)
            # creds_data might be a string, so parse it if needed
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

        # Save credentials for future use (both formats)
        with open('token.pickle', 'wb') as token:
            import pickle
            pickle.dump(creds, token)
        with open('token.json', 'w') as token:
            json.dump(creds.to_json(), token)

    return creds

def upload_file_to_drive(service, file_path, folder_id=None, max_retries=3):
    """Upload a file to Google Drive with retry logic"""
    for attempt in range(max_retries):
        try:
            file_metadata = {
                'name': file_path.name,
                'parents': [folder_id] if folder_id else []
            }
            
            media = MediaFileUpload(str(file_path), mimetype='audio/mpeg')
            
            # Add exponential backoff with jitter
            if attempt > 0:
                delay = (2 ** attempt) + random.uniform(0, 1)
                print(f"  Retrying in {delay:.1f}s (attempt {attempt + 1}/{max_retries})")
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

def main():
    """Main function to retry failed uploads"""
    print("🔄 Retrying failed Google Drive uploads...")
    
    # Load the audio URLs file
    with open('google_drive_audio_urls.json', 'r') as f:
        audio_data = json.load(f)
    
    # Find failed files
    failed_files = []
    for filename, entry in audio_data.items():
        if entry.get('google_drive_file_id') == 'FILE_ID_HERE':
            failed_files.append((filename, entry))
    
    print(f"📊 Found {len(failed_files)} failed files to retry")
    
    if not failed_files:
        print("✅ No failed files to retry!")
        return
    
    # Authenticate
    creds = authenticate_google_drive()
    if not creds:
        print("❌ Failed to authenticate with Google Drive")
        return
    
    service = build('drive', 'v3', credentials=creds)
    
    # Retry uploads
    success_count = 0
    failed_count = 0
    
    for i, (filename, entry) in enumerate(failed_files):
        print(f"\n📁 Processing {i+1}/{len(failed_files)}: {filename}")
        
        local_path = entry.get('local_path')
        if not local_path or not os.path.exists(local_path):
            print(f"  ❌ File not found: {local_path}")
            failed_count += 1
            continue
        
        file_path = Path(local_path)
        
        # Upload with retry logic
        file_id = upload_file_to_drive(service, file_path)
        
        if file_id:
            # Update the entry
            audio_data[filename]['google_drive_file_id'] = file_id
            audio_data[filename]['google_drive_url'] = f"https://drive.google.com/uc?id={file_id}&export=download"
            success_count += 1
            print(f"  ✅ Uploaded successfully: {file_id}")
            
            # Save progress every 10 files
            if success_count % 10 == 0:
                with open('google_drive_audio_urls.json', 'w') as f:
                    json.dump(audio_data, f, indent=2)
                print(f"  💾 Progress saved ({success_count} uploaded)")
        else:
            failed_count += 1
            print(f"  ❌ Failed to upload")
        
        # Rate limiting - pause between uploads
        time.sleep(1 + random.uniform(0, 1))
    
    # Final save
    with open('google_drive_audio_urls.json', 'w') as f:
        json.dump(audio_data, f, indent=2)
    
    print(f"\n📊 Retry Summary:")
    print(f"✅ Successfully uploaded: {success_count}")
    print(f"❌ Still failed: {failed_count}")
    print(f"📈 Success rate: {success_count/(success_count+failed_count)*100:.1f}%")

if __name__ == "__main__":
    main()
