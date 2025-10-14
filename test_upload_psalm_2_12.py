#!/usr/bin/env python3
"""
Quick test upload for Psalms 2:12 verse audio
"""

import os
import requests
from pathlib import Path
from urllib.parse import quote

def upload_psalm_2_12():
    """Upload just Psalms 2:12 to test the audio functionality."""
    
    # Configuration
    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not service_key:
        print("❌ Missing environment variables")
        return False
    
    # File to upload
    audio_file = Path("/Users/jeremysamuels/Documents/Pashto Bible split into verses/yousafzai_split_audio/psalms/chapter-2-verses/yousafzai_psalms002_verse_012.mp3")
    
    if not audio_file.exists():
        print(f"❌ Audio file not found: {audio_file}")
        return False
    
    print(f"🎵 Uploading {audio_file.name} to test Psalms 2:12...")
    
    # Headers for Supabase API
    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "audio/mpeg"
    }
    
    try:
        # Upload to Supabase storage
        storage_path = f"yousafzai/{audio_file.name}"
        upload_url = f"{supabase_url}/storage/v1/object/audio/{quote(storage_path)}"
        
        with open(audio_file, 'rb') as f:
            response = requests.post(upload_url, headers=headers, data=f)
        
        if response.status_code in [200, 201]:
            print(f"✅ Successfully uploaded!")
            public_url = f"{supabase_url}/storage/v1/object/public/audio/{quote(storage_path)}"
            print(f"🌐 Public URL: {public_url}")
            return True
        else:
            print(f"❌ Upload failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    success = upload_psalm_2_12()
    if success:
        print("\n🎉 Test upload complete! Now try Psalms 2:12 in the app.")
    else:
        print("\n💡 Upload failed. The frontend will generate the URL pattern anyway for testing.")




