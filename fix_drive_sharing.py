#!/usr/bin/env python3
"""
Fix Google Drive file sharing permissions for Isaiah 3:24
"""

import os
import json
import pickle
from pathlib import Path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Google Drive API scopes - need write access for sharing
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

def make_file_public(service, file_id):
    """Make a Google Drive file publicly accessible"""
    try:
        # Create a permission for anyone with the link
        permission = {
            'type': 'anyone',
            'role': 'reader'
        }
        
        # Apply the permission
        result = service.permissions().create(
            fileId=file_id,
            body=permission
        ).execute()
        
        print(f"✅ Made file {file_id} publicly accessible")
        return True
        
    except Exception as e:
        print(f"❌ Error making file {file_id} public: {e}")
        return False

def main():
    """Main function"""
    print("🔧 Fixing Google Drive sharing permissions for Isaiah 3:24...")
    
    # Check if credentials exist
    if not os.path.exists('credentials.json'):
        print("❌ Google Drive credentials not found. Please add credentials.json")
        return
    
    # Authenticate with Google Drive
    creds = authenticate_google_drive()
    service = build('drive', 'v3', credentials=creds)
    
    # Isaiah 3:24 file ID
    file_id = "1j73KLnlN4Zm7dxXTqhkRVxz87NrBjHlw"
    
    print(f"🔗 Making file {file_id} publicly accessible...")
    
    try:
        # Make the file public
        if make_file_public(service, file_id):
            print("✅ File sharing permissions updated successfully!")
            
            # Test the direct URL
            test_url = f"https://drive.google.com/uc?id={file_id}&export=download"
            print(f"🔗 Test URL: {test_url}")
            
            # Test the proxy URL
            proxy_url = f"http://localhost:3000/api/audio_proxy?fileId={file_id}&ref=Isaiah%203%3A24"
            print(f"🔗 Proxy URL: {proxy_url}")
        else:
            print("❌ Failed to update sharing permissions")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
