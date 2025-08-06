import json
import re
from collections import defaultdict

# --- Definitive Grammar Configuration ---
VERB_LEXICON = {
    'خېژول': {
        'type': 'Verb',
        'pattern_info': 'Regular Verb with distinct stems',
        'stems': {
            'imperfective_stem': 'خېژو',
            'perfective_stem': 'وخېژو',
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
            'perfective_root': 'بوتلل',
            'past_participle': 'بوتللی'
        }
    },
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
        sorted_stems = sorted(details['stems'].items(), key=lambda x: len(x[1]), reverse=True)
        for stem_type, stem in sorted_stems:
            if word.startswith(stem):
                return root, { 'type': 'Verb', 'pattern_info': details['pattern_info'], 'form_description': f"Derived from {stem_type.replace('_', ' ')} '{stem}'" }

    # 3. Check for Noun/Adjective Inflections
    if word.endswith(('ي', 'یو', 'یه')):
        potential_root = re.sub(r'(ي|یو|یه)$', '', word) + 'ی'
        if potential_root in all_words_set:
            inf_type = "1st Inflection (Masc)" if word.endswith('ي') else "2nd Inflection (Masc)" if word.endswith('یو') else "Vocative (Masc)"
            return potential_root, { 'type': 'Noun/Adj', 'pattern_info': 'Pattern 2: Unstressed ی', 'form_description': inf_type }
            
    # 4. Default Case
    return word, { 'type': 'Noun/Adj', 'pattern_info': 'N/A', 'form_description': 'Base Form' }

# --- Main Execution (Corrected Logic) ---
word_data = load_word_data()
all_words_set = set(word_data.keys())
final_index = defaultdict(lambda: {'forms': defaultdict(list)})

# This logic ensures the root's type is always set correctly from the lexicon.
for word, data in word_data.items():
    root, details = find_root_and_details_stem_aware(word, all_words_set)
    
    # ** THE FIX IS HERE **
    # Always get the root's definitive details from the lexicon if it exists.
    if root in VERB_LEXICON:
        final_index[root]['type'] = VERB_LEXICON[root]['type']
        final_index[root]['pattern_info'] = VERB_LEXICON[root]['pattern_info']
    else:
        # Fallback for non-verbs
        _, root_details = find_root_and_details_stem_aware(root, all_words_set)
        final_index[root]['type'] = root_details['type']
        final_index[root]['pattern_info'] = root_details['pattern_info']
    
    final_index[root]['forms'][details['form_description']].append({
        'form': word,
        'count': data['count'],
        'verses': data['verses']
    })

output_path = 'all_txt_copies/grammatical_index_v9.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(final_index, f, ensure_ascii=False, indent=2)

print(f"Definitive, corrected grammatical index created at: {output_path}")

# Verification
word_to_verify = 'وخېژول'
root_to_verify = 'خېژول'
if root_to_verify in final_index and final_index[root_to_verify]['type'] == 'Verb':
    print(f"\nSuccess! Root '{root_to_verify}' is correctly identified as a Verb.")
    if any(item['form'] == word_to_verify for sublist in final_index[root_to_verify]['forms'].values() for item in sublist):
        print(f"Success! Found '{word_to_verify}' and mapped it to root '{root_to_verify}'.")
    else:
        print(f"ERROR: Did not find form '{word_to_verify}' under root.")
else:
    print(f"\nERROR: Failed to correctly identify root '{root_to_verify}' as a Verb.")
