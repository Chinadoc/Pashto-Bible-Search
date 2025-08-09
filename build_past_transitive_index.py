import os
import re
import json
from typing import Dict, List, Tuple

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
NT_DIR = os.path.join(APP_ROOT, 'nt_txt_copies')
OT_DIR = os.path.join(APP_ROOT, 'ot_txt_copies')
DICT_PATH = os.path.join(APP_ROOT, 'full_dictionary.json')
OUT_PATH = os.path.join(APP_ROOT, 'past_transitive_index.json')

# Basic normalization (unify ی variants)
REPL = {ord('ي'): 'ی', ord('ى'): 'ی', ord('ئ'): 'ی'}

PREPOSITIONS = {'د', 'له', 'په', 'پر'}
POSTPOSITIONS = {'کې', 'سره', 'باندې', 'باندې'}
PRONOUNS = {'زه','ته','هغه','هغې','هغوی','مونږ','تاسو','دا','دې'}

# Heuristic list of transitive perfective verb markers (stems or sequences)
TRANSITIVE_MARKERS = [
    'وکړ', 'ورکړ', 'کړ',  # do/give
    'ووین', 'ووی', 'وکت',  # see/look
    'واخ', 'ووړ',          # take/carry
    'وخو', 'وخړ',          # eat
    'وژ',                  # kill
    'ولیک', 'وښ',         # write/show
]

def normalize(s: str) -> str:
    return s.translate(REPL)

PUNCT = '.,:;!?؟،؛"\'()[]{}“”«»'


def _parse_int_mixed_digits(s: str):
    arabic_indic = {ord('٠') + i: str(i) for i in range(10)}  # U+0660..U+0669
    eastern_arabic = {ord('۰') + i: str(i) for i in range(10)}  # U+06F0..U+06F9
    normalized = s.translate({**arabic_indic, **eastern_arabic})
    if not normalized or not all('0' <= ch <= '9' for ch in normalized):
        return None
    try:
        return int(normalized)
    except Exception:
        return None


def load_text_from_dir(dir_path: str) -> Dict[str, str]:
    bible: Dict[str, str] = {}
    if not os.path.isdir(dir_path):
        return bible
    punct = PUNCT
    book_map = {
        'acts': 'Acts', 'colossians': 'Colossians', 'ephesians': 'Ephesians', 'galatians': 'Galatians',
        'hebrews': 'Hebrews', 'james': 'James', 'john': 'John', 'luke': 'Luke', 'mark': 'Mark', 'matthew': 'Matthew',
        'philippians': 'Philippians', 'romans': 'Romans', '1corinthians': '1 Corinthians', '2corinthians': '2 Corinthians',
        '1thessalonians': '1 Thessalonians', '2thessalonians': '2 Thessalonians', '1timothy': '1 Timothy', '2timothy': '2 Timothy',
        'titus': 'Titus', 'philemon': 'Philemon', '1peter': '1 Peter', '2peter': '2 Peter', '1john': '1 John',
        '2john': '2 John', '3john': '3 John', 'jude': 'Jude', 'revelation': 'Revelation',
    }
    for fname in sorted(os.listdir(dir_path)):
        if not fname.endswith('.txt'):
            continue
        path = os.path.join(dir_path, fname)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
        except Exception:
            continue
        base = os.path.splitext(fname)[0]
        chapter_match = re.match(r'([a-zA-Z]+)(\d+)_pashto', base)
        if not chapter_match:
            continue
        book_key = chapter_match.group(1).lower()
        chapter = int(chapter_match.group(2))
        book = book_map.get(book_key, book_key.title())
        current_verse = None
        verse_text_lines: List[str] = []
        for line in lines:
            stripped = normalize(line.strip())
            verse_num_candidate = stripped.translate(str.maketrans('', '', punct))
            m = re.match(r'^[0-9\u0660-\u0669\u06F0-\u06F9]+', verse_num_candidate)
            verse_num = _parse_int_mixed_digits(m.group(0)) if m else None
            if verse_num is not None:
                if current_verse is not None:
                    bible[f"{book} {chapter}:{current_verse}"] = ' '.join(verse_text_lines).strip()
                current_verse = verse_num
                verse_text_lines = [re.sub(r'^\s*\d+\s*', '', stripped)]
            else:
                verse_text_lines.append(stripped)
        if current_verse is not None:
            bible[f"{book} {chapter}:{current_verse}"] = ' '.join(verse_text_lines).strip()
    return bible


def load_dictionary_map() -> Dict[str, List[Dict[str, str]]]:
    if not os.path.exists(DICT_PATH):
        return {}
    try:
        with open(DICT_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        entries = data.get('entries', []) if isinstance(data, dict) else data
        out: Dict[str, List[Dict[str, str]]] = {}
        for ent in entries:
            p = ent.get('p')
            if not p:
                continue
            out.setdefault(p, []).append(ent)
        return out
    except Exception:
        return {}


def guess_pos(token: str, dict_map: Dict[str, List[Dict[str, str]]]) -> str:
    entries = dict_map.get(token) or dict_map.get(normalize(token))
    if not entries:
        return 'unknown'
    # prefer POS field 'c'
    c = entries[0].get('c', '')
    return c or 'unknown'


def is_likely_perfective_past(token: str) -> Tuple[bool, str]:
    t = token.strip()
    if len(t) < 2:
        return False, ''
    # common perfective prefix
    if t.startswith('و') or t.startswith('وو'):
        # avoid intransitive "شو" unless followed by object marker; keep as possible
        if any(m in t for m in TRANSITIVE_MARKERS):
            return True, 'perfective_prefix+transitive_marker'
        # generic perfective form
        if re.search(r'(م|ې|ئ|ي|و|ه)$', t):
            return True, 'perfective_prefix+past_ending'
    # special stems without prefix sometimes
    if any(m in t for m in TRANSITIVE_MARKERS):
        if re.search(r'(م|ې|ئ|و|ه)$', t):
            return True, 'transitive_marker+past_ending'
    return False, ''


def find_probable_subject(tokens: List[str], i: int, dict_map: Dict[str, List[Dict[str, str]]]) -> Tuple[str, str]:
    # look left for nearest noun/pronoun not preceded by prepositions
    j = i - 1
    while j >= 0:
        tok = tokens[j]
        if tok in PREPOSITIONS or tok in POSTPOSITIONS:
            j -= 1
            continue
        if tok in PRONOUNS:
            return tok, 'pronoun'
        pos = guess_pos(tok, dict_map)
        if ('n.' in pos) or ('adj' in pos) or ('n' == pos):
            return tok, pos
        j -= 1
    return '', ''


def analyze():
    dict_map = load_dictionary_map()
    verses = {}
    verses.update(load_text_from_dir(NT_DIR))
    verses.update(load_text_from_dir(OT_DIR))

    results = []
    for vref, text in sorted(verses.items()):
        # rough tokenization
        clean = text
        for p in PUNCT:
            clean = clean.replace(p, ' ')
        tokens = [t for t in clean.split() if t]
        for idx, tok in enumerate(tokens):
            ok, reason = is_likely_perfective_past(tok)
            if not ok:
                continue
            subj, subj_pos = find_probable_subject(tokens, idx, dict_map)
            results.append({
                'verse': vref,
                'text': text,
                'verb': tok,
                'why_past_transitive': reason,
                'probable_subject': subj,
                'subject_pos': subj_pos or 'unknown',
            })
    with open(OUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"Wrote {len(results)} entries to {OUT_PATH}")


if __name__ == '__main__':
    analyze()
