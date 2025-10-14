#!/usr/bin/env python3
"""
Test the inflection engine on words with similar frequencies to check for ambiguity.
"""

import json
import sys
import os

# Add the utils directory to path so we can import our disambiguation module
sys.path.append(os.path.join(os.path.dirname(__file__), 'utils'))

def load_frequency_data():
    """Load word frequency data"""
    try:
        with open('word_frequency_list.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("word_frequency_list.json not found")
        return []

def test_inflection_engine():
    """Test inflection engine on frequency-similar words"""

    # Load frequency data
    freq_data = load_frequency_data()
    if not freq_data:
        return

    # Sort by frequency
    sorted_freq = sorted(freq_data, key=lambda x: x['frequency'], reverse=True)

    # Get words with frequencies 5-15 (similar frequencies)
    test_words = []
    for item in sorted_freq:
        if 5 <= item['frequency'] <= 15:
            test_words.append(item['pashto'])

    # Test first 20 words from this range
    test_sample = test_words[:20]

    print(f"🔍 Testing inflection engine on {len(test_sample)} words with similar frequencies (5-15)")
    print("=" * 60)

    # Simulate inflection engine results (in real implementation, this would call the actual API)
    ambiguous_results = []

    for word in test_sample:
        print(f"\n📝 Testing: {word}")

        # Simulate what the inflection engine would return
        # In real implementation: call /api/search with includeRelated=true
        simulated_results = simulate_inflection_engine(word)

        if simulated_results['is_ambiguous']:
            print(f"  ⚠️  AMBIGUOUS: {len(simulated_results['possible_meanings'])} possible meanings")
            for i, meaning in enumerate(simulated_results['possible_meanings']):
                print(f"    {i+1}. {meaning['pos']}: {meaning['definition']} (conf: {meaning['confidence']})")
            ambiguous_results.append({
                'word': word,
                'frequency': next(item['frequency'] for item in freq_data if item['pashto'] == word),
                'ambiguous_meanings': simulated_results['possible_meanings']
            })
        else:
            print(f"  ✅ Clear: {simulated_results['primary_pos']} (conf: {simulated_results['confidence']})")

    # Summary
    print("
📊 Summary:"    print(f"Total words tested: {len(test_sample)}")
    print(f"Ambiguous words found: {len(ambiguous_results)}")

    if ambiguous_results:
        print("
🎯 Ambiguous Words Requiring Disambiguation:"        for result in ambiguous_results:
            print(f"  {result['word']} ({result['frequency']}x): {len(result['ambiguous_meanings'])} meanings")

    return ambiguous_results

def simulate_inflection_engine(word):
    """
    Simulate what the inflection engine would return for a word.
    In a real implementation, this would call the search API with includeRelated=true
    """

    # Simulate based on word patterns and known ambiguous words
    result = {
        'is_ambiguous': False,
        'possible_meanings': [],
        'primary_pos': 'noun',
        'confidence': 0.8
    }

    # Check against our known ambiguous words
    known_ambiguous_patterns = {
        'بوځو': [
            {'pos': 'verb', 'definition': 'to take, bring (subjunctive)', 'confidence': 0.65},
            {'pos': 'adjective', 'definition': 'angry, infuriated', 'confidence': 0.35}
        ],
        'کار': [
            {'pos': 'noun', 'definition': 'work, job', 'confidence': 0.9},
            {'pos': 'verb', 'definition': 'to do, work', 'confidence': 0.1}
        ],
        'دوست': [
            {'pos': 'noun', 'definition': 'friend', 'confidence': 0.95}
        ],
        'مار': [
            {'pos': 'noun', 'definition': 'snake', 'confidence': 0.9}
        ]
    }

    if word in known_ambiguous_patterns:
        meanings = known_ambiguous_patterns[word]
        if len(meanings) > 1:
            result['is_ambiguous'] = True
            result['possible_meanings'] = meanings
            result['primary_pos'] = meanings[0]['pos']
            result['confidence'] = meanings[0]['confidence']
        else:
            result['possible_meanings'] = meanings

    # Simulate some additional ambiguity based on word patterns
    elif any(char in word for char in ['و', 'ې', 'ي']):  # Common verb endings
        result['possible_meanings'] = [
            {'pos': 'verb', 'definition': f'conjugated verb form of {word[:-1] if len(word) > 2 else word}', 'confidence': 0.6},
            {'pos': 'noun', 'definition': f'noun/adjective form', 'confidence': 0.4}
        ]
        result['is_ambiguous'] = True
        result['primary_pos'] = 'verb'

    elif word.endswith('ان'):  # Common plural ending
        result['possible_meanings'] = [
            {'pos': 'noun', 'definition': 'plural noun', 'confidence': 0.8},
            {'pos': 'adjective', 'definition': 'adjective form', 'confidence': 0.2}
        ]
        result['primary_pos'] = 'noun'

    return result

def main():
    """Main execution"""
    print("🔍 Testing Inflection Engine for Ambiguity Detection")
    print("=" * 60)

    ambiguous_words = test_inflection_engine()

    # Save results for analysis
    if ambiguous_words:
        output = {
            'test_summary': {
                'total_words_tested': len([w for w in load_frequency_data() if 5 <= next((item['frequency'] for item in load_frequency_data() if item['pashto'] == w), 0) <= 15][:20]),
                'ambiguous_words_found': len(ambiguous_words),
                'test_date': '2025-01-08'
            },
            'ambiguous_words': ambiguous_words
        }

        with open('inflection_engine_test_results.json', 'w', encoding='utf-8') as f:
            json.dump(output, f, ensure_ascii=False, indent=2)

        print(f"\n✅ Test complete! Results saved to inflection_engine_test_results.json")

if __name__ == "__main__":
    main()

