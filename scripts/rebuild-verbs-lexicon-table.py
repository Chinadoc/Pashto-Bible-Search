#!/usr/bin/env python3
"""
Rebuild verbs_lexicon table from full_dictionary_enriched.json

This script loads the enriched dictionary JSON and generates a SQL file that:
  1. Drops and recreates verbs_lexicon with the expected schema
  2. Inserts every verb entry with stems/roots/participle metadata

Usage:
  python3 scripts/rebuild-verbs-lexicon-table.py
  wrangler d1 execute pashto-bible-db --remote --file cloudflare/rebuild-verbs-lexicon.sql
"""

import json
from pathlib import Path
from typing import Any, Dict, List, Tuple

APP_ROOT = Path(__file__).resolve().parent.parent
DICTIONARY_PATHS = [
    APP_ROOT / 'docs/lexicon/full_dictionary_enriched.json',
    APP_ROOT / 'full_dictionary_enriched.json',
]
OUTPUT_SQL = APP_ROOT / 'cloudflare' / 'rebuild-verbs-lexicon.sql'


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


def _infer_missing_stems(root: str, psp: str, ssp: str, prp: str, pp: str) -> Tuple[str, str, str, str]:
    if psp and not ssp:
        if not psp.startswith('و'):
            ssp = 'و' + psp
    if root and not prp:
        prp = root if root.startswith('و') else 'و' + root
    if root and not pp and root.endswith('ل'):
        base = root[:-1]
        if base:
            if root.endswith('ېدل'):
                pp = base + 'لی'
            elif root.endswith('کېدل'):
                pp = 'شوی'
            elif root.endswith('کول'):
                comp = root[:-3]
                pp = comp + ' کړی'
            elif root.endswith('ول') and ' ' not in root:
                comp = root[:-2]
                pp = comp + ' کړی'
            else:
                pp = base + 'لی'
    return psp, ssp, prp, pp


def _extract_verbs(entries: List[Dict[str, Any]]) -> Dict[str, Dict[str, str]]:
    verbs: Dict[str, Dict[str, str]] = {}
    for entry in entries:
        if not isinstance(entry, dict):
            continue
        pashto = entry.get('pashto') or entry.get('p') or ''
        pos = (entry.get('pos') or entry.get('c') or '').lower()
        if not pashto or ('verb' not in pos and 'v.' not in pos):
            continue
        psp = entry.get('psp') or ''
        ssp = entry.get('ssp') or ''
        prp = entry.get('prp') or ''
        pp = entry.get('pp') or entry.get('past_participle') or ''
        psp, ssp, prp, pp = _infer_missing_stems(pashto, psp, ssp, prp, pp)
        verbs[pashto] = {
            'verb_root': pashto,
            'imperfective_stem': psp,
            'perfective_stem': ssp,
            'perfective_root': prp,
            'past_participle': pp,
            'pos': entry.get('pos') or entry.get('c') or '',
            'romanization': entry.get('romanization') or entry.get('f') or '',
            'english': entry.get('english') or entry.get('e') or '',
        }
    return verbs


def main() -> None:
    print('📚 Loading full dictionary...')
    entries = _load_dictionary()
    if not entries:
        print('   ❌ Could not load full_dictionary_enriched.json')
        return
    print(f'   ✅ Loaded {len(entries)} entries')

    print('\n🔍 Extracting verbs...')
    verbs = _extract_verbs(entries)
    if not verbs:
        print('   ❌ No verbs detected')
        return
    print(f'   ✅ Found {len(verbs)} verbs')

    print('\n📝 Building SQL file...')
    OUTPUT_SQL.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_SQL.open('w', encoding='utf-8') as f:
        f.write('-- Rebuild verbs_lexicon from full_dictionary_enriched.json\n')
        f.write('PRAGMA foreign_keys = OFF;\n')
        f.write('DROP TABLE IF EXISTS verbs_lexicon;\n')
        f.write('CREATE TABLE verbs_lexicon (\n')
        f.write('  id INTEGER PRIMARY KEY AUTOINCREMENT,\n')
        f.write('  verb_root TEXT NOT NULL UNIQUE,\n')
        f.write('  imperfective_stem TEXT,\n')
        f.write('  perfective_stem TEXT,\n')
        f.write('  perfective_root TEXT,\n')
        f.write('  past_participle TEXT,\n')
        f.write('  pos TEXT,\n')
        f.write('  romanization TEXT,\n')
        f.write('  english TEXT,\n')
        f.write("  created_at INTEGER DEFAULT (strftime('%s','now')),\n")
        f.write("  updated_at INTEGER DEFAULT (strftime('%s','now'))\n")
        f.write(');\n')
        f.write('CREATE INDEX IF NOT EXISTS idx_verbs_lexicon_root ON verbs_lexicon (verb_root);\n')
        f.write('CREATE INDEX IF NOT EXISTS idx_verbs_lexicon_imperfective ON verbs_lexicon (imperfective_stem);\n')
        f.write('CREATE INDEX IF NOT EXISTS idx_verbs_lexicon_perfective ON verbs_lexicon (perfective_stem);\n')
        for verb in verbs.values():
            values = {
                'verb_root': verb['verb_root'],
                'imperfective_stem': verb['imperfective_stem'],
                'perfective_stem': verb['perfective_stem'],
                'perfective_root': verb['perfective_root'],
                'past_participle': verb['past_participle'],
                'pos': verb['pos'],
                'romanization': verb['romanization'],
                'english': verb['english'],
            }
            escaped = {k: v.replace("'", "''") for k, v in values.items()}
            f.write(
                "INSERT INTO verbs_lexicon (verb_root, imperfective_stem, perfective_stem, perfective_root, past_participle, pos, romanization, english)\n"
            )
            f.write(
                f"VALUES ('{escaped['verb_root']}', '{escaped['imperfective_stem']}', '{escaped['perfective_stem']}', "
                f"'{escaped['perfective_root']}', '{escaped['past_participle']}', '{escaped['pos']}', "
                f"'{escaped['romanization']}', '{escaped['english']}');\n"
            )
    print(f'   ✅ Wrote {OUTPUT_SQL} with {len(verbs)} INSERT statements')
    print('\n📋 Next steps:')
    print(f'   wrangler d1 execute pashto-bible-db --remote --file {OUTPUT_SQL.relative_to(APP_ROOT)}')


if __name__ == '__main__':
    main()
