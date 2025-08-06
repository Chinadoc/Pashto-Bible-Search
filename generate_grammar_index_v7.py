import json
import re
from collections import defaultdict

# --- Configuration ---
COMPLEX_VERBS = {
    'بوتلل': { 'type': 'Verb', 'stems': { 'imperfective': 'بیای', 'perfective': 'بوځ', 'past_participle': 'بوتللی' }, 'pattern_info': 'Irregular Verb (Multiple Stems)'},
    'خېژول': { 'type': 'Verb', 'stems': { 'present': 'خېژو', 'past': 'خېژول' }, 'pattern_info': 'Regular Verb'}
}
VERB_PREFIXES = ['و', 'م', 'مه'] # e.g., وخېژول, مه کوئ

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

def find_root_and_details_prefix_aware(word, all_words_set):
    """
    The new prefix-aware grammar engine.
    """
    original_word = word
    prefix_found = ""

    # 1. Tentatively strip a known prefix
    for p in VERB_PREFIXES:
        if word.startswith(p):
            potential_stem = word[len(p):]
            # To be valid, the remaining stem must also exist as a word or be a known root
            if potential_stem in all_words_set or potential_stem in COMPLEX_VERBS:
                word = potential_stem # The rest of the logic will now use the stripped stem
                prefix_found = p
                break

    # 2. Check for Complex Verb Conjugations (on the potentially stripped stem)
    for root, details in COMPLEX_VERBS.items():
        if word == root or any(word.startswith(s) for s in details['stems'].values()):
             return root, { 'type': 'Verb', 'pattern_info': details['pattern_info'], 'form_description': f"Conjugation (prefix: {prefix_found or 'none'})" }

    # 3. Check for Noun/Adjective Inflections (this should not happen to verbs)
    if not prefix_found:
        if word.endswith(('ي', 'یو', 'یه')):
            potential_root = re.sub(r'(ي|یو|یه)$', '', word) + 'ی'
            if potential_root in all_words_set:
                inf_type = "1st Inflection (Masc)" if word.endswith('ي') else "2nd Inflection (Masc)" if word.endswith('یو') else "Vocative (Masc)"
                return potential_root, { 'type': 'Noun/Adj', 'pattern_info': 'Pattern 2: Unstressed ی', 'form_description': inf_type }

    # 4. Default Case: The original word is its own root
    return original_word, { 'type': 'Noun/Adj', 'pattern_info': 'N/A', 'form_description': 'Base Form' }

# --- Main Execution ---
word_data = load_word_data()
all_words_set = set(word_data.keys())
final_index = defaultdict(lambda: {'type': 'Unknown', 'pattern_info': 'N/A', 'forms': defaultdict(list)})

for word, data in word_data.items():
    root, details = find_root_and_details_prefix_aware(word, all_words_set)
    
    # Assign type and pattern based on the root's own details
    _, root_details = find_root_and_details_prefix_aware(root, all_words_set)
    final_index[root]['type'] = root_details['type']
    final_index[root]['pattern_info'] = root_details['pattern_info']
    
    final_index[root]['forms'][details['form_description']].append({
        'form': word,
        'count': data['count'],
        'verses': data['verses']
    })

output_path = 'all_txt_copies/grammatical_index_v7.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(final_index, f, ensure_ascii=False, indent=2)

print(f"New, prefix-aware grammatical index created at: {output_path}")

# Verification
if 'خېژول' in final_index and any(item['form'] == 'وخېژول' for sublist in final_index['خېژول']['forms'].values() for item in sublist):
    print("\nSuccess! Found 'وخېژول' and correctly mapped it to root 'خېژول'.")
    print(json.dumps(final_index['خېژول'], ensure_ascii=False, indent=2))
else:
    print("\nERROR: Failed to correctly map 'وخېژول'.")
    if 'خېژول' in final_index:
        print("Root 'خېژول' was found, but the prefixed form was not mapped.")
    if 'وخېژول' in final_index:
        print("Prefixed form 'وخېژول' was found but incorrectly mapped to its own root.")

