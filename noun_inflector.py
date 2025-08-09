import json
import os
from typing import Dict, Any, Optional

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
LEXICON_PATH = os.path.join(APP_ROOT, 'nouns_lexicon.json')


def load_lexicon() -> Dict[str, Any]:
    try:
        with open(LEXICON_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {}


NOUNS: Dict[str, Any] = load_lexicon()


def infer_default_pattern(lemma: str) -> str:
    return 'masc_basic_consonant'


# --- Pattern implementations ---

def _pattern_1_basic(lemma: str) -> Dict[str, tuple]:
    # Pattern #1 Basic. If feminine (ends with ـه), use feminine slots; else masculine.
    if lemma.endswith('ه'):
        base = lemma[:-1]
        return {
            'plain_f': (base + 'ه', ''),
            'inflection_1_f': (base + 'ې', ''),
            'inflection_2_f': (base + 'و', ''),
            'vocative_f': (base + 'ې', ''),
            'vocative_pl_f': (base + 'و', ''),
        }
    else:
        stem = lemma
        return {
            'plain_m': (stem, ''),
            'inflection_1_m': (stem, ''),
            'inflection_2_m': (stem + 'و', ''),
            # vocatives often not distinct for masc here; omit unless needed
        }


def _pattern_4_pashtoon(stem: str) -> Dict[str, tuple]:
    fem_base = (stem[:-2] + 'نه') if stem.endswith('ون') else (stem + 'ه')
    return {
        'plain_m': (stem, ''),
        'plain_f': (fem_base, ''),
        'inflection_1_m': (stem[:-2] + 'انه' if stem.endswith('ون') else stem + 'انه', ''),  # پښتانه
        'inflection_1_f': (fem_base[:-1] + 'ې', ''),  # پښتنې
        'inflection_2_m': (stem[:-2] + 'نو' if stem.endswith('ون') else stem + 'نو', ''),   # پښتنو
        'vocative_m': (stem + 'ه', ''),        # پښتونه
        'vocative_f': (fem_base[:-1] + 'ې', ''),
    }


def _pattern_2_unstressed_y(lemma: str) -> Dict[str, tuple]:
    stem = lemma[:-1] if lemma.endswith('ی') else lemma
    return {
        'plain_m': (stem + 'ی', ''),
        'plain_f': (stem + 'ې', ''),
        'inflection_1_m': (stem + 'ي', ''),
        'inflection_1_f': (stem + 'ې', ''),
        'inflection_2': (stem + 'یو', ''),
    }


def _pattern_3_stressed_ay(lemma: str) -> Dict[str, tuple]:
    stem = lemma[:-1] if lemma.endswith('ی') else lemma
    return {
        'plain_m': (stem + 'ی', ''),
        'plain_f': (stem + 'ۍ', ''),
        'inflection_1_m': (stem + 'ي', ''),
        'inflection_1_f': (stem + 'ۍ', ''),
        'inflection_2': (stem + 'یو', ''),
    }


def _pattern_5_short_squish(stem: str) -> Dict[str, tuple]:
    return {
        'plain_m': (stem, ''),
        'plain_f': (stem + 'ه', ''),
        'inflection_1_m': (stem + 'ه', ''),
        'inflection_1_f': (stem + 'ې', ''),
        'inflection_2': (stem + 'و', ''),
    }


def _pattern_half_fem_inanim_ee(lemma: str) -> Dict[str, tuple]:
    stem = lemma[:-1] if (lemma.endswith('ي') or lemma.endswith('ی')) else lemma
    return {
        'plain_f': (stem + 'ي', ''),
        'inflection_1_f': (stem + 'ۍ', ''),
        'inflection_2_f': (stem + 'یو', ''),
    }


def inflect_noun(lemma: str, pattern: Optional[str] = None) -> Dict[str, Any]:
    entry = NOUNS.get(lemma, {})
    pat = pattern or entry.get('pattern') or infer_default_pattern(lemma)

    if pat in ('masc_basic_consonant', 'basic'):
        forms = _pattern_1_basic(lemma)
    elif pat == 'pashtoon':
        forms = _pattern_4_pashtoon(lemma)
    elif pat == 'unstressed_y':
        forms = _pattern_2_unstressed_y(lemma)
    elif pat == 'stressed_ay':
        forms = _pattern_3_stressed_ay(lemma)
    elif pat == 'short_squish':
        forms = _pattern_5_short_squish(lemma)
    elif pat == 'fem_inanim_ee':
        forms = _pattern_half_fem_inanim_ee(lemma)
    else:
        forms = {}

    return {
        'meta': {
            'lemma': lemma,
            'pattern': pat,
            'pattern_info': entry.get('pattern_info', ''),
        },
        'forms': forms,
    }


# --- Helpers to map forms to lemmas ---

def build_noun_forms_index() -> Dict[str, str]:
    index: Dict[str, str] = {}
    for lemma in NOUNS.keys():
        data = inflect_noun(lemma)
        # include the lemma itself
        index[lemma] = lemma
        for ps, _ in data['forms'].values():
            index[ps] = lemma
    return index


def find_noun_lemma_for_form(form_ps: str) -> str:
    try:
        idx = build_noun_forms_index()
        return idx.get(form_ps, '')
    except Exception:
        return ''
