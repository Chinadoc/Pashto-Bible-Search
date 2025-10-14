"""Build a New Testament reference mapping (word -> POS/romanization/ts/count).

Data sources:
- Bible Pashto NT text files in `all_txt_copies/*_pashto.txt`
- LingDocs dictionary JSON `full_dictionary.json`

Output:
- `nt_reference.json`: array of entries sorted by count desc
  Each entry: {
    pashto, count, romanization, pos, ts, english
  }

This speeds up categorization in the UI by avoiding repeated lookups.

References:
- LingDocs word page (example): https://dictionary.lingdocs.com/word?id=1527820284
- LingDocs inflection patterns: https://grammar.lingdocs.com/inflection/inflection-patterns/#1-basic
"""

from __future__ import annotations

import json
import os
import re
from collections import Counter
from typing import Dict, List

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(APP_ROOT, 'all_txt_copies')
DICT_PATH = os.path.join(APP_ROOT, 'full_dictionary.json')
OUT_PATH = os.path.join(APP_ROOT, 'nt_reference.json')


def normalize_pashto_char(text: str) -> str:
    replacements = {'ي': 'ی', 'ى': 'ی', 'ئ': 'ی'}
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def load_dictionary_map() -> Dict[str, List[dict]]:
    if not os.path.exists(DICT_PATH):
        return {}
    try:
        with open(DICT_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        entries = data.get('entries', []) if isinstance(data, dict) else data
        mp: Dict[str, List[dict]] = {}
        for ent in entries:
            p = ent.get('p')
            if not p:
                continue
            mp.setdefault(p, []).append(ent)
        return mp
    except Exception:
        return {}


def iter_nt_texts() -> List[str]:
    texts: List[str] = []
    if not os.path.isdir(DATA_DIR):
        return texts

    # Only NT books are expected in this repo, but we keep it generic
    for filename in os.listdir(DATA_DIR):
        if not filename.endswith('_pashto.txt'):
            continue
        path = os.path.join(DATA_DIR, filename)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                for line in f:
                    s = normalize_pashto_char(line.strip())
                    if s:
                        texts.append(s)
        except Exception:
            continue
    return texts


TOKEN_RE = re.compile(r"[\u0600-\u06FF_]+")


def tokenize(text: str) -> List[str]:
    return TOKEN_RE.findall(text)


def build_nt_reference() -> List[dict]:
    dict_map = load_dictionary_map()
    texts = iter_nt_texts()
    counter: Counter[str] = Counter()

    for t in texts:
        for tok in tokenize(t):
            tok_norm = tok.replace('‌', '').strip()  # remove zero-width joiner if any
            if not tok_norm:
                continue
            counter[tok_norm] += 1

    rows: List[dict] = []
    for pashto, count in counter.most_common():
        entries = dict_map.get(pashto) or []
        if entries:
            ent = entries[0]
            rom = (ent.get('f') or '').split(',')[0].strip()
            pos = ent.get('c', '')
            ts = ent.get('ts', '')  # LingDocs metadata field
            eng = ent.get('e', '')
        else:
            rom = ''
            pos = ''
            ts = ''
            eng = ''
        rows.append({
            'pashto': pashto,
            'count': count,
            'romanization': rom,
            'pos': pos or 'unknown',
            'ts': ts,
            'english': eng,
        })
    return rows


def save_reference(rows: List[dict]) -> None:
    with open(OUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)


if __name__ == '__main__':
    rows = build_nt_reference()
    save_reference(rows)
    print(f"Wrote {len(rows)} entries to {OUT_PATH}")


