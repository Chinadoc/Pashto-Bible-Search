#!/usr/bin/env python3
"""Validate google_drive_audio_urls.json entries.

Usage:
    python scripts/validate_google_drive_audio.py \
        --input google_drive_audio_urls.json \
        --output reports/google_drive_audio_validation.json

The script reports:
  * total entries and per-book counts
  * entries missing or using placeholder Google Drive file IDs
  * entries with missing book/chapter/verse metadata
  * duplicates where the same Drive ID is assigned to multiple files
"""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Dict, Any

PLACEHOLDER_IDS = {None, "", "FILE_ID_HERE", "TEST_ID", "PLACEHOLDER"}

ID_PATTERN = re.compile(r"^[A-Za-z0-9_-]{10,}$")


def normalise_book(book: str | None) -> str:
    if not book:
        return ""
    book = book.strip()
    if not book:
        return ""
    # normalise casing (first letter uppercase, rest lower except numbers)
    return book[0].upper() + book[1:]


def validate_entries(entries: Dict[str, Any]) -> Dict[str, Any]:
    total = len(entries)
    missing_metadata = []
    placeholder_ids = []
    invalid_ids = []
    by_book = Counter()
    id_to_files = defaultdict(list)

    for filename, payload in entries.items():
        book = normalise_book(payload.get("book"))
        chapter = payload.get("chapter")
        verse = payload.get("verse")
        file_id = payload.get("google_drive_file_id")

        if book:
            by_book[book] += 1

        if not (book and isinstance(chapter, int) and isinstance(verse, int)):
            missing_metadata.append({
                "filename": filename,
                "book": payload.get("book"),
                "chapter": chapter,
                "verse": verse,
            })

        if file_id in PLACEHOLDER_IDS:
            placeholder_ids.append({
                "filename": filename,
                "book": book,
                "chapter": chapter,
                "verse": verse,
            })
        elif isinstance(file_id, str):
            if not ID_PATTERN.match(file_id):
                invalid_ids.append({
                    "filename": filename,
                    "book": book,
                    "chapter": chapter,
                    "verse": verse,
                    "file_id": file_id,
                })
            else:
                id_to_files[file_id].append(filename)
        else:
            invalid_ids.append({
                "filename": filename,
                "book": book,
                "chapter": chapter,
                "verse": verse,
                "file_id": file_id,
            })

    duplicate_ids = {
        file_id: files
        for file_id, files in id_to_files.items()
        if len(files) > 1
    }

    return {
        "total_entries": total,
        "unique_books": len(by_book),
        "entries_by_book": by_book.most_common(),
        "missing_metadata_count": len(missing_metadata),
        "missing_metadata": missing_metadata,
        "placeholder_id_count": len(placeholder_ids),
        "placeholder_ids": placeholder_ids,
        "invalid_id_count": len(invalid_ids),
        "invalid_ids": invalid_ids,
        "duplicate_id_count": len(duplicate_ids),
        "duplicate_ids": duplicate_ids,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate Google Drive audio mapping data")
    parser.add_argument("--input", default="google_drive_audio_urls.json", help="Path to mapping JSON")
    parser.add_argument("--output", help="Optional path to write a JSON report")
    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.exists():
        raise SystemExit(f"Input file not found: {input_path}")

    entries = json.loads(input_path.read_text("utf-8"))
    report = validate_entries(entries)

    # Print concise summary to stdout
    print("Total entries:", report["total_entries"])
    print("Books covered:", report["unique_books"])
    print("Entries missing metadata:", report["missing_metadata_count"])
    print("Placeholder IDs:", report["placeholder_id_count"])
    print("Invalid IDs:", report["invalid_id_count"])
    print("Duplicate IDs:", report["duplicate_id_count"])

    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(report, indent=2), "utf-8")
        print(f"Detailed report saved to {output_path}")


if __name__ == "__main__":
    main()
