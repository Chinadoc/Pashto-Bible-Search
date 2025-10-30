#!/usr/bin/env python3
"""
Download Proverbs audio files from Afghan Bibles (afghan2023 translation).
Downloads all 31 chapters, extracts verse timings from jktags, and splits into individual verse files.
"""

import base64
import json
import logging
import os
import re
import subprocess
from pathlib import Path
from typing import Dict, List, Optional
import requests

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('proverbs_downloader')

BASE_URL = "https://afghanbibles.org"
AUDIO_BASE_URL = f"{BASE_URL}/pashto-afeastern-audio"
BOOK_SLUG = "proverbs"
TOTAL_CHAPTERS = 31

def decode_jktags_verses(jktags: str, expected_verses: int) -> List[Dict]:
    """Decode jktags to get verse timing markers"""
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

        return {
            'jktags': jktags,
            'verse_count': verse_count
        }

    except Exception as e:
        logger.error(f"Failed to extract chapter info for {book_slug} {chapter}: {e}")
        return None

def download_audio(book_slug: str, chapter: int, output_path: Path, session: requests.Session) -> bool:
    """Download chapter audio file"""
    try:
        audio_url = f"{AUDIO_BASE_URL}/{book_slug}-{chapter}.mp3"
        logger.info(f"Downloading {audio_url}...")
        
        response = session.get(audio_url, timeout=60, stream=True)
        response.raise_for_status()
        
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        logger.info(f"✅ Downloaded {output_path.name} ({output_path.stat().st_size / 1024:.1f} KB)")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to download {book_slug} {chapter}: {e}")
        return False

def split_audio_into_verses(input_file: Path, markers: List[Dict], output_dir: Path, book_slug: str, chapter: int) -> List[str]:
    """Split chapter audio file into individual verse files using ffmpeg"""
    logger.info(f"Splitting {input_file.name} into {len(markers)} verses...")

    output_dir.mkdir(parents=True, exist_ok=True)

    # Check if ffmpeg is available
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        logger.error("❌ ffmpeg not found. Please install ffmpeg to split audio files.")
        logger.error("   On macOS: brew install ffmpeg")
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
            logger.debug(f"  Verse {verse} already exists: {filename}")
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
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            logger.info(f"  ✅ Verse {verse}: {filename}")
            verse_files.append(str(output_file))
        except subprocess.CalledProcessError as e:
            logger.error(f"  ❌ Failed to extract verse {verse}: {e.stderr}")
            continue

    return verse_files

def main():
    logger.info("🚀 Starting Proverbs audio download from Afghan Bibles")
    logger.info(f"   Book: {BOOK_SLUG}, Chapters: 1-{TOTAL_CHAPTERS}")
    
    # Create output directory
    audio_dir = Path("ot_audio_files")
    audio_dir.mkdir(exist_ok=True)
    
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'PashtoBibleSearch-Proverbs-Audio-Downloader/1.0'
    })
    
    total_verses = 0
    
    for chapter in range(1, TOTAL_CHAPTERS + 1):
        logger.info(f"\n{'='*60}")
        logger.info(f"📖 Processing Chapter {chapter}/{TOTAL_CHAPTERS}")
        
        # Extract chapter info (jktags, verse count)
        chapter_info = extract_chapter_info(BOOK_SLUG, chapter, session)
        if not chapter_info or not chapter_info['jktags']:
            logger.warning(f"⚠️  No jktags found for chapter {chapter}, skipping...")
            continue
        
        # Decode jktags to get verse timing markers
        markers = decode_jktags_verses(chapter_info['jktags'], chapter_info['verse_count'])
        if not markers:
            logger.warning(f"⚠️  No timing markers found for chapter {chapter}, skipping...")
            continue
        
        logger.info(f"   Found {len(markers)} verse markers")
        
        # Download chapter audio
        chapter_audio_file = audio_dir / f"{BOOK_SLUG}_{chapter}.mp3"
        if not chapter_audio_file.exists():
            if not download_audio(BOOK_SLUG, chapter, chapter_audio_file, session):
                continue
        else:
            logger.info(f"   ✅ Chapter audio already exists: {chapter_audio_file.name}")
        
        # Split into verses
        verse_output_dir = audio_dir / BOOK_SLUG / f"chapter-{chapter}-verses"
        verse_files = split_audio_into_verses(
            chapter_audio_file, 
            markers, 
            verse_output_dir, 
            BOOK_SLUG, 
            chapter
        )
        
        total_verses += len(verse_files)
        logger.info(f"   ✅ Chapter {chapter}: {len(verse_files)} verses extracted")
    
    logger.info(f"\n{'='*60}")
    logger.info(f"✅ Complete! Extracted {total_verses} verse files")
    logger.info(f"   Output directory: {audio_dir / BOOK_SLUG}")
    logger.info(f"\n📤 Next step: Run the parallel upload script to upload to R2")

if __name__ == "__main__":
    main()


