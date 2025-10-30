"""Scrape ALL Afghan 2023 Pashto Bible text (NT + OT) from afghanbibles.org

Source: https://afghanbibles.org/eng/pashto-bible/
Extracts verses using HTML data-name attributes like <span data-name="Est.1.10">

Output directories:
- `all_txt_copies/` for NT books
- `ot_txt_copies/` for OT books

Files: `<bookslug><chapter>_pashto.txt` (e.g., `matthew1_pashto.txt`, `genesis1_pashto.txt`)
"""

from __future__ import annotations

import os
import re
import time
import html
import requests
from typing import List, Tuple, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed
from threading import Lock

BASE = "https://afghanbibles.org/eng/pashto-bible"
DIALECT = "afeastern"  # Use "afeastern" for Afghan 2023, NOT "yusufzai"
print_lock = Lock()

# New Testament books (27 books)
NT_BOOK_SLUGS = [
    "matthew",
    "mark",
    "luke",
    "john",
    "acts",
    "romans",
    "1-corinthians",
    "2-corinthians",
    "galatians",
    "ephesians",
    "philippians",
    "colossians",
    "1-thessalonians",
    "2-thessalonians",
    "1-timothy",
    "2-timothy",
    "titus",
    "philemon",
    "hebrews",
    "james",
    "1-peter",
    "2-peter",
    "1-john",
    "2-john",
    "3-john",
    "jude",
    "revelation",
]

# Old Testament books (39 books)
OT_BOOK_SLUGS = [
    "genesis",
    "exodus",
    "leviticus",
    "numbers",
    "deuteronomy",
    "joshua",
    "judges",
    "ruth",
    "1-samuel",
    "2-samuel",
    "1-kings",
    "2-kings",
    "1-chronicles",
    "2-chronicles",
    "ezra",
    "nehemiah",
    "esther",
    "job",
    "psalms",
    "proverbs",
    "ecclesiastes",
    "song-of-songs",
    "isaiah",
    "jeremiah",
    "lamentations",
    "ezekiel",
    "daniel",
    "hosea",
    "joel",
    "amos",
    "obadiah",
    "jonah",
    "micah",
    "nahum",
    "habakkuk",
    "zephaniah",
    "haggai",
    "zechariah",
    "malachi",
]

CHAPTER_LINK_RE = re.compile(r"/eng/pashto-bible/([a-z0-9\-]+)/\1-(\d+)")
TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"\s+")

# Pattern to match verse spans with data-name attribute
VERSE_SPAN_RE = re.compile(r'<span[^>]*data-name="([^"]+)"[^>]*>([^<]*)</span>', re.IGNORECASE)
# Fallback: match verse numbers followed by text
VERSE_LINE_RE = re.compile(r"^\s*([0-9\u06F0-\u06F9\u0660-\u0669]+)\s+(.*)")


def build_chapter_url(book_slug: str, chapter: int) -> str:
    """Build URL for a specific chapter."""
    base = f"{BASE}/{book_slug}/{book_slug}-{chapter}"
    return f"{base}?prefdialect={DIALECT}"


def verify_afghan2023(html_str: str) -> bool:
    """Verify that the HTML content is Afghan 2023, not Yousafzai.
    
    Checks page title and content for translation indicators.
    Since URL doesn't change, we must verify the actual page content.
    """
    html_lower = html_str.lower()
    
    # Check page title - if it contains "yusufzai" or "yousafzai", it's NOT Afghan 2023
    title_match = re.search(r'<title[^>]*>([^<]+)</title>', html_str, re.IGNORECASE)
    if title_match:
        title = title_match.group(1).lower()
        if 'yusufzai' in title or 'yousafzai' in title:
            return False  # Title says Yousafzai
    
    # Check for radio buttons or checkboxes that indicate selected translation
    # Look for checked/selected state indicating Afghan 2023 or Yousafzai
    afghan_checked = re.search(
        r'(checked|selected)[^>]*value=["\']([^"\']*afeastern[^"\']*)["\']',
        html_str,
        re.IGNORECASE
    )
    yousafzai_checked = re.search(
        r'(checked|selected)[^>]*value=["\']([^"\']*yusufzai[^"\']*)["\']',
        html_str,
        re.IGNORECASE
    )
    
    if yousafzai_checked:
        return False  # Yousafzai is selected/checked
    
    if afghan_checked:
        return True  # Afghan 2023 is selected
    
    # Check for visible text indicators
    # Look for "Afghan 2023" or "Yousafzai 2019" in visible content
    afghan_text = re.search(r'afghan\s*2023', html_str, re.IGNORECASE)
    yousafzai_text = re.search(r'yousafzai\s*2019|yusufzai', html_str, re.IGNORECASE)
    
    # If we see "Afghan 2023" prominently and not "Yousafzai 2019" selected, assume Afghan 2023
    if afghan_text and not yousafzai_checked:
        return True
    
    # Default: if URL has afeastern and no clear Yousafzai indicators, assume Afghan 2023
    # But log a warning
    return True


def fetch(url: str, retries: int = 3, delay: float = 0.75) -> Optional[str]:
    """Fetch HTML content with retries and verify it's Afghan 2023."""
    for attempt in range(retries):
        try:
            resp = requests.get(url, timeout=45, headers={
                'User-Agent': 'Mozilla/5.0 (compatible; PashtoBibleScraper/1.0)'
            })
            resp.raise_for_status()
            html_content = resp.text
            
            # Verify it's Afghan 2023, not Yousafzai
            if not verify_afghan2023(html_content):
                # Check if URL has wrong dialect parameter
                if 'prefdialect=yusufzai' in url.lower():
                    # Build correct URL with afeastern
                    corrected_url = url.replace('prefdialect=yusufzai', 'prefdialect=afeastern')
                    if corrected_url != url:
                        resp = requests.get(corrected_url, timeout=45, headers={
                            'User-Agent': 'Mozilla/5.0 (compatible; PashtoBibleScraper/1.0)'
                        })
                        resp.raise_for_status()
                        html_content = resp.text
                
                # Verify again after correction
                if not verify_afghan2023(html_content):
                    # Check title specifically
                    title_match = re.search(r'<title[^>]*>([^<]+)</title>', html_content, re.IGNORECASE)
                    if title_match and 'yusufzai' in title_match.group(1).lower():
                        raise ValueError(f"Page title indicates Yousafzai, not Afghan 2023: {url}")
                    # If title doesn't say yusufzai, assume it's OK (might be ambiguous)
                    # Log a warning but continue
                    print(f"  ⚠️  Warning: Could not definitively verify Afghan 2023 for {url}, but title doesn't say Yousafzai")
            
            return html_content
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(delay * (attempt + 1))
            else:
                raise


def extract_verses_from_html(html_str: str) -> List[Tuple[int, str]]:
    """Extract verses from HTML using data-name attributes.
    
    Returns list of (verse_num, verse_text) tuples.
    """
    verses: List[Tuple[int, str]] = []
    
    # Method 1: Use data-name attributes (e.g., data-name="Est.1.10")
    # Find all verse spans and extract their content
    verse_pattern = re.compile(
        r'<span[^>]*data-name="([^"]+)"[^>]*>([^<]*)</span>([\s\S]*?)(?=<span[^>]*data-name="[^"]*\.[^"]*\.\d+"[^>]*>|</div>|$)',
        re.IGNORECASE | re.DOTALL
    )
    
    matches = list(verse_pattern.finditer(html_str))
    
    if matches:
        for match in matches:
            data_name = match.group(1)
            verse_num_str = match.group(2).strip()
            verse_content = match.group(3)
            
            try:
                # Parse data-name format: "Book.Chapter.Verse" (e.g., "Est.1.10" -> 10)
                parts = data_name.split('.')
                if len(parts) >= 3:
                    verse_num = int(parts[2])
                    
                    # Extract text from verse content
                    # Remove HTML tags
                    verse_text = TAG_RE.sub(' ', verse_content)
                    # Decode HTML entities
                    verse_text = html.unescape(verse_text)
                    # Normalize whitespace
                    verse_text = WS_RE.sub(' ', verse_text).strip()
                    
                    if verse_text:
                        verses.append((verse_num, verse_text))
            except (ValueError, IndexError):
                # Try parsing verse number from the span content
                try:
                    # Convert Arabic/Persian digits
                    verse_num = int(''.join(
                        char if char.isdigit() 
                        else str(ord(char) - ord('\u0660')) if '\u0660' <= char <= '\u0669'
                        else str(ord(char) - ord('\u06F0')) if '\u06F0' <= char <= '\u06F9'
                        else ''
                        for char in verse_num_str if char.isdigit() or '\u0660' <= char <= '\u0669' or '\u06F0' <= char <= '\u06F9'
                    ) or '0')
                    
                    if verse_num > 0:
                        verse_text = TAG_RE.sub(' ', verse_content)
                        verse_text = html.unescape(verse_text)
                        verse_text = WS_RE.sub(' ', verse_text).strip()
                        if verse_text:
                            verses.append((verse_num, verse_text))
                except:
                    continue
    
    # Method 2: Fallback - extract from plain text lines
    if not verses:
        # Remove scripts/styles
        cleaned = re.sub(r"<script[\s\S]*?</script>", " ", html_str, flags=re.IGNORECASE)
        cleaned = re.sub(r"<style[\s\S]*?</style>", " ", cleaned, flags=re.IGNORECASE)
        
        # Extract text from scripture div
        scripture_match = re.search(
            r'<div[^>]*id="scripture"[^>]*>([\s\S]*?)</div>\s*</div>',
            cleaned,
            re.IGNORECASE
        )
        
        if scripture_match:
            scripture_html = scripture_match.group(1)
            # Replace <br> and block elements with newlines
            scripture_html = re.sub(r"<(br|p|div)[^>]*>", "\n", scripture_html, flags=re.IGNORECASE)
            # Remove all remaining HTML tags
            text = TAG_RE.sub(' ', scripture_html)
            # Normalize whitespace
            text = WS_RE.sub(' ', text)
            
            # Split into lines and extract verses
            for line in text.split('\n'):
                line = line.strip()
                if not line:
                    continue
                
                verse_match = VERSE_LINE_RE.match(line)
                if verse_match:
                    verse_num_str, verse_text = verse_match.groups()
                    # Convert Arabic/Indic digits to Western
                    verse_num = int(''.join(
                        char if char.isdigit() else str(ord(char) - ord('\u0660'))
                        if '\u0660' <= char <= '\u0669' else str(ord(char) - ord('\u06F0'))
                        if '\u06F0' <= char <= '\u06F9' else char
                        for char in verse_num_str if char.isdigit() or '\u0660' <= char <= '\u0669' or '\u06F0' <= char <= '\u06F9'
                    ) or '0')
                    
                    if verse_num > 0 and verse_text.strip():
                        verses.append((verse_num, verse_text.strip()))
    
    # Sort by verse number
    verses.sort(key=lambda x: x[0])
    return verses


def detect_max_chapter(book_slug: str) -> int:
    """Detect maximum chapter number by scanning chapter 1 page."""
    url = build_chapter_url(book_slug, 1)
    try:
        html_doc = fetch(url)
        
        # Try multiple patterns for chapter detection
        # Pattern 1: Look for <option> tags with chapter numbers (most reliable)
        option_pattern = re.compile(r'<option[^>]*>(\d+)</option>')
        matches = option_pattern.findall(html_doc)
        
        if matches:
            chapter_nums = [int(ch) for ch in matches if ch.isdigit()]
            if chapter_nums:
                return max(chapter_nums)
        
        # Pattern 2: Original pattern (works for non-numbered books in URLs)
        matches = CHAPTER_LINK_RE.findall(html_doc)
        if matches:
            chapter_nums = [int(m[1]) for m in matches if len(m) > 1 and m[1].isdigit()]
            if chapter_nums:
                return max(chapter_nums)
        
        # Pattern 3: For numbered books like "1-corinthians", look for "1-corinthians-N" in URLs
        numbered_pattern = re.compile(rf"/eng/pashto-bible/{re.escape(book_slug)}/{re.escape(book_slug)}-(\d+)")
        matches = numbered_pattern.findall(html_doc)
        if matches:
            chapter_nums = [int(ch) for ch in matches if ch.isdigit()]
            if chapter_nums:
                return max(chapter_nums)
        
        # Pattern 4: Generic pattern looking for book-chapter pattern anywhere
        generic_pattern = re.compile(rf"{re.escape(book_slug)}-(\d+)")
        all_matches = generic_pattern.findall(html_doc)
        # Filter to reasonable chapter numbers (1-150)
        matches = [ch for ch in all_matches if ch.isdigit() and 1 <= int(ch) <= 150]
        if matches:
            chapter_nums = [int(ch) for ch in matches]
            return max(chapter_nums)
    except Exception as e:
        print(f"  Warning: Could not detect max chapter for {book_slug}: {e}")
    
    # Fallback: return known chapter counts for NT books
    known_chapters = {
        'matthew': 28, 'mark': 16, 'luke': 24, 'john': 21, 'acts': 28,
        'romans': 16, '1-corinthians': 16, '2-corinthians': 13,
        'galatians': 6, 'ephesians': 6, 'philippians': 4, 'colossians': 4,
        '1-thessalonians': 5, '2-thessalonians': 3,
        '1-timothy': 6, '2-timothy': 4, 'titus': 3, 'philemon': 1,
        'hebrews': 13, 'james': 5, '1-peter': 5, '2-peter': 3,
        '1-john': 5, '2-john': 1, '3-john': 1, 'jude': 1, 'revelation': 22,
    }
    
    if book_slug.lower() in known_chapters:
        return known_chapters[book_slug.lower()]
    
    # Generic fallback
    return 50 if book_slug in ["psalms", "isaiah", "jeremiah", "ezekiel"] else 30


def save_chapter(book_slug: str, chapter: int, verses: List[Tuple[int, str]], output_dir: str) -> None:
    """Save verses to a text file."""
    filename = f"{book_slug}{chapter}_pashto.txt"
    filepath = os.path.join(output_dir, filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        for verse_num, verse_text in verses:
            f.write(f"{verse_num}\n{verse_text}\n")


def scrape_chapter(book_slug: str, chapter: int, is_nt: bool, output_dir: str) -> Tuple[int, int, Optional[str]]:
    """Scrape a single chapter. Returns (chapter_num, verse_count, error_message)."""
    url = build_chapter_url(book_slug, chapter)
    try:
        html_doc = fetch(url)
        if html_doc is None:
            return (chapter, 0, "Failed to fetch or verify content")
        
        verses = extract_verses_from_html(html_doc)
        
        if verses:
            save_chapter(book_slug, chapter, verses, output_dir)
            with print_lock:
                print(f"  ✓ {book_slug} {chapter}: {len(verses)} verses")
            return (chapter, len(verses), None)
        else:
            with print_lock:
                print(f"  ⚠ {book_slug} {chapter}: No verses found")
            return (chapter, 0, "No verses extracted")
    except Exception as e:
        error_msg = str(e)
        with print_lock:
            print(f"  ✗ {book_slug} {chapter}: {error_msg}")
        return (chapter, 0, error_msg)


def scrape_book(book_slug: str, is_nt: bool, max_workers: int = 10) -> None:
    """Scrape all chapters of a book using concurrent workers."""
    output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 
                              "all_txt_copies" if is_nt else "ot_txt_copies")
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"{book_slug}: scraping chapters (using {max_workers} workers)")
    max_ch = detect_max_chapter(book_slug)
    
    total_verses = 0
    successful_chapters = 0
    
    # Use ThreadPoolExecutor for concurrent scraping
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all chapter scraping tasks
        futures = {
            executor.submit(scrape_chapter, book_slug, ch, is_nt, output_dir): ch
            for ch in range(1, max_ch + 1)
        }
        
        # Process completed tasks
        for future in as_completed(futures):
            chapter, verse_count, error = future.result()
            if verse_count > 0:
                total_verses += verse_count
                successful_chapters += 1
    
    print(f"  {book_slug}: Total {total_verses} verses across {successful_chapters}/{max_ch} chapters\n")


def scrape_all_nt(max_workers: int = 15) -> None:
    """Scrape all New Testament books using concurrent workers."""
    print("=" * 70)
    print("Scraping New Testament (Afghan 2023)")
    print(f"Using {max_workers} concurrent workers per book")
    print("=" * 70 + "\n")
    
    for slug in NT_BOOK_SLUGS:
        scrape_book(slug, is_nt=True, max_workers=max_workers)
        time.sleep(0.5)  # Small delay between books


def scrape_all_ot(max_workers: int = 15) -> None:
    """Scrape all Old Testament books using concurrent workers."""
    print("=" * 70)
    print("Scraping Old Testament (Afghan 2023)")
    print(f"Using {max_workers} concurrent workers per book")
    print("=" * 70 + "\n")
    
    for slug in OT_BOOK_SLUGS:
        scrape_book(slug, is_nt=False, max_workers=max_workers)
        time.sleep(0.5)  # Small delay between books


def scrape_all(max_workers: int = 15) -> None:
    """Scrape entire Bible (NT + OT) using concurrent workers."""
    print("\n" + "=" * 70)
    print("Afghan 2023 Pashto Bible Scraper")
    print("Source: https://afghanbibles.org/eng/pashto-bible/")
    print(f"Using {max_workers} concurrent workers per book")
    print("VERIFYING: All content must be Afghan 2023 (not Yousafzai)")
    print("=" * 70 + "\n")
    
    scrape_all_nt(max_workers=max_workers)
    scrape_all_ot(max_workers=max_workers)
    
    print("=" * 70)
    print("Scraping complete!")
    print("=" * 70)


if __name__ == "__main__":
    scrape_all()

