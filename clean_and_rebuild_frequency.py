"""Clean NT Pashto text files and rebuild the word frequency list with tags.

- Scans `all_txt_copies/*_pashto.txt`
- Cleans and normalizes words
- Rebuilds frequency counts
- Tags each word with romanization and POS from `full_dictionary.json` when available
- Writes `word_frequency_list.json`
- Also refreshes `nt_reference.json` for the UI fast path

The cleaning rules remove punctuation, diacritics, tatweel, ZWNJ/ZWJ, and
normalize common Arabic/Persian letter variants into the Pashto set.
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
OUT_FREQ = os.path.join(APP_ROOT, 'word_frequency_list.json')
OUT_REF = os.path.join(APP_ROOT, 'nt_reference.json')


# --- Normalization ---
DIACRITICS = ''.join([
    '\u064B', '\u064C', '\u064D', '\u064E', '\u064F', '\u0650', '\u0651', '\u0652',
    '\u0653', '\u0654', '\u0655', '\u0670'
])
DIAC_RE = re.compile(f"[{DIACRITICS}]")

PUNCTUATION = ''.join([
    '.,:;!?', '؟،؛', '"\'\(\)\[\]\{\}', '“”‘’', '«»‹›', '…', '-', '—', '–', '/', '\\', '|' , '·', '•'
])
PUNC_RE = re.compile(f"[{re.escape(PUNCTUATION)}]")

ZWNJ_RE = re.compile('[\u200c\u200d\u0640]')  # ZWNJ, ZWJ, tatweel


def normalize_word(word: str) -> str:
    w = word
    w = ZWNJ_RE.sub('', w)
    w = PUNC_RE.sub('', w)
    w = DIAC_RE.sub('', w)
    # Arabic -> Pashto letter harmonization
    w = (w
         .replace('ي', 'ی')
         .replace('ى', 'ی')
         .replace('ئ', 'ی')
         .replace('ك', 'ک')
         )
    return w.strip()


TOKEN_RE = re.compile(r"[\u0600-\u06FF]+")


def tokenize(text: str) -> List[str]:
    return TOKEN_RE.findall(text)


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


def iter_texts() -> List[str]:
    texts: List[str] = []
    if not os.path.isdir(DATA_DIR):
        return texts
    for filename in os.listdir(DATA_DIR):
        if not filename.endswith('_pashto.txt'):
            continue
        path = os.path.join(DATA_DIR, filename)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                for line in f:
                    s = line.strip()
                    if s:
                        texts.append(s)
        except Exception:
            continue
    return texts


def rebuild() -> None:
    dict_map = load_dictionary_map()
    texts = iter_texts()

    counter: Counter[str] = Counter()
    for t in texts:
        for tok in tokenize(t):
            norm = normalize_word(tok)
            if not norm:
                continue
            counter[norm] += 1

    # Frequency JSON (compact and compatible with the UI)
    freq_rows: List[dict] = []
    ref_rows: List[dict] = []
    for pashto, count in counter.most_common():
        entries = dict_map.get(pashto) or []
        if entries:
            ent = entries[0]
            rom = (ent.get('f') or '').split(',')[0].strip()
            # Normalize POS label to merge minor spacing/punctuation differences
            raw_pos = ent.get('c', '') or 'unknown'
            pos = re.sub(r"\s*\.\s*", ".", raw_pos.lower())
            pos = re.sub(r"\s+/\s+", " / ", pos)
            pos = re.sub(r"\s+", " ", pos).strip()
            ts = ent.get('ts', '')
            eng = ent.get('e', '')
        else:
            rom = ''
            pos = 'unknown'
            ts = ''
            eng = ''

        freq_rows.append({
            'pashto': pashto,
            'frequency': count,
            'romanization': rom,
            'pos': pos,
            'english': eng,
        })

        ref_rows.append({
            'pashto': pashto,
            'count': count,
            'romanization': rom,
            'pos': pos,
            'ts': ts,
            'english': eng,
        })

    with open(OUT_FREQ, 'w', encoding='utf-8') as f:
        json.dump(freq_rows, f, ensure_ascii=False, indent=2)

    with open(OUT_REF, 'w', encoding='utf-8') as f:
        json.dump(ref_rows, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(freq_rows)} entries to {OUT_FREQ}")
    print(f"Wrote {len(ref_rows)} entries to {OUT_REF}")


if __name__ == '__main__':
    rebuild()


