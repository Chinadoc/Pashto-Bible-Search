#!/usr/bin/env python3
"""
Debug New Testament uploader to see what's happening.
"""

import os
import json
from pathlib import Path

# New Testament books
NEW_TESTAMENT_BOOKS = [
    'matthew', 'mark', 'luke', 'john', 'acts', 'romans', '1-corinthians', 
    '2-corinthians', 'galatians', 'ephesians', 'philippians', 'colossians',
    '1-thessalonians', '2-thessalonians', '1-timothy', '2-timothy', 'titus',
    'philemon', 'hebrews', 'james', '1-peter', '2-peter', '1-john', '2-john',
    '3-john', 'jude', 'revelation'
]

def get_nt_files_to_upload():
    """Get list of New Testament files that need to be uploaded"""
    files_to_upload = []
    audio_dir = Path("yousafzai_audio_files")
    
    # Load existing audio map
    if os.path.exists('yousafzai_google_drive_audio_urls.json'):
        with open('yousafzai_google_drive_audio_urls.json', 'r') as f:
            audio_data = json.load(f)
    else:
        audio_data = {}
    
    print(f"Audio map has {len(audio_data)} entries")
    
    # Find New Testament audio files
    for book_dir in audio_dir.iterdir():
        if not book_dir.is_dir():
            continue
            
        # Check if this is a New Testament book
        if book_dir.name not in NEW_TESTAMENT_BOOKS:
            continue
            
        print(f"Processing NT book: {book_dir.name}")
        
        for chapter_dir in book_dir.iterdir():
            if not chapter_dir.is_dir() or not chapter_dir.name.startswith('chapter-'):
                continue
                
            for audio_file in chapter_dir.glob("yousafzai_*.mp3"):
                filename = audio_file.name
                
                # Check if already uploaded
                if filename in audio_data:
                    file_id = audio_data[filename].get('google_drive_file_id')
                    if file_id and file_id != 'FILE_ID_HERE':
                        continue  # Already uploaded
                
                # Parse filename to extract book, chapter, verse
                try:
                    parts = filename.replace('yousafzai_', '').replace('.mp3', '').split('_')
                    book_slug = parts[0]
                    chapter_verse = parts[1]
                    verse_num = int(parts[2])
                    chapter_num = int(chapter_verse)
                except:
                    print(f"  Failed to parse: {filename}")
                    continue
                
                entry = {
                    'book': book_dir.name,
                    'chapter': chapter_num,
                    'verse': verse_num,
                    'local_path': str(audio_file),
                    'folder_path': f"{book_dir.name}/{chapter_dir.name}/{filename}"
                }
                
                files_to_upload.append((audio_file, filename, entry))
                
                if len(files_to_upload) <= 5:
                    print(f"  Found: {filename}")
    
    print(f"Total NT files to upload: {len(files_to_upload)}")
    return files_to_upload, audio_data

if __name__ == "__main__":
    files_to_upload, audio_data = get_nt_files_to_upload()
    print(f"Ready to upload {len(files_to_upload)} New Testament files")
