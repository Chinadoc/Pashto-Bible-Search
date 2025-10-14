import json
import re
from collections import defaultdict

# --- Transliteration Engine (based on LingDocs Phonetics) ---
# NOTE: This is a simplified, rule-based transliterator. A full dictionary-based one would be more accurate.
TRANSLIT_MAP = {
    'ا': 'aa', 'آ': 'aa', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ټ': 'T', 'ث': 's', 'ج': 'j',
    'چ': 'ch', 'ح': 'h', 'خ': 'kh', 'څ': 'ts', 'ځ': 'dz', 'د': 'd', 'ډ': 'D', 'ذ': 'z',
    'ر': 'r', 'ړ': 'R', 'ز': 'z', 'ژ': 'jz', 'ږ': 'G', 'س': 's', 'ش': 'sh', 'ښ': 'x',
    'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': "'", 'غ': 'gh', 'ف': 'f', 'ق': 'q',
    'ک': 'k', 'ګ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ڼ': 'N', 'و': 'w', 'ه': 'h',
    'ی': 'y', 'ې': 'e', 'ۍ': 'uy', 'ئ': 'ey'
    # Short vowels are harder and context-dependent, this is a major simplification.
}
# Common vowel combinations
TRANSLIT_MAP.update({'وا': 'waa', 'وي': 'wee', 'وو': 'oo'})

def transliterate(text):
    """Simple rule-based transliteration of Pashto text."""
    # This is a very basic implementation. A real one needs complex context rules.
    # For now, we'll just do character-by-character replacement.
    res = ""
    i = 0
    while i < len(text):
        # Check for two-character patterns first
        if i + 1 < len(text) and text[i:i+2] in TRANSLIT_MAP:
            res += TRANSLIT_MAP[text[i:i+2]]
            i += 2
        elif text[i] in TRANSLIT_MAP:
            res += TRANSLIT_MAP[text[i]]
            i += 1
        else:
            res += text[i] # Keep unknown characters
            i += 1
    return res

# --- Unicode Normalization ---
def normalize_pashto_char(text):
    replacements = {'ي': 'ی', 'ى': 'ی', 'ئ': 'ی'}
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

def normalize_lexicon(lexicon):
    normalized_lexicon = {}
    for key, value in lexicon.items():
        normalized_key = normalize_pashto_char(key)
        normalized_value = value.copy()
        for field in ['stems', 'inflected_forms', 'related_roots', 'base_root']:
            if field in normalized_value and isinstance(normalized_value[field], dict):
                normalized_value[field] = {k: normalize_pashto_char(v) for k, v in normalized_value[field].items()}
            elif field in normalized_value and isinstance(normalized_value[field], list):
                normalized_value[field] = [normalize_pashto_char(item) for item in normalized_value[field]]
            elif field in normalized_value and isinstance(normalized_value[field], str):
                 normalized_value[field] = normalize_pashto_char(normalized_value[field])
        normalized_lexicon[normalized_key] = normalized_value
    return normalized_lexicon

# --- Definitive Lexicon (v15) ---
VERB_LEXICON = normalize_lexicon({
    'بوتلل': {'type': 'Verb', 'pattern_info': 'Irregular Verb', 'stems': {'imperfective': 'بیای', 'perfective': 'بوځ', 'past_participle': 'بوتللی'}, 'translit': 'botlúl'},
    'رسول': {'type': 'Verb', 'pattern_info': 'Transitive Verb (to deliver/send)', 'stems': {'imperfective': 'رسو', 'perfective': 'ورسو', 'past_participle': 'رسولی'}, 'related_roots': ['پوهول'], 'translit': 'rasawúl'},
    'پوهول': {'type': 'Verb', 'pattern_info': 'Causative Verb (to make understand)', 'stems': {'imperfective': 'پوهو', 'perfective': 'وپوهو', 'past_participle': 'پوهولی'}, 'base_root': 'کول', 'translit': 'pohawúl'}
    # Add other verbs from previous versions...
})

IRREGULAR_NOUN_ADJ_LEXICON = normalize_lexicon({
    'پښتون': {'type': 'Noun/Adj', 'pattern_info': 'Pattern 4: Pashtoon', 'inflected_forms': ['پښتانه', 'پښتنو', 'پښتنه', 'پښتنې'], 'translit': 'puxtoon'},
    # Add other nouns...
})

# --- Word Data Loading (Normalized) ---
def load_word_data(filepath='all_txt_copies/word_index_v10_final.txt'):
    word_data = {}
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            match = re.match(r'^(.*?) \((\d+)\): (.*)$', line.strip())
            if match:
                word, count, refs_str = match.groups()
                normalized_word = normalize_pashto_char(word)
                if normalized_word in word_data:
                    word_data[normalized_word]['count'] += int(count)
                    word_data[normalized_word]['verses'].extend(refs_str.split(', '))
                else:
                    word_data[normalized_word] = {'count': int(count), 'verses': list(set(refs_str.split(', ')))}
    return word_data

# --- Definitive Grammar Engine (v15) ---
def find_all_possible_roots(word, all_words_set):
    interpretations = []
    
    # 1. Verb Analysis
    for root, details in VERB_LEXICON.items():
        # A. Direct infinitive match
        if word == root:
            interpretations.append((root, {'type': 'Verb', 'pattern_info': details['pattern_info'], 'form_description': 'Infinitive Root'}))
        # B. Stem-based derivation
        for stem_type, stem_form in details['stems'].items():
            if word.startswith(stem_form):
                # This is where detailed conjugation labels would be generated.
                # For now, we keep it simple.
                desc = f"Conjugation from {stem_type} stem '{stem_form}'"
                interpretations.append((root, {'type': 'Verb', 'pattern_info': details['pattern_info'], 'form_description': desc}))
        # C. Related root match
        if 'related_roots' in details and word in details['related_roots']:
            interpretations.append((root, {'type': 'Verb', 'pattern_info': details['pattern_info'], 'form_description': f"Related Root: '{word}'"}))

    # 2. Noun/Adj Analysis
    for root, details in IRREGULAR_NOUN_ADJ_LEXICON.items():
        if word == root:
            interpretations.append((root, {'type': 'Noun/Adj', 'pattern_info': details['pattern_info'], 'form_description': 'Base Form (Masc. Plain)'}))
        elif word in details['inflected_forms']:
             # This is where detailed inflection labels would be generated.
            desc = f"Inflection of '{root}'"
            interpretations.append((root, {'type': 'Noun/Adj', 'pattern_info': details['pattern_info'], 'form_description': desc}))
            
    # 3. Regular Noun/Adj Analysis (NEW)
    # Simple rule: if a word ends in a common plural, and its singular form exists, link them.
    # This is a basic approach and can be expanded.
    plural_endings = ["ان", "انو"]
    for ending in plural_endings:
        if word.endswith(ending):
            possible_root = word[:-len(ending)]
            if possible_root in all_words_set:
                 desc = f"Inflection of '{possible_root}'"
                 interpretations.append((possible_root, {'type': 'Noun/Adj', 'pattern_info': 'Regular Noun/Adj', 'form_description': desc}))


    # 4. Fallback for un-lexiconed words
    if not interpretations and word in all_words_set:
        interpretations.append((word, {'type': 'Unknown', 'pattern_info': 'N/A', 'form_description': 'Base Form'}))

    # Remove duplicates
    unique_interpretations = []
    seen = set()
    for r, d in interpretations:
        key = (r, d['type'], d['form_description'])
        if key not in seen:
            unique_interpretations.append((r, d))
            seen.add(key)
    return unique_interpretations

# --- Main Execution ---
word_data = load_word_data()
all_words_set = set(word_data.keys())
final_index = defaultdict(lambda: {"identities": []})

for word, data in word_data.items():
    interpretations = find_all_possible_roots(word, all_words_set)
    if not interpretations:
        interpretations = [(word, {'type': 'Unknown', 'pattern_info': 'N/A', 'form_description': 'Base Form'})]
    
    for root, details in interpretations:
        identity = next((id_obj for id_obj in final_index[root]['identities'] if id_obj['type'] == details['type']), None)
        
        if identity is None:
            lexicon_entry = VERB_LEXICON.get(root) or IRREGULAR_NOUN_ADJ_LEXICON.get(root)
            identity = {
                'type': details['type'],
                'pattern_info': lexicon_entry.get('pattern_info', 'N/A') if lexicon_entry else 'Regular Noun/Adj',
                'translit': lexicon_entry.get('translit', '') if lexicon_entry else transliterate(root),
                'forms': defaultdict(list)
            }
            final_index[root]['identities'].append(identity)
            
        identity['forms'][details['form_description']].append({
            'form': word,
            'count': data['count'],
            'verses': data['verses'],
            'translit': transliterate(word) # Transliterate each form
        })

output_path = 'all_txt_copies/grammatical_index_v15.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(final_index, f, ensure_ascii=False, indent=2)

print(f"Definitive grammatical index (v15) with transliteration created at: {output_path}")
