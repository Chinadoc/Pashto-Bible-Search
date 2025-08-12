"""
Bible text loader utilities (shared by exporter, index builders, and UI).

Provides canonical functions for parsing mixed digits, mapping filename
prefixes to book names, and loading verse maps from chapter text folders.
"""

from __future__ import annotations

import os
import re
from typing import Dict, List


def parse_mixed_digits_ps(s: str) -> int | None:
    """Parse ASCII, Arabic-Indic (٠-٩), or Eastern Arabic (۰-۹) digits into int."""
    if not s:
        return None
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
    """Convert a filename prefix like 'john' or '1samuel' to canonical book name."""
    nt_map = {
        'acts': 'Acts', 'colossians': 'Colossians', 'ephesians': 'Ephesians', 'galatians': 'Galatians',
        'hebrews': 'Hebrews', 'james': 'James', 'john': 'John', 'jude': 'Jude', 'luke': 'Luke',
        'mark': 'Mark', 'matthew': 'Matthew', 'philemon': 'Philemon', 'philippians': 'Philippians',
        'revelation': 'Revelation', 'romans': 'Romans', 'titus': 'Titus',
        '1corinthians': '1 Corinthians', '2corinthians': '2 Corinthians',
        '1thessalonians': '1 Thessalonians', '2thessalonians': '2 Thessalonians',
        '1timothy': '1 Timothy', '2timothy': '2 Timothy', '1peter': '1 Peter', '2peter': '2 Peter',
        '1john': '1 John', '2john': '2 John', '3john': '3 John',
    }
    if prefix in nt_map:
        return nt_map[prefix]
    m = re.match(r'^(\d+)?([a-z]+)$', prefix)
    if not m:
        return prefix.capitalize()
    num, letters = m.groups()
    base = letters.capitalize()
    return f"{num} {base}".strip()


def load_text_from_dir(dir_path: str) -> Dict[str, str]:
    """Load a verse map from a directory of `*_pashto.txt` chapter files."""
    bible: Dict[str, str] = {}
    if not os.path.isdir(dir_path):
        return bible
    for filename in os.listdir(dir_path):
        if not filename.endswith('_pashto.txt'):
            continue
        base = filename[:-12]  # strip suffix
        m = re.match(r'^(.+?)(\d+)$', base)
        if not m:
            continue
        prefix, chap_str = m.groups()
        try:
            chapter = int(chap_str)
        except ValueError:
            continue
        book = canonical_book_name(prefix)
        path = os.path.join(dir_path, filename)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
        except Exception:
            continue
        current_verse = None
        verse_lines: List[str] = []
        for raw in lines:
            line = raw.rstrip()
            m2 = re.match(r'^([0-9\u0660-\u0669\u06F0-\u06F9]+)\s*(.*)$', line)
            vnum = parse_mixed_digits_ps(m2.group(1)) if m2 else None
            if vnum is not None:
                if current_verse is not None:
                    bible[f"{book} {chapter}:{current_verse}"] = ' '.join(verse_lines).strip()
                current_verse = vnum
                verse_lines = []
                remainder = (m2.group(2) or '').strip() if m2 else ''
                if remainder:
                    verse_lines.append(remainder)
            elif current_verse is not None:
                verse_lines.append(line.strip())
        if current_verse is not None:
            bible[f"{book} {chapter}:{current_verse}"] = ' '.join(verse_lines).strip()
    return bible


def load_bible_map(nt_dir: str | None, ot_dir: str | None) -> Dict[str, str]:
    out: Dict[str, str] = {}
    if nt_dir:
        out.update(load_text_from_dir(nt_dir))
    if ot_dir:
        out.update(load_text_from_dir(ot_dir))
    return out


