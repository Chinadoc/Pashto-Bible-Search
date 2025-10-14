#!/usr/bin/env python3
"""
🎯 CREATE PROPERLY FORMATTED CHUNK FILES
Fixes the SQL syntax by properly separating INSERT from VALUES
"""

def create_proper_chunk_files():
    """Create properly formatted chunk files"""

    # Read the original frequency consolidation file
    with open('frequency_consolidation_migration.sql', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the structure
    lines = content.split('\n')

    # Find key sections
    create_table_end = None
    insert_start = None
    values_start = None
    data_start = None
    on_conflict_start = None

    for i, line in enumerate(lines):
        if 'CREATE TABLE' in line and create_table_end is None:
            # Find end of CREATE TABLE
            for j in range(i, len(lines)):
                if lines[j].strip().endswith(';'):
                    create_table_end = j + 1
                    break

        elif 'INSERT INTO' in line and insert_start is None:
            insert_start = i

        elif line.strip() == 'VALUES':
            values_start = i

        elif line.strip().startswith("('") and data_start is None:
            data_start = i

        elif line.strip().startswith('ON CONFLICT'):
            on_conflict_start = i
            break

    if not all([create_table_end, insert_start, values_start, on_conflict_start]):
        print("❌ Could not find all sections in migration file")
        return

    print(f"📊 Found sections:")
    print(f"   CREATE TABLE: 0-{create_table_end}")
    print(f"   INSERT: {insert_start}")
    print(f"   VALUES: {values_start}")
    print(f"   Data starts: {data_start}")
    print(f"   ON CONFLICT: {on_conflict_start}")

    # Extract data rows (between VALUES and ON CONFLICT)
    data_lines = []
    for i in range(data_start, on_conflict_start):
        line = lines[i].strip()
        if line.startswith("('") and line.endswith("'),"):
            data_lines.append(line[:-1])  # Remove trailing comma

    print(f"📊 Total data rows: {len(data_lines)}")

    # Create chunks of 1000 rows each
    chunk_size = 1000
    total_chunks = (len(data_lines) + chunk_size - 1) // chunk_size

    print(f"📦 Creating {total_chunks} chunks...")

    for chunk_num in range(total_chunks):
        start_idx = chunk_num * chunk_size
        end_idx = min(start_idx + chunk_size, len(data_lines))

        # Create the chunk file
        chunk_content = create_chunk_content(lines, create_table_end, insert_start, data_lines[start_idx:end_idx])
        chunk_filename = f'frequency_migration_chunk_{chunk_num + 1}_proper.sql'

        with open(chunk_filename, 'w', encoding='utf-8') as f:
            f.write(chunk_content)

        print(f"✅ Created {chunk_filename} with {end_idx - start_idx} rows")

def create_chunk_content(all_lines, create_table_end, insert_start, chunk_data):
    """Create content for a single chunk"""

    # Header: CREATE TABLE + indexes
    header_lines = all_lines[:create_table_end]

    # Find INSERT statement (should be just the INSERT without VALUES)
    insert_line = all_lines[insert_start].replace(' VALUES', '').rstrip(',')

    # Find ON CONFLICT section
    on_conflict_start = None
    for i, line in enumerate(all_lines):
        if line.strip().startswith('ON CONFLICT'):
            on_conflict_start = i
            break

    on_conflict_lines = all_lines[on_conflict_start:] if on_conflict_start else []

    # Build the complete chunk
    chunk_lines = []

    # Add header (CREATE TABLE + indexes)
    chunk_lines.extend(header_lines)

    # Add INSERT statement
    chunk_lines.append(insert_line)
    chunk_lines.append('VALUES')

    # Add data rows with proper commas
    for i, data_row in enumerate(chunk_data):
        if i < len(chunk_data) - 1:
            chunk_lines.append(data_row + ',')
        else:
            chunk_lines.append(data_row)

    # Add ON CONFLICT section
    chunk_lines.extend(on_conflict_lines)

    return '\n'.join(chunk_lines)

def create_simple_test_migration():
    """Create a simple test migration with just a few rows"""

    simple_content = '''-- Simple test migration for word_frequencies_unified
CREATE TABLE IF NOT EXISTS public.word_frequencies_unified (
  id bigserial PRIMARY KEY,
  pashto_word text NOT NULL UNIQUE,
  total_frequency integer NOT NULL DEFAULT 0,
  ot_frequency integer DEFAULT 0,
  nt_frequency integer DEFAULT 0,
  romanization text,
  pos text,
  english_translation text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_word_frequencies_unified_word ON public.word_frequencies_unified(pashto_word);
CREATE INDEX IF NOT EXISTS idx_word_frequencies_unified_total_freq ON public.word_frequencies_unified(total_frequency DESC);
CREATE INDEX IF NOT EXISTS idx_word_frequencies_unified_pos ON public.word_frequencies_unified(pos);

-- Insert test data
INSERT INTO public.word_frequencies_unified (pashto_word, total_frequency, ot_frequency, nt_frequency, romanization, pos, english_translation)
VALUES
('وهل', 100, 50, 50, 'wahal', 'verb', 'to take'),
('کور', 200, 100, 100, 'kor', 'noun', 'house'),
('پلار', 150, 75, 75, 'plaar', 'noun', 'father')
ON CONFLICT (pashto_word) DO UPDATE SET
  total_frequency = EXCLUDED.total_frequency,
  ot_frequency = EXCLUDED.ot_frequency,
  nt_frequency = EXCLUDED.nt_frequency,
  updated_at = now();
'''

    with open('test_frequency_migration.sql', 'w', encoding='utf-8') as f:
        f.write(simple_content)

    print("✅ Created test_frequency_migration.sql")

if __name__ == "__main__":
    print("🎯 CREATING PROPERLY FORMATTED MIGRATION FILES")
    print("=" * 50)

    create_proper_chunk_files()
    create_simple_test_migration()

    print("\n🎉 FILES CREATED!")
    print("💡 Try test_frequency_migration.sql first")
    print("🚀 Then use frequency_migration_chunk_*_proper.sql files")
