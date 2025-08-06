import json
import re
from collections import defaultdict

def normalize_pashto_char(text):
    """Replaces different forms of 'yeh' and other chars with a standard one."""
    replacements = {'ي': 'ی', 'ى': 'ی', 'ئ': 'ی'}
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

def normalize_lexicon(lexicon):
    """Normalizes all keys and relevant string values in the lexicon."""
    normalized_lexicon = {}
    for key, value in lexicon.items():
        normalized_key = normalize_pashto_char(key)
        normalized_value = value.copy()
        if 'stems' in normalized_value:
            normalized_value['stems'] = {k: normalize_pashto_char(v) for k, v in normalized_value['stems'].items()}
        if 'inflected_forms' in normalized_value:
            normalized_value['inflected_forms'] = [normalize_pashto_char(form) for form in normalized_value['inflected_forms']]
        if 'related_roots' in normalized_value:
            normalized_value['related_roots'] = [normalize_pashto_char(root) for root in normalized_value['related_roots']]
        if 'base_root' in normalized_value:
            normalized_value['base_root'] = normalize_pashto_char(normalized_value['base_root'])
        normalized_lexicon[normalized_key] = normalized_value
    return normalized_lexicon

# --- Definitive Verb Lexicon (v14) ---
VERB_LEXICON = normalize_lexicon({
    'خېژول': {'type': 'Verb', 'pattern_info': 'Verb with multiple stems', 'stems': {'imperfective': 'خېژو', 'perfective': 'وخېژو', 'past_simple': 'وخېژاوه', 'past_participle': 'خېژولی'}},
    'بوتلل': {'type': 'Verb', 'pattern_info': 'Irregular Verb', 'stems': {'imperfective': 'بیای', 'perfective': 'بوځ', 'past_participle': 'بوتللی'}},
    'تلل': {'type': 'Verb', 'pattern_info': 'Class: Simple Verb (to go)', 'stems': {'imperfective_present': 'ځ', 'perfective_present': 'وځ', 'imperfective_past': 'تل', 'perfective_past': 'وتل', 'past_participle': 'تللی'}},
    'کول': {'type': 'Verb', 'pattern_info': 'Auxiliary Verb (to do/make)', 'stems': {'imperfective_present': 'کو', 'perfective_present': 'وکړ', 'imperfective_past': 'کاوه', 'perfective_past': 'وکړه', 'past_participle': 'کړی'}},
    'کېدل': {'type': 'Verb', 'pattern_info': 'Auxiliary Verb (to become)', 'stems': {'imperfective_present': 'کېږ', 'perfective_present': 'وش', 'imperfective_past': 'کېده', 'perfective_past': 'وشو', 'past_participle': 'شوی'}},
    'رسول': {'type': 'Verb', 'pattern_info': 'Transitive Verb (to deliver/send)', 'stems': {'imperfective': 'رسو', 'perfective': 'ورسو', 'past_participle': 'رسولی'}, 'related_roots': ['پوهول', 'تسلیمول', 'راوړل']},
    'پوهول': {'type': 'Verb', 'pattern_info': 'Causative Verb (to make understand)', 'stems': {'imperfective': 'پوهو', 'perfective': 'وپوهو', 'past_participle': 'پوهولی'}, 'base_root': 'کول', 'related_roots': ['رسول']}
})

IRREGULAR_NOUN_ADJ_LEXICON = normalize_lexicon({
    'پښتون': {'type': 'Noun/Adj', 'pattern_info': 'Pattern 4: Pashtoon pattern', 'inflected_forms': ['پښتانه', 'پښتنو', 'پښتنه', 'پښتنې']},
    'مېلمه': {'type': 'Noun/Adj', 'pattern_info': 'Pattern 4 variant: Unusual masculine animate', 'inflected_forms': ['مېلمانه', 'مېلمنو', 'مېلمنې']}
})

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

def find_all_possible_roots(word, all_words_set):
    interpretations = []
    
    # 1. Verb Check (Direct, Stem, Compound, Related)
    if word in VERB_LEXICON:
        details = VERB_LEXICON[word]
        interp = {'type': 'Verb', 'pattern_info': details['pattern_info'], 'form_description': 'Infinitive Root'}
        if 'base_root' in details:
            interpretations.append((details['base_root'], interp))
        interpretations.append((word, interp))

    for root, details in VERB_LEXICON.items():
        for stem in details['stems'].values():
            if word.startswith(stem):
                interpretations.append((root, {'type': 'Verb', 'pattern_info': details['pattern_info'], 'form_description': f"Derived from stem '{stem}'"}))
        if 'related_roots' in details and word in details['related_roots']:
            interpretations.append((root, {'type': 'Verb', 'pattern_info': details['pattern_info'], 'form_description': f"Related form of '{root}'"}))

    # 2. Noun/Adj Check (Irregular and Regular)
    for root, details in IRREGULAR_NOUN_ADJ_LEXICON.items():
        if word == root:
            interpretations.append((root, {'type': 'Noun/Adj', 'pattern_info': details['pattern_info'], 'form_description': 'Base Form'}))
        elif word in details['inflected_forms']:
            interpretations.append((root, {'type': 'Noun/Adj', 'pattern_info': details['pattern_info'], 'form_description': f"Inflected form of '{root}'"}))
    
    # Simple noun inflection patterns can be added here if needed, but we focus on explicit lexicon matches first.

    # 3. Fallback: Identify as a simple base form if no other pattern matches
    if word in all_words_set and not any(interp[0] == word for interp in interpretations):
        interpretations.append((word, {'type': 'Noun/Adj', 'pattern_info': 'N/A', 'form_description': 'Base Form'}))
    
    unique_interpretations = []
    seen = set()
    for r, d in interpretations:
        key = (r, d['type'])
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
            root_details_from_lexicon = VERB_LEXICON.get(root) or IRREGULAR_NOUN_ADJ_LEXICON.get(root)
            pattern_info = root_details_from_lexicon['pattern_info'] if root_details_from_lexicon else details['pattern_info']
            identity = {'type': details['type'], 'pattern_info': pattern_info, 'forms': defaultdict(list)}
            final_index[root]['identities'].append(identity)
            
        identity['forms'][details['form_description']].append({'form': word, 'count': data['count'], 'verses': data['verses']})

output_path = 'all_txt_copies/grammatical_index_v14.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(final_index, f, ensure_ascii=False, indent=2)

print(f"Definitive grammatical index (v14) created at: {output_path}")

# --- Verification ---
print("\n--- Verification ---")
word_to_verify = 'پوهول'
root_to_verify_compound = 'کول'
root_to_verify_related = 'رسول'

print(f"Verifying '{word_to_verify}'...")
found_as_compound = False
if root_to_verify_compound in final_index:
    for identity in final_index[root_to_verify_compound]['identities']:
        if any(item['form'] == word_to_verify for sublist in identity['forms'].values() for item in sublist):
            print(f"SUCCESS: Found '{word_to_verify}' mapped to its base root '{root_to_verify_compound}'.")
            found_as_compound = True
            break
if not found_as_compound:
    print(f"ERROR: Did not find '{word_to_verify}' under its base root '{root_to_verify_compound}'.")

found_as_related = False
if root_to_verify_related in final_index:
    for identity in final_index[root_to_verify_related]['identities']:
        if any(item['form'] == word_to_verify for sublist in identity['forms'].values() for item in sublist):
            print(f"SUCCESS: Found '{word_to_verify}' mapped to its related root '{root_to_verify_related}'.")
            found_as_related = True
            break
if not found_as_related:
    print(f"ERROR: Did not find '{word_to_verify}' under its related root '{root_to_verify_related}'.")
