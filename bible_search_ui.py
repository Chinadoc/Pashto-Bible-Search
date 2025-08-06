import streamlit as st
import json
import re
import os
from collections import defaultdict

# --- Unicode Normalization ---
def normalize_pashto_char(text):
    replacements = {'ي': 'ی', 'ى': 'ی', 'ئ': 'ی'}
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

# --- Configuration & Data Loading ---
DATA_DIR = 'all_txt_copies'
INDEX_FILE = os.path.join(DATA_DIR, 'grammatical_index_v15.json')
AUDIO_BASE_DIR = os.path.dirname(os.path.abspath(__file__))

st.set_page_config(layout="wide")

@st.cache_data
def load_data():
    try:
        with open(INDEX_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        st.error(f"FATAL: The index file '{INDEX_FILE}' was not found. Please run the final indexing script.")
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

def find_audio_file(verse_ref):
    try:
        match = re.match(r'([a-zA-Z\s]+)\s(\d+):(\d+)', verse_ref)
        if not match: return None
        book, chapter, verse = match.groups()
        audio_folder = f"pashto{book.lower().replace(' ', '')}{chapter}"
        audio_filename = f"{book.lower().replace(' ', '')}{chapter}_verse_{verse}.mp3"
        full_path = os.path.join(AUDIO_BASE_DIR, audio_folder, audio_filename)
        return full_path if os.path.exists(full_path) else None
    except Exception:
        return None

def display_verse_with_audio(verse_ref, search_term, bible_text):
    full_verse = bible_text.get(verse_ref)
    if not full_verse:
        st.warning(f"Verse text for '{verse_ref}' not found.")
        return

    st.markdown(f"**{verse_ref}**: {highlight_verse(full_verse, search_term)}", unsafe_allow_html=True)
    
    audio_path = find_audio_file(verse_ref)
    if audio_path:
        try:
            with open(audio_path, 'rb') as audio_file: audio_bytes = audio_file.read()
            col1, col2 = st.columns([0.8, 0.2])
            with col1: st.audio(audio_bytes, format='audio/mp3')
            with col2: st.download_button(label="Download", data=audio_bytes, file_name=os.path.basename(audio_path), mime='audio/mp3', key=f"dl_{verse_ref.replace(':', '_')}_{search_term}")
        except Exception as e:
            st.error(f"Could not load audio for {verse_ref}: {e}")
    else:
        st.caption("No audio file found for this verse.")
    st.markdown("---")

# --- Smart Search Functions ---
def is_verse_reference(query):
    # Simple regex to check for patterns like "Book Chapter:Verse"
    return re.match(r'^[a-zA-Z\s]+\s\d+:\d+$', query.strip())

def handle_verse_search(query, bible_text):
    st.header(f"Verse Lookup: {query}")
    # Normalize the query to match bible_text keys format if necessary
    # (Assuming the format is already good)
    display_verse_with_audio(query, "", bible_text)

def handle_phrase_search(query, bible_text):
    st.header(f"Exact Phrase Search Results for: \"{query}\"")
    normalized_query = normalize_pashto_char(query)
    found_verses = []
    for verse_ref, text in bible_text.items():
        if normalized_query in text:
            found_verses.append(verse_ref)
    
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
