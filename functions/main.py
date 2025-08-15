# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from flask import Flask, request, jsonify
from firebase_admin import firestore
import firebase_admin
import json
import time

# --- Local Imports (for Cloud Run) ---
from verb_inflector import conjugate_verb, romanization_for_form_fast
from noun_inflector import inflect_noun

# --- Initialize Firebase Admin SDK ---
firebase_admin.initialize_app()

# --- Initialize Flask App ---
app = Flask(__name__)

# --- Utility Functions ---
def _normalize_pashto_char(s: str) -> str:
    """Standardize common Pashto character variations."""
    try:
        return s.replace('ی', 'ي').replace('ک', 'ګ')
    except Exception:
        return s

# --- API Endpoints ---

@app.route('/search_phrase', methods=['POST'])
def search_phrase():
    db = firestore.client()
    start_time = time.time()
    try:
        params = request.get_json()
        query = params.get("query", "").strip()
        limit = int(params.get("limit", 200))
    except Exception:
        return jsonify({"error": "Invalid request format."}), 400
    if not query:
        return jsonify({"error": "Query cannot be empty."}), 400
    
    verses_ref = db.collection('verses')
    results = []
    for doc in verses_ref.stream():
        verse = doc.to_dict()
        if query in verse.get('text', ''):
            results.append(verse)
            if len(results) >= limit:
                break
    
    ms = (time.time() - start_time) * 1000
    return jsonify({"results": results, "coverage": [], "ms": ms})


@app.route('/search_grammar', methods=['POST'])
def search_grammar():
    db = firestore.client()
    start_time = time.time()
    try:
        params = request.get_json()
        query = _normalize_pashto_char(params.get("query", "").strip())
        limit = int(params.get("limit", 500))
    except Exception:
        return jsonify({"error": "Invalid request format."}), 400
    if not query:
        return jsonify({"error": "Query cannot be empty."}), 400

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
        verse = doc.to_dict()
        verse['ref'] = doc.id
        if root_word in verse.get('text', ''):
            occurrences.append(verse)
            if len(occurrences) >= limit:
                break

    conjugations = None
    try:
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
        print(f"Error during inflection: {e}")
        pass

    ms = (time.time() - start_time) * 1000
    return jsonify({
        "occurrences": occurrences,
        "coverage": [],
        "conjugations": conjugations,
        "ms": ms
    })

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)