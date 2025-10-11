#!/usr/bin/env python3
"""
Google Drive API Helper for Pashto Bible Audio Files.

This script uses the Google Drive API to automatically get file IDs for all
uploaded audio files and update the URL mapping.
"""

import os
import json
import pickle
from pathlib import Path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Google Drive API scopes
SCOPES = ['https://www.googleapis.com/auth/drive.readonly']

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

def get_folder_id_from_url(url):
    """Extract folder ID from Google Drive URL"""
    if 'folders/' in url:
        return url.split('folders/')[1].split('?')[0]
    return None

def find_files_in_folder(service, folder_id, folder_path=""):
    """Recursively find all files in a Google Drive folder"""
    files = []

    try:
        # Get files in current folder
        query = f"'{folder_id}' in parents and trashed = false"
        results = service.files().list(
            q=query,
            fields="nextPageToken, files(id, name, parents, mimeType)"
        ).execute()

        items = results.get('files', [])

        for item in items:
            if item['mimeType'] == 'application/vnd.google-apps.folder':
                # Recursively search subfolders
                subfolder_path = f"{folder_path}/{item['name']}" if folder_path else item['name']
                sub_files = find_files_in_folder(service, item['id'], subfolder_path)
                files.extend(sub_files)
            else:
                # This is a file
                files.append({
                    'id': item['id'],
                    'name': item['name'],
                    'folder_path': folder_path
                })

    except Exception as e:
        print(f"Error searching folder {folder_id}: {e}")

    return files

def update_url_mapping_with_file_ids(url_mapping_file, folder_url):
    """Update the URL mapping file with actual Google Drive file IDs"""
    print("🔑 Authenticating with Google Drive API...")

    # Authenticate
    creds = authenticate_google_drive()
    service = build('drive', 'v3', credentials=creds)

    # Get folder ID
    folder_id = get_folder_id_from_url(folder_url)
    if not folder_id:
        print("❌ Invalid Google Drive folder URL")
        return

    print(f"📁 Searching folder: {folder_id}")

    # Find all files
    print("🔍 Scanning for audio files...")
    all_files = find_files_in_folder(service, folder_id)

    # Filter for MP3 files
    mp3_files = [f for f in all_files if f['name'].endswith('.mp3')]
    print(f"🎵 Found {len(mp3_files)} MP3 files")

    if len(mp3_files) == 0:
        print("❌ No MP3 files found in the specified folder")
        return

    # Load existing URL mapping
    try:
        with open(url_mapping_file, 'r') as f:
            url_mapping = json.load(f)
    except FileNotFoundError:
        print(f"❌ URL mapping file not found: {url_mapping_file}")
        return

    # Match files and update IDs
    updated_count = 0
    for filename, file_info in url_mapping.items():
        # Find matching file in Google Drive
        for drive_file in mp3_files:
            if drive_file['name'] == filename:
                # Update the URL with actual file ID
                old_url = file_info['google_drive_url']
                new_url = old_url.replace('FILE_ID_HERE', drive_file['id'])
                file_info['google_drive_url'] = new_url
                file_info['google_drive_file_id'] = drive_file['id']
                updated_count += 1
                break

    # Save updated mapping
    with open(url_mapping_file, 'w') as f:
        json.dump(url_mapping, f, indent=2)

    print(f"✅ Updated {updated_count} file URLs with actual Google Drive IDs")
    print(f"💾 Saved to: {url_mapping_file}")

    return updated_count

def show_setup_instructions():
    """Show instructions for setting up Google Drive API"""
    print("\n=== GOOGLE DRIVE API SETUP ===")
    print()
    print("To use this script, you need to:")
    print()
    print("1️⃣  Go to Google Cloud Console:")
    print("   https://console.cloud.google.com/")
    print()
    print("2️⃣  Create a new project or select existing")
    print()
    print("3️⃣  Enable Google Drive API:")
    print("   • APIs & Services > Library")
    print("   • Search for 'Google Drive API'")
    print("   • Enable it")
    print()
    print("4️⃣  Create credentials:")
    print("   • APIs & Services > Credentials")
    print("   • Click 'Create Credentials' > 'OAuth client ID'")
    print("   • Choose 'Desktop app'")
    print("   • Download credentials.json")
    print("   • Place credentials.json in this directory")
    print()
    print("5️⃣  Run this script:")
    print("   python3 google_drive_api_helper.py")
    print()

if __name__ == "__main__":
    import sys

    print("🎵 Google Drive API Helper for Pashto Bible Audio")
    print("=" * 50)

    # Check if credentials exist
    if not os.path.exists('credentials.json'):
        print("❌ credentials.json not found!")
        show_setup_instructions()
        sys.exit(1)

    if len(sys.argv) > 1:
        folder_url = sys.argv[1]
        url_mapping_file = "google_drive_audio_urls.json"

        print(f"📂 Processing Google Drive folder: {folder_url}")
        updated = update_url_mapping_with_file_ids(url_mapping_file, folder_url)

        if updated > 0:
            print(f"\n🎉 Successfully updated {updated} audio file URLs!")
            print("✅ Your audio integration is ready!")
        else:
            print("❌ No files were updated. Check your folder URL and file names.")
    else:
        print("Usage: python3 google_drive_api_helper.py 'YOUR_GOOGLE_DRIVE_FOLDER_URL'")
        print()
        print("Example:")
        print("  python3 google_drive_api_helper.py 'https://drive.google.com/drive/folders/YOUR_FOLDER_ID'")
        print()
        show_setup_instructions()
