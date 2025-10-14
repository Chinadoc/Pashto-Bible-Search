#!/usr/bin/env python3
"""
Delete Old Testament audio files from Supabase Storage to stay under 1GB limit.
All OT audio will be served from Google Drive instead.
"""

import os
import json
import time
import requests
from pathlib import Path
from urllib.parse import quote
import sys

def list_ot_files():
    """List all OT files in Supabase Storage."""
    print("--- Listing OT files in Supabase Storage ---")
    
    # Configuration
    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not service_key:
        print("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables")
        return []
    
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
            return []
        
        files = response.json()
        print(f"📁 Found {len(files)} total files in storage")
        
        # Filter for OT files
        ot_files = []
        ot_book_names = [
            'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy',
            'joshua', 'judges', 'ruth', '1-samuel', '2-samuel',
            '1-kings', '2-kings', '1-chronicles', '2-chronicles', 'ezra',
            'nehemiah', 'esther', 'job', 'psalms', 'proverbs',
            'ecclesiastes', 'song-of-solomon', 'isaiah', 'jeremiah',
            'lamentations', 'ezekiel', 'daniel', 'hosea', 'joel',
            'amos', 'obadiah', 'jonah', 'micah', 'nahum',
            'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi'
        ]
        
        for file_info in files:
            file_path = file_info.get('name', '')
            
            # Check if it's an OT file
            is_ot_file = False
            
            # Check for OT folder structure
            if file_path.startswith('ot/'):
                is_ot_file = True
            # Check for OT book names
            elif any(book in file_path.lower() for book in ot_book_names):
                is_ot_file = True
            # Check for specific OT patterns
            elif any(pattern in file_path.lower() for pattern in [
                'isaiah', 'jonah', 'genesis', 'exodus', 'leviticus',
                'numbers', 'deuteronomy', 'amos', 'ecclesiastes',
                'ezekiel', 'ezra', 'judges', 'proverbs'
            ]):
                is_ot_file = True
            
            if is_ot_file:
                ot_files.append(file_info)
        
        print(f"📖 Found {len(ot_files)} OT files to delete:")
        for file_info in ot_files[:10]:  # Show first 10
            print(f"  - {file_info.get('name', 'unknown')}")
        if len(ot_files) > 10:
            print(f"  ... and {len(ot_files) - 10} more")
        
        return ot_files
        
    except Exception as e:
        print(f"❌ Error listing files: {e}")
        return []

def delete_ot_files(files_to_delete):
    """Delete OT files from Supabase Storage."""
    print(f"\n--- Deleting {len(files_to_delete)} OT files ---")
    
    # Configuration
    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not service_key:
        print("❌ Missing environment variables")
        return False
    
    # Headers for Supabase API
    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}"
    }
    
    deleted_count = 0
    error_count = 0
    
    for i, file_info in enumerate(files_to_delete):
        file_path = file_info.get('name', '')
        
        try:
            # Delete the file
            delete_url = f"{supabase_url}/storage/v1/object/audio/{quote(file_path)}"
            
            response = requests.delete(delete_url, headers=headers)
            
            if response.status_code in [200, 204]:
                deleted_count += 1
                if deleted_count % 10 == 0:
                    print(f"  ✅ Deleted {deleted_count}/{len(files_to_delete)} files...")
            else:
                error_count += 1
                print(f"  ❌ Failed to delete {file_path}: {response.status_code}")
            
            # Small delay to avoid hammering Supabase
            time.sleep(0.1)
            
        except Exception as e:
            error_count += 1
            print(f"  ❌ Error deleting {file_path}: {e}")
    
    print(f"\n📊 Deletion Summary:")
    print(f"  ✅ Successfully deleted: {deleted_count}")
    print(f"  ❌ Errors: {error_count}")
    print(f"  📁 Total processed: {len(files_to_delete)}")
    
    return deleted_count > 0

def verify_nt_files_remain():
    """Verify that NT files are still in storage."""
    print("\n--- Verifying NT files remain ---")
    
    # Configuration
    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not service_key:
        print("❌ Missing environment variables")
        return False
    
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
            return False
        
        files = response.json()
        print(f"📁 Remaining files in storage: {len(files)}")
        
        # Check for NT files
        nt_files = []
        nt_book_names = [
            'matthew', 'mark', 'luke', 'john', 'acts',
            'romans', '1-corinthians', '2-corinthians', 'galatians',
            'ephesians', 'philippians', 'colossians', '1-thessalonians',
            '2-thessalonians', '1-timothy', '2-timothy', 'titus',
            'philemon', 'hebrews', 'james', '1-peter', '2-peter',
            '1-john', '2-john', '3-john', 'jude', 'revelation'
        ]
        
        for file_info in files:
            file_path = file_info.get('name', '')
            
            # Check if it's an NT file
            is_nt_file = any(book in file_path.lower() for book in nt_book_names)
            if is_nt_file:
                nt_files.append(file_info)
        
        print(f"📖 NT files remaining: {len(nt_files)}")
        for file_info in nt_files[:5]:  # Show first 5
            print(f"  - {file_info.get('name', 'unknown')}")
        if len(nt_files) > 5:
            print(f"  ... and {len(nt_files) - 5} more")
        
        return len(nt_files) > 0
        
    except Exception as e:
        print(f"❌ Error verifying NT files: {e}")
        return False

def main():
    """Main function to delete OT files."""
    print("🗑️  Starting OT file cleanup from Supabase Storage")
    print("=" * 60)
    
    # Step 1: List OT files
    ot_files = list_ot_files()
    if not ot_files:
        print("✅ No OT files found to delete")
        return True
    
    # Step 2: Confirm deletion
    print(f"\n⚠️  About to delete {len(ot_files)} OT files from Supabase Storage")
    print("This will free up space to stay under the 1GB limit.")
    print("OT audio will be served from Google Drive instead.")
    
    confirm = input("\nProceed with deletion? (y/N): ").strip().lower()
    if confirm != 'y':
        print("❌ Deletion cancelled")
        return False
    
    # Step 3: Delete files
    success = delete_ot_files(ot_files)
    if not success:
        print("❌ Deletion failed")
        return False
    
    # Step 4: Verify NT files remain
    nt_remaining = verify_nt_files_remain()
    if not nt_remaining:
        print("⚠️  Warning: No NT files found remaining")
    
    print("\n✅ OT file cleanup completed!")
    print("📊 OT audio will now be served from Google Drive")
    print("📊 NT audio will continue to be served from Supabase Storage")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
