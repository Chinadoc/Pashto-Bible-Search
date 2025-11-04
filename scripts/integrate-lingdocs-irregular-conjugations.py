#!/usr/bin/env python3
"""
Integrate LingDocs irregular conjugations into D1 database

This script:
1. Loads the extracted LingDocs irregular conjugations
2. Creates/updates entries in verbs_lexicon with comprehensive forms
3. Creates a verb_forms table with all morphological variants for fast search

Usage:
    python3 scripts/integrate-lingdocs-irregular-conjugations.py
"""

import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, Any, List, Set

APP_ROOT = Path(__file__).parent.parent
LINGDOCS_JSON = APP_ROOT / 'lingdocs_irregular_conjugations.json'
OUTPUT_SQL = APP_ROOT / 'cloudflare' / 'integrate-lingdocs-irregular-conjugations.sql'

def escape_sql_string(text: str) -> str:
    """Escape SQL string"""
    if not text:
        return 'NULL'
    return "'" + str(text).replace("'", "''") + "'"

def query_d1(sql_query: str):
    """Query D1 database"""
    cmd = f"""wrangler d1 execute pashto-bible-db --remote --command="{sql_query.replace('"', '\\"')}" --json"""
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, encoding='utf-8', timeout=60)
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
    print("🎯 Integrating LingDocs Irregular Conjugations\n")
    
    # Load extracted conjugations
    if not LINGDOCS_JSON.exists():
        print(f"   ❌ Error: {LINGDOCS_JSON} not found")
        print(f"   💡 Run: python3 scripts/extract-lingdocs-irregular-conjugations.py")
        return 1
    
    print(f"📖 Loading {LINGDOCS_JSON}...")
    with open(LINGDOCS_JSON, 'r', encoding='utf-8') as f:
        lingdocs_data = json.load(f)
    
    verbs = lingdocs_data.get('verbs', {})
    flattened = lingdocs_data.get('flattened_forms', {})
    
    print(f"   ✅ Loaded {len(verbs)} verbs with {sum(len(forms) for forms in flattened.values())} total forms\n")
    
    # Generate SQL statements
    print("📝 Generating SQL statements...")
    sql_statements = []
    sql_statements.append("-- Integrate LingDocs irregular conjugations into D1 database")
    sql_statements.append("-- This adds comprehensive conjugation forms for irregular verbs")
    sql_statements.append("-- Generated from LingDocs pashto-inflector irregular-conjugations.ts\n")
    
    # Map verb names to their stems/roots (from irregular_verbs.json)
    verb_stems = {
        'کېدل': {'imperfective_stem': 'کېږ', 'perfective_stem': 'وش', 'perfective_root': 'وشول', 'past_participle': 'شوی'},
        'کول': {'imperfective_stem': 'کو', 'perfective_stem': 'وکړ', 'perfective_root': 'وکړ', 'past_participle': 'کړی'},
        'تلل': {'imperfective_stem': 'ځ', 'perfective_stem': 'لاړ ش', 'perfective_root': 'لاړل', 'past_participle': 'تللی'},
        'ورکول': {'imperfective_stem': 'ورکو', 'perfective_stem': 'ورکړ', 'perfective_root': 'ورکړ', 'past_participle': 'ورکړی'},
        'درکول': {'imperfective_stem': 'درکو', 'perfective_stem': 'درکړ', 'perfective_root': 'درکړ', 'past_participle': 'درکړی'},
        'راکول': {'imperfective_stem': 'راکو', 'perfective_stem': 'راکړ', 'perfective_root': 'راکړ', 'past_participle': 'راکړی'},
    }
    
    # Step 1: Update verbs_lexicon with stems from LingDocs data
    for pashto_verb, forms_data in verbs.items():
        stems = verb_stems.get(pashto_verb, {})
        
        sql = f"""INSERT OR REPLACE INTO verbs_lexicon 
(verb_root, imperfective_stem, perfective_stem, perfective_root, past_participle, pos, romanization, updated_at)
VALUES (
  {escape_sql_string(pashto_verb)},
  {escape_sql_string(stems.get('imperfective_stem', ''))},
  {escape_sql_string(stems.get('perfective_stem', ''))},
  {escape_sql_string(stems.get('perfective_root', ''))},
  {escape_sql_string(stems.get('past_participle', ''))},
  {escape_sql_string('v. irreg.')},
  NULL,
  strftime('%s', 'now')
);"""
        
        sql_statements.append(sql)
    
    sql_statements.append("\n-- Create verb_forms table if it doesn't exist")
    sql_statements.append("""CREATE TABLE IF NOT EXISTS verb_forms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  verb_root TEXT NOT NULL,
  form TEXT NOT NULL,
  form_type TEXT, -- 'present', 'past', 'perfective', 'imperative', 'modal', etc.
  person TEXT, -- '1sg', '2sg', '3sg', '1pl', '2pl', '3pl'
  gender TEXT, -- 'm', 'f'
  number TEXT, -- 'sg', 'pl'
  aspect TEXT, -- 'imperfective', 'perfective'
  tense TEXT, -- 'present', 'past', 'future', etc.
  mood TEXT, -- 'indicative', 'subjunctive', 'imperative', 'modal'
  romanization TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  UNIQUE(verb_root, form)
);""")
    
    sql_statements.append("CREATE INDEX IF NOT EXISTS idx_verb_forms_root ON verb_forms(verb_root);")
    sql_statements.append("CREATE INDEX IF NOT EXISTS idx_verb_forms_form ON verb_forms(form);")
    sql_statements.append("CREATE INDEX IF NOT EXISTS idx_verb_forms_type ON verb_forms(form_type);\n")
    
    # Step 2: Insert all forms into verb_forms table
    sql_statements.append("-- Insert all LingDocs conjugation forms")
    form_count = 0
    
    for pashto_verb, form_list in flattened.items():
        verb_forms_data = verbs.get(pashto_verb, {})
        forms_dict = verb_forms_data.get('forms', {})
        
        for form in form_list:
            romanization = forms_dict.get(form, '')
            
            sql = f"""INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  {escape_sql_string(pashto_verb)},
  {escape_sql_string(form)},
  {escape_sql_string(romanization)},
  strftime('%s', 'now')
);"""
            
            sql_statements.append(sql)
            form_count += 1
            
            if form_count % 100 == 0:
                sql_statements.append(f"-- {form_count} forms inserted so far...")
    
    # Write SQL file
    OUTPUT_SQL.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_SQL, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"\n✅ Generated {OUTPUT_SQL}")
    print(f"✅ {len(verbs)} verbs updated in verbs_lexicon")
    print(f"✅ {form_count} forms inserted into verb_forms")
    
    print(f"\n📋 Next steps:")
    print(f"   1. Review the SQL file: {OUTPUT_SQL}")
    print(f"   2. Run: wrangler d1 execute pashto-bible-db --remote --file {OUTPUT_SQL.name}")
    print(f"\n💡 This will:")
    print(f"   - Update verbs_lexicon with correct stems")
    print(f"   - Create verb_forms table with all conjugation variants")
    print(f"   - Enable fast search for any conjugated form")
    
    return 0

if __name__ == '__main__':
    sys.exit(main())

