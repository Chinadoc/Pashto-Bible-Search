#!/usr/bin/env python3
"""
Download ALL OT audio files from Afghan Bibles (afghan2023 translation).
Checks each OT book chapter by chapter, downloads available audio, and splits into individual verse files.
Uses parallel processing to download multiple books simultaneously.
"""

import base64
import json
import logging
import os
import re
import subprocess
from pathlib import Path
from typing import Dict, List, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('ot_audio_downloader')

BASE_URL = "https://afghanbibles.org"
AUDIO_BASE_URL_AFGHAN = f"{BASE_URL}/pashto-afeastern-audio"  # Afghan 2023
AUDIO_BASE_URL_YOUSAFZAI = f"{BASE_URL}/pashto-yusufzai-audio"  # Yousafzai 2019

# All OT books in order
OT_BOOKS = [
    ('genesis', 'Genesis'),
    ('exodus', 'Exodus'),
    ('leviticus', 'Leviticus'),
    ('numbers', 'Numbers'),
    ('deuteronomy', 'Deuteronomy'),
    ('joshua', 'Joshua'),
    ('judges', 'Judges'),
    ('ruth', 'Ruth'),
    ('1samuel', '1 Samuel'),
    ('2samuel', '2 Samuel'),
    ('1kings', '1 Kings'),
    ('2kings', '2 Kings'),
    ('1chronicles', '1 Chronicles'),
    ('2chronicles', '2 Chronicles'),
    ('ezra', 'Ezra'),
    ('nehemiah', 'Nehemiah'),
    ('esther', 'Esther'),
    ('job', 'Job'),
    ('psalms', 'Psalms'),
    ('proverbs', 'Proverbs'),
    ('ecclesiastes', 'Ecclesiastes'),
    ('songofsongs', 'Song of Songs'),
    ('isaiah', 'Isaiah'),
    ('jeremiah', 'Jeremiah'),
    ('lamentations', 'Lamentations'),
    ('ezekiel', 'Ezekiel'),
    ('daniel', 'Daniel'),
    ('hosea', 'Hosea'),
    ('joel', 'Joel'),
    ('amos', 'Amos'),
    ('obadiah', 'Obadiah'),
    ('jonah', 'Jonah'),
    ('micah', 'Micah'),
    ('nahum', 'Nahum'),
    ('habakkuk', 'Habakkuk'),
    ('zephaniah', 'Zephaniah'),
    ('haggai', 'Haggai'),
    ('zechariah', 'Zechariah'),
    ('malachi', 'Malachi'),
]

# Approximate chapter counts for each book (will be verified)
BOOK_CHAPTER_COUNTS = {
    'genesis': 50, 'exodus': 40, 'leviticus': 27, 'numbers': 36, 'deuteronomy': 34,
    'joshua': 24, 'judges': 21, 'ruth': 4, '1samuel': 31, '2samuel': 24,
    '1kings': 22, '2kings': 25, '1chronicles': 29, '2chronicles': 36,
    'ezra': 10, 'nehemiah': 13, 'esther': 10, 'job': 42, 'psalms': 150,
    'proverbs': 31, 'ecclesiastes': 12, 'songofsongs': 8,
    'isaiah': 66, 'jeremiah': 52, 'lamentations': 5, 'ezekiel': 48, 'daniel': 12,
    'hosea': 14, 'joel': 3, 'amos': 9, 'obadiah': 1, 'jonah': 4,
    'micah': 7, 'nahum': 3, 'habakkuk': 3, 'zephaniah': 3, 'haggai': 2,
    'zechariah': 14, 'malachi': 4,
}

def decode_jktags_verses(jktags: str, expected_verses: int) -> List[Dict]:
    """Decode jktags to get verse timing markers (using existing decoder)"""
    try:
        # Reverse and decode the jktags
        rev = jktags[::-1]
        rev = rev.replace('&41', '====').replace('&3', '===').replace('&2', '==').replace('&1', '=')

        # ROT13 decode
        rot = ''.join(
            chr(((ord(c) - (65 if c.isupper() else 97) + 13) % 26) + (65 if c.isupper() else 97))
            if c.isalpha() else c
            for c in rev
        )

        # Base64 decode
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
                start_time = round(verse_starts[verse] * 100) / 100
                markers.append({'verse': verse, 'start_time': start_time})

        return markers

    except Exception as e:
        logger.error(f"Failed to decode jktags: {e}")
        return []

def extract_chapter_info(book_slug: str, chapter: int, session: requests.Session) -> Optional[Dict]:
    """Extract chapter information including jktags and verse count"""
    try:
        chapter_url = f"{BASE_URL}/eng/pashto-bible/{book_slug}/{book_slug}-{chapter}"
        response = session.get(chapter_url, timeout=30)
        response.raise_for_status()
        html = response.text

        # Extract jktags
        jktags_match = re.search(r'id=["\']jktags["\'][^>]*data-tags=["\']([^"\']+)["\']', html)
        jktags = jktags_match.group(1) if jktags_match else None

        # Count verses by counting verse spans
        verse_span_matches = re.findall(r'class=["\']verseno\b[^"\']*["\'][^>]*>', html)
        verse_count = len(verse_span_matches)

        # Check if audio is available by looking for audio player
        has_audio = 'MP3 Audio' in html or 'pashto-afeastern-audio' in html

        return {
            'jktags': jktags,
            'verse_count': verse_count,
            'has_audio': has_audio
        }

    except Exception as e:
        logger.error(f"Failed to extract chapter info for {book_slug} {chapter}: {e}")
        return None

def check_audio_available(book_slug: str, chapter: int, session: requests.Session) -> bool:
    """Check if Afghan 2023 audio file exists for a chapter"""
    try:
        # Only check Afghan 2023 (afeastern) - we already have Yousafzai
        afghan_url = f"{AUDIO_BASE_URL_AFGHAN}/{book_slug}-{chapter}.mp3"
        afghan_response = session.head(afghan_url, timeout=10, allow_redirects=True)
        return afghan_response.status_code == 200
    except:
        return False

def download_audio(book_slug: str, chapter: int, output_path: Path, session: requests.Session) -> bool:
    """Download Afghan 2023 chapter audio file only"""
    try:
        # Only download Afghan 2023 (afeastern) - we already have Yousafzai
        afghan_url = f"{AUDIO_BASE_URL_AFGHAN}/{book_slug}-{chapter}.mp3"
        logger.info(f"   Downloading {afghan_url}...")
        
        response = session.get(afghan_url, timeout=60, stream=True)
        response.raise_for_status()
        
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        logger.info(f"   ✅ Downloaded {output_path.name} ({output_path.stat().st_size / 1024:.1f} KB)")
        return True
    except Exception as e:
        logger.error(f"   ❌ Failed to download {book_slug} {chapter}: {e}")
        return False

def split_audio_into_verses(input_file: Path, markers: List[Dict], output_dir: Path, book_slug: str, chapter: int) -> List[str]:
    """Split chapter audio file into individual verse files using ffmpeg"""
    logger.info(f"   Splitting {input_file.name} into {len(markers)} verses...")

    output_dir.mkdir(parents=True, exist_ok=True)

    # Check if ffmpeg is available
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        logger.error("❌ ffmpeg not found. Please install ffmpeg to split audio files.")
        return []

    verse_files = []

    for i, marker in enumerate(markers):
        verse = marker['verse']
        start_time = marker['start_time']
        next_marker = markers[i + 1] if i + 1 < len(markers) else None
        duration = (next_marker['start_time'] - start_time) if next_marker else 10.0

        filename = f"{book_slug}{chapter}_verse_{verse:03d}.mp3"
        output_file = output_dir / filename

        # Skip if already exists and has content
        if output_file.exists() and output_file.stat().st_size > 0:
            logger.debug(f"     Verse {verse} already exists: {filename}")
            verse_files.append(str(output_file))
            continue

        # Use ffmpeg to extract verse
        cmd = [
            'ffmpeg', '-i', str(input_file),
            '-ss', str(start_time),
            '-t', str(duration),
            '-acodec', 'copy',
            '-y',  # Overwrite output file
            str(output_file)
        ]

        try:
            subprocess.run(cmd, capture_output=True, text=True, check=True)
            logger.debug(f"     ✅ Verse {verse}: {filename}")
            verse_files.append(str(output_file))
        except subprocess.CalledProcessError as e:
            logger.error(f"     ❌ Failed to extract verse {verse}: {e.stderr}")
            continue

    return verse_files

def process_book(book_slug: str, book_name: str, audio_dir: Path, session: requests.Session) -> Dict:
    """Process a single book - check all chapters and download available audio"""
    logger.info(f"\n{'='*70}")
    logger.info(f"📖 Processing {book_name} ({book_slug})")
    logger.info(f"{'='*70}")
    
    max_chapters = BOOK_CHAPTER_COUNTS.get(book_slug, 50)
    chapters_processed = 0
    chapters_with_audio = 0
    total_verses = 0
    
    for chapter in range(1, max_chapters + 1):
        # First check if Afghan 2023 audio exists
        if not check_audio_available(book_slug, chapter, session):
            logger.debug(f"   Chapter {chapter}: No Afghan 2023 audio available (skipping)")
            continue
        
        # Extract chapter info - MUST have jktags to split into verses
        chapter_info = extract_chapter_info(book_slug, chapter, session)
        if not chapter_info:
            logger.warning(f"   Chapter {chapter}: Could not extract chapter info, skipping...")
            continue
        
        # Skip if no jktags (can't split into verses without timing data)
        if not chapter_info['jktags']:
            logger.warning(f"   Chapter {chapter}: No jktags found - SKIPPING (need jktags to split into verses)")
            continue
        
        chapters_with_audio += 1
        
        # Decode jktags to get verse timing markers
        markers = decode_jktags_verses(chapter_info['jktags'], chapter_info['verse_count'])
        if not markers:
            logger.warning(f"   Chapter {chapter}: No timing markers decoded from jktags, skipping...")
            continue
        
        logger.info(f"   Chapter {chapter}: {len(markers)} verse markers found")
        
        # Download chapter audio (Afghan 2023 only - we already have Yousafzai)
        chapter_audio_file = audio_dir / f"{book_slug}_{chapter}.mp3"
        if not chapter_audio_file.exists():
            if not download_audio(book_slug, chapter, chapter_audio_file, session):
                continue
        else:
            logger.info(f"   ✅ Chapter audio already exists: {chapter_audio_file.name}")
        
        # Split into verses
        verse_output_dir = audio_dir / book_slug / f"chapter-{chapter}-verses"
        verse_files = split_audio_into_verses(
            chapter_audio_file, 
            markers, 
            verse_output_dir, 
            book_slug, 
            chapter
        )
        
        total_verses += len(verse_files)
        chapters_processed += 1
        logger.info(f"   ✅ Chapter {chapter}: {len(verse_files)} verses extracted")
    
    return {
        'book': book_name,
        'book_slug': book_slug,
        'chapters_with_audio': chapters_with_audio,
        'chapters_processed': chapters_processed,
        'total_verses': total_verses
    }

def process_book_wrapper(args):
    """Wrapper function for parallel processing"""
    book_slug, book_name, audio_dir, max_workers = args
    
    # Create a separate session for each worker
    session = requests.Session()
    session.headers.update({
        'User-Agent': f'PashtoBibleSearch-OT-Audio-Downloader/1.0-{book_slug}'
    })
    
    try:
        result = process_book(book_slug, book_name, audio_dir, session)
        logger.info(f"✅ {book_name}: {result['chapters_with_audio']} chapters with audio, {result['total_verses']} verses extracted")
        return result
    except Exception as e:
        logger.error(f"❌ Error processing {book_name}: {e}")
        return {
            'book': book_name,
            'book_slug': book_slug,
            'error': str(e)
        }

def main():
    logger.info("🚀 Starting OT Audio Download from Afghan Bibles (PARALLEL)")
    logger.info(f"   Checking all {len(OT_BOOKS)} OT books for Afghan 2023 audio")
    logger.info(f"   Using parallel processing with multiple workers\n")
    
    # Create output directory
    audio_dir = Path("ot_audio_files")
    audio_dir.mkdir(exist_ok=True)
    
    # Filter to only books that have Afghan 2023 audio (from our earlier check)
    afghan_books = [
        ('genesis', 'Genesis'),
        ('exodus', 'Exodus'),
        ('leviticus', 'Leviticus'),
        ('numbers', 'Numbers'),
        ('deuteronomy', 'Deuteronomy'),
        ('judges', 'Judges'),
        ('ezra', 'Ezra'),
        ('proverbs', 'Proverbs'),
        ('ecclesiastes', 'Ecclesiastes'),
        ('isaiah', 'Isaiah'),
        ('ezekiel', 'Ezekiel'),
        ('amos', 'Amos'),
        ('jonah', 'Jonah'),
    ]
    
    logger.info(f"📚 Processing {len(afghan_books)} books with Afghan 2023 audio\n")
    
    # Use ThreadPoolExecutor for parallel processing
    # Use 5-8 workers to avoid overwhelming the server
    max_workers = 5
    results = []
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all books for parallel processing
        future_to_book = {
            executor.submit(process_book_wrapper, (book_slug, book_name, audio_dir, max_workers)): (book_slug, book_name)
            for book_slug, book_name in afghan_books
        }
        
        # Process results as they complete
        for future in as_completed(future_to_book):
            book_slug, book_name = future_to_book[future]
            try:
                result = future.result()
                results.append(result)
            except Exception as e:
                logger.error(f"❌ Exception processing {book_name}: {e}")
                results.append({
                    'book': book_name,
                    'book_slug': book_slug,
                    'error': str(e)
                })
    
    # Summary
    logger.info(f"\n{'='*70}")
    logger.info("📊 SUMMARY")
    logger.info(f"{'='*70}")
    
    total_chapters = sum(r.get('chapters_with_audio', 0) for r in results)
    total_verses = sum(r.get('total_verses', 0) for r in results)
    books_with_audio = sum(1 for r in results if r.get('chapters_with_audio', 0) > 0)
    
    logger.info(f"Books with audio: {books_with_audio}/{len(afghan_books)}")
    logger.info(f"Total chapters with audio: {total_chapters}")
    logger.info(f"Total verses extracted: {total_verses}")
    logger.info(f"\nOutput directory: {audio_dir}")
    logger.info(f"\n📤 Next step: Run the parallel upload script to upload to R2")
    
    # Detailed breakdown
    logger.info(f"\n{'='*70}")
    logger.info("📋 DETAILED BREAKDOWN")
    logger.info(f"{'='*70}")
    for result in sorted(results, key=lambda x: x.get('book', '')):
        if result.get('chapters_with_audio', 0) > 0:
            logger.info(f"{result['book']:20} {result['chapters_with_audio']:3} chapters  {result['total_verses']:5} verses")

if __name__ == "__main__":
    main()

