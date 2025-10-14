import json
import re
from collections import defaultdict

# --- Configuration ---
COMPLEX_VERBS = {
    'بوتلل': {
        'type': 'Verb',
        'stems': { 'imperfective': 'بیای', 'perfective': 'بوځ', 'past_participle': 'بوتللی' },
        'pattern_info': 'Irregular Verb (Multiple Stems)'
    },
}

def load_word_data(filepath='all_txt_copies/word_index_v4_compound.txt'):
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
    # 1. Complex Verbs
    for root, details in COMPLEX_VERBS.items():
        for stem_type, stem in details['stems'].items():
            if word.startswith(stem):
                return root, { 'type': 'Verb', 'pattern_info': details['pattern_info'], 'form_description': f"Conjugation from {stem_type} stem '{stem}'" }
    # 2. Noun Inflections
    if word.endswith(('ي', 'یو', 'یه')):
        potential_root = re.sub(r'(ي|یو|یه)$', '', word) + 'ی'
        if potential_root in all_words_set:
            inf_type = "1st Inflection (Masc)" if word.endswith('ي') else "2nd Inflection (Masc)" if word.endswith('یو') else "Vocative (Masc)"
            return potential_root, { 'type': 'Noun/Adj', 'pattern_info': 'Pattern 2: Unstressed ی', 'form_description': inf_type }
    # 3. Default
    return word, { 'type': 'Noun/Adj', 'pattern_info': 'N/A', 'form_description': 'Base Form' }

# --- RADICALLY SIMPLIFIED MAIN EXECUTION ---
word_data = load_word_data()
all_words_set = set(word_data.keys())
final_index = defaultdict(lambda: {'type': 'Unknown', 'pattern_info': 'N/A', 'forms': defaultdict(list)})

for word, data in word_data.items():
    root, details = find_root_and_details_inclusive(word, all_words_set)
    final_index[root]['forms'][details['form_description']].append({
        'form': word,
        'count': data['count'],
        'verses': data['verses']
    })
    # Assign type and pattern based on the root's own details
    root_for_type, type_details = find_root_and_details_inclusive(root, all_words_set)
    final_index[root]['type'] = type_details['type']
    final_index[root]['pattern_info'] = type_details['pattern_info']


output_path = 'all_txt_copies/grammatical_index_v6.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(final_index, f, ensure_ascii=False, indent=2)

print(f"New index created at: {output_path}")

# Verification
if 'مېنځ' in final_index:
    print("\nSuccess! Found 'مېنځ'.")
else:
    print("\nERROR: 'مېنځ' was NOT found.")
if 'بوتلل' in final_index:
    print("Success! Found 'بوتلل'.")
else:
    print("ERROR: 'بوتلل' was NOT found.")
