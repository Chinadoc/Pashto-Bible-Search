#!/usr/bin/env python3
"""Generate word_frequency_list.json from grammatical_index_v15.json using only stdlib.

Output schema (list of dicts):
  - pashto: str
  - frequency: int
  - romanization: str (from full_dictionary.json when available; otherwise empty)
  - pos: str (from grammatical index identity.type)
"""
import json
import os
from typing import Dict, Any, List


APP_ROOT = os.path.dirname(os.path.abspath(__file__))
INDEX_FILE = os.path.join(APP_ROOT, 'all_txt_copies', 'grammatical_index_v15.json')
DICT_FILE = os.path.join(APP_ROOT, 'full_dictionary.json')
OUT_FILE = os.path.join(APP_ROOT, 'word_frequency_list.json')


def load_index() -> Dict[str, Any]:
    with open(INDEX_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def build_dict_map() -> Dict[str, str]:
    """Return Pashto -> romanization map from full_dictionary.json if present."""
    if not os.path.exists(DICT_FILE):
        return {}
    try:
        with open(DICT_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        entries = data.get('entries', []) if isinstance(data, dict) else data
        p2f: Dict[str, str] = {}
        for ent in entries:
            p = ent.get('p')
            f = ent.get('f')
            if p and f and p not in p2f:
                p2f[p] = f.split(',')[0].strip()
        return p2f
    except Exception:
        return {}


def aggregate(index: Dict[str, Any], dict_map: Dict[str, str]) -> List[Dict[str, Any]]:
    agg: Dict[str, Dict[str, Any]] = {}
    for root, data in index.items():
        for identity in data.get('identities', []):
            pos = identity.get('type', '')
            for items_list in identity.get('forms', {}).values():
                for item in items_list:
                    form_ps = (item.get('form', '') or '').replace('_', ' ')
                    key = form_ps
                    cur = agg.get(key)
                    if not cur:
                        cur = {
                            'pashto': form_ps,
                            'frequency': 0,
                            'romanization': dict_map.get(form_ps, ''),
                            'pos': pos or 'unknown',
                        }
                        agg[key] = cur
                    cur['frequency'] += int(item.get('count', 0))
                    # Prefer a more specific POS if current is unknown and identity has one
                    if cur['pos'] == 'unknown' and pos:
                        cur['pos'] = pos
    results = list(agg.values())
    results.sort(key=lambda x: x['frequency'], reverse=True)
    return results


def main() -> int:
    if not os.path.exists(INDEX_FILE):
        print(f"Error: index file not found at {INDEX_FILE}")
        return 1
    index = load_index()
    dict_map = build_dict_map()
    results = aggregate(index, dict_map)
    with open(OUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"Wrote {len(results)} entries to {OUT_FILE}")
    return 0


if __name__ == '__main__':
    raise SystemExit(main())


