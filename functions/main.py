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
def get_lexicon_entry(req: https_fn.Request) -> https_fn.Response:
    """Fetches a lexicon entry for a given word."""
    db = firestore.client()
    try:
        word = req.args.get("word", "").strip()
        if not word:
            return https_fn.Response("Missing 'word' query parameter.", status=400)

        lexicon_ref = db.collection('lexicon').document(word)
        lexicon_doc = lexicon_ref.get()

        if lexicon_doc.exists:
            return https_fn.Response(
                json.dumps(lexicon_doc.to_dict()),
                headers={"Content-Type": "application/json"}
            )
        else:
            # Try a normalized version as a fallback
            normalized_word = _normalize_pashto_char(word)
            lexicon_ref = db.collection('lexicon').document(normalized_word)
            lexicon_doc = lexicon_ref.get()
            if lexicon_doc.exists:
                return https_fn.Response(
                    json.dumps(lexicon_doc.to_dict()),
                    headers={"Content-Type": "application/json"}
                )

            return https_fn.Response(
                json.dumps({"error": "Entry not found"}),
                status=404,
                headers={"Content-Type": "application/json"}
            )
    except Exception as e:
        print(f"Error fetching lexicon entry: {e}")
        return https_fn.Response("Failed to fetch lexicon entry.", status=500)


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
        params = req.get_json()
        query = params.get("query", "").strip()
        scope = params.get("scope", "all").lower()
        limit = int(params.get("limit", 200))
    except Exception:
        return https_fn.Response("Invalid request format.", status=400)

    if not query:
        return https_fn.Response("Query cannot be empty.", status=400)

    results = []
    # This is inefficient and should be replaced with a proper search index for production use.
    # For now, we iterate and filter in the function.
    for doc in db.collection('verses').stream():
        data = doc.to_dict() or {}
        text = data.get('text', '')
        ref = _ref_from_doc(doc)
        
        book = _get_book_from_ref(ref)
        if scope == 'nt' and book not in NT_BOOKS: continue
        if scope == 'ot' and book not in OT_BOOKS: continue

        if query in text:
            results.append({"ref": ref, "text": text})
            if len(results) >= limit: break
    
    ms = (time.time() - start_time) * 1000
    return https_fn.Response(json.dumps({"results": results, "coverage": [], "ms": ms}), headers={"Content-Type": "application/json"})

@https_fn.on_request(cors=cors_options)
def search_grammar(req: https_fn.Request) -> https_fn.Response:
    db = firestore.client()
    # Lazy import heavy libraries to speed up cold starts
    from verb_inflector import conjugate_verb, romanization_for_form_fast
    from noun_inflector import inflect_noun

    start_time = time.time()
    try:
        params = req.get_json()
        query = _normalize_pashto_char(params.get("query", "").strip())
        scope = params.get("scope", "all").lower()
        limit = int(params.get("limit", 500))
    except Exception:
        return https_fn.Response("Invalid request format.", status=400)

    if not query:
        return https_fn.Response("Query cannot be empty.", status=400)

    inflection_ref = db.collection('inflections').document(query)
    root_word = query
    if inflection_ref.get().exists:
        root_data = inflection_ref.get().to_dict()
        if root_data and 'value' in root_data:
            root_word = root_data['value']

    conjugations = None
    highlight_terms = [query, root_word]
    try:
        is_verb = db.collection('verbs').document(root_word).get().exists
        is_noun = db.collection('nouns').document(root_word).get().exists
        tables = conjugate_verb(root_word) if is_verb else inflect_noun(root_word) if is_noun else None
        if tables:
            conjugations = {"root": root_word, "kind": "verb" if is_verb else "noun", "tables": tables, "query_rom": romanization_for_form_fast(query)}
            highlight_terms.extend(_flatten_inflection_tables(tables))
    except Exception as e:
        print(f"Error during inflection: {e}")

    # Use a set for efficient lookup and to remove duplicates
    highlight_terms = list(set(term for term in highlight_terms if term))

    occurrences = []
    # Inefficient iteration: see note in search_phrase
    for doc in db.collection('verses').stream():
        data = doc.to_dict() or {}
        text = data.get('text', '')
        ref = _ref
