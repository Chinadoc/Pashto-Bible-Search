#!/usr/bin/env python3
"""Download all Yousafzai 2019 text from Afghan Bibles (Genesis to Revelation).

This script scrapes all books of the Bible in Yousafzai 2019 translation from Afghan Bibles
and saves the text data for upload to Supabase verses_yousafzai table.

Usage:
  python3 download_all_yousafzai_text.py
"""

import json
import os
import re
import requests
import time
from typing import Dict, List, Optional
from urllib.parse import quote

BASE_URL = "https://afghanbibles.org/eng/pashto-bible"
DIALECT_QUERY = "yusufzai"
DATASET_TRANSLATION = "Yousafzai 2019"
DATASET_DIALECT = "yousafzai"

# All books of the Bible with their slugs and chapter counts
ALL_BOOKS = [
    # Old Testament
    {"slug": "genesis", "name": "Genesis", "chapters": 50},
    {"slug": "exodus", "name": "Exodus", "chapters": 40},
    {"slug": "leviticus", "name": "Leviticus", "chapters": 27},
    {"slug": "numbers", "name": "Numbers", "chapters": 36},
    {"slug": "deuteronomy", "name": "Deuteronomy", "chapters": 34},
    {"slug": "joshua", "name": "Joshua", "chapters": 24},
    {"slug": "judges", "name": "Judges", "chapters": 21},
    {"slug": "ruth", "name": "Ruth", "chapters": 4},
    {"slug": "1-samuel", "name": "1 Samuel", "chapters": 31},
    {"slug": "2-samuel", "name": "2 Samuel", "chapters": 24},
    {"slug": "1-kings", "name": "1 Kings", "chapters": 22},
    {"slug": "2-kings", "name": "2 Kings", "chapters": 25},
    {"slug": "1-chronicles", "name": "1 Chronicles", "chapters": 29},
    {"slug": "2-chronicles", "name": "2 Chronicles", "chapters": 36},
    {"slug": "ezra", "name": "Ezra", "chapters": 10},
    {"slug": "nehemiah", "name": "Nehemiah", "chapters": 13},
    {"slug": "esther", "name": "Esther", "chapters": 10},
    {"slug": "job", "name": "Job", "chapters": 42},
    {"slug": "psalms", "name": "Psalms", "chapters": 150},
    {"slug": "proverbs", "name": "Proverbs", "chapters": 31},
    {"slug": "ecclesiastes", "name": "Ecclesiastes", "chapters": 12},
    {"slug": "song-of-solomon", "name": "Song of Solomon", "chapters": 8},
    {"slug": "isaiah", "name": "Isaiah", "chapters": 66},
    {"slug": "jeremiah", "name": "Jeremiah", "chapters": 52},
    {"slug": "lamentations", "name": "Lamentations", "chapters": 5},
    {"slug": "ezekiel", "name": "Ezekiel", "chapters": 48},
    {"slug": "daniel", "name": "Daniel", "chapters": 12},
    {"slug": "hosea", "name": "Hosea", "chapters": 14},
    {"slug": "joel", "name": "Joel", "chapters": 3},
    {"slug": "amos", "name": "Amos", "chapters": 9},
    {"slug": "obadiah", "name": "Obadiah", "chapters": 1},
    {"slug": "jonah", "name": "Jonah", "chapters": 4},
    {"slug": "micah", "name": "Micah", "chapters": 7},
    {"slug": "nahum", "name": "Nahum", "chapters": 3},
    {"slug": "habakkuk", "name": "Habakkuk", "chapters": 3},
    {"slug": "zephaniah", "name": "Zephaniah", "chapters": 3},
    {"slug": "haggai", "name": "Haggai", "chapters": 2},
    {"slug": "zechariah", "name": "Zechariah", "chapters": 14},
    {"slug": "malachi", "name": "Malachi", "chapters": 4},
    
    # New Testament
    {"slug": "matthew", "name": "Matthew", "chapters": 28},
    {"slug": "mark", "name": "Mark", "chapters": 16},
    {"slug": "luke", "name": "Luke", "chapters": 24},
    {"slug": "john", "name": "John", "chapters": 21},
    {"slug": "acts", "name": "Acts", "chapters": 28},
    {"slug": "romans", "name": "Romans", "chapters": 16},
    {"slug": "1-corinthians", "name": "1 Corinthians", "chapters": 16},
    {"slug": "2-corinthians", "name": "2 Corinthians", "chapters": 13},
    {"slug": "galatians", "name": "Galatians", "chapters": 6},
    {"slug": "ephesians", "name": "Ephesians", "chapters": 6},
    {"slug": "philippians", "name": "Philippians", "chapters": 4},
    {"slug": "colossians", "name": "Colossians", "chapters": 4},
    {"slug": "1-thessalonians", "name": "1 Thessalonians", "chapters": 5},
    {"slug": "2-thessalonians", "name": "2 Thessalonians", "chapters": 3},
    {"slug": "1-timothy", "name": "1 Timothy", "chapters": 6},
    {"slug": "2-timothy", "name": "2 Timothy", "chapters": 4},
    {"slug": "titus", "name": "Titus", "chapters": 3},
    {"slug": "philemon", "name": "Philemon", "chapters": 1},
    {"slug": "hebrews", "name": "Hebrews", "chapters": 13},
    {"slug": "james", "name": "James", "chapters": 5},
    {"slug": "1-peter", "name": "1 Peter", "chapters": 5},
    {"slug": "2-peter", "name": "2 Peter", "chapters": 3},
    {"slug": "1-john", "name": "1 John", "chapters": 5},
    {"slug": "2-john", "name": "2 John", "chapters": 1},
    {"slug": "3-john", "name": "3 John", "chapters": 1},
    {"slug": "jude", "name": "Jude", "chapters": 1},
    {"slug": "revelation", "name": "Revelation", "chapters": 22},
]

# Regex patterns for extracting content
SCRIPTURE_DIV_RE = re.compile(
    r"<div id=\"scripture\"[\s\S]*?>([\s\S]*?)</div>\s*</div><!--notranslate-->",
    re.IGNORECASE,
)
VERSE_BLOCK_RE = re.compile(
    r"<span class=\"verseno c\"[^>]*id=\"v(\d+)\"[^>]*>.*?</span>([\s\S]*?)<span class=\"endverse\"></span>",
    re.IGNORECASE,
)
TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"\s+")

def fetch(url: str, *, retries: int = 3, delay: float = 0.75) -> str:
    """Fetch URL with retry logic."""
    last_exc: Optional[Exception] = None
    for attempt in range(1, retries + 1):
        try:
            resp = requests.get(url, timeout=45)
            resp.raise_for_status()
            return resp.text
        except Exception as exc:
            last_exc = exc
            wait = delay * attempt
            print(f"Warning: fetch failed ({exc}). retrying in {wait:.1f}s")
            time.sleep(wait)
    raise RuntimeError(f"Failed to fetch {url}: {last_exc}")

def html_to_text(html_str: str) -> str:
    """Convert HTML to clean text."""
    cleaned = re.sub(r"<script[\s\S]*?</script>", " ", html_str, flags=re.IGNORECASE)
    cleaned = re.sub(r"<style[\s\S]*?</style>", " ", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"<(br|p|div|li|h\d)[^>]*>", "\n", cleaned, flags=re.IGNORECASE)
    cleaned = TAG_RE.sub(" ", cleaned)
    cleaned = WS_RE.sub(" ", cleaned)
    cleaned = cleaned.replace("\u00a0", " ")
    cleaned = re.sub(r"\s*\n\s*", " ", cleaned)
    return cleaned.strip()

def extract_verses(html_doc: str, book_name: str, chapter: int) -> List[Dict]:
    """Extract verses from HTML document."""
    m = SCRIPTURE_DIV_RE.search(html_doc)
    if not m:
        return []

    script_html = m.group(1)
    verses: List[Dict] = []
    for vm in VERSE_BLOCK_RE.finditer(script_html):
        verse_num = int(vm.group(1))
        body_html = vm.group(2)
        verse_text = html_to_text(body_html)
        verses.append({
            "book": book_name,
            "chapter": chapter,
            "verse": verse_num,
            "text": verse_text,
            "text_html": body_html.strip(),
            "translation": DATASET_TRANSLATION,
            "dialect": DATASET_DIALECT,
            "book_slug": book_name.lower().replace(" ", "-"),
        })
    return verses

def gather_book(book_slug: str, book_name: str, chapters: int) -> List[Dict]:
    """Gather all verses for a book."""
    collected: List[Dict] = []
    print(f"Gathering {book_name} ({chapters} chapters)...")
    
    for chapter in range(1, chapters + 1):
        url = f"{BASE_URL}/{book_slug}/{book_slug}-{chapter}?prefdialect={DIALECT_QUERY}"
        try:
            html_doc = fetch(url)
            verses = extract_verses(html_doc, book_name, chapter)
            if not verses:
                print(f"  Warning: no verses extracted for {book_name} {chapter}")
                continue
            
            collected.extend(verses)
            print(f"  Chapter {chapter}: {len(verses)} verses")
            time.sleep(0.4)  # Be respectful to the server
            
        except Exception as e:
            print(f"  Error fetching {book_name} {chapter}: {e}")
            continue
    
    print(f"  Total: {len(collected)} verses")
    return collected

def save_to_json(data: List[Dict], filename: str):
    """Save data to JSON file."""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(data)} verses to {filename}")

def main():
    """Main function to download all Yousafzai text."""
    print("Downloading all Yousafzai 2019 text from Afghan Bibles...")
    print(f"Total books to process: {len(ALL_BOOKS)}")
    
    all_verses: List[Dict] = []
    
    for i, book in enumerate(ALL_BOOKS, 1):
        print(f"\n[{i}/{len(ALL_BOOKS)}] Processing {book['name']}...")
        
        try:
            verses = gather_book(book['slug'], book['name'], book['chapters'])
            all_verses.extend(verses)
            
            # Save individual book file
            book_filename = f"yousafzai_{book['slug']}_verses.json"
            save_to_json(verses, book_filename)
            
        except Exception as e:
            print(f"Error processing {book['name']}: {e}")
            continue
    
    # Save complete dataset
    if all_verses:
        save_to_json(all_verses, "yousafzai_all_verses.json")
        
        # Print statistics
        total_verses = len(all_verses)
        books_with_data = len(set(v['book'] for v in all_verses))
        
        print(f"\n=== Download Complete ===")
        print(f"Total verses downloaded: {total_verses:,}")
        print(f"Books with data: {books_with_data}/{len(ALL_BOOKS)}")
        print(f"Complete dataset saved to: yousafzai_all_verses.json")
        
        # Show sample data
        if all_verses:
            sample = all_verses[0]
            print(f"\nSample verse:")
            print(f"  Book: {sample['book']}")
            print(f"  Chapter: {sample['chapter']}")
            print(f"  Verse: {sample['verse']}")
            print(f"  Text: {sample['text'][:100]}...")
    else:
        print("No verses were downloaded!")

if __name__ == "__main__":
    main()
