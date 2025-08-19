# Welcome to Cloud Functions for Firebase for Python!
import firebase_admin
from firebase_admin import firestore
from firebase_functions import https_fn, options
import json
import time
import re

# --- Initialize Firebase Admin SDK ---
firebase_admin.initialize_app()

# --- Constants and Configuration ---
NT_BOOKS = {"Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"}
OT_BOOKS = {"Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"}

cors_options = options.CorsOptions(
    cors_origins=["https://pashto-bible-search.vercel.app", "*"],
    cors_methods=["get", "post", "options"],
)

# --- Utility Functions ---
def _normalize_pashto_char(s: str) -> str:
    return s.replace('ی', 'ي').replace('ک', 'ګ') if isinstance(s, str) else s

def _format_book_name(raw: str) -> str:
    try:
        b = raw.strip().lower()
        if not b: return raw
        if b[0].isdigit():
            return f"{b[0]} {b[1:].title()}"
        return b.title()
    except Exception:
        return raw

def _get_book_from_ref(ref_str: str) -> str:
    """Extracts the book name from a reference string like '1 Chronicles 1:5'."""
    match = re.match(r'^(\d\s)?[a-zA-Z\s]+', ref_str)
    return match.group(0).strip() if match else ""

def _ref_from_doc(doc: firestore.DocumentSnapshot) -> str:
    try:
        data = doc.to_dict() or {}
        if 'ref' in data and data['ref']: return data['ref']
        # Fallback for older data formats
        book, chapter, verse = data.get('book'), data.get('chapter'), data.get('verse')
        if book and chapter and verse:
            return f"{_format_book_name(str(book))} {int(chapter)}:{int(verse)}"
        parts = (doc.id or '').split('-')
        if len(parts) >= 3:
            return f"{_format_book_name(parts[0])} {int(parts[1])}:{int(parts[2])}"
    except Exception:
        pass
    return doc.id or ""

def _flatten_inflection_tables(tables):
    """Turns a dictionary of inflection tables into a flat set of unique words."""
    unique_forms = set()
    if not isinstance(tables, dict):
        return list(unique_forms)
    
    for section, content in tables.items():
        if isinstance(content, dict):
            for _, value in content.items():
                if isinstance(value, str):
                    unique_forms.update(p.strip() for p in value.split(','))
                elif isinstance(value, list):
                    for item in value:
                        if isinstance(item, str):
                            unique_forms.update(p.strip() for p in item.split(','))
        elif isinstance(content, str):
            unique_forms.update(p.strip() for p in content.split(','))
            
    return [form for form in unique_forms if form]


# --- API Endpoints ---
@https_fn.on_request(cors=cors_options)
def get_audio_map(req: https_fn.Request) -> https_fn.Response:
    db = firestore.client()
    try:
        docs = db.collection('audio_map').stream()
        audio_map = {doc.id: doc.to_dict().get('fileName', '') for doc in docs}
        return https_fn.Response(json.dumps(audio_map), headers={"Content-Type": "application/json"})
    except Exception as e:
        return https_fn.Response(f"Failed to fetch audio map: {e}", status=500)

@https_fn.on_request(cors=cors_options)
def search_phrase(req: https_fn.Request) -> https_fn.Response:
    db = firestore.client()
    start_time = time.time()
    try:
