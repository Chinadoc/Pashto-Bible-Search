import json
import re
from collections import defaultdict

# Based on https://grammar.lingdocs.com/inflection/inflection-patterns/
# and https://grammar.lingdocs.com/verbs/
# This script attempts to programmatically apply the described inflection and conjugation patterns
# to group words under a common root.

def load_word_data(filepath='all_txt_copies/word_index.txt'):
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

def apply_patterns(all_words):
    """
    Applies inflection patterns to map each word to its potential root.
    Returns a dictionary mapping every word to its identified root.
    """
    root_map = {word: word for word in all_words} # Initially, each word is its own root
    processed_words = set()

    # We iterate through all words, trying to see if they are a BASE form for a pattern
    for base_word in sorted(list(all_words), key=len, reverse=True):
        if base_word in processed_words:
            continue

        # --- Try to match against known patterns as a BASE word ---

        # Pattern 2: Unstressed ی (-ay) -> Masc: ی -> ي / یو / یه
        if base_word.endswith('ی'):
            stem = base_word[:-1]
            inf_1st = stem + 'ي'
            inf_2nd = stem + 'یو'
            vocative = stem + 'یه'
            
            found_inflections = False
            if inf_1st in all_words and root_map[inf_1st] == inf_1st:
                root_map[inf_1st] = base_word
                processed_words.add(inf_1st)
                found_inflections = True
            if inf_2nd in all_words and root_map[inf_2nd] == inf_2nd:
                root_map[inf_2nd] = base_word
                processed_words.add(inf_2nd)
                found_inflections = True
            if vocative in all_words and root_map[vocative] == vocative:
                root_map[vocative] = base_word
                processed_words.add(vocative)
                found_inflections = True
            
            if found_inflections:
                processed_words.add(base_word)

        # Verb Pattern: Infinitive in 'ول'
        if base_word.endswith('ول'):
            # This is a verb root. Find its conjugations.
            # Example: پاکول -> پاکوي
            pres_stem = base_word[:-2]
            pres_3rd_sing = pres_stem + 'وي'
            if pres_3rd_sing in all_words and root_map[pres_3rd_sing] == pres_3rd_sing:
                 root_map[pres_3rd_sing] = base_word
                 processed_words.add(pres_3rd_sing)
                 processed_words.add(base_word)


    return root_map

def get_word_details(word, root, all_words):
    """
    Given a word and its root, determine its type (inflection/conjugation) and pattern.
    """
    if word == root:
        if root.endswith('ول'):
            return "Verb", "Infinitive"
        return "Noun/Adj", "Base Form"

    # Noun/Adj Inflections
    if root.endswith('ی'): # Pattern 2
        stem = root[:-1]
        if word == stem + 'ي': return "Noun/Adj", "Pattern 2 - 1st Inflection (Masc)"
        if word == stem + 'یو': return "Noun/Adj", "Pattern 2 - 2nd Inflection (Masc)"
        if word == stem + 'یه': return "Noun/Adj", "Pattern 2 - Vocative (Masc)"
            
    if root.endswith('ه'): # Pattern 1
        stem = root[:-1]
        if word == stem + 'ې': return "Noun/Adj", "Pattern 1 - 1st Inflection (Fem)"
        if word == stem + 'و': return "Noun/Adj", "Pattern 1 - 2nd Inflection (Fem)"

    # Verb Conjugations
    if root.endswith('ول'):
        pres_stem = root[:-2]
        if word == pres_stem + 'وي': return "Verb", "Present 3rd Person Singular"


    return "Unknown", "Unknown Form"


# --- Main Execution ---
word_data = load_word_data()
all_words_set = set(word_data.keys())
root_map = apply_patterns(all_words_set)

final_index = defaultdict(lambda: {
    'type': 'Unknown', # Noun/Adj or Verb
    'pattern_info': 'N/A',
    'forms': defaultdict(list)
})

for word, data in word_data.items():
    root = root_map[word]
    word_type, form_description = get_word_details(word, root, all_words_set)

    final_index[root]['type'] = word_type
    
    # Store the identified pattern with the root
    if "Pattern" in form_description:
        final_index[root]['pattern_info'] = form_description.split(' - ')[0]

    final_index[root]['forms'][form_description].append({
        'form': word,
        'count': data['count'],
        'verses': data['verses']
    })

# Save the new grammatical index to a JSON file
output_path = 'all_txt_copies/grammatical_index_v2.py'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(final_index, f, ensure_ascii=False, indent=2)

print(f"New grammatical index created at: {output_path}")

if 'پاکول' in final_index:
    print("\n--- Example for verb 'پاکول' ---")
    print(json.dumps(final_index['پاکول'], ensure_ascii=False, indent=2))
if 'هډوکی' in final_index:
    print("\n--- Example for noun 'هډوکی' ---")
    print(json.dumps(final_index['هډوکی'], ensure_ascii=False, indent=2))
