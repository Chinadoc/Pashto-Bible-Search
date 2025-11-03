#!/usr/bin/env python3
"""
Identify compound biblical names and their parts that should be deleted.

This script:
1. Finds compound names with zero-width joiners (‌)
2. Identifies their component parts
3. Checks if those parts exist as separate entries
4. Generates SQL to delete the parts (since compound forms exist)
"""

import json
import re
import sys
from collections import defaultdict

# Known compound biblical names from fix-compound-biblical-names.sql
KNOWN_COMPOUNDS = {
    'اخى‌اب': ('اخى', 'اب'),
    'حنن‌ايل': ('حنن', 'ايل'),
    'حنم‌ايل': ('حنم', 'ايل'),
    'بيت‌ايل': ('بيت', 'ايل'),
    'اِلى‌عالى': ('اِلى', 'عالى'),
    'شلتى‌اېل': ('شلتى', 'اېل'),
}

# Common compound name patterns
COMPOUND_PATTERNS = [
    # Pattern: [part1]‌[part2] where part2 is common (ايل, اېل, اب, etc.)
    (r'(.+?)‌(ايل|اېل|اب|عالى|عزر|مَلِک|سلوم|شاګ|مایيل|نوعم|جیل|خېل|آسف|تُفل|بزق|صدق)', 'second_part'),
    # Pattern: [part1]‌[part2] where part1 is common (ابى, اِلى, etc.)
    (r'(ابى|اِلى|اخى|اورى|ايتى|ارى|اسرى|اِفتاح|بتو|ادونى)‌(.+)', 'first_part'),
]

def find_compound_names():
    """Find all compound names with zero-width joiners"""
    compounds = {}
    
    # Query database for compound names
    import subprocess
    result = subprocess.run(
        ['wrangler', 'd1', 'execute', 'pashto-bible-db', '--remote', '--command',
         "SELECT pashto_word FROM word_frequencies WHERE pashto_word LIKE '%‌%' AND pashto_word NOT LIKE '% %' ORDER BY pashto_word"],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        print(f"Error querying database: {result.stderr}")
        return compounds
    
    # Parse JSON output
    try:
        output = json.loads(result.stdout)
        if output and len(output) > 0 and 'results' in output[0]:
            words = output[0]['results']
            for word_obj in words:
                word = word_obj.get('pashto_word', '')
                # Skip if it contains punctuation or other words
                if any(char in word for char in ['،', ' ', '«', '»', '(', ')', 'ته', 'به', 'په', 'ورته']):
                    continue
                
                # Check if it matches known patterns
                parts = split_compound(word)
                if parts:
                    compounds[word] = parts
    except Exception as e:
        print(f"Error parsing output: {e}")
    
    return compounds

def split_compound(word):
    """Split a compound word into parts"""
    if '‌' not in word:
        return None
    
    parts = word.split('‌')
    if len(parts) == 2:
        return tuple(parts)
    elif len(parts) > 2:
        # Multi-part compound (e.g., ابيل‌بيت‌معکه)
        return tuple(parts)
    return None

def check_part_exists(part):
    """Check if a part exists as a separate entry"""
    import subprocess
    result = subprocess.run(
        ['wrangler', 'd1', 'execute', 'pashto-bible-db', '--remote', '--command',
         f"SELECT COUNT(*) as count FROM word_frequencies WHERE pashto_word = '{part}'"],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        return False
    
    try:
        output = json.loads(result.stdout)
        if output and len(output) > 0 and 'results' in output[0]:
            count = output[0]['results'][0].get('count', 0)
            return count > 0
    except:
        pass
    
    return False

def main():
    print("🔍 Identifying compound biblical names and their parts...\n")
    
    # Find all compound names
    compounds = find_compound_names()
    
    # Also add known compounds
    compounds.update(KNOWN_COMPOUNDS)
    
    print(f"Found {len(compounds)} compound names\n")
    
    # Analyze each compound
    parts_to_delete = []
    compounds_to_ensure = []
    
    for compound, parts in compounds.items():
        if not parts or len(parts) < 2:
            continue
        
        parts_list = list(parts)
        part1, part2 = parts_list[0], parts_list[1]
        
        # Check if parts exist
        part1_exists = check_part_exists(part1)
        part2_exists = check_part_exists(part2)
        
        # Only delete parts that exist AND are likely parts of compound names
        # Common biblical name parts that should be deleted
        common_parts = ['ايل', 'اېل', 'اب', 'اخى', 'اِلى', 'اېل', 'عزر', 'عالى']
        
        # Check if parts are common compound name parts
        should_delete_part1 = part1_exists and (
            part1 in common_parts or 
            part1 in ['ابى', 'اِلى', 'اخى', 'اورى', 'ايتى', 'ارى', 'اسرى', 'اِفتاح', 'بتو']
        )
        
        should_delete_part2 = part2_exists and (
            part2 in common_parts or
            part2 in ['مَلِک', 'سلوم', 'شاګ', 'مایيل', 'نوعم', 'جیل', 'خېل', 'آسف', 'تُفل', 'بزق', 'صدق']
        )
        
        compounds_to_ensure.append((compound, parts))
        
        if should_delete_part1:
            parts_to_delete.append({
                'part': part1,
                'compound': compound,
                'reason': f'part of {compound}'
            })
        
        if should_delete_part2:
            parts_to_delete.append({
                'part': part2,
                'compound': compound,
                'reason': f'part of {compound}'
            })
    
    # Also check for special cases like "اعلیحضرته"
    # This is "اعلی" + "حضرت" + suffix "ه"
    special_cases = [
        ('اعلیحضرته', 'اعلی', 'حضرت'),
    ]
    
    for compound, part1, part2 in special_cases:
        part1_exists = check_part_exists(part1)
        part2_exists = check_part_exists(part2)
        
        if part1_exists:
            parts_to_delete.append({
                'part': part1,
                'compound': compound,
                'reason': f'part of {compound} (اعلی + حضرت)'
            })
        
        if part2_exists:
            parts_to_delete.append({
                'part': part2,
                'compound': compound,
                'reason': f'part of {compound} (اعلی + حضرت)'
            })
    
    # Remove duplicates
    unique_parts = {}
    for item in parts_to_delete:
        part = item['part']
        if part not in unique_parts:
            unique_parts[part] = item
        else:
            # Keep the one with more compounds
            if len(item['compound']) > len(unique_parts[part]['compound']):
                unique_parts[part] = item
    
    parts_to_delete = list(unique_parts.values())
    
    print(f"Found {len(compounds_to_ensure)} compound names to ensure exist")
    print(f"Found {len(parts_to_delete)} parts to delete\n")
    
    # Generate SQL
    sql_lines = [
        "-- Delete words that are parts of compound biblical names",
        "-- These should be removed since the compound form exists as a separate entry",
        "-- Generated by identify-compound-name-parts.py",
        "",
    ]
    
    # Step 1: Ensure compound forms exist
    sql_lines.append("-- Step 1: Ensure compound forms exist (insert if missing)")
    for compound, parts in sorted(compounds_to_ensure):
        # Get romanization if available (basic mapping)
        romanization_map = {
            'اخى‌اب': 'Ahab',
            'حنن‌ايل': 'Hananeel',
            'حنم‌ايل': 'Hananeel',
            'بيت‌ايل': 'Bethel',
            'اِلى‌عالى': 'Elealeh',
            'شلتى‌اېل': 'Shealtiel',
        }
        romanization = romanization_map.get(compound, '')
        
        sql_lines.append(f"-- {compound} = {' + '.join(parts)}")
        sql_lines.append(
            f"INSERT OR IGNORE INTO word_frequencies (pashto_word, word_type, pos, romanization, has_issues, issue_flags) "
            f"VALUES ('{compound}', 'proper_noun', 'n. prop.', '{romanization}', 0, '[]');"
        )
        sql_lines.append("")
    
    # Step 2: Delete parts
    sql_lines.append("-- Step 2: Delete parts of compound names")
    for item in sorted(parts_to_delete, key=lambda x: x['part']):
        sql_lines.append(f"-- {item['part']} is part of compound: {item['compound']}")
        sql_lines.append(f"-- {item['reason']}")
        sql_lines.append(f"DELETE FROM word_frequencies WHERE pashto_word = '{item['part']}';")
        sql_lines.append("")
    
    # Write SQL file
    sql_path = 'cloudflare/delete-compound-name-parts.sql'
    with open(sql_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_lines))
    
    print(f"✅ Generated SQL file: {sql_path}")
    print(f"\nSummary:")
    print(f"  - {len(compounds_to_ensure)} compound names to ensure exist")
    print(f"  - {len(parts_to_delete)} parts to delete")
    print(f"\nNext steps:")
    print(f"  1. Review {sql_path}")
    print(f"  2. Run: wrangler d1 execute pashto-bible-db --remote --file {sql_path}")

if __name__ == '__main__':
    main()

