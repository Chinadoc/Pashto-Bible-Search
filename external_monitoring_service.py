"""
External Content Monitoring Service for Afghan Bibles Integration

This service monitors the Afghan Bibles website for changes in text and audio content,
detects updates, and triggers synchronization workflows.

Integration Points:
- n8n workflows for automated monitoring
- Webhook endpoints for real-time updates
- Change detection and content synchronization
"""

import asyncio
import hashlib
import json
import logging
import os
import re
import time
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple
import requests
from urllib.parse import urljoin, urlparse
import aiohttp
import aiofiles

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('external_monitoring.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('external_monitor')

@dataclass
class ContentHash:
    """Represents a content hash for change detection"""
    url: str
    content_hash: str
    last_modified: Optional[str]
    content_type: str  # 'text', 'audio', 'metadata'
    timestamp: datetime

@dataclass
class ContentUpdate:
    """Represents a detected content update"""
    url: str
    content_type: str
    change_type: str  # 'new', 'modified', 'deleted'
    old_hash: Optional[str]
    new_hash: Optional[str]
    metadata: Dict

class AfghanBiblesMonitor:
    """Monitor Afghan Bibles website for content changes"""

    BASE_URL = "https://afghanbibles.org"
    API_BASE = f"{BASE_URL}/eng/pashto-bible"

    def __init__(self, cache_file: str = "external_content_cache.json"):
        self.cache_file = Path(cache_file)
        self.content_cache: Dict[str, ContentHash] = {}
        self.session: Optional[aiohttp.ClientSession] = None
        self.load_cache()

    def load_cache(self):
        """Load content hash cache from file"""
        if self.cache_file.exists():
            try:
                with open(self.cache_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.content_cache = {
                        url: ContentHash(**hash_data)
                        for url, hash_data in data.items()
                    }
                logger.info(f"Loaded {len(self.content_cache)} cached content hashes")
            except Exception as e:
                logger.error(f"Failed to load cache: {e}")
                self.content_cache = {}

    def save_cache(self):
        """Save content hash cache to file"""
        try:
            # Convert ContentHash objects to dicts
            cache_data = {
                url: asdict(hash_obj)
                for url, hash_obj in self.content_cache.items()
            }
            with open(self.cache_file, 'w', encoding='utf-8') as f:
                json.dump(cache_data, f, indent=2, default=str)
            logger.info(f"Saved {len(self.content_cache)} content hashes to cache")
        except Exception as e:
            logger.error(f"Failed to save cache: {e}")

    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=60),
            headers={
                'User-Agent': 'PashtoBibleSearch-Monitor/1.0 (+https://pashto-bible-search.vercel.app/)'
            }
        )
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    def _get_content_hash(self, content: bytes, content_type: str) -> str:
        """Generate hash for content"""
        if content_type == 'text':
            # Normalize text content for consistent hashing
            text = content.decode('utf-8', errors='ignore')
            normalized = re.sub(r'\s+', ' ', text.strip())
            content_bytes = normalized.encode('utf-8')
        else:
            content_bytes = content

        return hashlib.sha256(content_bytes).hexdigest()

    async def fetch_url(self, url: str) -> Tuple[bytes, Optional[str]]:
        """Fetch URL content and return bytes + last-modified header"""
        if not self.session:
            raise RuntimeError("Monitor not properly initialized")

        try:
            async with self.session.get(url) as response:
                response.raise_for_status()
                content = await response.read()
                last_modified = response.headers.get('Last-Modified')
                return content, last_modified
        except Exception as e:
            logger.error(f"Failed to fetch {url}: {e}")
            raise

    async def check_audio_file(self, book_slug: str, chapter: int) -> Optional[ContentUpdate]:
        """Check if an OT audio file exists and has changed"""
        audio_url = f"{self.BASE_URL}/pashto-afeastern-audio/{book_slug}-{chapter}.mp3"
        cache_key = f"audio_{book_slug}_{chapter}"

        try:
            # Check if audio file exists (HEAD request)
            async with self.session.head(audio_url) as response:
                if response.status != 200:
                    # Audio file doesn't exist
                    if cache_key in self.content_cache:
                        # File was deleted
                        cached = self.content_cache[cache_key]
                        return ContentUpdate(
                            url=audio_url,
                            content_type='audio',
                            change_type='deleted',
                            old_hash=cached.content_hash,
                            metadata={
                                'book_slug': book_slug,
                                'chapter': chapter
                            }
                        )
                    return None

                # Get file metadata
                last_modified = response.headers.get('Last-Modified')
                content_length = response.headers.get('Content-Length')

                # Check cache
                cached = self.content_cache.get(cache_key)

                if not cached:
                    # New audio file
                    return ContentUpdate(
                        url=audio_url,
                        content_type='audio',
                        change_type='new',
                        metadata={
                            'book_slug': book_slug,
                            'chapter': chapter,
                            'last_modified': last_modified,
                            'content_length': content_length
                        }
                    )

                # Check if modified
                if last_modified != cached.last_modified or content_length != cached.metadata.get('content_length'):
                    return ContentUpdate(
                        url=audio_url,
                        content_type='audio',
                        change_type='modified',
                        old_hash=cached.content_hash,
                        metadata={
                            'book_slug': book_slug,
                            'chapter': chapter,
                            'last_modified': last_modified,
                            'content_length': content_length
                        }
                    )

        except Exception as e:
            logger.warning(f"Error checking audio {book_slug} {chapter}: {e}")

        return None

    def extract_book_chapters_from_html(self, html_content: str, book_slug: str) -> List[int]:
        """Extract available chapter numbers for a book"""
        # Look for chapter navigation options
        chapter_pattern = rf'<option value="(\d+)">\\1</option>'
        chapters = []

        matches = re.findall(chapter_pattern, html_content)
        for match in matches:
            try:
                chapters.append(int(match))
            except ValueError:
                continue

        if not chapters:
            # Fallback: scan for chapter links
            link_pattern = rf'/{re.escape(book_slug)}/{re.escape(book_slug)}-(\\d+)'
            link_matches = re.findall(link_pattern, html_content)
            chapters = [int(ch) for ch in link_matches if ch.isdigit()]

        return sorted(list(set(chapters)))

    def extract_verses_from_html(self, html_content: str) -> List[Tuple[str, str]]:
        """Extract verse number and text from chapter HTML"""
        verses = []

        # Extract scripture content
        scripture_match = re.search(
            r'<div id="scripture"[^>]*>(.*?)</div>\\s*</div><!--notranslate-->',
            html_content,
            re.IGNORECASE | re.DOTALL
        )

        if not scripture_match:
            logger.warning("No scripture div found in HTML")
            return verses

        scripture_html = scripture_match.group(1)

        # Find verse blocks
        verse_pattern = r'<span class="verseno c"[^>]*id="v(\\d+)"[^>]*>.*?</span>(.*?)' \
                       r'<span class="endverse"></span>'

        for verse_num, verse_html in re.findall(verse_pattern, scripture_html, re.IGNORECASE | re.DOTALL):
            # Extract verse number from HTML (may include non-Latin digits)
            num_match = re.search(r'^[0-9\\u06F0-\\u06F9\\u0660-\\u0669]+', verse_html.strip())
            display_num = num_match.group(0) if num_match else verse_num

            # Clean verse text
            clean_text = re.sub(r'<[^>]+>', ' ', verse_html)
            clean_text = re.sub(r'\\s+', ' ', clean_text.strip())
            clean_text = re.sub(r'\\u00a0', ' ', clean_text)  # Non-breaking space

            if clean_text:
                verses.append((display_num, clean_text))

        return verses

    async def check_book_chapter(self, book_slug: str, chapter: int) -> Optional[ContentUpdate]:
        """Check a specific book chapter for updates"""
        url = f"{self.API_BASE}/{book_slug}/{book_slug}-{chapter}"

        try:
            content, last_modified = await self.fetch_url(url)
            content_hash = self._get_content_hash(content, 'text')

            cache_key = f"{book_slug}:{chapter}"
            cached_hash = self.content_cache.get(cache_key)

            if cached_hash:
                if cached_hash.content_hash == content_hash:
                    logger.debug(f"No changes detected for {cache_key}")
                    return None
                else:
                    logger.info(f"Content changed for {cache_key}")
                    return ContentUpdate(
                        url=url,
                        content_type='text',
                        change_type='modified',
                        old_hash=cached_hash.content_hash,
                        new_hash=content_hash,
                        metadata={
                            'book_slug': book_slug,
                            'chapter': chapter,
                            'last_modified': last_modified,
                            'cache_timestamp': cached_hash.timestamp.isoformat()
                        }
                    )
            else:
                logger.info(f"New content detected for {cache_key}")
                return ContentUpdate(
                    url=url,
                    content_type='text',
                    change_type='new',
                    old_hash=None,
                    new_hash=content_hash,
                    metadata={
                        'book_slug': book_slug,
                        'chapter': chapter,
                        'last_modified': last_modified
                    }
                )

        except Exception as e:
            logger.error(f"Error checking {url}: {e}")
            return None

    async def scan_book_for_updates(self, book_slug: str) -> List[ContentUpdate]:
        """Scan entire book for chapter updates"""
        logger.info(f"Scanning {book_slug} for updates")

        # First, check chapter 1 to discover available chapters
        try:
            url = f"{self.API_BASE}/{book_slug}/{book_slug}-1"
            content, _ = await self.fetch_url(url)
            html_text = content.decode('utf-8', errors='ignore')

            available_chapters = self.extract_book_chapters_from_html(html_text, book_slug)
            logger.info(f"Found {len(available_chapters)} chapters for {book_slug}")

        except Exception as e:
            logger.error(f"Failed to get chapter list for {book_slug}: {e}")
            return []

        updates = []
        for chapter in available_chapters:
            update = await self.check_book_chapter(book_slug, chapter)
            if update:
                updates.append(update)

        return updates

    async def scan_all_books_for_updates(self, book_slugs: List[str]) -> List[ContentUpdate]:
        """Scan all books for updates"""
        all_updates = []

        for book_slug in book_slugs:
            updates = await self.scan_book_for_updates(book_slug)
            all_updates.extend(updates)

            # Small delay between books to be respectful
            await asyncio.sleep(0.5)

        return all_updates

    def update_cache(self, updates: List[ContentUpdate]):
        """Update internal cache with new content hashes"""
        for update in updates:
            if update.change_type == 'deleted':
                # Remove from cache
                cache_key = f"{update.metadata['book_slug']}:{update.metadata['chapter']}"
                self.content_cache.pop(cache_key, None)
            else:
                # Update cache with new hash
                cache_key = f"{update.metadata['book_slug']}:{update.metadata['chapter']}"
                self.content_cache[cache_key] = ContentHash(
                    url=update.url,
                    content_hash=update.new_hash or '',
                    last_modified=update.metadata.get('last_modified'),
                    content_type=update.content_type,
                    timestamp=datetime.now()
                )

        self.save_cache()

    async def extract_audio_urls(self, book_slug: str, chapter: int) -> List[str]:
        """Extract audio URLs from chapter page (if available)"""
        url = f"{self.API_BASE}/{book_slug}/{book_slug}-{chapter}"

        try:
            content, _ = await self.fetch_url(url)
            html_text = content.decode('utf-8', errors='ignore')

            # Look for audio elements or MP3 links
            audio_patterns = [
                r'href="([^"]*\\.mp3[^"]*)"',
                r'src="([^"]*\\.mp3[^"]*)"',
                r'["\']([^"\']*\\.mp3[^"\']*)["\']'
            ]

            audio_urls = []
            for pattern in audio_patterns:
                matches = re.findall(pattern, html_text, re.IGNORECASE)
                for match in matches:
                    if match and not match.startswith('http'):
                        match = urljoin(self.BASE_URL, match)
                    if match and match.endswith('.mp3'):
                        audio_urls.append(match)

            return list(set(audio_urls))

        except Exception as e:
            logger.error(f"Failed to extract audio URLs for {book_slug}:{chapter}: {e}")
            return []


class ContentSyncService:
    """Service to synchronize detected changes with local data"""

    def __init__(self, monitor: AfghanBiblesMonitor, data_dir: str = "app/data"):
        self.monitor = monitor
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(exist_ok=True)

    async def sync_text_content(self, updates: List[ContentUpdate]) -> Dict[str, any]:
        """Synchronize text content updates"""
        sync_results = {
            'updated_books': set(),
            'new_files': [],
            'errors': []
        }

        for update in updates:
            if update.content_type != 'text':
                continue

            try:
                book_slug = update.metadata['book_slug']
                chapter = update.metadata['chapter']

                # Fetch the updated content
                content, _ = await self.monitor.fetch_url(update.url)
                html_text = content.decode('utf-8', errors='ignore')

                # Extract verses
                verses = self.monitor.extract_verses_from_html(html_text)

                if verses:
                    # Save to file
                    filename = f"{book_slug.replace('-', '')}{chapter}_pashto.txt"
                    file_path = self.data_dir / filename

                    async with aiofiles.open(file_path, 'w', encoding='utf-8') as f:
                        for verse_num, verse_text in verses:
                            await f.write(f"{verse_num} {verse_text}\\n")

                    sync_results['new_files'].append(str(file_path))
                    sync_results['updated_books'].add(book_slug)

                    logger.info(f"Synchronized {book_slug} chapter {chapter} ({len(verses)} verses)")

            except Exception as e:
                error_msg = f"Failed to sync {update.url}: {e}"
                logger.error(error_msg)
                sync_results['errors'].append(error_msg)

        return sync_results


class N8NIntegrationService:
    """Service to integrate with n8n workflows"""

    def __init__(self, n8n_webhook_url: str, api_key: Optional[str] = None):
        self.webhook_url = n8n_webhook_url
        self.api_key = api_key
        self.session: Optional[aiohttp.ClientSession] = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    async def trigger_workflow(self, workflow_name: str, payload: Dict) -> bool:
        """Trigger n8n workflow via webhook"""
        if not self.session:
            raise RuntimeError("Integration service not properly initialized")

        headers = {}
        if self.api_key:
            headers['Authorization'] = f'Bearer {self.api_key}'

        try:
            async with self.session.post(
                f"{self.webhook_url}/{workflow_name}",
                json=payload,
                headers=headers
            ) as response:
                return response.status == 200
        except Exception as e:
            logger.error(f"Failed to trigger n8n workflow {workflow_name}: {e}")
            return False

    async def report_content_updates(self, updates: List[ContentUpdate]):
        """Report detected content updates to n8n"""
        if not updates:
            return True

        payload = {
            'timestamp': datetime.now().isoformat(),
            'source': 'afghan_bibles_monitor',
            'updates': [
                {
                    'url': update.url,
                    'content_type': update.content_type,
                    'change_type': update.change_type,
                    'metadata': update.metadata
                }
                for update in updates
            ]
        }

        success = await self.trigger_workflow('content-updates', payload)
        if success:
            logger.info(f"Reported {len(updates)} content updates to n8n")
        return success


async def main():
    """Main monitoring function"""
    # Configuration
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

    # Initialize services
    async with AfghanBiblesMonitor() as monitor:
        # Check for updates
        logger.info("Starting content monitoring scan...")
        updates = await monitor.scan_all_books_for_updates(OT_BOOK_SLUGS)

        if updates:
            logger.info(f"Found {len(updates)} content updates")

            # Update cache
            monitor.update_cache(updates)

            # Report to n8n (if configured)
            n8n_service = N8NIntegrationService(
                n8n_webhook_url=os.getenv('N8N_WEBHOOK_URL', ''),
                api_key=os.getenv('N8N_API_KEY')
            )

            async with n8n_service:
                await n8n_service.report_content_updates(updates)

            # Sync content locally
            sync_service = ContentSyncService(monitor)
            sync_results = await sync_service.sync_text_content(updates)

            logger.info(f"Synchronization complete: {len(sync_results['new_files'])} files updated")

        else:
            logger.info("No content updates detected")


if __name__ == "__main__":
    asyncio.run(main())




