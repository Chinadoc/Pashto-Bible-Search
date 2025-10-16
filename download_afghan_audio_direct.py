#!/usr/bin/env python3
"""
Download Afghan 2023 NT audio files using direct URLs (no authentication needed).
This script downloads files that are already accessible via public URLs.
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

# Supabase public storage URL
SUPABASE_PUBLIC_URL = "https://nkombdutnjvaasxrbmdn.supabase.co/storage/v1/object/public/audio"

# NT Books that have Afghan 2023 audio (based on our analysis)
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

    def get_file_list_from_storage(self):
        """Try to get file list from Supabase storage API"""
        try:
            # Try using the REST API endpoint
            list_url = "https://nkombdutnjvaasxrbmdn.supabase.co/rest/v1/audio_files?select=filename"
            
            # Use a simple user agent
            req = urllib.request.Request(list_url)
            req.add_header('User-Agent', 'Mozilla/5.0 (compatible; PashtoBibleDownloader/1.0)')
            
            with urllib.request.urlopen(req) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode())
                    files = [item['filename'] for item in data if item.get('filename', '').endswith('.mp3')]
                    logger.info(f"📋 Found {len(files)} MP3 files via REST API")
                    return files
                else:
                    logger.warning(f"❌ REST API returned status {response.status}")
                    return []
        except Exception as e:
            logger.warning(f"❌ REST API failed: {e}")
            return []

    def test_sample_files(self):
        """Test a few sample files to see if they're accessible"""
        sample_files = [
            '1-john-1.mp3',
            'acts1_verse_1.mp3', 
            '1corinthians1_verse_1.mp3',
            'matthew1_verse_1.mp3'  # This might not exist
        ]
        
        accessible_files = []
        for filename in sample_files:
            url = f"{SUPABASE_PUBLIC_URL}/{filename}"
            try:
                req = urllib.request.Request(url)
                req.add_header('User-Agent', 'Mozilla/5.0 (compatible; PashtoBibleDownloader/1.0)')
                
                with urllib.request.urlopen(req) as response:
                    if response.status == 200:
                        accessible_files.append(filename)
                        logger.info(f"✅ Accessible: {filename}")
                    else:
                        logger.warning(f"❌ Not accessible ({response.status}): {filename}")
            except Exception as e:
                logger.warning(f"❌ Error testing {filename}: {e}")
        
        return accessible_files

    def download_file(self, filename, output_path):
        """Download a single file from Supabase public storage"""
        url = f"{SUPABASE_PUBLIC_URL}/{filename}"
        
        try:
            req = urllib.request.Request(url)
            req.add_header('User-Agent', 'Mozilla/5.0 (compatible; PashtoBibleDownloader/1.0)')
            
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
        """Download all accessible Afghan 2023 NT audio files"""
        logger.info("🚀 Starting Afghan 2023 audio download...")
        
        # Test sample files first
        accessible_files = self.test_sample_files()
        logger.info(f"📊 Found {len(accessible_files)} accessible sample files")
        
        if not accessible_files:
            logger.error("❌ No accessible files found")
            return
        
        # Get all files from storage (this might not work, but let's try)
        all_files = self.get_file_list_from_storage()
        
        # If we can't get the full list, work with what we know
        if not all_files:
            logger.warning("⚠️ Could not get full file list, working with known patterns")
            # Generate likely filenames based on the patterns we observed
            all_files = self.generate_likely_filenames()
        
        # Filter for Afghan NT files
        afghan_files = []
        for filename in all_files:
            book = self.categorize_file(filename)
            if book:
                afghan_files.append((filename, book))
        
        logger.info(f"📊 Found {len(afghan_files)} potential Afghan 2023 NT audio files")
        
        # Test each file to see if it's actually accessible
        accessible_afghan_files = []
        for filename, book in afghan_files:
            output_path = self.book_dirs[book] / filename
            if self.download_file(filename, output_path):
                accessible_afghan_files.append((filename, book))
        
        logger.info(f"🎉 Download complete! {len(accessible_afghan_files)} accessible files downloaded")
        
        # Create upload instructions
        self.create_upload_instructions(dict(accessible_afghan_files))

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

    def generate_likely_filenames(self):
        """Generate likely filenames based on observed patterns"""
        likely_files = []
        
        # Based on our analysis, these books have audio files
        book_patterns = {
            'John': ['1-john-{}.mp3', 'john{}_verse_{}.mp3'],
            'Acts': ['acts{}_verse_{}.mp3'],
            '1 Corinthians': ['1corinthians{}_verse_{}.mp3'],
            '2 Corinthians': ['2corinthians{}_verse_{}.mp3'],
            '1 Thessalonians': ['1-thessalonians-{}.mp3', '1thessalonians{}_verse_{}.mp3'],
            '2 Thessalonians': ['2-thessalonians-{}.mp3', '2thessalonians{}_verse_{}.mp3'],
            '1 Timothy': ['1-timothy-{}.mp3', '1timothy{}_verse_{}.mp3'],
            '2 Timothy': ['2-timothy-{}.mp3', '2timothy{}_verse_{}.mp3'],
            '1 Peter': ['1-peter-{}.mp3', '1peter{}_verse_{}.mp3'],
            '2 Peter': ['2-peter-{}.mp3', '2peter{}_verse_{}.mp3'],
            '1 John': ['1-john-{}.mp3', '1john{}_verse_{}.mp3'],
            '2 John': ['2-john-{}.mp3', '2john{}_verse_{}.mp3'],
            '3 John': ['3-john-{}.mp3', '3john{}_verse_{}.mp3']
        }
        
        for book, patterns in book_patterns.items():
            for pattern in patterns:
                if 'chapter' in pattern or 'verse' in pattern:
                    # For verse files, generate reasonable ranges
                    if 'verse' in pattern:
                        # Estimate reasonable verse counts per chapter
                        verse_counts = {
                            'John': 50, 'Acts': 47, '1 Corinthians': 31, '2 Corinthians': 21,
                            '1 Thessalonians': 10, '2 Thessalonians': 17, '1 Timothy': 20, '2 Timothy': 26,
                            '1 Peter': 25, '2 Peter': 21, '1 John': 10, '2 John': 13, '3 John': 15
                        }
                        chapters = verse_counts.get(book, 20)
                        
                        for chapter in range(1, chapters + 1):
                            for verse in range(1, 31):  # Assume max 30 verses per chapter
                                filename = pattern.format(chapter, verse)
                                likely_files.append(filename)
                    else:
                        # For chapter files
                        chapters = 21 if book == 'John' else 28 if book == 'Acts' else 16 if 'Corinthians' in book else 5
                        for chapter in range(1, chapters + 1):
                            filename = pattern.format(chapter)
                            likely_files.append(filename)
                else:
                    # Simple pattern
                    chapters = 21 if book == 'John' else 28 if book == 'Acts' else 16 if 'Corinthians' in book else 5
                    for chapter in range(1, chapters + 1):
                        filename = pattern.format(chapter)
                        likely_files.append(filename)
        
        return likely_files

    def create_upload_instructions(self, files_by_book):
        """Create instructions for manual Google Drive upload"""
        instructions_file = self.output_dir / "UPLOAD_INSTRUCTIONS.txt"
        
        # Group files by book for instructions
        book_files = {}
        for filename, book in files_by_book:
            if book not in book_files:
                book_files[book] = []
            book_files[book].append(filename)
        
        with open(instructions_file, 'w') as f:
            f.write("AFGHAN 2023 AUDIO UPLOAD INSTRUCTIONS\n")
            f.write("=" * 50 + "\n\n")
            
            f.write("📁 GOOGLE DRIVE SETUP:\n")
            f.write("1. Create a folder named 'Afghan 2023 Audio' in your Google Drive\n")
            f.write("2. Create subfolders for each book:\n")
            
            for book in sorted(book_files.keys()):
                file_count = len(book_files[book])
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
