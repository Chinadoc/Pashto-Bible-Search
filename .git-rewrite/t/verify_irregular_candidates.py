import json
import os
import csv
import time
from typing import Dict, Any, List, Tuple

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
CANDIDATES_PATH = os.path.join(APP_ROOT, 'irregular_candidates.json')
OUT_JSON = os.path.join(APP_ROOT, 'irregular_verification_report.json')
OUT_CSV = os.path.join(APP_ROOT, 'irregular_verification_report.csv')
SERVICE_URL = os.environ.get('INFLECT_SERVICE_URL', 'http://localhost:5050')

try:
    import requests
except Exception:
    requests = None

# Optional local fallback
try:
    from verb_inflector import conjugate_verb
except Exception:
    conjugate_verb = None


def _fetch_service_forms(lemma: str) -> Dict[str, Any]:
    if not requests:
        return {}
    try:
        r = requests.get(f"{SERVICE_URL}/conjugate", params={'lemma': lemma}, timeout=10)
        if r.ok:
            data = r.json()
            if data.get('ok') and data.get('forms'):
                return data
    except Exception:
        pass
    return {}


def _analyze_irregularity(conj: Dict[str, Any]) -> Tuple[bool, Dict[str, str]]:
    if not conj:
        return False, {}
    meta = conj.get('meta', {})
    imp_stem = meta.get('imperfective_stem') or ''
    perf_stem = meta.get('perfective_stem') or ''
    imp_root = meta.get('imperfective_root') or ''
    perf_root = meta.get('perfective_root') or ''
    irregular = (imp_stem != perf_stem) or (imp_root != perf_root)
    return irregular, {
        'imperfective_stem': imp_stem,
        'perfective_stem': perf_stem,
        'imperfective_root': imp_root,
        'perfective_root': perf_root,
    }


def verify() -> List[Dict[str, Any]]:
    try:
        with open(CANDIDATES_PATH, 'r', encoding='utf-8') as f:
            rows = json.load(f)
    except Exception:
        rows = []
    results: List[Dict[str, Any]] = []
    for i, row in enumerate(rows):
        lemma = row.get('lemma')
        family = row.get('family')
        rationale = row.get('rationale')
        if not lemma:
            continue
        # Prefer service
        data = _fetch_service_forms(lemma)
        if data:
            # normalize to our analysis shape
            conj = {
                'meta': {
                    'imperfective_stem': data.get('meta', {}).get('imperfective_stem', ''),
                    'perfective_stem': data.get('meta', {}).get('perfective_stem', ''),
                    'imperfective_root': data.get('meta', {}).get('imperfective_root', ''),
                    'perfective_root': data.get('meta', {}).get('perfective_root', ''),
                }
            }
        else:
            # fallback local
            conj = conjugate_verb(lemma) if conjugate_verb else {}
        irr, bits = _analyze_irregularity(conj)
        results.append({
            'lemma': lemma,
            'family': family,
            'rationale': rationale,
            'irregular_by_engine': irr,
            **bits,
            'verified_via': 'service' if data else ('local' if conj else 'none'),
        })
        # gentle pace if service
        if data:
            time.sleep(0.05)
    # write outputs
    with open(OUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    with open(OUT_CSV, 'w', encoding='utf-8', newline='') as f:
        w = csv.writer(f)
        w.writerow(['lemma','family','rationale','irregular_by_engine','imperfective_stem','perfective_stem','imperfective_root','perfective_root','verified_via'])
        for r in results:
            w.writerow([r.get('lemma'), r.get('family'), r.get('rationale'), r.get('irregular_by_engine'), r.get('imperfective_stem'), r.get('perfective_stem'), r.get('imperfective_root'), r.get('perfective_root'), r.get('verified_via')])
    print(f"Wrote report to {OUT_JSON} and {OUT_CSV}")
    return results


if __name__ == '__main__':
    verify()
