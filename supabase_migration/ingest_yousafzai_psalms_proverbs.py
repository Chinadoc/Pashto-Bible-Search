"""Fetch Pashto Yousafzai (2019) Psalms & Proverbs from AfghanBibles.org
and upsert them into Supabase (public.verses_yousafzai).

Requires environment variables:
  NEXT_PUBLIC_SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
  (Ensure ffmpeg binary is available on PATH for audio slicing.)

Usage:
  python supabase_migration/ingest_yousafzai_psalms_proverbs.py

The script is idempotent – it upserts verses per (book, chapter, verse).
"""

from __future__ import annotations

import base64
import html
import json
import math
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from urllib.parse import quote

import requests

BASE = "https://afghanbibles.org/eng/pashto-bible"
AUDIO_BASE = "https://afghanbibles.org/pashto-yusufzai-audio"
DIALECT_QUERY = "yusufzai"
DATASET_TRANSLATION = "Yousafzai 2019"
DATASET_DIALECT = "yousafzai"
TESTAMENT = "OT"
AUDIO_BUCKET = "audio"

BOOKS = [
    {"slug": "psalms", "name": "Psalms", "chapters": 150},
    {"slug": "proverbs", "name": "Proverbs", "chapters": 31},
]

# Regex reused from the earlier OT scraper
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
    last_exc: Optional[Exception] = None
    for attempt in range(1, retries + 1):
        try:
            resp = requests.get(url, timeout=45)
            resp.raise_for_status()
            return resp.text
        except Exception as exc:  # pragma: no cover - network failures
            last_exc = exc
            wait = delay * attempt
            print(f"Warning: fetch failed ({exc}). retrying in {wait:.1f}s", file=sys.stderr)
            time.sleep(wait)
    raise RuntimeError(f"Failed to fetch {url}: {last_exc}")


def html_to_text(html_str: str) -> str:
    cleaned = re.sub(r"<script[\s\S]*?</script>", " ", html_str, flags=re.IGNORECASE)
    cleaned = re.sub(r"<style[\s\S]*?</style>", " ", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"<(br|p|div|li|h\d)[^>]*>", "\n", cleaned, flags=re.IGNORECASE)
    cleaned = TAG_RE.sub(" ", cleaned)
    cleaned = WS_RE.sub(" ", cleaned)
    cleaned = html.unescape(cleaned)
    cleaned = cleaned.replace("\u00a0", " ")
    cleaned = re.sub(r"\s*\n\s*", " ", cleaned)
    return cleaned.strip()


def decode_tag_payload(encoded: str) -> List[List]:
    """Decode the compressed timeline payload found in the jktags input."""
    rev = encoded[::-1]
    # Important: replace longer tokens first to prevent overlap
    replacements = (('&41', '===='), ('&3', '==='), ('&2', '=='), ('&1', '='))
    for orig, repl in replacements:
        rev = rev.replace(orig, repl)

    def rot13(s: str) -> str:
        out_chars: List[str] = []
        for ch in s:
            if 'a' <= ch <= 'z':
                out_chars.append(chr((ord(ch) - 97 + 13) % 26 + 97))
            elif 'A' <= ch <= 'Z':
                out_chars.append(chr((ord(ch) - 65 + 13) % 26 + 65))
            else:
                out_chars.append(ch)
        return ''.join(out_chars)

    rot = rot13(rev)
    decoded = base64.b64decode(rot).decode('utf-8')
    try:
        return json.loads(f"[{decoded}]")
    except json.JSONDecodeError:
        return []


def extract_verses(html_doc: str, book_name: str, chapter: int) -> List[Dict]:
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
        })
    return verses


def attach_tag_segments(html_doc: str, verses: List[Dict]):
    match = re.search(r'id=[\"\']jktags[\"\'][^>]*data-tags=[\"\']([^\"\']+)[\"\']', html_doc)
    if not match:
        return
    payload = decode_tag_payload(match.group(1))
    if not payload:
        return

    segments_by_verse: Dict[int, List[List]] = {}
    for entry in payload:
        if len(entry) < 4:
            continue
        marker = entry[2]
        if not isinstance(marker, int):
            continue
        segments_by_verse.setdefault(marker, []).append(entry)

    for verse in verses:
        verse_num = verse["verse"]
        if verse_num in segments_by_verse:
            verse["tags"] = segments_by_verse[verse_num]


def build_audio_url(slug: str, chapter: int) -> str:
    return f"{AUDIO_BASE}/{slug}-{chapter}.mp3"


def compute_bounds(tag_entries: Optional[List[List]]) -> Optional[Tuple[float, float]]:
    if not tag_entries:
        return None
    start = math.inf
    end = -math.inf
    for entry in tag_entries:
        if not isinstance(entry, list) or len(entry) < 2:
            continue
        seg_start, seg_end = entry[0], entry[1]
        if not isinstance(seg_start, (int, float)) or not isinstance(seg_end, (int, float)):
            continue
        start = min(start, float(seg_start))
        end = max(end, float(seg_end))
    if not math.isfinite(start) or not math.isfinite(end) or end <= start:
        return None
    # Add a small buffer to avoid clipping words at the edges
    padding_start = 0.15
    padding_end = 0.25
    start = max(0.0, start - padding_start)
    end = end + padding_end
    if end - start < 0.4:
        mid = (start + end) / 2
        start = max(0.0, mid - 0.25)
        end = mid + 0.25
    return (start, end)


def gather_book(book_slug: str, book_name: str, chapters: int) -> List[Dict]:
    collected: List[Dict] = []
    for chapter in range(1, chapters + 1):
        url = f"{BASE}/{book_slug}/{book_slug}-{chapter}?prefdialect={DIALECT_QUERY}"
        html_doc = fetch(url)
        verses = extract_verses(html_doc, book_name, chapter)
        if not verses:
            print(f"Warning: no verses extracted for {book_name} {chapter}", file=sys.stderr)
            continue
        attach_tag_segments(html_doc, verses)
        audio_url = build_audio_url(book_slug, chapter)
        for v in verses:
            v["audio_chapter_url"] = audio_url
            v["source_url"] = url
            v["translation"] = DATASET_TRANSLATION
            v["dialect"] = DATASET_DIALECT
            v["testament"] = TESTAMENT
            v["book_slug"] = book_slug
            bounds = compute_bounds(v.get("tags"))
            if bounds:
                v["audio_bounds"] = bounds
        collected.extend(verses)
        time.sleep(0.4)
    return collected


def ensure_ffmpeg() -> None:
    if shutil.which("ffmpeg") is None:
        raise RuntimeError("ffmpeg binary not found. Please install ffmpeg and ensure it is on PATH.")


def download_chapter_audio(audio_url: str, book_slug: str, chapter: int, target_dir: Path) -> Path:
    target_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{book_slug}_{chapter:03d}.mp3"
    dest_path = target_dir / filename
    if dest_path.exists() and dest_path.stat().st_size > 0:
        return dest_path
    print(f"  ▶ Downloading audio: {audio_url}")
    resp = requests.get(audio_url, stream=True, timeout=90)
    resp.raise_for_status()
    with open(dest_path, "wb") as f:
        for chunk in resp.iter_content(chunk_size=65536):
            if chunk:
                f.write(chunk)
    return dest_path


def slice_audio_segment(src_path: Path, start: float, end: float, dest_path: Path) -> None:
    duration = max(0.2, end - start)
    cmd = [
        "ffmpeg",
        "-hide_banner",
        "-loglevel",
        "error",
        "-i",
        str(src_path),
        "-ss",
        f"{start:.3f}",
        "-t",
        f"{duration:.3f}",
        "-c:a",
        "libmp3lame",
        "-ar",
        "44100",
        "-ac",
        "1",
        "-q:a",
        "4",
        "-y",
        str(dest_path),
    ]
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as exc:
        raise RuntimeError(
            f"ffmpeg failed while slicing {src_path} ({start:.2f}-{end:.2f}s): {exc}"
        ) from exc


def storage_filename(book_slug: str, chapter: int, verse: int) -> str:
    return f"yousafzai_{book_slug}{chapter:03d}_verse_{verse:03d}.mp3"


def upload_audio_clip(supabase_url: str, service_key: str, file_path: Path, target_name: str) -> str:
    endpoint = f"{supabase_url}/storage/v1/object/{AUDIO_BUCKET}/{target_name}"
    headers = {
        "Authorization": f"Bearer {service_key}",
        "apikey": service_key,
        "Content-Type": "audio/mpeg",
        "x-upsert": "true",
    }
    with open(file_path, "rb") as f:
        resp = requests.post(endpoint, headers=headers, data=f.read())
    if resp.status_code not in (200, 201):
        raise RuntimeError(f"Failed to upload {target_name}: {resp.status_code} {resp.text}")
    public = f"{supabase_url}/storage/v1/object/public/{AUDIO_BUCKET}/{quote(target_name)}"
    return public


def process_audio_clips(supabase_url: str, service_key: str, verses: List[Dict]) -> None:
    ensure_ffmpeg()
    temp_dir = Path(tempfile.mkdtemp(prefix="yousafzai_audio_"))
    chapter_cache: Dict[Tuple[str, int], Path] = {}
    try:
        for verse in verses:
            bounds = verse.get("audio_bounds")
            audio_url = verse.get("audio_chapter_url")
            book_slug = verse.get("book_slug")
            chapter = verse.get("chapter")
            verse_num = verse.get("verse")
            if not bounds or not audio_url or not book_slug or chapter is None or verse_num is None:
                continue
            cache_key = (book_slug, int(chapter))
            src = chapter_cache.get(cache_key)
            if src is None:
                src = download_chapter_audio(audio_url, book_slug, int(chapter), temp_dir)
                chapter_cache[cache_key] = src
            clip_path = temp_dir / f"clip_{book_slug}_{int(chapter):03d}_{int(verse_num):03d}.mp3"
            start, end = bounds
            slice_audio_segment(src, float(start), float(end), clip_path)
            storage_name = storage_filename(book_slug, int(chapter), int(verse_num))
            public_url = upload_audio_clip(supabase_url, service_key, clip_path, storage_name)
            verse["audio_public_url"] = public_url
            verse["audio_chapter_url"] = public_url
            verse["audio_storage_filename"] = storage_name
            print(f"  ✓ Uploaded {storage_name}")
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


def chunk(seq: List[Dict], size: int = 100) -> List[List[Dict]]:
    return [seq[i : i + size] for i in range(0, len(seq), size)]


def supabase_headers(service_key: str) -> Dict[str, str]:
    return {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }


ALLOWED_COLUMNS = {
    "book",
    "chapter",
    "verse",
    "text",
    "text_html",
    "tags",
    "translation",
    "dialect",
    "testament",
    "audio_chapter_url",
    "source_url",
}


def prepare_payload(rows: List[Dict]) -> List[Dict]:
    payload: List[Dict] = []
    for row in rows:
        filtered = {k: row[k] for k in ALLOWED_COLUMNS if k in row}
        payload.append(filtered)
    return payload


def upsert_rows(supabase_url: str, service_key: str, rows: List[Dict]):
    endpoint = f"{supabase_url}/rest/v1/verses_yousafzai"
    headers = supabase_headers(service_key)
    for batch in chunk(rows, 250):
        payload = prepare_payload(batch)
        resp = requests.post(endpoint, headers=headers, json=payload)
        if resp.status_code not in (200, 201, 204):
            raise RuntimeError(f"Supabase upsert failed: {resp.status_code} {resp.text}")
        time.sleep(0.2)


def create_table_if_needed(url: str, service_key: str):
    # First try to select from the table to see if it exists
    headers = supabase_headers(service_key)
    resp = requests.get(f"{url}/rest/v1/verses_yousafzai?select=id&limit=1", headers=headers)

    if resp.status_code == 200:
        # Table exists, clear it
        resp = requests.delete(f"{url}/rest/v1/verses_yousafzai", headers=headers)
        if resp.status_code not in (200, 204):
            print(f"Warning: Failed clearing verses_yousafzai: {resp.status_code} {resp.text}")
    else:
        # Table doesn't exist, we'll create it via the upsert operation with on_conflict
        print("Table verses_yousafzai will be created automatically via upsert")


def main():
    supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not supabase_url or not service_key:
        print("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY", file=sys.stderr)
        sys.exit(1)

    all_rows: List[Dict] = []
    for book in BOOKS:
        print(f"Fetching {book['name']}...")
        rows = gather_book(book['slug'], book['name'], book['chapters'])
        print(f"  {len(rows)} rows")
        all_rows.extend(rows)

    if not all_rows:
        print("No rows gathered; aborting", file=sys.stderr)
        return

    print(f"Total rows to upsert: {len(all_rows)}")
    print("Processing audio clips and uploading to storage...")
    process_audio_clips(supabase_url, service_key, all_rows)
    create_table_if_needed(supabase_url, service_key)
    upsert_rows(supabase_url, service_key, all_rows)
    print("Done.")


if __name__ == "__main__":
    main()
