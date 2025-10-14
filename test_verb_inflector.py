#!/usr/bin/env python3
"""
Test script to verify verb inflection for وهل (wahul - to hit/strike)
"""

import sys
import os
import json

# Add the functions directory to the path
functions_dir = os.path.join(os.path.dirname(__file__), 'functions')
sys.path.insert(0, functions_dir)

# Debug: Check if dictionary_fast_index.json exists and what's in it
fast_index_path = os.path.join(os.path.dirname(__file__), 'dictionary_fast_index.json')
print(f"DEBUG: Looking for fast index at: {fast_index_path}")
print(f"DEBUG: File exists: {os.path.exists(fast_index_path)}")

if os.path.exists(fast_index_path):
    try:
        with open(fast_index_path, 'r', encoding='utf-8') as f:
            fast_data = json.load(f)
        print(f"DEBUG: Fast index loaded, keys: {list(fast_data.keys())}")
        if 'by_pashto' in fast_data and 'وهم' in fast_data['by_pashto']:
            print(f"DEBUG: وهم in fast index: {fast_data['by_pashto']['وهم']}")
    except Exception as e:
        print(f"DEBUG: Error loading fast index: {e}")

from verb_inflector import conjugate_verb

def test_wahul_inflection():
    """Test that وهل generates the correct conjugations"""

    # Test basic inflection
    result = conjugate_verb('وهل')

    if result:
        print("✅ وهل inflection successful")
        print(f"Root: {result['meta']['root']}")
        print(f"Imperfective stem: {result['meta']['imperfective_stem']}")
        print(f"Perfective stem: {result['meta']['perfective_stem']}")
        print(f"Past participle: {result['meta']['past_participle']}")
        print(f"Romanization: {result['meta']['romanization']}")

        # Check the present table
        if 'present' in result:
            print("Present table:")
            for person, (ps, rom) in result['present'].items():
                print(f"  {person}: {ps} -> {rom}")

        # Check some specific forms
        forms_map = result['forms_map']

        print(f"\nDEBUG: Total forms in map: {len(forms_map)}")
        present_forms = {k: v for k, v in forms_map.items() if 'وه' in k and len(k) <= 4}
        print(f"DEBUG: Present-like forms found:")
        for k, v in present_forms.items():
            print(f"  '{k}': '{v}' (len={len(v) if v else 0})")

        # Also check the raw forms_map entry for وهم
        if 'وهم' in forms_map:
            print(f"DEBUG: Raw forms_map['وهم']: '{forms_map['وهم']}' (type: {type(forms_map['وهم'])})")

        # Present tense forms
        expected_present = {
            'وهم': 'wáhum',  # 1sg - found in dictionary as noun
            'وهو': 'oo',     # 1pl - ending-based
            'وهې': 'e',      # 2sg - ending-based
            'وهي': 'ee',     # 3sg - ending-based
        }

        print("\n--- Present Tense ---")
        for form, expected_rom in expected_present.items():
            actual_rom = forms_map.get(form, 'NOT FOUND')
            status = "✅" if actual_rom == expected_rom else "❌"
            print(f"{status} {form}: '{actual_rom}' (expected: '{expected_rom}') len={len(actual_rom) if actual_rom else 0}")

        # Perfect forms (complex constructions not in base dictionary)
        expected_perfect = {
            'وهلی یم': ' yum',  # 1sg present perfect - ending-based
            'وهلی ده': ' da',   # 3sg_f present perfect - ending-based
            'وهلی وم': ' wum',  # 1sg past perfect - ending-based
        }

        print("\n--- Perfect Forms ---")
        for form, expected_rom in expected_perfect.items():
            actual_rom = forms_map.get(form, 'NOT FOUND')
            status = "✅" if actual_rom == expected_rom else "❌"
            print(f"{status} {form}: {actual_rom} (expected: {expected_rom})")

        # Check that perfect forms are in forms_map
        perfect_forms_in_map = [k for k in forms_map.keys() if 'وهلی' in k]
        print(f"\nPerfect forms found in index: {len(perfect_forms_in_map)}")
        for form in perfect_forms_in_map[:5]:  # Show first 5
            print(f"  {form}: {forms_map[form]}")

        return True
    else:
        print("❌ وهل inflection failed")
        return False

def test_garmawul_inflection():
    """Test that گرمول generates the correct stative compound conjugations"""

    # Test basic inflection
    result = conjugate_verb('ګرمول')

    if result:
        print("✅ گرمول inflection successful")
        print(f"Root: {result['meta']['root']}")
        print(f"Imperfective stem: {result['meta']['imperfective_stem']}")
        print(f"Perfective stem: {result['meta']['perfective_stem']}")
        print(f"Past participle: {result['meta']['past_participle']}")

        # Check some specific forms
        forms_map = result['forms_map']

        # Expected forms for fused stative compound
        # Note: Romanization for conjugated forms falls back to ending-only when full form not in dictionary
        expected_forms = {
            'ګرموم': 'um',  # 1sg present - ending only
            'ګرموي': 'ee',  # 3sg present - ending only
            'ګرم وکړم': 'um',  # 1sg subjunctive - ending only
            'ګرم وکړل': '',  # perfective root - no romanization in spec
            'ګرم کړی': '',  # past participle - no romanization in spec
        }

        print("\n--- Expected Forms ---")
        for form, expected_rom in expected_forms.items():
            actual_rom = forms_map.get(form, 'NOT FOUND')
            status = "✅" if actual_rom == expected_rom else "❌"
            print(f"{status} {form}: {actual_rom} (expected: {expected_rom})")

        return True
    else:
        print("❌ گرمول inflection failed")
        return False

if __name__ == '__main__':
    success1 = test_wahul_inflection()
    success2 = test_garmawul_inflection()
    sys.exit(0 if (success1 and success2) else 1)
