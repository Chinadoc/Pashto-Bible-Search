#!/usr/bin/env python3
"""
Download audio files for multiple Old Testament books from Afghan Bibles and split into individual verses.
"""

import asyncio
import hashlib
import json
import logging
import os
import re
import subprocess
import time
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple
import requests
from urllib.parse import urljoin, urlparse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('ot_books_audio_download.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('ot_books_audio_downloader')

@dataclass
class AudioFileInfo:
    """Information about an audio file"""
    book_slug: str
    chapter: int
    url: str
    filename: str
    local_path: str
    content_hash: Optional[str] = None
    last_modified: Optional[str] = None
    file_size: Optional[int] = None
    last_checked: Optional[datetime] = None

@dataclass
class AudioUpdate:
    """Represents a detected audio update"""
    book_slug: str
    chapter: int
    url: str
    change_type: str  # 'new', 'modified', 'deleted'
    old_hash: Optional[str] = None
    new_hash: Optional[str] = None
    metadata: Dict = None

class OTBooksAudioDownloader:
    """Download and process OT audio files from Afghan Bibles for multiple books"""

    BASE_URL = "https://afghanbibles.org"
    AUDIO_BASE_URL = f"{BASE_URL}/pashto-afeastern-audio"

    def __init__(self, audio_dir: str = "ot_audio_files"):
        self.audio_dir = Path(audio_dir)
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'PashtoBibleSearch-OT-Books-Audio-Downloader/1.0 (+https://pashto-bible-search.vercel.app/)'
        })

        # Create audio directory if it doesn't exist
        self.audio_dir.mkdir(exist_ok=True)

    def get_audio_url(self, book_slug: str, chapter: int) -> str:
        """Generate audio URL for a book chapter"""
        return f"{self.AUDIO_BASE_URL}/{book_slug}-{chapter}.mp3"

    def get_local_path(self, book_slug: str, chapter: int) -> Path:
        """Get local file path for audio file"""
        filename = f"{book_slug}_{chapter}.mp3"
        return self.audio_dir / filename

    def get_verse_output_dir(self, book_slug: str, chapter: int) -> Path:
        """Get output directory for individual verse audio files"""
        return self.audio_dir / book_slug / f"chapter-{chapter}-verses"

    def get_verse_filename(self, book_slug: str, chapter: int, verse: int) -> str:
        """Generate filename for individual verse audio file"""
        return f"{book_slug}{chapter:03d}_verse_{verse:03d}.mp3"

    def extract_chapter_info(self, book_slug: str, chapter: int) -> Optional[Dict]:
        """Extract chapter information including jktags and verse count"""
        try:
            chapter_url = f"{self.BASE_URL}/eng/pashto-bible/{book_slug}/{book_slug}-{chapter}?prefdialect=afeastern"
            response = self.session.get(chapter_url, timeout=30)
            response.raise_for_status()
            html = response.text

            # Extract jktags
            jktags_match = re.search(r'id=["\']jktags["\'][^>]*data-tags=["\']([^"\']+)["\']', html)
            jktags = jktags_match.group(1) if jktags_match else None

            # Count verses by counting verse spans
            verse_span_matches = re.findall(r'class=["\']verseno\b[^"\']*["\'][^>]*>', html)
            verse_count = len(verse_span_matches)

            return {
                'jktags': jktags,
                'verse_count': verse_count,
                'html': html
            }

        except Exception as e:
            logger.warning(f"Failed to extract chapter info for {book_slug} {chapter}: {e}")
            return None

    def decode_jktags_verses(self, jktags: str, expected_verses: int) -> List[Dict]:
        """Decode jktags to get verse timing markers"""
        try:
            # Reverse and decode the jktags (same algorithm as yousafzai_audio_splitter.js)
            rev = jktags[::-1]  # Reverse string
            rev = rev.replace('&41', '====').replace('&3', '===').replace('&2', '==').replace('&1', '=')

            # ROT13 decode
            rot = ''.join(
                chr(((ord(c) - (65 if c.isupper() else 97) + 13) % 26) + (65 if c.isupper() else 97))
                if c.isalpha() else c
                for c in rev
            )

            # Base64 decode
            import base64
            decoded = base64.b64decode(rot).decode('utf8')
            tuples = json.loads('[' + decoded + ']')

            # Collect earliest start time per verse number
            verse_starts = {}
            for t in tuples:
                if not isinstance(t, list) or len(t) < 3:
                    continue
                start_time = float(t[0])
                verse_tag = t[2]
                if isinstance(start_time, (int, float)) and isinstance(verse_tag, (int, float)):
                    verse_num = int(verse_tag)
                    if verse_num > 0 and verse_num < 1000:
                        if verse_num not in verse_starts or start_time < verse_starts[verse_num]:
                            verse_starts[verse_num] = start_time

            # Build markers list sorted by verse number
            verses = expected_verses if expected_verses and expected_verses > 0 else max(verse_starts.keys()) if verse_starts else 0
            markers = []
            for verse in range(1, verses + 1):
                if verse in verse_starts:
                    start_time = round(verse_starts[verse] * 100) / 100  # Round to 2 decimal places
                    markers.append({'verse': verse, 'start_time': start_time})

            return markers

        except Exception as e:
            logger.error(f"Failed to decode jktags: {e}")
            return []

    def split_audio_into_verses(self, input_file: Path, markers: List[Dict], output_dir: Path, book_slug: str, chapter: int) -> List[Dict]:
        """Split chapter audio file into individual verse files using ffmpeg"""
        logger.info(f"Splitting {input_file} into {len(markers)} verses...")

        output_dir.mkdir(parents=True, exist_ok=True)

        # Check if ffmpeg is available
        try:
            subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
        except (subprocess.CalledProcessError, FileNotFoundError):
            logger.error("ffmpeg not found. Please install ffmpeg to split audio files.")
            logger.error("On macOS: brew install ffmpeg")
            logger.error("On Ubuntu: sudo apt install ffmpeg")
            return []

        verse_files = []

        for i, marker in enumerate(markers):
            verse = marker['verse']
            start_time = marker['start_time']
            next_marker = markers[i + 1] if i + 1 < len(markers) else None
            duration = (next_marker['start_time'] - start_time) if next_marker else 10.0  # Default 10s for last verse

            filename = self.get_verse_filename(book_slug, chapter, verse)
            output_file = output_dir / filename

            # Skip if already exists and has content
            if output_file.exists() and output_file.stat().st_size > 0:
                logger.info(f"Verse {verse} already exists: {filename}")
                verse_files.append({
                    'filename': filename,
                    'verse': verse,
                    'file_path': str(output_file)
                })
                continue

            try:
                # Add small padding to avoid clipping
                padded_start = max(0, start_time - 0.15)
                padded_duration = duration + 0.4

                cmd = [
                    'ffmpeg', '-y',  # Overwrite output files
                    '-ss', str(padded_start),  # Start time
                    '-i', str(input_file),  # Input file
                    '-t', str(padded_duration),  # Duration
                    '-c:a', 'libmp3lame',  # Audio codec
                    '-ar', '44100',  # Sample rate
                    '-ac', '1',  # Mono
                    '-q:a', '4',  # Quality
                    '-af', 'aresample=async=1:first_pts=0',  # Audio filter
                    str(output_file)
                ]

                logger.info(f"Creating verse {verse} (start: {start_time}s, duration: {duration}s)")
                result = subprocess.run(cmd, capture_output=True, text=True)

                if result.returncode == 0:
                    verse_files.append({
                        'filename': filename,
                        'verse': verse,
                        'file_path': str(output_file)
                    })
                else:
                    logger.error(f"Failed to create verse {verse}: {result.stderr}")

            except Exception as e:
                logger.error(f"Error creating verse {verse}: {e}")

        return verse_files

    def download_audio_file(self, book_slug: str, chapter: int) -> Optional[str]:
        """Download audio file and return its hash"""
        url = self.get_audio_url(book_slug, chapter)
        local_path = self.get_local_path(book_slug, chapter)

        try:
            logger.info(f"Downloading audio: {url}")
            response = self.session.get(url, timeout=60, stream=True)
            response.raise_for_status()

            # Download file
            with open(local_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)

            # Calculate hash
            with open(local_path, 'rb') as f:
                content_hash = hashlib.sha256(f.read()).hexdigest()

            logger.info(f"Downloaded {book_slug} {chapter}: {local_path} ({local_path.stat().st_size} bytes)")
            return content_hash

        except Exception as e:
            logger.error(f"Failed to download {book_slug} {chapter}: {e}")
            # Clean up partial download
            if local_path.exists():
                local_path.unlink()
            return None

    def get_chapter_count(self, book_slug: str) -> int:
        """Get the number of chapters for a book by checking the first chapter page"""
        try:
            first_chapter_url = f"{self.BASE_URL}/eng/pashto-bible/{book_slug}/{book_slug}-1"
            response = self.session.get(first_chapter_url, timeout=30)
            response.raise_for_status()

            # Extract chapter count from navigation
            chapter_options = re.findall(r'<option value=["\']?(\d+)["\']?>', response.text)
            if chapter_options:
                return max(int(ch) for ch in chapter_options)

            # Fallback: try to find other patterns
            chapter_links = re.findall(rf'href="/eng/pashto-bible/{book_slug}/{book_slug}-(\d+)"', response.text)
            if chapter_links:
                return max(int(ch) for ch in chapter_links)

            return 1
        except Exception as e:
            logger.warning(f"Could not determine chapter count for {book_slug}: {e}")
            return 1

    def check_chapter_audio_exists(self, book_slug: str, chapter: int) -> bool:
        """Check if audio file exists for a chapter"""
        url = self.get_audio_url(book_slug, chapter)

        try:
            response = self.session.head(url, timeout=30, allow_redirects=True)
            return response.status_code == 200
        except:
            return False

    async def download_book_chapters(self, book_slug: str, start_chapter: int = 1, end_chapter: int = None):
        """Download all available chapters for a specific book"""
        total_chapters = self.get_chapter_count(book_slug)
        end_chapter = end_chapter or total_chapters

        logger.info(f"Starting {book_slug} audio download: chapters {start_chapter}-{end_chapter} of {total_chapters}")

        downloaded_count = 0
        processed_count = 0

        for chapter in range(start_chapter, min(end_chapter, total_chapters) + 1):
            logger.info(f"\n=== Processing {book_slug.upper()} Chapter {chapter} ===")

            # Check if audio exists
            if not self.check_chapter_audio_exists(book_slug, chapter):
                logger.warning(f"No audio file found for {book_slug} {chapter}")
                continue

            # Download chapter audio file
            content_hash = self.download_audio_file(book_slug, chapter)
            if not content_hash:
                logger.error(f"Failed to download {book_slug} {chapter}")
                continue

            downloaded_count += 1

            # Extract chapter information (jktags, verse count)
            chapter_info = self.extract_chapter_info(book_slug, chapter)

            if chapter_info and chapter_info['jktags']:
                # Decode jktags to get verse timing markers
                markers = self.decode_jktags_verses(chapter_info['jktags'], chapter_info['verse_count'])

                if markers:
                    # Split audio into individual verse files
                    local_path = self.get_local_path(book_slug, chapter)
                    verse_output_dir = self.get_verse_output_dir(book_slug, chapter)
                    verse_files = self.split_audio_into_verses(
                        local_path, markers, verse_output_dir,
                        book_slug, chapter
                    )

                    if verse_files:
                        logger.info(f"✅ Successfully processed {book_slug} Chapter {chapter}: {len(verse_files)} verses")
                        processed_count += 1
                    else:
                        logger.warning(f"❌ Failed to split audio for {book_slug} {chapter}")
                else:
                    logger.warning(f"No timing markers found for {book_slug} {chapter}")
            else:
                logger.warning(f"No jktags found for {book_slug} {chapter}")

            # Respectful delay between chapters
            await asyncio.sleep(1.0)

        logger.info(f"\n🎉 {book_slug} download complete!")
        logger.info(f"Downloaded: {downloaded_count} chapters")
        logger.info(f"Successfully processed: {processed_count} chapters")
        logger.info(f"Output directory: {self.audio_dir / book_slug}")

def load_books_with_audio():
    """Load the list of books that have audio from the results file"""
    try:
        with open('ot_audio_availability_results.json', 'r') as f:
            results = json.load(f)

        books_with_audio = [r['book_slug'] for r in results if r['has_audio']]
        return books_with_audio
    except FileNotFoundError:
        print("❌ Results file not found. Run check_ot_audio_availability.py first.")
        return []
    except Exception as e:
        print(f"❌ Error loading results: {e}")
        return []

def main():
    """Main function"""
    import argparse

    parser = argparse.ArgumentParser(description='Download audio files for OT books from Afghan Bibles')
    parser.add_argument('--books', nargs='*', help='Specific books to download (default: all books with audio)')
    parser.add_argument('--start-chapter', type=int, default=1, help='Starting chapter number (default: 1)')
    parser.add_argument('--end-chapter', type=int, help='Ending chapter number (default: all available)')
    parser.add_argument('--audio-dir', default='ot_audio_files', help='Audio output directory')
    parser.add_argument('--skip-existing', action='store_true', help='Skip books that already have some audio files')

    args = parser.parse_args()

    downloader = OTBooksAudioDownloader(args.audio_dir)

    # Get list of books to process
    if args.books:
        books_to_process = args.books
    else:
        books_to_process = load_books_with_audio()

    if not books_to_process:
        print("❌ No books to process. Check that books have audio available.")
        return

    print(f"📚 Books to process: {', '.join(books_to_process)}")

    # Process each book
    for book_slug in books_to_process:
        # Skip if already exists and --skip-existing is set
        if args.skip_existing and (downloader.audio_dir / book_slug).exists():
            existing_chapters = len(list((downloader.audio_dir / book_slug).glob("chapter-*-verses")))
            if existing_chapters > 0:
                print(f"⏭️  Skipping {book_slug} - already has {existing_chapters} chapters processed")
                continue

        try:
            asyncio.run(downloader.download_book_chapters(
                book_slug,
                args.start_chapter,
                args.end_chapter
            ))
        except KeyboardInterrupt:
            print(f"\n⏹️  Interrupted while processing {book_slug}")
            break
        except Exception as e:
            print(f"❌ Error processing {book_slug}: {e}")
            continue

        # Small delay between books
        time.sleep(2.0)

if __name__ == "__main__":
    main()
