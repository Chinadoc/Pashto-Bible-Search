#!/usr/bin/env python3
"""
Generate initial Yousafzai Google Drive audio URLs JSON file structure.
This creates the file with placeholder file IDs that can be updated by the upload scripts.
"""

import json
import os
from pathlib import Path

def scan_yousafzai_files():
    """Scan for Yousafzai audio files and create initial map"""
    audio_dir = Path("yousafzai_audio_files")
    
    if not audio_dir.exists():
        print(f"❌ Yousafzai audio directory not found: {audio_dir}")
        return {}
    
    audio_map = {}
    
    # Scan for verse files
    for book_dir in audio_dir.iterdir():
        if not book_dir.is_dir():
            continue
            
        book_name = book_dir.name
        print(f"📖 Scanning {book_name}...")
        
        for chapter_dir in book_dir.iterdir():
            if not chapter_dir.is_dir() or not chapter_dir.name.startswith('chapter-'):
                continue
                
            chapter_num = int(chapter_dir.name.split('-')[1].split('-')[0])
            
            for audio_file in chapter_dir.glob("yousafzai_*.mp3"):
                filename = audio_file.name
                
                # Parse filename: yousafzai_genesis001_verse_001.mp3
                parts = filename.replace('yousafzai_', '').replace('.mp3', '').split('_')
                if len(parts) >= 3 and parts[1] == 'verse':
                    verse_num = int(parts[2])
                    
                    audio_map[filename] = {
                        'book': book_name,
                        'chapter': chapter_num,
                        'verse': verse_num,
                        'google_drive_file_id': 'FILE_ID_HERE',
                        'google_drive_url': 'https://drive.google.com/uc?id=FILE_ID_HERE&export=download',
                        'local_path': str(audio_file),
                        'folder_path': f"{book_name}/{chapter_dir.name}/{filename}"
                    }
    
    return audio_map

def main():
    """Main function to generate Yousafzai audio map"""
    print("🚀 Generating Yousafzai Google Drive audio URLs map...")
    
    # Scan for files
    audio_map = scan_yousafzai_files()
    
    if not audio_map:
        print("❌ No Yousafzai audio files found!")
        return
    
    # Save to file
    output_file = 'yousafzai_google_drive_audio_urls.json'
    with open(output_file, 'w') as f:
        json.dump(audio_map, f, indent=2)
    
    print(f"✅ Generated {output_file} with {len(audio_map)} files")
    print(f"📁 Ready for upload with batch_upload_yousafzai.py")

if __name__ == "__main__":
    main()
