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
    url = f"{BASE}/{book_slug}/{book_slug}-1"
    doc = fetch(url)
    # Find all chapter links; take max
    chapters = [int(m.group(2)) for m in CHAPTER_LINK_RE.finditer(doc) if m.group(1) == book_slug]
    return max(chapters) if chapters else 1


def extract_verses_from_page(html_doc: str) -> list[str]:
    text = html_to_text(html_doc)
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    verses: list[str] = []
    for ln in lines:
        m = VERSE_LINE_RE.match(ln)
        if m:
            verses.append(f"{m.group(1)} {m.group(2).strip()}")
    # Fallback: if nothing matched, return the lines block as single paragraph
    if not verses:
        return lines
    return verses


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
        scrape_book(slug)


if __name__ == "__main__":
    scrape_all_ot()


