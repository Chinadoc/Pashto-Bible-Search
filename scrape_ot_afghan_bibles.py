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
DIALECT = "afeastern"
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
SCRIPTURE_DIV_RE = re.compile(r"<div id=\"scripture\"[\s\S]*?>([\s\S]*?)</div>\s*</div><!--notranslate-->", re.IGNORECASE)
VERSE_BLOCK_RE = re.compile(r"<span class=\"verseno c\"[^>]*id=\"v(\d+)\"[^>]*>.*?</span>([\s\S]*?)<span class=\"endverse\"></span>", re.IGNORECASE)
TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"\s+")
VERSE_LINE_RE = re.compile(r"^\s*([0-9\u06F0-\u06F9\u0660-\u0669]+)\s+(.*)")


def build_chapter_url(book_slug: str, chapter: int) -> str:
    base = f"{BASE}/{book_slug}/{book_slug}-{chapter}"
    return f"{base}?prefdialect={DIALECT}"


def fetch(url: str) -> str:
    resp = requests.get(url, timeout=45)
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
    # Inspect chapter 1 page for navigation select options
    url = build_chapter_url(book_slug, 1)
    doc = fetch(url)
    options = re.findall(rf"<option value='(\d+)'[^>]*>\1</option>", doc)
    if options:
        try:
            return max(int(x) for x in options)
        except Exception:
            pass
    # Fallback to link scanning
    chapters = [int(m.group(2)) for m in CHAPTER_LINK_RE.finditer(doc) if m.group(1) == book_slug]
    return max(chapters) if chapters else 1


def extract_verses_from_page(html_doc: str) -> list[str]:
    # Grab only the scripture container
    m = SCRIPTURE_DIV_RE.search(html_doc)
    if not m:
        return []
    script_html = m.group(1)
    verses: list[str] = []
    for vm in VERSE_BLOCK_RE.finditer(script_html):
        vn = vm.group(1)
        body_html = vm.group(2)
        body_txt = html_to_text(body_html)
        body_txt = body_txt.replace('\u00a0', ' ').strip()
        # Collapse multiple newlines, join with spaces
        body_txt = re.sub(r"\s*\n\s*", " ", body_txt)
        # Prefix Arabic/Persian verse number as-is if present in page; otherwise use vn
        num_match = re.search(r"^[0-9\u06F0-\u06F9\u0660-\u0669]+", body_html)
        display_num = num_match.group(0) if num_match else vn
        verses.append(f"{display_num} {body_txt}")
    return verses


def save_chapter(book_slug: str, chapter: int, verses: list[str]) -> None:
    fname = f"{book_slug.replace('-', '')}{chapter}_pashto.txt"
    path = os.path.join(OUT_DIR, fname)
    with open(path, "w", encoding="utf-8") as f:
        for v in verses:
            f.write(v.strip() + "\n")


def scrape_book(book_slug: str, delay_sec: float = 0.6) -> None:
    print(f"{book_slug}: scraping chapters (auto-follow)")
    ch = 1
    max_ch = detect_max_chapter(book_slug)
    while ch <= max_ch:
        url = build_chapter_url(book_slug, ch)
        try:
            html_doc = fetch(url)
            verses = extract_verses_from_page(html_doc)
            save_chapter(book_slug, ch, verses)
            print(f"  saved {book_slug} {ch}: {len(verses)} lines")
            ch += 1
            time.sleep(delay_sec)
        except Exception as e:
            print(f"  [ERROR] {book_slug} {ch}: {e}")
            ch += 1


def scrape_all_ot() -> None:
    for slug in OT_BOOK_SLUGS:
        scrape_book(slug, delay_sec=0.8)


if __name__ == "__main__":
    scrape_all_ot()


