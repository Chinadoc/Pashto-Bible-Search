#!/usr/bin/env python3
"""
Test Yousafzai Google Drive upload with a small subset of files.
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

def upload_test_file(service, file_path, filename):
    """Upload a single test file"""
    try:
        file_metadata = {'name': filename}
        media = MediaFileUpload(str(file_path), mimetype='audio/mpeg')
        
        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id'
        ).execute()
        
        return file.get('id')
        
    except HttpError as e:
        print(f"  ❌ Upload failed: {e}")
        return None
    except Exception as e:
        print(f"  ❌ Unexpected error: {e}")
        return None

def main():
    """Test upload with first 3 files"""
    print("🧪 Testing Yousafzai Google Drive upload...")
    
    # Load the Yousafzai audio URLs file
    audio_file = 'yousafzai_google_drive_audio_urls.json'
    
    if not os.path.exists(audio_file):
        print(f"❌ {audio_file} not found. Run generate_yousafzai_audio_map.py first.")
        return
    
    with open(audio_file, 'r') as f:
        audio_data = json.load(f)
    
    # Get first 3 files for testing
    test_files = list(audio_data.items())[:3]
    
    print(f"📊 Testing with {len(test_files)} files")
    
    # Authenticate
    creds = authenticate_google_drive()
    if not creds:
        print("❌ Failed to authenticate with Google Drive")
        return
    
    service = build('drive', 'v3', credentials=creds)
    
    # Test uploads
    success_count = 0
    failed_count = 0
    
    for i, (filename, entry) in enumerate(test_files):
        print(f"\n📁 Testing {i+1}/{len(test_files)}: {filename}")
        
        local_path = entry.get('local_path')
        if not local_path or not os.path.exists(local_path):
            print(f"  ❌ File not found: {local_path}")
            failed_count += 1
            continue
        
        file_path = Path(local_path)
        
        # Upload file
        file_id = upload_test_file(service, file_path, filename)
        
        if file_id:
            # Update the entry
            audio_data[filename]['google_drive_file_id'] = file_id
            audio_data[filename]['google_drive_url'] = f"https://drive.google.com/uc?id={file_id}&export=download"
            success_count += 1
            print(f"  ✅ Uploaded successfully: {file_id}")
        else:
            failed_count += 1
            print(f"  ❌ Failed to upload")
        
        # Small delay between uploads
        time.sleep(2)
    
    # Save results
    with open(audio_file, 'w') as f:
        json.dump(audio_data, f, indent=2)
    
    print(f"\n📊 Test Summary:")
    print(f"✅ Successfully uploaded: {success_count}")
    print(f"❌ Failed: {failed_count}")
    print(f"📈 Success rate: {success_count/(success_count+failed_count)*100:.1f}%")
    
    if success_count > 0:
        print(f"\n🎉 Test successful! You can now run the full upload:")
        print(f"   python3 batch_upload_yousafzai.py")
    else:
        print(f"\n❌ Test failed. Check your Google Drive credentials and try again.")

if __name__ == "__main__":
    main()
