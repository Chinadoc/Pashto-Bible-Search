#!/usr/bin/env python3
"""
Integrate nouns_lexicon into word_frequencies

Add noun-specific columns to word_frequencies and populate them using the
full dictionary so noun metadata is available for fast searches.
"""

import json
from pathlib import Path
from typing import Any, Dict, List

APP_ROOT = Path(__file__).resolve().parent.parent
DICTIONARY_PATHS = [
    APP_ROOT / 'docs/lexicon/full_dictionary_enriched.json',
    APP_ROOT / 'full_dictionary_enriched.json',
]


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
        lemma = pashto.strip()
        if not lemma:
            continue
        nouns[lemma] = {
            'pashto_word': lemma,
            'romanized': entry.get('romanization') or entry.get('f') or '',
            'gender': entry.get('gender') or entry.get('noun_gender') or '',
            'number': entry.get('number') or entry.get('noun_number') or 'singular',
            'plural_forms': entry.get('plural_forms') or entry.get('plurals') or '',
            'inflection_pattern': entry.get('noun_pattern') or entry.get('inflection_pattern') or '',
        }
    return nouns


def escape_sql_string(text: str) -> str:
    if not text:
        return 'NULL'
    return "'" + str(text).replace("'", "''") + "'"


def main():
    print("📚 Integrating nouns_lexicon into word_frequencies\n")
    entries = _load_dictionary()
    if not entries:
        print('   ❌ Could not load full_dictionary_enriched.json')
        return

    # Ensure columns exist
    print("📋 Step 1: Ensuring noun columns exist...")
    schema_sql = """
    ALTER TABLE word_frequencies ADD COLUMN gender TEXT;
    ALTER TABLE word_frequencies ADD COLUMN number TEXT;
    ALTER TABLE word_frequencies ADD COLUMN plural_forms TEXT;
    ALTER TABLE word_frequencies ADD COLUMN inflection_pattern TEXT;
    """
    schema_path = Path('cloudflare/add-noun-columns.sql')
    if not schema_path.exists():
        schema_path.write_text(schema_sql, encoding='utf-8')
        print(f"   📝 Generated {schema_path} (run once if needed)")
    else:
        print("   ✅ Noun columns already ensured")

    print("\n🔍 Extracting nouns...")
    nouns = _extract_nouns(entries)
    if not nouns:
        print('   ❌ No nouns found in dictionary')
        return
    print(f"   ✅ Found {len(nouns)} nouns")

    print("\n📝 Generating SQL updates...")
    sql_statements = []
    sql_statements.append('-- Integrate dictionary noun metadata into word_frequencies')

    OUTPUT_SQL = APP_ROOT / 'cloudflare' / 'integrate-nouns-lexicon.sql'

    for noun in nouns.values():
        pashto = escape_sql_string(noun['pashto_word'])
        gender = escape_sql_string(noun['gender'])
        number = escape_sql_string(noun['number'])
        plural_forms = escape_sql_string(noun['plural_forms'])
        inflection_pattern = escape_sql_string(noun['inflection_pattern'])
        romanized = escape_sql_string(noun['romanized'])

        sql_statements.append(
            f"UPDATE word_frequencies SET "
            f"gender = COALESCE(gender, {gender}), "
            f"number = COALESCE(number, {number}), "
            f"plural_forms = COALESCE(plural_forms, {plural_forms}), "
            f"inflection_pattern = COALESCE(inflection_pattern, {inflection_pattern}), "
            f"romanization = COALESCE(romanization, {romanized}), "
            f"word_type = CASE WHEN word_type IS NULL OR word_type = '' THEN 'noun' ELSE word_type END "
            f"WHERE pashto_word = {pashto};"
        )

    OUTPUT_SQL.write_text('\n'.join(sql_statements), encoding='utf-8')
    print(f"   ✅ Generated {OUTPUT_SQL} with {len(nouns)} UPDATE statements")

    print("\n✅ Done!")
    print("\n📋 Next steps:")
    print(f"   wrangler d1 execute pashto-bible-db --remote --file {OUTPUT_SQL.relative_to(APP_ROOT)}")


if __name__ == '__main__':
    main()

