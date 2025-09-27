#!/usr/bin/env python3
"""
Migration script to populate the unified database from existing JSON files.
This script consolidates all linguistic data into the new database schema.
"""

import json
import os
import sys
from typing import Dict, List, Any, Tuple
from collections import defaultdict

# Add functions directory to path
functions_dir = os.path.join(os.path.dirname(__file__), 'functions')
sys.path.insert(0, functions_dir)

try:
    from verb_inflector import conjugate_verb
except ImportError:
    print("Warning: verb_inflector not available")
    conjugate_verb = None

def load_json_file(filepath: str) -> Dict[str, Any]:
    """Load and return JSON data from file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return {}

def load_grammatical_index() -> Dict[str, Any]:
    """Load the grammatical index"""
    return load_json_file('grammatical_index_v15.json')

def load_dictionary_data() -> Dict[str, Any]:
    """Load dictionary data"""
    return load_json_file('full_dictionary_enriched.json')

def load_verb_lexicon() -> Dict[str, Any]:
    """Load verb lexicon"""
    return load_json_file('verbs_lexicon.json')

def load_noun_lexicon() -> Dict[str, Any]:
    """Load noun lexicon"""
    return load_json_file('nouns_lexicon.json')

def extract_verses_from_text_files() -> List[Dict[str, Any]]:
    """Extract verse data from text files"""
    verses = []
    base_dir = 'all_txt_copies'

    if not os.path.exists(base_dir):
        print(f"Directory {base_dir} not found")
        return verses

    # Get all text files
    text_files = []
    for filename in os.listdir(base_dir):
        if filename.endswith('_pashto.txt'):
            text_files.append(filename)

    print(f"Found {len(text_files)} text files to process")

    for filename in sorted(text_files):
        filepath = os.path.join(base_dir, filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Parse the content (format: book name, chapter, verse content)
            lines = content.strip().split('\n')
            current_book = None
            current_chapter = None

            for line in lines:
                line = line.strip()
                if not line:
                    continue

                # Check if this is a book header
                if line and not line[0].isdigit() and 'فصل' not in line:
                    current_book = line
                    continue

                # Check if this is a chapter header
                if 'فصل' in line:
                    # Extract chapter number
                    parts = line.split()
                    if len(parts) >= 2:
                        try:
                            current_chapter = int(parts[1])
                        except ValueError:
                            continue
                    continue

                # Check if this is a verse (starts with digit)
                if line and line[0].isdigit():
                    # Extract verse number and text
                    parts = line.split(' ', 1)
                    if len(parts) == 2:
                        try:
                            verse_num = int(parts[0])
                            verse_text = parts[1]

                            verses.append({
                                'book': current_book,
                                'chapter': current_chapter,
                                'verse': verse_num,
                                'text': verse_text,
                                'testament': 'NT' if any(book in current_book for book in ['یوحنا', 'متی', 'مرقس', 'لوقا', 'یوحنا', 'اعمال', 'روميانو', 'کورنتيانو']) else 'OT',
                                'translation': None,
                                'dialect': None
                            })
                        except ValueError:
                            continue

        except Exception as e:
            print(f"Error processing {filename}: {e}")
            continue

    return verses

def generate_word_forms_from_grammatical_index(grammatical_index: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate word forms from grammatical index"""
    word_forms = []

    for root_word, root_data in grammatical_index.items():
        identities = root_data.get('identities', [])

        for identity in identities:
            pos = identity.get('type', 'Unknown')
            forms = identity.get('forms', {})

            for form_type, form_list in forms.items():
                for form_data in form_list:
                    if isinstance(form_data, dict) and 'form' in form_data:
                        form_pashto = form_data['form']
                        count = form_data.get('count', 0)
                        verses = form_data.get('verses', [])

                        word_forms.append({
                            'form_pashto': form_pashto,
                            'pos': pos,
                            'grammatical_category': form_type,
                            'lemma_root': root_word,
                            'frequency_count': count,
                            'verse_references': verses
                        })

    return word_forms

def generate_lexicon_entries() -> List[Dict[str, Any]]:
    """Generate lexicon entries from verb and noun lexicons"""
    lexicon_entries = []

    # Process verb lexicon
    verb_lexicon = load_verb_lexicon()
    for lemma, data in verb_lexicon.items():
        lexicon_entries.append({
            'lemma_pashto': lemma,
            'lemma_romanized': data.get('romanization', {}).get('primary', ''),
            'pos': 'verb',
            'conjugation_pattern': data.get('pattern_info', ''),
            'imperfective_stem': data.get('stems', {}).get('imperfective', ''),
            'perfective_stem': data.get('stems', {}).get('perfective', ''),
            'past_participle': data.get('past_participle', ''),
            'is_irregular': 'irregular' in data.get('pattern_info', '').lower(),
            'conjugation_data': data
        })

    # Process noun lexicon
    noun_lexicon = load_noun_lexicon()
    for lemma, data in noun_lexicon.items():
        lexicon_entries.append({
            'lemma_pashto': lemma,
            'lemma_romanized': data.get('romanization', {}).get('primary', ''),
            'pos': data.get('type', 'noun'),
            'declension_pattern': data.get('pattern_info', ''),
            'inflection_data': data
        })

    return lexicon_entries

def generate_variant_relationships(word_forms: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Generate variant relationships by analyzing word forms"""
    relationships = []

    # Group forms by lemma root
    forms_by_root = defaultdict(list)
    for form in word_forms:
        forms_by_root[form['lemma_root']].append(form)

    for root, forms in forms_by_root.items():
        root_form = next((f for f in forms if f['grammatical_category'] == 'Base Form'), None)
        if not root_form:
            # Use first form as root
            root_form = forms[0]

        for form in forms:
            if form['form_pashto'] != root_form['form_pashto']:
                # Determine relationship type
                rel_type = 'conjugation' if root_form['pos'] == 'verb' else 'declension'
                relationships.append({
                    'root_form': root_form['form_pashto'],
                    'variant_form': form['form_pashto'],
                    'relationship_type': rel_type,
                    'confidence_score': 0.9
                })

    return relationships

def generate_verb_variants_for_database(word_forms: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Generate additional verb variants using the verb inflector"""
    additional_forms = []

    if not conjugate_verb:
        print("Verb inflector not available, skipping verb variant generation")
        return additional_forms

    # Find verb roots
    verb_roots = set()
    for form in word_forms:
        if form['pos'] == 'verb':
            verb_roots.add(form['lemma_root'])

    print(f"Found {len(verb_roots)} verb roots to process")

    for root in verb_roots:
        try:
            conjugation = conjugate_verb(root)
            if conjugation and 'forms_map' in conjugation:
                forms_map = conjugation['forms_map']

                for form, romanization in forms_map.items():
                    # Check if this form already exists
                    existing = next((f for f in word_forms if f['form_pashto'] == form), None)
                    if not existing:
                        additional_forms.append({
                            'form_pashto': form,
                            'pos': 'verb',
                            'grammatical_category': 'generated',
                            'lemma_root': root,
                            'frequency_count': 0,  # Will be updated when occurrences are found
                            'verse_references': []
                        })
        except Exception as e:
            print(f"Error generating variants for {root}: {e}")
            continue

    print(f"Generated {len(additional_forms)} additional verb forms")
    return additional_forms

def create_migration_sql() -> str:
    """Generate SQL migration script"""
    sql_parts = []

    # Load all data
    print("Loading data sources...")
    grammatical_index = load_grammatical_index()
    dictionary_data = load_dictionary_data()

    print("Extracting verses from text files...")
    verses = extract_verses_from_text_files()

    print("Generating word forms...")
    word_forms = generate_word_forms_from_grammatical_index(grammatical_index)

    print("Generating lexicon entries...")
    lexicon_entries = generate_lexicon_entries()

    print("Generating variant relationships...")
    variant_relationships = generate_variant_relationships(word_forms)

    print("Generating additional verb variants...")
    additional_verb_forms = generate_verb_variants_for_database(word_forms)
    all_word_forms = word_forms + additional_verb_forms

    # Generate SQL inserts
    sql_parts.append("-- Migration to unified database schema")
    sql_parts.append("-- Generated from existing JSON files")
    sql_parts.append("")

    # Insert verses
    sql_parts.append("-- Insert verses")
    sql_parts.append("INSERT INTO verses (book, chapter, verse, text, testament) VALUES")
    verse_values = []
    for verse in verses:
        verse_values.append(f"('{verse['book']}', {verse['chapter']}, {verse['verse']}, '{verse['text'].replace(chr(39), chr(39)+chr(39))}', '{verse['testament']}')")
    sql_parts.append(",\n".join(verse_values) + ";")
    sql_parts.append("")

    # Insert lexicon entries
    sql_parts.append("-- Insert lexicon entries")
    sql_parts.append("INSERT INTO lexicon_entries (lemma_pashto, lemma_romanized, pos, conjugation_pattern, declension_pattern, imperfective_stem, perfective_stem, past_participle, conjugation_data, inflection_data) VALUES")
    lexicon_values = []
    for entry in lexicon_entries:
        # Escape single quotes
        lemma = entry['lemma_pashto'].replace("'", "''")
        romanized = entry.get('lemma_romanized', '').replace("'", "''")
        pos = entry['pos']
        conj_pattern = entry.get('conjugation_pattern', '').replace("'", "''")
        decl_pattern = entry.get('declension_pattern', '').replace("'", "''")
        impf_stem = entry.get('imperfective_stem', '').replace("'", "''")
        perf_stem = entry.get('perfective_stem', '').replace("'", "''")
        past_part = entry.get('past_participle', '').replace("'", "''")

        # JSON data
        conj_data = json.dumps(entry.get('conjugation_data', {}))
        infl_data = json.dumps(entry.get('inflection_data', {}))

        lexicon_values.append(f"('{lemma}', '{romanized}', '{pos}', '{conj_pattern}', '{decl_pattern}', '{impf_stem}', '{perf_stem}', '{past_part}', '{conj_data}', '{infl_data}')")
    sql_parts.append(",\n".join(lexicon_values) + ";")
    sql_parts.append("")

    # Insert word forms
    sql_parts.append("-- Insert word forms")
    sql_parts.append("INSERT INTO word_forms (form_pashto, pos, grammatical_category, lemma_root, frequency_count) VALUES")
    form_values = []
    for form in all_word_forms:
        pashto = form['form_pashto'].replace("'", "''")
        pos = form['pos']
        category = form['grammatical_category'].replace("'", "''")
        lemma = form['lemma_root'].replace("'", "''")
        frequency = form['frequency_count']

        form_values.append(f"('{pashto}', '{pos}', '{category}', '{lemma}', {frequency})")
    sql_parts.append(",\n".join(form_values) + ";")
    sql_parts.append("")

    # Insert variant relationships
    sql_parts.append("-- Insert variant relationships")
    sql_parts.append("INSERT INTO variant_relationships (root_form_id, variant_form_id, relationship_type, confidence_score)")
    sql_parts.append("SELECT")
    sql_parts.append("  rf.id as root_form_id,")
    sql_parts.append("  vf.id as variant_form_id,")
    sql_parts.append("  vr.relationship_type,")
    sql_parts.append("  vr.confidence_score")
    sql_parts.append("FROM (VALUES")
    rel_values = []
    for rel in variant_relationships:
        rel_values.append(f"('{rel['root_form']}', '{rel['variant_form']}', '{rel['relationship_type']}', {rel['confidence_score']})")
    sql_parts.append(",\n".join(rel_values))
    sql_parts.append(") AS vr(root_form, variant_form, relationship_type, confidence_score)")
    sql_parts.append("JOIN word_forms rf ON rf.form_pashto = vr.root_form")
    sql_parts.append("JOIN word_forms vf ON vf.form_pashto = vr.variant_form;")
    sql_parts.append("")

    # Create word occurrences from verse references
    sql_parts.append("-- Create word occurrences from verse references")
    sql_parts.append("INSERT INTO word_occurrences (word_form_id, verse_id)")
    sql_parts.append("SELECT")
    sql_parts.append("  wf.id as word_form_id,")
    sql_parts.append("  v.id as verse_id")
    sql_parts.append("FROM word_forms wf")
    sql_parts.append("CROSS JOIN verses v")
    sql_parts.append("WHERE EXISTS (")
    sql_parts.append("  SELECT 1 FROM json_array_elements_text(")
    sql_parts.append("    (SELECT verse_references FROM word_forms wf2 WHERE wf2.id = wf.id)")
    sql_parts.append("  ) as verse_ref")
    sql_parts.append("  WHERE verse_ref = (v.book || ' ' || v.chapter::text || ':' || v.verse::text)")
    sql_parts.append(");")
    sql_parts.append("")

    return "\n".join(sql_parts)

def main():
    """Main migration function"""
    print("🔄 Starting migration to unified database schema...")
    print("=" * 80)

    # Generate the migration SQL
    migration_sql = create_migration_sql()

    # Write to file
    output_file = 'unified_database_migration.sql'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(migration_sql)

    print(f"✅ Migration SQL generated: {output_file}")
    print(f"📊 Migration includes:")
    print(f"  - {len(extract_verses_from_text_files())} verses")
    print(f"  - {len(generate_word_forms_from_grammatical_index(load_grammatical_index()))} word forms")
    print(f"  - {len(generate_lexicon_entries())} lexicon entries")
    print(f"  - {len(generate_variant_relationships([]))} variant relationships")
    print()
    print("💡 To apply this migration:")
    print("   1. Set up a PostgreSQL database with the unified schema")
    print("   2. Run the generated SQL file")
    print("   3. Update your application to use the new database structure")

if __name__ == '__main__':
    main()
