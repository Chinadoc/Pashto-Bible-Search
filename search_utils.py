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


def get_form_occurrences(root_word: str, form_ps: str, grammatical_index: Dict[str, Any]) -> Dict[str, Any]:
    """Lookup occurrences (verses, count) for a specific Pashto form under a given root.

    Returns {'count': int, 'verses': List[str]} or {'count': 0, 'verses': []}.
    """
    root_data = grammatical_index.get(root_word, {})
    target = normalize_pashto_char(form_ps).replace(" ", "_")
    for identity in root_data.get('identities', []):
        for items_list in identity.get('forms', {}).values():
            for item in items_list:
                if normalize_pashto_char(item.get('form', '')) == target:
                    return {
                        'count': int(item.get('count', 0)),
                        'verses': list(item.get('verses', [])),
                    }
    return {'count': 0, 'verses': []}


def get_form_occurrences_any(
    form_ps: str,
    form_to_root_map: Dict[str, List[str]],
    grammatical_index: Dict[str, Any],
) -> Dict[str, Any]:
    """Lookup occurrences for a form across all roots that contain it.

    Aggregates counts and verses over all candidate roots from form_to_root_map.
    This is resilient against index inconsistencies where a form may be stored
    under a different root than expected.
    """
    norm = normalize_pashto_char(form_ps)
    # form_to_root_map was built using normalize_pashto_char(item['form'])
    candidate_roots = set(form_to_root_map.get(norm, []))
    total_count = 0
    verses: List[str] = []

    def matches(a: str, b: str) -> bool:
        a1 = normalize_pashto_char(a)
        b1 = normalize_pashto_char(b)
        if a1 == b1:
            return True
        # also try replacing spaces/underscores equivalently
        a2 = a1.replace(' ', '_')
        b2 = b1.replace(' ', '_')
        return a2 == b2

    for root in candidate_roots:
        root_data = grammatical_index.get(root, {})
        for identity in root_data.get('identities', []):
            for items_list in identity.get('forms', {}).values():
                for item in items_list:
                    if matches(item.get('form', ''), form_ps):
                        total_count += int(item.get('count', 0))
                        verses.extend(item.get('verses', []))

    return {'count': total_count, 'verses': verses}


def build_form_occurrence_index(grammatical_index: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
    """Precompute a map of normalized form -> {'count': int, 'verses': List[str]} aggregated across roots.

    This makes per-form lookup O(1) and dramatically speeds up UI rendering.
    """
    aggregate: Dict[str, Dict[str, Any]] = {}

    def add(form: str, count: int, verses: List[str]):
        # Normalize to Pashto form (spaces, not underscores) for key
        form_ps = form.replace('_', ' ')
        key = normalize_pashto_char(form_ps)
        if key not in aggregate:
            aggregate[key] = {'count': 0, 'verses': []}
        aggregate[key]['count'] += int(count)
        aggregate[key]['verses'].extend(verses)

    for root_data in grammatical_index.values():
        for identity in root_data.get('identities', []):
            for items_list in identity.get('forms', {}).values():
                for item in items_list:
                    add(item.get('form', ''), item.get('count', 0), item.get('verses', []))

    return aggregate

