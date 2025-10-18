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
        # Add missing fields for compatibility
        if 'type' not in normalized_value:
            normalized_value['type'] = 'Verb'
        if 'pattern_info' not in normalized_value:
            normalized_value['pattern_info'] = 'Transitive Verb'
        if 'translit' not in normalized_value:
            normalized_value['translit'] = transliterate(key)
        
        for field in ['stems', 'inflected_forms', 'related_roots', 'base_root', 'roots', 'romanization']:
            if field in normalized_value and isinstance(normalized_value[field], dict):
                normalized_value[field] = {k: normalize_pashto_char(v) if isinstance(v, str) else v for k, v in normalized_value[field].items()}
            elif field in normalized_value and isinstance(normalized_value[field], list):
                normalized_value[field] = [normalize_pashto_char(item) for item in normalized_value[field]]
            elif field in normalized_value and isinstance(normalized_value[field], str):
                 normalized_value[field] = normalize_pashto_char(normalized_value[field])
        normalized_lexicon[normalized_key] = normalized_value
    return normalized_lexicon

# --- Definitive Lexicon (v15) ---
def load_verb_lexicon():
    try:
        with open('verbs_lexicon.json', 'r', encoding='utf-8') as f:
            lexicon = json.load(f)
        return normalize_lexicon(lexicon)
    except Exception:
        # Fallback to minimal lexicon if file not found
        return normalize_lexicon({
            'بوتلل': {'type': 'Verb', 'pattern_info': 'Irregular Verb', 'stems': {'imperfective': 'بیای', 'perfective': 'بوځ', 'past_participle': 'بوتللی'}, 'translit': 'botlúl'},
            'رسول': {'type': 'Verb', 'pattern_info': 'Transitive Verb (to deliver/send)', 'stems': {'imperfective': 'رسو', 'perfective': 'ورسو', 'past_participle': 'رسولی'}, 'related_roots': ['پوهول'], 'translit': 'rasawúl'},
            'پوهول': {'type': 'Verb', 'pattern_info': 'Causative Verb (to make understand)', 'stems': {'imperfective': 'پوهو', 'perfective': 'وپوهو', 'past_participle': 'پوهولی'}, 'base_root': 'کول', 'translit': 'pohawúl'}
        })

VERB_LEXICON = load_verb_lexicon()

# --- Function Words Lexicon (Pronouns, Prepositions, Conjunctions) ---
FUNCTION_WORDS_LEXICON = normalize_lexicon({
    # Personal Pronouns
    'زه': {'type': 'Pronoun', 'pattern_info': '1st Person Singular', 'translit': 'zu'},
    'تا': {'type': 'Pronoun', 'pattern_info': '2nd Person Singular', 'translit': 'taa'},
    'هغه': {'type': 'Pronoun', 'pattern_info': '3rd Person Singular Masculine', 'translit': 'hagha'},
    'هغې': {'type': 'Pronoun', 'pattern_info': '3rd Person Singular Feminine', 'translit': 'haghe'},
    'موږ': {'type': 'Pronoun', 'pattern_info': '1st Person Plural', 'translit': 'moonG'},
    'تاسو': {'type': 'Pronoun', 'pattern_info': '2nd Person Plural/Respectful', 'translit': 'taaso'},
    'هغوی': {'type': 'Pronoun', 'pattern_info': '3rd Person Plural', 'translit': 'haghooy'},
    'ما': {'type': 'Pronoun', 'pattern_info': '1st Person Singular Object', 'translit': 'maa'},
    'ستا': {'type': 'Pronoun', 'pattern_info': '2nd Person Singular Possessive', 'translit': 'staa'},

    # Prepositions
    'د': {'type': 'Preposition', 'pattern_info': 'Genitive/Of', 'translit': 'du'},
    'په': {'type': 'Preposition', 'pattern_info': 'In/On/With', 'translit': 'pu'},
    'له': {'type': 'Preposition', 'pattern_info': 'From', 'translit': 'la'},
    'ته': {'type': 'Preposition', 'pattern_info': 'To', 'translit': 'ta'},
    'سره': {'type': 'Preposition', 'pattern_info': 'With', 'translit': 'sara'},
    'پر': {'type': 'Preposition', 'pattern_info': 'On/Upon', 'translit': 'pur'},
    'دپاره': {'type': 'Preposition', 'pattern_info': 'For', 'translit': 'dupara'},
    'څخه': {'type': 'Preposition', 'pattern_info': 'From/Than', 'translit': 'tsukha'},
    'پورې': {'type': 'Preposition', 'pattern_info': 'Until/Up to', 'translit': 'pore'},
    'باندې': {'type': 'Preposition', 'pattern_info': 'On/Over/About', 'translit': 'baande'},

    # Conjunctions
    'او': {'type': 'Conjunction', 'pattern_info': 'And', 'translit': 'aw'},
    'چې': {'type': 'Conjunction', 'pattern_info': 'That/So/If', 'translit': 'che'},
    'نو': {'type': 'Conjunction', 'pattern_info': 'So/Then', 'translit': 'no'},
    'یا': {'type': 'Conjunction', 'pattern_info': 'Or', 'translit': 'yaa'},
    'بلکې': {'type': 'Conjunction', 'pattern_info': 'But/Rather', 'translit': 'balke'},
    'ځکه': {'type': 'Conjunction', 'pattern_info': 'Because', 'translit': 'dzuka'},

    # Particles/Adverbs
    'به': {'type': 'Particle', 'pattern_info': 'Future Tense Marker', 'translit': 'ba'},
    'نه': {'type': 'Particle', 'pattern_info': 'Negation', 'translit': 'na'},
    'هم': {'type': 'Particle', 'pattern_info': 'Also/Too', 'translit': 'hum'},
    'خو': {'type': 'Particle', 'pattern_info': 'But/However', 'translit': 'kho'},
    'یا': {'type': 'Particle', 'pattern_info': 'Or', 'translit': 'yaa'},
    'تل': {'type': 'Adverb', 'pattern_info': 'Always/Forever', 'translit': 'tul'},
    'اوس': {'type': 'Adverb', 'pattern_info': 'Now', 'translit': 'oos'},
    'بیا': {'type': 'Adverb', 'pattern_info': 'Again', 'translit': 'byaa'},
    'وروسته': {'type': 'Adverb', 'pattern_info': 'After/Later', 'translit': 'wroosta'},
    'مخکې': {'type': 'Adverb', 'pattern_info': 'Before', 'translit': 'mukhke'},
    'هلته': {'type': 'Adverb', 'pattern_info': 'There', 'translit': 'halta'},
    'دلته': {'type': 'Adverb', 'pattern_info': 'Here', 'translit': 'dalta'},
    'چېرې': {'type': 'Adverb', 'pattern_info': 'Where', 'translit': 'chere'},
    'څنګه': {'type': 'Adverb', 'pattern_info': 'How', 'translit': 'tsanga'},
    'ولې': {'type': 'Adverb', 'pattern_info': 'Why', 'translit': 'wale'},
})

IRREGULAR_NOUN_ADJ_LEXICON = normalize_lexicon({
    'پښتون': {'type': 'Noun/Adj', 'pattern_info': 'Pattern 4: Pashtoon', 'inflected_forms': ['پښتانه', 'پښتنو', 'پښتنه', 'پښتنې'], 'translit': 'puxtoon'},
    # Common nouns
    'سړی': {'type': 'Noun', 'pattern_info': 'Pattern 4 Masculine Animate', 'inflected_forms': ['سړي', 'سړیو', 'سړی', 'سړي'], 'translit': 'saRay'},
    'ښځه': {'type': 'Noun', 'pattern_info': 'Feminine Noun', 'inflected_forms': ['ښځې', 'ښځو', 'ښځه', 'ښځو'], 'translit': 'xudza'},
    'کور': {'type': 'Noun', 'pattern_info': 'Masculine Noun', 'inflected_forms': ['کورونه', 'کورونو', 'کور', 'کورونو'], 'translit': 'kor'},
    'لاره': {'type': 'Noun', 'pattern_info': 'Feminine Noun', 'inflected_forms': ['لارې', 'لارو', 'لاره', 'لارو'], 'translit': 'laara'},
    'مور': {'type': 'Noun', 'pattern_info': 'Feminine Animate', 'inflected_forms': ['مور', 'مورو', 'مور', 'مورو'], 'translit': 'mor'},
    'پلار': {'type': 'Noun', 'pattern_info': 'Masculine Animate', 'inflected_forms': ['پلار', 'پلارو', 'پلار', 'پلارو'], 'translit': 'plaar'},
    'زوی': {'type': 'Noun', 'pattern_info': 'Masculine Animate', 'inflected_forms': ['زوی', 'زویو', 'زوی', 'زویو'], 'translit': 'zooy'},
    'لور': {'type': 'Noun', 'pattern_info': 'Feminine Animate', 'inflected_forms': ['لور', 'لورو', 'لور', 'لورو'], 'translit': 'lor'},
    'ماشوم': {'type': 'Noun', 'pattern_info': 'Masculine Animate', 'inflected_forms': ['ماشومان', 'ماشومانو', 'ماشوم', 'ماشومانو'], 'translit': 'maashoom'},
    'ځان': {'type': 'Noun', 'pattern_info': 'Reflexive Pronoun', 'inflected_forms': ['ځان', 'ځان', 'ځان', 'ځان'], 'translit': 'dzaan'},
    'وخت': {'type': 'Noun', 'pattern_info': 'Masculine Noun', 'inflected_forms': ['وختونه', 'وختونو', 'وخت', 'وختونو'], 'translit': 'wakht'},
    'کار': {'type': 'Noun', 'pattern_info': 'Masculine Noun', 'inflected_forms': ['کارونه', 'کارونو', 'کار', 'کارونو'], 'translit': 'kaar'},
    'سر': {'type': 'Noun', 'pattern_info': 'Masculine Noun', 'inflected_forms': ['سرونه', 'سرونو', 'سر', 'سرونو'], 'translit': 'sar'},
    'لاس': {'type': 'Noun', 'pattern_info': 'Masculine Noun', 'inflected_forms': ['لاسونه', 'لاسونو', 'لاس', 'لاسونو'], 'translit': 'laas'},
    'غوږ': {'type': 'Noun', 'pattern_info': 'Masculine Noun', 'inflected_forms': ['غوږونه', 'غوږونو', 'غوږ', 'غوږونو'], 'translit': 'ghwuG'},
    'زړه': {'type': 'Noun', 'pattern_info': 'Feminine Noun', 'inflected_forms': ['زړونې', 'زړونو', 'زړه', 'زړونو'], 'translit': 'zRu'},
    'ورځ': {'type': 'Noun', 'pattern_info': 'Feminine Noun', 'inflected_forms': ['ورځې', 'ورځو', 'ورځ', 'ورځو'], 'translit': 'wradz'},
    'شپه': {'type': 'Noun', 'pattern_info': 'Feminine Noun', 'inflected_forms': ['شپې', 'شپو', 'شپه', 'شپو'], 'translit': 'shpa'},
    'میاشت': {'type': 'Noun', 'pattern_info': 'Feminine Noun', 'inflected_forms': ['میاشتې', 'میاشتو', 'میاشت', 'میاشتو'], 'translit': 'myaasht'},
    'کال': {'type': 'Noun', 'pattern_info': 'Masculine Noun', 'inflected_forms': ['کلونه', 'کلونو', 'کال', 'کلونو'], 'translit': 'kaal'},
    'ښار': {'type': 'Noun', 'pattern_info': 'Masculine Noun', 'inflected_forms': ['ښارونه', 'ښارونو', 'ښار', 'ښارونو'], 'translit': 'xaar'},
    'کتاب': {'type': 'Noun', 'pattern_info': 'Masculine Noun', 'inflected_forms': ['کتابونه', 'کتابونو', 'کتاب', 'کتابونو'], 'translit': 'kitaab'},
    'دعا': {'type': 'Noun', 'pattern_info': 'Feminine Noun', 'inflected_forms': ['دعاګانې', 'دعاګانو', 'دعا', 'دعاګانو'], 'translit': 'duaa'},
    'ایمان': {'type': 'Noun', 'pattern_info': 'Masculine Noun', 'inflected_forms': ['ایمانونه', 'ایمانونو', 'ایمان', 'ایمانونو'], 'translit': 'eemaan'},
    'روح': {'type': 'Noun', 'pattern_info': 'Masculine Noun', 'inflected_forms': ['روحونه', 'روحونو', 'روح', 'روحونو'], 'translit': 'rooh'},
    'قدرت': {'type': 'Noun', 'pattern_info': 'Masculine Noun', 'inflected_forms': ['قدرتونه', 'قدرتونو', 'قدرت', 'قدرتونو'], 'translit': 'qudrat'},
    'قوم': {'type': 'Noun', 'pattern_info': 'Masculine Noun', 'inflected_forms': ['قومونه', 'قومونو', 'قوم', 'قومونو'], 'translit': 'qom'},
    'شریعت': {'type': 'Noun', 'pattern_info': 'Masculine Noun', 'inflected_forms': ['شریعتونه', 'شریعتونو', 'شریعت', 'شریعتونو'], 'translit': 'shariyaat'},
    'آسمان': {'type': 'Noun', 'pattern_info': 'Masculine Noun', 'inflected_forms': ['آسمانونه', 'آسمانونو', 'آسمان', 'آسمانونو'], 'translit': 'aasamaan'},
    'انسان': {'type': 'Noun', 'pattern_info': 'Masculine Animate', 'inflected_forms': ['انسانان', 'انسانانو', 'انسان', 'انسانانو'], 'translit': 'insaana'},
    'ځان': {'type': 'Noun', 'pattern_info': 'Reflexive', 'inflected_forms': ['ځان', 'ځان', 'ځان', 'ځان'], 'translit': 'dzaan'},
})

# --- Word Data Loading (Normalized) ---
def load_word_data(filepath='word_index_v10_final.txt'):
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
        # B. Stem-based derivation - sort by length (longest first) to handle ambiguity
        stems = list(details['stems'].items())
        stems.sort(key=lambda x: len(x[1]), reverse=True)  # Sort by stem length, longest first
        for stem_type, stem_form in stems:
            if word.startswith(stem_form):
                # This is where detailed conjugation labels would be generated.
                # For now, we keep it simple.
                desc = f"Conjugation from {stem_type} stem '{stem_form}'"
                interpretations.append((root, {'type': 'Verb', 'pattern_info': details['pattern_info'], 'form_description': desc}))
        # C. Related root match
        if 'related_roots' in details and word in details['related_roots']:
            interpretations.append((root, {'type': 'Verb', 'pattern_info': details['pattern_info'], 'form_description': f"Related Root: '{word}'"}))

    # 2. Function Word Analysis (Pronouns, Prepositions, etc.)
    for root, details in FUNCTION_WORDS_LEXICON.items():
        if word == root:
            interpretations.append((root, {'type': details['type'], 'pattern_info': details['pattern_info'], 'form_description': 'Function Word'}))

    # 3. Noun/Adj Analysis
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

    # 4. Verb Conjugation Analysis using verb inflector
    try:
        from verb_inflector import find_lexicon_root_for_form
        if find_lexicon_root_for_form:
            root_from_form = find_lexicon_root_for_form(word)
            if root_from_form and root_from_form in VERB_LEXICON:
                details = VERB_LEXICON[root_from_form]
                interpretations.append((root_from_form, {'type': 'Verb', 'pattern_info': details['pattern_info'], 'form_description': f'Conjugated form of "{root_from_form}"'}))
    except ImportError:
        # If verb_inflector is not available, skip conjugation analysis
        pass
    except Exception:
        # If there's any other error, skip conjugation analysis
        pass

    # 5. Fallback for un-lexiconed words
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
            lexicon_entry = VERB_LEXICON.get(root) or IRREGULAR_NOUN_ADJ_LEXICON.get(root) or FUNCTION_WORDS_LEXICON.get(root)
            identity = {
                'type': details['type'],
                'pattern_info': lexicon_entry.get('pattern_info', 'N/A') if lexicon_entry else 'Regular Noun/Adj',
                'translit': lexicon_entry.get('translit', '') if lexicon_entry else transliterate(root),
                'forms': defaultdict(list)
            }
            final_index[root]['identities'].append(identity)
            
        identity['forms'][details['form_description']].append({
            'form': word,
            'translit': transliterate(word) # Transliterate each form
        })

output_path = 'grammatical_index_v15.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(final_index, f, ensure_ascii=False, indent=2)

print(f"Definitive grammatical index (v15) with transliteration created at: {output_path}")
