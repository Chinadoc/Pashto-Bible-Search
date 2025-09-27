#!/usr/bin/env python3
"""
Comprehensive testing script for 100 random words to validate:
1. Morphological analysis accuracy
2. Search functionality
3. Data consistency between systems
4. Verb inflector accuracy where applicable
"""

import sys
import os
import json
import random
from typing import Dict, List, Set, Tuple, Any
from collections import defaultdict

# Add functions directory to path
functions_dir = os.path.join(os.path.dirname(__file__), 'functions')
sys.path.insert(0, functions_dir)

try:
    from verb_inflector import conjugate_verb
except ImportError:
    print("Warning: verb_inflector not available")
    conjugate_verb = None

def load_grammatical_index() -> Dict[str, Any]:
    """Load the grammatical index"""
    index_path = os.path.join(os.path.dirname(__file__), 'grammatical_index_v15.json')
    with open(index_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def load_dictionary_data() -> Dict[str, Any]:
    """Load dictionary data for validation"""
    try:
        dict_path = os.path.join(os.path.dirname(__file__), 'full_dictionary_enriched.json')
        with open(dict_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return {}

def get_random_words(grammatical_index: Dict[str, Any], count: int = 100) -> List[str]:
    """Get random words from the grammatical index"""
    words = list(grammatical_index.keys())
    return random.sample(words, min(count, len(words)))

def analyze_morphological_consistency(word: str, grammatical_data: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze morphological consistency for a word"""
    results = {
        'word': word,
        'has_data': word in grammatical_data,
        'identities_count': 0,
        'total_forms': 0,
        'forms_with_counts': 0,
        'forms_with_verses': 0,
        'consistency_issues': [],
        'analysis': {}
    }

    if not results['has_data']:
        return results

    word_data = grammatical_data[word]
    identities = word_data.get('identities', [])

    results['identities_count'] = len(identities)
    results['analysis'] = {
        'types': [identity.get('type', 'Unknown') for identity in identities],
        'pattern_infos': [identity.get('pattern_info', 'N/A') for identity in identities]
    }

    # Analyze forms
    for identity in identities:
        forms = identity.get('forms', {})
        for form_type, form_list in forms.items():
            results['total_forms'] += len(form_list)

            for form_data in form_list:
                if isinstance(form_data, dict):
                    if 'count' in form_data:
                        results['forms_with_counts'] += 1
                    if 'verses' in form_data and form_data['verses']:
                        results['forms_with_verses'] += 1

    # Check for consistency issues
    if results['total_forms'] == 0:
        results['consistency_issues'].append("No forms found")

    if results['forms_with_counts'] == 0 and results['total_forms'] > 0:
        results['consistency_issues'].append("Forms exist but no frequency counts")

    if results['forms_with_verses'] == 0 and results['forms_with_counts'] > 0:
        results['consistency_issues'].append("Forms have counts but no verse references")

    return results

def test_verb_inflection(word: str) -> Dict[str, Any]:
    """Test verb inflection if applicable"""
    results = {
        'word': word,
        'is_verb': False,
        'conjugation_success': False,
        'forms_count': 0,
        'errors': []
    }

    if not conjugate_verb:
        results['errors'].append("Verb inflector not available")
        return results

    try:
        conjugation = conjugate_verb(word)
        if conjugation:
            results['is_verb'] = True
            results['conjugation_success'] = True
            results['forms_count'] = len(conjugation.get('forms_map', {}))

            # Check for basic expected forms
            forms_map = conjugation.get('forms_map', {})
            if not forms_map:
                results['errors'].append("No forms generated")

        else:
            results['errors'].append("Conjugation returned None")

    except Exception as e:
        results['errors'].append(f"Conjugation error: {str(e)}")

    return results

def test_search_functionality(word: str, grammatical_data: Dict[str, Any]) -> Dict[str, Any]:
    """Test search functionality for the word"""
    results = {
        'word': word,
        'search_data_available': False,
        'total_occurrences': 0,
        'unique_verses': 0,
        'books_covered': set(),
        'search_issues': []
    }

    if word not in grammatical_data:
        results['search_issues'].append("Word not in grammatical index")
        return results

    word_data = grammatical_data[word]
    all_verses = set()

    for identity in word_data.get('identities', []):
        for form_type, form_list in identity.get('forms', {}).items():
            for form_data in form_list:
                if isinstance(form_data, dict):
                    results['search_data_available'] = True

                    # Count occurrences
                    count = form_data.get('count', 0)
                    results['total_occurrences'] += count

                    # Collect unique verses
                    verses = form_data.get('verses', [])
                    if verses:
                        all_verses.update(verses)
                        # Extract book names
                        for verse in verses:
                            book = verse.split()[0] if verse else ""
                            if book:
                                results['books_covered'].add(book)

    results['unique_verses'] = len(all_verses)
    results['books_covered'] = len(results['books_covered'])

    if results['total_occurrences'] == 0:
        results['search_issues'].append("No occurrence counts found")

    if results['unique_verses'] == 0:
        results['search_issues'].append("No verse references found")

    return results

def validate_data_consistency(word: str, grammatical_data: Dict[str, Any], dictionary_data: Dict[str, Any]) -> Dict[str, Any]:
    """Validate consistency between different data sources"""
    results = {
        'word': word,
        'in_grammatical_index': word in grammatical_data,
        'in_dictionary': False,
        'consistency_issues': [],
        'cross_references': {}
    }

    # Check dictionary data
    if dictionary_data:
        results['in_dictionary'] = word in dictionary_data
        if results['in_dictionary']:
            dict_entry = dictionary_data[word]
            gram_entry = grammatical_data.get(word, {})

            # Compare POS tags if both have them
            gram_types = set()
            if word in grammatical_data:
                for identity in grammatical_data[word].get('identities', []):
                    gram_types.add(identity.get('type', 'Unknown'))

            dict_pos = dict_entry.get('pos', '').lower() if isinstance(dict_entry, dict) else ''
            if dict_pos and gram_types:
                gram_pos_set = {t.lower() for t in gram_types}
                if dict_pos not in gram_pos_set:
                    results['consistency_issues'].append(f"POS mismatch: Dict='{dict_pos}', Grammar={gram_pos_set}")

    # Check for cross-consistency within grammatical data
    if results['in_grammatical_index']:
        word_data = grammatical_data[word]
        identities = word_data.get('identities', [])

        if len(identities) > 1:
            # Multiple identities - check if they're compatible
            types = [id.get('type', 'Unknown') for id in identities]
            if len(set(types)) > 1:
                results['cross_references']['multiple_types'] = types

        # Check form consistency
        total_forms = 0
        forms_with_data = 0

        for identity in identities:
            for form_list in identity.get('forms', {}).values():
                total_forms += len(form_list)
                for form_data in form_list:
                    if isinstance(form_data, dict) and ('count' in form_data or 'verses' in form_data):
                        forms_with_data += 1

        if total_forms > 0 and forms_with_data == 0:
            results['consistency_issues'].append("Forms exist but none have count or verse data")

    return results

def run_comprehensive_tests():
    """Run comprehensive tests on 100 random words"""
    print("🔍 Running Comprehensive Word Testing (100 words)")
    print("=" * 80)

    # Load data
    grammatical_index = load_grammatical_index()
    dictionary_data = load_dictionary_data()

    print(f"Loaded {len(grammatical_index)} words from grammatical index")
    print(f"Loaded {len(dictionary_data)} entries from dictionary")
    print()

    # Get test words
    test_words = get_random_words(grammatical_index, 100)
    print(f"Testing {len(test_words)} random words")
    print()

    # Test results
    results = {
        'total_words': len(test_words),
        'morphology_tests': [],
        'verb_tests': [],
        'search_tests': [],
        'consistency_tests': [],
        'summary': {
            'words_with_morphology': 0,
            'words_with_search_data': 0,
            'words_with_consistency_issues': 0,
            'verbs_successfully_inflected': 0,
            'total_occurrences_found': 0,
            'total_unique_verses': 0
        }
    }

    for i, word in enumerate(test_words, 1):
        print(f"{i:3d}. Testing: {word}")

        # 1. Morphological Analysis Test
        morph_result = analyze_morphological_consistency(word, grammatical_index)
        results['morphology_tests'].append(morph_result)

        if morph_result['has_data']:
            results['summary']['words_with_morphology'] += 1

        # 2. Verb Inflection Test (if applicable)
        verb_result = test_verb_inflection(word)
        results['verb_tests'].append(verb_result)

        if verb_result['conjugation_success']:
            results['summary']['verbs_successfully_inflected'] += 1

        # 3. Search Functionality Test
        search_result = test_search_functionality(word, grammatical_index)
        results['search_tests'].append(search_result)

        if search_result['search_data_available']:
            results['summary']['words_with_search_data'] += 1
            results['summary']['total_occurrences_found'] += search_result['total_occurrences']
            results['summary']['total_unique_verses'] += search_result['unique_verses']

        # 4. Data Consistency Test
        consistency_result = validate_data_consistency(word, grammatical_index, dictionary_data)
        results['consistency_tests'].append(consistency_result)

        if consistency_result['consistency_issues']:
            results['summary']['words_with_consistency_issues'] += 1

        # Print issues for this word
        issues = []
        if morph_result['consistency_issues']:
            issues.extend([f"Morph: {issue}" for issue in morph_result['consistency_issues']])
        if verb_result['errors']:
            issues.extend([f"Verb: {error}" for error in verb_result['errors']])
        if search_result['search_issues']:
            issues.extend([f"Search: {issue}" for issue in search_result['search_issues']])
        if consistency_result['consistency_issues']:
            issues.extend([f"Consistency: {issue}" for issue in consistency_result['consistency_issues']])

        if issues:
            print("    ⚠️  Issues found:")
            for issue in issues[:3]:  # Show first 3
                print(f"        - {issue}")
            if len(issues) > 3:
                print(f"        ... and {len(issues) - 3} more")

        # Show some stats
        if search_result['search_data_available']:
            print(f"    📊 {search_result['total_occurrences']} occurrences in {search_result['unique_verses']} verses")

        if verb_result['conjugation_success']:
            print(f"    🔤 {verb_result['forms_count']} verb forms generated")

        print()

    # Generate summary
    print("=" * 80)
    print("📈 COMPREHENSIVE TEST SUMMARY")
    print("=" * 80)

    summary = results['summary']

    print(f"Words tested: {results['total_words']}")
    print(f"Words with morphology data: {summary['words_with_morphology']} ({summary['words_with_morphology']/results['total_words']*100:.1f}%)")
    print(f"Words with search data: {summary['words_with_search_data']} ({summary['words_with_search_data']/results['total_words']*100:.1f}%)")
    print(f"Words with consistency issues: {summary['words_with_consistency_issues']} ({summary['words_with_consistency_issues']/results['total_words']*100:.1f}%)")
    print(f"Verbs successfully inflected: {summary['verbs_successfully_inflected']}")

    if summary['total_occurrences_found'] > 0:
        print(f"Total occurrences found: {summary['total_occurrences_found']:,}")
        print(f"Total unique verses: {summary['total_unique_verses']:,}")

    # Analyze common issues
    all_issues = []
    for test_set in ['morphology_tests', 'verb_tests', 'search_tests', 'consistency_tests']:
        for result in results[test_set]:
            if test_set == 'morphology_tests':
                all_issues.extend(result.get('consistency_issues', []))
            elif test_set == 'verb_tests':
                all_issues.extend(result.get('errors', []))
            elif test_set == 'search_tests':
                all_issues.extend(result.get('search_issues', []))
            elif test_set == 'consistency_tests':
                all_issues.extend(result.get('consistency_issues', []))

    if all_issues:
        issue_counts = defaultdict(int)
        for issue in all_issues:
            issue_counts[issue] += 1

        print("\n🔍 MOST COMMON ISSUES:")
        sorted_issues = sorted(issue_counts.items(), key=lambda x: x[1], reverse=True)
        for issue, count in sorted_issues[:5]:
            print(f"  {count:3d}x: {issue}")

    # Overall assessment
    success_rate = (results['total_words'] - summary['words_with_consistency_issues']) / results['total_words'] * 100
    print(f"\n✅ Overall success rate: {success_rate:.1f}%")

    if success_rate > 90:
        print("🎉 EXCELLENT: System is working very well!")
    elif success_rate > 75:
        print("👍 GOOD: System is working well with minor issues.")
    elif success_rate > 50:
        print("⚠️  FAIR: System has some issues that should be addressed.")
    else:
        print("❌ POOR: System has significant issues requiring attention.")

    return results

if __name__ == '__main__':
    run_comprehensive_tests()
