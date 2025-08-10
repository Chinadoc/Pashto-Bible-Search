import json
import os
import re
from collections import Counter, defaultdict
from typing import Dict, Any, List, Tuple


APP_ROOT = os.path.dirname(os.path.abspath(__file__))
FULL_DICT_PATH = os.path.join(APP_ROOT, 'full_dictionary.json')
ENRICHED_OUT_PATH = os.path.join(APP_ROOT, 'full_dictionary_enriched.json')
FAST_INDEX_OUT_PATH = os.path.join(APP_ROOT, 'dictionary_fast_index.json')
REPORT_OUT_PATH = os.path.join(APP_ROOT, 'data_cleaning_report.json')


def _safe_load_json(path: str) -> Any:
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return None


def _safe_write_json(path: str, data: Any) -> None:
    tmp = f"{path}.tmp"
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    os.replace(tmp, path)


def normalize_pashto_char(text: str) -> str:
    if not isinstance(text, str):
        return text
    # Unify Yeh variants and common Arabic chars to Pashto
    replacements = {
        'ي': 'ی',
        'ى': 'ی',
        'ئ': 'ی',
        '\u064A': 'ی',  # Arabic Yeh
        '\u06CC': 'ی',  # Farsi Yeh to Pashto Yeh
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


_DOT_AFTER = {
    'adj', 'adv', 'v', 'n', 'pron', 'conj', 'prep', 'adpos', 'num', 'name',
    'interj', 'intj', 'aux', 'suff', 'pref', 'part', 'det', 'mod', 'imv', 'imp',
    'stat', 'dyn', 'comp', 'trans', 'intrans', 'pl', 'sg', 'loc', 'm', 'f'
}

_SYNONYMS = {
    'pronoun': 'pron',
    'conjunction': 'conj',
    'preposition': 'prep',
    'interjection': 'interj',
    'intj': 'interj',
    'interj': 'interj',
    'adposition': 'adpos',
    'locative': 'loc',
    'imp': 'imv',  # imperative
}


def _tokenize_pos(pos_label: str) -> List[str]:
    s = str(pos_label or '').strip()
    if not s:
        return []
    # If label is clearly garbage numeric id, treat as unknown
    if s.isdigit():
        return []
    s = s.lower()
    # Normalize common conjunctions/punctuation to slashes
    s = s.replace(' and ', ' / ').replace(' & ', ' / ')
    s = s.replace('،', ' / ').replace('؛', ' / ')
    # unify spacing around punctuation we understand
    s = re.sub(r"\s*\.\s*", ".", s)
    s = re.sub(r"\s*/\s*", " / ", s)
    s = s.replace(",", " ")
    # collapse spaces
    s = re.sub(r"\s+", " ", s).strip()
    # split on separators: keep slash as separator but not token
    parts = re.split(r"[\s/]+", s)
    # expand dotted compounds like n.m.pl into tokens [n, m, pl]
    expanded: List[str] = []
    for p in parts:
        if '.' in p:
            expanded.extend([t for t in p.split('.') if t])
        else:
            expanded.append(p)
    # map synonyms
    out: List[str] = []
    for t in expanded:
        t2 = _SYNONYMS.get(t, t)
        out.append(t2)
    return out


def normalize_pos_label(pos_label: str) -> str:
    tokens = _tokenize_pos(pos_label)
    if not tokens:
        return 'unknown'

    # Reconstruct with canonical punctuation rules:
    # - group segments in order while keeping original order of appearance
    # - insert dots after known abbreviations
    # - insert spaces around slashes when multiple POS are present
    def punctuate(t: str) -> str:
        base = t
        if base in _DOT_AFTER:
            return base + '.'
        return base

    # join using ' / ' between top-level POS categories when they occur
    # Detect slashes from original by checking if more than one core POS present
    # Core POS hints
    core_flags = []
    for t in tokens:
        if t in {'adj', 'adjective', 'adv', 'adverb', 'v', 'verb'} or t.startswith('n'):
            core_flags.append(t)
    # Build canonical order preserving sequence with dots between subfeatures
    canon_parts: List[str] = []
    i = 0
    while i < len(tokens):
        t = tokens[i]
        # pack noun gender/number features immediately after noun
        if t.startswith('n') or t == 'n':
            sub = ['n']
            j = i + 1
            while j < len(tokens) and tokens[j] in {'m', 'f', 'pl', 'sg', 'anim', 'inanim', 'unisex'}:
                sub.append(tokens[j])
                j += 1
            canon_parts.append('. '.join(punctuate(x) for x in sub))
            i = j
            continue
        # pack verbal features like stat/dyn/comp/trans/intrans right after v
        if t in {'v', 'verb'}:
            sub = ['v']
            j = i + 1
            while j < len(tokens) and tokens[j] in {'stat', 'dyn', 'comp', 'trans', 'intrans'}:
                sub.append(tokens[j])
                j += 1
            canon_parts.append('. '.join(punctuate(x) for x in sub))
            i = j
            continue
        canon_parts.append(punctuate(t))
        i += 1

    # If there are multiple core POS, join with slashes
    # Otherwise, join with spaces
    core_count = sum(1 for p in canon_parts if p.startswith('adj') or p.startswith('adv') or p.startswith('v.') or p.startswith('n.'))
    if core_count > 1:
        s = ' / '.join(canon_parts)
    else:
        # Otherwise, enforce single spaces
        s = ' '.join(canon_parts)
    # clean double dots or extra spaces globally
    while '..' in s:
        s = s.replace('..', '.')
    s = re.sub(r"\s+", " ", s).strip()
    return s


def pos_family(pos_label: str) -> str:
    toks = set(_tokenize_pos(pos_label))
    if not toks:
        return 'other'
    if 'v' in toks or 'verb' in toks:
        return 'verb'
    if 'adj' in toks or 'adjective' in toks:
        return 'adjective'
    if 'adv' in toks or 'adverb' in toks:
        return 'adverb'
    if any(t.startswith('n') for t in toks) or 'noun' in toks:
        return 'noun'
    return 'other'


def gender_from_pos(pos_label: str) -> str:
    toks = set(_tokenize_pos(pos_label))
    if {'m', 'f'} <= toks or 'unisex' in toks or 'mf' in toks:
        return 'unisex'
    if 'm' in toks:
        return 'm'
    if 'f' in toks:
        return 'f'
    return ''


def first_romanization(entry: Dict[str, Any]) -> str:
    f = entry.get('f') or ''
    if not isinstance(f, str):
        return ''
    return f.split(',')[0].strip()


def enrich_full_dictionary() -> Tuple[Dict[str, Any], Dict[str, Any], Dict[str, Any]]:
    raw = _safe_load_json(FULL_DICT_PATH)
    if raw is None:
        raise SystemExit(f"full_dictionary.json not found at {FULL_DICT_PATH}")

    entries: List[Dict[str, Any]]
    info: Dict[str, Any]
    if isinstance(raw, dict) and 'entries' in raw:
        info = raw.get('info', {})
        entries = raw.get('entries', [])
    elif isinstance(raw, list):
        info = {}
        entries = raw
    else:
        raise SystemExit("Unexpected full_dictionary.json structure")

    pos_before = Counter()
    pos_after = Counter()

    enriched_entries: List[Dict[str, Any]] = []
    # For fast index: only keep first entry per Pashto form
    first_by_p: Dict[str, Dict[str, Any]] = {}
    first_by_pnorm: Dict[str, Dict[str, Any]] = {}

    for ent in entries:
        p = ent.get('p', '')
        c = ent.get('c', '')
        pos_before[c] += 1
        c_norm = normalize_pos_label(c)
        pos_after[c_norm] += 1
        fam = pos_family(c_norm)
        gen = gender_from_pos(c_norm)
        rom1 = first_romanization(ent)
        p_norm = normalize_pashto_char(p)

        enriched = dict(ent)
        enriched['c_norm'] = c_norm
        enriched['pos_family'] = fam
        enriched['gender'] = gen
        enriched['f_primary'] = rom1
        enriched['p_norm'] = p_norm
        enriched_entries.append(enriched)

        minimal = {
            'rom': rom1,
            'pos': c,
            'pos_norm': c_norm,
            'pos_family': fam,
            'gender': gen,
            'e': ent.get('e', ''),
            'ts': ent.get('ts', 0),
        }
        if p and p not in first_by_p:
            first_by_p[p] = minimal
        nkey = p_norm
        if nkey and nkey not in first_by_pnorm:
            first_by_pnorm[nkey] = minimal

    enriched_out = {'info': info, 'entries': enriched_entries}
    fast_index_out = {'by_pashto': first_by_p, 'by_pashto_norm': first_by_pnorm}
    report = {
        'unique_pos_original': sorted(pos_before.keys()),
        'unique_pos_normalized': sorted(pos_after.keys()),
        'pos_original_counts': pos_before,
        'pos_normalized_counts': pos_after,
    }
    # Convert Counters to dicts for JSON
    report['pos_original_counts'] = {k: int(v) for k, v in pos_before.items()}
    report['pos_normalized_counts'] = {k: int(v) for k, v in pos_after.items()}

    return enriched_out, fast_index_out, report


def main() -> None:
    enriched, fast_idx, report = enrich_full_dictionary()
    _safe_write_json(ENRICHED_OUT_PATH, enriched)
    _safe_write_json(FAST_INDEX_OUT_PATH, fast_idx)
    _safe_write_json(REPORT_OUT_PATH, report)
    print(f"Wrote: {ENRICHED_OUT_PATH}")
    print(f"Wrote: {FAST_INDEX_OUT_PATH}")
    print(f"Wrote: {REPORT_OUT_PATH}")


if __name__ == '__main__':
    main()


