import json
import re
from collections import defaultdict

# Expanded Pashto POS rules (based on https://grammar.lingdocs.com)
# This is a heuristic approach and may not be perfect for all cases.
verb_suffixes = ['ول', 'وي', 'ېده', 'ېدل', 'ېږم', 'ېږې', 'ېږي', 'وم', 'وو', 'ئ', 'ئې', 'ي', 'ې', 'و']
noun_suffixes = ['ګانې', 'ګی', 'ګۍ', 'انه', 'ونه', 'ان', 'ه']
adj_suffixes = ['جنه', 'جنې']

# Lists of known words for better categorization
known_pronouns = ['زه', 'ته', 'هغه', 'هغې', 'هغوی', 'مونږ', 'تاسو', 'دا', 'دې', 'چې', 'څوک', 'ځان']
known_preps_posts = ['د', 'په', 'له', 'ته', 'کې', 'سره', 'لپاره', 'باندې', 'لاندې', 'پورې', 'پرته', 'پر']
known_adverbs = ['نو', 'بیا', 'هم', 'چېرته', 'کله', 'څنګه', 'ولې', 'ډېر', 'لږ']
known_conjunctions = ['او', 'خو', 'که']

def infer_root_and_pos(word):
    if word in known_pronouns: return word, 'pronoun', ''
    if word in known_preps_posts: return word, 'preposition/postposition', ''
    if word in known_adverbs: return word, 'adverb', ''
    if word in known_conjunctions: return word, 'conjunction', ''

    # Check for verb suffixes first as they are more distinctive
    for suf in sorted(verb_suffixes, key=len, reverse=True):
        if word.endswith(suf):
            root = word[:-len(suf)]
            if len(root) >= 2:
                return root, 'verb', suf

    # Check for noun suffixes
    for suf in sorted(noun_suffixes, key=len, reverse=True):
        if word.endswith(suf):
            root = word[:-len(suf)]
            if len(root) >= 1: # Noun roots can be short
                return root, 'noun', suf
    
    # Check for adjective suffixes
    for suf in sorted(adj_suffixes, key=len, reverse=True):
        if word.endswith(suf):
            root = word[:-len(suf)]
            if len(root) >= 2:
                return root, 'adjective', suf

    return word, 'other', ''

# 1. Load the original flat word index
word_index = {}
with open('all_txt_copies/word_index.txt', 'r', encoding='utf-8') as f:
    for line in f:
        if line.strip():
            match = re.match(r'^(.*?) \((\d+)\): (.*)$', line.strip())
            if match:
                word, count, refs_str = match.groups()
                refs = refs_str.split(', ')
                word_index[word] = {'count': int(count), 'verses': refs}

# 2. Process and group the words
structured_index = defaultdict(lambda: defaultdict(list))
for word, data in word_index.items():
    root, pos, suffix = infer_root_and_pos(word)
    structured_index[root][pos].append({
        'form': word,
        'suffix': suffix,
        'count': data['count'],
        'verses': data['verses']
    })

# 3. Save the structured index to a JSON file
with open('all_txt_copies/structured_index.json', 'w', encoding='utf-8') as f:
    json.dump(structured_index, f, ensure_ascii=False, indent=2)

print("Structured index created at all_txt_copies/structured_index.json")
