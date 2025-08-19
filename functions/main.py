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
# The library automatically handles initialization when deployed to a Google environment,
# but we initialize it explicitly here to be safe.
firebase_admin.initialize_app()

# --- Utility Functions ---
def _normalize_pashto_char(s: str) -> str:
    """Standardize common Pashto character variations."""
    try:
        return s.replace('ی', 'ي').replace('ک', 'ګ')
    except Exception:
        return s

def _format_book_name(raw: str) -> str:
    """Turn stored book key like '1chronicles' or 'john' into a human label like '1 Chronicles' or 'John'."""
    try:
        if not raw:
            return raw
        b = raw.strip()
        if not b:
            return b
        b = b.lower()
        if b[0].isdigit():
            # e.g. "1chronicles" -> "1 Chronicles"
            return f"{b[0]} {b[1:].title()}"
        return b.title()
    except Exception:
        return raw

def _ref_from_doc(doc: firestore.DocumentSnapshot) -> str:
    """Best-effort to derive a canonical ref string 'Book C:V' from a Firestore verse doc."""
    try:
        data = doc.to_dict() or {}
        if 'ref' in data and isinstance(data['ref'], str) and data['ref']:
            return data['ref']
        book = data.get('book')
        chapter = data.get('chapter')
        verse = data.get('verse')
        if book and chapter and verse:
            return f"{_format_book_name(str(book))} {int(chapter)}:{int(verse)}"
        # Fallback from ID like '1CHRONICLES-1-10'
        parts = (doc.id or '').split('-')
        if len(parts) >= 3:
            book_part = parts[0]
            chap_part = parts[1]
            verse_part = parts[2]
            return f"{_format_book_name(book_part)} {int(chap_part)}:{int(verse_part)}"
    except Exception:
        pass
    return doc.id or ""

# --- API Endpoints ---

@https_fn.on_request(cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"]))
def search_phrase(req: https_fn.Request) -> https_fn.Response:
    """
    Performs a simple substring search across all Bible verses.
    Accepts JSON body: { "query": "...", "scope": "all|nt|ot", "limit": 200 }
    """
    db = firestore.client() # Initialize Firestore client within the function
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

    # Note: Firestore doesn't support native substring search.
    # A more scalable solution would use a dedicated search service like Algolia or Typesense.
    # For this project, we will iterate, which is slow but functional for a demo.
    
    verses_ref = db.collection('verses')
    results = []
    
    # This is inefficient and will be slow. We will address this later.
    for doc in verses_ref.stream():
        data = doc.to_dict() or {}
        text = data.get('text', '')
        if query in text:
            results.append({
                "ref": _ref_from_doc(doc),
                "text": text,
            })
            if len(results) >= limit:
                break
    
    # Coverage calculation would also require iterating all verses, which is too slow.
    # We will omit it for this Firestore-based version.

    ms = (time.time() - start_time) * 1000
    return https_fn.Response(
        json.dumps({"results": results, "coverage": [], "ms": ms}),
        headers={"Content-Type": "application/json"}
    )


@https_fn.on_request(cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"]))
def search_grammar(req: https_fn.Request) -> https_fn.Response:
    """
    Performs a grammatical search by finding the root of a word,
    generating all its forms, and finding occurrences.
    """
    db = firestore.client() # Initialize Firestore client within the function
    # --- LAZY IMPORTS ---
    # Import heavy libraries inside the function to speed up cold starts.
    from verb_inflector import conjugate_verb, find_lexicon_root_for_form, romanization_for_form_fast
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

    # 1. Find the root of the queried word from the 'inflections' collection
    inflection_ref = db.collection('inflections').document(query)
    inflection_doc = inflection_ref.get()
    
    root_word = query # Default to the query itself if no root is found
    if inflection_doc.exists:
        root_data = inflection_doc.to_dict()
        if root_data and 'value' in root_data:
            root_word = root_data['value']

    # This is a placeholder for a more advanced implementation.
    # The ideal approach uses an inverted index, which we will build later.
    # For now, we perform a simple substring search on the root word to demonstrate the flow.
    verses_ref = db.collection('verses')
    occurrences = []
    for doc in verses_ref.stream():
        data = doc.to_dict() or {}
        text = data.get('text', '')
        if root_word in text:
            occurrences.append({
                "ref": _ref_from_doc(doc),
                "text": text,
            })
            if len(occurrences) >= limit:
                break

    # 4. Get conjugations/inflections
    conjugations = None
    try:
        # We need to decide whether the root is a verb or a noun.
        # This requires checking our lexicon collections.
        is_verb = db.collection('verbs').document(root_word).get().exists
        is_noun = db.collection('nouns').document(root_word).get().exists

        tables = None
        if is_verb:
            tables = conjugate_verb(root_word)
        elif is_noun:
            tables = inflect_noun(root_word)
        
        if tables:
            conjugations = {
                "root": root_word,
                "kind": "verb" if is_verb else "noun",
                "tables": tables,
                "query_rom": romanization_for_form_fast(query)
            }
    except Exception as e:
        # Log the error for debugging, but don't crash the function
        print(f"Error during inflection: {e}")
        pass

    ms = (time.time() - start_time) * 1000
    return https_fn.Response(
        json.dumps({
            "occurrences": occurrences,
            "coverage": [],
            "conjugations": conjugations,
            "ms": ms
        }),
        headers={"Content-Type": "application/json"}
    )
