#!/usr/bin/env python3
"""
🎯 FIX FINAL COMMA ISSUE
Removes the trailing comma from the last data row before ON CONFLICT
"""

def fix_all_chunk_files():
    """Fix the final comma issue in all v2 chunk files"""

    import os

    chunk_files = [f for f in os.listdir('.') if f.startswith('frequency_migration_chunk_') and f.endswith('_v2.sql')]

    print(f"🔧 Fixing {len(chunk_files)} v2 chunk files...")

    for chunk_file in sorted(chunk_files):
        fix_final_comma(chunk_file)

    print("\n🎉 ALL CHUNK FILES FIXED!")
    print("💡 Remove the comma from the last data row before ON CONFLICT")

def fix_final_comma(filename):
    """Fix the final comma in a chunk file"""

    print(f"🔧 Processing {filename}...")

    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Find the last data row (line that starts with "('") before ON CONFLICT
    last_data_row_idx = None
    on_conflict_idx = None

    for i, line in enumerate(lines):
        if line.strip().startswith("('"):
            last_data_row_idx = i
        elif line.strip().startswith('ON CONFLICT'):
            on_conflict_idx = i
            break

    if last_data_row_idx is not None and on_conflict_idx is not None:
        # Remove comma from the last data row
        last_data_line = lines[last_data_row_idx].rstrip()
        if last_data_line.endswith(','):
            last_data_line = last_data_line[:-1]
            lines[last_data_row_idx] = last_data_line + '\n'

        # Write back the file
        with open(filename, 'w', encoding='utf-8') as f:
            f.writelines(lines)

        print(f"✅ Fixed comma in {filename}")
    else:
        print(f"❌ Could not find structure in {filename}")

if __name__ == "__main__":
    fix_all_chunk_files()
