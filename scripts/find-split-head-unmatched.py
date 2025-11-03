#!/usr/bin/env python3
"""
Find words that haven't matched the dictionary because they're split-head perfective verbs

This script finds entries in word_frequencies that are actually perfective verbs with
split heads where minipronouns or negative particles are inserted.

Examples:
- "یې وویل" should match "وویل" (perfective of "ویل")
- "نه وویل" should match "وویل" (perfective of "ویل")
- "و یې ویل" (three words) should match "وویل"

Based on: https://grammar.lingdocs.com/verbs/roots-and-stems/ (split heads only in perfective)
"""

import json
import subprocess
from pathlib import Path
from typing import List, Dict, Tuple, Optional, Set

APP_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_SQL = APP_ROOT / 'cloudflare' / 'link-split-head-verbs.sql'

# Minipronouns (from LingDocs)
MINIPRONOUNS = {
    'مې': ('me', '1st pers sing'),
    'دې': ('de', '2nd pers sing'),
    'مو': ('mU', '1st/2nd pers plur'),
    'یې': ('ye', '3rd pers'),
}

# All minipronoun forms (including variations)
ALL_MINIPRONOUNS = ['مې', 'دې', 'مو', 'یې']

# Particles that can go in split heads
SPLIT_HEAD_PARTICLES = ['نه', 'هم'] + ALL_MINIPRONOUNS

# Stative helper verbs (perfective forms WITHOUT و prefix)
# Intransitive: کېدل -> شول (no و prefix!)
# Transitive: کول -> کړل (no و prefix!)
STATIVE_HELPER_PERFECTIVE = {
    'شول': 'کېدل',  # perfective of کېدل (to become) - intransitive stative
    'شو': 'کېدل',
    'شوه': 'کېدل',
    'شول': 'کېدل',
    'کړل': 'کول',  # perfective of کول (to make) - transitive stative
    'کړ': 'کول',
    'کړه': 'کول',
    'کړو': 'کول',
    'کړې': 'کول',
    'کړي': 'کول',
    'کړلو': 'کول',
    'کړلې': 'کول',
    'کړلي': 'کول',
}


def query_unmatched_verbs(limit: int = 1000, offset: int = 0) -> List[Dict]:
    """Query words that might be split-head verbs but aren't matched to dictionary"""
    # Look for patterns that indicate split-head perfective verbs:
    # 1. Perfective verbs (dynamic): و prefix + verb
    #    - Minipronoun/particle + verb starting with و (with spaces: "یې وویل", "نه وویل")
    #    - Three-word pattern: و + minipronoun/particle + verb ("و یې ویل")
    #    - Concatenated forms (no spaces): "ویېویل", "ومېویل", etc.
    # 2. Stative compound perfective forms: complement + perfective helper (NO و prefix!)
    #    - Complement + شول/شو/شوه (intransitive: "ستړی شول", "کرم شول")
    #    - Complement + کړل/کړ/کړه (transitive: "ستړی کړل", "کرم کړل")
    # Filter out entries marked as [SPLIT] and common non-verb words
    query_sql = f"""
    SELECT id, pashto_word, frequency_total, pos, base_verb, romanization
    FROM word_frequencies
    WHERE (
        -- PERFECTIVE VERBS (dynamic) - Minipronoun/particle + verb starting with و
        (pashto_word LIKE 'مې و%' OR pashto_word LIKE 'دې و%' OR pashto_word LIKE 'مو و%' OR pashto_word LIKE 'یې و%')
        OR
        (pashto_word LIKE 'نه و%' OR pashto_word LIKE 'هم و%')
        OR
        -- Three-word pattern: و + minipronoun/particle + verb
        (pashto_word LIKE 'و مې %' OR pashto_word LIKE 'و دې %' OR pashto_word LIKE 'و مو %' OR pashto_word LIKE 'و یې %')
        OR
        (pashto_word LIKE 'و نه %' OR pashto_word LIKE 'و هم %')
        OR
        -- Concatenated forms (no spaces): و + minipronoun/particle + verb
        (pashto_word LIKE 'ومې%' OR pashto_word LIKE 'وندې%' OR pashto_word LIKE 'ونو%' OR pashto_word LIKE 'ویې%')
        OR
        (pashto_word LIKE 'ونه%' OR pashto_word LIKE 'وهم%')
        OR
        -- STATIVE COMPOUND PERFECTIVE FORMS - complement + perfective helper (NO و prefix!)
        -- Intransitive: complement + شول/شو/شوه
        (pashto_word LIKE '% شول' OR pashto_word LIKE '% شو' OR pashto_word LIKE '% شوه')
        OR
        -- Transitive: complement + کړل/کړ/کړه (but filter out dynamic compounds with و prefix)
        (pashto_word LIKE '% کړل' OR pashto_word LIKE '% کړ' OR pashto_word LIKE '% کړه' OR pashto_word LIKE '% کړو' OR pashto_word LIKE '% کړې' OR pashto_word LIKE '% کړي')
    )
    AND (
        -- Include entries without base_verb OR entries where base_verb points to perfective form itself
        base_verb IS NULL OR base_verb = '' OR base_verb = pashto_word
    )
    AND (
        pashto_word NOT LIKE '% [SPLIT]'
    )
    AND (
        -- Filter out common non-verb words starting with و
        pashto_word NOT LIKE 'ورځ%'
        AND pashto_word NOT LIKE 'وخت%'
        AND pashto_word NOT LIKE 'ورځې%'
        AND pashto_word NOT LIKE 'ولې%'
        AND pashto_word NOT LIKE 'وجه%'
        AND pashto_word NOT LIKE 'وروسته%'
        -- Filter out common non-verb concatenated forms
        AND pashto_word NOT LIKE 'وند%'  -- Common non-verb word
        AND pashto_word NOT LIKE 'وړو%'  -- Common non-verb word
        -- Filter out dynamic compounds with و prefix from stative patterns
        AND pashto_word NOT LIKE '% وکړ%'  -- Dynamic compounds
        AND pashto_word NOT LIKE '% وشو%'  -- Dynamic compounds
    )
    ORDER BY frequency_total DESC
    LIMIT {limit} OFFSET {offset}
    """
    
    cmd = ['wrangler', 'd1', 'execute', 'pashto-bible-db', '--remote', '--command', query_sql, '--json']
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', timeout=60)
        if result.returncode == 0:
            try:
                data = json.loads(result.stdout)
                if isinstance(data, list) and len(data) > 0:
                    if 'results' in data[0]:
                        return data[0]['results']
                elif isinstance(data, dict) and 'results' in data:
                    return data['results'] if isinstance(data['results'], list) else []
            except json.JSONDecodeError as e:
                print(f"   ⚠️  JSON parse error: {e}")
                print(f"   Output preview: {result.stdout[:500]}")
        else:
            print(f"   ⚠️  Query failed: {result.stderr[:300] if result.stderr else result.stdout[:300]}")
        return []
    except Exception as e:
        print(f"   ⚠️  Error: {e}")
        return []


def query_verbs_lexicon() -> Dict[str, Dict]:
    """Load verbs_lexicon to check for verb forms"""
    query_sql = "SELECT verb_root, imperfective_stem, perfective_stem, perfective_root, past_participle FROM verbs_lexicon"
    cmd = ['wrangler', 'd1', 'execute', 'pashto-bible-db', '--remote', '--command', query_sql, '--json']
    
    verbs_dict = {}
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', timeout=60)
        if result.returncode == 0:
            data = json.loads(result.stdout)
            if isinstance(data, list) and len(data) > 0:
                results = data[0].get('results', [])
                for row in results:
                    verb_root = row.get('verb_root', '')
                    if verb_root:
                        verbs_dict[verb_root] = row
                        # Also index by perfective forms for easier lookup
                        perf_stem = row.get('perfective_stem', '')
                        perf_root = row.get('perfective_root', '')
                        if perf_stem and perf_stem not in verbs_dict:
                            verbs_dict[perf_stem] = row
                        if perf_root and perf_root not in verbs_dict:
                            verbs_dict[perf_root] = row
    except Exception as e:
        print(f"   ⚠️  Error loading verbs lexicon: {e}")
    return verbs_dict


def extract_perfective_verb_from_concatenated(form: str) -> Optional[str]:
    """
    Extract perfective verb from concatenated form (no spaces) with embedded minipronoun
    
    Examples:
    - "ویېویل" -> "و" + "یې" + "ویل" -> "وویل"
    - "ومېویل" -> "و" + "مې" + "ویل" -> "وویل"
    - "وندېویل" -> "و" + "دې" + "ویل" -> "وویل"
    - "ونوویل" -> "و" + "مو" + "ویل" -> "وویل"
    - "ونهویل" -> "و" + "نه" + "ویل" -> "وویل"
    
    Pattern: و + minipronoun/particle + verb_stem
    
    Returns None if remaining part doesn't look like a verb (too short or no verb endings)
    """
    if not form.startswith('و'):
        return None
    
    # Check each minipronoun/particle
    for particle in SPLIT_HEAD_PARTICLES:
        prefix = 'و' + particle
        if form.startswith(prefix):
            # Found pattern: و + particle + verb_stem
            remaining = form[len(prefix):]
            
            # Validate that remaining looks like a verb
            # Must have at least 2 characters and end with verb-like endings
            if len(remaining) < 2:
                continue  # Too short to be a verb
            
            # Check for verb-like endings
            verb_endings = ['ل', 'ړ', 'ړه', 'له', 'لې', 'ولي', 'ول', 'ولی', 'وړ', 'وړه', 'شو', 'شوه', 'شول', 'ویل', 'کړ', 'کړه']
            has_verb_ending = any(remaining.endswith(ending) for ending in verb_endings)
            
            if not has_verb_ending:
                continue  # Doesn't look like a verb
            
            # Reconstruct perfective verb: و + verb_stem
            # If verb_stem already starts with و, use it as-is
            if remaining.startswith('و'):
                return remaining
            else:
                return 'و' + remaining
    
    return None


def extract_stative_compound_perfective(form: str) -> Optional[Tuple[str, str]]:
    """
    Extract stative compound perfective form: (complement, base_helper_verb)
    
    Examples:
    - "ستړی شول" -> ("ستړی", "کېدل") - intransitive stative
    - "کرم کړل" -> ("کرم", "کول") - transitive stative
    - "بند شو" -> ("بند", "کېدل")
    
    Returns: (complement, base_helper_verb) or None
    """
    words = form.split()
    
    if len(words) == 2:
        complement, helper_form = words[0], words[1]
        
        # Check if helper_form is a stative perfective helper
        if helper_form in STATIVE_HELPER_PERFECTIVE:
            base_helper = STATIVE_HELPER_PERFECTIVE[helper_form]
            return (complement, base_helper)
    
    return None


def extract_perfective_verb(form: str) -> Optional[str]:
    """
    Extract the perfective verb form from a split-head pattern
    
    Handles:
    1. Perfective verbs (dynamic): و prefix + verb
       - With spaces: "یې وویل" -> "وویل"
       - Concatenated: "ویېویل" -> "وویل"
       - Three words: "و یې ویل" -> "وویل"
    2. Stative compound perfective forms: complement + perfective helper
       - "ستړی شول" -> extract base "ستړی کېدل" (for linking)
       - "کرم کړل" -> extract base "کرم کول" (for linking)
    """
    words = form.split()
    
    # First check if it's a stative compound perfective form
    stative_result = extract_stative_compound_perfective(form)
    if stative_result:
        complement, base_helper = stative_result
        # Return the base stative compound form for linking
        return f"{complement} {base_helper}"
    
    if len(words) == 1:
        # Single word - check if it's concatenated with minipronoun
        concatenated_result = extract_perfective_verb_from_concatenated(form)
        if concatenated_result:
            return concatenated_result
        
        # Or just a regular perfective verb
        # But validate it looks like a verb (not just "و" or "ونه" etc.)
        if form.startswith('و') and len(form) > 2:
            # Check for verb-like endings
            verb_endings = ['ل', 'ړ', 'ړه', 'له', 'لې', 'ولي', 'ول', 'ولی', 'وړ', 'وړه', 'شو', 'شوه', 'شول', 'ویل', 'کړ', 'کړه']
            if any(form.endswith(ending) for ending in verb_endings):
                return form
        return None
    
    if len(words) == 2:
        # Pattern: particle/minipronoun + verb
        first, second = words[0], words[1]
        if first in SPLIT_HEAD_PARTICLES and second.startswith('و'):
            return second
        # Pattern: و + something (shouldn't happen for split-head, but check)
        if first == 'و' and second.startswith('و'):
            return first + second[1:]  # Join them
    
    if len(words) == 3:
        # Pattern: و + particle/minipronoun + verb
        first, second, third = words[0], words[1], words[2]
        if first == 'و' and second in SPLIT_HEAD_PARTICLES:
            # Join و + verb (skip the particle/minipronoun)
            if third.startswith('و'):
                # Already has و, so just use it
                return third
            else:
                # Add و prefix
                return 'و' + third
    
    return None


def find_base_verb(perfective_form: str, verbs_lexicon: Dict[str, Dict]) -> Optional[Tuple[str, Dict]]:
    """
    Find the base verb for a perfective form
    
    Handles:
    1. Regular perfective verbs: "وویل" -> find "ویل"
    2. Stative compound perfective forms: "ستړی کېدل" -> find base compound
    3. Dynamic compound perfective forms: "کار کول" -> find base compound
    
    Examples:
    - "وویل" -> find "ویل" in lexicon
    - "ورکړ" -> find "ورکول" in lexicon (perfective root matches)
    - "ستړی کېدل" -> find "ستړی کېدل" (stative compound base)
    - "کرم کول" -> find "کرم کول" (stative compound base)
    """
    # Check if it's a stative compound base form (complement + helper verb)
    if ' ' in perfective_form:
        # Could be a compound verb base form
        # Try exact match first
        if perfective_form in verbs_lexicon:
            verb_data = verbs_lexicon[perfective_form]
            verb_root = verb_data.get('verb_root', perfective_form)
            return (verb_root, verb_data)
        
        # For compound verbs, the form itself might be the base
        # Check if it matches any verb_root
        for verb_root, verb_data in verbs_lexicon.items():
            if verb_root == perfective_form:
                return (verb_root, verb_data)
        
        # If not found, return the form as-is (it's a compound base)
        # Create a minimal verb_data entry
        return (perfective_form, {'verb_root': perfective_form})
    
    # Try exact match first (might be indexed by perfective form)
    if perfective_form in verbs_lexicon:
        verb_data = verbs_lexicon[perfective_form]
        verb_root = verb_data.get('verb_root', perfective_form)
        return (verb_root, verb_data)
    
    # Remove و prefix and try to find base verb
    if perfective_form.startswith('و'):
        base = perfective_form[1:]  # Remove و
        if base in verbs_lexicon:
            verb_data = verbs_lexicon[base]
            verb_root = verb_data.get('verb_root', base)
            return (verb_root, verb_data)
        
        # For verbs starting with ا, perfective head might be وا
        if perfective_form.startswith('وا'):
            base = perfective_form[2:]  # Remove وا
            if base in verbs_lexicon:
                verb_data = verbs_lexicon[base]
                verb_root = verb_data.get('verb_root', base)
                return (verb_root, verb_data)
    
    # Check if any verb in lexicon has this as its perfective form
    # We need to iterate through the original verb roots (not the indexed forms)
    seen_roots = set()
    for key, verb_data in verbs_lexicon.items():
        verb_root = verb_data.get('verb_root', key)
        if verb_root in seen_roots:
            continue
        seen_roots.add(verb_root)
        
        perfective_root = verb_data.get('perfective_root', '')
        perfective_stem = verb_data.get('perfective_stem', '')
        
        # Exact match
        if perfective_form == perfective_root or perfective_form == perfective_stem:
            return (verb_root, verb_data)
        
        # Check if perfective_form starts with perfective stem/root (conjugated form)
        if perfective_stem and perfective_form.startswith(perfective_stem):
            return (verb_root, verb_data)
        if perfective_root and perfective_form.startswith(perfective_root):
            return (verb_root, verb_data)
    
    return None


def main():
    print("🔍 Finding split-head perfective verbs that haven't matched dictionary...\n")
    
    # Load verbs lexicon
    print("📚 Loading verbs lexicon...")
    verbs_lexicon = query_verbs_lexicon()
    print(f"   ✅ Loaded {len(verbs_lexicon)} verbs\n")
    
    # Query split-head patterns
    print("   Querying split-head patterns...")
    split_head_entries = []
    batch_size = 1000
    offset = 0
    
    while True:
        entries = query_unmatched_verbs(limit=batch_size, offset=offset)
        if not entries:
            break
        split_head_entries.extend(entries)
        if len(entries) < batch_size:
            break
        offset += batch_size
    
    # Also query perfective verbs without base_verb
    print("   Querying perfective verbs without base_verb...")
    perfective_query = """
    SELECT id, pashto_word, frequency_total, pos, base_verb, romanization
    FROM word_frequencies
    WHERE pashto_word LIKE 'و%'
    AND (pashto_word LIKE '%ل' OR pashto_word LIKE '%ړ' OR pashto_word LIKE '%ړه' OR pashto_word LIKE '%له' OR pashto_word LIKE '%لې')
    AND (base_verb IS NULL OR base_verb = '' OR base_verb = pashto_word)
    AND pashto_word NOT LIKE '% %'
    AND pashto_word NOT LIKE '% [SPLIT]'
    ORDER BY frequency_total DESC
    LIMIT 500
    """
    
    cmd = ['wrangler', 'd1', 'execute', 'pashto-bible-db', '--remote', '--command', perfective_query, '--json']
    perfective_entries = []
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', timeout=60)
        if result.returncode == 0:
            data = json.loads(result.stdout)
            if isinstance(data, list) and len(data) > 0:
                perfective_entries = data[0].get('results', [])
    except:
        pass
    
    all_entries = split_head_entries + perfective_entries
    print(f"\n   ✅ Total found: {len(split_head_entries)} split-head patterns, {len(perfective_entries)} perfective verbs\n")
    
    if not all_entries:
        print("   No split-head verbs found")
        return
    
    # Analyze each entry
    matched_verbs = []
    unmatched_verbs = []
    
    for entry in all_entries:
        word = entry['pashto_word']
        
        # For entries with spaces, try to extract perfective verb
        # For single-word entries starting with و, use the word itself
        if ' ' in word:
            perfective_form = extract_perfective_verb(word)
        elif word.startswith('و'):
            perfective_form = word  # Single-word perfective verb
        else:
            unmatched_verbs.append({
                'word': word,
                'reason': 'not_perfective_pattern'
            })
            continue
        
        if not perfective_form:
            unmatched_verbs.append({
                'word': word,
                'reason': 'could_not_extract_perfective'
            })
            continue
        
        # Try to find base verb
        base_result = find_base_verb(perfective_form, verbs_lexicon)
        
        if base_result:
            base_verb, verb_data = base_result
            
            # Determine if it's a stative compound or regular verb
            is_stative_compound = ' ' in perfective_form and ('کېدل' in perfective_form or 'کول' in perfective_form)
            verb_type = 'verb_stative_compound_split_head' if is_stative_compound else 'verb_perfective_split_head'
            
            matched_verbs.append({
                'id': entry['id'],
                'word': word,
                'perfective_form': perfective_form,
                'base_verb': base_verb,
                'verb_type': verb_type,
                'frequency': entry.get('frequency_total', 0),
                'current_pos': entry.get('pos'),
            })
        else:
            unmatched_verbs.append({
                'word': word,
                'perfective_form': perfective_form,
                'reason': 'base_verb_not_found'
            })
    
    print(f"   📊 Analysis:")
    print(f"      Matched to base verbs: {len(matched_verbs)}")
    print(f"      Unmatched: {len(unmatched_verbs)}\n")
    
    # Generate SQL
    sql_statements = []
    sql_statements.append('-- Link split-head perfective verbs to their base verbs')
    sql_statements.append('-- Based on: https://grammar.lingdocs.com/verbs/roots-and-stems/')
    sql_statements.append('-- Includes:')
    sql_statements.append('--   1. Perfective verbs (dynamic) with minipronouns/particles in split head')
    sql_statements.append('--   2. Stative compound perfective forms (complement splits off in perfective)')
    sql_statements.append('--      Examples: "ستړی شول" -> "ستړی کېدل", "کرم کړل" -> "کرم کول"')
    sql_statements.append('')
    
    if matched_verbs:
        for verb in matched_verbs:
            word_escaped = "'" + verb['word'].replace("'", "''") + "'"
            base_verb_escaped = "'" + verb['base_verb'].replace("'", "''") + "'"
            perfective_form_escaped = "'" + verb['perfective_form'].replace("'", "''") + "'"
            verb_type = verb.get('verb_type', 'verb_perfective_split_head')
            
            sql_statements.append(f"-- {verb['word']} -> base: {verb['base_verb']} (perfective: {verb['perfective_form']})")
            sql_statements.append(f"""
UPDATE word_frequencies
SET base_verb = {base_verb_escaped},
    pos = COALESCE(NULLIF(pos, ''), '{verb_type}')
WHERE id = {verb['id']};
""")
            sql_statements.append('')
    
    # Write SQL file
    OUTPUT_SQL.write_text('\n'.join(sql_statements), encoding='utf-8')
    
    print(f"   ✅ Generated {OUTPUT_SQL}")
    print(f"   📊 Prepared {len(matched_verbs)} split-head verbs to link")
    
    if matched_verbs:
        print(f"\n📋 Sample matched verbs (first 10):")
        for verb in matched_verbs[:10]:
            print(f"   '{verb['word']}' -> base: '{verb['base_verb']}' (perfective: '{verb['perfective_form']}')")
    
    if unmatched_verbs:
        print(f"\n⚠️  Sample unmatched verbs (first 10):")
        for verb in unmatched_verbs[:10]:
            print(f"   '{verb['word']}' ({verb.get('perfective_form', 'N/A')}) - {verb['reason']}")
    
    print(f"\n💡 Next step:")
    print(f"   wrangler d1 execute pashto-bible-db --remote --file {OUTPUT_SQL.relative_to(APP_ROOT)}")


if __name__ == '__main__':
    main()

