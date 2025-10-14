import sys
import os
# Add the project root to the Python path to allow absolute imports from search_utils
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

import json
from search_utils import (
    normalize_pashto_char,
    create_form_to_root_map,
    search_grammatical_forms,
)
from . import engine_loader

FORM_TO_LEMMA_FILE = 'form_to_lemma.json'
FULL_DICTIONARY_FILE = 'full_dictionary_enriched.json'

def load_full_dictionary():
    with open(FULL_DICTIONARY_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def lookup_lexicon(query):
    dictionary = load_full_dictionary()
    results = []
    for entry in dictionary:
        if query in entry.get("word", ""):
            results.append(entry)
    return results

def handle_grammatical_search(query, scope):
    """
    Performs a smart search for a Pashto word, finding all its inflected
    and conjugated forms and their occurrences.
    """
    print(f"--- Smart Search Initiated ---")
    print(f"Query: '{query}', Scope: {scope}")

    verb_engine = engine_loader.get_verb_engine()
    noun_engine = engine_loader.get_noun_engine()
    form_occurrence_index = engine_loader.get_form_occurrence_index()
    form_to_root_map = engine_loader.get_form_to_root_map()

    normalized_query = normalize_pashto_char(query)
    print(f"Normalized Query: '{normalized_query}'")
    
    # 1. Find the root(s) for the query
    # This is a simplified root finding logic; can be expanded later
    possible_roots = form_to_root_map.get(normalized_query, [normalized_query])
    print(f"Possible Roots: {possible_roots}")
    root = possible_roots[0] # For now, just take the first candidate
    print(f"Selected Root: '{root}'")

    # 2. Get all forms for the found root
    all_forms = set([normalized_query])
    
    # Try verb conjugation
    verb_conjugations = verb_engine.conjugate_verb(root)
    if verb_conjugations and 'forms_map' in verb_conjugations:
        all_forms.update(verb_conjugations['forms_map'].keys())

    # Try noun inflection
    noun_inflections = noun_engine.inflect_noun(root)
    if noun_inflections and 'forms' in noun_inflections:
        for form_info in noun_inflections['forms'].values():
            if isinstance(form_info, (list, tuple)) and len(form_info) > 0:
                all_forms.add(form_info[0])
    
    print(f"All Forms to Search ({len(all_forms)}): {', '.join(list(all_forms)[:10])}...")

    # 3. Gather occurrences for all forms
    final_results = {}
    total_hits = 0
    for form in all_forms:
        norm_form = normalize_pashto_char(form)
        occurrences = form_occurrence_index.get(norm_form, {})
        
        if occurrences.get('verses'):
            verses = occurrences.get('verses', [])
            
            # 4. Filter by scope (NT/OT)
            if scope != "ALL":
                scoped_verses = []
                for verse in verses:
                    if (scope == "NT" and is_nt(verse)) or (scope == "OT" and not is_nt(verse)):
                        scoped_verses.append(verse)
                if not scoped_verses:
                    continue # Skip this form if it has no verses in the current scope
                occurrences['verses'] = scoped_verses

            final_results[form] = occurrences
            total_hits += occurrences.get('count', 0)

    # 5. Structure the response
    # For now, returning a flat list of verses from all found forms.
    # Can be enhanced to group by form later.
    
    aggregated_verses = []
    for form, data in final_results.items():
        for verse in data.get('verses', []):
            if verse not in aggregated_verses:
                 aggregated_verses.append(verse)

    print(f"Found {len(aggregated_verses)} unique verses.")
    print(f"--- Smart Search Finished ---")
    return aggregated_verses

def is_nt(verse_ref):
    book = verse_ref.split(" ")[0]
    nt_books = [
        'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
        'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
        '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
        '1 John', '2 John', '3 John', 'Jude', 'Revelation'
    ]
    return book in nt_books

def search():
    pass

def simple_search(query: str, texts: dict) -> list:
    results = []
    for ref, text in texts.items():
        if query in text:
            results.append(ref)
    return results
