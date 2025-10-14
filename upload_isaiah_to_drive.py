#!/usr/bin/env python3
"""
Upload Isaiah audio files to Google Drive and update file IDs.
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

# Google Drive API scopes - need broader access for uploads
SCOPES = ['https://www.googleapis.com/auth/drive']

def authenticate_google_drive():
    """Authenticate with Google Drive API"""
    creds = None

    # Check for existing credentials (try both pickle and json)
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    elif os.path.exists('token.json'):
        with open('token.json', 'r') as token:
            creds_data = json.load(token)
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
            pickle.dump(creds, token)
        with open('token.json', 'w') as token:
            json.dump(creds.to_json(), token)

    return creds

def upload_file_to_drive(service, file_path, folder_id=None):
    """Upload a file to Google Drive"""
    try:
        file_metadata = {
            'name': file_path.name,
            'parents': [folder_id] if folder_id else []
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
    print("🚀 Starting Isaiah audio upload to Google Drive...")
    
    # Authenticate with Google Drive
    creds = authenticate_google_drive()
    service = build('drive', 'v3', credentials=creds)
    
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
                # Upload to Google Drive
                file_id = upload_file_to_drive(service, audio_file)
                
                if file_id:
                    # Update the mapping file
                    if update_audio_urls_file(file_id, audio_file.name):
                        uploaded_count += 1
                    else:
                        failed_count += 1
                else:
                    failed_count += 1
                    
            except Exception as e:
                print(f"❌ Error processing {audio_file.name}: {e}")
                failed_count += 1
    
    print(f"\n📊 Upload Summary:")
    print(f"✅ Successfully uploaded: {uploaded_count}")
    print(f"❌ Failed uploads: {failed_count}")

if __name__ == "__main__":
    main()
