import streamlit as st
import json
import re
import os
import requests
import pandas as pd
from collections import defaultdict
import hashlib
from search_utils import (
    search_grammatical_forms,
    get_form_occurrences,
    get_form_occurrences_any,
    build_form_occurrence_index,
)
from verb_inflector import conjugate_verb, find_lexicon_root_for_form


# --- Unicode Normalization ---
def normalize_pashto_char(text):
    replacements = {'ي': 'ی', 'ى': 'ی', 'ئ': 'ی'}
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

# --- Configuration & Data Loading (Robust Paths) ---
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(APP_ROOT, 'all_txt_copies')
INDEX_FILE = os.path.join(DATA_DIR, 'grammatical_index_v15.json')
WORD_FREQ_FILE = os.path.join(APP_ROOT, 'word_frequency_list.json')
FULL_DICT_FILE = os.path.join(APP_ROOT, 'full_dictionary.json')
FORM_TO_LEMMA_FILE = os.path.join(APP_ROOT, 'form_to_lemma.json')
INFLECTIONS_CACHE_FILE = os.path.join(APP_ROOT, 'inflections_cache.json')
NT_REFERENCE_FILE = os.path.join(APP_ROOT, 'nt_reference.json')
GOOGLE_DRIVE_URL_PREFIX = "https://drive.google.com/uc?export=download&id="
WORD_FREQ_DRIVE_ID = "1PYrdE16bJlyGiNO5hi1qxed7nTF0-WCo"
FULL_DICT_DRIVE_ID = "1Zay2s8siAV6d7pQec9uEbh-3YpzBtNol"
SHOW_SIDEBAR = False
INFLECT_SERVICE_URL = os.environ.get('INFLECT_SERVICE_URL', '')  # e.g., http://localhost:5050

# --- (ACTION REQUIRED) Audio File Mapping ---
# You need to fill this dictionary with your Google Drive file IDs.
# Format: "bookchapter_verse_number.mp3": "google_drive_file_id"
# Example: "matthew1_verse_1.mp3": "1aBcDeFgHiJkLmNoPqRsTuVwXyZ"
AUDIO_FILE_MAP_PATH = os.path.join(APP_ROOT, 'audio_file_map.json')
with open(AUDIO_FILE_MAP_PATH, 'r', encoding='utf-8') as af:
    AUDIO_FILE_MAP = json.load(af)

st.set_page_config(layout="wide")

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
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        return response.content
    except requests.exceptions.RequestException as e:
        st.error(f"Error fetching audio: {e}")
        return None

@st.cache_data
def load_word_frequency_data():
    """Loads the word frequency and romanization data."""
    try:
        with open(WORD_FREQ_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
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

def _next_unique_suffix(key_family: str) -> str:
    """Return a monotonically increasing suffix per family for unique widget keys.

    Needed to avoid StreamlitDuplicateElementKey when identical components are
    created multiple times in a single rerun (e.g., same verse across groups).
    """
    family = f"__counter__{key_family}"
    count = st.session_state.get(family, 0) + 1
    st.session_state[family] = count
    return str(count)

def dict_romanization_for(pashto_word: str) -> str:
    try:
        key = pashto_word.replace('_', ' ')
        entries = DICT_MAP.get(key)
        if not entries:
            return ''
        f = entries[0].get('f', '')
        if not f:
            return ''
        # Some entries contain multiple variants separated by comma
        return f.split(',')[0].strip()
    except Exception:
        return ''


def dict_pos_for(pashto_word: str) -> str:
    """Return part-of-speech from LingDocs dictionary when available."""
    try:
        key = pashto_word.replace('_', ' ')
        entries = DICT_MAP.get(key)
        if not entries:
            return ''
        pos = entries[0].get('c', '')
        return pos or ''
    except Exception:
        return ''


def dict_english_for(pashto_word: str) -> str:
    """Return English gloss from LingDocs dictionary when available."""
    try:
        key = pashto_word.replace('_', ' ')
        entries = DICT_MAP.get(key)
        if not entries:
            return ''
        return entries[0].get('e', '') or ''
    except Exception:
        return ''


def normalize_pos_label(label: str) -> str:
    """Canonicalize POS labels to merge near-duplicates like 'n. m.' vs 'n.m.'."""
    if not label:
        return 'unknown'
    s = str(label).lower()
    # unify spaces around dots and slashes
    s = re.sub(r"\s*\.\s*", ".", s)
    s = re.sub(r"\s*/\s*", " / ", s)
    # collapse multiple spaces
    s = re.sub(r"\s+", " ", s).strip()
    return s


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
    base = form_ps.replace('_', ' ')
    # Try feminine lemma ending ه
    if base.endswith('و') or base.endswith('ې'):
        cand = base[:-1] + 'ه'
        if cand in DICT_MAP:
            return cand
    # Try removing plural/inflection suffixes commonly seen in fem/mask patterns
    if base.endswith('و') and (base[:-1] in DICT_MAP):
        return base[:-1]
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

@st.cache_data
def load_data():
    try:
        with open(INDEX_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        st.error(f"FATAL: The index file '{INDEX_FILE}' was not found.")
        return None

@st.cache_data
def load_word_frequency_data():
    """Loads the word frequency and romanization data."""
    try:
        with open(WORD_FREQ_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []

@st.cache_data
def load_bible_text():
    bible = {}
    punct = '.,:;!?؟،؛"\'()[]{}“”'
    def persian_to_int(s):
        persian_digits = {'۰': 0, '۱': 1, '۲': 2, '۳': 3, '۴': 4, '۵': 5, '۶': 6, '۷': 7, '۸': 8, '۹': 9}
        result = 0
        for char in s:
            if char in persian_digits: result = result * 10 + persian_digits[char]
            else: return None
        return result
    book_map = {
        'acts': 'Acts', 'colossians': 'Colossians', 'ephesians': 'Ephesians', 'galatians': 'Galatians',
        'hebrews': 'Hebrews', 'james': 'James', 'john': 'John', 'jude': 'Jude', 'luke': 'Luke',
        'mark': 'Mark', 'matthew': 'Matthew', 'philemon': 'Philemon', 'philippians': 'Philippians',
        'revelation': 'Revelation', 'romans': 'Romans', 'titus': 'Titus',
    }
    if not os.path.isdir(DATA_DIR):
        st.error(f"FATAL: Data directory not found at '{DATA_DIR}'")
        return {}
    for filename in os.listdir(DATA_DIR):
        if filename.endswith('_pashto.txt'):
            base = filename.replace('_pashto.txt', '')
            match = re.match(r'([a-z]+)(\d+)', base)
            if match:
                book_prefix, chapter_str = match.groups()
                chapter = int(chapter_str)
                book = book_map.get(book_prefix, book_prefix.capitalize())
                filepath = os.path.join(DATA_DIR, filename)
                with open(filepath, 'r', encoding='utf-8') as f: lines = f.readlines()
                current_verse, verse_text_lines = None, []
                for line in lines:
                    stripped = normalize_pashto_char(line.strip())
                    verse_num_candidate = stripped.translate(str.maketrans('', '', punct))
                    verse_num = persian_to_int(verse_num_candidate)
                    if verse_num is not None:
                        if current_verse is not None: bible[f"{book} {chapter}:{current_verse}"] = ' '.join(verse_text_lines).strip()
                        current_verse, verse_text_lines = verse_num, []
                    elif current_verse is not None:
                        verse_text_lines.append(stripped)
                if current_verse is not None:
                    bible[f"{book} {chapter}:{current_verse}"] = ' '.join(verse_text_lines).strip()
    return bible

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

def highlight_verse(verse_text, search_term):
    display_term = format_for_display(search_term)
    return re.sub(f'({re.escape(display_term)})', r'<mark><b>\1</b></mark>', normalize_pashto_char(verse_text), flags=re.IGNORECASE)

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
            return GOOGLE_DRIVE_URL_PREFIX + file_id
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
        # Fetch audio lazily, only when requested. This prevents dozens of
        # simultaneous downloads that can stall the page.
        # Use a deterministic hash of verse_ref + search_term to avoid
        # duplicate element keys when the same verse appears under
        # multiple forms.
        unique_hash = hashlib.md5(f"{verse_ref}|{search_term}".encode("utf-8")).hexdigest()[:10]
        safe_key = re.sub(r"[^a-zA-Z0-9_]+", "_", verse_ref)
        suffix = _next_unique_suffix("load_audio")
        if st.button("Load audio", key=f"load_audio_{safe_key}_{unique_hash}_{suffix}"):
            audio_bytes = get_audio_bytes(audio_url)
            if audio_bytes:
                st.audio(audio_bytes, format='audio/mp3')
        st.markdown(f"[Download Audio]({audio_url})")
    else:
        st.caption("No audio file found for this verse.")
    st.markdown("---")


# --- Small UI helpers ---
def render_forms_summary(title, forms_dict, occurrence_index):
    """Render a compact table of forms with counts before detailed lists.

    forms_dict: mapping like conj['present'] where values are tuples (pashto, romanization)
    """
    try:
        rows = []
        order = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl']
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

# --- Smart Search Functions ---
def is_verse_reference(query):
    return re.match(r'^[a-zA-Z\s]+\s\d+:\d+$', query.strip())

def handle_verse_search(query, bible_text):
    st.header(f"Verse Lookup: {query}")
    display_verse_with_audio(query, "", bible_text)

def handle_phrase_search(query, bible_text):
    st.header(f"Exact Phrase Search Results for: \"{query}\"")
    normalized_query = normalize_pashto_char(query)
    found_verses = [ref for ref, text in bible_text.items() if normalized_query in text]
    
    if not found_verses:
        st.warning("No verses found containing that exact phrase.")
        return

    for verse_ref in sorted(found_verses):
        display_verse_with_audio(verse_ref, query, bible_text)

def handle_grammatical_search(query, form_to_root_map, grammatical_index, bible_text):
    # Preserve the exact form the user searched for and show its occurrences first
    normalized_form = normalize_pashto_char(query)
    # Prefer precomputed cache or external service; fall back to local lexicon
    form_to_lemma = load_form_to_lemma_map()
    lex_root = form_to_lemma.get(normalized_form) or find_lexicon_root_for_form(normalized_form)
    conj_for_form = conjugate_verb(lex_root) if lex_root else None
    form_rom = ''
    if conj_for_form and isinstance(conj_for_form, dict) and 'forms_map' in conj_for_form:
        form_rom = conj_for_form['forms_map'].get(normalized_form, '')
    if not form_rom:
        # Try dictionary/cache-based romanization for any form
        form_rom = romanize_from_dict_or_rules(normalized_form)

    # Top section: occurrences for the searched form
    if 'form_occurrence_index' in globals():
        occ = form_occurrence_index.get(normalize_pashto_char(normalized_form), {'count': 0, 'verses': []})
        if occ['count']:
            st.subheader(f"Occurrences of {normalized_form} ({form_rom}) — {occ['count']} hits")
            for verse_ref in sorted(set(occ['verses'])):
                display_verse_with_audio(verse_ref, normalized_form, bible_text)
            st.markdown("---")

    # Then show grammatical results for the root (if form maps to a root), otherwise for the form itself
    effective_query = lex_root if lex_root else query
    results = search_grammatical_forms(effective_query, form_to_root_map, grammatical_index)

    # If no results from index but we have a lexicon root, still render a conjugation summary
    if not results and lex_root:
        conj = conjugate_verb(lex_root)
        if conj:
            st.header(f"Grammatical Results for Root: `{format_for_display(lex_root)}`")
            meta = conj['meta']
            st.caption(
                f"Imperfective Stem: {meta['imperfective_stem']} ({meta['romanization']['imperfective_stem']}) · "
                f"Perfective Stem: {meta['perfective_stem']} ({meta['romanization']['perfective_stem']}) · "
                f"Past Participle: {meta['past_participle']} ({meta['romanization']['past_participle']})"
            )
            render_forms_summary("present", conj['present'], form_occurrence_index)
            render_forms_summary("subjunctive", conj['subjunctive'], form_occurrence_index)
            cols = st.columns(2)
            with cols[0]:
                st.write("present")
                for k in ['1sg','2sg','3sg','1pl','2pl','3pl']:
                    ps, rom = conj['present'][k]
                    occ = form_occurrence_index.get(normalize_pashto_char(ps), {'count': 0, 'verses': []})
                    st.text(f"{ps}  ({rom}) — {occ['count']} hits")
                    if occ['verses']:
                        with st.expander("Show verses"):
                            for vref in sorted(set(occ['verses'])):
                                display_verse_with_audio(vref, ps, bible_text)
            with cols[1]:
                st.write("subjunctive")
                for k in ['1sg','2sg','3sg','1pl','2pl','3pl']:
                    ps, rom = conj['subjunctive'][k]
                    occ = form_occurrence_index.get(normalize_pashto_char(ps), {'count': 0, 'verses': []})
                    st.text(f"{ps}  ({rom}) — {occ['count']} hits")
                    if occ['verses']:
                        with st.expander("Show verses"):
                            for vref in sorted(set(occ['verses'])):
                                display_verse_with_audio(vref, ps, bible_text)
            st.subheader("Past (continuous)")
            for k in ['1sg','2sg','3sg_m','3sg_f','1pl','2pl','3pl']:
                ps, rom = conj['continuous_past'][k]
                occ = form_occurrence_index.get(normalize_pashto_char(ps), {'count': 0, 'verses': []})
                st.text(f"{ps}  ({rom}) — {occ['count']} hits")
                if occ['verses']:
                    with st.expander(f"{ps} verses"):
                        for vref in sorted(set(occ['verses'])):
                            display_verse_with_audio(vref, ps, bible_text)
            st.subheader("Past (simple)")
            for k in ['1sg','2sg','3sg_m','3sg_f','1pl','2pl','3pl']:
                ps, rom = conj['simple_past'][k]
                occ = form_occurrence_index.get(normalize_pashto_char(ps), {'count': 0, 'verses': []})
                st.text(f"{ps}  ({rom}) — {occ['count']} hits")
                if occ['verses']:
                    with st.expander(f"{ps} verses"):
                        for vref in sorted(set(occ['verses'])):
                            display_verse_with_audio(vref, ps, bible_text)
            return
    if not results:
        st.error(f"The word '{query}' was not found in any form.")
        return

    by_root = defaultdict(list)
    for r in results:
        by_root[r['root']].append(r)

    for root_word, items in by_root.items():
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
        if (not pos_hint or pos_hint == 'unknown') and lex_conj:
            pos_hint = 'verb (trans./intrans.)' if lex_conj else pos_hint
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
        if conj:
            st.subheader("Conjugation (summary)")
            meta = conj['meta']
            st.caption(
                f"Imperfective Stem: {meta['imperfective_stem']} ({meta['romanization']['imperfective_stem']}) · "
                f"Perfective Stem: {meta['perfective_stem']} ({meta['romanization']['perfective_stem']}) · "
                f"Past Participle: {meta['past_participle']} ({meta['romanization']['past_participle']})"
            )
            # Compact overview first
            render_forms_summary("present", conj['present'], form_occurrence_index)
            render_forms_summary("subjunctive", conj['subjunctive'], form_occurrence_index)

            cols = st.columns(2)
            with cols[0]:
                st.write("present")
                for k in ['1sg','2sg','3sg','1pl','2pl','3pl']:
                    ps, rom = conj['present'][k]
                    # Use precomputed index for speed
                    occ = form_occurrence_index.get(normalize_pashto_char(ps), {'count': 0, 'verses': []})
                    st.text(f"{ps}  ({rom}) — {occ['count']} hits")
                    if occ['verses']:
                        with st.expander("Show verses"):
                            for vref in sorted(set(occ['verses'])):
                                display_verse_with_audio(vref, ps, bible_text)
            with cols[1]:
                st.write("subjunctive")
                for k in ['1sg','2sg','3sg','1pl','2pl','3pl']:
                    ps, rom = conj['subjunctive'][k]
                    occ = form_occurrence_index.get(normalize_pashto_char(ps), {'count': 0, 'verses': []})
                    st.text(f"{ps}  ({rom}) — {occ['count']} hits")
                    if occ['verses']:
                        with st.expander("Show verses"):
                            for vref in sorted(set(occ['verses'])):
                                display_verse_with_audio(vref, ps, bible_text)

        # If user entered the infinitive itself, show extended past tables
        if query == root_word and conj:
            st.subheader("Past (continuous)")
            for k in ['1sg','2sg','3sg_m','3sg_f','1pl','2pl','3pl']:
                ps, rom = conj['continuous_past'][k]
                occ = form_occurrence_index.get(normalize_pashto_char(ps), {'count': 0, 'verses': []})
                st.text(f"{ps}  ({rom}) — {occ['count']} hits")
                if occ['verses']:
                    with st.expander(f"{ps} verses"):
                        for vref in sorted(set(occ['verses'])):
                            display_verse_with_audio(vref, ps, bible_text)
            st.subheader("Past (simple)")
            for k in ['1sg','2sg','3sg_m','3sg_f','1pl','2pl','3pl']:
                ps, rom = conj['simple_past'][k]
                occ = form_occurrence_index.get(normalize_pashto_char(ps), {'count': 0, 'verses': []})
                st.text(f"{ps}  ({rom}) — {occ['count']} hits")
                if occ['verses']:
                    with st.expander(f"{ps} verses"):
                        for vref in sorted(set(occ['verses'])):
                            display_verse_with_audio(vref, ps, bible_text)

# --- Main Application ---
st.title("Pashto Bible Smart Search")

# Tabs: Search | Lexicon (comprehensive lists)
tabs = st.tabs(["Search", "Lexicon"])

with tabs[0]:
    grammatical_index = load_data()
    bible_text = load_bible_text()

    if grammatical_index is None: st.stop()

    form_to_root_map = create_form_to_root_map(grammatical_index)
    form_occurrence_index = build_form_occurrence_index(grammatical_index)

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
    search_query = st.text_input("Enter a Pashto word, phrase, or verse reference:", "", key="main_search")

    if search_query:
        st.markdown("---")
        normalized_query = normalize_pashto_char(search_query.strip())

        if is_verse_reference(normalized_query):
            handle_verse_search(normalized_query, bible_text)
        elif " " in normalized_query:
            handle_phrase_search(normalized_query, bible_text)
        else:
            handle_grammatical_search(normalized_query, form_to_root_map, grammatical_index, bible_text)
    else:
        st.info("Enter a word, phrase (e.g., زما ګرانو), or verse (e.g., Galatians 4:19) to begin.")

with tabs[1]:
    st.subheader("Comprehensive Lists")
    sub = st.tabs(["Frequency (Bible)"])

    # Frequency view: use word_frequency_list.json, includes POS categories
    with sub[0]:
        # Prefer the prebuilt NT reference cache if available (faster and with ts)
        nt_ref = load_nt_reference_data()
        raw_freq_items = nt_ref if nt_ref else load_word_frequency_data()
        if not raw_freq_items:
            st.info("Word frequency list not available yet.")
        else:
            # Enrich frequency list with LingDocs POS and romanization
            freq_items = []
            for it in raw_freq_items:
                p = it.get('pashto', '')
                freq_items.append({
                    'pashto': p,
                    'frequency': it.get('frequency', it.get('count', 0)),
                    'romanization': it.get('romanization', it.get('f', '')) or dict_romanization_for(p),
                    'pos': normalize_pos_label((it.get('pos') or it.get('c') or '') or dict_pos_for(p) or 'unknown'),
                    'ts': it.get('ts', ''),
                    'english': it.get('english', it.get('e', '')) or dict_english_for(p),
                })

            pos_values = sorted({it.get('pos', 'unknown') for it in freq_items})
            tab_names = ["All"] + pos_values
            pos_tabs = st.tabs(tab_names)

            def render_freq_tab(selected_pos: str):
                text_q = st.text_input("Filter (Pashto/Romanization)", "", key=f"freq_filter_{selected_pos}")
                show_n = st.slider("How many to show", min_value=50, max_value=5000, value=1000, step=50, key=f"freq_n_{selected_pos}")
                group_by_lemma = st.checkbox("Group by lemma (if cache available)", value=False, key=f"freq_group_{selected_pos}")

                def match(it):
                    if selected_pos != 'All' and it.get('pos', 'unknown') != selected_pos:
                        return False
                    q = text_q.strip().lower()
                    if not q:
                        return True
                    return (
                        q in it.get('pashto', '') or
                        q in str(it.get('romanization', '')).lower()
                    )

                # Normalize punctuation and enrich romanization from dictionary
                cleaned_map = {}
                for r in (it for it in freq_items if match(it)):
                    pashto = (r.get('pashto', '') or '').replace('»', '').replace('›', '').strip()
                    freq = int(r.get('frequency', 0))
                    pos = r.get('pos', '')
                    rom = r.get('romanization', '') or dict_romanization_for(pashto)
                    if pashto not in cleaned_map:
                        cleaned_map[pashto] = {'pashto': pashto, 'romanization': rom, 'pos': pos, 'frequency': 0}
                    cleaned_map[pashto]['frequency'] += freq
                    if not cleaned_map[pashto]['romanization'] and rom:
                        cleaned_map[pashto]['romanization'] = rom
                    if cleaned_map[pashto]['pos'] == 'unknown' and pos:
                        cleaned_map[pashto]['pos'] = pos

                if group_by_lemma and load_form_to_lemma_map():
                    f2l = load_form_to_lemma_map()
                    lemma_agg = {}
                    for r in cleaned_map.values():
                        form = r['pashto']
                        key = f2l.get(form) or f2l.get(normalize_pashto_char(form)) or form
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
                    rows = sorted(cleaned_map.values(), key=lambda x: x['frequency'], reverse=True)[:show_n]
                    df = pd.DataFrame([
                        {
                            'Pashto': r['pashto'],
                            'Romanization': r['romanization'],
                            'POS': r['pos'],
                            'Frequency': r['frequency'],
                            'ts': r.get('ts', ''),
                            'English': r.get('english', ''),
                        }
                        for r in rows
                    ])
                if not rows:
                    st.info("No entries match the current filters.")
                else:
                    st.dataframe(df, use_container_width=True, hide_index=True)

                if rows:
                    if group_by_lemma and isinstance(rows[0], dict) and 'Lemma' in rows[0]:
                        lemma_pick = st.selectbox("Inspect lemma", options=[r['Lemma'] for r in rows], key=f"lemma_pick_{selected_pos}")
                        if lemma_pick:
                            forms = next((r['Forms'] for r in rows if r['Lemma'] == lemma_pick), [])
                            if forms:
                                st.markdown("Forms for selected lemma")
                                st.dataframe(pd.DataFrame(forms), use_container_width=True, hide_index=True)
                            if st.button("Search lemma", key=f"lemma_search_{selected_pos}"):
                                st.session_state['main_search'] = lemma_pick
                                st.rerun()
                    else:
                        pick = st.selectbox("Insert a word to search", options=[r.get('pashto', '') for r in rows], key=f"pick_{selected_pos}")
                        cols_actions = st.columns(2)
                        with cols_actions[0]:
                            if st.button("Search selected", key=f"search_{selected_pos}"):
                                st.session_state['main_search'] = pick
                                st.rerun()
                        with cols_actions[1]:
                            if st.button("View references", key=f"view_refs_{selected_pos}"):
                                norm_pick = normalize_pashto_char(pick)
                                occ = form_occurrence_index.get(norm_pick, {'count': 0, 'verses': []})
                                with st.modal(f"References for {pick} — {occ['count']} hits"):
                                    if not occ['verses']:
                                        st.info("No references found in the current index.")
                                    else:
                                        for vref in sorted(set(occ['verses'])):
                                            display_verse_with_audio(vref, pick, bible_text)

            for i, name in enumerate(tab_names):
                with pos_tabs[i]:
                    render_freq_tab(name)

    # Dictionary view: LingDocs full list (if available)
    # Removed the LingDocs dictionary tab per request
