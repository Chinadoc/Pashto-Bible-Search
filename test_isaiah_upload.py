#!/usr/bin/env python3
"""
Test upload of Isaiah 3:24 to Google Drive and update file ID.
"""

import os
import json
import pickle
from pathlib import Path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# Google Drive API scopes - need write access for uploads
SCOPES = ['https://www.googleapis.com/auth/drive.file']

def authenticate_google_drive():
    """Authenticate with Google Drive API"""
    creds = None

    # Check for existing credentials
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)

    # If no valid credentials, authenticate
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)

        # Save credentials for future use
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    return creds

def upload_file_to_drive(service, file_path):
    """Upload a file to Google Drive"""
    try:
        file_metadata = {
            'name': file_path.name
        }
        
        media = MediaFileUpload(file_path, mimetype='audio/mpeg')
        
        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id'
        ).execute()
        
        return file.get('id')
    except Exception as e:
        print(f"❌ Error uploading {file_path.name}: {e}")
        return None

def update_audio_urls_file(file_id, filename):
    """Update the google_drive_audio_urls.json file with the new file ID"""
    try:
        # Load existing mapping
        with open('google_drive_audio_urls.json', 'r') as f:
            url_mapping = json.load(f)
        
        if filename in url_mapping:
            # Update the file ID and URL
            url_mapping[filename]['google_drive_file_id'] = file_id
            url_mapping[filename]['google_drive_url'] = f"https://drive.google.com/uc?id={file_id}&export=download"
            
            # Save updated mapping
            with open('google_drive_audio_urls.json', 'w') as f:
                json.dump(url_mapping, f, indent=2)
            
            print(f"✅ Updated {filename} with file ID: {file_id}")
            return True
        else:
            print(f"❌ File {filename} not found in mapping")
            return False
            
    except Exception as e:
        print(f"❌ Error updating mapping for {filename}: {e}")
        return False

def main():
    """Main function"""
    print("🚀 Testing Isaiah 3:24 upload to Google Drive...")
    
    # Check if credentials exist
    if not os.path.exists('credentials.json'):
        print("❌ Google Drive credentials not found. Please add credentials.json")
        return
    
    # Authenticate with Google Drive
    creds = authenticate_google_drive()
    service = build('drive', 'v3', credentials=creds)
    
    # Test with Isaiah 3:24
    test_file = Path("ot_audio_files/isaiah/chapter-3-verses/isaiah003_verse_024.mp3")
    
    if not test_file.exists():
        print(f"❌ Test file not found: {test_file}")
        return
    
    print(f"📁 Uploading {test_file.name}...")
    
    try:
        # Upload to Google Drive
        file_id = upload_file_to_drive(service, test_file)
        
        if file_id:
            print(f"✅ Upload successful! File ID: {file_id}")
            
            # Update the mapping file
            if update_audio_urls_file(file_id, test_file.name):
                print("✅ Mapping file updated successfully!")
                
                # Test the audio URL
                test_url = f"https://drive.google.com/uc?id={file_id}&export=download"
                print(f"🔗 Test URL: {test_url}")
            else:
                print("❌ Failed to update mapping file")
        else:
            print("❌ Upload failed")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
