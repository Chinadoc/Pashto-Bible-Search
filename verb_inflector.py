import json
import os
from typing import Dict, Any, List

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
LEXICON_PATH = os.path.join(APP_ROOT, 'verbs_lexicon.json')


def load_lexicon() -> Dict[str, Any]:
    try:
        with open(LEXICON_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {}


VERBS = load_lexicon()

# Present/subjunctive endings (Pashto)
PRESENT_ENDINGS = {
    '1sg': ('م', 'um'),
    '1pl': ('و', 'oo'),
    '2sg': ('ې', 'e'),
    '2pl': ('ئ', 'ey'),
    '3sg': ('ي', 'ee'),
    '3pl': ('ي', 'ee'),
}

# Past endings (agree with object)
PAST_ENDINGS = {
    '1sg': ('م', 'um'),
    '1pl': ('و', 'oo'),
    '2sg': ('ې', 'e'),
    '2pl': ('ئ', 'ey'),
    '3sg_m': ('و', 'o'),
    '3sg_f': ('ه', 'a'),
    '3pl': ('', ''),
}


def conjugate_verb(root: str) -> Dict[str, Any]:
    v = VERBS.get(root)
    if not v:
        return {}

    imperfective_stem = v['stems']['imperfective']  # e.g., وین
    perfective_stem = v['stems']['perfective']      # e.g., ووین
    imperfective_root = v['roots']['imperfective']  # لیدل
    perfective_root = v['roots']['perfective']      # ولیدل
    past_participle = v['past_participle']          # لیدلی

    impf_stem_rom = v['romanization']['imperfective_stem']
    perf_stem_rom = v['romanization']['perfective_stem']
    part_rom = v['romanization']['past_participle']

    def build_present(stem_ps, stem_rom):
        return {
            '1sg': (stem_ps + PRESENT_ENDINGS['1sg'][0], stem_rom + PRESENT_ENDINGS['1sg'][1]),
            '1pl': (stem_ps + PRESENT_ENDINGS['1pl'][0], stem_rom + PRESENT_ENDINGS['1pl'][1]),
            '2sg': (stem_ps + PRESENT_ENDINGS['2sg'][0], stem_rom + PRESENT_ENDINGS['2sg'][1]),
            '2pl': (stem_ps + PRESENT_ENDINGS['2pl'][0], stem_rom + PRESENT_ENDINGS['2pl'][1]),
            '3sg': (stem_ps + PRESENT_ENDINGS['3sg'][0], stem_rom + PRESENT_ENDINGS['3sg'][1]),
            '3pl': (stem_ps + PRESENT_ENDINGS['3pl'][0], stem_rom + PRESENT_ENDINGS['3pl'][1]),
        }

    def build_past(stem_ps, stem_rom):
        return {
            '1sg': (stem_ps + PAST_ENDINGS['1sg'][0], stem_rom + PAST_ENDINGS['1sg'][1]),
            '1pl': (stem_ps + PAST_ENDINGS['1pl'][0], stem_rom + PAST_ENDINGS['1pl'][1]),
            '2sg': (stem_ps + PAST_ENDINGS['2sg'][0], stem_rom + PAST_ENDINGS['2sg'][1]),
            '2pl': (stem_ps + PAST_ENDINGS['2pl'][0], stem_rom + PAST_ENDINGS['2pl'][1]),
            '3sg_m': (stem_ps + PAST_ENDINGS['3sg_m'][0], stem_rom + PAST_ENDINGS['3sg_m'][1]),
            '3sg_f': (stem_ps + PAST_ENDINGS['3sg_f'][0], stem_rom + PAST_ENDINGS['3sg_f'][1]),
            '3pl': (stem_ps + PAST_ENDINGS['3pl'][0], stem_rom + PAST_ENDINGS['3pl'][1]),
        }

    present = build_present(imperfective_stem, v['romanization']['imperfective_stem'])
    subjunctive = build_present(perfective_stem, v['romanization']['perfective_stem'])

    # Continuous past uses imperfective root + past endings
    cont_past = build_past(v['roots']['imperfective'], v['romanization']['imperfective_root'])
    # Simple past uses perfective root + past endings
    simple_past = build_past(v['roots']['perfective'], v['romanization']['perfective_root'])

    # Map Pashto forms to romanization for quick override in UI
    forms_map = {
        imperfective_root: v['romanization']['imperfective_root'],
        perfective_root: v['romanization']['perfective_root'],
        past_participle: v['romanization']['past_participle'],
    }
    for d in (present, subjunctive, cont_past, simple_past):
        for _, (ps, rom) in d.items():
            forms_map[ps] = rom

    return {
        'meta': {
            'root': root,
            'type': 'Verb',
            'imperfective_stem': imperfective_stem,
            'perfective_stem': perfective_stem,
            'imperfective_root': imperfective_root,
            'perfective_root': perfective_root,
            'past_participle': past_participle,
            'romanization': v['romanization'],
        },
        'present': present,
        'subjunctive': subjunctive,
        'continuous_past': cont_past,
        'simple_past': simple_past,
        'forms_map': forms_map,
    }


