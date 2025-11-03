#!/usr/bin/env python3
"""
Rebuild nouns_lexicon table from full_dictionary_enriched.json

The generated SQL file drops and recreates nouns_lexicon with dictionary data
so noun metadata stays in sync with the authoritative lexicon.

Usage:
  python3 scripts/rebuild-nouns-lexicon-table.py
  wrangler d1 execute pashto-bible-db --remote --file cloudflare/rebuild-nouns-lexicon.sql
"""

import json
from pathlib import Path
from typing import Any, Dict, List

APP_ROOT = Path(__file__).resolve().parent.parent
DICTIONARY_PATHS = [
    APP_ROOT / 'docs/lexicon/full_dictionary_enriched.json',
    APP_ROOT / 'full_dictionary_enriched.json',
]
OUTPUT_SQL = APP_ROOT / 'cloudflare' / 'rebuild-nouns-lexicon.sql'


def _load_dictionary() -> List[Dict[str, Any]]:
    for path in DICTIONARY_PATHS:
        if path.exists():
            try:
                data = json.loads(path.read_text(encoding='utf-8'))
                if isinstance(data, dict) and 'entries' in data:
                    return data['entries']  # type: ignore
                if isinstance(data, list):
                    return data  # type: ignore
            except Exception as exc:  # pragma: no cover
                print(f"   ⚠️  Failed to read {path}: {exc}")
    return []


def _normalize_pashto(text: str) -> str:
    return (text or '').strip()


def _extract_nouns(entries: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    nouns: Dict[str, Dict[str, Any]] = {}
    for entry in entries:
        if not isinstance(entry, dict):
            continue
        pashto = entry.get('pashto') or entry.get('p') or ''
        pos = (entry.get('pos') or entry.get('c') or '').lower()
        family = (entry.get('pos_family') or '').lower()
        if not pashto:
            continue
        is_noun = 'noun' in pos or 'n.' in pos or family == 'noun'
        if not is_noun:
            continue
        lemma = _normalize_pashto(pashto)
        if not lemma:
            continue
        nouns[lemma] = {
            'pashto_word': lemma,
            'romanized': entry.get('romanization') or entry.get('f') or '',
            'gender': entry.get('gender') or entry.get('noun_gender') or '',
            'number': entry.get('number') or entry.get('noun_number') or 'singular',
            'plural_forms': entry.get('plural_forms') or entry.get('plurals') or '',
            'inflection_type': entry.get('noun_pattern') or entry.get('inflection_pattern') or '',
            'english': entry.get('english') or entry.get('e') or '',
        }
    return nouns


def main() -> None:
    print('📚 Loading full dictionary...')
    entries = _load_dictionary()
    if not entries:
        print('   ❌ Could not load full_dictionary_enriched.json')
        return
    print(f'   ✅ Loaded {len(entries)} entries')

    print('\n🔍 Extracting nouns...')
    nouns = _extract_nouns(entries)
    if not nouns:
        print('   ❌ No nouns detected')
        return
    print(f'   ✅ Found {len(nouns)} nouns')

    OUTPUT_SQL.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_SQL.open('w', encoding='utf-8') as f:
        f.write('-- Rebuild nouns_lexicon from full_dictionary_enriched.json\n')
        f.write('PRAGMA foreign_keys = OFF;\n')
        f.write('DROP TABLE IF EXISTS nouns_lexicon;\n')
        f.write('CREATE TABLE nouns_lexicon (\n')
        f.write('  id INTEGER PRIMARY KEY AUTOINCREMENT,\n')
        f.write('  pashto_word TEXT NOT NULL UNIQUE,\n')
        f.write('  romanized TEXT,\n')
        f.write('  gender TEXT,\n')
        f.write('  number TEXT,\n')
        f.write('  plural_forms TEXT,\n')
        f.write('  inflection_type TEXT,\n')
        f.write('  english TEXT,\n')
        f.write("  created_at INTEGER DEFAULT (strftime('%s','now')),\n")
        f.write("  updated_at INTEGER DEFAULT (strftime('%s','now'))\n")
        f.write(');\n')
        f.write('CREATE INDEX IF NOT EXISTS idx_nouns_lexicon_pashto ON nouns_lexicon (pashto_word);\n')
        f.write('CREATE INDEX IF NOT EXISTS idx_nouns_lexicon_gender ON nouns_lexicon (gender);\n')
        for noun in nouns.values():
            escaped = {k: (str(v).replace("'", "''") if v is not None else '') for k, v in noun.items()}
            f.write(
                "INSERT INTO nouns_lexicon (pashto_word, romanized, gender, number, plural_forms, inflection_type, english)\n"
            )
            f.write(
                f"VALUES ('{escaped['pashto_word']}', '{escaped['romanized']}', '{escaped['gender']}', "
                f"'{escaped['number']}', '{escaped['plural_forms']}', '{escaped['inflection_type']}', '{escaped['english']}');\n"
            )
    print(f'   ✅ Wrote {OUTPUT_SQL} with {len(nouns)} INSERT statements')
    print('\n📋 Next steps:')
    print(f'   wrangler d1 execute pashto-bible-db --remote --file {OUTPUT_SQL.relative_to(APP_ROOT)}')


if __name__ == '__main__':
    main()
