from __future__ import annotations

import os
import json
import re
import time
from typing import Dict, Tuple, List, Optional

from ..models import GrammarRequest

# Optional enrichment via local lexicons/inflectors
try:
    from verb_inflector import conjugate_verb  # type: ignore
except Exception:  # pragma: no cover - optional in minimal builds
    conjugate_verb = None  # type: ignore
try:
    # Optional helpers for root inference and romanization
    from verb_inflector import find_lexicon_root_for_form, infer_root_from_form, romanization_for_form_fast  # type: ignore
except Exception:  # pragma: no cover
    find_lexicon_root_for_form = None  # type: ignore
    infer_root_from_form = None  # type: ignore
    romanization_for_form_fast = None  # type: ignore
try:
    from noun_inflector import inflect_noun  # type: ignore
except Exception:  # pragma: no cover
    inflect_noun = None  # type: ignore

APP_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_VERBS_LEXICON: Optional[dict] = None
_NOUNS_LEXICON: Optional[dict] = None


def _safe_load_json(path: str) -> dict:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f) or {}
    except Exception:
        return {}


def _load_lexicons() -> tuple[dict, dict]:
    global _VERBS_LEXICON, _NOUNS_LEXICON
    if _VERBS_LEXICON is None:
        _VERBS_LEXICON = _safe_load_json(os.path.join(APP_ROOT, "verbs_lexicon.json"))
    if _NOUNS_LEXICON is None:
        _NOUNS_LEXICON = _safe_load_json(os.path.join(APP_ROOT, "nouns_lexicon.json"))
    return _VERBS_LEXICON or {}, _NOUNS_LEXICON or {}


def _normalize_pashto_char(s: str) -> str:
    try:
        return s.replace('\u064a', '\u06cc').replace('\u0643', '\u06a9')
    except Exception:
        return s


def _coverage(items: List[str]) -> List[dict]:
    counts = {}
    for v in items:
        m = re.match(r'^([A-Za-z\s]+)\s\d+:\d+$', v)
        if not m:
            continue
        b = m.group(1).strip()
        counts[b] = counts.get(b, 0) + 1
    return [{ 'book': b, 'count': c } for b, c in counts.items()]


def grammar_search(req: GrammarRequest, maps: Dict[str, Dict[str, str]], indices: Tuple[dict, dict]) -> dict:
    t0 = time.perf_counter()
    scope = req.scope.lower()
    text_map = maps.get(scope) if scope in ('nt','ot') else maps.get('all', {})
    grammatical_index, form_to_root_map = indices
    q = _normalize_pashto_char(req.query.strip())
    
    timings = {}

    if not q:
        return { 'occurrences': [], 'conjugations': None, 'coverage': [] }

    # 1. Fetch occurrences from the v15 grammatical index
    t1 = time.perf_counter()
    verses = []
    word_data = grammatical_index.get(q)
    if word_data and 'identities' in word_data:
        all_verses = set()
        for identity in word_data.get('identities', []):
            forms = identity.get('forms', {})
            for form_name, form_details in forms.items():
                if isinstance(form_details, list):
                    for form_item in form_details:
                        all_verses.update(form_item.get('verses', []))
        # Filter verses by scope (nt/ot/all)
        verses = [v for v in all_verses if v in text_map]
    
    occurrences = [{ 'ref': v, 'text': text_map.get(v, '') } for v in verses[:req.limit]]
    cov = _coverage([v for v in verses[:req.limit]])
    timings['1_occurrences_lookup_ms'] = (time.perf_counter() - t1) * 1000

    # 2. Conjugation/inflection enrichment (optional, best-effort)
    t2 = time.perf_counter()
    conjugations = None
    root_found = ""
    try:
        # 2a. Find a plausible root for the queried form
        root = form_to_root_map.get(q)
        if not root and find_lexicon_root_for_form:
            try:
                root = find_lexicon_root_for_form(q) or None
            except Exception:
                root = None
        if not root and infer_root_from_form:
            try:
                root = infer_root_from_form(q) or None
            except Exception:
                root = None
        
        root_found = root or ""
        timings['2a_find_root_ms'] = (time.perf_counter() - t2) * 1000

        verbs_lex, nouns_lex = _load_lexicons()

        # 2b. If we have a root, prefer verb conjugations; otherwise, try noun inflection on the query itself
        t3 = time.perf_counter()
        if root and conjugate_verb:
            try:
                tables = conjugate_verb(root)
                if tables:
                    conjugations = { 'root': root, 'kind': 'verb', 'tables': tables }
            except Exception:
                pass

        if conjugations is None and inflect_noun:
            # Try noun inflection if query itself seems to be a lemma in nouns lexicon
            try:
                if q in (nouns_lex or {}):
                    tables = inflect_noun(q)
                    if tables:
                        conjugations = { 'root': q, 'kind': 'noun', 'tables': tables }
            except Exception:
                pass
        timings['2b_get_conjugations_ms'] = (time.perf_counter() - t3) * 1000

        # 2c. Add romanization hint for the query form when available
        t4 = time.perf_counter()
        if conjugations is not None and romanization_for_form_fast:
            try:
                rom = romanization_for_form_fast(q)
                if rom:
                    conjugations['query_rom'] = rom
            except Exception:
                pass
        timings['2c_get_romanization_ms'] = (time.perf_counter() - t4) * 1000

    except Exception:
        conjugations = None
    
    timings['2_total_enrichment_ms'] = (time.perf_counter() - t2) * 1000
    
    total_ms = (time.perf_counter() - t0) * 1000
    print(f"[METRICS] Grammar search for '{q}': root='{root_found}', total_ms={total_ms:.2f}, timings={timings}")

    return { 'occurrences': occurrences, 'conjugations': conjugations, 'coverage': cov }


