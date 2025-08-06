import re
from collections import defaultdict

# Simplified Pashto grammar rules for root inference
# Common verb infinitive suffix: -ول
# Verb conjugations: e.g., -وي (pres), -ېده (past cont), etc.
# Noun plurals: -ان, -ګانې, etc.
verb_suffixes = ['ول', 'وي', 'ېد', 'و', 'ې', 'ي', 'ېده', 'وو']
noun_suffixes = ['ه', 'ې', 'و', 'ګانې', 'ان']
all_suffixes = verb_suffixes + noun_suffixes

def infer_root_and_pos(word):
    for suf in sorted(all_suffixes, key=len, reverse=True):
        if word.endswith(suf):
            root = word[:-len(suf)]
            if len(root) >= 2:
                pos = 'verb' if suf in verb_suffixes else 'noun'
                return root, pos, suf
    return word, 'other', ''

# Load original index
index = defaultdict(list)
with open('all_txt_copies/word_index.txt', 'r', encoding='utf-8') as f:
    for line in f:
        if line.strip():
            parts = line.split(' (', 1)
            word = parts[0]
            rest = parts[1].split('): ', 1)
            count = int(rest[0])
            refs = rest[1].strip().split(', ')
            index[word] = {'count': count, 'verses': refs}

# Group by inferred roots
grouped = defaultdict(lambda: defaultdict(list))
for word in index:
    root, pos, suf = infer_root_and_pos(word)
    grouped[root][pos].append({'form': word, 'suffix': suf, 'count': index[word]['count'], 'verses': index[word]['verses']})

# Write new complex index
with open('all_txt_copies/complex_word_index.txt', 'w', encoding='utf-8') as out:
    for root in sorted(grouped):
        out.write(f"Root: {root}\n")
        for pos in sorted(grouped[root]):
            out.write(f"  Part of Speech: {pos}\n")
            for item in sorted(grouped[root][pos], key=lambda x: x['form']):
                verses_str = ', '.join(item['verses'])
                out.write(f"    {item['form']} (suffix: {item['suffix']}) ({item['count']}): {verses_str}\n")
        out.write("\n")

print("Complex word index created at all_txt_copies/complex_word_index.txt") 