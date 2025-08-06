import json
import re
from collections import defaultdict

# --- Expanded Verb Lexicon ---
VERB_LEXICON = {
    'خېژول': {
        'type': 'Verb',
        'pattern_info': 'Verb with multiple stems',
        'stems': {
            'imperfective': 'خېژو',     # e.g., خېژوي
            'perfective': 'وخېژو',     # e.g., وخېژوي
            'past_simple': 'وخېژاوه',   # This is a key addition for simple past forms
            'past_participle': 'خېژولی'
        }
    },
    'بوتلل': {
        'type': 'Verb',
        'pattern_info': 'Irregular Verb',
        'stems': { 'imperfective': 'بیای', 'perfective': 'بوځ', 'past_participle': 'بوتللی' }
    },
    # Added more verbs based on grammar examples
    'تلل': {
        'type': 'Verb',
        'pattern_info': 'Class: Simple Verb (to go)',
        'stems': {
            'imperfective_present': 'ځ',
            'perfective_present': 'وځ',
            'imperfective_past': 'تل',
            'perfective_past': 'وتل',
            'past_participle': 'تللی'
        }
    },
    'کول': {
        'type': 'Verb',
        'pattern_info': 'Auxiliary Verb (to do/make)',
        'stems': {
            'imperfective_present': 'کو',
            'perfective_present': 'وکړ',
            'imperfective_past': 'کاوه',
            'perfective_past': 'وکړه',
            'past_participle': 'کړی'
        }
    },
    'کېدل': {
        'type': 'Verb',
        'pattern_info': 'Auxiliary Verb (to become)',
        'stems': {
            'imperfective_present': 'کېږ',
            'perfective_present': 'وش',
            'imperfective_past': 'کېده',
            'perfective_past': 'وشو',
            'past_participle': 'شوی'
        }
    },
    # Add more as needed from master chart patterns
}

# --- Noun/Adj Pattern Lexicon for Irregulars (e.g., Pattern 4) ---
IRREGULAR_NOUN_ADJ_LEXICON = {
    'پښتون': {
        'type': 'Noun/Adj',
        'pattern_info': 'Pattern 4: Pashtoon pattern',
        'inflected_forms': ['پښتانه', 'پښتنو', 'پښتنه', 'پښتنې']
    },
    # Add more irregular words like 'مېلمه', 'کوربه'
    'مېلمه': {
        'type': 'Noun/Adj',
        'pattern_info': 'Pattern 4 variant: Unusual masculine animate',
        'inflected_forms': ['مېلمانه', 'مېلمنو', 'مېلمنې']
    },
    # Shorter words (Pattern 5) could also be added if needed
}

def load_word_data(filepath='all_txt_copies/word_index_v10_final.txt'):
    word_data = {}
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            match = re.match(r'^(.*?) \((\d+)\): (.*)$', line.strip())
            if match:
                word, count, refs_str = match.groups()
                word_data[word] = {'count': int(count), 'verses': refs_str.split(', ')}
    return word_data

def find_root_and_details_final(word, all_words_set):
    """Expanded definitive stem-aware grammar engine with more inflection patterns."""
    
    # Verb Check (unchanged)
    if word in VERB_LEXICON:
        return word, { 'type': 'Verb', 'pattern_info': VERB_LEXICON[word]['pattern_info'], 'form_description': 'Infinitive Root' }

    for root, details in VERB_LEXICON.items():
        sorted_stems = sorted(details['stems'].values(), key=len, reverse=True)
        for stem in sorted_stems:
            if word.startswith(stem):
                return root, { 'type': 'Verb', 'pattern_info': details['pattern_info'], 'form_description': f"Derived from stem '{stem}'" }

    # Check irregular noun/adj lexicon first
    for root, details in IRREGULAR_NOUN_ADJ_LEXICON.items():
        if word in details['inflected_forms']:
            form_desc = f"Inflected form of '{root}'"
            return root, { 'type': details['type'], 'pattern_info': details['pattern_info'], 'form_description': form_desc }

    # Expanded Noun/Adj Patterns (priority order: specific to general)
    
    # Pattern 3/Extra: Ends with 'ۍ' (fem plain/1st for stressed ی or inanimate ي)
    if word.endswith('ۍ'):
        potential_root = re.sub(r'ۍ$', 'ی', word)
        if potential_root in all_words_set:
            return potential_root, { 'type': 'Noun/Adj', 'pattern_info': 'Pattern 3: Stressed ی or Extra inanimate', 'form_description': 'Plain/1st (Fem)' }

    # Extra pattern: 2nd inflection 'یو' for inanimate fem, root ends with 'ي'
    if word.endswith('یو'):
        potential_root_extra = re.sub(r'یو$', 'ي', word)
        if potential_root_extra in all_words_set:
            return potential_root_extra, { 'type': 'Noun/Adj', 'pattern_info': 'Extra: Inanimate fem ي', 'form_description': '2nd Inflection' }

    # Existing Pattern 2/3: Ends with 'ي', 'یو', 'یه' (now distinguishing vocative if applicable)
    if word.endswith(('ي', 'یو', 'یه')):
        potential_root = re.sub(r'(ي|یو|یه)$', '', word) + 'ی'
        if potential_root in all_words_set:
            inf_type = "1st Inflection (Masc)" if word.endswith('ي') else "2nd Inflection (Masc)" if word.endswith('یو') else "Vocative (Masc)"
            pattern_info = 'Pattern 2: Unstressed ی' if inf_type != 'Vocative (Masc)' else 'Vocative Form'
            return potential_root, { 'type': 'Noun/Adj', 'pattern_info': pattern_info, 'form_description': inf_type }

    # Pattern 1: Ends with 'ې' (fem 1st)
    if word.endswith('ې'):
        potential_root = re.sub(r'ې$', 'ه', word)
        if potential_root in all_words_set:
            return potential_root, { 'type': 'Noun/Adj', 'pattern_info': 'Pattern 1: Basic', 'form_description': '1st Inflection (Fem)' }

    # Pattern 1/5: Ends with 'و' (2nd inflection)
    if word.endswith('و'):
        potential_root = word[:-1]
        if potential_root in all_words_set and (potential_root.endswith(('ټ', 'ډ', 'ړ', 'ګ', 'ښ')) or len(potential_root) < 4):  # Rough check for basic or short
            pattern = 'Pattern 1: Basic' if not potential_root.endswith(('ل', 'ر')) else 'Pattern 5: Shorter words'  # Heuristic for short
            return potential_root, { 'type': 'Noun/Adj', 'pattern_info': pattern, 'form_description': '2nd Inflection' }

    # Pattern 5: Ends with 'ه' (masc 1st for squish, heuristic for short words)
    if word.endswith('ه') and len(word) < 5:  # Short word heuristic
        potential_root = word[:-1]
        if potential_root in all_words_set:
            return potential_root, { 'type': 'Noun/Adj', 'pattern_info': 'Pattern 5: Shorter words', 'form_description': '1st Inflection (Masc)' }

    # Fallback for base forms or uninflected
    return word, { 'type': 'Noun/Adj', 'pattern_info': 'N/A', 'form_description': 'Base Form' }

# --- Main Execution ---
word_data = load_word_data()
all_words_set = set(word_data.keys())
final_index = defaultdict(lambda: {'forms': defaultdict(list)})

for word, data in word_data.items():
    root, details = find_root_and_details_final(word, all_words_set)
    
    if root in VERB_LEXICON:
        final_index[root]['type'] = VERB_LEXICON[root]['type']
        final_index[root]['pattern_info'] = VERB_LEXICON[root]['pattern_info']
    elif root in IRREGULAR_NOUN_ADJ_LEXICON:
        final_index[root]['type'] = IRREGULAR_NOUN_ADJ_LEXICON[root]['type']
        final_index[root]['pattern_info'] = IRREGULAR_NOUN_ADJ_LEXICON[root]['pattern_info']
    else:
        _, root_details = find_root_and_details_final(root, all_words_set)
        final_index[root]['type'] = root_details['type']
        final_index[root]['pattern_info'] = root_details['pattern_info']
    
    final_index[root]['forms'][details['form_description']].append({ 'form': word, 'count': data['count'], 'verses': data['verses'] })

output_path = 'all_txt_copies/grammatical_index_v11.json'  # Updated version
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(final_index, f, ensure_ascii=False, indent=2)

print(f"Expanded grammatical index created at: {output_path}")

# Verification (unchanged)
word_to_verify = 'وخېژاوه'
root_to_verify = 'خېژول'
if root_to_verify in final_index and final_index[root_to_verify]['type'] == 'Verb':
    print(f"\nSuccess! Root '{root_to_verify}' is correctly identified as a Verb.")
    if any(item['form'] == word_to_verify for sublist in final_index[root_to_verify]['forms'].values() for item in sublist):
        print(f"Success! Found '{word_to_verify}' and mapped it to root '{root_to_verify}'.")
    else:
        print(f"ERROR: Did not find form '{word_to_verify}' under root.")
else:
    print(f"\nERROR: Failed to correctly identify root '{root_to_verify}'.")

# Additional Verification for New Patterns (Example)
# Assume 'غټې' (fem 1st of 'غټه') maps to 'غټه'
word_to_verify_noun = 'غټې'
root_to_verify_noun = 'غټه'
if root_to_verify_noun in final_index and final_index[root_to_verify_noun]['type'] == 'Noun/Adj':
    print(f"\nSuccess! Root '{root_to_verify_noun}' is correctly identified as Noun/Adj.")
    if any(item['form'] == word_to_verify_noun for sublist in final_index[root_to_verify_noun]['forms'].values() for item in sublist):
        print(f"Success! Found '{word_to_verify_noun}' and mapped it to root '{root_to_verify_noun}'.")
    else:
        print(f"ERROR: Did not find form '{word_to_verify_noun}' under root.")
else:
    print(f"\nERROR: Failed to correctly identify root '{root_to_verify_noun}'.")
