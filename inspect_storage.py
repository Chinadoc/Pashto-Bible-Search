#!/usr/bin/env python3
"""
Inspect Supabase Storage to see what files are actually there.
"""

import os
import json
import requests

def inspect_storage():
    """List all files in Supabase Storage to understand the structure."""
    print("--- Inspecting Supabase Storage ---")
    
    # Configuration
    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not service_key:
        print("❌ Missing environment variables")
        return
    
    # Headers for Supabase API
    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}"
    }
    
    # List all files in the audio bucket
    list_url = f"{supabase_url}/storage/v1/object/list/audio"
    
    try:
        response = requests.post(list_url, headers=headers, json={
            "limit": 1000,
            "offset": 0,
            "prefix": ""
        })
        
        if response.status_code != 200:
            print(f"❌ Failed to list files: {response.status_code}")
            print(f"Response: {response.text}")
            return
        
        files = response.json()
        print(f"📁 Found {len(files)} total files in storage")
        
        # Group files by type
        ot_files = []
        nt_files = []
        yousafzai_files = []
        other_files = []
        
        for file_info in files:
            file_path = file_info.get('name', '')
            
            if file_path.startswith('ot/'):
                ot_files.append(file_info)
            elif file_path.startswith('yousafzai/'):
                yousafzai_files.append(file_info)
            elif any(book in file_path.lower() for book in [
                'matthew', 'mark', 'luke', 'john', 'acts', 'romans',
                '1-corinthians', '2-corinthians', 'galatians', 'ephesians',
                'philippians', 'colossians', '1-thessalonians', '2-thessalonians',
                '1-timothy', '2-timothy', 'titus', 'philemon', 'hebrews',
                'james', '1-peter', '2-peter', '1-john', '2-john', '3-john',
                'jude', 'revelation'
            ]):
                nt_files.append(file_info)
            elif any(book in file_path.lower() for book in [
                'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy',
                'joshua', 'judges', 'ruth', '1-samuel', '2-samuel',
                '1-kings', '2-kings', '1-chronicles', '2-chronicles', 'ezra',
                'nehemiah', 'esther', 'job', 'psalms', 'proverbs',
                'ecclesiastes', 'song-of-solomon', 'isaiah', 'jeremiah',
                'lamentations', 'ezekiel', 'daniel', 'hosea', 'joel',
                'amos', 'obadiah', 'jonah', 'micah', 'nahum',
                'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi'
            ]):
                ot_files.append(file_info)
            else:
                other_files.append(file_info)
        
        print(f"\n📊 File breakdown:")
        print(f"  📖 OT files: {len(ot_files)}")
        print(f"  📖 NT files: {len(nt_files)}")
        print(f"  🎵 Yousafzai files: {len(yousafzai_files)}")
        print(f"  ❓ Other files: {len(other_files)}")
        
        # Show examples of each type
        if ot_files:
            print(f"\n📖 OT file examples:")
            for file_info in ot_files[:5]:
                print(f"  - {file_info.get('name', 'unknown')}")
        
        if nt_files:
            print(f"\n📖 NT file examples:")
            for file_info in nt_files[:5]:
                print(f"  - {file_info.get('name', 'unknown')}")
        
        if yousafzai_files:
            print(f"\n🎵 Yousafzai file examples:")
            for file_info in yousafzai_files[:5]:
                print(f"  - {file_info.get('name', 'unknown')}")
        
        if other_files:
            print(f"\n❓ Other file examples:")
            for file_info in other_files[:10]:
                print(f"  - {file_info.get('name', 'unknown')}")
        
        # Calculate total size
        total_size = 0
        for file_info in files:
            metadata = file_info.get('metadata')
            if metadata:
                total_size += metadata.get('size', 0)
        print(f"\n💾 Total storage used: {total_size / (1024*1024):.2f} MB")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    inspect_storage()
