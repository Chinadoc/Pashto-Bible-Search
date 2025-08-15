
import os
import json
from . import verb_inflector
from . import noun_inflector

# --- Constants ---
# Calculate the absolute path to the project's root directory
# __file__ is the path to the current file (engine_loader.py)
# os.path.dirname(__file__) is the directory it's in (backend/services)
# The '..' parts navigate up to the project root.
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

VERBS_LEXICON_FILE = os.path.join(PROJECT_ROOT, 'verbs_lexicon.json')
NOUNS_LEXICON_FILE = os.path.join(PROJECT_ROOT, 'nouns_lexicon.json')
IRREGULAR_VERBS_FILE = os.path.join(PROJECT_ROOT, 'irregular_verbs.json')
FULL_DICTIONARY_FILE = os.path.join(PROJECT_ROOT, 'full_dictionary_enriched.json')
GRAMMATICAL_INDEX_FILE = os.path.join(PROJECT_ROOT, 'all_txt_copies/grammatical_index_v15.json')
FORM_OCCURRENCE_FILE = os.path.join(PROJECT_ROOT, 'form_occurrence_index.json')
OT_FORM_OCCURRENCE_FILE = os.path.join(PROJECT_ROOT, 'ot_form_occurrence_index.json')
FORM_TO_ROOT_FILE = os.path.join(PROJECT_ROOT, 'form_to_root_map.json')

# --- In-Memory Cache ---
_verb_engine = None
_noun_engine = None
_full_dictionary = None
_grammatical_index = None
_form_occurrence_index = None
_form_to_root_map = None

# --- Loader Functions ---

def _load_json(file_path):
    """Safely load a JSON file."""
    try:
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
    return None

def get_verb_engine():
    """Get a singleton instance of the verb_inflector module."""
    global _verb_engine
    if _verb_engine is None:
        _verb_engine = verb_inflector
    return _verb_engine

def get_noun_engine():
    """Get a singleton instance of the noun_inflector module."""
    global _noun_engine
    if _noun_engine is None:
        _noun_engine = noun_inflector
    return _noun_engine

def get_full_dictionary():
    """Load and cache the full dictionary."""
    global _full_dictionary
    if _full_dictionary is None:
        _full_dictionary = _load_json(FULL_DICTIONARY_FILE) or []
    return _full_dictionary

def get_grammatical_index():
    """Load and cache the grammatical index."""
    global _grammatical_index
    if _grammatical_index is None:
        _grammatical_index = _load_json(GRAMMATICAL_INDEX_FILE) or {}
    return _grammatical_index

def get_form_occurrence_index():
    """Load and cache the form occurrence index, merging NT and OT."""
    global _form_occurrence_index
    if _form_occurrence_index is None:
        print("Loading form occurrence indices (NT and OT)...")
        nt_index = _load_json(FORM_OCCURRENCE_FILE) or {}
        ot_index = _load_json(OT_FORM_OCCURRENCE_FILE) or {}
        
        # Start with a copy of the NT index
        merged_index = nt_index.copy()
        
        # Merge the OT index into it
        for form, ot_data in ot_index.items():
            if form in merged_index:
                # If form exists, merge verse lists and update count
                existing_verses = set(merged_index[form].get('verses', []))
                new_verses = set(ot_data.get('verses', []))
                combined_verses = list(existing_verses.union(new_verses))
                
                merged_index[form]['verses'] = combined_verses
                merged_index[form]['count'] = len(combined_verses)
            else:
                # If form is new, just add it from the OT index
                merged_index[form] = ot_data
        
        _form_occurrence_index = merged_index
        print(f"Total forms in merged occurrence index: {len(_form_occurrence_index)}")
    return _form_occurrence_index

def get_form_to_root_map():
    """Load and cache the form-to-root map."""
    global _form_to_root_map
    if _form_to_root_map is None:
        _form_to_root_map = _load_json(FORM_TO_ROOT_FILE) or {}
    return _form_to_root_map

def load_all():
    """Load all engines and data into memory. To be called at startup."""
    print("Loading search engines and data...")
    get_verb_engine()
    get_noun_engine()
    get_full_dictionary()
    get_grammatical_index()
    get_form_occurrence_index()
    get_form_to_root_map()
    print("All engines and data loaded.")
