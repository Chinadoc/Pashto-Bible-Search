import os
import re
from collections import defaultdict

# Function to convert Persian/Pashto digits to integer
def persian_to_int(s):
    persian_digits = {'۰': 0, '۱': 1, '۲': 2, '۳': 3, '۴': 4, '۵': 5, '۶': 6, '۷': 7, '۸': 8, '۹': 9}
    result = 0
    for char in s:
        if char in persian_digits:
            result = result * 10 + persian_digits[char]
        else:
            return None
    return result

# Book name mapping
book_map = {
    'acts': 'Acts',
    'colossians': 'Colossians',
    'ephesians': 'Ephesians',
    'galatians': 'Galatians',
    'hebrews': 'Hebrews',
    'james': 'James',
    'john': 'John',
    'jude': 'Jude',
    'luke': 'Luke',
    'mark': 'Mark',
    'matthew': 'Matthew',
    'philemon': 'Philemon',
    'philippians': 'Philippians',
    'revelation': 'Revelation',
    'romans': 'Romans',
    'titus': 'Titus',
}

index = defaultdict(list)
freq = defaultdict(int)
punct = '.,:;!?؟،؛"\'()[]{}“”'

txt_dir = 'all_txt_copies'
for filename in os.listdir(txt_dir):
    if filename.endswith('_pashto.txt'):
        base = filename.replace('_pashto.txt', '')
        match = re.match(r'([a-z]+)(\d+)', base)
        if match:
            book_prefix = match.group(1)
            chapter = int(match.group(2))
            book = book_map.get(book_prefix, book_prefix.capitalize())

            filepath = os.path.join(txt_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                lines = f.readlines()

            current_verse = None
            verse_text = []
            for line in lines:
                stripped = line.strip()
                verse_num = persian_to_int(stripped)
                if verse_num is not None:
                    if current_verse is not None:
                        text = ' '.join(verse_text).strip()
                        words = re.split(r'\s+', text)
                        ref = f"{book} {chapter}:{current_verse}"
                        for word in words:
                            clean_word = word.strip(punct)
                            if clean_word:
                                index[clean_word].append(ref)
                                freq[clean_word] += 1
                    current_verse = verse_num
                    verse_text = []
                elif current_verse is not None:
                    verse_text.append(stripped)

            # Process the last verse
            if current_verse is not None:
                text = ' '.join(verse_text).strip()
                words = re.split(r'\s+', text)
                ref = f"{book} {chapter}:{current_verse}"
                for word in words:
                    clean_word = word.strip(punct)
                    if clean_word:
                        index[clean_word].append(ref)
                        freq[clean_word] += 1

# Sort words by frequency descending
sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)

# Output to file
output_file = os.path.join(txt_dir, 'word_index.txt')
with open(output_file, 'w', encoding='utf-8') as out:
    for word, count in sorted_words:
        unique_verses = ', '.join(sorted(set(index[word])))
        out.write(f"{word} ({count}): {unique_verses}\n")

print("Index created in", output_file) 