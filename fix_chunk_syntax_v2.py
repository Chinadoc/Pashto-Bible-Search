#!/usr/bin/env python3
"""
🎯 FIX CHUNK FILE SYNTAX - VERSION 2
Properly reconstructs the INSERT statement structure
"""

def fix_chunk_file_properly(chunk_num):
    """Fix the syntax of a chunk file properly"""

    input_file = f'frequency_migration_chunk_{chunk_num}.sql'

    print(f"🔧 Properly fixing {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')

    # Find the key sections
    create_table_end = None
    insert_start = None
    values_start = None
    data_start = None
    on_conflict_start = None

    for i, line in enumerate(lines):
        if 'CREATE TABLE' in line and create_table_end is None:
            # Find end of CREATE TABLE (semicolon)
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

    if insert_start is None or values_start is None:
        print(f"❌ Could not find INSERT structure in {input_file}")
        return False

    # Reconstruct properly
    fixed_lines = []

    # Add CREATE TABLE section
    if create_table_end:
        fixed_lines.extend(lines[:create_table_end])

    # Add INSERT statement (without VALUES at the end)
    insert_line = lines[insert_start].replace(' VALUES', '').rstrip(',')
    fixed_lines.append(insert_line)
    fixed_lines.append('VALUES')

    # Add data rows (clean them up)
    for i in range(data_start, len(lines)):
        line = lines[i]
        if line.strip().startswith("('"):
            # Clean up the data row
            line = line.rstrip(',').replace(',,', ',')
            if not line.endswith(','):
                line += ','
            fixed_lines.append(line)
        elif line.strip().startswith('ON CONFLICT'):
            # Add the ON CONFLICT section
            fixed_lines.extend(lines[i:])
            break

    # Write the fixed file
    output_file = f'frequency_migration_chunk_{chunk_num}_v2.sql'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(fixed_lines))

    print(f"✅ Created {output_file}")
    return True

def fix_all_chunks_properly():
    """Fix all chunk files properly"""

    import os

    chunk_files = [f for f in os.listdir('.') if f.startswith('frequency_migration_chunk_') and f.endswith('.sql') and not '_fixed' in f and not '_v2' in f]

    print(f"🔧 Found {len(chunk_files)} chunk files to fix properly")

    for chunk_file in sorted(chunk_files):
        chunk_num = chunk_file.split('_')[-1].split('.')[0]
        fix_chunk_file_properly(int(chunk_num))

    print("\n🎉 ALL CHUNK FILES FIXED PROPERLY!")
    print("💡 Use the '_v2.sql' versions for deployment")

if __name__ == "__main__":
    fix_all_chunks_properly()
