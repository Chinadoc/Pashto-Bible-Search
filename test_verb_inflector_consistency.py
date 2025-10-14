#!/usr/bin/env python3
"""
Test script to verify consistency between verb_inflector.py generated forms
and the grammatical_index_v15.json data
"""

import sys
import os
import json
from typing import Dict, Set, Tuple, List

# Add the functions directory to the path
functions_dir = os.path.join(os.path.dirname(__file__), 'functions')
sys.path.insert(0, functions_dir)

from verb_inflector import conjugate_verb

def load_grammatical_index() -> Dict:
    """Load the grammatical index"""
    index_path = os.path.join(os.path.dirname(__file__), 'grammatical_index_v15.json')
    with open(index_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def load_verb_roots(count: int = 100) -> List[str]:
    """Load verb roots from the lexicon"""
    lexicon_path = os.path.join(os.path.dirname(__file__), 'verbs_lexicon.json')
    with open(lexicon_path, 'r', encoding='utf-8') as f:
        verbs_lexicon = json.load(f)

    return list(verbs_lexicon.keys())[:count]

def find_forms_in_index(grammatical_index: Dict, forms_map: Dict[str, str]) -> Dict[str, Dict]:
    """Find which forms from forms_map exist in the grammatical index"""
    found_in_index = {}
    not_found_in_index = {}

    for form, romanization in forms_map.items():
        found = False
        for entry in grammatical_index.values():
            if not isinstance(entry, dict):
                continue
            identities = entry.get('identities', [])
            for identity in identities:
                if not isinstance(identity, dict):
                    continue
                forms = identity.get('forms', {})
                if isinstance(forms, dict):
                    for form_type, form_list in forms.items():
                        if isinstance(form_list, list):
                            for form_info in form_list:
                                if isinstance(form_info, dict) and form_info.get('form') == form:
                                    found = True
                                    break
                        if found:
                            break
                if found:
                    break
            if found:
                found_in_index[form] = {'romanization': romanization, 'found': True}
                break

        if not found:
            not_found_in_index[form] = {'romanization': romanization, 'found': False}

    return found_in_index, not_found_in_index

def main():
    print("🔍 Testing verb inflector consistency with grammatical index...")
    print("=" * 80)

    # Load data
    grammatical_index = load_grammatical_index()
    verb_roots = load_verb_roots(100)

    print(f"Loaded {len(grammatical_index)} entries from grammatical index")
    print(f"Testing {len(verb_roots)} verb roots")
    print()

    results = {
        'total_verbs': 0,
        'successful_inflections': 0,
        'total_forms_generated': 0,
        'forms_found_in_index': 0,
        'forms_not_found_in_index': 0,
        'verbs_with_discrepancies': 0,
        'discrepancy_details': []
    }

    for i, root in enumerate(verb_roots):
        results['total_verbs'] += 1
        print(f"{i+1:3d}. Testing: {root}")

        # Try to conjugate the verb
        try:
            conjugation = conjugate_verb(root)
            if conjugation:
                results['successful_inflections'] += 1
                forms_map = conjugation.get('forms_map', {})

                if forms_map:
                    results['total_forms_generated'] += len(forms_map)

                    # Check which forms exist in the grammatical index
                    found, not_found = find_forms_in_index(grammatical_index, forms_map)

                    found_count = len(found)
                    not_found_count = len(not_found)

                    results['forms_found_in_index'] += found_count
                    results['forms_not_found_in_index'] += not_found_count

                    print(f"    ✅ Generated {len(forms_map)} forms")
                    print(f"    📊 Index matches: {found_count}, Missing: {not_found_count}")

                    if not_found_count > 0:
                        results['verbs_with_discrepancies'] += 1
                        print("    ⚠️  Missing forms:")
                        for form in list(not_found.keys())[:5]:  # Show first 5
                            print(f"        {form} ({not_found[form]['romanization']})")
                        if not_found_count > 5:
                            print(f"        ... and {not_found_count - 5} more")

                        results['discrepancy_details'].append({
                            'verb': root,
                            'missing_forms': list(not_found.keys())[:10]  # Keep first 10 for report
                        })
                else:
                    print("    ⚠️  No forms generated")
            else:
                print("    ❌ Conjugation failed")
        except Exception as e:
            print(f"    ❌ Error: {e}")

        print()

    # Summary
    print("=" * 80)
    print("📈 SUMMARY")
    print("=" * 80)
    print(f"Total verbs tested: {results['total_verbs']}")
    print(f"Successful inflections: {results['successful_inflections']}")
    print(f"Total forms generated: {results['total_forms_generated']}")
    print(f"Forms found in index: {results['forms_found_in_index']}")
    print(f"Forms NOT found in index: {results['forms_not_found_in_index']}")
    print(f"Verbs with discrepancies: {results['verbs_with_discrepancies']}")

    success_rate = (results['forms_found_in_index'] / results['total_forms_generated'] * 100) if results['total_forms_generated'] > 0 else 0
    print(f"Index coverage rate: {success_rate:.1f}%")

    print()
    print("🔍 ANALYSIS")
    print("=" * 80)

    if results['verbs_with_discrepancies'] > 0:
        print(f"❌ Found discrepancies in {results['verbs_with_discrepancies']} verbs")
        print("\nTop verbs with missing forms:")

        # Sort by number of missing forms
        sorted_discrepancies = sorted(
            results['discrepancy_details'],
            key=lambda x: len(x['missing_forms']),
            reverse=True
        )

        for i, detail in enumerate(sorted_discrepancies[:10]):
            print(f"{i+1}. {detail['verb']}: {len(detail['missing_forms'])} missing forms")
            for form in detail['missing_forms'][:3]:
                print(f"   - {form}")
            if len(detail['missing_forms']) > 3:
                print(f"   ... and {len(detail['missing_forms']) - 3} more")
    else:
        print("✅ No discrepancies found! All generated forms match the grammatical index.")

    if results['total_forms_generated'] - results['forms_found_in_index'] > 0:
        print(f"\n⚠️  {results['total_forms_generated'] - results['forms_found_in_index']} forms ({success_rate:.1f}%) are missing from the grammatical index")
        print("This could indicate:")
        print("- The grammatical index is incomplete")
        print("- The verb inflector is generating incorrect forms")
        print("- There are differences in normalization/spelling")
    else:
        print("✅ Perfect match! All generated forms are present in the grammatical index.")

if __name__ == '__main__':
    main()
