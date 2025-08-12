#!/usr/bin/env python3
"""
Export consolidated Pashto Bible verses to a single JSON file for web usage.

This scans both New Testament and Old Testament chapter text folders, parses
verse numbers (ASCII, Arabic-Indic, or Eastern Arabic numerals), and emits a
JSON array of objects: { "ref": "Book Chapter:Verse", "text": "..." }.

Usage:
  python3 export_bible_json.py \
      --nt-dir /path/to/all_txt_copies \
      --ot-dir /path/to/ot_txt_copies \
      --out /path/to/pashto_bible.json

Defaults assume running from the project root and will autodetect directories.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from typing import Dict, List, Tuple


def parse_int_mixed_digits(s: str) -> int | None:
    """Parse ASCII, Arabic-Indic (٠-٩), or Eastern Arabic (۰-۹) digits into int.

    Returns int if all chars are digits in one of the above sets; otherwise None.
    """
    try:
        arabic_indic = {ord('٠') + i: str(i) for i in range(10)}  # U+0660..U+0669
        eastern_arabic = {ord('۰') + i: str(i) for i in range(10)}  # U+06F0..U+06F9
        normalized = s.translate({**arabic_indic, **eastern_arabic})
        if not normalized or not all('0' <= ch <= '9' for ch in normalized):
            return None
        return int(normalized)
    except Exception:
        return None


def canonical_book_name(prefix: str) -> str:
    """Convert a filename prefix like 'john' or '1samuel' to a canonical book name.

    For most books, Title-Case the alpha portion and insert a space after any
    leading numeric prefix. A few common NT prefixes are normalized explicitly.
    """
    # Common NT mappings
    nt_map = {
        'acts': 'Acts',
        'colossians': 'Colossians',
        'ephesians': 'Ephesians',
        'galatians': 'Galatians',
        'hebrews': 'Hebrews',
        'james': 'James',
        'john': 'John',
        'jude': 'Jude',
        'luke': 'Luke',
        'mark': 'Mark',
        'matthew': 'Matthew',
        'philemon': 'Philemon',
        'philippians': 'Philippians',
        'revelation': 'Revelation',
        'romans': 'Romans',
        'titus': 'Titus',
        # Include common numeric NTs for completeness
        '1corinthians': '1 Corinthians',
        '2corinthians': '2 Corinthians',
        '1thessalonians': '1 Thessalonians',
        '2thessalonians': '2 Thessalonians',
        '1timothy': '1 Timothy',
        '2timothy': '2 Timothy',
        '1peter': '1 Peter',
        '2peter': '2 Peter',
        '1john': '1 John',
        '2john': '2 John',
        '3john': '3 John',
    }
    if prefix in nt_map:
        return nt_map[prefix]
    # Generic rule: optional leading number, rest letters
    m = re.match(r'^(\d+)?([a-z]+)$', prefix)
    if not m:
        # Fallback: best effort capitalization
        return prefix.capitalize()
    num, letters = m.groups()
    base = letters.capitalize()
    return f"{num} {base}".strip()


def scan_chapter_files(dir_path: str) -> List[Tuple[str, int, List[str]]]:
    """Return a list of (book_name, chapter_number, lines) for each chapter file.

    The function accepts file names like 'john3_pashto.txt' or '1samuel12_pashto.txt'.
    """
    chapters: List[Tuple[str, int, List[str]]] = []
    if not (dir_path and os.path.isdir(dir_path)):
        return chapters
    for filename in sorted(os.listdir(dir_path)):
        if not filename.endswith('_pashto.txt'):
            continue
        base = filename[:-12]  # strip '_pashto.txt'
        m = re.match(r'^(.+?)(\d+)$', base)
        if not m:
            # Unexpected pattern; skip conservatively
            continue
        prefix, chap_str = m.groups()
        # Normalize book prefix and chapter number
        book = canonical_book_name(prefix)
        try:
            chapter = int(chap_str)
        except ValueError:
            continue
        path = os.path.join(dir_path, filename)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            chapters.append((book, chapter, lines))
        except Exception:
            # Ignore unreadable files
            continue
    return chapters


def parse_verses_from_lines(book: str, chapter: int, lines: List[str]) -> List[Dict[str, str]]:
    """Parse verses from a chapter's lines, returning a list of {ref, text} dicts."""
    out: List[Dict[str, str]] = []
    current_verse: int | None = None
    verse_lines: List[str] = []
    for raw in lines:
        line = raw.rstrip()
        m = re.match(r'^([0-9\u0660-\u0669\u06F0-\u06F9]+)\s*(.*)$', line)
        vnum = parse_int_mixed_digits(m.group(1)) if m else None
        if vnum is not None:
            # Commit previous
            if current_verse is not None:
                text = ' '.join(verse_lines).strip()
                if text:
                    out.append({
                        'ref': f"{book} {chapter}:{current_verse}",
                        'text': text,
                    })
            # Start new verse
            current_verse = vnum
            verse_lines = []
            remainder = m.group(2).strip() if m else ''
            if remainder:
                verse_lines.append(remainder)
        else:
            # Continuation of current verse
            if current_verse is not None:
                if line.strip():
                    verse_lines.append(line.strip())
    # Final commit
    if current_verse is not None:
        text = ' '.join(verse_lines).strip()
        if text:
            out.append({
                'ref': f"{book} {chapter}:{current_verse}",
                'text': text,
            })
    return out


def build_bible_json(nt_dir: str | None, ot_dir: str | None) -> List[Dict[str, str]]:
    items: List[Dict[str, str]] = []
    for dir_path in [nt_dir, ot_dir]:
        if not dir_path:
            continue
        for book, chapter, lines in scan_chapter_files(dir_path):
            items.extend(parse_verses_from_lines(book, chapter, lines))
    return items


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Export Pashto Bible verses to JSON")
    parser.add_argument('--nt-dir', default=os.path.join(os.path.dirname(__file__), 'all_txt_copies'), help='NT chapters directory (default: ./all_txt_copies)')
    parser.add_argument('--ot-dir', default=os.path.join(os.path.dirname(__file__), 'ot_txt_copies'), help='OT chapters directory (default: ./ot_txt_copies)')
    parser.add_argument('--out', default=os.path.join(os.path.dirname(__file__), 'pashto_bible.json'), help='Output JSON file (default: ./pashto_bible.json)')
    args = parser.parse_args(argv)

    nt_dir = args.nt_dir if os.path.isdir(args.nt_dir) else None
    ot_dir = args.ot_dir if os.path.isdir(args.ot_dir) else None
    if not nt_dir and not ot_dir:
        print("No input directories found. Nothing to export.")
        return 2

    items = build_bible_json(nt_dir, ot_dir)
    # Sort deterministically by reference for stable output (best-effort)
    def ref_key(d: Dict[str, str]):
        ref = d.get('ref', '')
        # naive split: "Book X:Y" -> (Book, X, Y)
        m = re.match(r'^(.*)\s(\d+):(\d+)$', ref)
        if not m:
            return (ref, 0, 0)
        book, chap, verse = m.groups()
        try:
            return (book, int(chap), int(verse))
        except Exception:
            return (book, chap, verse)
    items.sort(key=ref_key)

    out_path = args.out
    try:
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(items, f, ensure_ascii=False)
        size_mb = os.path.getsize(out_path) / (1024 * 1024)
        print(f"Wrote {len(items):,} verses to {out_path} ({size_mb:.2f} MB)")
    except Exception as e:
        print(f"Failed to write output: {e}")
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())


