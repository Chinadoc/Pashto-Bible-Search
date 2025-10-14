
import json
import re
from collections import Counter
import os

def get_bible_text_from_files():
    """
    Reads all .txt files from the 'all_txt_copies' directory and
    combines them into a single string.
    """
    data_dir = 'all_txt_copies'
    if not os.path.exists(data_dir):
        print(f"Error: Directory '{data_dir}' not found.")
        return ""

    full_text = []
    for filename in os.listdir(data_dir):
        if filename.endswith(".txt"):
            with open(os.path.join(data_dir, filename), 'r', encoding='utf-8') as f:
                full_text.append(f.read())

    return " ".join(full_text)

def build_word_frequency_list():
    """
    Generates a word frequency list from the Bible text, including romanizations and parts of speech.
    """
    # 1. Load the full dictionary
    try:
        with open('full_dictionary.json', 'r', encoding='utf-8') as f:
            full_dict_list = json.load(f)
    except FileNotFoundError:
        print("Error: full_dictionary.json not found. Please run build_full_dictionary.py first.")
        return

    # Create a lookup map for faster access
    dictionary_map = {item['p']: item for item in full_dict_list}

    # 2. Get the full Bible text from the source files
    bible_text = get_bible_text_from_files()
    if not bible_text:
        print("Could not get Bible text from files. Aborting.")
        return

    # 3. Tokenize the text (split into words)
    words = re.findall(r'[\u0600-\u06FF]+', bible_text)

    # 4. Calculate word frequency
    word_counts = Counter(words)

    # 5. Create the final list with romanization and part of speech
    frequency_list = []
    for word, count in word_counts.items():
        entry = dictionary_map.get(word)
        romanization = entry.get('g', 'not_found') if entry else 'not_found'
        pos = entry.get('t', 'unknown') if entry else 'unknown'
        
        frequency_list.append({
            'pashto': word,
            'frequency': count,
            'romanization': romanization,
            'pos': pos
        })

    # Sort by frequency
    frequency_list.sort(key=lambda x: x['frequency'], reverse=True)

    # 6. Save to a new JSON file
    with open('word_frequency_list.json', 'w', encoding='utf-8') as f:
        json.dump(frequency_list, f, ensure_ascii=False, indent=4)

    print(f"Successfully built word_frequency_list.json with {len(frequency_list)} unique words.")

if __name__ == '__main__':
    build_word_frequency_list()
