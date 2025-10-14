from collections import defaultdict
from typing import Dict, List, Tuple, Iterable

# --- Unicode Normalization ---
def normalize_pashto_char(text: str) -> str:
    """Normalize Pashto characters to a canonical form."""
    replacements = {'ي': 'ی', 'ى': 'ی', 'ئ': 'ی'}
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

# --- Minimal Lexicons (excerpt from lingdocs/pashto-inflector) ---
# These lexicons provide sample data to characterize words. In a full
# application these would be populated with comprehensive entries.
VERB_LEXICON: Dict[str, Dict[str, Dict[str, str]]] = {
    'بوتلل': {
        'type': 'Verb',
        'pattern_info': 'Irregular Verb',
        'stems': {'imperfective': 'بیای', 'perfective': 'بوځ', 'past_participle': 'بوتللی'},
    },
    'رسول': {
        'type': 'Verb',
        'pattern_info': 'Transitive Verb (to deliver/send)',
        'stems': {'imperfective': 'رسو', 'perfective': 'ورسو', 'past_participle': 'رسولی'},
    },
    'پوهول': {
        'type': 'Verb',
        'pattern_info': 'Causative Verb (to make understand)',
        'stems': {'imperfective': 'پوهو', 'perfective': 'وپوهو', 'past_participle': 'پوهولی'},
    },
}

IRREGULAR_NOUN_ADJ_LEXICON: Dict[str, Dict[str, object]] = {
    'پښتون': {
        'type': 'Noun/Adj',
        'pattern_info': 'Pattern 4: Pashtoon',
        'inflected_forms': ['پښتانه', 'پښتنو', 'پښتنه', 'پښتنې'],
    }
}

# --- Grammar Characterization Engine ---
def find_all_possible_roots(word: str, all_words_set: Iterable[str]) -> List[Tuple[str, Dict[str, str]]]:
    """Find possible roots and grammatical interpretations for a word.

    This logic mirrors the behaviour of the Pashto inflector library and
    the index generation script used in this repository.
    """
    interpretations: List[Tuple[str, Dict[str, str]]] = []

    # 1. Verb analysis
    for root, details in VERB_LEXICON.items():
        if word == root:
            interpretations.append((root, {
                'type': 'Verb',
                'pattern_info': details['pattern_info'],
                'form_description': 'Infinitive Root',
            }))
        for stem_type, stem_form in details['stems'].items():
            if word.startswith(stem_form):
                desc = f"Conjugation from {stem_type} stem '{stem_form}'"
                interpretations.append((root, {
                    'type': 'Verb',
                    'pattern_info': details['pattern_info'],
                    'form_description': desc,
                }))

    # 2. Noun/Adj analysis
    for root, details in IRREGULAR_NOUN_ADJ_LEXICON.items():
        if word == root:
            interpretations.append((root, {
                'type': 'Noun/Adj',
                'pattern_info': details['pattern_info'],
                'form_description': 'Base Form (Masc. Plain)',
            }))
        elif word in details['inflected_forms']:
            desc = f"Inflection of '{root}'"
            interpretations.append((root, {
                'type': 'Noun/Adj',
                'pattern_info': details['pattern_info'],
                'form_description': desc,
            }))

    # 3. Regular noun/adj analysis (simple plural rule)
    plural_endings = ["ان", "انو"]
    for ending in plural_endings:
        if word.endswith(ending):
            possible_root = word[:-len(ending)]
            if possible_root in all_words_set:
                desc = f"Inflection of '{possible_root}'"
                interpretations.append((possible_root, {
                    'type': 'Noun/Adj',
                    'pattern_info': 'Regular Noun/Adj',
                    'form_description': desc,
                }))

    # Fallback: word exists but no interpretation
    if not interpretations and word in all_words_set:
        interpretations.append((word, {
            'type': 'Unknown',
            'pattern_info': 'N/A',
            'form_description': 'Base Form',
        }))

    # Remove duplicate interpretations
    unique: List[Tuple[str, Dict[str, str]]] = []
    seen = set()
    for root, det in interpretations:
        key = (root, det['type'], det['form_description'])
        if key not in seen:
            unique.append((root, det))
            seen.add(key)
    return unique

# --- Public API ---
def search_word_forms(word: str, form_to_root_map: Dict[str, List[str]]) -> List[str]:
    """Search for possible root words of a given form."""
    normalized = normalize_pashto_char(word)
    search_key = normalized.replace(" ", "_")
    return form_to_root_map.get(search_key, [])


def characterize_word(word: str, all_words: Iterable[str]) -> List[Tuple[str, Dict[str, str]]]:
    """Return grammatical characterizations for ``word``.

    Parameters
    ----------
    word: str
        Pashto word to analyze.
    all_words: Iterable[str]
        Collection of all known words for fallback recognition.
    """
    normalized = normalize_pashto_char(word)
    return find_all_possible_roots(normalized, all_words)


