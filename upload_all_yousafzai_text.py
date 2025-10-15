#!/usr/bin/env python3
"""Upload all Yousafzai 2019 text to Supabase verses_yousafzai table.

This script reads the downloaded Yousafzai text data and uploads it to Supabase,
replacing any existing data in the verses_yousafzai table.

Requires environment variables:
  NEXT_PUBLIC_SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY

Usage:
  python3 upload_all_yousafzai_text.py
"""

import json
import os
import requests
import time
from typing import Dict, List

def chunk(seq: List[Dict], size: int = 100) -> List[List[Dict]]:
    """Split sequence into chunks of specified size."""
    return [seq[i : i + size] for i in range(0, len(seq), size)]

def supabase_headers(service_key: str) -> Dict[str, str]:
    """Create headers for Supabase API requests."""
    return {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

def clear_existing_data(supabase_url: str, service_key: str):
    """Clear existing data from verses_yousafzai table."""
    headers = supabase_headers(service_key)
    print("Clearing existing Yousafzai data...")
    
    try:
        resp = requests.delete(f"{supabase_url}/rest/v1/verses_yousafzai", headers=headers)
        if resp.status_code in (200, 204):
            print("✓ Existing data cleared")
        else:
            print(f"Warning: Clear operation returned {resp.status_code}: {resp.text}")
    except Exception as e:
        print(f"Warning: Failed to clear existing data: {e}")

def upload_batch(supabase_url: str, service_key: str, batch: List[Dict], batch_num: int, total_batches: int):
    """Upload a batch of verses to Supabase."""
    headers = supabase_headers(service_key)
    endpoint = f"{supabase_url}/rest/v1/verses_yousafzai"
    
    # Filter to only include fields that exist in the table
    filtered_batch = []
    for verse in batch:
        filtered_verse = {
            'book': verse.get('book'),
            'chapter': verse.get('chapter'),
            'verse': verse.get('verse'),
            'text': verse.get('text'),
            'translation': verse.get('translation'),
            'dialect': verse.get('dialect')
        }
        filtered_batch.append(filtered_verse)
    
    try:
        resp = requests.post(endpoint, headers=headers, json=filtered_batch)
        if resp.status_code in (200, 201, 204):
            print(f"✓ Batch {batch_num}/{total_batches}: {len(filtered_batch)} verses uploaded")
            return True
        else:
            print(f"✗ Batch {batch_num}/{total_batches} failed: {resp.status_code} {resp.text}")
            return False
    except Exception as e:
        print(f"✗ Batch {batch_num}/{total_batches} error: {e}")
        return False

def main():
    """Main function to upload all Yousafzai text."""
    # Check environment variables
    supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    
    if not supabase_url or not service_key:
        print("Error: Missing Supabase credentials")
        print("Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
        return 1
    
    # Load the downloaded data
    data_file = "yousafzai_all_verses.json"
    if not os.path.exists(data_file):
        print(f"Error: Data file not found: {data_file}")
        print("Please run download_all_yousafzai_text.py first")
        return 1
    
    print(f"Loading data from {data_file}...")
    with open(data_file, 'r', encoding='utf-8') as f:
        all_verses = json.load(f)
    
    print(f"Loaded {len(all_verses):,} verses")
    
    # Clear existing data
    clear_existing_data(supabase_url, service_key)
    
    # Upload in batches
    batch_size = 100
    batches = chunk(all_verses, batch_size)
    total_batches = len(batches)
    
    print(f"Uploading {len(all_verses):,} verses in {total_batches} batches of {batch_size}...")
    
    successful_batches = 0
    failed_batches = 0
    
    for i, batch in enumerate(batches, 1):
        success = upload_batch(supabase_url, service_key, batch, i, total_batches)
        if success:
            successful_batches += 1
        else:
            failed_batches += 1
        
        # Rate limiting
        time.sleep(0.1)
    
    # Summary
    print(f"\n=== Upload Complete ===")
    print(f"Successful batches: {successful_batches}/{total_batches}")
    print(f"Failed batches: {failed_batches}/{total_batches}")
    print(f"Total verses uploaded: {successful_batches * batch_size:,}")
    
    if failed_batches > 0:
        print(f"⚠️  {failed_batches} batches failed - some data may be missing")
        return 1
    else:
        print("✓ All verses uploaded successfully!")
        return 0

if __name__ == "__main__":
    exit(main())
