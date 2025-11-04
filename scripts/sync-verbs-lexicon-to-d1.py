#!/usr/bin/env python3
"""
Sync verbs_lexicon.json to Cloudflare D1 database

This script reads verbs_lexicon.json (generated from full_dictionary_enriched.json)
and syncs it to the verbs_lexicon table in D1.

Usage:
    python3 scripts/sync-verbs-lexicon-to-d1.py
"""

import json
import subprocess
import sys
from pathlib import Path

APP_ROOT = Path(__file__).parent.parent
VERBS_LEXICON_JSON = APP_ROOT / 'verbs_lexicon.json'
OUTPUT_SQL = APP_ROOT / 'cloudflare' / 'sync-verbs-lexicon-to-d1.sql'

def escape_sql_string(text: str) -> str:
    """Escape SQL string"""
    if not text:
        return 'NULL'
    return "'" + str(text).replace("'", "''") + "'"

def main():
    print("📚 Syncing verbs_lexicon.json to D1 database\n")
    
    # Load verbs_lexicon.json
    if not VERBS_LEXICON_JSON.exists():
        print(f"   ❌ Error: {VERBS_LEXICON_JSON} not found")
        print(f"   💡 Run: python3 rebuild_lexicons.py")
        return 1
    
    print(f"📖 Loading {VERBS_LEXICON_JSON}...")
    with open(VERBS_LEXICON_JSON, 'r', encoding='utf-8') as f:
        verbs_lexicon = json.load(f)
    
    if not isinstance(verbs_lexicon, dict):
        print(f"   ❌ Error: verbs_lexicon.json should be a JSON object")
        return 1
    
    print(f"   ✅ Loaded {len(verbs_lexicon)} verbs\n")
    
    # Generate SQL statements
    print("📝 Generating SQL statements...")
    sql_statements = []
    sql_statements.append("-- Sync verbs_lexicon.json to D1 database")
    sql_statements.append("-- Generated from full_dictionary_enriched.json via rebuild_lexicons.py")
    sql_statements.append("-- This replaces all entries in verbs_lexicon with the enhanced dictionary\n")
    
    count = 0
    for verb_root, verb_data in verbs_lexicon.items():
        if not isinstance(verb_data, dict):
            continue
        
        # Extract data
        stems = verb_data.get('stems', {})
        roots = verb_data.get('roots', {})
        impf_stem = stems.get('imperfective', '')
        perf_stem = stems.get('perfective', '')
        impf_root = roots.get('imperfective', verb_root)
        perf_root = roots.get('perfective', '')
        past_part = verb_data.get('past_participle', '')
        rom = verb_data.get('romanization', {})
        
        # Handle romanization (could be dict or string)
        if isinstance(rom, dict):
            romanization = rom.get('p', '') or rom.get('form', '') or ''
        elif isinstance(rom, str):
            romanization = rom
        else:
            romanization = ''
        
        # Determine POS from verb structure
        pos = 'v.'
        if ' کېدل' in verb_root or ' کول' in verb_root:
            pos = 'v. stat. comp.'
            if 'trans' in verb_data.get('type', '').lower():
                pos += ' trans.'
            else:
                pos += ' intrans.'
        elif verb_data.get('type', '').lower() == 'dynamic':
            pos = 'v. dyn. comp.'
        elif verb_data.get('type', '').lower() == 'stative':
            pos = 'v. stat. comp.'
        else:
            pos = 'v.'
        
        # Generate INSERT OR REPLACE
        sql = f"""INSERT OR REPLACE INTO verbs_lexicon 
(verb_root, imperfective_stem, perfective_stem, perfective_root, past_participle, pos, romanization, updated_at)
VALUES (
  {escape_sql_string(verb_root)},
  {escape_sql_string(impf_stem)},
  {escape_sql_string(perf_stem)},
  {escape_sql_string(perf_root)},
  {escape_sql_string(past_part)},
  {escape_sql_string(pos)},
  {escape_sql_string(romanization)},
  strftime('%s', 'now')
);"""
        
        sql_statements.append(sql)
        count += 1
        
        # Progress indicator
        if count % 100 == 0:
            print(f"   ✅ Processed {count} verbs...")
    
    # Write SQL file
    OUTPUT_SQL.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_SQL, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"\n✅ Generated {OUTPUT_SQL}")
    print(f"✅ {count} INSERT OR REPLACE statements")
    
    print(f"\n📋 Next steps:")
    print(f"   1. Review the SQL file: {OUTPUT_SQL}")
    print(f"   2. Run: wrangler d1 execute pashto-bible-db --remote --file {OUTPUT_SQL.name}")
    print(f"\n⚠️  Note: This will replace ALL entries in verbs_lexicon with the enhanced dictionary")
    
    return 0

if __name__ == '__main__':
    sys.exit(main())

