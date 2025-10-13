import re

def find_word_in_index(word_to_find, filepath='all_txt_copies/word_index_v4_compound.txt'):
    """
    Reads the index file line by line and prints any line containing the specified word.
    """
    print(f"Searching for '{word_to_find}' in '{filepath}'...")
    found = False
    with open(filepath, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            # The word could be at the beginning of the line
            if re.search(f'^{re.escape(word_to_find)}\s', line):
                print(f"Found exact match on line {i+1}: {line.strip()}")
                found = True
    
    if not found:
        print(f"\nCould not find an exact match for '{word_to_find}'.")
        print("Searching for close matches (words containing the letters)...")
        with open(filepath, 'r', encoding='utf-8') as f:
            for i, line in enumerate(f):
                 # Looser search for lines containing the characters
                if 'م' in line and 'ې' in line and 'ن' in line and 'ځ' in line:
                    print(f"Found potential close match on line {i+1}: {line.strip()}")


find_word_in_index("مېنځ")
