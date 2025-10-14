import json
import re
from collections import defaultdict

# --- Expanded Verb Lexicon (v12) ---
VERB_LEXICON = {
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
            'imperfective': 'رسو',      # e.g., رسوم
            'perfective': 'ورسو',    # e.g., ورسوم
            'past_participle': 'رسولی'
        }
    }
}

# --- Noun/Adj Pattern Lexicon for Irregulars (e.g., Pattern 4) ---
IRREGULAR_NOUN_ADJ_LEXICON = {
    'پښتون': {
        'type': 'Noun/Adj', 'pattern_info': 'Pattern 4: Pashtoon pattern',
        'inflected_forms': ['پښتانه', 'پښتنو', 'پښتنه', 'پښتنې']
    },
    'مېلمه': {
        'type': 'Noun/Adj', 'pattern_info': 'Pattern 4 variant: Unusual masculine animate',
        'inflected_forms': ['مېلمانه', 'مېلمنو', 'مېلمنې']
    },
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

def find_all_possible_roots(word, all_words_set):
    """
    Finds all possible grammatical interpretations of a word (homonym-aware).
    Returns a list of tuples: [(root, details_dict), ...].
    """
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

    # 3. Noun/Adj Check (Regular Patterns)
    # Note: These are designed to be non-overlapping, but the logic is here if needed.
    # The order matters: more specific patterns should come first.
    # ... (omitting pattern logic from v11 for brevity, will be re-integrated) ...
    
    # 4. Fallback: Identify as a simple base form if no other pattern matches
    if not possible_interpretations and word in all_words_set:
         possible_interpretations.append((
            word,
            {'type': 'Noun/Adj', 'pattern_info': 'N/A', 'form_description': 'Base Form'}
        ))
         
    # 5. Handle the case where a word matches nothing, but is a base noun (e.g. `رسول` the noun)
    # This ensures base nouns that are also verb roots get their noun identity.
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

    # Remove duplicates - a word might match in multiple ways to the same root/type
    unique_interpretations = []
    seen = set()
    for r, d in possible_interpretations:
        key = (r, d['type'], d['form_description'])
        if key not in seen:
            unique_interpretations.append((r, d))
            seen.add(key)
            
    return unique_interpretations

# --- Main Execution ---
word_data = load_word_data()
all_words_set = set(word_data.keys())
# New structure: { root: { "identities": [ {type, pattern, forms...}, ... ] } }
final_index = defaultdict(lambda: {"identities": []})

for word, data in word_data.items():
    interpretations = find_all_possible_roots(word, all_words_set)
    if not interpretations:
        # If no root is found, treat the word itself as the root
        interpretations = [(word, {'type': 'Unknown', 'pattern_info': 'N/A', 'form_description': 'Base Form'})]
    
    for root, details in interpretations:
        # Find if an identity with this type already exists for this root
        identity = None
        for id_obj in final_index[root]['identities']:
            if id_obj['type'] == details['type']:
                identity = id_obj
                break
        
        # If no identity of this type exists, create it
        if identity is None:
            # Get pattern info from the root's own identity if available
            root_details = VERB_LEXICON.get(root) or IRREGULAR_NOUN_ADJ_LEXICON.get(root)
            pattern_info = root_details['pattern_info'] if root_details else details['pattern_info']
            
            identity = {
                'type': details['type'],
                'pattern_info': pattern_info,
                'forms': defaultdict(list)
            }
            final_index[root]['identities'].append(identity)
            
        # Add the current word form to this identity
        identity['forms'][details['form_description']].append({
            'form': word,
            'count': data['count'],
            'verses': data['verses']
        })

output_path = 'all_txt_copies/grammatical_index_v12.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(final_index, f, ensure_ascii=False, indent=2)

print(f"Homonym-aware grammatical index created at: {output_path}")

# --- Verification ---
print("\n--- Verification ---")
word_to_verify_noun = 'رسول'
word_to_verify_verb_form = 'رسوم'
root_to_verify = 'رسول'

if root_to_verify in final_index:
    print(f"SUCCESS: Root '{root_to_verify}' found in index.")
    
    identities = final_index[root_to_verify]['identities']
    types_found = [i['type'] for i in identities]
    
    if 'Noun/Adj' in types_found:
        print("SUCCESS: Identified as Noun/Adj.")
    else:
        print("ERROR: Did not identify as Noun/Adj.")
        
    if 'Verb' in types_found:
        print("SUCCESS: Identified as Verb.")
        # Check if the conjugated form was correctly mapped
        verb_identity = next(i for i in identities if i['type'] == 'Verb')
        if any(item['form'] == word_to_verify_verb_form for sublist in verb_identity['forms'].values() for item in sublist):
             print(f"SUCCESS: Found verb form '{word_to_verify_verb_form}' mapped to the correct root.")
        else:
             print(f"ERROR: Did not find verb form '{word_to_verify_verb_form}' under the root.")
    else:
        print("ERROR: Did not identify as Verb.")
else:
    print(f"ERROR: Root '{root_to_verify}' not found in index.")
