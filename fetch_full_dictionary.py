#!/usr/bin/env python3
"""Fetch LingDocs Pashto dictionary without external packages.

This tries JSON endpoints first and falls back to saving the binary
dictionary if JSON is not available.

Outputs:
- full_dictionary.json (if JSON available)
- full_dictionary.bin   (if only binary available)
"""
import json
import os
import sys
import urllib.request
from typing import Optional


DICTIONARY_URLS = [
    "https://storage.lingdocs.com/dictionary/dictionary.json",  # hopeful JSON variant
    "https://storage.lingdocs.com/dictionary/dictionary",       # likely protobuf/binary
]

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
JSON_OUT = os.path.join(APP_ROOT, "full_dictionary.json")
BIN_OUT = os.path.join(APP_ROOT, "full_dictionary.bin")


def fetch_bytes(url: str) -> bytes:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json, */*",
        },
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read()


def try_parse_json(data: bytes) -> Optional[object]:
    try:
        # Try UTF-8 decode first
        text = data.decode("utf-8")
        return json.loads(text)
    except Exception:
        return None


def main() -> int:
    last_bytes: Optional[bytes] = None
    for url in DICTIONARY_URLS:
        try:
            print(f"Fetching: {url}")
            data = fetch_bytes(url)
            parsed = try_parse_json(data)
            if parsed is not None and (isinstance(parsed, (list, dict)) and len(parsed) > 0):
                with open(JSON_OUT, "w", encoding="utf-8") as f:
                    json.dump(parsed, f, ensure_ascii=False, indent=2)
                print(f"Saved JSON dictionary to {JSON_OUT} with {len(parsed) if hasattr(parsed, '__len__') else 'unknown'} entries")
                return 0
            # keep bytes for possible binary save
            last_bytes = data
        except Exception as e:
            print(f"Warning: failed to fetch {url}: {e}")

    if last_bytes:
        with open(BIN_OUT, "wb") as f:
            f.write(last_bytes)
        print(f"Saved binary dictionary to {BIN_OUT} (JSON not available)")
        return 0

    print("Error: Could not fetch dictionary from any endpoint")
    return 1


if __name__ == "__main__":
    sys.exit(main())


