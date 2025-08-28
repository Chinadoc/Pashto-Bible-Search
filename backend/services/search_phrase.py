from __future__ import annotations

import re
from typing import Dict, List

try:
    from models import PhraseRequest
except ImportError:
    # Fallback for when running from different directory
    class PhraseRequest:
        def __init__(self, query: str, scope: str = "all", limit: int = 200):
            self.query = query
            self.scope = scope
            self.limit = limit


def _normalize_pashto_char(s: str) -> str:
    # Keep consistent with UI normalization (simplified placeholder)
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


def phrase_search(req: PhraseRequest, maps: Dict[str, Dict[str, str]]) -> dict:
    scope = req.scope.lower()
    text_map = maps.get(scope) if scope in ('nt','ot') else maps.get('all', {})
    q = _normalize_pashto_char(req.query.strip())
    if not q:
        return { 'results': [], 'coverage': [] }
    # Simple substring search; can be swapped with fast engine if available
    hits = []
    for ref, text in text_map.items():
        try:
            if q in text:
                hits.append({ 'ref': ref, 'text': text })
                if len(hits) >= req.limit:
                    break
        except Exception:
            continue
    cov = _coverage([h['ref'] for h in hits])
    return { 'results': hits, 'coverage': cov }


