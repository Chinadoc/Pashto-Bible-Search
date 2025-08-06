import os
import re
from collections import defaultdict

# --- Configuration ---
# Define known compound words here. They will be merged with an underscore.
COMPOUND_WORDS = [
    "کړه وړه"
]

# --- Functions ---
def persian_to_int(s):
    """Converts a string of Persian/Pashto digits to an integer."""
    persian_digits = {'۰': 0, '۱': 1, '۲': 2, '۳': 3, '۴': 4, '۵': 5, '۶': 6, '۷': 7, '۸': 8, '۹': 9}
    result = 0
    for char in s:
        if char in persian_digits:
            result = result * 10 + persian_digits[char]
        else:
            return None
    return result

def create_compound_aware_tokenizer(text, compounds):
    """
    A two-pass tokenizer. First, it replaces spaces in known compound phrases
    with underscores. Then, it splits the text by whitespace.
    """
    # First pass: replace spaces in compound words
    for phrase in compounds:
        text = text.replace(phrase, phrase.replace(" ", "_"))
    
    # Second pass: split by any whitespace
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

print("Starting compound-aware indexing...")

for filename in os.listdir(txt_dir):
    if filename.endswith('_pashto.txt'):
        base = filename.replace('_pashto.txt', '')
        match = re.match(r'([a-z]+)(\d+)', base)
        if match:
            book_prefix, chapter_str = match.groups()
            chapter = int(chapter_str)
            book = book_map.get(book_prefix, book_prefix.capitalize())

            filepath = os.path.join(txt_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                lines = f.readlines()

            current_verse = None
            verse_text_lines = []
            for line in lines:
                stripped = line.strip()
                verse_num_candidate = stripped.translate(str.maketrans('', '', punct))
                verse_num = persian_to_int(verse_num_candidate)
                
                if verse_num is not None:
                    if current_verse is not None:
                        # Process the collected verse text
                        full_verse_text = ' '.join(verse_text_lines).strip()
                        words = create_compound_aware_tokenizer(full_verse_text, COMPOUND_WORDS)
                        ref = f"{book} {chapter}:{current_verse}"
                        for word in words:
                            clean_word = word.strip(punct)
                            if clean_word:
                                index[clean_word].append(ref)
                                freq[clean_word] += 1
                    current_verse = verse_num
                    verse_text_lines = []
                elif current_verse is not None:
                    verse_text_lines.append(stripped)
            
            # Process the last verse in the file
            if current_verse is not None:
                full_verse_text = ' '.join(verse_text_lines).strip()
                words = create_compound_aware_tokenizer(full_verse_text, COMPOUND_WORDS)
                ref = f"{book} {chapter}:{current_verse}"
                for word in words:
                    clean_word = word.strip(punct)
                    if clean_word:
                        index[clean_word].append(ref)
                        freq[clean_word] += 1

# Sort words by frequency
sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)

# Output to a new file to avoid breaking the old system
output_file = os.path.join(txt_dir, 'word_index_v4_compound.txt')
with open(output_file, 'w', encoding='utf-8') as out:
    for word, count in sorted_words:
        # Get unique verses and sort them
        unique_verses = ', '.join(sorted(set(index[word])))
        out.write(f"{word} ({count}): {unique_verses}\n")

print(f"Compound-aware index created in: {output_file}")

# Check if our compound word was found
if "کړه_وړه" in freq:
    print("Success! Found compound word 'کړه_وړه' with frequency:", freq["کړه_وړه"])
else:
    print("Could not find compound word 'کړه_وړه'. Check text and logic.")
