import re
from typing import Dict, List

# The inflection and part-of-speech heuristics below are adapted from
# generate_structured_index.py. They loosely follow patterns described on
# https://grammar.lingdocs.com and serve as a light-weight substitute for the
# pashto-grammar library.

verb_suffixes = ['ول', 'وي', 'ېده', 'ېدل', 'ېږم', 'ېږې', 'ېږي', 'وم', 'وو', 'ئ', 'ئې', 'ي', 'ې', 'و']
noun_suffixes = ['ګانې', 'ګی', 'ګۍ', 'انه', 'ونه', 'ان', 'ه']
adj_suffixes = ['جنه', 'جنې']

known_pronouns = ['زه', 'ته', 'هغه', 'هغې', 'هغوی', 'مونږ', 'تاسو', 'دا', 'دې', 'چې', 'څوک', 'ځان']
known_preps_posts = ['د', 'په', 'له', 'ته', 'کې', 'سره', 'لپاره', 'باندې', 'لاندې', 'پورې', 'پرته', 'پر']
known_adverbs = ['نو', 'بیا', 'هم', 'چېرته', 'کله', 'څنګه', 'ولې', 'ډېر', 'لږ']
known_conjunctions = ['او', 'خو', 'که']

def infer_root_and_pos(word: str):
    """Infer a rough root and part of speech for a Pashto word."""
    if word in known_pronouns:
        return word, 'pronoun', ''
    if word in known_preps_posts:
        return word, 'preposition/postposition', ''
    if word in known_adverbs:
        return word, 'adverb', ''
    if word in known_conjunctions:
        return word, 'conjunction', ''

    for suf in sorted(verb_suffixes, key=len, reverse=True):
        if word.endswith(suf):
            root = word[:-len(suf)]
            if len(root) >= 2:
                return root, 'verb', suf

    for suf in sorted(noun_suffixes, key=len, reverse=True):
        if word.endswith(suf):
            root = word[:-len(suf)]
            if len(root) >= 1:
                return root, 'noun', suf

    for suf in sorted(adj_suffixes, key=len, reverse=True):
        if word.endswith(suf):
            root = word[:-len(suf)]
            if len(root) >= 2:
                return root, 'adjective', suf

    return word, 'other', ''


def load_word_index(filepath: str = 'all_txt_copies/word_index.txt') -> Dict[str, Dict[str, object]]:
    """Load the pre-generated word index into a dictionary."""
    word_data: Dict[str, Dict[str, object]] = {}
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip():
                match = re.match(r'^(.*?) \((\d+)\): (.*)$', line.strip())
                if match:
                    word, count, refs_str = match.groups()
                    refs = refs_str.split(', ')
                    word_data[word] = {'count': int(count), 'verses': refs}
    return word_data


def search_word(word: str, index: Dict[str, Dict[str, object]] = None) -> Dict[str, object]:
    """Search for a word in the index, returning frequency and verses."""
    if index is None:
        index = load_word_index()
    return index.get(word, {'count': 0, 'verses': []})


def search_and_characterize(word: str, index: Dict[str, Dict[str, object]] = None) -> Dict[str, object]:
    """Return search results along with a grammar characterization."""
    data = search_word(word, index)
    root, pos, suffix = infer_root_and_pos(word)
    return {
        'word': word,
        'count': data['count'],
        'verses': data['verses'],
        'root': root,
        'part_of_speech': pos,
        'suffix': suffix,
    }

if __name__ == '__main__':
    # Example usage for manual testing
    import json
    result = search_and_characterize('هغه')
    # Show only a few verses to keep output manageable during testing
    result['verses'] = result['verses'][:5]
    print(json.dumps(result, ensure_ascii=False, indent=2))


