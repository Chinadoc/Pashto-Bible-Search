import json
import re
from collections import defaultdict

# --- Configuration ---
# This dictionary will hold the specific, complex rules for irregular verbs.
# Based on: https://dictionary.lingdocs.com/word?id=1527812507
COMPLEX_VERBS = {
    'بوتلل': {
        'type': 'Verb',
        'stems': {
            'imperfective': 'بیای', # from بیایـ
            'perfective': 'بوځ',     # from بوځـ
            'past_participle': 'بوتللی'
        },
        'pattern_info': 'Irregular Verb (Multiple Stems)'
    },
    # Add other complex verbs here as they are identified
    # e.g. 'کول': { 'type': 'Verb', 'stems': {'imperfective': 'کو', 'perfective': 'کړ'} ... }
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

def find_root_and_details(word, all_words):
    """
    The core of the new grammar engine. It identifies a word's root and grammatical details.
    """
    # 1. Check if the word is a conjugated form of a known COMPLEX VERB
    for root, details in COMPLEX_VERBS.items():
        for stem_type, stem in details['stems'].items():
            if word.startswith(stem):
                return root, {
                    'type': 'Verb',
                    'pattern_info': details['pattern_info'],
                    'form_description': f"Conjugation from {stem_type} stem '{stem}'"
                }

    # 2. Check for Noun/Adjective Inflection Patterns (from previous logic)
    # Pattern 2: Unstressed ی (-ay) -> Masc: ی -> ي / یو / یه
    if word.endswith('ي') or word.endswith('یو') or word.endswith('یه'):
        potential_root_stem = re.sub(r'(ي|یو|یه)$', '', word)
        potential_root = potential_root_stem + 'ی'
        if potential_root in all_words:
            inf_type = "Unknown Inflection"
            if word.endswith('ي'): inf_type = "1st Inflection (Masc)"
            if word.endswith('یو'): inf_type = "2nd Inflection (Masc)"
            if word.endswith('یه'): inf_type = "Vocative (Masc)"
            return potential_root, {
                'type': 'Noun/Adj',
                'pattern_info': 'Pattern 2: Unstressed ی',
                'form_description': inf_type
            }
            
    # Default: The word is its own root
    return word, {
        'type': 'Noun/Adj', # Assume Noun/Adj if not a verb
        'pattern_info': 'N/A',
        'form_description': 'Base Form'
    }

# --- Main Execution ---
word_data = load_word_data()
all_words_set = set(word_data.keys())

final_index = defaultdict(lambda: {
    'type': 'Unknown',
    'pattern_info': 'N/A',
    'forms': defaultdict(list)
})

for word, data in word_data.items():
    root, details = find_root_and_details(word, all_words_set)

    final_index[root]['type'] = details['type']
    final_index[root]['pattern_info'] = details['pattern_info']
    
    final_index[root]['forms'][details['form_description']].append({
        'form': word,
        'count': data['count'],
        'verses': data['verses']
    })

# Save the new, high-fidelity index
output_path = 'all_txt_copies/grammatical_index_v4.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(final_index, f, ensure_ascii=False, indent=2)

print(f"New grammatical index created at: {output_path}")

# Example check
if 'بوتلل' in final_index:
    print("\n--- Example for verb 'بوتلل' ---")
    print(json.dumps(final_index['بوتلل'], ensure_ascii=False, indent=2))
else:
    print("\n'بوتلل' not found as a root. Check COMPLEX_VERBS dictionary and logic.")
