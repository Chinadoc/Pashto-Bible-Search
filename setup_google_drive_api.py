#!/usr/bin/env python3
"""
Setup Google Drive API for Pashto Bible Audio Integration.

This script helps you set up Google Drive API authentication and
automatically extract file IDs for all your audio files.
"""

import os
import json
import sys

def check_credentials():
    """Check if credentials.json exists"""
    if not os.path.exists('credentials.json'):
        print("❌ credentials.json not found!")
        return False

    print("✅ credentials.json found")
    return True

def create_credentials_placeholder():
    """Create a placeholder credentials.json file"""
    placeholder = {
        "installed": {
            "client_id": "YOUR_CLIENT_ID",
            "project_id": "YOUR_PROJECT_ID",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_secret": "YOUR_CLIENT_SECRET",
            "redirect_uris": ["http://localhost"]
        }
    }

    with open('credentials.json', 'w') as f:
        json.dump(placeholder, f, indent=2)

    print("📝 Created credentials.json placeholder")
    print("💡 Replace with your actual Google Cloud Console credentials")

def show_setup_instructions():
    """Show detailed setup instructions"""
    print("\n" + "="*60)
    print("🔑 GOOGLE DRIVE API SETUP INSTRUCTIONS")
    print("="*60)
    print()
    print("To use Google Drive API automation, you need to:")
    print()
    print("1️⃣  GO TO GOOGLE CLOUD CONSOLE:")
    print("   https://console.cloud.google.com/")
    print()
    print("2️⃣  CREATE A NEW PROJECT:")
    print("   • Click 'Select a project' → 'New Project'")
    print("   • Name: 'Pashto Bible Audio' (or similar)")
    print("   • Wait for project creation")
    print()
    print("3️⃣  ENABLE GOOGLE DRIVE API:")
    print("   • Go to 'APIs & Services' → 'Library'")
    print("   • Search for 'Google Drive API'")
    print("   • Click 'Enable'")
    print()
    print("4️⃣  CREATE CREDENTIALS:")
    print("   • Go to 'APIs & Services' → 'Credentials'")
    print("   • Click '+ CREATE CREDENTIALS' → 'OAuth client ID'")
    print("   • Choose 'Desktop app'")
    print("   • Click 'Create'")
    print("   • Download the credentials.json file")
    print()
    print("5️⃣  PLACE CREDENTIALS:")
    print("   • Put credentials.json in this directory")
    print("   • Run: python3 google_drive_api_helper.py")
    print()
    print("="*60)

def run_api_helper(folder_url):
    """Run the Google Drive API helper script"""
    print("🚀 Running Google Drive API automation...")

    if not check_credentials():
        print("❌ Please set up credentials.json first")
        show_setup_instructions()
        return

    print("✅ Credentials found, running API script...")

    # Import and run the API helper
    try:
        from google_drive_api_helper import update_url_mapping_with_file_ids
        updated = update_url_mapping_with_file_ids("google_drive_audio_urls.json", folder_url)

        if updated > 0:
            print(f"\n🎉 SUCCESS! Updated {updated} file URLs with Google Drive IDs!")
            print("✅ Your audio integration is ready!")
        else:
            print("❌ No files were updated. Check your folder URL and file names.")

    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("💡 Make sure google-api-python-client is installed")
        print("   pip install google-api-python-client google-auth-oauthlib")

    except Exception as e:
        print(f"❌ Error running API helper: {e}")
        print("💡 Check your credentials.json file and try again")

if __name__ == "__main__":
    import sys

    print("🎵 Google Drive API Setup Helper")
    print("=" * 35)

    if len(sys.argv) > 1:
        folder_url = sys.argv[1]
        print(f"📂 Target folder: {folder_url}")
        run_api_helper(folder_url)
    else:
        print("🔧 Checking setup status...")

        if check_credentials():
            print("✅ Ready to run! Provide your Google Drive folder URL:")
            print("   python3 setup_google_drive_api.py 'YOUR_FOLDER_URL'")
        else:
            print("❌ Need Google Drive API setup")
            create_credentials_placeholder()
            show_setup_instructions()
