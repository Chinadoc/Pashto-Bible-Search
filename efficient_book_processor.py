
#!/usr/bin/env python3
"""
Efficient Book Processing Script

This script coordinates the efficient extraction of file IDs from entire books.
"""

import subprocess
import json
from pathlib import Path

def process_book_efficiently(book_name, expected_chapters):
    """Process an entire book efficiently"""

    print(f"🎯 Processing {book_name} ({expected_chapters} chapters, ~{expected_chapters * 15} files)...")

    # Step 1: Navigate to book folder
    print("   1. 📂 Navigate to book folder")
    print(f"      URL: https://drive.google.com/drive/folders/1m-Mv7r01GHTgXkzFxAXfANn_7sSHRSUC")
    print(f"      Click on: {book_name}")

    # Step 2: Process all chapters systematically
    print(f"   2. 🔄 Process all {expected_chapters} chapters:")
    for chapter in range(1, expected_chapters + 1):
        print(f"      2.{chapter} Click on chapter-{chapter}-verses folder")

    # Step 3: Extract file IDs from each chapter
    print("   3. 📋 Extract file IDs:")
    for chapter in range(1, expected_chapters + 1):
        print(f"      3.{chapter} Run browser console script in chapter-{chapter}-verses")
        print(f"      3.{chapter} Copy file IDs for {book_name}{chapter"03d"}")

    # Step 4: Compile results
    print("   4. 📝 Compile all file IDs into worksheet")
    print(f"      Format: {book_name}001_verse_001.mp3:FILE_ID_HERE")
    print(f"      Total: ~{expected_chapters * 15} lines")

    # Step 5: Update and test
    print("   5. ✅ Update worksheet and test:")
    print(f"      python3 batch_update_file_ids.py {book_name}_worksheet.txt")
    print(f"      Verify {expected_chapters * 15}+ file IDs updated")

    return True

def main():
    """Main processing function"""

    # Priority order for processing
    priority_books = [
        ('ezra', 10),           # 13% complete, finish first
        ('ecclesiastes', 12),   # 222 files
        ('judges', 21),         # 859 files
        ('leviticus', 27),      # 859 files
        ('numbers', 36),        # 1,288 files
        ('genesis', 50),        # 1,533 files
        ('exodus', 40),         # 1,213 files
        ('deuteronomy', 34),    # 958 files
        ('proverbs', 31),       # 915 files
        ('psalms', 150),        # 2,461 files
    ]

    total_files = sum(chapters * 15 for _, chapters in priority_books)  # ~15 files per chapter

    print("🚀 EFFICIENT BOOK PROCESSING SYSTEM")
    print(f"📊 Will process {len(priority_books)} books ({total_files} files)")
    print()

    for book_name, chapters in priority_books:
        print(f"📖 {book_name.upper()}: {chapters} chapters (~{chapters * 15} files)")
        # process_book_efficiently(book_name, chapters)  # Manual coordination needed

    print()
    print("✅ Ready for efficient single-browser processing!")
    print("💡 Navigate to book folder, then process all chapters systematically")

if __name__ == "__main__":
    main()
