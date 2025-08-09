import json
import os
from typing import Dict, Any, List, Optional

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
LEXICON_PATH = os.path.join(APP_ROOT, 'verbs_lexicon.json')
EXTRA_IRREGULARS_PATH = os.path.join(APP_ROOT, 'irregular_verbs.json')
IRREGULARS_URL = os.environ.get('IRREGULAR_VERBS_URL', '')


def _safe_read_json(path: str) -> Dict[str, Any]:
    try:
        if os.path.exists(path) and os.path.getsize(path) > 0:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            if isinstance(data, dict):
                return data
    except Exception:
        pass
    return {}


def _maybe_fetch_irregulars(url: str, target_path: str) -> None:
    if not url:
        return
    try:
        import requests  # lightweight optional dependency already used elsewhere
        resp = requests.get(url, timeout=20)
        resp.raise_for_status()
        # Only accept JSON payloads
        if 'json' in (resp.headers.get('Content-Type') or '').lower():
            with open(target_path, 'wb') as f:
                f.write(resp.content)
    except Exception:
        # Silent failure; fall back to local files
        pass


def load_lexicon() -> Dict[str, Any]:
    # Optionally refresh irregulars from a remote source
    _maybe_fetch_irregulars(IRREGULARS_URL, EXTRA_IRREGULARS_PATH)
    base = _safe_read_json(LEXICON_PATH)
    extra = _safe_read_json(EXTRA_IRREGULARS_PATH)

    # Merge with extra irregulars taking precedence per-verb
    merged: Dict[str, Any] = dict(base)
    for root, spec in (extra or {}).items():
        if not isinstance(spec, dict):
            continue
        cur = merged.get(root, {})
        # shallow merge for known keys
        merged[root] = {
            **cur,
            **{k: v for k, v in spec.items() if v}
        }
    return merged


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

# Ability helper endings (شـ auxiliary)
ABILITY_PRESENT = {
    '1sg': ('شم', 'shum'),
    '1pl': ('شو', 'shoo'),
    '2sg': ('شې', 'she'),
    '2pl': ('شئ', 'shey'),
    '3sg': ('شي', 'shee'),
    '3pl': ('شي', 'shee'),
}

ABILITY_PAST = {
    '1sg': ('شوم', 'shwum'),
    '1pl': ('شو', 'shoo'),
    '2sg': ('شوې', 'shwe'),
    '2pl': ('شوئ', 'shwey'),
    '3sg_m': ('شو', 'sho'),
    '3sg_f': ('شوه', 'shwa'),
    '3pl': ('شول', 'shwul'),
}

# Equative (to be) endings for perfect constructions
EQUATIVE_PRESENT = {
    '1sg': ('یم', 'yum'),
    '1pl': ('یو', 'yoo'),
    '2sg': ('یې', 'ye'),
    '2pl': ('یاست', 'yaast'),
    '3sg_m': ('دی', 'day'),
    '3sg_f': ('ده', 'da'),
    '3pl': ('دي', 'dee'),
}

EQUATIVE_PAST = {
    '1sg': ('وم', 'wum'),
    '1pl': ('وو', 'woo'),
    '2sg': ('وې', 'we'),
    '2pl': ('وئ', 'wey'),
    '3sg_m': ('و', 'wo'),
    '3sg_f': ('وه', 'wa'),
    '3pl': ('وو', 'woo'),
}


def _build_tables_from_spec(root: str, spec: Dict[str, Any]) -> Dict[str, Any]:
    """Given a minimal verb spec, build full tables using standard endings."""
    imperfective_stem = spec['stems']['imperfective']
    perfective_stem = spec['stems']['perfective']
    imperfective_root = spec['roots']['imperfective']
    perfective_root = spec['roots']['perfective']
    past_participle = spec['past_participle']

    # Romanization is optional for dynamic verbs; default to empty strings
    rom = spec.get('romanization', {}) or {}
    impf_stem_rom = rom.get('imperfective_stem', '')
    perf_stem_rom = rom.get('perfective_stem', '')
    impf_root_rom = rom.get('imperfective_root', '')
    perf_root_rom = rom.get('perfective_root', '')
    part_rom = rom.get('past_participle', '')

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

    present = build_present(imperfective_stem, impf_stem_rom)
    subjunctive = build_present(perfective_stem, perf_stem_rom)
    cont_past = build_past(imperfective_root, impf_root_rom)
    simple_past = build_past(perfective_root, perf_root_rom)

    # Futures: به + present/subjunctive
    def with_ba(table):
        out = {}
        for k, (ps, romv) in table.items():
            out[k] = (f"... به ... {ps}", f"... ba ... {romv}")
        return out
    impf_future = with_ba(present)
    perf_future = with_ba(subjunctive)

    # Imperatives (2nd person singular only for now)
    imperfective_imperative = {'2sg': (imperfective_stem + 'ه', (impf_stem_rom or '') + 'a')}
    perfective_imperative = {'2sg': (perfective_stem + 'ه', (perf_stem_rom or '') + 'a')}

    # Habitual past forms (به + past)
    habitual_cont_past = {k: (f"... به ... {ps}", f"... ba ... {rom}") for k, (ps, rom) in cont_past.items()}
    habitual_simple_past = {k: (f"... به ... {ps}", f"... ba ... {rom}") for k, (ps, rom) in simple_past.items()}

    # Ability forms based on past participle + شـ auxiliary
    def build_ability_present(base_ps, base_rom):
        return {k: (f"{base_ps} {ABILITY_PRESENT[k][0]}", f"{base_rom} {ABILITY_PRESENT[k][1]}") for k in ['1sg','2sg','3sg','1pl','2pl','3pl']}

    def build_ability_past(base_ps, base_rom):
        return {k: (f"{base_ps} {ABILITY_PAST[k][0]}", f"{base_rom} {ABILITY_PAST[k][1]}") for k in ['1sg','2sg','3sg_m','3sg_f','1pl','2pl','3pl']}

    ability_present = build_ability_present(past_participle, part_rom)
    ability_subjunctive = build_ability_present(('و' + past_participle) if not past_participle.startswith('و') else past_participle, part_rom)
    ability_cont_past = build_ability_past(past_participle, part_rom)
    ability_simple_past = build_ability_past(('و' + past_participle) if not past_participle.startswith('و') else past_participle, part_rom)
    ability_impf_future = {k: (f"... به ... {ps}", f"... ba ... {rom}") for k, (ps, rom) in ability_present.items()}
    ability_perf_future = {k: (f"... به ... {ps}", f"... ba ... {rom}") for k, (ps, rom) in ability_subjunctive.items()}

    forms_map = {
        imperfective_root: impf_root_rom,
        perfective_root: perf_root_rom,
        past_participle: part_rom,
    }
    for d in (present, subjunctive, cont_past, simple_past, imperfective_imperative, perfective_imperative,
              impf_future, perf_future, habitual_cont_past, habitual_simple_past,
              ability_present, ability_subjunctive, ability_cont_past, ability_simple_past,
              ability_impf_future, ability_perf_future):
        for _, (ps, rom_val) in d.items():
            forms_map[ps] = rom_val

    return {
        'meta': {
            'root': root,
            'type': 'Verb',
            'imperfective_stem': imperfective_stem,
            'perfective_stem': perfective_stem,
            'imperfective_root': imperfective_root,
            'perfective_root': perfective_root,
            'past_participle': past_participle,
            'romanization': rom,
        },
        'present': present,
        'subjunctive': subjunctive,
        'imperfective_future': impf_future,
        'perfective_future': perf_future,
        'imperfective_imperative': imperfective_imperative,
        'perfective_imperative': perfective_imperative,
        'continuous_past': cont_past,
        'simple_past': simple_past,
        'habitual_continuous_past': habitual_cont_past,
        'habitual_simple_past': habitual_simple_past,
        'ability_present': ability_present,
        'ability_subjunctive': ability_subjunctive,
        'ability_continuous_past': ability_cont_past,
        'ability_simple_past': ability_simple_past,
        'ability_imperfective_future': ability_impf_future,
        'ability_perfective_future': ability_perf_future,
        'forms_map': forms_map,
    }


def _infer_regular_spec(root: str) -> Optional[Dict[str, Any]]:
    """Infer stems/roots for common regular categories.

    Implemented categories:
    - ndal (.*ندل): imperfective stem => replace 'ندل' with 'ن'; perfective stem => 'و'+imperfective stem
    - default (.*ل): imperfective stem => drop final 'ل'; perfective stem => prefix 'و'
    """
    if not root or not root.endswith('ل'):
        return None

    # Category 1: .*ندل → stem ن
    if root.endswith('ندل') and len(root) > 3:
        impf_stem = root[:-3] + 'ن'
        perf_stem = ('و' + impf_stem) if not impf_stem.startswith('و') else impf_stem
        impf_root = root
        perf_root = ('و' + root) if not root.startswith('و') else root
        past_part = root[:-1] + 'لی'
        return {
            'stems': {'imperfective': impf_stem, 'perfective': perf_stem},
            'roots': {'imperfective': impf_root, 'perfective': perf_root},
            'past_participle': past_part,
            'romanization': {},
        }

    # Category 2: default .*ل → drop final ل
    if len(root) > 1:
        base = root[:-1]
        impf_stem = base
        perf_stem = ('و' + base) if not base.startswith('و') else base
        impf_root = root
        perf_root = ('و' + root) if not root.startswith('و') else root
        past_part = base + 'لی'
        return {
            'stems': {'imperfective': impf_stem, 'perfective': perf_stem},
            'roots': {'imperfective': impf_root, 'perfective': perf_root},
            'past_participle': past_part,
            'romanization': {},
        }
    return None


def conjugate_verb(root: str) -> Dict[str, Any]:
    """Backwards-compatible API: prefer irregular/lexicon; fall back to dynamic rules."""
    v = VERBS.get(root)
    if v:
        return _build_tables_from_spec(root, v)
    spec = _infer_regular_spec(root)
    return _build_tables_from_spec(root, spec) if spec else {}


def conjugate_verb_dynamic(root: str) -> Dict[str, Any]:
    """Explicit dynamic entry point; identical to conjugate_verb for now."""
    return conjugate_verb(root)


def infer_root_from_form(form_ps: str) -> str:
    """Infer a plausible infinitive root for a given verb form by testing candidates.

    Strategy:
    - Identify likely present/subjunctive endings; strip to get a stem candidate
    - Generate candidate roots: stem+"ل", stem+"دل"; optionally with perfective prefix "و"
    - Conjugate each candidate dynamically and check if any table contains the form
    - Return the first matching candidate root, or '' if none match
    """
    if not form_ps:
        return ''

    endings = ['م', 'ې', 'ي', 'و', 'ئ']  # present/subj endings
    candidates: List[str] = []

    # Handle perfective present/subjunctive with initial و
    starts_with_perf = form_ps.startswith('و')
    core = form_ps[1:] if starts_with_perf else form_ps

    # Try stripping one-character endings
    if any(core.endswith(e) for e in endings) and len(core) > 1:
        base = core[:-1]
        # stem → roots
        raw_roots = [base + 'ل', base + 'دل']
        if starts_with_perf:
            raw_roots += ['و' + base + 'ل', 'و' + base + 'دل']
        candidates.extend(raw_roots)

    # Also try assuming the form is already an infinitive
    if form_ps.endswith('ل'):
        candidates.append(form_ps)

    # Deduplicate while preserving order
    seen = set()
    uniq: List[str] = []
    for r in candidates:
        if r not in seen:
            seen.add(r)
            uniq.append(r)

    for cand in uniq:
        conj = conjugate_verb(cand)
        if not conj:
            continue
        # Search across all tables for an exact match
        for table_name in ['present', 'subjunctive', 'continuous_past', 'simple_past']:
            table = conj.get(table_name, {})
            for ps, _rom in table.values():
                if ps == form_ps:
                    return cand
        # also check roots and participle
        m = conj.get('meta', {})
        if form_ps in (
            m.get('imperfective_root'), m.get('perfective_root'), m.get('past_participle')
        ):
            return cand

    return ''


def build_forms_root_index() -> Dict[str, str]:
    index: Dict[str, str] = {}
    for root in VERBS.keys():
        conj = conjugate_verb(root)
        if not conj:
            continue
        for dname in ['present', 'subjunctive', 'continuous_past', 'simple_past']:
            for ps, _ in conj[dname].values():
                index[ps] = root
        # also include roots and participle
        meta = conj['meta']
        index[meta['imperfective_root']] = root
        index[meta['perfective_root']] = root
        index[meta['past_participle']] = root
    return index


def find_lexicon_root_for_form(form_ps: str) -> str:
    forms_index = build_forms_root_index()
    return forms_index.get(form_ps, '')


