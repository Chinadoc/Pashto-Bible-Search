import json
import os
import re
from typing import Dict, List

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
DICT_PATH = os.path.join(APP_ROOT, 'full_dictionary.json')
OUT_CSV = os.path.join(APP_ROOT, 'irregular_candidates.csv')
OUT_JSON = os.path.join(APP_ROOT, 'irregular_candidates.json')

# Core irregular bases and families (to expand prefixed forms)
BASES = {
    'کول': {'family': 'aux_do', 'notes': 'suppletive perfective stem کړ-'},
    'کېدل': {'family': 'aux_become', 'notes': 'auxiliary; irregular present stem کېږ-'},
    'تلل': {'family': 'motion_go', 'notes': 'suppletive perfective root لاړل'},
    'راتلل': {'family': 'motion_come', 'notes': 'derived from تلل with را- prefix'},
    'وتل': {'family': 'motion_exit', 'notes': 'motion; often suppletive perfective forms'},
    'راوتل': {'family': 'motion_come_out', 'notes': 'prefix + motion'},
    'وړل': {'family': 'transport_carry', 'notes': 'irregular perfective ووړ-'},
    'راوړل': {'family': 'transport_bring', 'notes': 'derived bring; both roots راوړل'},
    'لیدل': {'family': 'perception_see', 'notes': 'stems وین-/ووین-'},
    'ویل': {'family': 'speech_say', 'notes': 'stems وای-/ووای-'},
    'خوړل': {'family': 'consume_eat', 'notes': 'perfective وخور-'},
    'نیول': {'family': 'capture_take', 'notes': 'perfective ونی-'},
    'بوتلل': {'family': 'transport_pull_out', 'notes': 'multiple stems بیای-/بوځ-'},
    'ورکول': {'family': 'give', 'notes': 'prefix + کول → ورکړ- in perfective'},
    'راکول': {'family': 'give', 'notes': 'prefix + کول → راکړ- in perfective'},
}

PREFIXES = ['را', 'ور']


def load_dict_entries() -> List[Dict]:
    if not os.path.exists(DICT_PATH):
        return []
    with open(DICT_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data.get('entries', []) if isinstance(data, dict) else data


def is_verb_pos(pos: str) -> bool:
    s = (pos or '').lower()
    return 'v.' in s


def propose_candidates(entries: List[Dict]) -> List[Dict]:
    seen = set()
    out: List[Dict] = []
    for ent in entries:
        lemma = ent.get('p') or ''
        pos = ent.get('c') or ''
        if not lemma or not is_verb_pos(pos):
            continue
        # direct base irregulars
        if lemma in BASES:
            key = lemma
            if key not in seen:
                out.append({'lemma': lemma, 'family': BASES[lemma]['family'], 'rationale': BASES[lemma]['notes']})
                seen.add(key)
        # prefixed forms for known bases
        for base in list(BASES.keys()):
            for pref in PREFIXES:
                cand = pref + base
                if lemma == cand and cand not in seen:
                    out.append({'lemma': lemma, 'family': BASES[base]['family'], 'rationale': f'prefix {pref}+{base}'})
                    seen.add(cand)
        # verbs ending with unusual patterns suggesting suppletion/irregular stems
        if lemma.endswith('یل') or lemma.endswith('ېدل') or lemma.endswith('ستل'):
            if lemma not in seen:
                out.append({'lemma': lemma, 'family': 'potential_irregular', 'rationale': 'ending heuristic (یل/ېدل/ستل)'})
                seen.add(lemma)
    # sort by family then lemma
    out.sort(key=lambda x: (x['family'], x['lemma']))
    return out


def write_outputs(rows: List[Dict]):
    import csv
    with open(OUT_CSV, 'w', encoding='utf-8', newline='') as f:
        w = csv.writer(f)
        w.writerow(['lemma', 'family', 'rationale'])
        for r in rows:
            w.writerow([r['lemma'], r['family'], r['rationale']])
    with open(OUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)
    print(f"Wrote {len(rows)} candidates to {OUT_CSV} and {OUT_JSON}")


if __name__ == '__main__':
    rows = propose_candidates(load_dict_entries())
    write_outputs(rows)
