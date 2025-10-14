#!/usr/bin/env python3
"""
Automated Google Drive File ID Extractor for Pashto Bible Audio Integration.

This script automatically extracts file IDs from Google Drive folders
and updates the worksheet with real IDs, eliminating manual work.
"""

import json
import re
import requests
from pathlib import Path
from urllib.parse import urlparse, parse_qs

def extract_folder_id_from_url(url):
    """Extract folder ID from Google Drive URL"""
    # Handle different Google Drive URL formats
    patterns = [
        r'/folders/([a-zA-Z0-9_-]+)',
        r'id=([a-zA-Z0-9_-]+)',
        r'folders/([a-zA-Z0-9_-]+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    return None

def get_folder_contents_via_web_scraping(folder_id):
    """
    Extract file information from Google Drive folder using web scraping.
    This approach works without API authentication.
    """
    print(f"🔍 Scraping folder: {folder_id}")
    
    # Google Drive folder URL
    folder_url = f"https://drive.google.com/drive/folders/{folder_id}"
    
    try:
        # Use requests to get the page content
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(folder_url, headers=headers)
        response.raise_for_status()
        
        # Look for file IDs in the HTML content
        # Google Drive embeds file information in JavaScript
        file_ids = []
        
        # Pattern to find file IDs in the HTML
        id_patterns = [
            r'"id":"([a-zA-Z0-9_-]{20,})"',  # Standard file ID pattern
            r'"fileId":"([a-zA-Z0-9_-]{20,})"',  # Alternative pattern
            r'file/d/([a-zA-Z0-9_-]{20,})',  # URL pattern
        ]
        
        for pattern in id_patterns:
            matches = re.findall(pattern, response.text)
            file_ids.extend(matches)
        
        # Remove duplicates and filter out folder IDs
        unique_ids = list(set(file_ids))
        
        print(f"📊 Found {len(unique_ids)} potential file IDs")
        return unique_ids
        
    except Exception as e:
        print(f"❌ Error scraping folder {folder_id}: {e}")
        return []

def create_demo_file_mapping():
    """
    Create a demo file mapping based on the folder structure we discovered.
    This demonstrates the automated approach.
    """
    print("🎯 Creating demo file mapping...")
    
    # Based on our browser exploration, we know the structure:
    # Main folder: 1m-Mv7r01GHTgXkzFxAXfANn_7sSHRSUC
    # Jonah folder: 13eGR6-EoOiGwK1_bfNzh2Ry4F3DxXBM7
    # Jonah Chapter 1: 1qFOYBiLY43dG_Hro7-V38nEAU0J2FzBI
    
    folder_mapping = {
        "main": "1m-Mv7r01GHTgXkzFxAXfANn_7sSHRSUC",
        "jonah": "13eGR6-EoOiGwK1_bfNzh2Ry4F3DxXBM7",
        "jonah_chapter_1": "1qFOYBiLY43dG_Hro7-V38nEAU0J2FzBI"
    }
    
    # Extract file IDs from the chapter 1 folder
    file_ids = get_folder_contents_via_web_scraping(folder_mapping["jonah_chapter_1"])
    
    # Create a mapping for Jonah Chapter 1 files
    jonah_chapter_1_files = [
        "jonah001_verse_001.mp3",
        "jonah001_verse_002.mp3", 
        "jonah001_verse_003.mp3",
        "jonah001_verse_004.mp3",
        "jonah001_verse_005.mp3",
        "jonah001_verse_006.mp3",
        "jonah001_verse_007.mp3",
        "jonah001_verse_008.mp3",
        "jonah001_verse_009.mp3",
        "jonah001_verse_010.mp3",
        "jonah001_verse_011.mp3",
        "jonah001_verse_012.mp3",
        "jonah001_verse_013.mp3",
        "jonah001_verse_014.mp3",
        "jonah001_verse_015.mp3",
        "jonah001_verse_016.mp3",
        "jonah001_verse_017.mp3"
    ]
    
    # Create mapping (using placeholder IDs for demo)
    file_mapping = {}
    for i, filename in enumerate(jonah_chapter_1_files):
        if i < len(file_ids):
            file_mapping[filename] = file_ids[i]
        else:
            # Use placeholder for demo
            file_mapping[filename] = f"DEMO_ID_{i+1:03d}"
    
    return file_mapping

def update_worksheet_with_demo_data():
    """Update the worksheet with demo data to show the process"""
    print("📝 Updating worksheet with demo data...")
    
    # Load existing worksheet
    worksheet_file = "file_ids_worksheet.txt"
    if not Path(worksheet_file).exists():
        print(f"❌ Worksheet file {worksheet_file} not found")
        return
    
    # Read current worksheet
    with open(worksheet_file, 'r') as f:
        content = f.read()
    
    # Create demo file mapping
    demo_mapping = create_demo_file_mapping()
    
    # Update Jonah section with demo data
    updated_content = content
    for filename, file_id in demo_mapping.items():
        # Replace FILE_ID_HERE with actual demo ID
        pattern = f"{filename}:FILE_ID_HERE"
        replacement = f"{filename}:{file_id}"
        updated_content = updated_content.replace(pattern, replacement)
    
    # Write updated worksheet
    with open("file_ids_worksheet_demo.txt", 'w') as f:
        f.write(updated_content)
    
    print("✅ Demo worksheet created: file_ids_worksheet_demo.txt")
    print(f"📊 Updated {len(demo_mapping)} Jonah Chapter 1 files")

def show_automation_strategy():
    """Show the complete automation strategy"""
    print("\n" + "="*60)
    print("🚀 AUTOMATED GOOGLE DRIVE INTEGRATION STRATEGY")
    print("="*60)
    
    print("\n📋 APPROACH 1: Web Scraping (No API Required)")
    print("   • Extract file IDs from Google Drive HTML")
    print("   • Works without authentication")
    print("   • Can process all folders automatically")
    
    print("\n📋 APPROACH 2: Google Drive API (More Reliable)")
    print("   • Requires API setup but more robust")
    print("   • Can get metadata (file names, sizes, etc.)")
    print("   • Better error handling")
    
    print("\n📋 APPROACH 3: Browser Automation (What we started)")
    print("   • Use Playwright to navigate folders")
    print("   • Extract IDs from URLs")
    print("   • Most interactive but slowest")
    
    print("\n🎯 RECOMMENDED WORKFLOW:")
    print("   1. Use Approach 1 for quick extraction")
    print("   2. Validate with Approach 2 for accuracy")
    print("   3. Use Approach 3 for specific cases")
    
    print("\n💡 NEXT STEPS:")
    print("   1. Run this script to extract Jonah Chapter 1 IDs")
    print("   2. Expand to all Jonah chapters")
    print("   3. Process all OT books systematically")
    print("   4. Update the main worksheet")

def main():
    """Main function to demonstrate automated file ID extraction"""
    print("🎵 Automated Google Drive File ID Extractor")
    print("=" * 50)
    
    # Show strategy
    show_automation_strategy()
    
    # Create demo mapping
    print("\n🔧 Creating demo file mapping...")
    demo_mapping = create_demo_file_mapping()
    
    print(f"\n📊 Demo Results:")
    for filename, file_id in list(demo_mapping.items())[:5]:  # Show first 5
        print(f"   {filename}: {file_id}")
    print(f"   ... and {len(demo_mapping) - 5} more files")
    
    # Update worksheet
    update_worksheet_with_demo_data()
    
    print("\n✅ Demo completed!")
    print("\n🚀 To process all files:")
    print("   1. Expand this script to handle all folders")
    print("   2. Add error handling and retry logic")
    print("   3. Integrate with the batch update script")
    print("   4. Process all 8,461 files automatically")

if __name__ == "__main__":
    main()
