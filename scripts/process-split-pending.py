#!/usr/bin/env python3
"""
Process phrases marked as 'split_pending' and generate INSERT statements

This script queries phrases marked for splitting and generates SQL to:
1. Insert/update word1 and word2
2. Mark original phrase as split

NOW HANDLES:
- Minipronouns (مې, دې, مو, یې) in split-head verbs
- Directional pronouns (را, در, ور)
- Split-head verb patterns (perfective verbs with split heads)
- Regular pronouns + directional pronouns
- Directional phrases (راته, ورته, etc.)

Based on LingDocs grammar:
- https://grammar.lingdocs.com/pronouns/pronouns-mini/
- https://grammar.lingdocs.com/pronouns/pronouns-directional/
- https://grammar.lingdocs.com/verbs/roots-and-stems/ (split heads)
"""

import json
import subprocess
import shlex
from pathlib import Path
from typing import List, Dict, Tuple, Optional

APP_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_SQL = APP_ROOT / 'cloudflare' / 'split-phrases-execute.sql'

# Minipronouns (from LingDocs pronouns-mini.mdx)
MINIPRONOUNS = {
    'مې': ('me', '1st pers sing'),
    'دې': ('de', '2nd pers sing'),
    'مو': ('mU', '1st/2nd pers plur'),
    'یې': ('ye', '3rd pers'),
}

# Directional pronouns (from LingDocs pronouns-directional.mdx)
DIRECTIONAL_PRONOUNS = {
    'را': ('raa', '1st person - to me/us'),
    'در': ('dăr', '2nd person - to you'),
    'ور': ('wăr', '3rd person - to him/her/it/them'),
}

# Directional + postposition combinations (should stay together)
DIRECTIONAL_PHRASES = {
    'راته': ('raa-ta', 'to me/us'),
    'درته': ('dăr-ta', 'to you'),
    'ورته': ('wăr-ta', 'to him/her/them/it'),
    'راپسې': ('raa-pase', 'after me/us'),
}

# Regular pronouns that might appear before directional pronouns
REGULAR_PRONOUNS = {
    'ما': ('maa', 'me/I'),
    'تا': ('taa', 'you'),
    'ستا': ('staa', 'your'),
    'زما': ('zmaa', 'my'),
    'هغه': ('haghá', 'he/she/it'),
    'هغۀ': ('haghá', 'he/she/it'),
    'هغې': ('haghé', 'she/it'),
    'هغوی': ('haghwée', 'they'),
    'زۀ': ('zu', 'I'),
    'زه': ('zu', 'I'),
    'ته': ('tu', 'you'),
    'تاسو': ('taaso', 'you pl.'),
    'مونږ': ('moonG', 'we'),
    'موږ': ('mooG', 'we'),
}

POSTPOSITIONS = ['ته', 'کې', 'دپاره', 'باندې', 'سره', 'سربېره']
PREPOSITIONS = ['د', 'په', 'پر', 'له']
PARTICLES = ['به', 'نه', 'هم']


def query_verbs_lexicon() -> Dict[str, bool]:
    """Load verbs_lexicon to check for verb forms"""
    query_sql = "SELECT verb_root FROM verbs_lexicon"
    cmd = ['wrangler', 'd1', 'execute', 'pashto-bible-db', '--remote', '--command', query_sql, '--json']
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', timeout=30)
        if result.returncode == 0:
            data = json.loads(result.stdout)
            if isinstance(data, list) and len(data) > 0:
                results = data[0].get('results', [])
                return {row['verb_root']: True for row in results}
    except:
        pass
    return {}


def is_split_head_verb(phrase: str, verbs_lexicon: Dict[str, bool]) -> Optional[Tuple[str, str]]:
    """
    Detect if phrase is a verb with split head (perfective) + minipronoun/particle
    
    IMPORTANT: Split heads ONLY occur in the perfective aspect!
    - Perfective forms start with و (or وا for verbs starting with ا)
    - Imperfective forms do NOT have split heads
    
    Examples:
    - "مې ورکړ" = "مې" (minipronoun) + "ورکړ" (perfective verb "ورکول")
    - "نه وویل" = "نه" (negative) + "وویل" (perfective verb "ویل")
    - "یې وویل" = "یې" (minipronoun) + "وویل" (perfective verb "ویل")
    
    Based on: https://grammar.lingdocs.com/verbs/roots-and-stems/ (split heads only on perfective side)
    
    Returns: (minipronoun/particle, verb) or None
    """
    words = phrase.split()
    
    if len(words) != 2:
        return None
    
    first, second = words[0], words[1]
    
    # Check if first word is minipronoun or particle
    if first in MINIPRONOUNS or first in ['نه', 'هم']:
        # CRITICAL: Only perfective verbs have split heads!
        # Perfective verbs start with و (or وا for verbs starting with ا)
        # Imperfective verbs do NOT start with و and do NOT have split heads
        
        # Check if second word is a perfective verb (starts with و or وا)
        if second.startswith('و') and len(second) > 1:
            # For verbs starting with ا, perfective head is وا
            # For other verbs, perfective head is و
            # Check if this looks like a perfective form
            base_verb = second[1:]  # Remove و
            
            # Check if this base verb exists in verbs_lexicon
            if second in verbs_lexicon or base_verb in verbs_lexicon:
                return (first, second)  # Return (minipronoun/particle, verb)
            
            # Also check common perfective verb endings
            # Perfective forms: past perfective, subjunctive, future perfective
            perfective_endings = ['ل', 'ړ', 'ړه', 'له', 'لې', 'ولي', 'ول', 'ولی', 'وړ', 'وړه', 'شو', 'شوه', 'شول']
            if any(second.endswith(ending) for ending in perfective_endings):
                return (first, second)
        
        # Also check for directional verbs with perfective forms
        # Directional verbs (را, در, ور) can also have perfective forms with split heads
        # But only if they're perfective (would need و prefix, but directional comes first)
        # Example: "مې راکړ" = perfective "راکړ" (but this doesn't start with و)
        # Actually, directional verbs might not need و prefix if they're already directional
        # Let's be conservative - only check if it clearly looks like a perfective verb
        if second.startswith(('را', 'در', 'ور')):
            # For directional verbs, check if the base part looks like a perfective verb form
            # But this is tricky - directional verbs might be imperfective or perfective
            # We'll only mark as split-head if it's clearly a perfective ending
            base_part = second[2:]  # Remove را/در/ور
            # Perfective directional verbs often end in specific ways
            # But let's be conservative and only mark if we're sure
            perfective_directional_endings = ['ړ', 'ړه', 'کړ', 'کړه', 'شو', 'شوه']
            if any(base_part.endswith(ending) for ending in perfective_directional_endings):
                # Additional check: does the full form exist in lexicon?
                if second in verbs_lexicon:
                    return (first, second)
    
    return None


def split_phrase(phrase: str, verbs_lexicon: Optional[Dict[str, bool]] = None) -> Tuple[str, Optional[str], Optional[str]]:
    """
    Split a phrase into component words, handling:
    - Directional phrases (keep together)
    - Split-head verbs (keep together)
    - Regular pronoun + directional pronoun (keep together)
    - Other phrases (split normally)
    """
    if verbs_lexicon is None:
        verbs_lexicon = {}
    
    words = phrase.split()
    
    if len(words) < 2:
        return (phrase, None, None)
    
    # 1. Check for directional phrases (راته, ورته, etc.) - KEEP TOGETHER
    if phrase in DIRECTIONAL_PHRASES:
        return (phrase, None, 'keep_directional_phrase')
    
    # 2. Check for split-head verb pattern - KEEP TOGETHER
    split_head = is_split_head_verb(phrase, verbs_lexicon)
    if split_head:
        return (phrase, None, 'keep_split_head_verb')
    
    # 3. Check for regular pronoun + directional pronoun - KEEP TOGETHER
    if len(words) == 2:
        word1, word2 = words
        if word1 in REGULAR_PRONOUNS and word2 in DIRECTIONAL_PRONOUNS:
            return (phrase, None, 'keep_pronoun_directional')
        
        # Check for directional + postposition (not in our DIRECTIONAL_PHRASES list)
        if word1 in DIRECTIONAL_PRONOUNS and word2 in POSTPOSITIONS:
            return (phrase, None, 'keep_directional_postposition')
        
        # Check for regular pronoun + postposition - SPLIT (e.g., "ما ته")
        if word1 in REGULAR_PRONOUNS and word2 in POSTPOSITIONS:
            return (word1, word2, 'postposition')
    
    # 4. Check for postposition (... ته) - SPLIT
    if words[-1] in POSTPOSITIONS:
        return (' '.join(words[:-1]), words[-1], 'postposition')
    
    # 5. Check for preposition (د ...) - SPLIT
    if words[0] in PREPOSITIONS:
        return (words[0], ' '.join(words[1:]), 'preposition')
    
    # 6. Check for particle (... به, ... نه, ... هم) - SPLIT
    for particle in PARTICLES:
        if particle in words:
            idx = words.index(particle)
            if idx > 0:
                return (' '.join(words[:idx]), particle, 'particle')
            elif idx < len(words) - 1:
                return (particle, ' '.join(words[idx+1:]), 'particle')
    
    # 7. Default: can't determine split
    return (phrase, None, None)


def query_split_pending(limit: int = 500, offset: int = 0) -> List[Dict]:
    """Query phrases marked as split_pending"""
    # Use --command with simple SQL - use list to avoid shell escaping
    query_sql = f"SELECT id, pashto_word, frequency_total FROM word_frequencies WHERE pos = 'split_pending' ORDER BY frequency_total DESC LIMIT {limit} OFFSET {offset}"
    
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


def escape_sql(text: str) -> str:
    """Escape SQL string"""
    if not text:
        return "NULL"
    return "'" + text.replace("'", "''") + "'"


def main():
    print("🔍 Processing phrases marked as 'split_pending'...\n")
    
    # Load verbs lexicon for split-head detection
    print("📚 Loading verbs lexicon...")
    verbs_lexicon = query_verbs_lexicon()
    print(f"   ✅ Loaded {len(verbs_lexicon)} verbs\n")
    
    # Query in batches
    all_entries = []
    batch_size = 500
    offset = 0
    
    while True:
        print(f"   Querying batch: offset {offset}...")
        entries = query_split_pending(limit=batch_size, offset=offset)
        if not entries:
            break
        all_entries.extend(entries)
        print(f"      Found {len(entries)} entries (total: {len(all_entries)})")
        if len(entries) < batch_size:
            break
        offset += batch_size
    
    print(f"\n   ✅ Total found: {len(all_entries)} phrases to process\n")
    
    entries = all_entries
    
    if not entries:
        print("   No phrases found")
        return
    
    # Process each phrase
    sql_statements = []
    sql_statements.append('-- Split phrases marked as split_pending')
    sql_statements.append('-- Generated from word_frequencies entries')
    sql_statements.append('-- Handles: minipronouns, directional pronouns, split-head verbs')
    sql_statements.append('')
    
    splits = []
    keep_together = []
    skipped = []
    
    for entry in entries:
        phrase = entry['pashto_word']
        word1, word2, split_type = split_phrase(phrase, verbs_lexicon)
        
        # Handle "keep together" cases
        if split_type and split_type.startswith('keep_'):
            keep_together.append({
                'phrase_id': entry['id'],
                'phrase': phrase,
                'keep_reason': split_type,
                'frequency': entry.get('frequency_total', 0),
            })
            continue
        
        # Skip if can't split
        if not word2 or not split_type:
            skipped.append({
                'phrase': phrase,
                'reason': 'cannot_determine_split',
            })
            continue
        
        splits.append({
            'phrase_id': entry['id'],
            'phrase': phrase,
            'word1': word1,
            'word2': word2,
            'split_type': split_type,
            'frequency': entry.get('frequency_total', 0),
        })
    
    print(f"   📊 Processing summary:")
    print(f"      Splits: {len(splits)}")
    print(f"      Keep together: {len(keep_together)}")
    print(f"      Skipped: {len(skipped)}\n")
    
    # Generate SQL for "keep together" cases first
    if keep_together:
        sql_statements.append('-- Mark phrases that should be kept together')
        sql_statements.append('-- (directional phrases, split-head verbs, pronoun+directional)')
        sql_statements.append('')
        
        for item in keep_together:
            phrase_id = item['phrase_id']
            phrase_escaped = escape_sql(item['phrase'])
            keep_reason = item['keep_reason']
            
            # Determine appropriate POS based on keep_reason
            if keep_reason == 'keep_directional_phrase':
                pos = 'directional_phrase'
            elif keep_reason == 'keep_split_head_verb':
                pos = 'verb_phrase'  # Or could be more specific
            elif keep_reason == 'keep_pronoun_directional':
                pos = 'pronoun_phrase'
            elif keep_reason == 'keep_directional_postposition':
                pos = 'directional_phrase'
            else:
                pos = 'phrase'  # Default
            
            sql_statements.append(f"-- Keep together: {item['phrase']} ({keep_reason})")
            sql_statements.append(f"""
UPDATE word_frequencies 
SET pos = '{pos}'
WHERE id = {phrase_id};
""")
            sql_statements.append('')
        
        sql_statements.append('')
    
    print(f"   Generating SQL for {len(splits)} splits...\n")
    
    # Generate SQL for splits
    for split in splits:
        phrase_id = split['phrase_id']
        phrase_escaped = escape_sql(split['phrase'])
        word1_escaped = escape_sql(split['word1'])
        word2_escaped = escape_sql(split['word2'])
        split_type = split['split_type']
        
        # Determine POS for word1 and word2
        # word1 gets the appropriate POS based on split type
        # word2 gets its own POS (postposition/preposition/particle)
        if split_type == 'postposition':
            pos1 = None  # Word1 keeps its existing POS (pronoun, noun, etc.)
            pos2 = 'postposition'
        elif split_type == 'preposition':
            pos1 = 'preposition'  # Word1 is the preposition
            pos2 = None  # Word2 keeps its existing POS (pronoun, noun, etc.)
        else:  # particle
            pos1 = None  # Word1 keeps its existing POS
            pos2 = 'particle'  # Word2 is the particle
        
        sql_statements.append(f"-- Split {split['phrase']} -> {split['word1']} + {split['word2']} ({split_type})")
        
        # Insert/update word1
        pos1_sql = f"'{pos1}'" if pos1 else "NULL"
        sql_statements.append(f"""
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total, pos)
SELECT {word1_escaped}, 0, {pos1_sql}
WHERE NOT EXISTS (SELECT 1 FROM word_frequencies WHERE pashto_word = {word1_escaped});
""")
        
        # Insert/update word2
        pos2_sql = f"'{pos2}'" if pos2 else "NULL"
        sql_statements.append(f"""
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total, pos)
SELECT {word2_escaped}, 0, {pos2_sql}
WHERE NOT EXISTS (SELECT 1 FROM word_frequencies WHERE pashto_word = {word2_escaped});
""")
        
        # Mark original as split
        sql_statements.append(f"""
UPDATE word_frequencies 
SET pos = 'split', pashto_word = pashto_word || ' [SPLIT]'
WHERE id = {phrase_id};
""")
        
        sql_statements.append('')
    
    # Write SQL file
    OUTPUT_SQL.write_text('\n'.join(sql_statements), encoding='utf-8')
    
    print(f"   ✅ Generated {OUTPUT_SQL}")
    print(f"   📊 Prepared {len(splits)} splits, {len(keep_together)} kept together, {len(skipped)} skipped")
    
    if keep_together:
        print(f"\n📋 Sample 'keep together' phrases (first 5):")
        for item in keep_together[:5]:
            print(f"   '{item['phrase']}' ({item['keep_reason']})")
    
    if splits:
        print(f"\n📋 Sample splits (first 10):")
        for split in splits[:10]:
            print(f"   '{split['phrase']}' -> '{split['word1']}' + '{split['word2']}' ({split['split_type']})")
    
    if skipped:
        print(f"\n⚠️  Sample skipped phrases (first 5):")
        for item in skipped[:5]:
            print(f"   '{item['phrase']}' ({item['reason']})")
    
    print(f"\n💡 Next step:")
    print(f"   wrangler d1 execute pashto-bible-db --remote --file {OUTPUT_SQL.relative_to(APP_ROOT)}")


if __name__ == '__main__':
    main()

