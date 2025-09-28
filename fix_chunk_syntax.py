#!/usr/bin/env python3
"""
🎯 FIX CHUNK FILE SYNTAX
Corrects the INSERT statement structure in chunk files
"""

def fix_chunk_file(chunk_num):
    """Fix the syntax of a chunk file"""

    input_file = f'frequency_migration_chunk_{chunk_num}.sql'
    output_file = f'frequency_migration_chunk_{chunk_num}_fixed.sql'

    print(f"🔧 Fixing {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')

    # Find the INSERT statement
    insert_line = None
    values_line = None
    data_start = None

    for i, line in enumerate(lines):
        if 'INSERT INTO' in line and 'VALUES' in line:
            insert_line = i
        elif line.strip() == 'VALUES':
            values_line = i
        elif line.strip().startswith("('") and data_start is None:
            data_start = i

    if insert_line is None or values_line is None:
        print(f"❌ Could not find INSERT structure in {input_file}")
        return False

    # Reconstruct the file with correct syntax
    fixed_lines = []

    # Add everything before INSERT
    fixed_lines.extend(lines[:insert_line])

    # Fix the INSERT line (remove trailing comma)
    insert_line_content = lines[insert_line].rstrip(',')
    fixed_lines.append(insert_line_content)

    # Add VALUES keyword
    fixed_lines.append('VALUES')

    # Add data rows (fix double commas)
    for i in range(data_start, len(lines)):
        line = lines[i]
        if line.strip().startswith("('"):
            # Remove trailing comma and any double commas
            line = line.rstrip(',').replace(',,', ',')
            fixed_lines.append(line)
        elif line.strip() and not line.strip().startswith('ON CONFLICT'):
            fixed_lines.append(line)

    # Write the fixed file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(fixed_lines))

    print(f"✅ Created {output_file}")
    return True

def fix_all_chunks():
    """Fix all chunk files"""

    import os

    chunk_files = [f for f in os.listdir('.') if f.startswith('frequency_migration_chunk_') and f.endswith('.sql') and not f.endswith('_fixed.sql')]

    print(f"🔧 Found {len(chunk_files)} chunk files to fix")

    for chunk_file in sorted(chunk_files):
        chunk_num = chunk_file.split('_')[-1].split('.')[0]
        fix_chunk_file(int(chunk_num))

    print("\n🎉 ALL CHUNK FILES FIXED!")
    print("💡 Use the '_fixed.sql' versions for deployment")

if __name__ == "__main__":
    fix_all_chunks()
