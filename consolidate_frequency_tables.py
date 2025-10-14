#!/usr/bin/env python3
"""
Frequency Tables Consolidation Script

This script consolidates multiple frequency-related data sources into a single unified table:
- word_frequency_list.json (main frequency list)
- ot_word_frequencies_from_db.json (OT-specific frequencies)
- nt_word_frequencies_from_db.json (NT-specific frequencies)
- nt_reference.json (NT references with rich metadata)

Usage: python consolidate_frequency_tables.py
"""

import json
import os
from collections import defaultdict
from typing import Dict, Any, List

class FrequencyConsolidator:
    def __init__(self):
        self.sources = {
            'main_freq': 'word_frequencies_enhanced.json',  # Use enhanced data with POS
            'ot_freq': 'ot_word_frequencies_from_db.json',
            'nt_freq': 'nt_word_frequencies_from_db.json',
            'nt_ref': 'nt_reference.json'
        }
        self.data = {}
        self.consolidated = {}

    def load_all_sources(self):
        """Load all frequency data sources"""
        print("🔄 Loading frequency data sources...")

        for name, filename in self.sources.items():
            if os.path.exists(filename):
                try:
                    with open(filename, 'r', encoding='utf-8') as f:
                        self.data[name] = json.load(f)
                    print(f"✅ Loaded {filename}: {len(self.data[name])} entries")
                except Exception as e:
                    print(f"❌ Error loading {filename}: {e}")
                    self.data[name] = []
            else:
                print(f"⚠️  File {filename} not found")
                self.data[name] = []

    def consolidate_data(self):
        """Consolidate all frequency data into unified structure"""
        print("\n🔄 Consolidating frequency data...")

        # Group by pashto word
        word_groups = defaultdict(lambda: {
            'total_frequency': 0,
            'ot_frequency': 0,
            'nt_frequency': 0,
            'romanization': '',
            'pos': '',
            'english_translation': '',
            'metadata': {}
        })

        # Process main frequency list (base truth for totals)
        for item in self.data['main_freq']:
            word = item['pashto_word']
            word_groups[word]['total_frequency'] = item['total_frequency']
            word_groups[word]['romanization'] = item.get('romanization', '')
            word_groups[word]['pos'] = item.get('pos', '')
            word_groups[word]['english_translation'] = item.get('english_translation', '')
            # Store enhanced metadata
            if 'metadata' in item:
                word_groups[word]['metadata'].update(item['metadata'])

        # Add OT-specific frequencies
        for item in self.data['ot_freq']:
            word = item['pashto_word']
            word_groups[word]['ot_frequency'] = item['frequency_count']

        # Add NT-specific frequencies
        for item in self.data['nt_freq']:
            word = item['pashto_word']
            word_groups[word]['nt_frequency'] = item['frequency_count']

        # Add rich metadata from NT references
        for item in self.data['nt_ref']:
            word = item['pashto']
            if word in word_groups:
                # Add rich metadata
                word_groups[word]['metadata'] = {
                    'english': item.get('english', ''),
                    'pos': item.get('pos', ''),
                    'romanization': item.get('romanization', ''),
                    'r': item.get('r', 0),  # rank
                    'a': item.get('a', 0),  # something
                    'i': item.get('i', 0),  # id
                    'ts': item.get('ts', 0)  # timestamp
                }
                # Override with richer data if available
                if item.get('english'):
                    word_groups[word]['english_translation'] = item['english']
                if item.get('romanization'):
                    word_groups[word]['romanization'] = item['romanization']
                if item.get('pos'):
                    word_groups[word]['pos'] = item['pos']

        self.consolidated = dict(word_groups)
        print(f"✅ Consolidated {len(self.consolidated)} unique words")

    def generate_sql_migration(self):
        """Generate SQL for database migration"""
        print("\n🔄 Generating SQL migration...")

        # Create table SQL
        create_table_sql = """
-- Create unified frequency table
CREATE TABLE IF NOT EXISTS public.word_frequencies_unified (
  id bigserial PRIMARY KEY,
  pashto_word text NOT NULL,
  total_frequency integer NOT NULL,
  ot_frequency integer DEFAULT 0,
  nt_frequency integer DEFAULT 0,
  romanization text,
  pos text,
  english_translation text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS word_frequencies_unified_word_idx
  ON public.word_frequencies_unified (pashto_word);

CREATE INDEX IF NOT EXISTS word_frequencies_unified_total_freq_idx
  ON public.word_frequencies_unified (total_frequency DESC);

CREATE INDEX IF NOT EXISTS word_frequencies_unified_ot_freq_idx
  ON public.word_frequencies_unified (ot_frequency DESC);

CREATE INDEX IF NOT EXISTS word_frequencies_unified_nt_freq_idx
  ON public.word_frequencies_unified (nt_frequency DESC);

CREATE INDEX IF NOT EXISTS word_frequencies_unified_roman_idx
  ON public.word_frequencies_unified USING gin (to_tsvector('simple', romanization));
"""

        # Generate insert statements
        insert_sql = "INSERT INTO public.word_frequencies_unified (pashto_word, total_frequency, ot_frequency, nt_frequency, romanization, pos, english_translation, metadata) VALUES\n"

        values = []
        for word, data in self.consolidated.items():
            # Escape single quotes in strings for SQL
            romanization = data['romanization'].replace("'", "''") if data['romanization'] else ''
            pos = data['pos'].replace("'", "''") if data['pos'] else ''
            english = data['english_translation'].replace("'", "''") if data['english_translation'] else ''
            metadata_str = json.dumps(data['metadata']).replace("'", "''")

            values.append(f"('{word}', {data['total_frequency']}, {data['ot_frequency']}, {data['nt_frequency']}, '{romanization}', '{pos}', '{english}', '{metadata_str}')")

        insert_sql += ",\n".join(values) + "\nON CONFLICT (pashto_word) DO UPDATE SET\n" + ",\n".join([
            "  total_frequency = EXCLUDED.total_frequency",
            "  ot_frequency = EXCLUDED.ot_frequency",
            "  nt_frequency = EXCLUDED.nt_frequency",
            "  romanization = EXCLUDED.romanization",
            "  pos = EXCLUDED.pos",
            "  english_translation = EXCLUDED.english_translation",
            "  metadata = EXCLUDED.metadata",
            "  updated_at = now()"
        ]) + ";"

        return create_table_sql + "\n" + insert_sql

    def save_consolidated_json(self):
        """Save consolidated data to JSON for backup"""
        output_file = 'word_frequencies_consolidated.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.consolidated, f, ensure_ascii=False, indent=2)
        print(f"💾 Saved consolidated data to {output_file}")

    def run(self):
        """Run the full consolidation process"""
        print("🚀 Starting frequency data consolidation...")

        self.load_all_sources()
        self.consolidate_data()

        # Generate SQL migration
        sql_migration = self.generate_sql_migration()

        # Save to file
        with open('frequency_consolidation_migration.sql', 'w', encoding='utf-8') as f:
            f.write(sql_migration)

        self.save_consolidated_json()

        print("\n✅ Consolidation complete!")
        print("📁 Files generated:")
        print("  - frequency_consolidation_migration.sql")
        print("  - word_frequencies_consolidated.json")
        print("\n📋 Next steps:")
        print("1. Review the generated SQL migration")
        print("2. Run the migration on your Supabase database")
        print("3. Update your application code to use the new table")
        print("4. Test thoroughly before dropping old tables")

if __name__ == "__main__":
    consolidator = FrequencyConsolidator()
    consolidator.run()
