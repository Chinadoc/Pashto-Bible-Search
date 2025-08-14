import os
import json
# a line will be added here to fix linter error in the next step.
FORM_TO_LEMMA_FILE = 'form_to_lemma.json'
def handle_grammatical_search(query, form_to_root_map, grammatical_index, nt_text, ot_text, scope):
    # reset audio counter per search render
    st.session_state['audio_loaded_count'] = 0
    _inject_scroll_spy_assets()
    # Preserve the exact form the user searched for and show its occurrences first
    normalized_form = normalize_pashto_char(query)
    # Prefer precomputed cache or external service; fall back to local lexicon
    form_to_lemma = load_form_to_lemma_map()
    # NEW: noun fallback mapping (forms→lemma) so خره groups with خرې/خرو etc.
    noun_forms_index = build_noun_forms_index() if NOUNS else {}

    lex_root = (
        form_to_lemma.get(normalized_form)
        or find_lexicon_root_for_form(normalized_form)
        or noun_forms_index.get(normalized_form)
        or infer_root_from_form(normalized_form)
    )
    conj_for_form = conjugate_verb(lex_root) if lex_root else None
    form_rom = ''
    if conj_for_form and isinstance(conj_for_form, dict) and 'forms_map' in conj_for_form:
        form_rom = conj_for_form['forms_map'].get(normalized_form, '')
    if not form_rom:
        form_rom = romanize_from_dict_or_rules(normalized_form)

    # Top section: occurrences for the searched form (scope-aware scan) with small LRU cache
    selected_text = nt_text if scope == 'New Testament' else ot_text if scope == 'Old Testament' else {**nt_text, **ot_text}
    g_cache_key = f"__gram_cache::{scope}::{normalized_form}"

    # Sense disambiguation panel when a headword has multiple dictionary senses
    def _dict_senses_for(word: str) -> list:
        try:
            nkey = normalize_pashto_char(word)
            senses = []
            if FAST_DICT_INDEX:
                # fast index may store only one entry; fall back to DICT_MAP
                pass
            entries = DICT_MAP.get(word, []) or DICT_NORM_MAP.get(nkey, []) or []
            for ent in entries:
                senses.append({
                    'pos': ent.get('c', ''),
                    'rom': (ent.get('f', '') or '').split(',')[0].strip(),
                    'english': ent.get('e', ''),
                })
            return senses
        except Exception:
            return []

    senses = _dict_senses_for(normalized_form)
    sense_filter = None
    if len(senses) > 1:
        with st.expander("This word has multiple dictionary senses — choose one to filter verses"):
            cols = st.columns(min(3, len(senses)))
            labels = []
            for i, s in enumerate(senses):
                lab = f"{normalize_pos_label(s.get('pos',''))} — {s.get('english','')[:60]}"
                labels.append(lab)
                with cols[i % len(cols)]:
                    st.caption(f"{lab}\n\n{(s.get('rom') or '')}")
            pick = st.radio("Sense", options=["All senses"] + labels, index=0, horizontal=False)
            if pick != "All senses":
                sense_filter = pick

    def _sense_match(text: str) -> bool:
        if not sense_filter:
            return True
        sf = sense_filter.lower()
        # Minimal heuristics for common ambiguous terms like لور
        # - daughter: nearby words like مور/پلار/یوازینۍ/انجلۍ/بیرته کور
        # - direction/side: phrases like په لور, د ... لور, په لوري, په لور روان
        # - sickle: harvest vocabulary لو/رېبل/فصل/ګندم/لور (tool context)
        try:
            t = text
            if 'daughter' in sf or 'n. f' in sf:
                return any(x in t for x in ['مور','پلار','انجلۍ','خور','یوازینۍ','د زوی','د لور'])
            if 'direction' in sf or 'side' in sf:
                return any(x in t for x in ['په لور','لور روان','په لوري','د ښار لور','د کور لور','د اورشلیم لور'])
            if 'sickle' in sf:
                return any(x in t for x in ['فصل','رېبل','لو','ګندم','لور واخیست','لور راواخله'])
        except Exception:
            pass
        return True

    # Fast path: use precomputed occurrence index and filter to current scope
    if g_cache_key in st.session_state:
        verses_to_show = st.session_state[g_cache_key]
    else:
        occ = form_occurrence_index.get(normalized_form, {'count': 0, 'verses': []})
        verses_to_show = [v for v in sorted(set(occ.get('verses', []))) if v in selected_text and _sense_match(selected_text.get(v, ''))]
        st.session_state[g_cache_key] = verses_to_show
    if verses_to_show:
        # Limit default list to 5 entries with NT-first prioritization (Gospels first)
        st.subheader(f"Occurrences of {normalized_form} ({form_rom}) — {len(verses_to_show)} hits")
        _coverage_add(verses_to_show)
        render_animated_book_panel(verses_to_show, selected_text, title="Book Coverage")
        filtered = verses_to_show
        bf = (globals().get('QP_B') or '').strip()
        if bf:
            filtered = [v for v in verses_to_show if _extract_book_from_ref(v) == bf]
        # Prioritization order
        gospels = ['Matthew','Mark','Luke','John']
        def rank(vref: str) -> tuple:
            pass

def search():
    pass

def simple_search(query: str, texts: dict) -> list:
    results = []
    for ref, text in texts.items():
        if query in text:
            results.append(ref)
    return results

# Placeholder functions for dependencies
def _inject_scroll_spy_assets(): pass
def normalize_pashto_char(text):
    replacements = {'ي': 'ی', 'ى': 'ی', 'ئ': 'ی'}
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

def load_form_to_lemma_map():
    try:
        if not os.path.exists(FORM_TO_LEMMA_FILE):
            return {}
        with open(FORM_TO_LEMMA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {}

def build_noun_forms_index(): return {}
def find_lexicon_root_for_form(s): return None
def infer_root_from_form(s): return None
def conjugate_verb(s): return None
def romanize_from_dict_or_rules(s): return ""
def normalize_pos_label(s): return s

# Placeholder for streamlit
class St:
    def __init__(self):
        self.session_state = {}
    def expander(self, *args, **kwargs):
        return self
    def __enter__(self):
        pass
    def __exit__(self, exc_type, exc_val, exc_tb):
        pass
    def columns(self, *args, **kwargs):
        return [self] * args[0]
    def caption(self, *args, **kwargs):
        pass
    def radio(self, *args, **kwargs):
        return "All senses"
    def subheader(self, *args, **kwargs):
        pass
st = St()

# Globals
NOUNS = True
FAST_DICT_INDEX = True
DICT_MAP = {}
DICT_NORM_MAP = {}
form_occurrence_index = {}
def _coverage_add(s): pass
def render_animated_book_panel(*args, **kwargs): pass
def _extract_book_from_ref(s): return ""
