#!/usr/bin/env python3
"""
Simple script to download Afghan 2023 NT audio files from Supabase storage.
Uses only standard library modules for compatibility.
"""

import json
import os
import urllib.request
import urllib.error
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Supabase configuration
SUPABASE_URL = "https://nkombdutnjvaasxrbmdn.supabase.co"
SUPABASE_STORAGE_URL = f"{SUPABASE_URL}/storage/v1/object/public/audio"

# NT Books that have Afghan 2023 audio
AFGHAN_NT_BOOKS = [
    'John', 'Acts', '1 Corinthians', '2 Corinthians', 
    '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy',
    '1 Peter', '2 Peter', '1 John', '2 John', '3 John'
]

class AfghanAudioDownloader:
    def __init__(self):
        self.output_dir = Path('/tmp/afghan_2023_audio')
        self.output_dir.mkdir(exist_ok=True)
        
        # Create subdirectories for each book
        self.book_dirs = {}
        for book in AFGHAN_NT_BOOKS:
            book_dir = self.output_dir / book.replace(' ', '_')
            book_dir.mkdir(exist_ok=True)
            self.book_dirs[book] = book_dir
        
        logger.info(f"📁 Output directory: {self.output_dir}")

    def get_supabase_headers(self):
        """Get authorization headers for Supabase"""
        anon_key = os.environ.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')
        if not anon_key:
            logger.error("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable not set")
            return None
        
        return {
            'Authorization': f'Bearer {anon_key}',
            'apikey': anon_key
        }

    def get_file_list(self):
        """Get list of all files from Supabase storage"""
        try:
            list_url = f"{SUPABASE_URL}/storage/v1/object/list/audio"
            headers = self.get_supabase_headers()
            
            if not headers:
                return []
            
            req = urllib.request.Request(list_url, headers=headers)
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())
                all_files = [f['name'] for f in data if f['name'].endsWith('.mp3')]
                logger.info(f"📋 Found {len(all_files)} MP3 files in storage")
                return all_files
        except Exception as e:
            logger.error(f"❌ Error getting file list: {e}")
            return []

    def categorize_file(self, filename):
        """Categorize a file by NT book"""
        filename_lower = filename.lower()
        for book in AFGHAN_NT_BOOKS:
            book_patterns = [
                book.lower(),
                book.lower().replace(' ', ''),
                book.lower().replace(' ', '-'),
                book.lower().replace(' ', '_')
            ]
            
            if any(pattern in filename_lower for pattern in book_patterns):
                return book
        
        return None

    def download_file(self, filename, output_path):
        """Download a single file from Supabase storage"""
        url = f"{SUPABASE_STORAGE_URL}/{filename}"
        
        try:
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req) as response:
                with open(output_path, 'wb') as f:
                    f.write(response.read())
            
            logger.info(f"✅ Downloaded: {filename}")
            return True
        except urllib.error.HTTPError as e:
            if e.code == 404:
                logger.warning(f"❌ File not found: {filename}")
            else:
                logger.error(f"❌ HTTP error downloading {filename}: {e}")
            return False
        except Exception as e:
            logger.error(f"❌ Error downloading {filename}: {e}")
            return False

    def download_afghan_audio(self):
        """Download all Afghan 2023 NT audio files"""
        logger.info("🚀 Starting Afghan 2023 audio download...")
        
        # Get file list
        all_files = self.get_file_list()
        
        if not all_files:
            logger.error("❌ No files found to download")
            return
        
        # Filter for Afghan NT files
        afghan_files = []
        for filename in all_files:
            book = self.categorize_file(filename)
            if book:
                afghan_files.append((filename, book))
        
        logger.info(f"📊 Found {len(afghan_files)} Afghan 2023 NT audio files")
        
        # Group files by book
        files_by_book = {}
        for filename, book in afghan_files:
            if book not in files_by_book:
                files_by_book[book] = []
            files_by_book[book].append(filename)
        
        # Download files organized by book
        total_downloaded = 0
        
        for book, files in files_by_book.items():
            logger.info(f"📖 Processing {book}: {len(files)} files")
            
            book_dir = self.book_dirs[book]
            
            for filename in files:
                output_path = book_dir / filename
                success = self.download_file(filename, output_path)
                
                if success:
                    total_downloaded += 1
        
        logger.info(f"🎉 Download complete! {total_downloaded} files downloaded to {self.output_dir}")
        
        # Create upload instructions
        self.create_upload_instructions(files_by_book)

    def create_upload_instructions(self, files_by_book):
        """Create instructions for manual Google Drive upload"""
        instructions_file = self.output_dir / "UPLOAD_INSTRUCTIONS.txt"
        
        with open(instructions_file, 'w') as f:
            f.write("AFGHAN 2023 AUDIO UPLOAD INSTRUCTIONS\n")
            f.write("=" * 50 + "\n\n")
            
            f.write("📁 GOOGLE DRIVE SETUP:\n")
            f.write("1. Create a folder named 'Afghan 2023 Audio' in your Google Drive\n")
            f.write("2. Create subfolders for each book:\n")
            
            for book in sorted(files_by_book.keys()):
                file_count = len(files_by_book[book])
                f.write(f"   - {book} ({file_count} files)\n")
            
            f.write("\n📤 UPLOAD PROCESS:\n")
            f.write("1. Go to each book folder in the output directory\n")
            f.write("2. Select all .mp3 files in that folder\n")
            f.write("3. Upload to the corresponding Google Drive subfolder\n")
            f.write("4. Set sharing permissions to 'Anyone with link can view'\n")
            
            f.write("\n🎯 FINAL RESULT:\n")
            f.write("All Afghan 2023 NT audio files will be available via Google Drive\n")
            f.write("and accessible through the Pashto Bible Search interface.\n")
        
        logger.info(f"📋 Upload instructions created: {instructions_file}")

def main():
    downloader = AfghanAudioDownloader()
    downloader.download_afghan_audio()

if __name__ == "__main__":
    main()
