#!/usr/bin/env python3
"""
Test script to verify OT/NT audio source filtering in the audio map API
"""

import requests
import json

def test_audio_source_filtering():
    """Test that audio sources are correctly filtered by OT/NT"""

    try:
        response = requests.get('http://localhost:3000/api/get_audio_map?refresh=1')
        response.raise_for_status()
        audio_map = response.json()

        print("🔍 Testing Audio Source Filtering")
        print("=" * 50)

        # Test OT books (should come from Google Drive file IDs)
        ot_books = ["Isaiah", "Genesis", "Psalms"]  # Psalms is Yousafzai, so should be Supabase
        nt_books = ["Romans", "Matthew", "Revelation"]

        ot_from_drive = 0
        ot_from_supabase = 0
        nt_from_supabase = 0
        nt_from_drive = 0

        for ref, url in audio_map.items():
            if not isinstance(url, str):
                continue

            # Check OT books
            for ot_book in ot_books:
                if ref.startswith(ot_book):
                    # Check for Google Drive file IDs (typically start with numbers/letters like "1Y", "18E", etc.)
                    is_google_drive = isinstance(url, str) and (
                        url.startswith(('1', '0')) and len(url) > 20 or
                        'drive.google.com' in url
                    )
                    if is_google_drive and ot_book != "Psalms":  # Psalms should be Supabase (Yousafzai)
                        ot_from_drive += 1
                        print(f"✅ OT {ref}: Google Drive (correct)")
                    elif 'supabase.co/storage' in url:
                        ot_from_supabase += 1
                        expected_yousafzai = ot_book == "Psalms"
                        status = "correct - Yousafzai" if expected_yousafzai else "unexpected"
                        print(f"✅ OT {ref}: Supabase Storage ({status})")
                    else:
                        print(f"⚠️  OT {ref}: Unknown source - {url}")
                    break

            # Check NT books
            for nt_book in nt_books:
                if ref.startswith(nt_book):
                    if 'supabase.co/storage' in url:
                        nt_from_supabase += 1
                        print(f"✅ NT {ref}: Supabase Storage (correct)")
                    elif isinstance(url, str) and (url.startswith(('1', '0')) and len(url) > 20):
                        nt_from_drive += 1
                        print(f"❌ NT {ref}: Google Drive (incorrect)")
                    else:
                        print(f"⚠️  NT {ref}: Unknown source - {url}")
                    break

        print("\n📊 Summary:")
        print(f"OT from Google Drive: {ot_from_drive}")
        print(f"OT from Supabase: {ot_from_supabase}")
        print(f"NT from Supabase: {nt_from_supabase}")
        print(f"NT from Google Drive: {nt_from_drive}")

        # Check if filtering is working correctly
        # OT books (except Psalms) should be from Google Drive
        # Psalms should be from Supabase (Yousafzai)
        # NT books should be from Supabase
        filtering_correct = (
            nt_from_drive == 0 and
            ot_from_drive > 0 and
            ot_from_supabase > 0  # Psalms should be in Supabase
        )

        if filtering_correct:
            print("✅ Audio source filtering is working correctly!")
        else:
            print("❌ Audio source filtering needs adjustment.")
            if nt_from_drive > 0:
                print("   - Found NT books in Google Drive (should be in Supabase)")
            if ot_from_drive == 0:
                print("   - No OT books found in Google Drive")

    except Exception as e:
        print(f"❌ Error testing audio map: {e}")

if __name__ == "__main__":
    test_audio_source_filtering()
