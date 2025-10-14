import json
import re
from collections import defaultdict

# Based on https://grammar.lingdocs.com/inflection/inflection-patterns/
# This script attempts to programmatically apply the described inflection patterns
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

        # Pattern 1 / 5: Basic Consonant / Squish -> Masc: consonant -> ـه / ـو / ـه
        elif not re.search('[اوېيۍ]$', base_word): # Ends in a consonant
             # This is complex, as many words end in consonants.
             # We can try to reverse-map, e.g. if a word ends in 'ه', check if the stem exists.
             pass # Add more robust logic here later if needed.


    return root_map

def get_inflection_details(word, root, all_words):
    """
    Given a word and its root, determine its inflection pattern and type.
    This is a reverse-lookup based on the identified root.
    """
    if word == root:
        return "Plain", "Base Form"

    # Pattern 2: Unstressed ی (-ay)
    if root.endswith('ی'):
        stem = root[:-1]
        if word == stem + 'ي':
            return "Pattern 2", "1st Inflection (Masc)"
        if word == stem + 'یو':
            return "Pattern 2", "2nd Inflection (Masc)"
        if word == stem + 'یه':
            return "Pattern 2", "Vocative (Masc)"
            
    # Pattern 1: Basic -> Fem: ـه -> ـې / ـو
    if root.endswith('ه'):
        stem = root[:-1]
        if word == stem + 'ې':
            return "Pattern 1", "1st Inflection (Fem)"
        if word == stem + 'و':
             return "Pattern 1", "2nd Inflection (Fem)"

    return "Unknown", "Unknown Inflection"


# --- Main Execution ---

# 1. Load all word data and get a set of unique words
word_data = load_word_data()
all_words_set = set(word_data.keys())

# 2. Apply inflection patterns to generate a root map
root_map = apply_patterns(all_words_set)

# 3. Build the final structured index
grammatical_index = defaultdict(lambda: {
    'pattern': 'Unknown',
    'inflections': defaultdict(list)
})

for word, data in word_data.items():
    root = root_map[word]
    pattern, inf_type = get_inflection_details(word, root, all_words_set)

    # Store the identified pattern with the root
    if pattern != "Unknown":
        grammatical_index[root]['pattern'] = pattern
    
    # Add the word form under its inflection type
    grammatical_index[root]['inflections'][inf_type].append({
        'form': word,
        'count': data['count'],
        'verses': data['verses']
    })

# 4. Save the new grammatical index to a JSON file
output_path = 'all_txt_copies/grammatical_index.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(grammatical_index, f, ensure_ascii=False, indent=2)

print(f"New grammatical index created at: {output_path}")

# Example check for هډوکی
if 'هډوکی' in grammatical_index:
    print("\n--- Example for 'هډوکی' ---")
    print(json.dumps(grammatical_index['هډوکی'], ensure_ascii=False, indent=2))
else:
    print("\nCould not find 'هډوکی' as a root in the new index.")

if 'خدای' in grammatical_index:
    print("\n--- Example for 'خدای' ---")
    print(json.dumps(grammatical_index['خدای'], ensure_ascii=False, indent=2))

