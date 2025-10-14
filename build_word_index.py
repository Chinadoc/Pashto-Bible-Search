
import os
import json
import re
from search_utils import tokenize_ps, normalize_pashto_char, create_form_to_root_map

DATA_DIR = 'all_txt_copies'
OT_DATA_DIR = 'ot_txt_copies'
GRAMMATICAL_INDEX_FILE = 'all_txt_copies/grammatical_index_v15.json'

def _load_text_from_dir(dir_path: str):
    bible = {}
    punct = '.,:;!?؟،؛"\'()[]{}“”'
    def parse_int_mixed_digits(s: str):
        """Parse numbers written with ASCII, Arabic-Indic (٠-٩), or Eastern Arabic (۰-۹) digits.
        Returns int or None if any non-digit characters are present.
        """
        arabic_indic = {ord('٠') + i: str(i) for i in range(10)}  # U+0660..U+0669
        eastern_arabic = {ord('۰') + i: str(i) for i in range(10)}  # U+06F0..U+06F9
        normalized = s.translate({**arabic_indic, **eastern_arabic})
        if not normalized or not all('0' <= ch <= '9' for ch in normalized):
            return None
        try:
            return int(normalized)
        except Exception:
            return None
    book_map = {
        'acts': 'Acts', 'colossians': 'Colossians', 'ephesians': 'Ephesians', 'galatians': 'Galatians',
        'hebrews': 'Hebrews', 'james': 'James', 'john': 'John', 'jude': 'Jude', 'luke': 'Luke',
        'mark': 'Mark', 'matthew': 'Matthew', 'philemon': 'Philemon', 'philippians': 'Philippians',
        'revelation': 'Revelation', 'romans': 'Romans', '1thessalonians': '1 Thessalonians',
        '2thessalonians': '2 Thessalonians', '1timothy': '1 Timothy', '2timothy': '2 Timothy',
        'titus': 'Titus', '1peter': '1 Peter', '2peter': '2 Peter', '1john': '1 John',
        '2john': '2 John', '3john': '3 John',
        '1corinthians': '1 Corinthians', '2corinthians': '2 Corinthians',
        'genesis': 'Genesis', 'exodus': 'Exodus', 'leviticus': 'Leviticus', 'numbers': 'Numbers',
        'deuteronomy': 'Deuteronomy', 'joshua': 'Joshua', 'judges': 'Judges', 'ruth': 'Ruth',
        '1samuel': '1 Samuel', '2samuel': '2 Samuel', '1kings': '1 Kings', '2kings': '2 Kings',
        '1chronicles': '1 Chronicles', '2chronicles': '2 Chronicles', 'ezra': 'Ezra', 'nehemiah': 'Nehemiah',
        'esther': 'Esther', 'job': 'Job', 'psalms': 'Psalms', 'proverbs': 'Proverbs',
        'ecclesiastes': 'Ecclesiastes', 'songofsolomon': 'Song of Solomon', 'isaiah': 'Isaiah',
        'jeremiah': 'Jeremiah', 'lamentations': 'Lamentations', 'ezekiel': 'Ezekiel', 'daniel': 'Daniel',
        'hosea': 'Hosea', 'joel': 'Joel', 'amos': 'Amos', 'obadiah': 'Obadiah', 'jonah': 'Jonah',
        'micah': 'Micah', 'nahum': 'Nahum', 'habakkuk': 'Habakkuk', 'zephaniah': 'Zephaniah',
        'haggai': 'Haggai', 'zechariah': 'Zechariah', 'malachi': 'Malachi'
    }
    for filename in os.listdir(dir_path):
        if filename.endswith('.txt'):
            match = re.match(r'([a-z0-9]+)(\d+)_pashto\.txt', filename)
            if match:
                book_key, chapter = match.groups()
                book_name = book_map.get(book_key)
                if book_name:
                    with open(os.path.join(dir_path, filename), 'r', encoding='utf-8') as f:
                        for line in f:
                            parts = line.strip().split(maxsplit=1)
                            if len(parts) == 2:
                                verse_num_str, text = parts
                                verse_num = parse_int_mixed_digits(verse_num_str.strip(punct))
                                if verse_num is not None:
                                    ref = f'{book_name} {chapter}:{verse_num}'
                                    bible[ref] = text
    return bible

def load_bible_text():
    return _load_text_from_dir(DATA_DIR)

def load_bible_text_ot():
    return _load_text_from_dir(OT_DATA_DIR)

def load_grammatical_index():
    with open(GRAMMATICAL_INDEX_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def build_word_index():
    nt_text = load_bible_text()
    ot_text = load_bible_text_ot()
    all_text = {**nt_text, **ot_text}
    print(f"Loaded {len(all_text)} verses.")

    grammatical_index = load_grammatical_index()
    form_to_root_map = create_form_to_root_map(grammatical_index)
    print("Created form-to-root map.")

    word_index = []
    for ref, text in all_text.items():
        tokens = tokenize_ps(text)
        for token in tokens:
            normalized_token = normalize_pashto_char(token)
            root = form_to_root_map.get(normalized_token)
            word_index.append({
                "original_word": token,
                "normalized_word": normalized_token,
                "root": root,
                "ref": ref,
            })
    print(f"Created index with {len(word_index)} words.")

    with open('word_index.json', 'w', encoding='utf-8') as f:
        json.dump(word_index, f, ensure_ascii=False, indent=2)
    print("Saved word index to word_index.json")

if __name__ == "__main__":
    build_word_index()
