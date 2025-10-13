#!/usr/bin/env python3
"""
Rebuild verbs_lexicon.json and nouns_lexicon.json from the enriched dictionary
using the current inflection engines and rules.

This integrates all rules from:
- verb_inflector.py (helper verbs, stative/dynamic compounds, welding/squishing)
- noun_inflector.py (patterns, plurals, vocatives, demonstratives, mayo)

Inputs:
- full_dictionary_enriched.json (produced by normalize_dictionary_data.py)

Outputs:
- verbs_lexicon.json
- nouns_lexicon.json

Usage:
  python3 rebuild_lexicons.py
"""

from __future__ import annotations

import json
import os
import re
from typing import Any, Dict, List, Tuple

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
ENRICHED_DICT = os.path.join(APP_ROOT, 'full_dictionary_enriched.json')
OUT_VERBS = os.path.join(APP_ROOT, 'verbs_lexicon.json')
OUT_NOUNS = os.path.join(APP_ROOT, 'nouns_lexicon.json')
IRREGULARS_VERBS = os.path.join(APP_ROOT, 'irregular_verbs.json')


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


def _norm_pashto(s: str) -> str:
    if not isinstance(s, str):
        return s
    return s.replace('ي', 'ی').replace('ى', 'ی').replace('ئ', 'ی')


def _is_probable_verb_lemma(p: str) -> bool:
    """Heuristic to detect verb lemmas in Pashto.
    - Infinitives typically end with ل / دل / ول
    - Compound helpers: ' کېدل' / ' کول'
    """
    if not p:
        return False
    return (
        p.endswith('ل') or p.endswith('دل') or p.endswith('ول') or
        p.endswith(' کېدل') or p.endswith(' کول')
    )


def rebuild_verbs_lexicon(entries: List[Dict[str, Any]]) -> Dict[str, Any]:
    from verb_inflector import conjugate_verb_dynamic  # local import to avoid side effects at module import

    # Candidate verb lemmas from dictionary
    cand_roots: List[str] = []
    for ent in entries:
        p = ent.get('p', '')
        c_norm = ent.get('c_norm', '')
        fam = ent.get('pos_family', '')
        if fam == 'verb' or ('v' in c_norm.lower()):
            if _is_probable_verb_lemma(p):
                cand_roots.append(p)
    # Also include normalized forms to catch Yeh variants
    cand_roots = list(dict.fromkeys([_norm_pashto(x) for x in cand_roots if x]))

    out: Dict[str, Any] = {}
    for root in cand_roots:
        try:
            conj = conjugate_verb_dynamic(root)
        except Exception:
            conj = {}
        if not conj:
            continue
        meta = conj.get('meta', {})
        impf_stem = meta.get('imperfective_stem', '')
        perf_stem = meta.get('perfective_stem', '')
        impf_root = meta.get('imperfective_root', root)
        perf_root = meta.get('perfective_root', root)
        past_part = meta.get('past_participle', '')
        rom = meta.get('romanization', {}) or {}

        # Only accept entries that have the minimum fields
        if not (impf_stem and (perf_stem or perf_root) and past_part):
            # Some helpers still useful; keep if at least roots are present
            if not (impf_root and perf_root):
                continue
        out[root] = {
            'stems': {
                'imperfective': impf_stem,
                'perfective': perf_stem,
            },
            'roots': {
                'imperfective': impf_root,
                'perfective': perf_root,
            },
            'past_participle': past_part,
            'romanization': rom,
        }

    # Merge irregulars last (override regular inferences)
    irr = _safe_load_json(IRREGULARS_VERBS)
    if isinstance(irr, dict):
        for k, v in irr.items():
            if isinstance(v, dict):
                cur = out.get(k, {})
                cur.update(v)
                out[k] = cur

    return out


def guess_noun_pattern(lemma: str, rom_hint: str, pos_norm: str) -> str:
    """Infer a noun/adjective inflection pattern label compatible with noun_inflector.
    Conservative: fall back to 'masc_basic_consonant' when unsure.
    """
    from noun_inflector import _infer_noun_pattern_from_dict

    lemma = (lemma or '').strip()
    if not lemma:
        return 'masc_basic_consonant'

    # Strong hints
    if lemma.endswith('ون'):
        return 'pashtoon'
    # Stress hint from dictionary fast index
    inferred = _infer_noun_pattern_from_dict(lemma)
    if inferred:
        return inferred
    # Endings-based heuristics
    if lemma.endswith('ی') or lemma.endswith('ي') or lemma.endswith('ۍ'):
        # Without stress info default to unstressed_y
        return 'unstressed_y'
    # Very short consonant-final words → short_squish (rough heuristic)
    consonants = set('ءابتثجچحخدذرزژږسشښصضحطظعغفقکګگلمنڼهوىيېۍؤآء پټډړځڅړږژښڼګکګ')
    if len(lemma) <= 3 and lemma[-1] in consonants and not lemma.endswith('ه'):
        return 'short_squish'
    # Feminine inanimate ending with ee/ي is handled via fem_inanim_ee when we know it's feminine
    if (lemma.endswith('ي') or lemma.endswith('ی')) and ('. f.' in pos_norm or ' n. f' in pos_norm or ' n. f.' in pos_norm):
        return 'fem_inanim_ee'
    # Default
    return 'masc_basic_consonant'


def rebuild_nouns_lexicon(entries: List[Dict[str, Any]]) -> Dict[str, Any]:
    out: Dict[str, Any] = {}
    for ent in entries:
        p = ent.get('p', '')
        c = ent.get('pos', '')
        c_norm = ent.get('pos_norm', '')
        fam = ent.get('pos_family', '')
        if fam != 'noun' and not any(t in (c_norm or '').lower() for t in ['n.', 'noun']):
            continue
        lemma = _norm_pashto(p)
        if not lemma:
            continue
        rom = ent.get('f_primary', '')
        pat = guess_noun_pattern(lemma, rom, c_norm or c)
        # Keep minimal entry; additional metadata can be added later
        out[lemma] = {
            'pattern': pat,
            'pattern_info': '',
        }
    return out


def main() -> int:
    enriched = _safe_load_json(ENRICHED_DICT)
    if enriched is None:
        raise SystemExit(f"Missing {ENRICHED_DICT}. Run normalize_dictionary_data.py first.")

    entries: List[Dict[str, Any]]
    if isinstance(enriched, dict) and 'entries' in enriched:
        entries = enriched['entries']
    elif isinstance(enriched, list):
        entries = enriched
    else:
        raise SystemExit("Unexpected format in full_dictionary_enriched.json")

    print(f"[lexicons] Processing {len(entries):,} dictionary entries...")

    verbs = rebuild_verbs_lexicon(entries)
    print(f"[lexicons] Built verbs lexicon with {len(verbs):,} entries")
    _safe_write_json(OUT_VERBS, verbs)

    nouns = rebuild_nouns_lexicon(entries)
    print(f"[lexicons] Built nouns lexicon with {len(nouns):,} entries")
    _safe_write_json(OUT_NOUNS, nouns)

    print(f"[lexicons] Wrote {OUT_VERBS} and {OUT_NOUNS}")
    return 0


if __name__ == '__main__':
    raise SystemExit(main())


