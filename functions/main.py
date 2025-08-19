# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_admin import firestore
from firebase_functions import https_fn, options
import firebase_admin
import flask
import json
import time

# --- Initialize Firebase Admin SDK ---
firebase_admin.initialize_app()

# --- CORS Configuration ---
# Allow requests from the Vercel app and any other origin (*)
cors_options = options.CorsOptions(
    cors_origins=["https://pashto-bible-search.vercel.app", "*"],
    cors_methods=["get", "post", "options"],
)

# --- Utility Functions ---
def _normalize_pashto_char(s: str) -> str:
    """Standardize common Pashto character variations."""
    try:
        return s.replace('ی', 'ي').replace('ک', 'ګ')
    except Exception:
        return s

def _format_book_name(raw: str) -> str:
    """Turn '1chronicles' into '1 Chronicles'."""
    try:
        if not raw: return raw
        b = raw.strip().lower()
        if b[0].isdigit():
            return f"{b[0]} {b[1:].title()}"
        return b.title()
    except Exception:
        return raw

def _ref_from_doc(doc: firestore.DocumentSnapshot) -> str:
    """Derive a canonical ref string 'Book C:V' from a Firestore verse doc."""
    try:
        data = doc.to_dict() or {}
        if 'ref' in data and data['ref']: return data['ref']
        book, chapter, verse = data.get('book'), data.get('chapter'), data.get('verse')
        if book and chapter and verse:
            return f"{_format_book_name(str(book))} {int(chapter)}:{int(verse)}"
        parts = (doc.id or '').split('-')
        if len(parts) >= 3:
            return f"{_format_book_name(parts[0])} {int(parts[1])}:{int(parts[2])}"
    except Exception:
        pass
    return doc.id or ""

# --- API Endpoints ---

@https_fn.on_request(cors=cors_options)
def get_audio_map(req: https_fn.Request) -> https_fn.Response:
    """Fetches the entire audio map from the 'audio_map' collection."""
    db = firestore.client()
    try:
        docs = db.collection('audio_map').stream()
        audio_map = {doc.id: doc.to_dict().get('fileName', '') for doc in docs}
        return https_fn.Response(json.dumps(audio_map), headers={"Content-Type": "application/json"})
    except Exception as e:
        print(f"Error fetching audio map: {e}")
        return https_fn.Response("Failed to fetch audio map.", status=500)

@https_fn.on_request(cors=cors_options)
def search_phrase(req: https_fn.Request) -> https_fn.Response:
    """Performs a simple substring search across all Bible verses."""
    db = firestore.client()
    start_time = time.time()
    
    try:
        params = req.get_json()
        query = params.get("query", "").strip()
        limit = int(params.get("limit", 200))
    except Exception:
        return https_fn.Response("Invalid request format.", status=400)

    if not query:
        return https_fn.Response("Query cannot be empty.", status=400)

    verses_ref = db.collection('verses')
    results = []
    
    for doc in verses_ref.stream():
        data = doc.to_dict() or {}
        text = data.get('text', '')
        if query in text:
            results.append({"ref": _ref_from_doc(doc), "text": text})
            if len(results) >= limit: break
    
    ms = (time.time() - start_time) * 1000
    return https_fn.Response(json.dumps({"results": results, "coverage": [], "ms": ms}), headers={"Content-Type": "application/json"})

@https_fn.on_request(cors=cors_options)
def search_grammar(req: https_fn.Request) -> https_fn.Response:
    """Performs a grammatical search."""
    db = firestore.client()
    from verb_inflector import conjugate_verb, romanization_for_form_fast
    from noun_inflector import inflect_noun

    start_time = time.time()
    
    try:
        params = req.get_json()
        query = _normalize_pashto_char(params.get("query", "").strip())
        limit = int(params.get("limit", 500))
    except Exception:
        return https_fn.Response("Invalid request format.", status=400)

    if not query:
        return https_fn.Response("Query cannot be empty.", status=400)

    inflection_ref = db.collection('inflections').document(query)
    inflection_doc = inflection_ref.get()
    
    root_word = query
    if inflection_doc.exists:
        root_data = inflection_doc.to_dict()
        if root_data and 'value' in root_data:
            root_word = root_data['value']

    verses_ref = db.collection('verses')
    occurrences = []
    for doc in verses_ref.stream():
        data = doc.to_dict() or {}
        text = data.get('text', '')
        if root_word in text:
            occurrences.append({"ref": _ref_from_doc(doc), "text": text})
            if len(occurrences) >= limit: break

    conjugations = None
    try:
        is_verb = db.collection('verbs').document(root_word).get().exists
        is_noun = db.collection('nouns').document(root_word).get().exists
        tables = conjugate_verb(root_word) if is_verb else inflect_noun(root_word) if is_noun else None
        if tables:
            conjugations = {
                "root": root_word,
                "kind": "verb" if is_verb else "noun",
                "tables": tables,
                "query_rom": romanization_for_form_fast(query)
            }
    except Exception as e:
        print(f"Error during inflection: {e}")

    ms = (time.time() - start_time) * 1000
    return https_fn.Response(json.dumps({
        "occurrences": occurrences,
        "coverage": [],
        "conjugations": conjugations,
        "ms": ms
    }), headers={"Content-Type": "application/json"})
