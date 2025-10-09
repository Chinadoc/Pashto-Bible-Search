#!/usr/bin/env python3
"""
Update Audio File Map for OT Audio Files

This script updates the audio_file_map.json with new OT audio files
downloaded by the OT audio monitor.

It maps OT audio files to the same format as existing NT audio files.
"""

import json
import logging
import os
from pathlib import Path
from typing import Dict, List

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('update_ot_audio_map')

def load_audio_file_map() -> Dict[str, str]:
    """Load existing audio file map"""
    map_file = Path('audio_file_map.json')
    if map_file.exists():
        with open(map_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def load_ot_audio_cache() -> Dict:
    """Load OT audio cache from monitor"""
    cache_file = Path('ot_audio_cache.json')
    if cache_file.exists():
        with open(cache_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def get_google_drive_file_id(filename: str) -> str:
    """Generate a mock Google Drive file ID for OT audio files"""
    # For now, generate deterministic IDs based on filename
    # In production, this would upload to Google Drive and get real IDs
    import hashlib
    hash_obj = hashlib.md5(filename.encode('utf-8'))
    # Format like Google Drive IDs (28 characters, mixed case, numbers)
    hash_hex = hash_obj.hexdigest()
    # Create a Google Drive-like ID
    drive_id = hash_hex[:12] + hash_hex[12:24].upper() + hash_hex[24:28]
    return drive_id

def find_verse_audio_files():
    """Find all OT verse audio files in the directory structure"""
    verse_files = []
    ot_audio_dir = Path('ot_audio_files')

    if not ot_audio_dir.exists():
        logger.warning("OT audio directory not found")
        return verse_files

    # Walk through the directory structure to find verse files
    for book_dir in ot_audio_dir.iterdir():
        if not book_dir.is_dir():
            continue

        # Look for chapter verse directories
        for chapter_dir in book_dir.iterdir():
            if not chapter_dir.is_dir() or not chapter_dir.name.startswith('chapter-'):
                continue

            # Look for verse audio files
            for audio_file in chapter_dir.iterdir():
                if audio_file.is_file() and audio_file.suffix == '.mp3' and '_verse_' in audio_file.name:
                    verse_files.append({
                        'filename': audio_file.name,
                        'filepath': str(audio_file),
                        'book_dir': book_dir.name,
                        'chapter_dir': chapter_dir.name
                    })

    return verse_files

def update_audio_file_map():
    """Update audio_file_map.json with OT verse audio files"""
    logger.info("Updating audio file map with OT verse audio files...")

    # Load existing map
    audio_map = load_audio_file_map()

    # Find all verse audio files
    verse_files = find_verse_audio_files()

    if not verse_files:
        logger.warning("No OT verse audio files found. Run OT audio monitor with --download first.")
        return

    updates_count = 0

    # Process each verse file
    for verse_file in verse_files:
        filename = verse_file['filename']
        filepath = verse_file['filepath']

        # Check if file exists
        if not Path(filepath).exists():
            logger.warning(f"Audio file not found: {filepath}")
            continue

        # Generate Google Drive-style file ID
        drive_file_id = get_google_drive_file_id(filename)

        # Check if already in map
        if filename in audio_map:
            if audio_map[filename] != drive_file_id:
                logger.info(f"Updating existing entry: {filename}")
                audio_map[filename] = drive_file_id
                updates_count += 1
        else:
            logger.info(f"Adding new entry: {filename}")
            audio_map[filename] = drive_file_id
            updates_count += 1

    # Save updated map
    if updates_count > 0:
        with open('audio_file_map.json', 'w', encoding='utf-8') as f:
            json.dump(audio_map, f, indent=None, ensure_ascii=False)
        logger.info(f"Updated audio_file_map.json with {updates_count} OT verse audio files")
    else:
        logger.info("No updates needed to audio_file_map.json")

def main():
    """Main function"""
    try:
        update_audio_file_map()
        logger.info("OT audio map update completed successfully")
    except Exception as e:
        logger.error(f"Failed to update OT audio map: {e}")
        return 1
    return 0

if __name__ == "__main__":
    exit(main())
