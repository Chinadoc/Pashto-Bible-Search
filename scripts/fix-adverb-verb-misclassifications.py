#!/usr/bin/env python3
"""
Fix Adverb-Verb Misclassifications in word_frequencies

This script identifies words that are categorized as verbs (have verb_type/transitivity)
but are actually adverbs (pos = 'adv.' or similar), and clears the verb-specific fields.
"""

import json
import subprocess
from pathlib import Path
from typing import Dict, Any, List

def query_d1(sql_query: str) -> List[Dict[str, Any]]:
    """Query D1 database"""
    cmd = f"""wrangler d1 execute pashto-bible-db --remote --command="{sql_query}" --json"""
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, encoding='utf-8', timeout=30)
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

def escape_sql_string(text: str) -> str:
    """Escape SQL string"""
    if not text:
        return 'NULL'
    return "'" + str(text).replace("'", "''") + "'"

def is_non_verb_pos(pos: str) -> bool:
    """Check if POS indicates a non-verb"""
    if not pos:
        return False
    
    pos_lower = pos.lower().strip()
    non_verb_patterns = [
        'adv.', 'adverb', 'adv ',
        'n.', 'noun', 'n ',
        'adj.', 'adjective', 'adj ',
        'pron.', 'pronoun', 'pron',
        'prep.', 'preposition', 'prep',
        'conj.', 'conjunction', 'conj',
        'det.', 'determiner', 'det',
        'num.', 'numeral', 'num',
        'interj.', 'interjection', 'interj',
        'prop.', 'proper',  # proper nouns
    ]
    
    for pattern in non_verb_patterns:
        if pattern in pos_lower:
            return True
    
    return False

def main():
    print("🔍 Fixing Adverb-Verb Misclassifications in word_frequencies\n")
    
    # Find words with verb_type/transitivity but non-verb POS
    print("📊 Finding misclassified words...")
    sql = """
    SELECT DISTINCT 
        pashto_word,
        pos,
        word_type,
        verb_type,
        transitivity,
        romanization
    FROM word_frequencies
    WHERE (
        verb_type IS NOT NULL 
        OR transitivity IS NOT NULL
        OR word_type = 'verb'
    )
    AND pos IS NOT NULL
    AND (
        pos LIKE '%adv.%' 
        OR pos LIKE '%adverb%'
        OR pos LIKE '%n.%' 
        OR pos LIKE '%noun%'
        OR pos LIKE '%adj.%'
        OR pos LIKE '%adjective%'
        OR pos LIKE '%pron.%'
        OR pos LIKE '%pronoun%'
        OR pos LIKE '%prep.%'
        OR pos LIKE '%preposition%'
        OR pos LIKE '%conj.%'
        OR pos LIKE '%conjunction%'
        OR pos LIKE '%det.%'
        OR pos LIKE '%determiner%'
        OR pos LIKE '%num.%'
        OR pos LIKE '%numeral%'
        OR pos LIKE '%interj.%'
        OR pos LIKE '%interjection%'
        OR pos LIKE '%prop.%'
        OR pos LIKE '%proper%'
    )
    ORDER BY pashto_word
    """
    
    misclassified = query_d1(sql)
    print(f"   ✅ Found {len(misclassified)} misclassified words")
    
    if not misclassified:
        print("   ✅ No misclassifications found!")
        return
    
    # Show examples
    print("\n📋 Examples of misclassified words:")
    for word in misclassified[:10]:
        print(f"   - {word.get('pashto_word')}: pos={word.get('pos')}, verb_type={word.get('verb_type')}, transitivity={word.get('transitivity')}")
    
    if len(misclassified) > 10:
        print(f"   ... and {len(misclassified) - 10} more")
    
    # Generate SQL to fix them
    print("\n📝 Generating SQL fixes...")
    sql_statements = []
    sql_statements.append("-- Fix Adverb-Verb Misclassifications")
    sql_statements.append("-- Clear verb-specific fields (verb_type, transitivity) for non-verbs")
    sql_statements.append("-- Set word_type based on POS instead\n")
    
    for word in misclassified:
        pashto_word = escape_sql_string(word.get('pashto_word', ''))
        pos = word.get('pos', '').strip()
        
        # Determine correct word_type from POS
        word_type = 'unknown'
        if is_non_verb_pos(pos):
            if 'adv' in pos.lower():
                word_type = 'adverb'
            elif 'n.' in pos.lower() or 'noun' in pos.lower():
                word_type = 'noun'
            elif 'adj' in pos.lower():
                word_type = 'adjective'
            elif 'pron' in pos.lower():
                word_type = 'pronoun'
            elif 'prep' in pos.lower():
                word_type = 'preposition'
            elif 'conj' in pos.lower():
                word_type = 'conjunction'
            else:
                word_type = 'other'
        
        # Build UPDATE statement to clear verb fields
        updates = []
        updates.append("verb_type = NULL")
        updates.append("transitivity = NULL")
        updates.append("base_verb = NULL")
        updates.append("imperfective_stem = NULL")
        updates.append("perfective_stem = NULL")
        updates.append("perfective_root = NULL")
        updates.append("past_participle = NULL")
        updates.append("complement_text = NULL")
        updates.append("aux_verb = NULL")
        updates.append("yul_ending = 0")
        
        # Set correct word_type
        if word_type != 'unknown':
            updates.append(f"word_type = {escape_sql_string(word_type)}")
        
        sql = f"UPDATE word_frequencies SET {', '.join(updates)} WHERE pashto_word = {pashto_word};"
        sql_statements.append(sql)
    
    # Write SQL file
    output_path = Path('cloudflare/fix-adverb-verb-misclassifications.sql')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"   ✅ Generated {output_path}")
    print(f"   ✅ {len(misclassified)} UPDATE statements")
    
    print("\n✅ Done!")
    print(f"\n📋 Next steps:")
    print(f"   1. Review cloudflare/fix-adverb-verb-misclassifications.sql")
    print(f"   2. Run: wrangler d1 execute pashto-bible-db --remote --file cloudflare/fix-adverb-verb-misclassifications.sql")
    print(f"   3. Verify fixes in Cloudflare D1 Studio")

if __name__ == '__main__':
    main()


