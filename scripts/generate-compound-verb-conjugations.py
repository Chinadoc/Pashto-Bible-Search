#!/usr/bin/env python3
"""
Generate Full Conjugations for Compound Verbs (Dynamic & Stative)

This script:
1. Loads compound verbs from dictionary (stative and dynamic)
2. Generates all conjugations using LingDocs grammar rules
3. Searches for these forms in word_frequencies
4. Updates word_frequencies with proper categorization and linking

Based on:
- https://grammar.lingdocs.com/compound-verbs/stative-compounds/
- https://grammar.lingdocs.com/compound-verbs/dynamic-compounds/
- https://grammar.lingdocs.com/verbs/master-chart/
"""

import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Set
from collections import defaultdict

APP_ROOT = Path(__file__).parent.parent
OUTPUT_SQL = APP_ROOT / 'cloudflare' / 'populate-compound-verb-conjugations.sql'

# Helper verb perfective forms
STATIVE_HELPER_PERFECTIVE = {
    'شول': 'کېدل',
    'شو': 'کېدل',
    'شوه': 'کېدل',
    'کړل': 'کول',
    'کړ': 'کول',
    'کړه': 'کول',
    'کړو': 'کول',
    'کړې': 'کول',
    'کړي': 'کول',
    'کړلو': 'کول',
    'کړلې': 'کول',
    'کړلي': 'کول',
}

DYNAMIC_HELPER_PERFECTIVE = {
    'وکړل': 'کول',
    'وکړ': 'کول',
    'وکړه': 'کول',
    'وکړو': 'کول',
    'وکړې': 'کول',
    'وکړي': 'کول',
    'وکړلو': 'کول',
    'وکړلې': 'کول',
    'وکړلي': 'کول',
}

def query_d1(sql_query: str) -> List[Dict]:
    """Query D1 database"""
    cmd = ['wrangler', 'd1', 'execute', 'pashto-bible-db', '--remote', '--command', sql_query, '--json']
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', timeout=60)
        if result.returncode == 0:
            data = json.loads(result.stdout)
            if isinstance(data, list) and len(data) > 0:
                first_item = data[0]
                if isinstance(first_item, dict) and 'results' in first_item:
                    return first_item['results']
            elif isinstance(data, dict):
                return data.get('results', [])
        return []
    except Exception as e:
        print(f"   ⚠️  Error querying D1: {e}")
        return []

def load_dictionary() -> List[Dict]:
    """Load dictionary JSON"""
    dict_paths = [
        APP_ROOT / 'full_dictionary_enriched.json',
        APP_ROOT / 'docs' / 'lexicon' / 'full_dictionary_enriched.json',
    ]
    
    for dict_path in dict_paths:
        if dict_path.exists():
            try:
                with open(dict_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if isinstance(data, dict) and 'entries' in data:
                        return data['entries']
                    elif isinstance(data, list):
                        return data
            except Exception as e:
                print(f"   ⚠️  Error loading {dict_path}: {e}")
                continue
    
    print("   ⚠️  Dictionary not found")
    return []

def extract_compound_verb_info(entry: Dict) -> Optional[Dict]:
    """Extract compound verb information from dictionary entry"""
    pashto = entry.get('p', '')
    pos = entry.get('c', '')
    
    if not pashto or not pos:
        return None
    
    # Check if it's a compound verb
    is_stative_intrans = 'v. stat. comp. intrans.' in pos
    is_stative_trans = 'v. stat. comp. trans.' in pos
    is_dynamic_intrans = 'v. dyn. comp. intrans.' in pos
    is_dynamic_trans = 'v. dyn. comp. trans.' in pos
    
    if not (is_stative_intrans or is_stative_trans or is_dynamic_intrans or is_dynamic_trans):
        return None
    
    # Parse compound verb
    parts = pashto.split()
    if len(parts) != 2:
        return None
    
    complement, helper = parts[0], parts[1]
    
    return {
        'pashto': pashto,
        'complement': complement,
        'helper': helper,
        'is_stative': is_stative_intrans or is_stative_trans,
        'is_transitive': is_stative_trans or is_dynamic_trans,
        'pos': pos,
        'romanization': entry.get('f', ''),
        'english': entry.get('e', ''),
    }

def generate_compound_verb_forms(compound_info: Dict) -> List[Tuple[str, str, str]]:
    """
    Generate all conjugations for a compound verb
    
    Returns: List of (form, form_type, description) tuples
    """
    complement = compound_info['complement']
    helper = compound_info['helper']
    is_stative = compound_info['is_stative']
    is_transitive = compound_info['is_transitive']
    
    forms = []
    
    # Base form
    forms.append((compound_info['pashto'], 'infinitive', 'Base compound verb'))
    
    if is_stative:
        # STATIVE COMPOUNDS
        if helper == 'کېدل':
            # Intransitive stative: complement + کېدل
            # Imperfective: complement + کېږـ (welded)
            # Perfective: complement + شـ (split head, NO و prefix!)
            forms.extend([
                # Present (imperfective) - welded
                (f"{complement} کېږم", 'present_1sg', 'Present 1sg'),
                (f"{complement} کېږو", 'present_1pl', 'Present 1pl'),
                (f"{complement} کېږې", 'present_2sg', 'Present 2sg'),
                (f"{complement} کېږئ", 'present_2pl', 'Present 2pl'),
                (f"{complement} کېږي", 'present_3sg', 'Present 3sg'),
                
                # Squished forms (if complement ends in consonant/ه)
                (f"{complement}ېږم", 'present_1sg_squished', 'Present 1sg (squished)'),
                (f"{complement}ېږو", 'present_1pl_squished', 'Present 1pl (squished)'),
                (f"{complement}ېږې", 'present_2sg_squished', 'Present 2sg (squished)'),
                (f"{complement}ېږئ", 'present_2pl_squished', 'Present 2pl (squished)'),
                (f"{complement}ېږي", 'present_3sg_squished', 'Present 3sg (squished)'),
                
                # Perfective past - split head (NO و prefix!)
                (f"{complement} شوم", 'perfective_past_1sg', 'Perfective past 1sg'),
                (f"{complement} شو", 'perfective_past_1pl', 'Perfective past 1pl'),
                (f"{complement} شوې", 'perfective_past_2sg', 'Perfective past 2sg'),
                (f"{complement} شوئ", 'perfective_past_2pl', 'Perfective past 2pl'),
                (f"{complement} شو", 'perfective_past_3sg_m', 'Perfective past 3sg m'),
                (f"{complement} شوه", 'perfective_past_3sg_f', 'Perfective past 3sg f'),
                (f"{complement} شول", 'perfective_past_3pl', 'Perfective past 3pl'),
                
                # Past participle
                (f"{complement} شوی", 'past_participle_m', 'Past participle m'),
                (f"{complement} شوې", 'past_participle_f', 'Past participle f'),
                (f"{complement} شوي", 'past_participle_pl', 'Past participle pl'),
            ])
            
        elif helper == 'کول':
            # Transitive stative: complement + کول
            # Imperfective: complement + کوـ (welded)
            # Perfective: complement + کړـ (split head, NO و prefix!)
            forms.extend([
                # Present (imperfective) - welded
                (f"{complement} کوم", 'present_1sg', 'Present 1sg'),
                (f"{complement} کوو", 'present_1pl', 'Present 1pl'),
                (f"{complement} کوې", 'present_2sg', 'Present 2sg'),
                (f"{complement} کوئ", 'present_2pl', 'Present 2pl'),
                (f"{complement} کوي", 'present_3sg', 'Present 3sg'),
                
                # Squished forms (if complement ends in consonant/ه)
                (f"{complement}کوم", 'present_1sg_squished', 'Present 1sg (squished)'),
                (f"{complement}کوو", 'present_1pl_squished', 'Present 1pl (squished)'),
                (f"{complement}کوې", 'present_2sg_squished', 'Present 2sg (squished)'),
                (f"{complement}کوئ", 'present_2pl_squished', 'Present 2pl (squished)'),
                (f"{complement}کوي", 'present_3sg_squished', 'Present 3sg (squished)'),
                
                # Perfective past - split head (NO و prefix!)
                (f"{complement} کړم", 'perfective_past_1sg', 'Perfective past 1sg'),
                (f"{complement} کړو", 'perfective_past_1pl', 'Perfective past 1pl'),
                (f"{complement} کړې", 'perfective_past_2sg', 'Perfective past 2sg'),
                (f"{complement} کړئ", 'perfective_past_2pl', 'Perfective past 2pl'),
                (f"{complement} کړ", 'perfective_past_3sg_m', 'Perfective past 3sg m'),
                (f"{complement} کړه", 'perfective_past_3sg_f', 'Perfective past 3sg f'),
                (f"{complement} کړل", 'perfective_past_3pl', 'Perfective past 3pl'),
                (f"{complement} کړلو", 'perfective_past_1sg_agreed', 'Perfective past 1sg (agreed)'),
                (f"{complement} کړلې", 'perfective_past_2sg_agreed', 'Perfective past 2sg (agreed)'),
                (f"{complement} کړلي", 'perfective_past_3pl_agreed', 'Perfective past 3pl (agreed)'),
                
                # Past participle
                (f"{complement} کړی", 'past_participle_m', 'Past participle m'),
                (f"{complement} کړې", 'past_participle_f', 'Past participle f'),
                (f"{complement} کړي", 'past_participle_pl', 'Past participle pl'),
            ])
    
    else:
        # DYNAMIC COMPOUNDS
        if helper == 'کول':
            # Transitive dynamic: complement + کول
            # Imperfective: complement + کوـ
            # Perfective: complement + وکړـ (WITH و prefix!)
            forms.extend([
                # Present (imperfective)
                (f"{complement} کوم", 'present_1sg', 'Present 1sg'),
                (f"{complement} کوو", 'present_1pl', 'Present 1pl'),
                (f"{complement} کوې", 'present_2sg', 'Present 2sg'),
                (f"{complement} کوئ", 'present_2pl', 'Present 2pl'),
                (f"{complement} کوي", 'present_3sg', 'Present 3sg'),
                
                # Perfective past - WITH و prefix!
                (f"{complement} وکړم", 'perfective_past_1sg', 'Perfective past 1sg'),
                (f"{complement} وکړو", 'perfective_past_1pl', 'Perfective past 1pl'),
                (f"{complement} وکړې", 'perfective_past_2sg', 'Perfective past 2sg'),
                (f"{complement} وکړئ", 'perfective_past_2pl', 'Perfective past 2pl'),
                (f"{complement} وکړ", 'perfective_past_3sg_m', 'Perfective past 3sg m'),
                (f"{complement} وکړه", 'perfective_past_3sg_f', 'Perfective past 3sg f'),
                (f"{complement} وکړل", 'perfective_past_3pl', 'Perfective past 3pl'),
                (f"{complement} وکړلو", 'perfective_past_1sg_agreed', 'Perfective past 1sg (agreed)'),
                (f"{complement} وکړلې", 'perfective_past_2sg_agreed', 'Perfective past 2sg (agreed)'),
                (f"{complement} وکړلي", 'perfective_past_3pl_agreed', 'Perfective past 3pl (agreed)'),
                
                # Past participle
                (f"{complement} کړی", 'past_participle_m', 'Past participle m'),
                (f"{complement} کړې", 'past_participle_f', 'Past participle f'),
                (f"{complement} کړي", 'past_participle_pl', 'Past participle pl'),
            ])
        
        elif helper == 'کېدل':
            # Intransitive dynamic: complement + کېدل
            # Imperfective: complement + کېږـ
            # Perfective: complement + وشـ (WITH و prefix!)
            forms.extend([
                # Present (imperfective)
                (f"{complement} کېږم", 'present_1sg', 'Present 1sg'),
                (f"{complement} کېږو", 'present_1pl', 'Present 1pl'),
                (f"{complement} کېږې", 'present_2sg', 'Present 2sg'),
                (f"{complement} کېږئ", 'present_2pl', 'Present 2pl'),
                (f"{complement} کېږي", 'present_3sg', 'Present 3sg'),
                
                # Perfective past - WITH و prefix!
                (f"{complement} وشوم", 'perfective_past_1sg', 'Perfective past 1sg'),
                (f"{complement} وشو", 'perfective_past_1pl', 'Perfective past 1pl'),
                (f"{complement} وشوې", 'perfective_past_2sg', 'Perfective past 2sg'),
                (f"{complement} وشوئ", 'perfective_past_2pl', 'Perfective past 2pl'),
                (f"{complement} وشو", 'perfective_past_3sg_m', 'Perfective past 3sg m'),
                (f"{complement} وشوه", 'perfective_past_3sg_f', 'Perfective past 3sg f'),
                (f"{complement} وشول", 'perfective_past_3pl', 'Perfective past 3pl'),
                
                # Past participle
                (f"{complement} شوی", 'past_participle_m', 'Past participle m'),
                (f"{complement} شوې", 'past_participle_f', 'Past participle f'),
                (f"{complement} شوي", 'past_participle_pl', 'Past participle pl'),
            ])
    
    # Add future forms (به + present/subjunctive)
    for form, form_type, desc in forms[:]:
        if 'present' in form_type:
            future_form = form.replace('کېږ', 'به کېږ').replace('کو', 'به کو')
            forms.append((future_form, f'future_{form_type}', f'Future {desc}'))
    
    # Add perfect forms (past participle + equative)
    # This would need to be expanded based on all 8 perfect forms
    
    return forms

def find_forms_in_word_frequencies(forms: List[Tuple[str, str, str]]) -> Dict[str, Dict]:
    """Find which generated forms exist in word_frequencies"""
    found_forms = {}
    
    # Build query for all forms
    form_words = [form[0] for form in forms]
    if not form_words:
        return found_forms
    
    # Query in batches
    batch_size = 50
    for i in range(0, len(form_words), batch_size):
        batch = form_words[i:i+batch_size]
        # Escape single quotes for SQL
        escaped_batch = [word.replace("'", "''") for word in batch]
        placeholders = ','.join([f"'{word}'" for word in escaped_batch])
        query = f"""
        SELECT id, pashto_word, frequency_total, pos, base_verb, romanization
        FROM word_frequencies
        WHERE pashto_word IN ({placeholders})
        """
        
        results = query_d1(query)
        for result in results:
            word = result.get('pashto_word', '')
            if word:
                found_forms[word] = result
    
    return found_forms

def main():
    print("🔄 Generating full conjugations for compound verbs...\n")
    
    # Load dictionary
    print("📚 Loading dictionary...")
    dictionary = load_dictionary()
    if not dictionary:
        print("   ❌ Failed to load dictionary")
        return
    
    print(f"   ✅ Loaded {len(dictionary)} entries")
    
    # Extract compound verbs
    print("\n🔍 Extracting compound verbs...")
    compound_verbs = []
    for entry in dictionary:
        compound_info = extract_compound_verb_info(entry)
        if compound_info:
            compound_verbs.append(compound_info)
    
    print(f"   ✅ Found {len(compound_verbs)} compound verbs")
    
    # Generate forms and find in word_frequencies
    print("\n📝 Generating conjugations and searching word_frequencies...")
    
    all_updates = []
    stats = {
        'stative_intrans': 0,
        'stative_trans': 0,
        'dynamic_intrans': 0,
        'dynamic_trans': 0,
        'total_forms_generated': 0,
        'total_forms_found': 0,
    }
    
    for i, compound_info in enumerate(compound_verbs):
        if (i + 1) % 100 == 0:
            print(f"   Processing {i + 1}/{len(compound_verbs)}...")
        
        # Update stats
        if compound_info['is_stative']:
            if compound_info['is_transitive']:
                stats['stative_trans'] += 1
            else:
                stats['stative_intrans'] += 1
        else:
            if compound_info['is_transitive']:
                stats['dynamic_trans'] += 1
            else:
                stats['dynamic_intrans'] += 1
        
        # Generate forms
        forms = generate_compound_verb_forms(compound_info)
        stats['total_forms_generated'] += len(forms)
        
        # Find forms in word_frequencies
        found_forms = find_forms_in_word_frequencies(forms)
        stats['total_forms_found'] += len(found_forms)
        
        # Prepare updates
        for form, form_type, desc in forms:
            if form in found_forms:
                entry = found_forms[form]
                all_updates.append({
                    'id': entry['id'],
                    'word': form,
                    'base_verb': compound_info['pashto'],
                    'form_type': form_type,
                    'pos': compound_info['pos'],
                    'current_pos': entry.get('pos', ''),
                    'current_base': entry.get('base_verb', ''),
                })
    
    print(f"\n📊 Statistics:")
    print(f"   Stative intransitive: {stats['stative_intrans']}")
    print(f"   Stative transitive: {stats['stative_trans']}")
    print(f"   Dynamic intransitive: {stats['dynamic_intrans']}")
    print(f"   Dynamic transitive: {stats['dynamic_trans']}")
    print(f"   Total forms generated: {stats['total_forms_generated']}")
    print(f"   Total forms found: {stats['total_forms_found']}")
    print(f"   Total updates needed: {len(all_updates)}")
    
    # Generate SQL
    print("\n💾 Generating SQL...")
    sql_statements = []
    sql_statements.append('-- Populate compound verb conjugations in word_frequencies')
    sql_statements.append('-- Based on: https://grammar.lingdocs.com/compound-verbs/')
    sql_statements.append('')
    
    # Group by base verb
    updates_by_base = defaultdict(list)
    for update in all_updates:
        updates_by_base[update['base_verb']].append(update)
    
    for base_verb, updates in updates_by_base.items():
        sql_statements.append(f"-- {base_verb}")
        sql_statements.append('')
        
        for update in updates:
            word_escaped = "'" + update['word'].replace("'", "''") + "'"
            base_escaped = "'" + update['base_verb'].replace("'", "''") + "'"
            form_type_escaped = "'" + update['form_type'].replace("'", "''") + "'"
            pos_escaped = "'" + update['pos'].replace("'", "''") + "'"
            
            sql_statements.append(f"-- {update['word']} ({update['form_type']})")
            sql_statements.append(f"""
UPDATE word_frequencies
SET base_verb = {base_escaped},
    form_type = {form_type_escaped},
    pos = COALESCE(NULLIF(pos, ''), {pos_escaped})
WHERE id = {update['id']};
""")
            sql_statements.append('')
    
    # Write SQL file
    OUTPUT_SQL.write_text('\n'.join(sql_statements), encoding='utf-8')
    print(f"   ✅ Generated {OUTPUT_SQL}")
    print(f"\n💡 Next step:")
    print(f"   wrangler d1 execute pashto-bible-db --remote --file {OUTPUT_SQL}")

if __name__ == '__main__':
    main()

