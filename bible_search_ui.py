import streamlit as st
import json
import re
import os
import requests
from collections import defaultdict

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
GOOGLE_DRIVE_URL_PREFIX = "https://drive.google.com/uc?export=download&id="

# --- (ACTION REQUIRED) Audio File Mapping ---
# You need to fill this dictionary with your Google Drive file IDs.
# Format: "bookchapter_verse_number.mp3": "google_drive_file_id"
# Example: "matthew1_verse_1.mp3": "1aBcDeFgHiJkLmNoPqRsTuVwXyZ"
AUDIO_FILE_MAP_PATH = os.path.join(APP_ROOT, 'audio_file_map.json')
with open(AUDIO_FILE_MAP_PATH, 'r', encoding='utf-8') as af:
    AUDIO_FILE_MAP = json.load(af)

st.set_page_config(layout="wide")

@st.cache_data
def get_audio_bytes(url):
    """Downloads the audio file and returns its content as bytes."""
    try:
        response = requests.get(url)
        response.raise_for_status()  # Will raise an HTTPError for bad responses
        return response.content
    except requests.exceptions.RequestException as e:
        st.error(f"Error fetching audio: {e}")
        return None

@st.cache_data
def load_data():
    try:
        with open(INDEX_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        st.error(f"FATAL: The index file '{INDEX_FILE}' was not found.")
        return None

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
        audio_bytes = get_audio_bytes(audio_url)
        if audio_bytes:
            st.audio(audio_bytes, format='audio/mp3')
            st.markdown(f"[Download Audio]({audio_url})")
    else:
        st.caption("No audio file found for this verse.")
    st.markdown("---")

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
    search_key = query.replace(" ", "_")
    root_words = form_to_root_map.get(search_key)

    if not root_words:
        st.error(f"The word '{query}' was not found in any form.")
        return

    for root_word in root_words:
        root_data = grammatical_index.get(root_word, {})
        root_translit = root_data.get('identities', [{}])[0].get('translit', '')
        st.header(f"Grammatical Results for Root: `{format_for_display(root_word)}` ({root_translit})")
        
        for identity in root_data.get('identities', []):
            word_type = identity.get('type', 'N/A')
            pattern = identity.get('pattern_info', 'N/A')
            
            st.subheader(f"As a {word_type}")
            st.info(f"Grammar Pattern: **{pattern}**")

            all_forms_with_desc = []
            for desc, items in identity['forms'].items():
                for item in items:
                    all_forms_with_desc.append({'description': desc, **item})

            sorted_forms = sorted(all_forms_with_desc, key=lambda x: x['count'], reverse=True)
            
            for item in sorted_forms:
                form_display = format_for_display(item['form'])
                translit = item.get('translit', '')
                expander_title = f"**{item['description']}**: `{form_display}` ({translit}) - (Frequency: {item['count']})"
                with st.expander(expander_title):
                    for verse_ref in sorted(set(item['verses'])):
                        display_verse_with_audio(verse_ref, item['form'], bible_text)

# --- Main Application ---
st.title("Pashto Bible Smart Search")

grammatical_index = load_data()
bible_text = load_bible_text()

if grammatical_index is None: st.stop()

form_to_root_map = create_form_to_root_map(grammatical_index)

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
