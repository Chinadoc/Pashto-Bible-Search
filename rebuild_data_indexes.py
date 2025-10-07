#!/usr/bin/env python3
"""
Data Index Rebuild Script

This script rebuilds the data indexes and caches after content updates.
It can be triggered by webhooks, cron jobs, or manual execution.

Integration Points:
- Triggered by external update webhooks
- Part of automated deployment pipeline
- Manual rebuild for maintenance
"""

import asyncio
import json
import logging
import os
import sys
from pathlib import Path
from typing import Dict, List, Any

# Add the project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from external_monitoring_service import AfghanBiblesMonitor, ContentSyncService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('data_rebuild.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('data_rebuild')

class DataRebuildService:
    """Service to rebuild data indexes after content updates"""

    def __init__(self, project_root: Path):
        self.project_root = project_root
        self.app_data_dir = project_root / 'app' / 'data'
        self.cache_dir = project_root / 'cache'

        # Ensure directories exist
        self.app_data_dir.mkdir(parents=True, exist_ok=True)
        self.cache_dir.mkdir(parents=True, exist_ok=True)

    async def rebuild_verses_cache(self) -> bool:
        """Rebuild the verses cache from text files"""
        try:
            logger.info("Rebuilding verses cache...")

            verses_data = {}

            # Find all text files in app/data
            text_files = list(self.app_data_dir.glob('*_pashto.txt'))

            for text_file in text_files:
                try:
                    book_chapter = text_file.stem.replace('_pashto', '')
                    book_slug = book_chapter.replace(/[0-9]+$/, '')

                    with open(text_file, 'r', encoding='utf-8') as f:
                        lines = f.readlines()

                    # Parse verses
                    for line in lines:
                        line = line.strip()
                        if not line:
                            continue

                        # Parse verse format: "1 text content"
                        parts = line.split(' ', 1)
                        if len(parts) != 2:
                            continue

                        verse_num, verse_text = parts

                        # Generate reference (e.g., "psalms 1:1")
                        ref = f"{book_slug} {verse_num}"

                        verses_data[ref] = {
                            'text': verse_text,
                            'ref': ref,
                            'book': book_slug,
                            'testament': self._determine_testament(book_slug),
                            'source': 'afghan_bibles_scraped'
                        }

                except Exception as e:
                    logger.error(f"Error processing {text_file}: {e}")
                    continue

            # Save verses cache
            verses_file = self.app_data_dir / 'verses.json'
            with open(verses_file, 'w', encoding='utf-8') as f:
                json.dump(verses_data, f, ensure_ascii=False, indent=2)

            logger.info(f"Rebuilt verses cache with {len(verses_data)} verses")
            return True

        except Exception as e:
            logger.error(f"Failed to rebuild verses cache: {e}")
            return False

    def _determine_testament(self, book_slug: str) -> str:
        """Determine if a book is OT or NT"""
        ot_books = {
            'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy',
            'joshua', 'judges', 'ruth', '1samuel', '2samuel',
            '1kings', '2kings', '1chronicles', '2chronicles',
            'ezra', 'nehemiah', 'esther', 'job', 'psalms', 'proverbs',
            'ecclesiastes', 'songofsongs', 'isaiah', 'jeremiah',
            'lamentations', 'ezekiel', 'daniel', 'hosea', 'joel',
            'amos', 'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk',
            'zephaniah', 'haggai', 'zechariah', 'malachi'
        }

        return 'OT' if book_slug.lower() in ot_books else 'NT'

    async def rebuild_word_frequency(self) -> bool:
        """Rebuild word frequency data from verses"""
        try:
            logger.info("Rebuilding word frequency data...")

            verses_file = self.app_data_dir / 'verses.json'
            if not verses_file.exists():
                logger.error("Verses cache not found, skipping frequency rebuild")
                return False

            with open(verses_file, 'r', encoding='utf-8') as f:
                verses_data = json.load(f)

            word_counts = {}

            for ref, verse_data in verses_data.items():
                text = verse_data.get('text', '')
                words = text.split()

                for word in words:
                    word = word.strip()
                    if word:
                        word_counts[word] = word_counts.get(word, 0) + 1

            # Sort by frequency (descending)
            frequency_list = [
                {'pashto': word, 'frequency': count}
                for word, count in sorted(word_counts.items(), key=lambda x: x[1], reverse=True)
            ]

            # Save frequency data
            freq_file = self.app_data_dir / 'word_frequency_list.json'
            with open(freq_file, 'w', encoding='utf-8') as f:
                json.dump(frequency_list, f, ensure_ascii=False, indent=2)

            logger.info(f"Rebuilt word frequency with {len(frequency_list)} unique words")
            return True

        except Exception as e:
            logger.error(f"Failed to rebuild word frequency: {e}")
            return False

    async def rebuild_search_indexes(self) -> bool:
        """Rebuild search indexes for faster lookups"""
        try:
            logger.info("Rebuilding search indexes...")

            verses_file = self.app_data_dir / 'verses.json'
            if not verses_file.exists():
                logger.error("Verses cache not found, skipping index rebuild")
                return False

            with open(verses_file, 'r', encoding='utf-8') as f:
                verses_data = json.load(f)

            # Create search index
            search_index = {
                'verses': [],
                'byTextLower': {},
                'byTextNormalizedLower': {}
            }

            for ref, verse_data in verses_data.items():
                verse_record = {
                    'ref': ref,
                    'book': verse_data.get('book', ''),
                    'chapter': self._extract_chapter_from_ref(ref),
                    'verse': self._extract_verse_from_ref(ref),
                    'text': verse_data.get('text', ''),
                    'textLower': verse_data.get('text', '').lower(),
                    'testament': verse_data.get('testament', ''),
                    'source': verse_data.get('source', '')
                }

                search_index['verses'].append(verse_record)

                # Index by words
                words = verse_record['textLower'].split()
                for word in words:
                    if word:
                        if word not in search_index['byTextLower']:
                            search_index['byTextLower'][word] = []
                        search_index['byTextLower'][word].append(verse_record)

            # Save search index
            index_file = self.app_data_dir / 'search_index.json'
            with open(index_file, 'w', encoding='utf-8') as f:
                json.dump(search_index, f, ensure_ascii=False, indent=2)

            logger.info(f"Rebuilt search index with {len(search_index['verses'])} verses")
            return True

        except Exception as e:
            logger.error(f"Failed to rebuild search index: {e}")
            return False

    def _extract_chapter_from_ref(self, ref: str) -> int:
        """Extract chapter number from reference"""
        parts = ref.split()
        if len(parts) >= 2:
            try:
                return int(parts[1].split(':')[0])
            except (ValueError, IndexError):
                pass
        return 1

    def _extract_verse_from_ref(self, ref: str) -> int:
        """Extract verse number from reference"""
        parts = ref.split()
        if len(parts) >= 2:
            verse_part = parts[1].split(':')[-1]
            try:
                return int(verse_part)
            except ValueError:
                pass
        return 1

    async def compress_verses_cache(self) -> bool:
        """Create compressed version of verses cache for production"""
        try:
            verses_file = self.app_data_dir / 'verses.json'
            if not verses_file.exists():
                return False

            import gzip

            with open(verses_file, 'rb') as f_in:
                with gzip.open(self.app_data_dir / 'verses.json.gz', 'wb') as f_out:
                    f_out.writelines(f_in)

            logger.info("Created compressed verses cache")
            return True

        except Exception as e:
            logger.error(f"Failed to compress verses cache: {e}")
            return False

    async def run_full_rebuild(self) -> bool:
        """Run complete data rebuild process"""
        logger.info("Starting full data rebuild...")

        success = True

        # Rebuild in order of dependencies
        steps = [
            ('verses_cache', self.rebuild_verses_cache),
            ('word_frequency', self.rebuild_word_frequency),
            ('search_indexes', self.rebuild_search_indexes),
            ('compress_cache', self.compress_verses_cache),
        ]

        for step_name, step_func in steps:
            try:
                logger.info(f"Running step: {step_name}")
                if not await step_func():
                    logger.error(f"Step {step_name} failed")
                    success = False
                else:
                    logger.info(f"Step {step_name} completed successfully")
            except Exception as e:
                logger.error(f"Exception in step {step_name}: {e}")
                success = False

        if success:
            logger.info("Full data rebuild completed successfully")
        else:
            logger.error("Full data rebuild completed with errors")

        return success


async def main():
    """Main rebuild function"""
    project_root = Path(__file__).parent

    if len(sys.argv) > 1:
        action = sys.argv[1]
    else:
        action = 'full'

    rebuild_service = DataRebuildService(project_root)

    if action == 'full':
        success = await rebuild_service.run_full_rebuild()
    elif action == 'verses':
        success = await rebuild_service.rebuild_verses_cache()
    elif action == 'frequency':
        success = await rebuild_service.rebuild_word_frequency()
    elif action == 'indexes':
        success = await rebuild_service.rebuild_search_indexes()
    elif action == 'compress':
        success = await rebuild_service.compress_verses_cache()
    else:
        print(f"Unknown action: {action}")
        print("Available actions: full, verses, frequency, indexes, compress")
        return 1

    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))



