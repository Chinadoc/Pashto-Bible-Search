#!/usr/bin/env python3
"""
Create verb_forms table with all conjugated forms for each verb.

This script loads the enriched dictionary, generates conjugations for each verb
using the verb inflector, and writes a SQL file that rebuilds the verb_forms
lookup table for rapid matching.

Usage:
  python3 scripts/create-verb-forms-table.py
  wrangler d1 execute pashto-bible-db --remote --file cloudflare/create-verb-forms.sql
"""

import json
from pathlib import Path
from typing import Any, Dict, List, Tuple
import sys

APP_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(APP_ROOT))

DICTIONARY_PATHS = [
    APP_ROOT / 'docs/lexicon/full_dictionary_enriched.json',
    APP_ROOT / 'full_dictionary_enriched.json',
]
OUTPUT_SQL = APP_ROOT / 'cloudflare' / 'create-verb-forms.sql'

from functions.verb_inflector import conjugate_verb  # type: ignore

FORM_LABELS: Dict[str, Tuple[str, str]] = {
    'present': ('present', 'present'),
    'subjunctive': ('subjunctive', 'present'),
    'continuous_past': ('past', 'continuous'),
    'simple_past': ('past', 'simple'),
    'imperfective_future': ('future', 'imperfective'),
    'perfective_future': ('future', 'perfective'),
    'imperfective_imperative': ('imperative', 'imperfective'),
    'perfective_imperative': ('imperative', 'perfective'),
    'habitual_continuous_past': ('past', 'habitual_continuous'),
    'habitual_simple_past': ('past', 'habitual_simple'),
    'ability_present': ('ability', 'present'),
    'ability_subjunctive': ('ability', 'subjunctive'),
    'ability_continuous_past': ('ability', 'continuous_past'),
    'ability_simple_past': ('ability', 'simple_past'),
    'ability_imperfective_future': ('ability', 'imperfective_future'),
    'ability_perfective_future': ('ability', 'perfective_future'),
    'perfect_present': ('perfect', 'present'),
    'perfect_past': ('perfect', 'past'),
    'perfect_subjunctive': ('perfect', 'subjunctive'),
    'perfect_future': ('perfect', 'future'),
    'perfect_habitual': ('perfect', 'habitual'),
}


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


def _extract_verbs(entries: List[Dict[str, Any]]) -> List[str]:
    verbs: List[str] = []
    seen = set()
    for entry in entries:
        if not isinstance(entry, dict):
            continue
        pashto = entry.get('pashto') or entry.get('p') or ''
        pos = (entry.get('pos') or entry.get('c') or '').lower()
        if not pashto or ('verb' not in pos and 'v.' not in pos):
            continue
        if pashto not in seen:
            verbs.append(pashto)
            seen.add(pashto)
    return verbs


def _extract_forms(base_verb: str, conjugation: Dict[str, Any]) -> List[Dict[str, str]]:
    results: List[Dict[str, str]] = []
    if not conjugation:
        return results

    def add_form(form_text: str, form_type: str, tense: str, person: str = '') -> None:
        form_text = form_text.strip()
        if not form_text or '...' in form_text:
            return
        results.append({
            'base_verb': base_verb,
            'form': form_text,
            'form_type': form_type,
            'tense': tense,
            'person': person,
        })

    for table_name, (form_type, tense) in FORM_LABELS.items():
        table = conjugation.get(table_name, {})
        if isinstance(table, dict):
            for person, form_entry in table.items():
                if isinstance(form_entry, tuple):
                    add_form(form_entry[0], form_type, tense, str(person))
                elif isinstance(form_entry, str):
                    add_form(form_entry, form_type, tense, str(person))
        elif isinstance(table, str):
            add_form(table, form_type, tense)

    meta = conjugation.get('meta', {})
    if meta:
        for key, label in [('imperfective_root', 'root'), ('perfective_root', 'root'), ('past_participle', 'past_participle')]:
            form_value = meta.get(key)
            if isinstance(form_value, str):
                add_form(form_value, label, key)

    return results


def main() -> None:
    print('📚 Loading full dictionary...')
    entries = _load_dictionary()
    if not entries:
        print('   ❌ Could not load full_dictionary_enriched.json')
        return
    verbs = _extract_verbs(entries)
    if not verbs:
        print('   ❌ No verbs found in dictionary')
        return
    print(f'   ✅ Loaded {len(verbs)} verbs')

    print('\n🔄 Generating verb forms...')
    all_forms: List[Dict[str, str]] = []
    for base_verb in verbs:
        conjugation = conjugate_verb(base_verb)
        forms = _extract_forms(base_verb, conjugation)
        all_forms.extend(forms)
    print(f'   ✅ Generated {len(all_forms)} forms')

    OUTPUT_SQL.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_SQL.open('w', encoding='utf-8') as f:
        f.write('-- Precomputed verb forms for fast lookup\n')
        f.write('PRAGMA foreign_keys = OFF;\n')
        f.write('DROP TABLE IF EXISTS verb_forms;\n')
        f.write('CREATE TABLE verb_forms (\n')
        f.write('  id INTEGER PRIMARY KEY AUTOINCREMENT,\n')
        f.write('  base_verb TEXT NOT NULL,\n')
        f.write('  form TEXT NOT NULL,\n')
        f.write('  form_type TEXT,\n')
        f.write('  tense TEXT,\n')
        f.write('  person TEXT,\n')
        f.write("  created_at INTEGER DEFAULT (strftime('%s','now'))\n")
        f.write(');\n')
        f.write('CREATE INDEX IF NOT EXISTS idx_verb_forms_form ON verb_forms (form);\n')
        f.write('CREATE INDEX IF NOT EXISTS idx_verb_forms_base ON verb_forms (base_verb);\n')
        for item in all_forms:
            escaped = {k: item.get(k, '').replace("'", "''") for k in ['base_verb', 'form', 'form_type', 'tense', 'person']}
            f.write(
                "INSERT INTO verb_forms (base_verb, form, form_type, tense, person)\n"
                f"VALUES ('{escaped['base_verb']}', '{escaped['form']}', '{escaped['form_type']}', "
                f"'{escaped['tense']}', '{escaped['person']}');\n"
            )
    print(f'   ✅ Wrote {OUTPUT_SQL} with {len(all_forms)} rows')
    print('\n📋 Next steps:')
    print(f'   wrangler d1 execute pashto-bible-db --remote --file {OUTPUT_SQL.relative_to(APP_ROOT)}')


if __name__ == '__main__':
    main()
