import streamlit as st
import json
import re
import os
import requests
from urllib.parse import quote_plus
import pandas as pd
from functools import lru_cache
from collections import defaultdict
import hashlib
from search_utils import (
    search_grammatical_forms,
    get_form_occurrences,
    get_form_occurrences_any,
    build_form_occurrence_index,
)
from verb_inflector import conjugate_verb, find_lexicon_root_for_form, infer_root_from_form
# Optional fast romanization helper (older deployments may not have it)
try:
    from verb_inflector import romanization_for_form_fast  # type: ignore
except Exception:
    def romanization_for_form_fast(form_ps: str) -> str:  # fallback no-op
        return ''
from noun_inflector import (
    inflect_noun,
    NOUNS,
    find_noun_lemma_for_form,
    build_noun_forms_index,
    classify_inflection_type,
    infer_pattern1_masc_lemma_from_form,
)
import unicodedata

# Sandwich markers (pre/post/circumpositions) – minimal list
SANDWICH_MARKERS = [
    'د',    # of/'s (pre-)
    'په',   # in/at (pre-)
    'له',   # from/with (pre-)
    'پر',   # on (pre-)
    'کې',   # in/at (post-)
    'سره',  # with (post-)
    ' باندې', # on (post- compound)
]

# Common sandwich patterns for nouns/adjectives
SANDWICH_PATTERNS = [
    {'type': 'pre', 'left': 'د', 'right': None},                 # د X ...
    {'type': 'circ', 'left': 'په', 'right': 'کې'},               # په X کې
    {'type': 'circ', 'left': 'له', 'right': 'سره'},             # له X سره
    {'type': 'circ', 'left': 'پر', 'right': 'باندې'},           # پر X باندې
    {'type': 'circ', 'left': 'د', 'right': 'په اړه'},           # د X په اړه
    {'type': 'circ', 'left': 'د', 'right': 'په بارې کې'},        # د X په بارې کې
    {'type': 'circ', 'left': 'د', 'right': 'دپاره'},            # د X دپاره
]

PAST_TRANSITIVE_VERB_HINTS = ['و', 'شو', 'کړ', 'وخ']  # crude hints, can refine


# --- Utility: occurrences in a given text map ---
def _generate_orthographic_variants(form_ps: str) -> list:
    """Return common Pashto spelling variants for a form (best-effort).

    Examples handled:
    - واخستل ↔︎ واخیستل, اخستل ↔︎ اخیستل (insert/remove ی after خ before ست)
    """
    try:
        base = normalize_pashto_char(form_ps)
        variants = set([base])
        # Rule: insert ی after خ when followed by ست
        v1 = re.sub('خ(?=ست)', 'خی', base)
        v2 = re.sub('خی(?=ست)', 'خ', base)  # reverse
        variants.update([v1, v2])
        return [v for v in variants if v]
    except Exception:
        return [form_ps]


def _find_occurrences_in_text(form_ps: str, text_map: dict, whole_word: bool = True) -> dict:
    norm = normalize_pashto_char(form_ps)
    # Prefer precomputed normalized maps if available in globals
    global NT_NORM_MAP, OT_NORM_MAP
    src = text_map
    if src is NT_TEXT:
        nm = NT_NORM_MAP
    elif src is OT_TEXT:
        nm = OT_NORM_MAP
    else:
        nm = {ref: normalize_pashto_char(txt) for ref, txt in text_map.items()}
    # Check base and orthographic variants
    cand_forms = _generate_orthographic_variants(norm)
    verses = []
    for ref, txt in nm.items():
        if whole_word:
            # exact token/phrase match with whitespace boundaries
            for cf in cand_forms:
                if ' ' in cf:
                    if re.search(rf'(^|\s){re.escape(cf)}(\s|$)', txt):
                        verses.append(ref)
                        break
                else:
                    toks = tokenize_ps(txt)
                    if cf in toks:
                        verses.append(ref)
                        break
        else:
            if any(cf in txt for cf in cand_forms):
                verses.append(ref)
    return {'count': len(verses), 'verses': verses}


def tokenize_ps(text: str) -> list:
    punct = '.,:;!?؟،؛"\'()[]{}“”«»'
    t = text
    for p in punct:
        t = t.replace(p, ' ')
    # collapse whitespace
    return [tok for tok in t.split() if tok]


def is_likely_perfective_past_token(tok: str) -> bool:
    t = tok.strip()
    if not t:
        return False
    if t.startswith('و') or t.startswith('وو'):
        if any(h in t for h in PAST_TRANSITIVE_VERB_HINTS):
            return True
        if re.search(r'(م|ې|ئ|ي|و|ه)$', t):
            return True
    if any(h in t for h in PAST_TRANSITIVE_VERB_HINTS) and re.search(r'(م|ې|ئ|ي|و|ه)$', t):
        return True
    return False


PLURAL_SUFFIXES = ('ونه', 'ونو', 'ان', 'انو', 'ګانې', 'گانې', 'و')
NUMERAL_WORDS = {'يو','یوه','دوه','درې','څلور','پنځه','شپږ','اووه','اته','نهه','لس'}


def classify_inflection_reason_struct(verse_text: str, form_ps: str) -> list:
    tokens = tokenize_ps(verse_text)
    reasons = []
    # Try to recover lemma and its 1st/2nd inflection sets
    lemma = find_noun_lemma_for_form(form_ps) if 'find_noun_lemma_for_form' in globals() else ''
    first_forms = set()
    second_forms = set()
    plural_forms = set()
    if lemma and lemma in NOUNS:
        n = inflect_noun(lemma)
        for k, (ps, _) in n['forms'].items():
            if 'inflection_1' in k:
                first_forms.add(ps)
            if 'inflection_2' in k:
                second_forms.add(ps)
            if k in ('plural',):
                plural_forms.add(ps)
    # Sandwich detection: look for patterns around the token
    try:
        idx = tokens.index(form_ps)
    except ValueError:
        # fallback: try normalized match
        norm = normalize_pashto_char(form_ps)
        idx = next((i for i,t in enumerate(tokens) if normalize_pashto_char(t)==norm), -1)
    if idx != -1:
        left_ctx = tokens[max(0, idx-4):idx]
        right_ctx = tokens[idx+1: idx+5]
        left_set = set(left_ctx); right_set = set(right_ctx)
        # prepositions immediately before or within 2 tokens
        for pat in SANDWICH_PATTERNS:
            if pat['type'] == 'pre' and pat['left'] in left_set:
                reasons.append('sandwich')
                break
            if pat['type'] == 'circ':
                if pat['left'] in left_set and pat['right'] in right_set:
                    reasons.append('sandwich')
                    break
        # vocative marker near the left side
        if any(v in left_set for v in {'اې', 'ای'}):
            reasons.append('vocative')
        # plural signals
        if form_ps.endswith(PLURAL_SUFFIXES) or form_ps in plural_forms or any(tok.isdigit() or tok in NUMERAL_WORDS for tok in left_ctx+right_ctx):
            reasons.append('plural')
        # past transitive subject hint
        if any(is_likely_perfective_past_token(tok) for tok in left_ctx[-3:]+right_ctx[:3]):
            reasons.append('subject-of-past-transitive?')
    else:
        # no token index; fallback heuristics
        if any(m in verse_text for m in SANDWICH_MARKERS):
            reasons.append('sandwich')
        if form_ps.endswith(PLURAL_SUFFIXES):
            reasons.append('plural')
        if (' اې ' in verse_text) or (' ای ' in verse_text) or verse_text.strip().startswith(('اې','ای')):
            reasons.append('vocative')
    # If the form matches explicit 2nd inflection and sandwich detected, suggest double inflection
    if (form_ps in second_forms) and ('sandwich' in reasons or 'subject-of-past-transitive?' in reasons):
        if 'plural' not in reasons:
            reasons.append('plural')  # second inflection usually plural+another reason
    return reasons


# --- Unicode Normalization ---
def normalize_pashto_char(text):
    replacements = {'ي': 'ی', 'ى': 'ی', 'ئ': 'ی'}
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

# --- Configuration & Data Loading (Robust Paths) ---
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
APP_VERSION = "ot-unified-2025-08-09a"
DATA_DIR = os.path.join(APP_ROOT, 'all_txt_copies')
OT_DATA_DIR = os.path.join(APP_ROOT, 'ot_txt_copies')
INDEX_FILE = os.path.join(DATA_DIR, 'grammatical_index_v15.json')
WORD_FREQ_FILE = os.path.join(APP_ROOT, 'word_frequency_list.json')
OT_WORD_FREQ_FILE = os.path.join(APP_ROOT, 'ot_word_frequency_list.json')
OT_FORMS_INDEX_FILE = os.path.join(APP_ROOT, 'ot_form_occurrence_index.json')
FULL_DICT_FILE = os.path.join(APP_ROOT, 'full_dictionary.json')
FORM_TO_LEMMA_FILE = os.path.join(APP_ROOT, 'form_to_lemma.json')
INFLECTIONS_CACHE_FILE = os.path.join(APP_ROOT, 'inflections_cache.json')
NT_REFERENCE_FILE = os.path.join(APP_ROOT, 'nt_reference.json')
GOOGLE_DRIVE_URL_PREFIX = "https://drive.google.com/uc?export=download&id="
# Prefer a direct-download host for server-side fetching to avoid Google Drive
# interstitials; fall back to the regular URL for user-visible links
GOOGLE_DRIVE_DIRECT_PREFIX = "https://drive.usercontent.google.com/download?id="
WORD_FREQ_DRIVE_ID = "1PYrdE16bJlyGiNO5hi1qxed7nTF0-WCo"
FULL_DICT_DRIVE_ID = "1Zay2s8siAV6d7pQec9uEbh-3YpzBtNol"
SHOW_SIDEBAR = False
INFLECT_SERVICE_URL = os.environ.get('INFLECT_SERVICE_URL', '')  # e.g., http://localhost:5050

# --- Audio auto-load configuration ---
AUTO_LOAD_AUDIO = True
AUTO_LOAD_AUDIO_MAX = int(os.environ.get('AUTO_LOAD_AUDIO_MAX', '6'))

# --- (ACTION REQUIRED) Audio File Mapping ---
# You need to fill this dictionary with your Google Drive file IDs.
# Format: "bookchapter_verse_number.mp3": "google_drive_file_id"
# Example: "matthew1_verse_1.mp3": "1aBcDeFgHiJkLmNoPqRsTuVwXyZ"
AUDIO_FILE_MAP_PATH = os.path.join(APP_ROOT, 'audio_file_map.json')
with open(AUDIO_FILE_MAP_PATH, 'r', encoding='utf-8') as af:
    AUDIO_FILE_MAP = json.load(af)

st.set_page_config(layout="wide")

# --- Mobile-friendly CSS tweaks (non-invasive, responsive) ---
st.markdown(
    """
    <style>
    /* Reduce side padding and increase base font size on small screens */
    @media (max-width: 680px) {
      html, body, .stApp { font-size: 18px; }
      .block-container { padding-left: 0.6rem; padding-right: 0.6rem; }
      /* Make expander headers easier to tap */
      details > summary { padding: 0.6rem 0.4rem; }
      /* Tighten vertical spacing a bit */
      .stMarkdown, .stTextInput, .stSlider, .stSelectbox, .stDataFrame, .stRadio, .stCheckbox { margin-top: 0.25rem; margin-bottom: 0.25rem; }
          /* Larger touch targets */
          .stButton>button { padding: 0.6rem 1rem; font-size: 1rem; }
          .stTextInput input { padding: 0.6rem; font-size: 1rem; }
          /* Slightly smaller headings to reduce wrapping */
          h1 { font-size: 1.5rem; }
          h2 { font-size: 1.25rem; }
          h3 { font-size: 1.1rem; }
    }
    /* Allow tabs to scroll horizontally when too many */
    .stTabs [role="tablist"] { flex-wrap: nowrap; overflow-x: auto; }
    .stTabs [role="tab"] { flex: 0 0 auto; white-space: nowrap; }
        /* Improve mark highlight visibility in dark/light */
        mark { padding: 0.1em 0.2em; border-radius: 0.2em; }
    </style>
    """,
    unsafe_allow_html=True,
)

# --- Detect installed web-app (A2HS/standalone) and annotate URL params ---
# This runs on the client to set ?app=1 when launched as a standalone web app
st.markdown(
    """
    <script>
    (function(){
      try {
        var isStandalone = false;
        if (window.matchMedia) {
          isStandalone = window.matchMedia('(display-mode: standalone)').matches
            || window.matchMedia('(display-mode: fullscreen)').matches
            || window.matchMedia('(display-mode: minimal-ui)').matches;
        }
        if (!isStandalone && typeof window.navigator !== 'undefined') {
          // iOS Safari A2HS
          isStandalone = !!window.navigator.standalone;
        }
        var url = new URL(window.location.href);
        if (isStandalone && !url.searchParams.has('app')) {
          url.searchParams.set('app', '1');
          // Force a one-time reload so the backend sees the new param
          window.location.replace(url.toString());
        }
        // Also annotate mobile viewport for responsive tweaks without reload
        var w = Math.min(window.innerWidth || 9999, (window.screen && window.screen.width) ? window.screen.width : 9999);
        if (w <= 680 && !url.searchParams.has('m')) {
          url.searchParams.set('m', '1');
          window.history.replaceState(null, '', url.toString());
        }
      } catch (e) { /* noop */ }
    })();
    </script>
    """,
    unsafe_allow_html=True,
)

# Prefer loading the audio file map from an external JSON to keep this script small
try:
    AUDIO_FILE_MAP_PATH = os.path.join(APP_ROOT, 'audio_file_map.json')
    with open(AUDIO_FILE_MAP_PATH, 'r', encoding='utf-8') as af:
        AUDIO_FILE_MAP = json.load(af)
except FileNotFoundError:
    st.warning(f"Audio file map not found at {os.path.join(APP_ROOT, 'audio_file_map.json')}. Audio playback links may be unavailable.")
except Exception as e:
    st.warning(f"Unable to load audio file map: {e}")

# --- Helpers to fetch JSON assets from Google Drive when missing locally ---
def ensure_file_from_drive(file_id: str, target_path: str) -> None:
    try:
        if os.path.exists(target_path) and os.path.getsize(target_path) > 0:
            return
        if not file_id:
            return
        url = f"{GOOGLE_DRIVE_URL_PREFIX}{file_id}"
        resp = requests.get(url, timeout=60)
        resp.raise_for_status()
        # If Drive returns HTML due to permission, do not overwrite
        content_type = resp.headers.get('Content-Type', '')
        if 'html' in content_type.lower() and 'json' not in content_type.lower():
            return
        with open(target_path, 'wb') as f:
            f.write(resp.content)
    except Exception:
        # Silent fallback; UI will show helpful messages elsewhere
        pass


def ensure_full_dictionary_from_web(target_path: str) -> None:
    """Fallback: fetch LingDocs JSON directly if Drive fetch failed."""
    if os.path.exists(target_path) and os.path.getsize(target_path) > 0:
        return
    try:
        url = "https://storage.lingdocs.com/dictionary/dictionary.json"
        resp = requests.get(url, timeout=60)
        resp.raise_for_status()
        with open(target_path, 'wb') as f:
            f.write(resp.content)
    except Exception:
        pass


def ensure_word_frequency_from_index(index_path: str, out_path: str) -> None:
    """Fallback: build frequency file from index if Drive file is absent."""
    if os.path.exists(out_path) and os.path.getsize(out_path) > 0:
        return
    try:
        with open(index_path, 'r', encoding='utf-8') as f:
            idx = json.load(f)
        # light aggregator
        agg = {}
        for data in idx.values():
            for identity in data.get('identities', []):
                pos = identity.get('type', 'unknown')
                for items_list in identity.get('forms', {}).values():
                    for item in items_list:
                        form_ps = (item.get('form', '') or '').replace('_', ' ')
                        cur = agg.get(form_ps)
                        if not cur:
                            cur = {
                                'pashto': form_ps,
                                'frequency': 0,
                                'romanization': '',
                                'pos': pos,
                            }
                            agg[form_ps] = cur
                        cur['frequency'] += int(item.get('count', 0))
                        if cur['pos'] == 'unknown' and pos:
                            cur['pos'] = pos
        out = sorted(agg.values(), key=lambda x: x['frequency'], reverse=True)
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(out, f, ensure_ascii=False, indent=2)
    except Exception:
        pass


# --- Optional: load precomputed inflection cache (Part 1) ---
@st.cache_data
def load_form_to_lemma_map():
    try:
        if not os.path.exists(FORM_TO_LEMMA_FILE):
            return {}
        with open(FORM_TO_LEMMA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {}


@st.cache_data
def load_inflections_cache_map():
    try:
        if not os.path.exists(INFLECTIONS_CACHE_FILE):
            return {}
        with open(INFLECTIONS_CACHE_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {}

# Load word frequency list (romanization and pos hints from LingDocs dictionary)
@st.cache_data
def load_word_freq_map():
    try:
        with open(WORD_FREQ_FILE, 'r', encoding='utf-8') as f:
            items = json.load(f)
        # Map by Pashto form for O(1) lookups
        return {item['pashto']: item for item in items}
    except Exception:
        return {}

ensure_file_from_drive(WORD_FREQ_DRIVE_ID, WORD_FREQ_FILE)
ensure_word_frequency_from_index(INDEX_FILE, WORD_FREQ_FILE)
WORD_FREQ_MAP = load_word_freq_map()

@st.cache_data
def get_audio_bytes(url):
    """Downloads the audio file and returns its content as bytes.

    Cached per-URL to avoid re-downloading. Includes a reasonable
    timeout so a slow network does not hang the whole page.
    """
    try:
        # A friendlier user agent helps with some CDNs (incl. Google Drive)
        headers = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
            "Accept": "audio/mpeg,audio/*;q=0.9,*/*;q=0.8",
        }
        response = requests.get(url, timeout=30, headers=headers, allow_redirects=True)
        response.raise_for_status()
        # Some hosts respond with HTML if access requires confirmation; in that case
        # return empty so callers can try a URL-based embed instead
        ctype = (response.headers.get('Content-Type') or '').lower()
        content = response.content
        if not content:
            return None
        # Be tolerant: some CDNs (incl. Drive) use application/octet-stream
        if ('audio' not in ctype) and ('octet-stream' not in ctype):
            # Still accept if payload looks like mp3 by magic bytes (ID3)
            if not (len(content) >= 3 and content[:3] == b'ID3'):
                return None
        return content
    except requests.exceptions.RequestException as e:
        # Silent failure; UI will fall back to URL-based embed
        return None

@st.cache_data
def load_word_frequency_data(path: str = WORD_FREQ_FILE):
    """Loads a word frequency list (NT default; pass OT path for OT)."""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []
    except json.JSONDecodeError:
        return []

@st.cache_data
def load_nt_reference_data():
    try:
        if not os.path.exists(NT_REFERENCE_FILE):
            return []
        with open(NT_REFERENCE_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []
# Optional LingDocs full dictionary (for richer POS/romanization lookups)
@st.cache_data
def load_lingdocs_dictionary_map():
    path = os.path.join(APP_ROOT, 'full_dictionary.json')
    if not os.path.exists(path):
        return {}
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        entries = data.get('entries', []) if isinstance(data, dict) else data
        p_to_entries = {}
        for ent in entries:
            p = ent.get('p')
            if not p:
                continue
            p_to_entries.setdefault(p, []).append(ent)
        return p_to_entries
    except Exception:
        return {}

ensure_file_from_drive(FULL_DICT_DRIVE_ID, FULL_DICT_FILE)
ensure_full_dictionary_from_web(FULL_DICT_FILE)
DICT_MAP = load_lingdocs_dictionary_map()

@st.cache_data
def _build_dict_norm_map():
    norm_map = {}
    for p, entries in DICT_MAP.items():
        key = normalize_pashto_char(p)
        if key not in norm_map:
            norm_map[key] = entries
    return norm_map

DICT_NORM_MAP = _build_dict_norm_map()

# Optional fast dictionary index produced by normalize_dictionary_data.py
@st.cache_data
def _load_fast_dict_index():
    try:
        path = os.path.join(APP_ROOT, 'dictionary_fast_index.json')
        if not os.path.exists(path):
            return {}
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {}

FAST_DICT_INDEX = _load_fast_dict_index()

def _get_first_entry_for(pashto_word: str):
    key = (pashto_word or '').replace('_', ' ')
    # Prefer fast index when available
    if FAST_DICT_INDEX:
        by_p = FAST_DICT_INDEX.get('by_pashto', {})
        by_pn = FAST_DICT_INDEX.get('by_pashto_norm', {})
        if key in by_p:
            # Synthesize a minimal entry structure compatible with callers
            m = by_p[key]
            return {'f': m.get('rom', ''), 'c': m.get('pos', ''), 'e': m.get('e', '')}
        nkey = normalize_pashto_char(key)
        if nkey in by_pn:
            m = by_pn[nkey]
            return {'f': m.get('rom', ''), 'c': m.get('pos', ''), 'e': m.get('e', '')}
    # Fallback to full map
    entries = DICT_MAP.get(key)
    if entries:
        return entries[0]
    nkey = normalize_pashto_char(key)
    nentries = DICT_NORM_MAP.get(nkey)
    if nentries:
        return nentries[0]
    return None

def _next_unique_suffix(key_family: str) -> str:
    """Return a monotonically increasing suffix per family for unique widget keys.

    Needed to avoid StreamlitDuplicateElementKey when identical components are
    created multiple times in a single rerun (e.g., same verse across groups).
    """
    family = f"__counter__{key_family}"
    count = st.session_state.get(family, 0) + 1
    st.session_state[family] = count
    return str(count)

@lru_cache(maxsize=200000)
def dict_romanization_for(pashto_word: str) -> str:
    try:
        ent = _get_first_entry_for(pashto_word)
        if not ent:
            return ''
        f = ent.get('f', '')
        if not f:
            return ''
        # Some entries contain multiple variants separated by comma
        return f.split(',')[0].strip()
    except Exception:
        return ''


@lru_cache(maxsize=200000)
def dict_pos_for(pashto_word: str) -> str:
    """Return part-of-speech from LingDocs dictionary when available."""
    try:
        ent = _get_first_entry_for(pashto_word)
        if ent:
            pos = ent.get('c', '')
            if pos:
                return pos
        # Fallback: infer lemma (e.g., ټولو → ټول) and use its POS
        lemma = guess_lemma_in_dict(pashto_word)
        if lemma:
            ent2 = _get_first_entry_for(lemma)
            if ent2:
                return ent2.get('c', '') or ''
        # Fallback: if this looks like a verb form in our lexicon, mark as verb
        try:
            norm = normalize_pashto_char(pashto_word)
            if 'find_lexicon_root_for_form' in globals():
                root = find_lexicon_root_for_form(norm)
                if root:
                    return 'v.'
        except Exception:
            pass
        return ''
    except Exception:
        return ''


@lru_cache(maxsize=200000)
def dict_english_for(pashto_word: str) -> str:
    """Return English gloss from LingDocs dictionary when available."""
    try:
        ent = _get_first_entry_for(pashto_word)
        if not ent:
            return ''
        return ent.get('e', '') or ''
    except Exception:
        return ''


@lru_cache(maxsize=10000)
def normalize_pos_label(label: str) -> str:
    """Canonicalize POS labels consistently (e.g., 'adj,/adv.' -> 'adj. / adv.')."""
    if not label:
        return 'unknown'
    s = str(label).lower()
    s = re.sub(r"\s*\.\s*", ".", s)
    s = re.sub(r"\s*/\s*", " / ", s)
    s = s.replace(",", " ")
    s = re.sub(r"\s+", " ", s).strip()
    return s


def _tokenize_pos(pos_label: str) -> list:
    s = normalize_pos_label(pos_label)
    # Replace separators with spaces, split dots
    s = s.replace('/', ' ').replace('.', ' ')
    tokens = [t for t in s.split() if t]
    return tokens

@lru_cache(maxsize=10000)
def classify_pos_family(pos_label: str) -> str:
    tokens = set(_tokenize_pos(pos_label))
    if not tokens or 'unknown' in tokens:
        return 'other'
    if 'v' in tokens or 'verb' in tokens:
        return 'verb'
    if 'adv' in tokens or 'adverb' in tokens:
        return 'adverb'
    if 'adj' in tokens or 'adjective' in tokens:
        return 'adjective'
    if any(t.startswith('n') for t in tokens) or 'noun' in tokens:
        return 'noun'
    return 'other'


def families_for_pos(pos_label: str) -> set:
    tokens = set(_tokenize_pos(pos_label))
    fams = set()
    if 'v' in tokens or 'verb' in tokens:
        fams.add('Verb')
    if 'adj' in tokens or 'adjective' in tokens:
        fams.add('Adjective')
    if 'adv' in tokens or 'adverb' in tokens:
        fams.add('Adverb')
    if any(t.startswith('n') for t in tokens) or 'noun' in tokens:
        fams.add('Noun')
    if not fams:
        fams.add('Other')
    return fams


def gender_from_pos(pos_label: str) -> str:
    tokens = set(_tokenize_pos(pos_label))
    if {'m','f'} <= tokens or 'unisex' in tokens or 'mf' in tokens:
        return 'unisex'
    if 'm' in tokens:
        return 'm'
    if 'f' in tokens:
        return 'f'
    # Handle composite tokens like n.m, n.f after dot split already
    return ''


@st.cache_data
def build_dictionary_dataframe():
    """Flatten DICT_MAP into a dataframe-friendly list of entries.

    Columns: Pashto, Romanization, POS, English, SourceTS
    """
    rows = []
    for p, entries in DICT_MAP.items():
        for ent in entries:
            rom = ent.get('f', '')
            rom = rom.split(',')[0].strip() if rom else ''
            rows.append({
                'Pashto': p,
                'Romanization': rom,
                'POS': ent.get('c', ''),
                'English': ent.get('e', ''),
                'SourceTS': ent.get('ts', ''),
            })
    return rows


@st.cache_data
def build_bible_word_catalog():
    """Aggregate all Bible words and their verse occurrences from the grammatical index.

    Returns a list of dicts with: Pashto, Romanization, POS, Count, Verses
    """
    idx = load_data()
    if not idx:
        return []
    aggregate = {}
    for root, data in idx.items():
        for identity in data.get('identities', []):
            pos = identity.get('type', '')
            for items_list in identity.get('forms', {}).values():
                for item in items_list:
                    form_ps = (item.get('form', '') or '').replace('_', ' ')
                    key = normalize_pashto_char(form_ps)
                    entry = aggregate.get(key)
                    if not entry:
                        entry = {
                            'Pashto': form_ps,
                            'Romanization': dict_romanization_for(form_ps) or item.get('translit', ''),
                            'POS': pos,
                            'Count': 0,
                            'Verses': [],
                        }
                        aggregate[key] = entry
                    entry['Count'] += int(item.get('count', 0))
                    entry['Verses'].extend(item.get('verses', []))

    # Deduplicate verses
    for e in aggregate.values():
        e['Verses'] = sorted(set(e['Verses']))

    return sorted(aggregate.values(), key=lambda x: x['Count'], reverse=True)


# --- Heuristic romanization from lemma when exact form missing in dictionary ---
def guess_lemma_in_dict(form_ps: str) -> str:
    # Fast path: precomputed mapping when available
    try:
        f2l = load_form_to_lemma_map()
        if f2l:
            # exact
            if form_ps in f2l:
                return f2l[form_ps]
            # normalized
            key = normalize_pashto_char(form_ps.replace('_', ' '))
            if key in f2l:
                return f2l[key]
    except Exception:
        pass
    base = form_ps.replace('_', ' ')
    # Prefer removing final vowel inflection first (e.g., ټولو → ټول, ټولې → ټول)
    if base.endswith('و') or base.endswith('ې'):
        no_last = base[:-1]
        if no_last in DICT_MAP:
            return no_last
        # Secondary: try feminine ه ending (خرې → خره)
        cand_h = no_last + 'ه'
        if cand_h in DICT_MAP:
            return cand_h
    return ''


def adjust_romanization_from_suffix(lemma_rom: str, form_ps: str) -> str:
    if not lemma_rom:
        return ''
    # Normalize lemma ending vowel marker if present
    # Basic adjustments reflecting LingDocs patterns for fem. اله/ه endings
    if form_ps.endswith('و'):
        # vocative/plural feminine often maps á -> ó
        if lemma_rom.endswith('á'):
            return lemma_rom[:-1] + 'ó'
        return lemma_rom + 'ó'
    if form_ps.endswith('ې'):
        # first feminine inflection á -> é
        if lemma_rom.endswith('á'):
            return lemma_rom[:-1] + 'é'
        return lemma_rom + 'é'
    return ''


def romanize_from_dict_or_rules(form_ps: str) -> str:
    # Prefer exact dictionary romanization
    r = dict_romanization_for(form_ps)
    if r:
        return r
    # Derive from lemma when possible
    lemma = guess_lemma_in_dict(form_ps)
    if lemma:
        base_rom = dict_romanization_for(lemma)
        adj = adjust_romanization_from_suffix(base_rom, form_ps)
        if adj:
            return adj
    return ''


# --- Master-list enrichment helpers ---
@st.cache_data
def classify_form_basic(form_ps: str) -> dict:
    """Infer POS/Kind/lemma/romanization for a form using dictionary and local engines.

    Returns: {pos, kind, noun_key, noun_num, lemma, romanization, english}
    """
    try:
        norm = normalize_pashto_char(form_ps)
        # dictionary fields
        pos = normalize_pos_label(dict_pos_for(form_ps))
        english = dict_english_for(form_ps)
        roman = dict_romanization_for(form_ps)
        lemma = ''
        noun_key = ''
        noun_num = ''
        kind = ''

        # Noun classification via inflector
        try:
            noun_forms_index = build_noun_forms_index() if NOUNS else {}
            lemma = noun_forms_index.get(norm, '')
            if lemma and lemma in NOUNS:
                n = inflect_noun(lemma)
                for k, (ps, rom) in n['forms'].items():
                    if normalize_pashto_char(ps) == norm:
                        noun_key = k
                        noun_num = 'pl' if 'plural' in k else 'sg'
                        kind = f"noun {k.replace('_',' ')}"
                        if not roman:
                            roman = rom
                        break
                if not english:
                    english = dict_english_for(lemma)
                if not pos or pos == 'unknown':
                    pos = 'n.'
            # If not found, attempt heuristic for Pattern #1 feminine → masculine lemma
            if not lemma and ('infer_pattern1_masc_lemma_from_form' in globals()):
                guess_lemma = infer_pattern1_masc_lemma_from_form(norm)
                if guess_lemma:
                    lemma = guess_lemma
                    n = inflect_noun(lemma)
                    for k, (ps, rom) in n['forms'].items():
                        if normalize_pashto_char(ps) == norm:
                            noun_key = k
                            noun_num = 'pl' if 'plural' in k else 'sg'
                            kind = f"noun {k.replace('_',' ')}"
                            if not roman:
                                roman = rom
                            break
                    if not english:
                        english = dict_english_for(lemma)
                    if not pos or pos == 'unknown':
                        pos = 'n.'
        except Exception:
            pass

        # Verb classification via lexicon
        if not kind:
            try:
                root = ''
                if 'find_lexicon_root_for_form' in globals():
                    root = find_lexicon_root_for_form(norm) or ''
                if not root and 'infer_root_from_form' in globals():
                    root = infer_root_from_form(norm) or ''
                if root:
                    conj = conjugate_verb(root)
                    label = ''
                    search_sets = ['present','subjunctive','imperfective_future','perfective_future','ability_present','continuous_past','simple_past','ability_continuous_past','ability_simple_past']
                    for cat in search_sets:
                        forms_map = conj.get(cat, {}) or {}
                        for person, (ps, rom) in forms_map.items():
                            if normalize_pashto_char(ps) == norm:
                                label = f"verb {cat.replace('_',' ')} {person}"
                                if not roman:
                                    roman = rom
                                break
                        if label:
                            break
                    kind = label or 'verb form'
                    if not pos or pos == 'unknown':
                        pos = 'v.'
                    if not english:
                        english = dict_english_for(root)
            except Exception:
                pass

        # Romanization fallback from lemma rules
        if not roman:
            roman = romanize_from_dict_or_rules(form_ps)

        return {
            'pos': pos or 'unknown',
            'kind': kind,
            'noun_key': noun_key,
            'noun_num': noun_num,
            'lemma': lemma,
            'romanization': roman,
            'english': english,
        }
    except Exception:
        return {'pos': 'unknown', 'kind': '', 'noun_key': '', 'noun_num': '', 'lemma': '', 'romanization': '', 'english': ''}

@st.cache_data
def load_data():
    try:
        with open(INDEX_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        st.error(f"FATAL: The index file '{INDEX_FILE}' was not found.")
        return None

@st.cache_data
def load_ot_occurrence_index():
    """Load OT precomputed form->occurrence index if available."""
    try:
        if not os.path.exists(OT_FORMS_INDEX_FILE):
            return {}
        with open(OT_FORMS_INDEX_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {}

def _load_text_from_dir(dir_path: str):
    bible = {}
    punct = '.,:;!?؟،؛"\'()[]{}“”'
    def parse_int_mixed_digits(s: str):
        """Parse numbers written with ASCII, Arabic-Indic (٠-٩), or Eastern Arabic (۰-۹) digits.

        Returns int or None if any non-digit characters are present.
        """
        arabic_indic = {ord('٠') + i: str(i) for i in range(10)}  # U+0660..U+0669
        eastern_arabic = {ord('۰') + i: str(i) for i in range(10)}  # U+06F0..U+06F9
        normalized = s.translate({**arabic_indic, **eastern_arabic})
        if not normalized or not all('0' <= ch <= '9' for ch in normalized):
            return None
        try:
            return int(normalized)
        except Exception:
            return None
    book_map = {
        'acts': 'Acts', 'colossians': 'Colossians', 'ephesians': 'Ephesians', 'galatians': 'Galatians',
        'hebrews': 'Hebrews', 'james': 'James', 'john': 'John', 'jude': 'Jude', 'luke': 'Luke',
        'mark': 'Mark', 'matthew': 'Matthew', 'philemon': 'Philemon', 'philippians': 'Philippians',
        'revelation': 'Revelation', 'romans': 'Romans', 'titus': 'Titus',
    }
    if not os.path.isdir(dir_path):
        return {}
    for filename in os.listdir(dir_path):
        if filename.endswith('_pashto.txt'):
            base = filename.replace('_pashto.txt', '')
            match = re.match(r'([a-z]+)(\d+)', base)
            if match:
                book_prefix, chapter_str = match.groups()
                chapter = int(chapter_str)
                book = book_map.get(book_prefix, book_prefix.capitalize())
                filepath = os.path.join(dir_path, filename)
                with open(filepath, 'r', encoding='utf-8') as f: lines = f.readlines()
                current_verse, verse_text_lines = None, []
                for line in lines:
                    stripped = normalize_pashto_char(line.rstrip())
                    # detect a leading verse number possibly followed by text on the same line
                    m = re.match(r'^([0-9\u0660-\u0669\u06F0-\u06F9]+)\s*(.*)$', stripped)
                    verse_num = parse_int_mixed_digits(m.group(1)) if m else None
                    if verse_num is not None:
                        # commit previous
                        if current_verse is not None:
                            bible[f"{book} {chapter}:{current_verse}"] = ' '.join(verse_text_lines).strip()
                        current_verse, verse_text_lines = verse_num, []
                        remainder = m.group(2).strip()
                        if remainder:
                            verse_text_lines.append(remainder)
                    elif current_verse is not None:
                        verse_text_lines.append(stripped)
                if current_verse is not None:
                    bible[f"{book} {chapter}:{current_verse}"] = ' '.join(verse_text_lines).strip()
    return bible

@st.cache_data
def load_bible_text():
    return _load_text_from_dir(DATA_DIR)

@st.cache_data
def load_bible_text_ot():
    return _load_text_from_dir(OT_DATA_DIR)

@st.cache_data
def build_normalized_text_maps(nt_text: dict, ot_text: dict) -> dict:
    def norm_map(d):
        return {ref: normalize_pashto_char(txt) for ref, txt in d.items()}
    return {
        'nt_norm': norm_map(nt_text),
        'ot_norm': norm_map(ot_text),
    }

# Initialize global text maps early to satisfy helper references
NT_TEXT = load_bible_text()
OT_TEXT = load_bible_text_ot()
_maps = build_normalized_text_maps(NT_TEXT, OT_TEXT)
NT_NORM_MAP = _maps['nt_norm']
OT_NORM_MAP = _maps['ot_norm']

@st.cache_data
def build_token_maps(nt_text: dict, ot_text: dict) -> dict:
    def tok_map(d):
        return {ref: tokenize_ps(txt) for ref, txt in d.items()}
    return {
        'nt_tok': tok_map(nt_text),
        'ot_tok': tok_map(ot_text),
    }

TOK = build_token_maps(NT_TEXT, OT_TEXT)
NT_TOK_MAP = TOK['nt_tok']
OT_TOK_MAP = TOK['ot_tok']

# Canonical Bible order (66-book Protestant order)
BIBLE_BOOK_ORDER = [
    'Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth',
    '1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther',
    'Job','Psalms','Proverbs','Ecclesiastes','Song of Songs','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel',
    'Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi',
    'Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians',
    'Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon',
    'Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'
]

# Coverage aggregation helpers for right-side sticky panel
def _coverage_reset():
    st.session_state['__cov_refs'] = set()

def _coverage_add(ref_or_refs):
    s = st.session_state.get('__cov_refs', set())
    if isinstance(ref_or_refs, (list, tuple, set)):
        for r in ref_or_refs:
            s.add(r)
    elif isinstance(ref_or_refs, str):
        s.add(ref_or_refs)
    st.session_state['__cov_refs'] = s

def _coverage_get():
    return sorted(st.session_state.get('__cov_refs', set()))

@st.cache_data
def create_form_to_root_map(_grammatical_index):
    form_map = defaultdict(list)
    for root, data in _grammatical_index.items():
        for identity in data.get('identities', []):
            for items_list in identity['forms'].values():
                for item in items_list:
                    normalized_form = normalize_pashto_char(item['form'])
                    if root not in form_map[normalized_form]:
                         form_map[normalized_form].append(root)
    return form_map

# --- UI Helper Functions ---
def format_for_display(word):
    return word.replace("_", " ")

def highlight_verse(text: str, search_term: str) -> str:
    try:
        # highlight the search term
        pattern = re.escape(search_term)
        return re.sub(f"({pattern})", r"<mark>\1</mark>", text)
    except Exception:
        return text


def render_book_hit_map(verses: list, text_map: dict, scope_label: str, filter_key: str = "global", host=None):
    try:
        col = host if host is not None else st
        # Build counts per book from verse refs like "Acts 1:2"
        counts = {}
        for v in verses:
            m = re.match(r'^([A-Za-z\s]+)\s\d+:\d+$', v)
            if not m:
                continue
            book = m.group(1).strip()
            counts[book] = counts.get(book, 0) + 1
        # Universe of books present in current scope
        books_found = {re.match(r'^([A-Za-z\s]+)\s\d+:\d+$', r).group(1).strip()
                        for r in text_map.keys()
                        if re.match(r'^([A-Za-z\s]+)\s\d+:\d+$', r)}
        # Use canonical order, not alphabetical
        books_in_scope = [b for b in BIBLE_BOOK_ORDER if b in books_found]
        if not books_in_scope:
            return
        col.markdown("<div style='position:sticky; top:72px; font-size:12px; color:#bbb; margin-bottom:6px'>Book coverage</div>", unsafe_allow_html=True)
        # Selected filter state
        sel_key = f"book_filter_{filter_key}"
        selected = st.session_state.get(sel_key, '')
        grid = col.columns(2) if host is not None else st.columns(6)
        for i, book in enumerate(books_in_scope):
            c = grid[i % len(grid)]
            hit = counts.get(book, 0)
            label = f"{book}{' - '+str(hit) if hit else ''}"
            # disable button if no hits
            if hit == 0:
                c.button(label, key=f"{sel_key}_{book}", disabled=True)
            else:
                if c.button(label, key=f"{sel_key}_{book}"):
                    st.session_state[sel_key] = book
                    selected = book
        # Clear filter button
        if col.button("Show all books", key=f"{sel_key}_clear"):
            st.session_state[sel_key] = ''
    except Exception:
        pass

def _extract_book_from_ref(vref: str) -> str:
    m = re.match(r'^([A-Za-z\s]+)\s\d+:\d+$', vref)
    return m.group(1).strip() if m else ''

def classify_inflection_reason(verse_text: str, form_ps: str) -> str:
    """Heuristic: annotate why a form may be inflected (plural/sandwich/past-transitive).
    This is best-effort; we look for nearby sandwich markers and verb hints.
    """
    window = 20
    try:
        idx = verse_text.find(form_ps)
        ctx = verse_text[max(0, idx-window): idx+len(form_ps)+window] if idx != -1 else verse_text
        reasons = []
        # sandwich: presence of pre/post markers within a small window
        if any(m in ctx for m in SANDWICH_MARKERS):
            reasons.append('sandwich')
        # plural: crude heuristic for common plural suffixes
        if form_ps.endswith(('و','وٙ','وْ','وُ','ونه','ونو')):
            reasons.append('plural')
        # past transitive subject: look for perfective prefixes or past hints near
        if any(h in ctx for h in PAST_TRANSITIVE_VERB_HINTS):
            reasons.append('subject-of-past-transitive?')
        return ', '.join(reasons) if reasons else ''
    except Exception:
        return ''

def find_audio_url(verse_ref):
    if not AUDIO_FILE_MAP: return None
    try:
        match = re.match(r'([a-zA-Z\s]+)\s(\d+):(\d+)', verse_ref)
        if not match: return None
        book, chapter, verse = match.groups()
        # Construct the standard filename key for the map
        audio_filename = f"{book.lower().replace(' ', '')}{chapter}_verse_{verse}.mp3"
        file_id = AUDIO_FILE_MAP.get(audio_filename)
        if file_id:
            # Prefer direct host for in-app playback
            return f"{GOOGLE_DRIVE_DIRECT_PREFIX}{file_id}&export=download"
        return None
    except Exception:
        return None

def display_verse_with_audio(verse_ref, search_term, bible_text):
    full_verse = bible_text.get(verse_ref)
    if not full_verse:
        st.warning(f"Verse text for '{verse_ref}' not found.")
        return

    st.markdown(f"**{verse_ref}**: {highlight_verse(full_verse, search_term)}", unsafe_allow_html=True)
    
    audio_url = find_audio_url(verse_ref)
    if audio_url:
        # Prefer remote stream; if it fails on some devices, fall back to server-fetched bytes
        bytes_payload = get_audio_bytes(audio_url)
        if bytes_payload:
            st.audio(bytes_payload, format='audio/mp3')
        else:
            st.audio(audio_url, format='audio/mp3')
        # Provide a user-visible download link
        try:
            file_id = audio_url.split('id=')[1].split('&')[0]
            dl_url = GOOGLE_DRIVE_URL_PREFIX + file_id
        except Exception:
            dl_url = audio_url
        st.markdown(f"[Download Audio]({dl_url})")
    # If there is no audio (e.g., most Old Testament verses), we simply omit
    # the audio UI without displaying a warning so the results remain clean.
    # Optional: reasons for inflection (hidden by default because current
    # heuristics are approximate and can be misleading). To re-enable, set
    # SHOW_INFL_REASONS = True near the top-level config and guard this block.
    st.markdown("---")

    # Optional: inline dictionary lookup for any word in the verse
    with st.expander("Dictionary lookup", expanded=False):
        tokens = [t for t in tokenize_ps(full_verse) if t]
        # Deduplicate while preserving order to reduce button count
        seen = set(); tokens_unique = []
        for t in tokens:
            if t not in seen:
                seen.add(t); tokens_unique.append(t)

        # Arrange clickable tokens in a grid
        per_row = 8
        selected_token = None
        for i in range(0, len(tokens_unique), per_row):
            row = st.columns(per_row)
            for j, tok in enumerate(tokens_unique[i:i+per_row]):
                if row[j].button(tok, key=f"dictbtn_{verse_ref}_{i}_{j}"):
                    selected_token = tok

        if selected_token:
            # Resolve dictionary entry (exact → normalized → lemma)
            def _lookup_entry(pword: str) -> dict:
                ent = _get_first_entry_for(pword)
                if ent:
                    return {
                        'pashto': pword,
                        'rom': ent.get('f', ''),
                        'pos': ent.get('c', ''),
                        'eng': ent.get('e', ''),
                    }
                nkey = normalize_pashto_char(pword)
                ent2 = _get_first_entry_for(nkey)
                if ent2:
                    return {'pashto': pword, 'rom': ent2.get('f',''), 'pos': ent2.get('c',''), 'eng': ent2.get('e','')}
                lemma = guess_lemma_in_dict(pword)
                if lemma:
                    ent3 = _get_first_entry_for(lemma)
                    if ent3:
                        return {'pashto': lemma, 'rom': ent3.get('f',''), 'pos': ent3.get('c',''), 'eng': ent3.get('e','')}
                # Fallbacks
                return {
                    'pashto': pword,
                    'rom': romanize_from_dict_or_rules(pword) or romanization_for_form_fast(pword),
                    'pos': dict_pos_for(pword),
                    'eng': dict_english_for(pword),
                }

            info = _lookup_entry(selected_token)
            with st.modal(f"Dictionary: {selected_token}"):
                st.markdown(f"Pashto: **{info.get('pashto','')}**")
                if info.get('rom'):
                    st.markdown(f"Romanization: {info['rom']}")
                if info.get('pos'):
                    st.markdown(f"POS: {info['pos']}")
                if info.get('eng'):
                    st.markdown(f"English: {info['eng']}")
                # Open in LingDocs (search-based link)
                q = quote_plus(selected_token)
                st.markdown(f"[Open in LingDocs](https://dictionary.lingdocs.com/?q={q})")


# --- Small UI helpers ---
def render_forms_summary(title, forms_dict, occurrence_index, text_map, scope_label: str, key_prefix: str):
    """Render forms as dropdowns (expanders) with inline verse lists and an open-in-tab link.

    forms_dict: mapping like conj['present'] where values are tuples (pashto, romanization)
    """
    try:
        st.subheader(title)
        order = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl']
        scope_short = 'nt' if scope_label == 'New Testament' else 'ot' if scope_label == 'Old Testament' else 'all'
        for k in order:
            if k not in forms_dict:
                continue
            ps, rom = forms_dict[k]
            occ = occurrence_index.get(normalize_pashto_char(ps), {'count': 0, 'verses': []})
            title_label = f"{ps} ({rom}) — {occ.get('count', 0)} hits"
            with st.expander(title_label):
                href = f"?q={quote_plus(ps)}&s={scope_short}"
                st.link_button("Open in new tab", href)
                if not occ.get('verses'):
                    st.info("No references in this scope.")
                else:
                    for vref in sorted(set(occ['verses'])):
                        display_verse_with_audio(vref, ps, text_map)
                # Show common preverb variants (را / در / ور) to aid recognition
                try:
                    preverbs = [('را', 'rá'), ('در', 'dar'), ('ور', 'war')]
                    variants = []
                    for pps, prom in preverbs:
                        v_ps = f"{pps}{ps}"
                        v_rom = (f"{prom} {rom}").strip()
                        variants.append(f"{v_ps} ({v_rom})")
                    if variants:
                        st.caption("Preverb variants: " + " · ".join(variants))
                except Exception:
                    pass
    except Exception:
        pass

def render_noun_summary(title, forms_dict, occurrence_index):
    try:
        rows = []
        order = [
            'plain_sg', 'inflection_1_sg', 'inflection_2_sg',
            'plural', 'inflection_2_pl',
            'vocative_sg', 'vocative_pl',
            'bundled_plural_sg', 'bundled_plural_2',
        ]
        for k in order:
            if k not in forms_dict:
                continue
            ps, rom = forms_dict[k]
            occ = occurrence_index.get(normalize_pashto_char(ps), {'count': 0})
            rows.append({'Form (Pashto)': ps, 'Romanization': rom, 'Count': occ['count']})
        if rows:
            st.markdown(f"**{title} — overview**")
            st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True)
    except Exception:
        pass

@lru_cache(maxsize=200000)
def classify_present_person_number(form_ps: str) -> tuple:
    """Return (person, number) for present-tense forms, or ('','') otherwise."""
    try:
        norm = normalize_pashto_char(form_ps)
        root = find_lexicon_root_for_form(norm) if 'find_lexicon_root_for_form' in globals() else ''
        if not root:
            return ('','')
        conj = conjugate_verb(root)
        pres = conj.get('present', {})
        for k, (ps, _rom) in pres.items():
            if normalize_pashto_char(ps) == norm:
                return (k[0], 'pl' if k.endswith('pl') else 'sg')
        return ('','')
    except Exception:
        return ('','')

def render_past_expanders(title, forms_dict, occurrence_index, text_map):
    try:
        st.subheader(title)
        order = ['1sg','2sg','3sg_m','3sg_f','1pl','2pl','3pl']
        for k in order:
            if k not in forms_dict:
                continue
            ps, rom = forms_dict[k]
            occ = occurrence_index.get(normalize_pashto_char(ps), {'count': 0, 'verses': []})
            with st.expander(f"{ps} ({rom}) — {occ['count']} hits"):
                if occ['verses']:
                    for vref in sorted(set(occ['verses'])):
                        display_verse_with_audio(vref, ps, text_map)
                else:
                    st.info("No references in this scope.")
    except Exception:
        pass

# --- Smart Search Functions ---
def is_verse_reference(query):
    return re.match(r'^[a-zA-Z\s]+\s\d+:\d+$', query.strip())

BOOK_CANON_MAP = {
    'acts': 'Acts', 'colossians': 'Colossians', 'ephesians': 'Ephesians', 'galatians': 'Galatians',
    'hebrews': 'Hebrews', 'james': 'James', 'john': 'John', 'jude': 'Jude', 'luke': 'Luke',
    'mark': 'Mark', 'matthew': 'Matthew', 'philemon': 'Philemon', 'philippians': 'Philippians',
    'revelation': 'Revelation', 'romans': 'Romans', 'titus': 'Titus',
}

def canonicalize_reference(ref: str) -> str:
    m = re.match(r'^([a-zA-Z\s]+)\s(\d+):(\d+)$', ref.strip())
    if not m:
        return ref
    book_raw, ch, vs = m.groups()
    key = book_raw.strip().lower()
    key = re.sub(r"\s+", "", key)
    # try direct key, else word-by-word join
    book = BOOK_CANON_MAP.get(key)
    if not book:
        words = re.findall(r"[a-zA-Z]+", book_raw.strip())
        book = " ".join(w.capitalize() for w in words) if words else book_raw.strip()
    return f"{book} {int(ch)}:{int(vs)}"

def handle_verse_search(query, bible_text):
    # reset audio counter per search render
    st.session_state['audio_loaded_count'] = 0
    canon = canonicalize_reference(query)
    st.header(f"Verse Lookup: {canon}")
    display_verse_with_audio(canon, "", bible_text)


def handle_phrase_search(query, nt_text, ot_text, scope):
    st.session_state['audio_loaded_count'] = 0
    st.header(f"Exact Phrase Search Results for: \"{query}\"")
    normalized_query = normalize_pashto_char(query)
    text_map = nt_text if scope == 'New Testament' else ot_text if scope == 'Old Testament' else {**nt_text, **ot_text}
    found_verses = [ref for ref, text in text_map.items() if normalized_query in text]
    
    if not found_verses:
        st.warning("No verses found containing that exact phrase.")
    else:
        _coverage_add(found_verses)
        render_book_hit_map(found_verses, text_map, scope, filter_key=normalized_query)
        sel_book = st.session_state.get(f"book_filter_{normalized_query}", '')
        filtered = [v for v in found_verses if (not sel_book or _extract_book_from_ref(v) == sel_book)]
        # Prioritize like single-word results and default to 5
        gospels = ['Matthew','Mark','Luke','John']
        def rank(vref: str) -> tuple:
            m = re.match(r'^([A-Za-z\s]+)\s(\d+):(\d+)$', vref)
            if not m:
                return (3, 999, vref)
            book = m.group(1).strip()
            is_nt = book in ['Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation']
            g_rank = gospels.index(book) if book in gospels else 99
            nt_rank = 0 if is_nt else 1
            return (nt_rank, g_rank, book)
        limited = sorted(filtered, key=rank)[:5]
        for verse_ref in limited:
            display_verse_with_audio(verse_ref, normalized_query, text_map)
        if len(filtered) > 5:
            with st.expander("Show all matches"):
                for verse_ref in sorted(filtered, key=rank):
                    display_verse_with_audio(verse_ref, normalized_query, text_map)

    # Compound analysis for 2+ tokens
    toks = [t for t in query.split() if t]
    if len(toks) >= 2:
        st.markdown("---")
        do_compound = st.checkbox("Also analyze as compound verb", value=True, key="cb_compound")
        if do_compound:
            head = " ".join(toks[:-1])
            aux = toks[-1]
            aux_norm = normalize_pashto_char(aux)
            aux_map = {
                'کول': 'کول', 'کړل': 'کول', 'وکړل': 'کول',
                'کېدل': 'کېدل', 'کیدل': 'کېدل', 'شو': 'کېدل', 'شول': 'کېدل'
            }
            aux_root = aux_map.get(aux_norm, aux_norm)
            try:
                conj = conjugate_verb(aux_root)
            except Exception:
                conj = {}
            if conj:
                st.subheader(f"Compound Verb Analysis — {head} + {aux_root}")
                head_rom = dict_romanization_for(head)
                def prefix_head(table: dict):
                    out = {}
                    for k, (ps, rom) in (table or {}).items():
                        out[k] = (f"{head} {ps}", f"{head_rom} {rom}".strip())
                    return out
                present = prefix_head(conj.get('present', {}))
                subj = prefix_head(conj.get('subjunctive', {}))
                cont_past = prefix_head(conj.get('continuous_past', {}))
                simple_past = prefix_head(conj.get('simple_past', {}))
                forms_index = {}
                all_refs = []
                for d in [present, subj, cont_past, simple_past]:
                    for _k, (ps, _rom) in d.items():
                        occ = _find_occurrences_in_text(ps, text_map)
                        forms_index[normalize_pashto_char(ps)] = occ
                        all_refs.extend(occ.get('verses', []))
                if all_refs:
                    _coverage_add(all_refs)
                    render_book_hit_map(sorted(set(all_refs)), text_map, scope)
                render_forms_summary("present (compound)", present, forms_index, text_map, scope, key_prefix="cmp1")
                render_forms_summary("subjunctive (compound)", subj, forms_index, text_map, scope, key_prefix="cmp2")
                render_past_expanders("Past (continuous, compound)", cont_past, forms_index, text_map)
                render_past_expanders("Past (simple, compound)", simple_past, forms_index, text_map)

def handle_grammatical_search(query, form_to_root_map, grammatical_index, nt_text, ot_text, scope):
    # reset audio counter per search render
    st.session_state['audio_loaded_count'] = 0
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

    # Top section: occurrences for the searched form (scope-aware scan)
    selected_text = nt_text if scope == 'New Testament' else ot_text if scope == 'Old Testament' else {**nt_text, **ot_text}

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

    occ = _find_occurrences_in_text(normalized_form, selected_text, whole_word=True)
    verses_to_show = [v for v in sorted(set(occ['verses'])) if _sense_match(selected_text.get(v, ''))]
    if verses_to_show:
        # Limit default list to 5 entries with NT-first prioritization (Gospels first)
        st.subheader(f"Occurrences of {normalized_form} ({form_rom}) — {len(verses_to_show)} hits")
        _coverage_add(verses_to_show)
        render_book_hit_map(verses_to_show, selected_text, scope, filter_key=normalized_form)
        # Filter by selected book, if any
        sel_book = st.session_state.get(f"book_filter_{normalized_form}", '')
        filtered = [v for v in verses_to_show if (not sel_book or _extract_book_from_ref(v) == sel_book)]
        # Prioritization order
        gospels = ['Matthew','Mark','Luke','John']
        def rank(vref: str) -> tuple:
            m = re.match(r'^([A-Za-z\s]+)\s(\d+):(\d+)$', vref)
            if not m:
                return (3, 999, vref)
            book = m.group(1).strip()
            is_nt = book in ['Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation']
            g_rank = gospels.index(book) if book in gospels else 99
            nt_rank = 0 if is_nt else 1
            return (nt_rank, g_rank, book)
        limited = sorted(filtered, key=rank)[:5]
        for verse_ref in limited:
            display_verse_with_audio(verse_ref, normalized_form, selected_text)
        if len(filtered) > 5:
            with st.expander("Show all matches"):
                for verse_ref in sorted(filtered, key=rank):
                    display_verse_with_audio(verse_ref, normalized_form, selected_text)
        st.markdown("---")

    prefer_exact_verb = bool(lex_root and conj_for_form and normalized_form == lex_root)
    prefer_exact_noun = bool(lex_root and (lex_root in NOUNS) and normalized_form == lex_root)

    # If noun lemma found, render a grouped noun section (and optionally continue for full results)
    if lex_root and lex_root in NOUNS:
        n = inflect_noun(lex_root)
        st.header(f"Grammatical Results for Root: `{format_for_display(lex_root)}`")
        st.caption(n['meta'].get('pattern_info') or n['meta'].get('pattern'))
        # Compact noun overview with counts
        try:
            rows = []
            for key, (ps, rom) in n['forms'].items():
                occ_nt = _find_occurrences_in_text(ps, nt_text, whole_word=True) if scope in ('all','nt') else {'count':0,'verses':[]}
                occ_ot = _find_occurrences_in_text(ps, ot_text, whole_word=True) if scope in ('all','ot') else {'count':0,'verses':[]}
                rows.append({'Form (Pashto)': ps, 'Romanization': rom, 'NT': occ_nt['count'], 'OT': occ_ot['count']})
            if rows:
                st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True)
        except Exception:
            pass
        # Per-form expanders with verses from selected scope
        for key, (ps, rom) in n['forms'].items():
            occ = _find_occurrences_in_text(ps, nt_text if scope=='nt' else ot_text if scope=='ot' else {**nt_text, **ot_text}, whole_word=True)
            title = f"{key}: `{ps}` ({rom}) — {occ['count']} hits"
            with st.expander(title):
                for vref in sorted(set(occ['verses'])):
                    display_verse_with_audio(vref, ps, nt_text if scope=='nt' else ot_text)
        if not prefer_exact_noun:
            return
        st.markdown("---")

    # Then show grammatical results for the root (if form maps to a root), otherwise for the form itself
    effective_query = lex_root if lex_root else query
    results = search_grammatical_forms(effective_query, form_to_root_map, grammatical_index)

    # Prefer showing exact lemma's full conjugations first
    skip_summary_roots = set()
    if lex_root and conj_for_form and (prefer_exact_verb or not results):
        conj = conj_for_form
        st.header(f"Grammatical Results for Root: `{format_for_display(lex_root)}`")
        meta = conj['meta']
        st.caption(
            f"Imperfective Stem: {meta['imperfective_stem']} ({meta['romanization'].get('imperfective_stem','')}) · "
            f"Perfective Stem: {meta['perfective_stem']} ({meta['romanization'].get('perfective_stem','')}) · "
            f"Past Participle: {meta['past_participle']} ({meta['romanization'].get('past_participle','')})"
        )
        render_forms_summary("present", conj.get('present', {}), form_occurrence_index, selected_text, scope, key_prefix="sum1")
        render_forms_summary("subjunctive", conj.get('subjunctive', {}), form_occurrence_index, selected_text, scope, key_prefix="sum2")
        render_forms_summary("imperfective future", conj.get('imperfective_future', {}), form_occurrence_index, selected_text, scope, key_prefix="sum3")
        render_forms_summary("perfective future", conj.get('perfective_future', {}), form_occurrence_index, selected_text, scope, key_prefix="sum4")
        render_forms_summary("ability (present)", conj.get('ability_present', {}), form_occurrence_index, selected_text, scope, key_prefix="sum5")
        render_past_expanders("Past (continuous)", conj.get('continuous_past', {}), form_occurrence_index, selected_text)
        render_past_expanders("Past (simple)", conj.get('simple_past', {}), form_occurrence_index, selected_text)
        render_past_expanders("Ability — continuous past", conj.get('ability_continuous_past', {}), form_occurrence_index, selected_text)
        render_past_expanders("Ability — simple past", conj.get('ability_simple_past', {}), form_occurrence_index, selected_text)
        skip_summary_roots.add(lex_root)
        if not results:
            return
        st.markdown("---")
    if not results:
        st.error(f"The word '{query}' was not found in any form.")
        return

    by_root = defaultdict(list)
    for r in results:
        by_root[r['root']].append(r)

    for root_word, items in by_root.items():
        # If we already rendered this root in a dedicated summary above, skip
        if root_word in skip_summary_roots:
            continue
        root_data = grammatical_index.get(root_word, {})
        root_translit = root_data.get('identities', [{}])[0].get('translit', '')

        # Pull POS/romanization hints, prefer LingDocs dict when available
        freq_item = WORD_FREQ_MAP.get(format_for_display(root_word)) or WORD_FREQ_MAP.get(root_word)
        pos_hint = (freq_item.get('pos') if freq_item else None) or None
        rom_hint = dict_romanization_for(root_word) or (freq_item.get('romanization') if freq_item else None) or None
        # If missing, fall back to verb lexicon when available
        lex_conj = conjugate_verb(root_word)
        if (not rom_hint or rom_hint == 'not_found') and lex_conj:
            rom_hint = lex_conj['meta']['romanization'].get('imperfective_root')
        if (not rom_hint or rom_hint == 'not_found'):
            # Fast path from prebuilt indexes for the root and the query form
            rom_hint = romanization_for_form_fast(root_word) or romanization_for_form_fast(query)
        if (not pos_hint or pos_hint == 'unknown'):
            # Prefer LingDocs dictionary POS
            dp = dict_pos_for(root_word)
            if dp:
                pos_hint = dp
        if (not pos_hint or pos_hint == 'unknown') and lex_conj:
            pos_hint = 'verb (trans./intrans.)'
        subtitle_bits = []
        if rom_hint and rom_hint != 'not_found':
            subtitle_bits.append(rom_hint)
        if pos_hint and pos_hint != 'unknown':
            subtitle_bits.append(pos_hint)
        subtitle = f" ({', '.join(subtitle_bits)})" if subtitle_bits else ""
        st.header(f"Grammatical Results for Root: `{format_for_display(root_word)}` {subtitle}")

        by_type = defaultdict(list)
        for item in items:
            by_type[item['type']].append(item)

        # Prepare conjugations once per root so it's available below
        conj = lex_conj

        for word_type, forms in by_type.items():
            pattern = forms[0].get('pattern', 'N/A')
            st.subheader(f"As a {word_type}")
            st.info(f"Grammar Pattern: **{pattern}**")

            for item in sorted(forms, key=lambda x: x['count'], reverse=True):
                form_display = format_for_display(item['form'])
                # Prefer lexicon romanization if available for this exact Pashto form
                translit = ''
                if conj and isinstance(conj, dict) and 'forms_map' in conj:
                    translit = conj['forms_map'].get(item['form'], '')
                if not translit:
                    form_ps = item.get('form', '')
                    translit = romanize_from_dict_or_rules(form_ps) or item.get('translit', '')
                expander_title = (
                    f"**{item['description']}**: `{form_display}` ({translit}) - "
                    f"(Frequency: {item['count']})"
                )
                with st.expander(expander_title):
                    for verse_ref in sorted(set(item['verses'])):
                        display_verse_with_audio(verse_ref, item['form'], bible_text)

        # If this root is in the verb lexicon, display a conjugation summary regardless of index type
        if conj and root_word not in skip_summary_roots:
            st.subheader("Conjugation (summary)")
            meta = conj['meta']
            st.caption(
                f"Imperfective Stem: {meta['imperfective_stem']} ({meta['romanization'].get('imperfective_stem','')}) · "
                f"Perfective Stem: {meta['perfective_stem']} ({meta['romanization'].get('perfective_stem','')}) · "
                f"Past Participle: {meta['past_participle']} ({meta['romanization'].get('past_participle','')})"
            )
            # Compact overview first
            render_forms_summary("present", conj.get('present', {}), form_occurrence_index, bible_text, scope, key_prefix="sum6")
            render_forms_summary("subjunctive", conj.get('subjunctive', {}), form_occurrence_index, bible_text, scope, key_prefix="sum7")
            render_forms_summary("imperfective future", conj.get('imperfective_future', {}), form_occurrence_index, bible_text, scope, key_prefix="sum8")
            render_forms_summary("perfective future", conj.get('perfective_future', {}), form_occurrence_index, bible_text, scope, key_prefix="sum9")
            render_forms_summary("ability (present)", conj.get('ability_present', {}), form_occurrence_index, bible_text, scope, key_prefix="sum10")

        # If user entered the infinitive itself, show extended past tables
        if query == root_word and conj:
            render_past_expanders("Past (continuous)", conj.get('continuous_past', {}), form_occurrence_index, bible_text)
            render_past_expanders("Past (simple)", conj.get('simple_past', {}), form_occurrence_index, bible_text)
        elif root_word in NOUNS:
            n = inflect_noun(root_word)
            st.subheader("Noun Inflections (summary)")
            render_noun_summary("noun", n['forms'], form_occurrence_index)
            for key, (ps, rom) in n['forms'].items():
                occ = form_occurrence_index.get(normalize_pashto_char(ps), {'count': 0, 'verses': []})
                if occ['count']:
                    with st.expander(f"{key}: `{ps}` ({rom}) — {occ['count']} hits"):
                        for vref in sorted(set(occ['verses'])):
                            display_verse_with_audio(vref, ps, bible_text)

# --- Main Application ---
st.title("Pashto Bible Smart Search")
st.caption(f"Build: {APP_VERSION}")

def _get_query_params():
    try:
        # Streamlit >= 1.30
        qp = getattr(st, 'query_params', None)
        if qp is not None:
            try:
                return dict(qp)
            except Exception:
                pass
        # Fallback
        return st.experimental_get_query_params() if hasattr(st, 'experimental_get_query_params') else {}
    except Exception:
        return {}

def _extract_single(param_val):
    if param_val is None:
        return ''
    if isinstance(param_val, list):
        return param_val[0] if param_val else ''
    return str(param_val)

QP = _get_query_params()
QP_Q = _extract_single(QP.get('q'))
QP_S = _extract_single(QP.get('s')).lower()
QP_APP = _extract_single(QP.get('app'))
QP_M = _extract_single(QP.get('m'))

SCOPE_LABELS = ["New Testament", "Old Testament", "Whole Bible"]

def _scope_index_from_code(code: str) -> int:
    return 0 if code == 'nt' else 1 if code == 'ot' else 2 if code == 'all' else 0

# Pre-seed the main search from query params once
if QP_Q and not st.session_state.get('main_search'):
    st.session_state['main_search'] = QP_Q

DEFAULT_SCOPE_INDEX = _scope_index_from_code(QP_S)

def _clear_all_caches():
    try:
        load_data.clear()
    except Exception:
        pass
    for fn in [
        load_bible_text,
        load_bible_text_ot,
        load_word_frequency_data,
        load_form_to_lemma_map,
        load_inflections_cache_map,
        load_nt_reference_data,
        load_lingdocs_dictionary_map,
        _build_dict_norm_map,
        build_dictionary_dataframe,
        build_bible_word_catalog,
    ]:
        try:
            fn.clear()
        except Exception:
            pass


# Compute lightweight mobile mode from query params and width hint
MOBILE_MODE = True if (QP_APP == '1' or QP_M == '1') else False

# Tabs: Search | Lexicon (comprehensive lists)
tabs = st.tabs(["Search", "Lexicon"])

with tabs[0]:
    grammatical_index = load_data()
    # Vertical radio improves usability on small screens
    # Hide scope selector in standalone PWA to minimize chrome
    if QP_APP == '1':
        scope = SCOPE_LABELS[DEFAULT_SCOPE_INDEX]
        st.caption("App mode: using default scope")
    else:
        scope = st.radio("Scope", options=SCOPE_LABELS, horizontal=False, index=DEFAULT_SCOPE_INDEX)
    nt_text = load_bible_text()
    ot_text = load_bible_text_ot()
    merged = {}
    merged.update(nt_text)
    merged.update(ot_text)
    bible_text = merged

    if grammatical_index is None: st.stop()

    form_to_root_map = create_form_to_root_map(grammatical_index)
    form_occurrence_index = build_form_occurrence_index(grammatical_index)
    # Overlay OT-only occurrences when browsing OT to ensure fast per-form lookups
    if scope == "Old Testament" and os.path.exists(OT_FORMS_INDEX_FILE):
        try:
            with open(OT_FORMS_INDEX_FILE, 'r', encoding='utf-8') as f:
                ot_forms = json.load(f)
            # Replace for OT scope to reflect only OT references
            form_occurrence_index = {normalize_pashto_char(k): v for k, v in ot_forms.items()}
        except Exception:
            pass

# --- Sidebar: Word Frequency Browser ---
if SHOW_SIDEBAR:
    with st.sidebar:
        st.header("Word Frequency")
        if not os.path.exists(WORD_FREQ_FILE):
            st.info("Word frequency file not found. The browser will appear once `word_frequency_list.json` is present.")
            freq_items = []
        else:
            freq_items = load_word_frequency_data()
        pos_options = sorted({item.get('pos', 'unknown') for item in freq_items}) if freq_items else []
        pos_filter = st.multiselect("Filter by POS", options=pos_options, default=[])
        text_filter = st.text_input("Filter (Pashto or romanization)", "", key="sidebar_filter")
        top_n = st.slider("How many to show", min_value=10, max_value=200, value=50, step=10)

        def item_matches(item):
            if pos_filter and item.get('pos', 'unknown') not in pos_filter:
                return False
            tf = text_filter.strip()
            if not tf:
                return True
            tf_norm = tf.lower()
            return (
                tf_norm in item.get('pashto', '')
                or tf_norm in str(item.get('romanization', '')).lower()
            )

        filtered = [it for it in freq_items if item_matches(it)] if freq_items else []
        filtered.sort(key=lambda x: x.get('frequency', 0), reverse=True)
        show = filtered[:top_n]

        if show:
            df_rows = [
                {
                    'Pashto': r.get('pashto', ''),
                    'Romanization': r.get('romanization', ''),
                    'POS': r.get('pos', ''),
                    'Freq': r.get('frequency', 0),
                }
                for r in show
            ]
            st.dataframe(pd.DataFrame(df_rows), use_container_width=True, hide_index=True)

        if show:
            pick = st.selectbox(
                "Insert a word to search",
                options=[r.get('pashto', '') for r in show],
                index=0,
            )
            if pick and st.button("Search this word"):
                st.session_state['main_search'] = pick
                st.rerun()

with tabs[0]:
    # Floating search bar at top
    st.markdown("<div style='position:sticky; top:0; z-index:1000; background:var(--background-color); padding:8px 4px;'>", unsafe_allow_html=True)
    search_query = st.text_input("Enter a Pashto word, phrase, or verse reference:", st.session_state.get('main_search',''), key="main_search")
    st.markdown("</div>", unsafe_allow_html=True)

    if st.button("Force refresh caches"):
        _clear_all_caches()
        st.rerun()

    if search_query:
        st.markdown("---")
        raw_query = search_query.strip()
        normalized_query = normalize_pashto_char(raw_query)

        # Romanization support -------------------------------------------------
        def normalize_roman(s: str) -> str:
            s = s.lower().strip()
            # remove accents/diacritics
            trans = str.maketrans({
                'á':'a','à':'a','ā':'a','ä':'a','â':'a',
                'é':'e','è':'e','ē':'e','ë':'e','ê':'e',
                'í':'i','ì':'i','ī':'i','ï':'i','î':'i',
                'ó':'o','ò':'o','ō':'o','ö':'o','ô':'o',
                'ú':'u','ù':'u','ū':'u','ü':'u','û':'u',
                'ý':'y','ÿ':'y',
                'ḍ':'d','ṛ':'r','ṣ':'s','ṭ':'t','ẓ':'z',
            })
            s = s.translate(trans)
            s = re.sub(r"[^a-z0-9]+", "", s)
            return s

        @st.cache_data
        def build_roman_to_pashto_index():
            idx = {}
            for p, entries in DICT_MAP.items():
                for ent in entries:
                    f = ent.get('f', '') or ''
                    if not f:
                        continue
                    parts = [x.strip() for x in str(f).split(',') if x.strip()]
                    for part in parts:
                        key = normalize_roman(part)
                        if not key:
                            continue
                        idx.setdefault(key, set()).add(p)
            # flatten to list
            return {k: sorted(list(v)) for k, v in idx.items()}

        contains_pashto = bool(re.search(r'[\u0600-\u06FF]', normalized_query))
        ROM_IDX = build_roman_to_pashto_index()

        if is_verse_reference(raw_query):
            handle_verse_search(raw_query, bible_text)
        elif " " in normalized_query:
            handle_phrase_search(normalized_query, nt_text, ot_text, scope)
        else:
            if not contains_pashto:
                rq = normalize_roman(raw_query)
                cand = ROM_IDX.get(rq)
                if cand:
                    pick = cand[0]
                    st.info(f"Interpreting romanization '{raw_query}' as '{pick}'")
                    handle_grammatical_search(pick, form_to_root_map, grammatical_index, nt_text, ot_text, scope)
                else:
                    handle_grammatical_search(normalized_query, form_to_root_map, grammatical_index, nt_text, ot_text, scope)
            else:
                handle_grammatical_search(normalized_query, form_to_root_map, grammatical_index, nt_text, ot_text, scope)
    else:
        if QP_APP == '1':
            st.info("Type a word, phrase, or verse (e.g., Galatians 4:19) to begin.")
        else:
            st.info("Enter a word, phrase (e.g., زما ګرانو), or verse (e.g., Galatians 4:19) to begin.")

with tabs[1]:
    st.subheader("Comprehensive Lists")
    sub = st.tabs(["Frequency — New Testament", "Frequency — Old Testament", "Frequency — All"])

    def build_freq_items(raw_items):
        items = []
        for it in raw_items:
            p = it.get('pashto', '')
            items.append({
                'pashto': p,
                'frequency': it.get('frequency', it.get('count', 0)),
                'romanization': it.get('romanization', it.get('f', '')) or romanization_for_form_fast(p) or romanize_from_dict_or_rules(p) or dict_romanization_for(p),
                'pos': normalize_pos_label((it.get('pos') or it.get('c') or '') or dict_pos_for(p) or 'unknown'),
                'ts': it.get('ts', ''),
                'english': it.get('english', it.get('e', '')) or dict_english_for(p),
            })
        return items

    def render_frequency_panel(raw_freq_items, text_map, key_prefix: str):
        if not raw_freq_items:
            st.info("Word frequency list not available yet.")
            return
        freq_items = build_freq_items(raw_freq_items)
        # Build top-level POS family tabs (allow entries to appear in multiple families)
        family_buckets = {'All': list(freq_items), 'Verb': [], 'Noun': [], 'Adjective': [], 'Adverb': [], 'Other': []}
        for it in freq_items:
            fams = families_for_pos(it.get('pos',''))
            for fam in fams:
                family_buckets[fam].append(it)
            if fams == {'Other'}:
                family_buckets['Other'].append(it)
        tab_names = list(family_buckets.keys())
        pos_tabs = st.tabs(tab_names)

        def render_freq_tab(selected_pos: str):
            base_items = family_buckets.get(selected_pos, freq_items)
            # Controls area — collapse into an expander on mobile
            default_n = 200 if MOBILE_MODE else 1000
            with st.expander("Filters", expanded=not MOBILE_MODE):
                show_n = st.slider(
                    "How many to show",
                    min_value=50,
                    max_value=5000,
                    value=default_n,
                    step=50,
                    key=f"{key_prefix}_freq_n_{selected_pos}"
                )
                group_by_lemma = st.checkbox(
                    "Group by base word (if cache available)",
                    value=False,
                    key=f"{key_prefix}_freq_group_{selected_pos}"
                )
                # Search box
                text_q = st.text_input(
                    "Filter (Pashto/Romanization)",
                    "",
                    key=f"{key_prefix}_freq_filter_{selected_pos}"
                )

            def match(it):
                q = text_q.strip().lower()
                if not q:
                    return True
                return (
                    q in it.get('pashto', '') or
                    q in str(it.get('romanization', '')).lower()
                )

            # Cache key for heavy precomputation (base rows prior to subfilters)
            base_cache_key = f"freq_rows_cache::{key_prefix}::{selected_pos}::group={group_by_lemma}::q={text_q.strip().lower()}"
            if base_cache_key in st.session_state:
                base_rows_all = st.session_state[base_cache_key]
            else:
                cleaned_map = {}
                for r in (it for it in base_items if match(it)):
                    pashto = (r.get('pashto', '') or '').replace('»', '').replace('›', '').strip()
                    freq = int(r.get('frequency', 0))
                    pos = r.get('pos', '')
                    eng = r.get('english', '') or dict_english_for(pashto)
                    if pashto not in cleaned_map:
                        cleaned_map[pashto] = {
                            'pashto': pashto,
                            'romanization': r.get('romanization', ''),
                            'pos': pos,
                            'frequency': 0,
                            'english': eng,
                            'lemma': '',
                            'kind': '',
                            'noun_key': '',
                            'noun_num': '',
                        }
                    cleaned_map[pashto]['frequency'] += freq
                    # Enrich entry holistically (pos/kind/lemma/roman/english)
                    enriched = classify_form_basic(pashto)
                    if not cleaned_map[pashto]['romanization'] and enriched.get('romanization'):
                        cleaned_map[pashto]['romanization'] = enriched['romanization']
                    if (not cleaned_map[pashto]['pos'] or cleaned_map[pashto]['pos'] == 'unknown') and enriched.get('pos'):
                        cleaned_map[pashto]['pos'] = enriched['pos']
                    if enriched.get('english') and not cleaned_map[pashto]['english']:
                        cleaned_map[pashto]['english'] = enriched['english']
                    if enriched.get('lemma'):
                        cleaned_map[pashto]['lemma'] = enriched['lemma']
                    if enriched.get('kind'):
                        cleaned_map[pashto]['kind'] = enriched['kind']
                    if enriched.get('noun_key'):
                        cleaned_map[pashto]['noun_key'] = enriched['noun_key']
                    if enriched.get('noun_num'):
                        cleaned_map[pashto]['noun_num'] = enriched['noun_num']
                # Convert to base rows list (no slicing; subfilters applied later)
                base_rows_all = list(cleaned_map.values())
                # Persist once per session for fast toggling between subfilters
                st.session_state[base_cache_key] = base_rows_all

            # If Noun family, compute noun morphology keys for filtered forms (with light memoization)
            if selected_pos == 'Noun':
                noun_forms_index = build_noun_forms_index() if NOUNS else {}
                if '__noun_morph_cache' not in st.session_state:
                    st.session_state['__noun_morph_cache'] = {}
                cache = st.session_state['__noun_morph_cache']
                for r in cleaned_map.values():
                    form = r['pashto']
                    norm = normalize_pashto_char(form)
                    if norm in cache:
                        r['noun_key'], r['noun_num'] = cache[norm]
                        continue
                    lemma = noun_forms_index.get(norm)
                    key = ''; num = ''
                    try:
                        if lemma and lemma in NOUNS:
                            n = inflect_noun(lemma)
                            for k, (ps, _rom) in n['forms'].items():
                                if normalize_pashto_char(ps) == norm:
                                    key = k
                                    num = 'pl' if 'plural' in k else 'sg'
                                    break
                    except Exception:
                        pass
                    r['noun_key'], r['noun_num'] = key, num
                    cache[norm] = (key, num)

            if group_by_lemma and load_form_to_lemma_map():
                f2l = load_form_to_lemma_map()
                # Build noun index once for grouping fallback
                noun_forms_index = build_noun_forms_index() if NOUNS else {}
                lemma_agg = {}
                for r in cleaned_map.values():
                    form = r['pashto']
                    norm_form = normalize_pashto_char(form)
                    # Try cached mapping, then verb lexicon, then noun forms index
                    key = (
                        f2l.get(form)
                        or f2l.get(norm_form)
                        or find_lexicon_root_for_form(norm_form)
                        or noun_forms_index.get(norm_form)
                        or form
                    )
                    la = lemma_agg.get(key)
                    if not la:
                        la = {
                            'Lemma': key,
                            'Romanization': dict_romanization_for(key) or r['romanization'],
                            'POS': r['pos'],
                            'Frequency': 0,
                            'Forms': [],
                        }
                        lemma_agg[key] = la
                    la['Frequency'] += r['frequency']
                    la['Forms'].append({'Form': form, 'Romanization': r['romanization'], 'POS': r['pos'], 'Frequency': r['frequency']})
                rows = sorted(lemma_agg.values(), key=lambda x: x['Frequency'], reverse=True)[:show_n]
                df = pd.DataFrame([{k: v for k, v in r.items() if k != 'Forms'} for r in rows])
            else:
                rows = sorted(base_rows_all, key=lambda x: x['frequency'], reverse=True)
                # Sub-filters bar as toggles (no dropdowns)
                c1, c2, c3, c4 = st.columns([1,1,1,2]) if MOBILE_MODE else st.columns([1.2,1,2.4,3])
                # Gender radio (horizontal)
                with c1:
                    gender_val = st.radio("Gender", options=['All','m','f','unisex'], horizontal=True, key=f"{key_prefix}_gender_{selected_pos}")
                    gender_val = '' if gender_val == 'All' else gender_val
                # Number radio (for nouns)
                with c2:
                    num_val = st.radio("Number", options=['All','sg','pl'], horizontal=True, key=f"{key_prefix}_num_{selected_pos}") if selected_pos == 'Noun' else 'All'
                    num_val = '' if num_val == 'All' else num_val
                # Inflection toggles (for nouns)
                with c3:
                    if selected_pos == 'Noun':
                        cc = st.columns(2) if MOBILE_MODE else st.columns(4)
                        infl_opts = [('base','Base'),('inflection_1','Infl 1'),('inflection_2','Infl 2'),('vocative','Vocative')]
                        infl_val = []
                        # Distribute checkboxes across available columns
                        for i,(key,label) in enumerate(infl_opts):
                            col = cc[i % len(cc)]
                            # Persist toggle state in session for fast tab switching
                            state_key = f"{key_prefix}_infl_{selected_pos}_{key}"
                            if col.checkbox(label, value=st.session_state.get(state_key, False), key=state_key):
                                infl_val.append(key)
                    else:
                        infl_val = []
                # Verb form/lemma toggles
                with c4:
                    if selected_pos == 'Verb':
                        vm_cols = st.columns(2) if MOBILE_MODE else st.columns(3)
                        vm_all = vm_cols[0].checkbox('All entries', value=True, key=f"{key_prefix}_vm_all_{selected_pos}")
                        vm_lem = vm_cols[1].checkbox('Lemmas', value=False, key=f"{key_prefix}_vm_lem_{selected_pos}")
                        # On mobile, place 'Forms' beneath in a separate line for larger tap target
                        vm_forms = st.checkbox('Forms', value=False, key=f"{key_prefix}_vm_forms_{selected_pos}") if MOBILE_MODE else vm_cols[2].checkbox('Forms', value=False, key=f"{key_prefix}_vm_forms_{selected_pos}")
                        if vm_all:
                            vf_mode = 'all'
                        elif vm_lem and not vm_forms:
                            vf_mode = 'lemma only'
                        elif vm_forms and not vm_lem:
                            vf_mode = 'forms only'
                        else:
                            vf_mode = 'all'
                    else:
                        vf_mode = 'all'
                # Person/number filters for present tense
                if selected_pos == 'Verb':
                    cpn1, cpn2 = st.columns([1,3])
                    with cpn1:
                        st.caption('Present filters')
                    if MOBILE_MODE:
                        left, right = st.columns(2)
                        with left:
                            pn_1sg = st.checkbox('1sg', value=False, key=f"{key_prefix}_pn_1sg")
                            pn_2sg = st.checkbox('2sg', value=False, key=f"{key_prefix}_pn_2sg")
                            pn_3sg = st.checkbox('3sg', value=False, key=f"{key_prefix}_pn_3sg")
                        with right:
                            pn_1pl = st.checkbox('1pl', value=False, key=f"{key_prefix}_pn_1pl")
                            pn_2pl = st.checkbox('2pl', value=False, key=f"{key_prefix}_pn_2pl")
                            pn_3pl = st.checkbox('3pl', value=False, key=f"{key_prefix}_pn_3pl")
                        pn_val = {'1sg': pn_1sg, '2sg': pn_2sg, '3sg': pn_3sg, '1pl': pn_1pl, '2pl': pn_2pl, '3pl': pn_3pl}
                    else:
                        cpn = st.columns(6)
                        pn_val = {
                            '1sg': cpn[0].checkbox('1sg', value=False, key=f"{key_prefix}_pn_1sg"),
                            '2sg': cpn[1].checkbox('2sg', value=False, key=f"{key_prefix}_pn_2sg"),
                            '3sg': cpn[2].checkbox('3sg', value=False, key=f"{key_prefix}_pn_3sg"),
                            '1pl': cpn[3].checkbox('1pl', value=False, key=f"{key_prefix}_pn_1pl"),
                            '2pl': cpn[4].checkbox('2pl', value=False, key=f"{key_prefix}_pn_2pl"),
                            '3pl': cpn[5].checkbox('3pl', value=False, key=f"{key_prefix}_pn_3pl"),
                        }
                # Second-tier subcategory toggles for 'Other'
                if selected_pos == 'Other':
                    oc = st.columns(5)
                    filt_other = {
                        'interj': oc[0].checkbox('Interjection', value=st.session_state.get(f"{key_prefix}_oth_interj", False), key=f"{key_prefix}_oth_interj"),
                        'conj': oc[1].checkbox('Conjunction', value=st.session_state.get(f"{key_prefix}_oth_conj", False), key=f"{key_prefix}_oth_conj"),
                        'adpos': oc[2].checkbox('Adposition', value=st.session_state.get(f"{key_prefix}_oth_adpos", False), key=f"{key_prefix}_oth_adpos"),
                        'particle': oc[3].checkbox('Particle', value=st.session_state.get(f"{key_prefix}_oth_part", False), key=f"{key_prefix}_oth_part"),
                        'pron': oc[4].checkbox('Pronoun', value=st.session_state.get(f"{key_prefix}_oth_pron", False), key=f"{key_prefix}_oth_pron"),
                    }

                # Apply sub-filters
                if gender_val:
                    rows = [r for r in rows if gender_from_pos(r.get('pos','')) == gender_val]
                if selected_pos == 'Noun':
                    if num_val:
                        rows = [r for r in rows if r.get('noun_num','') == num_val]
                    if infl_val:
                        def map_infl(key):
                            if not key:
                                return ''
                            if 'plain' in key:
                                return 'base'
                            if 'inflection_1' in key:
                                return 'inflection_1'
                            if 'inflection_2' in key:
                                return 'inflection_2'
                            if 'vocative' in key:
                                return 'vocative'
                            return ''
                        rows = [r for r in rows if map_infl(r.get('noun_key','')) in infl_val]
                    # Show type classification in Kind column when available
                    for r in rows:
                        try:
                            lemma = r.get('pashto','') if r.get('noun_key','') == 'base' else r.get('pashto','')
                            # Attempt lemma via index
                            nidx = build_noun_forms_index() if NOUNS else {}
                            lemma = nidx.get(normalize_pashto_char(r.get('pashto','')), lemma)
                            ntype = classify_inflection_type(lemma) if lemma else None
                            if ntype:
                                r['kind'] = f"noun type {ntype}"
                        except Exception:
                            pass
                if selected_pos == 'Verb':
                    if vf_mode == 'lemma only':
                        rows = [r for r in rows if r.get('kind','') != 'verb form']
                    elif vf_mode == 'forms only':
                        rows = [r for r in rows if r.get('kind','') == 'verb form']
                # Present person/number filter
                if selected_pos == 'Verb' and any(pn_val.values()):
                    allowed = {k for k,v in pn_val.items() if v}
                    def is_present_match(ps: str):
                        p, n = classify_present_person_number(ps)
                        key = f"{p}{n}"
                        return key in allowed
                    rows = [r for r in rows if is_present_match(r.get('pashto',''))]
                if selected_pos == 'Other' and any(filt_other.values()):
                    def other_match(pos: str) -> bool:
                        s = (pos or '').lower()
                        m = True
                        if filt_other['interj']:
                            m = m and ('interj' in s)
                        if filt_other['conj']:
                            m = m and ('conj' in s)
                        if filt_other['adpos']:
                            m = m and (('adpos' in s) or ('postpos' in s) or ('prep' in s))
                        if filt_other['particle']:
                            m = m and ('part' in s)
                        if filt_other['pron']:
                            m = m and ('pron' in s)
                        return m
                    # Our rows dicts use lowercase 'pos' key; guard against missing keys
                    rows = [r for r in rows if other_match(r.get('pos', ''))]

                # Apply final limit after all subfilters
                rows = rows[:show_n]
                df = pd.DataFrame([
                    {
                        'Pashto': r['pashto'],
                        'Romanization': r['romanization'],
                        'POS': r['pos'],
                        'Frequency': r['frequency'],
                        'English': r.get('english', ''),
                        'Kind': r.get('kind', ''),
                    }
                    for r in rows
                ])
            if not rows:
                st.info("No entries match the current filters.")
            else:
                # In app mode, reduce chrome and use a modest height to fit on phones
                table_height = 460 if (globals().get('QP_APP') == '1') else (520 if MOBILE_MODE else None)
                st.dataframe(
                    df,
                    use_container_width=True,
                    hide_index=True,
                    height=table_height,
                )

            if rows:
                if group_by_lemma and isinstance(rows[0], dict) and 'Lemma' in rows[0]:
                    lemma_pick = st.selectbox("Inspect lemma", options=[r['Lemma'] for r in rows], key=f"{key_prefix}_lemma_pick_{selected_pos}")
                    if lemma_pick:
                        forms = next((r['Forms'] for r in rows if r['Lemma'] == lemma_pick), [])
                        if forms:
                            st.markdown("Forms for selected lemma")
                            st.dataframe(pd.DataFrame(forms), use_container_width=True, hide_index=True)
                        if st.button("Search lemma", key=f"{key_prefix}_lemma_search_{selected_pos}"):
                            st.session_state['main_search'] = lemma_pick
                            st.rerun()
                else:
                    pick = st.selectbox("Insert a word to search", options=[r.get('pashto', '') for r in rows], key=f"{key_prefix}_pick_{selected_pos}")
                    cols_actions = st.columns(3)
                    with cols_actions[0]:
                        if st.button("Search selected", key=f"{key_prefix}_search_{selected_pos}"):
                            st.session_state['main_search'] = pick
                            st.rerun()
                    with cols_actions[1]:
                        if st.button("View references", key=f"{key_prefix}_view_refs_{selected_pos}"):
                            norm_pick = normalize_pashto_char(pick)
                            occ = _find_occurrences_in_text(norm_pick, text_map)
                            with st.modal(f"References for {pick} — {occ['count']} hits"):
                                if not occ['verses']:
                                    st.info("No references found in this testament.")
                                else:
                                    for vref in sorted(set(occ['verses'])):
                                        display_verse_with_audio(vref, pick, text_map)
                    with cols_actions[2]:
                        sel = next((r for r in rows if r.get('pashto', '') == pick), None)
                        ts_val = sel.get('ts') if sel else ''
                        if ts_val and st.button("Play dict audio", key=f"{key_prefix}_playdict_{selected_pos}"):
                            dict_audio_url = f"https://storage.lingdocs.com/audio/{ts_val}.mp3"
                            audio_bytes = get_audio_bytes(dict_audio_url)
                            if audio_bytes:
                                st.audio(audio_bytes, format='audio/mp3')
                    sel2 = next((r for r in rows if r.get('pashto', '') == pick), None)
                    if sel2 and sel2.get('english'):
                        st.caption(f"English: {sel2['english']}")

        for i, name in enumerate(tab_names):
            with pos_tabs[i]:
                render_freq_tab(name)

    # New Testament frequency
    @st.cache_data
    def _derive_nt_freq_from_index():
        idx = load_data()
        if not idx:
            return []
        counts = {}
        for root, data in idx.items():
            for identity in data.get('identities', []):
                for items_list in identity.get('forms', {}).values():
                    for item in items_list:
                        form_ps = (item.get('form', '') or '').replace('_', ' ')
                        counts[form_ps] = counts.get(form_ps, 0) + int(item.get('count', 0))
        rows = [{'pashto': k, 'frequency': v} for k, v in counts.items()]
        rows.sort(key=lambda x: x['frequency'], reverse=True)
        return rows

    with sub[0]:
        raw_nt = _derive_nt_freq_from_index()
        render_frequency_panel(raw_nt, nt_text, key_prefix="nt")

    # Old Testament frequency
    with sub[1]:
        # Streaming fallback: if OT_WORD_FREQ_FILE is large or unavailable, derive a top-N list from
        # the smaller ot_form_occurrence_index.json without loading the entire frequency file.
        TOP_N = 5000
        if os.path.exists(OT_WORD_FREQ_FILE):
            try:
                # Stream first TOP_N entries to reduce load time
                raw_ot = []
                with open(OT_WORD_FREQ_FILE, 'r', encoding='utf-8') as f:
                    # Basic fast-read: if file is a list JSON, read once; otherwise fallback
                    data = json.load(f)
                    raw_ot = data[:TOP_N] if isinstance(data, list) else []
            except Exception:
                raw_ot = []
        else:
            idx = load_ot_occurrence_index()
            # Build a list sorted by frequency descending, limited to TOP_N
            raw_ot = sorted(
                ({'pashto': k, 'frequency': int(v.get('count', 0))} for k, v in idx.items()),
                key=lambda x: x['frequency'], reverse=True
            )[:TOP_N]
        render_frequency_panel(raw_ot, ot_text, key_prefix="ot")

    with sub[2]:
        # Combine NT and OT using identical derivation processes
        raw_nt = _derive_nt_freq_from_index()
        # Reuse OT derivation from above
        TOP_N = 5000
        if os.path.exists(OT_WORD_FREQ_FILE):
            try:
                with open(OT_WORD_FREQ_FILE, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    raw_ot = data[:TOP_N] if isinstance(data, list) else []
            except Exception:
                raw_ot = []
        else:
            idx = load_ot_occurrence_index()
            raw_ot = sorted(
                ({'pashto': k, 'frequency': int(v.get('count', 0))} for k, v in idx.items()),
                key=lambda x: x['frequency'], reverse=True
            )[:TOP_N]
        # merge counts by pashto
        merged = {}
        for row in raw_nt + raw_ot:
            p = row.get('pashto', '')
            merged[p] = merged.get(p, 0) + int(row.get('frequency', 0))
        rows_all = [{'pashto': k, 'frequency': v} for k, v in merged.items()]
        rows_all.sort(key=lambda x: x['frequency'], reverse=True)
        # Combine verse text maps for references
        text_map_all = {**nt_text, **ot_text}
        render_frequency_panel(rows_all, text_map_all, key_prefix="all")

    # Dictionary view: LingDocs full list (if available)
    # Removed the LingDocs dictionary tab per request
