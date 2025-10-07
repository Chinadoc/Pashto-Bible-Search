import json
import os
from typing import Dict, List
from functions.verb_inflector import conjugate_verb

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
OUT_FORM_TO_LEMMA = os.path.join(APP_ROOT, 'form_to_lemma.json')
OUT_INFL = os.path.join(APP_ROOT, 'inflections_cache.json')

# Load full dictionary to get comprehensive verb list with linguistic data
DICT_FILE = os.path.join(APP_ROOT, 'full_dictionary_enriched.json')

# Load dictionary and filter for verbs with linguistic metadata
def load_verb_list():
    with open(DICT_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    verbs = []
    for entry in data.get('entries', []):
        if entry.get('pos_family') == 'verb' or entry.get('c', '').startswith('v.'):
            # Only include verbs with linguistic metadata
            if any(key in entry for key in ['psp', 'ssp', 'pprtp', 'tppp', 'c_norm']):
                verbs.append({
                    'lemma': entry['p'],
                    'romanization': entry.get('f', ''),
                    'pos': entry.get('c', ''),
                    'pos_family': entry.get('pos_family', ''),
                    'c_norm': entry.get('c_norm', ''),
                    'psp': entry.get('psp'),
                    'ssp': entry.get('ssp'),
                    'pprtp': entry.get('pprtp'),
                    'tppp': entry.get('tppp'),
                })

    print(f"Found {len(verbs)} verbs with linguistic metadata")
    return verbs[:1000]  # Limit to prevent memory issues

SAMPLE_VERBS = load_verb_list()


def build_payloads(verb_data: List[Dict]):
    form_to_lemma: Dict[str, str] = {}
    by_lemma: Dict[str, List[Dict[str, str]]] = {}

    for verb_entry in verb_data:
        lemma = verb_entry['lemma']
        conj = conjugate_verb(lemma)
        if not conj:
            continue
        items: List[Dict[str, str]] = []
        # collect forms from all paradigms we expose in UI
        for section in ['present', 'subjunctive', 'continuous_past', 'simple_past', 'perfect_present', 'perfect_past', 'perfect_subjunctive', 'perfect_future', 'perfect_habitual']:
            if section in conj:
                for ps, rom in conj[section].values():
                    items.append({
                        'form': ps,
                        'romanization': rom,
                        'category': 'verb',
                        'tense': section,
                        'lemma': lemma,
                        'pos_family': verb_entry.get('pos_family', ''),
                        'c_norm': verb_entry.get('c_norm', ''),
                        'flags': derive_flags(verb_entry, section, ps)
                    })
                    form_to_lemma[ps] = lemma
        # also include roots/participle shown in UI
        meta = conj['meta']
        for ps in [meta['imperfective_root'], meta['perfective_root'], meta['past_participle']]:
            rom = conj['meta']['romanization'].get('imperfective_root') if ps == meta['imperfective_root'] else (
                conj['meta']['romanization'].get('perfective_root') if ps == meta['perfective_root'] else conj['meta']['romanization'].get('past_participle')
            )
            items.append({
                'form': ps,
                'romanization': rom or '',
                'category': 'verb',
                'lemma': lemma,
                'pos_family': verb_entry.get('pos_family', ''),
                'c_norm': verb_entry.get('c_norm', ''),
                'flags': derive_flags(verb_entry, 'root', ps)
            })
            form_to_lemma[ps] = lemma

        by_lemma[lemma] = items

    return form_to_lemma, by_lemma


def derive_flags(verb_entry: Dict, tense: str, form: str) -> str:
    """Derive linguistic flags from verb entry metadata"""
    flags = []

    # Check normalized category for stative/dynamic/compound
    c_norm = verb_entry.get('c_norm', '').lower()

    if 'stative' in c_norm or 'stat' in c_norm:
        flags.append('stative')
    if 'dynamic' in c_norm or 'dyn' in c_norm:
        flags.append('dynamic')
    if 'compound' in c_norm or 'comp' in c_norm:
        flags.append('compound')

    # Check if this is a helper verb (based on common patterns)
    lemma = verb_entry.get('lemma', '')
    if lemma in ['کول', 'کېدل', 'کړل', 'اخیستل', 'ساتل', 'وهل']:
        flags.append('helper')

    # Aspect determination based on tense and form patterns
    if 'present' in tense or 'subjunctive' in tense:
        flags.append('imperfective')
    elif 'past' in tense or 'perfect' in tense:
        flags.append('perfective')
    elif tense == 'root':
        # Check form against known imperfective/perfective roots
        psp = verb_entry.get('psp', '')
        tppp = verb_entry.get('tppp', '')
        if psp and form == psp:
            flags.append('imperfective')
        elif tppp and form == tppp:
            flags.append('perfective')

    # Irregular detection based on metadata
    if verb_entry.get('pprtp') or verb_entry.get('ssp'):
        flags.append('irregular')

    return ','.join(flags) if flags else 'regular'


def main():
    f2l, infl = build_payloads(SAMPLE_VERBS)
    with open(OUT_FORM_TO_LEMMA, 'w', encoding='utf-8') as f:
        json.dump(f2l, f, ensure_ascii=False, indent=2)
    with open(OUT_INFL, 'w', encoding='utf-8') as f:
        json.dump(infl, f, ensure_ascii=False, indent=2)
    print('Wrote:', OUT_FORM_TO_LEMMA)
    print('Wrote:', OUT_INFL)


if __name__ == '__main__':
    main()
