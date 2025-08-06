import json
import re
from collections import defaultdict

# --- Definitive Grammar Configuration ---
# This lexicon is the core of the new engine. It is built to model Pashto verb grammar correctly.
# Based on: https://grammar.lingdocs.com/verbs/master-chart/
VERB_LEXICON = {
    'خېژول': {
        'type': 'Verb',
        'pattern_info': 'Regular Verb with distinct stems',
        'stems': {
            'imperfective_stem': 'خېژو',     # from خېژوـ
            'perfective_stem': 'وخېژو',     # from وخېژوـ
            'imperfective_root': 'خېژول',
            'perfective_root': 'وخېژول',
            'past_participle': 'خېژولی'
        }
    },
    'بوتلل': {
        'type': 'Verb',
        'pattern_info': 'Irregular Verb (Multiple Stems)',
        'stems': {
            'imperfective_stem': 'بیای',
            'perfective_stem': 'بوځ',
            'imperfective_root': 'بوتلل',
            'perfective_root': 'بوتلل', # Note: same in this case
            'past_participle': 'بوتللی'
        }
    },
    # Add more verbs with their stems here
}

def load_word_data(filepath='all_txt_copies/word_index_v4_compound.txt'):
    word_data = {}
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            match = re.match(r'^(.*?) \((\d+)\): (.*)$', line.strip())
            if match:
                word, count, refs_str = match.groups()
                word_data[word] = {'count': int(count), 'verses': refs_str.split(', ')}
    return word_data

def find_root_and_details_stem_aware(word, all_words_set):
    """The definitive, stem-aware grammar engine."""
    
    # 1. Check if the word is a known verb root itself
    if word in VERB_LEXICON:
         return word, { 'type': 'Verb', 'pattern_info': VERB_LEXICON[word]['pattern_info'], 'form_description': 'Infinitive Root' }

    # 2. Check if the word is derived from a known verb stem
    for root, details in VERB_LEXICON.items():
        # Sort stems by length (longest first) to avoid partial matches (e.g., 'وخ' matching before 'وخېژو')
        sorted_stems = sorted(details['stems'].items(), key=lambda x: len(x[1]), reverse=True)
        for stem_type, stem in sorted_stems:
            if word.startswith(stem):
                return root, { 'type': 'Verb', 'pattern_info': details['pattern_info'], 'form_description': f"Derived from {stem_type.replace('_', ' ')} '{stem}'" }

    # 3. Check for Noun/Adjective Inflections (fallback)
    if word.endswith(('ي', 'یو', 'یه')):
        potential_root = re.sub(r'(ي|یو|یه)$', '', word) + 'ی'
        if potential_root in all_words_set:
            inf_type = "1st Inflection (Masc)" if word.endswith('ي') else "2nd Inflection (Masc)" if word.endswith('یو') else "Vocative (Masc)"
            return potential_root, { 'type': 'Noun/Adj', 'pattern_info': 'Pattern 2: Unstressed ی', 'form_description': inf_type }
            
    # 4. Default Case: The word is its own root
    return word, { 'type': 'Noun/Adj', 'pattern_info': 'N/A', 'form_description': 'Base Form' }

# --- Main Execution ---
word_data = load_word_data()
all_words_set = set(word_data.keys())
final_index = defaultdict(lambda: {'type': 'Unknown', 'pattern_info': 'N/A', 'forms': defaultdict(list)})

for word, data in word_data.items():
    root, details = find_root_and_details_stem_aware(word, all_words_set)
    
    root_details = VERB_LEXICON.get(root, {}) # Get details if the root is a known verb
    final_index[root]['type'] = root_details.get('type', 'Noun/Adj')
    final_index[root]['pattern_info'] = root_details.get('pattern_info', 'N/A')
    
    final_index[root]['forms'][details['form_description']].append({
        'form': word,
        'count': data['count'],
        'verses': data['verses']
    })

output_path = 'all_txt_copies/grammatical_index_v8.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(final_index, f, ensure_ascii=False, indent=2)

print(f"Definitive, stem-aware grammatical index created at: {output_path}")

# Verification
word_to_verify = 'وخېژول'
root_to_verify = 'خېژول'
if root_to_verify in final_index and any(item['form'] == word_to_verify for sublist in final_index[root_to_verify]['forms'].values() for item in sublist):
    print(f"\nSuccess! Found '{word_to_verify}' and correctly mapped it to root '{root_to_verify}'.")
    print(json.dumps(final_index[root_to_verify], ensure_ascii=False, indent=2))
else:
    print(f"\nERROR: Failed to correctly map '{word_to_verify}'.")

if 'مېنځ' in final_index:
    print("\nSuccess! Found 'مېنځ'.")
