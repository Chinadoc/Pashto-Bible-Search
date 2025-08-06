import json
import re
from collections import defaultdict

# --- Configuration ---
COMPLEX_VERBS = {
    'بوتلل': {
        'type': 'Verb',
        'stems': {
            'imperfective': 'بیای',
            'perfective': 'بوځ',
            'past_participle': 'بوتللی'
        },
        'pattern_info': 'Irregular Verb (Multiple Stems)'
    },
}

def load_word_data(filepath='all_txt_copies/word_index_v4_compound.txt'):
    """Loads the flat word index into a dictionary."""
    word_data = {}
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            match = re.match(r'^(.*?) \((\d+)\): (.*)$', line.strip())
            if match:
                word, count, refs_str = match.groups()
                refs = refs_str.split(', ')
                word_data[word] = {'count': int(count), 'verses': refs}
    return word_data

def find_root_and_details_inclusive(word, all_words_set):
    """
    Inclusive grammar engine. Every word is guaranteed a place.
    It first assumes a word is its own root, then checks if it's part of a larger pattern.
    """
    # 1. Check for Complex Verb Conjugations
    for root, details in COMPLEX_VERBS.items():
        for stem_type, stem in details['stems'].items():
            if word.startswith(stem):
                return root, {
                    'type': 'Verb',
                    'pattern_info': details['pattern_info'],
                    'form_description': f"Conjugation from {stem_type} stem '{stem}'"
                }

    # 2. Check for Noun/Adjective Inflections
    if word.endswith(('ي', 'یو', 'یه')):
        potential_root_stem = re.sub(r'(ي|یو|یه)$', '', word)
        potential_root = potential_root_stem + 'ی'
        if potential_root in all_words_set:
            inf_type = "Unknown Inflection"
            if word.endswith('ي'): inf_type = "1st Inflection (Masc)"
            if word.endswith('یو'): inf_type = "2nd Inflection (Masc)"
            if word.endswith('یه'): inf_type = "Vocative (Masc)"
            return potential_root, {
                'type': 'Noun/Adj',
                'pattern_info': 'Pattern 2: Unstressed ی',
                'form_description': inf_type
            }
            
    # 3. Default Case: The word is its own root. This ensures nothing is ever dropped.
    return word, {
        'type': 'Noun/Adj',  # Default type
        'pattern_info': 'N/A',
        'form_description': 'Base Form'
    }

# --- Main Execution ---
word_data = load_word_data()
all_words_set = set(word_data.keys())

# A much simpler, more direct approach to building the index
final_index = defaultdict(lambda: {
    'type': 'Unknown',
    'pattern_info': 'N/A',
    'forms': defaultdict(list)
})

for word, data in word_data.items():
    root, details = find_root_and_details_inclusive(word, all_words_set)
    
    # Use the root's details for the main entry
    _, root_details = find_root_and_details_inclusive(root, all_words_set)
    final_index[root]['type'] = root_details['type']
    final_index[root]['pattern_info'] = root_details['pattern_info']
    
    # Add the current word's form data under its specific description
    final_index[root]['forms'][details['form_description']].append({
        'form': word,
        'count': data['count'],
        'verses': data['verses']
    })


# Save the new, high-fidelity index
output_path = 'all_txt_copies/grammatical_index_v5.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(final_index, f, ensure_ascii=False, indent=2)

print(f"New, inclusive grammatical index created at: {output_path}")

# Verification
if 'مېنځ' in final_index:
    print("\nSuccess! Found 'مېنځ' in the new index.")
    print(json.dumps(final_index['مېنځ'], ensure_ascii=False, indent=2))
else:
    print("\nERROR: 'مېنځ' was NOT found in the new index. Please check the logic.")

if 'بوتلل' in final_index:
    print("\nSuccess! Found 'بوتلل' in the new index.")
else:
    print("\nERROR: 'بوتلل' was NOT found.")
