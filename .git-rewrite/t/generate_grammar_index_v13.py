import json
import re
from collections import defaultdict

# --- Unicode Normalization ---
def normalize_pashto_char(text):
    """Replaces different forms of 'yeh' and other chars with a standard one."""
    replacements = {
        'ي': 'ی',  # Arabic Yeh to Farsi Yeh
        'ى': 'ی',  # Alef Maksura to Farsi Yeh
        'ئ': 'ی',  # Yeh with Hamza Above to Farsi Yeh
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

# --- Lexicon Normalization ---
def normalize_lexicon(lexicon):
    """Normalizes all keys and relevant string values in the lexicon."""
    normalized_lexicon = {}
    for key, value in lexicon.items():
        normalized_key = normalize_pashto_char(key)
        if isinstance(value, dict):
            normalized_value = value.copy()
            if 'stems' in normalized_value:
                normalized_value['stems'] = {
                    k: normalize_pashto_char(v) for k, v in normalized_value['stems'].items()
                }
            if 'inflected_forms' in normalized_value:
                normalized_value['inflected_forms'] = [
                    normalize_pashto_char(form) for form in normalized_value['inflected_forms']
                ]
            normalized_lexicon[normalized_key] = normalized_value
        else:
            normalized_lexicon[normalized_key] = value
    return normalized_lexicon

# --- Expanded Verb Lexicon (v13 - Normalized) ---
VERB_LEXICON = normalize_lexicon({
    'خېژول': {
        'type': 'Verb',
        'pattern_info': 'Verb with multiple stems',
        'stems': {
            'imperfective': 'خېژو', 'perfective': 'وخېژو',
            'past_simple': 'وخېژاوه', 'past_participle': 'خېژولی'
        }
    },
    'بوتلل': {
        'type': 'Verb', 'pattern_info': 'Irregular Verb',
        'stems': { 'imperfective': 'بیای', 'perfective': 'بوځ', 'past_participle': 'بوتللی' }
    },
    'تلل': {
        'type': 'Verb', 'pattern_info': 'Class: Simple Verb (to go)',
        'stems': {
            'imperfective_present': 'ځ', 'perfective_present': 'وځ', 'imperfective_past': 'تل',
            'perfective_past': 'وتل', 'past_participle': 'تللی'
        }
    },
    'کول': {
        'type': 'Verb', 'pattern_info': 'Auxiliary Verb (to do/make)',
        'stems': {
            'imperfective_present': 'کو', 'perfective_present': 'وکړ', 'imperfective_past': 'کاوه',
            'perfective_past': 'وکړه', 'past_participle': 'کړی'
        }
    },
    'کېدل': {
        'type': 'Verb', 'pattern_info': 'Auxiliary Verb (to become)',
        'stems': {
            'imperfective_present': 'کېږ', 'perfective_present': 'وش', 'imperfective_past': 'کېده',
            'perfective_past': 'وشو', 'past_participle': 'شوی'
        }
    },
    'رسول': {
        'type': 'Verb', 'pattern_info': 'Transitive Verb',
        'stems': {
            'imperfective': 'رسو', 'perfective': 'ورسو', 'past_participle': 'رسولی'
        }
    }
})

# --- Noun/Adj Pattern Lexicon for Irregulars (v13 - Normalized) ---
IRREGULAR_NOUN_ADJ_LEXICON = normalize_lexicon({
    'پښتون': {
        'type': 'Noun/Adj', 'pattern_info': 'Pattern 4: Pashtoon pattern',
        'inflected_forms': ['پښتانه', 'پښتنو', 'پښتنه', 'پښتنې']
    },
    'مېلمه': {
        'type': 'Noun/Adj', 'pattern_info': 'Pattern 4 variant: Unusual masculine animate',
        'inflected_forms': ['مېلمانه', 'مېلمنو', 'مېلمنې']
    },
})

def load_word_data(filepath='all_txt_copies/word_index_v10_final.txt'):
    word_data = {}
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            match = re.match(r'^(.*?) \((\d+)\): (.*)$', line.strip())
            if match:
                word, count, refs_str = match.groups()
                # Normalize word as it's being loaded
                normalized_word = normalize_pashto_char(word)
                if normalized_word in word_data:
                    # If normalized form already exists, merge the data
                    word_data[normalized_word]['count'] += int(count)
                    word_data[normalized_word]['verses'].extend(refs_str.split(', '))
                else:
                    word_data[normalized_word] = {'count': int(count), 'verses': refs_str.split(', ')}
    return word_data

def find_all_possible_roots(word, all_words_set):
    possible_interpretations = []
    
    # 1. Verb Check
    if word in VERB_LEXICON:
        details = VERB_LEXICON[word]
        possible_interpretations.append((
            word,
            {'type': details['type'], 'pattern_info': details['pattern_info'], 'form_description': 'Infinitive Root'}
        ))
    for root, details in VERB_LEXICON.items():
        sorted_stems = sorted(details['stems'].values(), key=len, reverse=True)
        for stem in sorted_stems:
            if word.startswith(stem):
                possible_interpretations.append((
                    root,
                    {'type': details['type'], 'pattern_info': details['pattern_info'], 'form_description': f"Derived from stem '{stem}'"}
                ))

    # 2. Noun/Adj Check (Irregular)
    for root, details in IRREGULAR_NOUN_ADJ_LEXICON.items():
        if word == root:
             possible_interpretations.append((
                root,
                {'type': details['type'], 'pattern_info': details['pattern_info'], 'form_description': 'Base Form'}
            ))
        if word in details['inflected_forms']:
            possible_interpretations.append((
                root,
                {'type': details['type'], 'pattern_info': details['pattern_info'], 'form_description': f"Inflected form of '{root}'"}
            ))

    # 4. Fallback for base nouns
    if word in all_words_set:
        is_already_identified_as_noun = any(
            interp[0] == word and interp[1]['type'] == 'Noun/Adj'
            for interp in possible_interpretations
        )
        if not is_already_identified_as_noun:
            possible_interpretations.append((
                word,
                {'type': 'Noun/Adj', 'pattern_info': 'N/A', 'form_description': 'Base Form'}
            ))

    unique_interpretations = []
    seen = set()
    for r, d in possible_interpretations:
        key = (r, d['type']) # Consolidate forms under the same root/type
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
        identity = None
        for id_obj in final_index[root]['identities']:
            if id_obj['type'] == details['type']:
                identity = id_obj
                break
        
        if identity is None:
            root_details = VERB_LEXICON.get(root) or IRREGULAR_NOUN_ADJ_LEXICON.get(root)
            pattern_info = root_details['pattern_info'] if root_details else details['pattern_info']
            identity = {
                'type': details['type'],
                'pattern_info': pattern_info,
                'forms': defaultdict(list)
            }
            final_index[root]['identities'].append(identity)
            
        identity['forms'][details['form_description']].append({
            'form': word,
            'count': data['count'],
            'verses': data['verses']
        })

output_path = 'all_txt_copies/grammatical_index_v13_normalized.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(final_index, f, ensure_ascii=False, indent=2)

print(f"Normalized, homonym-aware grammatical index created at: {output_path}")
