#!/usr/bin/env python3
"""
🎯 BREAK DOWN LARGE FREQUENCY MIGRATION
Splits the 10,000+ line migration into manageable chunks
"""

def split_migration_file():
    """Split the large migration file into smaller chunks"""

    # Read the original file
    with open('frequency_consolidation_migration.sql', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the INSERT statement
    lines = content.split('\n')

    # Find the start and end of the VALUES section
    values_start = None
    values_end = None

    for i, line in enumerate(lines):
        if "VALUES" in line and values_start is None:
            values_start = i
        elif values_start and line.strip().startswith("ON CONFLICT"):
            values_end = i
            break

    if values_start is None or values_end is None:
        print("❌ Could not find VALUES section")
        return

    print(f"📊 Found VALUES section: lines {values_start}-{values_end}")
    print(f"📊 Total VALUES lines: {values_end - values_start}")

    # Extract just the VALUES data (excluding the VALUES keyword and ON CONFLICT)
    values_lines = lines[values_start:values_end]

    # Split into chunks of 1000 rows each
    chunk_size = 1000
    total_rows = len([line for line in values_lines if line.strip().startswith("('")])

    print(f"📊 Total data rows: {total_rows}")

    # Create chunk files
    for chunk_num in range(0, total_rows, chunk_size):
        start_row = chunk_num
        end_row = min(chunk_num + chunk_size, total_rows)

        # Create the chunk file
        chunk_content = create_chunk_file(lines, values_lines, values_start, start_row, end_row, chunk_num // chunk_size + 1)

        with open(f'frequency_migration_chunk_{chunk_num // chunk_size + 1}.sql', 'w', encoding='utf-8') as f:
            f.write(chunk_content)

        print(f"✅ Created chunk {chunk_num // chunk_size + 1} with rows {start_row}-{end_row}")

def create_chunk_file(all_lines, values_lines, values_start, start_row, end_row, chunk_num):
    """Create a single chunk file"""

    # Get the header (everything before VALUES)
    header_end = values_start
    header = '\n'.join(all_lines[:header_end])

    # Get the VALUES data for this chunk
    chunk_values = []
    current_row = 0
    in_values_section = False

    for line in values_lines:
        if "VALUES" in line:
            in_values_section = True
            chunk_values.append(line)
        elif in_values_section and line.strip().startswith("('"):
            if start_row <= current_row < end_row:
                chunk_values.append(line)
            current_row += 1
        elif in_values_section and line.strip():  # Keep non-empty lines in VALUES section
            if start_row <= current_row < end_row:
                chunk_values.append(line)

    # Get the footer (ON CONFLICT statement)
    footer_start = None
    for i, line in enumerate(all_lines):
        if line.strip().startswith("ON CONFLICT"):
            footer_start = i
            break

    footer = '\n'.join(all_lines[footer_start:]) if footer_start else ""

    # Combine everything
    result = header + "\nVALUES\n" + ',\n'.join(chunk_values) + "\n" + footer

    return result

def create_simple_migration():
    """Create a simpler migration approach"""

    print("🔧 CREATING SIMPLER MIGRATION APPROACH...")

    # Create a basic version that just creates the table structure
    simple_migration = '''-- Simple frequency consolidation migration
-- Creates the table structure without the massive data insert

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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_word_frequencies_unified_word ON public.word_frequencies_unified(pashto_word);
CREATE INDEX IF NOT EXISTS idx_word_frequencies_unified_total_freq ON public.word_frequencies_unified(total_frequency DESC);
CREATE INDEX IF NOT EXISTS idx_word_frequencies_unified_pos ON public.word_frequencies_unified(pos);

-- Add some sample data for testing
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

    with open('simple_frequency_migration.sql', 'w', encoding='utf-8') as f:
        f.write(simple_migration)

    print("✅ Created simple_frequency_migration.sql")
    print("💡 Use this smaller file first to test the schema")

if __name__ == "__main__":
    print("🎯 FREQUENCY MIGRATION BREAKDOWN TOOL")
    print("=" * 40)

    print("🔄 Breaking down large migration file into chunks...")
    split_migration_file()

    print("\n📝 Creating simple migration for testing...")
    create_simple_migration()

    print("\n🎉 MIGRATION FILES CREATED!")
    print("💡 Use simple_frequency_migration.sql first to test the schema")
    print("🚀 Then use the chunk files for full data migration")
