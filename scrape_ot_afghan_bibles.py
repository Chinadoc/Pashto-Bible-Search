"""Scrape Pashto Old Testament (Afghan Bibles) into plain-text chapter files.

Source: https://afghanbibles.org/eng/pashto-bible/
Example book page: https://afghanbibles.org/eng/pashto-bible/psalms/psalms-1

Output directory: `ot_txt_copies/`
Files: `<bookslug><chapter>_pashto.txt` (e.g., `psalms1_pashto.txt`)

Notes:
- Uses only the Python standard library (no BeautifulSoup).
- Heuristically finds chapter count by scanning chapter links of the form
  `/{slug}/{slug}-<n>` on chapter 1 page.
- Extracts verses by stripping HTML and capturing lines that begin with a
  verse number (Arabic/Indic digits supported) followed by text.
- Designed to be idempotent; re-scraping overwrites files.
"""

from __future__ import annotations

import os
import re
import time
import html
import requests

BASE = "https://afghanbibles.org/eng/pashto-bible"
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ot_txt_copies")
os.makedirs(OUT_DIR, exist_ok=True)

# Ordered list of Old Testament book slugs used by Afghan Bibles
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
VERSE_LINE_RE = re.compile(r"^\s*([0-9\u06F0-\u06F9\u0660-\u0669]+)\s+(.*)")


def fetch(url: str) -> str:
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    return resp.text


def html_to_text(html_str: str) -> str:
    # Remove scripts/styles
    cleaned = re.sub(r"<script[\s\S]*?</script>", " ", html_str, flags=re.IGNORECASE)
    cleaned = re.sub(r"<style[\s\S]*?</style>", " ", cleaned, flags=re.IGNORECASE)
    # Replace <br> and <p> with newlines to preserve breaks
    cleaned = re.sub(r"<(br|p|div|li|h\d)[^>]*>", "\n", cleaned, flags=re.IGNORECASE)
    cleaned = TAG_RE.sub(" ", cleaned)
    cleaned = html.unescape(cleaned)
    cleaned = WS_RE.sub(" ", cleaned)
    # Normalize line breaks
    cleaned = re.sub(r"\s*\n\s*", "\n", cleaned)
    return cleaned.strip()


def detect_max_chapter(book_slug: str) -> int:
    # Try chapter 1 page
    url = f"{BASE}/{book_slug}/{book_slug}-1"
    doc = fetch(url)
    chapters = [int(m.group(2)) for m in CHAPTER_LINK_RE.finditer(doc) if m.group(1) == book_slug]
    # Some books may list chapters on base slug without trailing /-1
    if not chapters:
        try:
            base_doc = fetch(f"{BASE}/{book_slug}")
            chapters = [int(m.group(2)) for m in CHAPTER_LINK_RE.finditer(base_doc) if m.group(1) == book_slug]
        except Exception:
            pass
    return max(chapters) if chapters else 1


def extract_verses_from_page(html_doc: str) -> list[str]:
    # Narrow to main content around the chapter by slicing between nav markers
    doc = html_doc
    for marker in ["Previous chapter", "Next chapter"]:
        # ensure markers visible for split
        pass
    start_idx = doc.find("Previous chapter")
    if start_idx != -1:
        doc = doc[start_idx:]
    end_idx = doc.find("Next chapter")
    if end_idx != -1:
        doc = doc[:end_idx]

    # Convert to plain text and split on likely block boundaries
    text = html_to_text(doc)
    blocks = re.split(r"\n+", text)
    verses: list[str] = []
    for blk in blocks:
        blk = blk.strip()
        if not blk:
            continue
        # Accept patterns like "1 text" or "۱ text"
        m = VERSE_LINE_RE.match(blk)
        if m:
            verses.append(f"{m.group(1)} {m.group(2).strip()}")
        else:
            # Some lines may embed multiple verses. Split on digit boundaries.
            parts = re.split(r"(?=\s*[0-9\u06F0-\u06F9\u0660-\u0669]{1,3}\s+)", blk)
            for part in parts:
                pm = VERSE_LINE_RE.match(part.strip())
                if pm:
                    verses.append(f"{pm.group(1)} {pm.group(2).strip()}")

    # Last resort: if nothing detected, return cleaned blocks
    return verses if verses else [b for b in blocks if b]


def save_chapter(book_slug: str, chapter: int, verses: list[str]) -> None:
    fname = f"{book_slug.replace('-', '')}{chapter}_pashto.txt"
    path = os.path.join(OUT_DIR, fname)
    with open(path, "w", encoding="utf-8") as f:
        for v in verses:
            f.write(v.strip() + "\n")


def scrape_book(book_slug: str, delay_sec: float = 0.5) -> None:
    try:
        max_ch = detect_max_chapter(book_slug)
    except Exception as e:
        print(f"[WARN] Could not detect chapters for {book_slug}: {e}. Defaulting to 1.")
        max_ch = 1
    print(f"{book_slug}: {max_ch} chapters")
    for ch in range(1, max_ch + 1):
        url = f"{BASE}/{book_slug}/{book_slug}-{ch}"
        try:
            html_doc = fetch(url)
            verses = extract_verses_from_page(html_doc)
            save_chapter(book_slug, ch, verses)
            print(f"  saved {book_slug} {ch}: {len(verses)} lines")
        except Exception as e:
            print(f"  [ERROR] {book_slug} {ch}: {e}")
        time.sleep(delay_sec)


def scrape_all_ot() -> None:
    for slug in OT_BOOK_SLUGS:
        scrape_book(slug, delay_sec=0.8)


if __name__ == "__main__":
    scrape_all_ot()


