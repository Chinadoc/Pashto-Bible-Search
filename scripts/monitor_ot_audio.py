#!/usr/bin/env python3
"""
OT Audio Monitoring Script for Afghan Bibles Integration

This script monitors the Old Testament audio files on afghanbibles.org,
detects changes, downloads new/updated files, and triggers rebuilds.

Integration with existing system:
- Uses external_monitoring_config.json for configuration
- Updates audio_file_map.json with new mappings
- Triggers external-updates API endpoint
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
        logging.FileHandler('ot_audio_monitor.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('ot_audio_monitor')

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

class OTAudioMonitor:
    """Monitor Old Testament audio files from Afghan Bibles"""

    BASE_URL = "https://afghanbibles.org"
    AUDIO_BASE_URL = f"{BASE_URL}/pashto-afeastern-audio"

    # Ordered list of Old Testament book slugs (same as scrape_ot_afghan_bibles.py)
    OT_BOOK_SLUGS = [
        "genesis", "exodus", "leviticus", "numbers", "deuteronomy",
        "joshua", "judges", "ruth", "1-samuel", "2-samuel",
        "1-kings", "2-kings", "1-chronicles", "2-chronicles",
        "ezra", "nehemiah", "esther", "job", "psalms", "proverbs",
        "ecclesiastes", "song-of-songs", "isaiah", "jeremiah",
        "lamentations", "ezekiel", "daniel", "hosea", "joel",
        "amos", "obadiah", "jonah", "micah", "nahum", "habakkuk",
        "zephaniah", "haggai", "zechariah", "malachi"
    ]

    def __init__(self, cache_file: str = "ot_audio_cache.json", audio_dir: str = "ot_audio_files"):
        self.cache_file = Path(cache_file)
        self.audio_dir = Path(audio_dir)
        self.audio_cache: Dict[str, AudioFileInfo] = {}
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'PashtoBibleSearch-OT-Audio-Monitor/1.0 (+https://pashto-bible-search.vercel.app/)'
        })

        # Create audio directory if it doesn't exist
        self.audio_dir.mkdir(exist_ok=True)
        self.load_cache()

    def load_cache(self):
        """Load audio file cache from disk"""
        if self.cache_file.exists():
            try:
                with open(self.cache_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.audio_cache = {}
                    for key, info_data in data.items():
                        # Convert string timestamps back to datetime
                        if 'last_checked' in info_data and info_data['last_checked']:
                            info_data['last_checked'] = datetime.fromisoformat(info_data['last_checked'])
                        self.audio_cache[key] = AudioFileInfo(**info_data)
                logger.info(f"Loaded {len(self.audio_cache)} cached audio files")
            except Exception as e:
                logger.error(f"Failed to load cache: {e}")
                self.audio_cache = {}

    def save_cache(self):
        """Save audio file cache to disk"""
        try:
            cache_data = {}
            for key, info in self.audio_cache.items():
                info_dict = {
                    'book_slug': info.book_slug,
                    'chapter': info.chapter,
                    'url': info.url,
                    'filename': info.filename,
                    'local_path': str(info.local_path),
                    'content_hash': info.content_hash,
                    'last_modified': info.last_modified,
                    'file_size': info.file_size,
                    'last_checked': info.last_checked.isoformat() if info.last_checked else None
                }
                cache_data[key] = info_dict

            with open(self.cache_file, 'w', encoding='utf-8') as f:
                json.dump(cache_data, f, indent=2, ensure_ascii=False)
            logger.info(f"Saved {len(self.audio_cache)} audio files to cache")
        except Exception as e:
            logger.error(f"Failed to save cache: {e}")

    def get_audio_url(self, book_slug: str, chapter: int) -> str:
        """Generate audio URL for a book chapter"""
        return f"{self.AUDIO_BASE_URL}/{book_slug}-{chapter}.mp3"

    def get_cache_key(self, book_slug: str, chapter: int) -> str:
        """Generate cache key for a book chapter"""
        return f"{book_slug}:{chapter}"

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

    async def check_audio_file(self, book_slug: str, chapter: int) -> Optional[AudioUpdate]:
        """Check if an audio file exists and has changed"""
        url = self.get_audio_url(book_slug, chapter)
        cache_key = self.get_cache_key(book_slug, chapter)
        local_path = self.get_local_path(book_slug, chapter)

        try:
            # Check if file exists on server (HEAD request)
            response = self.session.head(url, timeout=30, allow_redirects=True)
            response.raise_for_status()

            # Get file metadata
            last_modified = response.headers.get('Last-Modified')
            content_length = response.headers.get('Content-Length')
            file_size = int(content_length) if content_length else None

            # Check if we have this file cached
            cached_info = self.audio_cache.get(cache_key)

            if not cached_info:
                # New file detected
                logger.info(f"New audio file detected: {book_slug} {chapter}")
                return AudioUpdate(
                    book_slug=book_slug,
                    chapter=chapter,
                    url=url,
                    change_type='new',
                    metadata={
                        'last_modified': last_modified,
                        'file_size': file_size,
                        'local_path': str(local_path)
                    }
                )

            # Check if file has been modified
            if (last_modified != cached_info.last_modified or
                file_size != cached_info.file_size):
                logger.info(f"Modified audio file detected: {book_slug} {chapter}")
                return AudioUpdate(
                    book_slug=book_slug,
                    chapter=chapter,
                    url=url,
                    change_type='modified',
                    old_hash=cached_info.content_hash,
                    metadata={
                        'last_modified': last_modified,
                        'file_size': file_size,
                        'local_path': str(local_path)
                    }
                )

            # File unchanged, update last checked time
            cached_info.last_checked = datetime.now()
            return None

        except requests.exceptions.RequestException as e:
            # Check if file was deleted (404) vs other error
            if hasattr(e, 'response') and e.response and e.response.status_code == 404:
                if cache_key in self.audio_cache:
                    logger.info(f"Deleted audio file detected: {book_slug} {chapter}")
                    return AudioUpdate(
                        book_slug=book_slug,
                        chapter=chapter,
                        url=url,
                        change_type='deleted',
                        old_hash=self.audio_cache[cache_key].content_hash,
                        metadata={'local_path': str(local_path)}
                    )
            else:
                logger.warning(f"Error checking {book_slug} {chapter}: {e}")
            return None

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
            chapter_options = re.findall(r'<option value="(\d+)">\1</option>', response.text)
            if chapter_options:
                return max(int(ch) for ch in chapter_options)
            return 1
        except Exception as e:
            logger.warning(f"Could not determine chapter count for {book_slug}: {e}")
            return 1

    async def monitor_book(self, book_slug: str) -> List[AudioUpdate]:
        """Monitor all chapters of a book for audio changes"""
        updates = []

        try:
            # Get chapter count for this book
            chapter_count = self.get_chapter_count(book_slug)
            logger.info(f"Monitoring {book_slug}: {chapter_count} chapters")

            # Check each chapter
            for chapter in range(1, chapter_count + 1):
                update = await self.check_audio_file(book_slug, chapter)
                if update:
                    updates.append(update)

                # Small delay to be respectful to the server
                await asyncio.sleep(0.5)

        except Exception as e:
            logger.error(f"Error monitoring {book_slug}: {e}")

        return updates

    async def monitor_all_books(self, books_to_monitor: Optional[List[str]] = None) -> List[AudioUpdate]:
        """Monitor all OT books for audio changes"""
        books = books_to_monitor or self.OT_BOOK_SLUGS
        all_updates = []

        logger.info(f"Starting OT audio monitoring for {len(books)} books")

        for book_slug in books:
            updates = await self.monitor_book(book_slug)
            all_updates.extend(updates)

            # Update progress
            logger.info(f"Completed {book_slug}: {len(updates)} updates found")

        logger.info(f"OT audio monitoring complete: {len(all_updates)} total updates")
        return all_updates

    def process_updates(self, updates: List[AudioUpdate]) -> List[AudioUpdate]:
        """Process detected updates (download files, split into verses, update cache)"""
        processed_updates = []

        for update in updates:
            cache_key = self.get_cache_key(update.book_slug, update.chapter)

            if update.change_type in ['new', 'modified']:
                # Download the chapter audio file
                content_hash = self.download_audio_file(update.book_slug, update.chapter)

                if content_hash:
                    local_path = self.get_local_path(update.book_slug, update.chapter)

                    # Extract chapter information (jktags, verse count)
                    chapter_info = self.extract_chapter_info(update.book_slug, update.chapter)

                    if chapter_info and chapter_info['jktags']:
                        # Decode jktags to get verse timing markers
                        markers = self.decode_jktags_verses(chapter_info['jktags'], chapter_info['verse_count'])

                        if markers:
                            # Split audio into individual verse files
                            verse_output_dir = self.get_verse_output_dir(update.book_slug, update.chapter)
                            verse_files = self.split_audio_into_verses(
                                local_path, markers, verse_output_dir,
                                update.book_slug, update.chapter
                            )

                            if verse_files:
                                logger.info(f"Successfully split {update.book_slug} {update.chapter} into {len(verse_files)} verses")

                                # Update cache with chapter info
                                file_size = local_path.stat().st_size if local_path.exists() else None
                                audio_info = AudioFileInfo(
                                    book_slug=update.book_slug,
                                    chapter=update.chapter,
                                    url=update.url,
                                    filename=f"{update.book_slug}_{update.chapter}.mp3",
                                    local_path=str(local_path),
                                    content_hash=content_hash,
                                    last_modified=update.metadata.get('last_modified'),
                                    file_size=file_size,
                                    last_checked=datetime.now()
                                )
                                self.audio_cache[cache_key] = audio_info

                                # Create individual verse updates
                                verse_updates = []
                                for verse_file in verse_files:
                                    verse_update = AudioUpdate(
                                        book_slug=update.book_slug,
                                        chapter=update.chapter,
                                        url=update.url,
                                        change_type='new',
                                        metadata={
                                            'verse': verse_file['verse'],
                                            'filename': verse_file['filename'],
                                            'file_path': verse_file['file_path'],
                                            'chapter_hash': content_hash
                                        }
                                    )
                                    verse_updates.append(verse_update)

                                processed_updates.extend(verse_updates)
                                update.new_hash = content_hash
                                update.metadata['verses_created'] = len(verse_files)
                            else:
                                logger.warning(f"Failed to split audio for {update.book_slug} {update.chapter}")
                        else:
                            logger.warning(f"No timing markers found for {update.book_slug} {update.chapter}")
                    else:
                        logger.warning(f"No jktags found for {update.book_slug} {update.chapter}")

            elif update.change_type == 'deleted':
                # Remove from cache and delete local files
                if cache_key in self.audio_cache:
                    # Delete chapter file
                    local_path = Path(self.audio_cache[cache_key].local_path)
                    if local_path.exists():
                        local_path.unlink()
                        logger.info(f"Deleted chapter audio file: {local_path}")

                    # Delete verse files directory
                    verse_dir = self.get_verse_output_dir(update.book_slug, update.chapter)
                    if verse_dir.exists():
                        import shutil
                        shutil.rmtree(verse_dir)
                        logger.info(f"Deleted verse audio directory: {verse_dir}")

                    del self.audio_cache[cache_key]
                processed_updates.append(update)

        # Save updated cache
        self.save_cache()

        return processed_updates

async def main():
    """Main monitoring function"""
    import argparse

    parser = argparse.ArgumentParser(description='Monitor OT audio files from Afghan Bibles')
    parser.add_argument('--books', nargs='*', help='Specific books to monitor (default: all OT books)')
    parser.add_argument('--download', action='store_true', help='Download new/modified files')
    parser.add_argument('--webhook', action='store_true', help='Send updates to webhook endpoint')

    args = parser.parse_args()

    # Initialize monitor
    monitor = OTAudioMonitor()

    try:
        # Monitor for updates
        updates = await monitor.monitor_all_books(args.books)

        if updates:
            logger.info(f"Found {len(updates)} audio updates")

            if args.download:
                # Process updates (download files)
                processed_updates = monitor.process_updates(updates)
                logger.info(f"Processed {len(processed_updates)} audio updates")

                if args.webhook and processed_updates:
                    # Send to webhook (implementation would go here)
                    logger.info("Sending updates to webhook endpoint")
                    await send_to_webhook(processed_updates)
            else:
                # Just report updates
                for update in updates:
                    logger.info(f"Update: {update.book_slug} {update.chapter} - {update.change_type}")
        else:
            logger.info("No audio updates detected")

    except Exception as e:
        logger.error(f"Monitoring failed: {e}")
        return 1

    return 0

async def send_to_webhook(updates: List[AudioUpdate]):
    """Send updates to the external updates webhook"""
    # This would integrate with the existing webhook system
    # For now, just log the updates
    webhook_payload = {
        'timestamp': datetime.now().isoformat(),
        'source': 'ot_audio_monitor',
        'updates': [
            {
                'url': update.url,
                'content_type': 'audio',
                'change_type': update.change_type,
                'metadata': {
                    'book_slug': update.book_slug,
                    'chapter': update.chapter,
                    'old_hash': update.old_hash,
                    'new_hash': update.new_hash,
                    **(update.metadata or {})
                }
            }
            for update in updates
        ]
    }

    logger.info(f"Webhook payload: {json.dumps(webhook_payload, indent=2)}")

    # TODO: Actually send to webhook endpoint
    # webhook_url = os.getenv('EXTERNAL_UPDATE_WEBHOOK_URL')
    # if webhook_url:
    #     async with aiohttp.ClientSession() as session:
    #         async with session.post(webhook_url, json=webhook_payload) as response:
    #             logger.info(f"Webhook response: {response.status}")

if __name__ == "__main__":
    exit(asyncio.run(main()))
