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

# Optional fast dictionary index for quick romanization lookup of forms
_FAST_INDEX_PATH = os.path.join(APP_ROOT, 'dictionary_fast_index.json')
try:
    if os.path.exists(_FAST_INDEX_PATH):
        with open(_FAST_INDEX_PATH, 'r', encoding='utf-8') as _f:
            _FAST_DIDX = json.load(_f)
    else:
        _FAST_DIDX = {}
except Exception:
    _FAST_DIDX = {}

# Optional prebuilt verb forms index on disk
_VERB_FORMS_INDEX_PATH = os.path.join(APP_ROOT, 'verb_forms_index.json')
_FORMS_ROOT_INDEX: Dict[str, str] = {}
_FORMS_ROM_INDEX: Dict[str, str] = {}

def _normalize_pashto_key(text: str) -> str:
    if not isinstance(text, str):
        return text
    replacements = {'ي': 'ی', 'ى': 'ی', 'ئ': 'ی'}
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

def _lookup_verb_spec(root: str) -> Optional[Dict[str, Any]]:
    """Find a verb spec using robust matching (normalized Yeh variants).

    This prevents falling back to regular rules for irregulars like 'لیدل'.
    """
    if not root:
        return None
    if root in VERBS:
        return VERBS[root]
    norm = _normalize_pashto_key(root)
    for k, spec in VERBS.items():
        if _normalize_pashto_key(k) == norm:
            return spec
    return None

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
    v = _lookup_verb_spec(root)
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

    # Try stripping common preverbs first (را / در / ور). Keep a set of
    # variants to attempt recognition on.
    preverbs = ['را', 'در', 'ور']
    obj_clitic_prefixes = ['و یې', 'وېې', 'ویې']
    form_variants: List[str] = [form_ps]
    for pv in preverbs:
        if form_ps.startswith(pv):
            form_variants.append(form_ps[len(pv):])
        # also handle preverb immediately followed by perfective و
        if form_ps.startswith(pv + 'و'):
            form_variants.append(form_ps[len(pv):])
    for oc in obj_clitic_prefixes:
        if form_ps.startswith(oc):
            trimmed = form_ps[len(oc):].lstrip()
            # assume perfective present/subjunctive behind the clitic
            form_variants.append(trimmed)

    # Also attempt bare perfective stripping on each variant
    base_variants: List[str] = []
    for v in form_variants:
        if v.startswith('و'):
            base_variants.append(v[1:])
        base_variants.append(v)

    # Deduplicate while preserving order
    seen_forms = set()
    norm_forms: List[str] = []
    for v in base_variants:
        if v not in seen_forms:
            seen_forms.add(v)
            norm_forms.append(v)

    for core in norm_forms:
        starts_with_perf = form_ps.startswith('و') or core.startswith('و')
        # Try stripping one-character endings
        if any(core.endswith(e) for e in endings) and len(core) > 1:
            base = core[:-1]
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
    """Return a cached map of verb form → root; build and persist if needed."""
    global _FORMS_ROOT_INDEX, _FORMS_ROM_INDEX
    if _FORMS_ROOT_INDEX:
        return _FORMS_ROOT_INDEX
    # Try disk cache first
    try:
        if os.path.exists(_VERB_FORMS_INDEX_PATH) and os.path.getsize(_VERB_FORMS_INDEX_PATH) > 0:
            with open(_VERB_FORMS_INDEX_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
            _FORMS_ROOT_INDEX = data.get('form_to_root', {}) or {}
            _FORMS_ROM_INDEX = data.get('form_to_rom', {}) or {}
            if _FORMS_ROOT_INDEX:
                return _FORMS_ROOT_INDEX
    except Exception:
        pass

    form_to_root: Dict[str, str] = {}
    form_to_rom: Dict[str, str] = {}

    def _add(ps: str, rom: str, root_val: str) -> None:
        form_to_root[ps] = root_val
        if rom:
            form_to_rom[ps] = rom
        # Also index preverb variants for recognition in search
        for pv in ['را', 'در', 'ور']:
            v = pv + ps
            form_to_root[v] = root_val
            if rom:
                form_to_rom[v] = rom
    for root in VERBS.keys():
        conj = conjugate_verb(root)
        if not conj:
            continue
        # Collect tables with romanization
        for dname in ['present', 'subjunctive', 'continuous_past', 'simple_past']:
            for ps, rom in conj[dname].values():
                _add(ps, rom, root)
        meta = conj['meta']
        for ps, rom in [
            (meta['imperfective_root'], conj['meta']['romanization'].get('imperfective_root', '')),
            (meta['perfective_root'], conj['meta']['romanization'].get('perfective_root', '')),
            (meta['past_participle'], conj['meta']['romanization'].get('past_participle', '')),
        ]:
            _add(ps, rom, root)

        # Add object clitic split-head variants for perfective-leading forms
        def _index_obj_clitic_variants(ps: str, rom_val: str) -> None:
            if not ps or not ps.startswith('و'):
                return
            rest = ps[1:]
            for oc in ['و یې', 'وېې', 'ویې']:
                v1 = f"{oc} {rest}"
                v2 = f"{oc}{rest}"
                _add(v1, rom_val, root)
                _add(v2, rom_val, root)

        for dname in ['subjunctive', 'simple_past']:
            for ps, rom in conj[dname].values():
                _index_obj_clitic_variants(ps, rom)

    _FORMS_ROOT_INDEX = form_to_root
    _FORMS_ROM_INDEX = form_to_rom
    try:
        with open(_VERB_FORMS_INDEX_PATH, 'w', encoding='utf-8') as f:
            json.dump({'form_to_root': form_to_root, 'form_to_rom': form_to_rom}, f, ensure_ascii=False)
    except Exception:
        pass
    return _FORMS_ROOT_INDEX


def find_lexicon_root_for_form(form_ps: str) -> str:
    forms_index = build_forms_root_index()
    return forms_index.get(form_ps, '')


def romanization_for_form_fast(form_ps: str) -> str:
    """Quickly fetch romanization using fast sources: verb forms index or dictionary fast index."""
    try:
        if not _FORMS_ROM_INDEX:
            build_forms_root_index()
        rom = _FORMS_ROM_INDEX.get(form_ps, '')
        if rom:
            return rom
        if _FAST_DIDX:
            by_p = _FAST_DIDX.get('by_pashto', {})
            by_pn = _FAST_DIDX.get('by_pashto_norm', {})
            if form_ps in by_p:
                return by_p[form_ps].get('rom', '') or ''
            nkey = _normalize_pashto_key(form_ps)
            if nkey in by_pn:
                return by_pn[nkey].get('rom', '') or ''
    except Exception:
        pass
    return ''
