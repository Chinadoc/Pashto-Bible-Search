#!/usr/bin/env python3
"""
Check Progress of Batch Processing

Quick script to see how many forms have been classified so far
"""

import json
import subprocess

def query_d1(sql_query: str):
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
        print(f"   ⚠️  Error: {e}")
        return []

def main():
    print("📊 Checking Batch Processing Progress\n")
    
    # Count forms by type
    sql = """
    SELECT form_type, COUNT(*) as count
    FROM word_frequencies
    WHERE form_type IS NOT NULL
    GROUP BY form_type
    ORDER BY count DESC
    """
    
    results = query_d1(sql)
    
    if results:
        print("✅ Forms Classified by Type:")
        print("=" * 40)
        total = 0
        for row in results:
            form_type = row.get('form_type', 'unknown')
            count = row.get('count', 0)
            total += count
            print(f"   {form_type:<20} {count:>10}")
        print("=" * 40)
        print(f"   {'TOTAL':<20} {total:>10}")
    
    # Count base verbs processed
    sql2 = """
    SELECT COUNT(DISTINCT base_verb) as count
    FROM word_frequencies
    WHERE base_verb IS NOT NULL 
    AND word_type = 'verb'
    AND base_verb = pashto_word
    """
    
    base_verbs = query_d1(sql2)
    if base_verbs:
        count = base_verbs[0].get('count', 0)
        print(f"\n📋 Total Base Verbs: {count}")
        print(f"   Estimated batches: {count // 100 + 1}")

if __name__ == '__main__':
    main()

