import os
import re
from collections import defaultdict

# --- Configuration ---
COMPOUND_PHRASES = [
    "لکه څنګه چې",
    "کړه وړه" # Keeping this here for future use
]

# --- Functions ---
def persian_to_int(s):
    persian_digits = {'۰': 0, '۱': 1, '۲': 2, '۳': 3, '۴': 4, '۵': 5, '۶': 6, '۷': 7, '۸': 8, '۹': 9}
    result = 0
    for char in s:
        if char in persian_digits: result = result * 10 + persian_digits[char]
        else: return None
    return result

def create_compound_aware_tokenizer(text, compounds):
    # Sort compounds by length (longest first) to handle nested cases
    sorted_compounds = sorted(compounds, key=len, reverse=True)
    for phrase in sorted_compounds:
        text = text.replace(phrase, phrase.replace(" ", "_"))
    return re.split(r'\s+', text)

# --- Main Script ---
book_map = {
    'acts': 'Acts', 'colossians': 'Colossians', 'ephesians': 'Ephesians', 'galatians': 'Galatians',
    'hebrews': 'Hebrews', 'james': 'James', 'john': 'John', 'jude': 'Jude', 'luke': 'Luke',
    'mark': 'Mark', 'matthew': 'Matthew', 'philemon': 'Philemon', 'philippians': 'Philippians',
    'revelation': 'Revelation', 'romans': 'Romans', 'titus': 'Titus',
}

index = defaultdict(list)
freq = defaultdict(int)
punct = '.,:;!?؟،؛"\'()[]{}“”'
txt_dir = 'all_txt_copies'

print("Starting definitive compound-aware indexing...")

for filename in os.listdir(txt_dir):
    if filename.endswith('_pashto.txt'):
        base = filename.replace('_pashto.txt', '')
        match = re.match(r'([a-z]+)(\d+)', base)
        if match:
            book_prefix, chapter_str = match.groups()
            chapter = int(chapter_str)
            book = book_map.get(book_prefix, book_prefix.capitalize())

            filepath = os.path.join(txt_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f: lines = f.readlines()

            current_verse, verse_text_lines = None, []
            for line in lines:
                stripped = line.strip()
                verse_num_candidate = stripped.translate(str.maketrans('', '', punct))
                verse_num = persian_to_int(verse_num_candidate)
                
                if verse_num is not None:
                    if current_verse is not None:
                        full_verse_text = ' '.join(verse_text_lines).strip()
                        words = create_compound_aware_tokenizer(full_verse_text, COMPOUND_PHRASES)
                        ref = f"{book} {chapter}:{current_verse}"
                        for word in words:
                            clean_word = word.strip(punct)
                            if clean_word:
                                index[clean_word].append(ref)
                                freq[clean_word] += 1
                    current_verse, verse_text_lines = verse_num, []
                elif current_verse is not None:
                    verse_text_lines.append(stripped)
            
            if current_verse is not None:
                full_verse_text = ' '.join(verse_text_lines).strip()
                words = create_compound_aware_tokenizer(full_verse_text, COMPOUND_PHRASES)
                ref = f"{book} {chapter}:{current_verse}"
                for word in words:
                    clean_word = word.strip(punct)
                    if clean_word:
                        index[clean_word].append(ref)
                        freq[clean_word] += 1

sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)
output_file = os.path.join(txt_dir, 'word_index_v10_final.txt')
with open(output_file, 'w', encoding='utf-8') as out:
    for word, count in sorted_words:
        unique_verses = ', '.join(sorted(set(index[word])))
        out.write(f"{word} ({count}): {unique_verses}\n")

print(f"Definitive compound-aware index created in: {output_file}")
if "لکه_څنګه_چې" in freq:
    print("Success! Found multi-word phrase 'لکه څنګه چې'.")
else:
    print("ERROR: Could not find 'لکه څنګه چې'.")
