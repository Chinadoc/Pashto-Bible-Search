"""
Prebuild grammar caches for the app without importing Streamlit.

Outputs in the project root:
  - form_to_root_map.json
  - form_occurrence_index.json

Usage:
  python3 prebuild_caches.py
"""

import os
import time
import json

from search_utils import create_form_to_root_map, build_form_occurrence_index

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
INDEX_FILE = os.path.join(APP_ROOT, 'all_txt_copies', 'grammatical_index_v15.json')
FORM_TO_ROOT_FILE = os.path.join(APP_ROOT, 'form_to_root_map.json')
FORM_OCCURRENCE_FILE = os.path.join(APP_ROOT, 'form_occurrence_index.json')


def main():
    t0 = time.time()
    print("[prebuild] Loading grammatical index...")
    with open(INDEX_FILE, 'r', encoding='utf-8') as f:
        idx = json.load(f)

    print("[prebuild] Building form_to_root_map...")
    f2r = create_form_to_root_map(idx)
    with open(FORM_TO_ROOT_FILE, 'w', encoding='utf-8') as f:
        json.dump(f2r, f, ensure_ascii=False)
    print(f"[prebuild] Wrote {len(f2r):,} entries -> {FORM_TO_ROOT_FILE}")

    print("[prebuild] Building form_occurrence_index...")
    foi = build_form_occurrence_index(idx)
    with open(FORM_OCCURRENCE_FILE, 'w', encoding='utf-8') as f:
        json.dump(foi, f, ensure_ascii=False)
    print(f"[prebuild] Wrote {len(foi):,} forms -> {FORM_OCCURRENCE_FILE}")

    # Quick integrity check: sample a few entries
    sample = list(foi.items())[:3]
    print("[prebuild] sample entries:")
    print(json.dumps({k: {"count": v.get("count", 0), "verses": v.get("verses", [])[:2]} for k, v in sample}, ensure_ascii=False, indent=2))

    print(f"[prebuild] Done in {time.time() - t0:.1f}s")


if __name__ == "__main__":
    main()


