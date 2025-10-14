import json
import re
from collections import defaultdict

# --- Pashto Inflection Patterns ---
# Based on user feedback and grammar rules (e.g., LingDocs Inflection Pattern #2)
# This is a more robust, pattern-based approach.

def get_inflection_patterns(all_words_set):
    """
    Generates a map from an inflected word to its likely base form (root).
    This is the core of the improved logic.
    """
    root_map = {}

    for word in all_words_set:
        # Default root is the word itself
        root = word
        
        # Pattern 1: Nouns ending in unstressed 'ay' (ی) -> 'ee' (ي), 'iyo' (یو), 'iya' (یه)
        if word.endswith('ي'): # like هډوکي
            potential_root = word[:-1] + 'ی'
            if potential_root in all_words_set:
                root = potential_root
        elif word.endswith('یو'): # like هډوکیو
            potential_root = word[:-2] + 'ی'
            if potential_root in all_words_set:
                root = potential_root
        elif word.endswith('یه'): # like هډوکیه
            potential_root = word[:-1] + 'ی'
            if potential_root in all_words_set:
                root = potential_root
        
        # Pattern 2: Verb conjugations (simplified)
        # Present tense -> infinitive
        elif word.endswith('م') or word.endswith('ې') or word.endswith('ي'):
            # This is complex; a simple heuristic is to find a common stem.
            # For now, we'll stick to nouns until verb patterns are clearer.
            pass

        # Add more patterns here as they are identified.
        
        root_map[word] = root
        
    return root_map

def infer_pos(word, root, known_lists):
    """Infer Part of Speech based on lists and suffixes."""
    if word in known_lists['pronouns']: return 'pronoun'
    if word in known_lists['prepositions']: return 'preposition/postposition'
    if word in known_lists['adverbs']: return 'adverb'
    if word in known_lists['conjunctions']: return 'conjunction'
    
    # Heuristic: if a word ends in 'ول', it's likely a verb infinitive.
    if root.endswith('ول'):
        return 'verb'
    
    # Default to noun for words with inflections, otherwise 'other'
    if root != word:
        return 'noun' # Assumption that most inflections we've caught are nominal
        
    return 'other'

# --- Main Script ---

# 1. Load the original flat word index to get all words and their data
word_index = {}
with open('all_txt_copies/word_index.txt', 'r', encoding='utf-8') as f:
    for line in f:
        if line.strip():
            match = re.match(r'^(.*?) \((\d+)\): (.*)$', line.strip())
            if match:
                word, count, refs_str = match.groups()
                refs = refs_str.split(', ')
                word_index[word] = {'count': int(count), 'verses': refs}

all_words_set = set(word_index.keys())

# 2. Generate the root map based on inflection patterns
root_map = get_inflection_patterns(all_words_set)

# 3. Define known word lists for POS tagging
known_lists = {
    'pronouns': {'زه', 'ته', 'هغه', 'هغې', 'هغوی', 'مونږ', 'تاسو', 'دا', 'دې', 'چې', 'څوک', 'ځان', 'خپل'},
    'prepositions': {'د', 'په', 'له', 'ته', 'کې', 'سره', 'لپاره', 'باندې', 'لاندې', 'پورې', 'پرته', 'پر'},
    'adverbs': {'نو', 'بیا', 'هم', 'چېرته', 'کله', 'څنګه', 'ولې', 'ډېر', 'لږ', 'نه'},
    'conjunctions': {'او', 'خو', 'که'}
}

# 4. Group words by their identified root and inferred POS
structured_index = defaultdict(lambda: defaultdict(list))
for word, data in word_index.items():
    root = root_map.get(word, word)
    pos = infer_pos(word, root, known_lists)
    
    structured_index[root][pos].append({
        'form': word,
        'count': data['count'],
        'verses': data['verses']
    })

# 5. Save the new, more accurate structured index to JSON
output_path = 'all_txt_copies/structured_index_v2.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(structured_index, f, ensure_ascii=False, indent=2)

print(f"New structured index created at {output_path}")
print(f"Example grouping for 'هډوکی':")
if 'هډوکی' in structured_index:
    print(json.dumps(structured_index['هډوکی'], ensure_ascii=False, indent=2))
else:
    print("'هډوکی' not found as a root. Check inflection patterns.")
