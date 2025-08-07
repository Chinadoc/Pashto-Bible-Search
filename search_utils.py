"""Utility functions for searching Pashto Bible text and grammar index."""
from collections import defaultdict
from typing import Dict, List, Any


def normalize_pashto_char(text: str) -> str:
    """Normalize variant Pashto characters to a canonical form."""
    replacements = {'ي': 'ی', 'ى': 'ی', 'ئ': 'ی'}
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def create_form_to_root_map(grammatical_index: Dict[str, Any]) -> Dict[str, List[str]]:
    """Create mapping from a word form to its possible roots."""
    form_map: Dict[str, List[str]] = defaultdict(list)
    for root, data in grammatical_index.items():
        for identity in data.get('identities', []):
            for items_list in identity.get('forms', {}).values():
                for item in items_list:
                    normalized_form = normalize_pashto_char(item['form'])
                    if root not in form_map[normalized_form]:
                        form_map[normalized_form].append(root)
    return form_map


def search_grammatical_forms(
    word: str,
    form_to_root_map: Dict[str, List[str]],
    grammatical_index: Dict[str, Any],
) -> List[Dict[str, Any]]:
    """Return grammar details for a normalized word form.

    Each result contains the root, word type, pattern information, and
    occurrences of the specific form.
    """
    search_key = normalize_pashto_char(word).replace(" ", "_")
    root_words = form_to_root_map.get(search_key, [])
    results: List[Dict[str, Any]] = []

    for root in root_words:
        root_data = grammatical_index.get(root, {})
        for identity in root_data.get('identities', []):
            for desc, items in identity.get('forms', {}).items():
                for item in items:
                    if normalize_pashto_char(item['form']) == search_key:
                        raw_type = identity.get('type') or ''
                        pattern_info = identity.get('pattern_info', '') or ''
                        inferred_type = raw_type
                        if not inferred_type or inferred_type == 'N/A':
                            if 'Verb' in pattern_info:
                                inferred_type = 'Verb'
                            elif ('Noun' in pattern_info) or ('Adj' in pattern_info):
                                inferred_type = 'Noun/Adj'
                            else:
                                inferred_type = 'Unknown'
                        results.append(
                            {
                                'root': root,
                                'type': inferred_type,
                                'pattern': identity.get('pattern_info', 'N/A'),
                                'description': desc,
                                'form': item.get('form', ''),
                                'translit': item.get('translit', ''),
                                'verses': item.get('verses', []),
                                'count': item.get('count', 0),
                            }
                        )
    return results

