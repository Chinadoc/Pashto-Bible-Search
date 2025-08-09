import json
import os
from typing import Dict, List
from verb_inflector import conjugate_verb

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
OUT_FORM_TO_LEMMA = os.path.join(APP_ROOT, 'form_to_lemma.json')
OUT_INFL = os.path.join(APP_ROOT, 'inflections_cache.json')

SAMPLE_VERBS = ['کول', 'بوتلل', 'تلل', 'کېدل', 'لیدل']


def build_payloads(lemmas: List[str]):
    form_to_lemma: Dict[str, str] = {}
    by_lemma: Dict[str, List[Dict[str, str]]] = {}

    for lemma in lemmas:
        conj = conjugate_verb(lemma)
        if not conj:
            continue
        items: List[Dict[str, str]] = []
        # collect forms from all paradigms we expose in UI
        for section in ['present', 'subjunctive', 'continuous_past', 'simple_past']:
            for ps, rom in conj[section].values():
                items.append({
                    'form': ps,
                    'romanization': rom,
                    'category': 'verb'
                })
                form_to_lemma[ps] = lemma
        # also include roots/participle shown in UI
        meta = conj['meta']
        for ps in [meta['imperfective_root'], meta['perfective_root'], meta['past_participle']]:
            rom = conj['meta']['romanization'].get('imperfective_root') if ps == meta['imperfective_root'] else (
                conj['meta']['romanization'].get('perfective_root') if ps == meta['perfective_root'] else conj['meta']['romanization'].get('past_participle')
            )
            items.append({'form': ps, 'romanization': rom or '', 'category': 'verb'})
            form_to_lemma[ps] = lemma

        by_lemma[lemma] = items

    return form_to_lemma, by_lemma


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