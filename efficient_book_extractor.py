#!/usr/bin/env python3
"""
Efficient Book Extractor for Google Drive File IDs

This script provides an efficient workflow for extracting file IDs from entire books
using a single browser session with systematic navigation.
"""

import json
import re
from pathlib import Path

def create_efficient_extraction_workflow():
    """Create an efficient book extraction workflow"""

    workflow = '''
🎯 EFFICIENT BOOK EXTRACTION WORKFLOW

📋 SINGLE-BROWSER STRATEGY:
Instead of multiple browser instances, use one browser session:

1. 📂 Navigate to Main Folder
   • Single navigation to: https://drive.google.com/drive/folders/1m-Mv7r01GHTgXkzFxAXfANn_7sSHRSUC

2. 🔄 Systematic Book Processing
   • Click on book folder once
   • Process all chapters within that book
   • Extract file IDs efficiently
   • Move to next book

3. 📝 Batch Compilation
   • Compile all file IDs for the book
   • Update worksheet in one operation

4. ✅ Complete Integration
   • Test all file IDs at once

🚀 BOOKS TO PROCESS (by completion priority):
• Ezra (182 files) - 13% complete, finish first
• Ecclesiastes (222 files) - Next priority
• Judges (859 files) - Large book
• Leviticus (859 files) - Large book
• Numbers (1,288 files) - Very large
• Genesis (1,533 files) - Largest
• Exodus (1,213 files) - Large
• Deuteronomy (958 files) - Large
• Proverbs (915 files) - Large
• Psalms (2,461 files) - Largest

💡 EFFICIENCY IMPROVEMENTS:
• Single browser session for entire book
• Systematic chapter navigation
• Batch file ID extraction
• Immediate compilation and testing
'''

    return workflow

def create_book_processing_script():
    """Create a script for processing entire books efficiently"""

    script = '''
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
'''

    return script

def main():
    """Main function to create the efficient extraction system"""

    print("🎯 Creating Efficient Book Extraction System...")
    print()

    # Create the workflow guide
    workflow_content = create_efficient_extraction_workflow()
    with open('efficient_extraction_workflow.txt', 'w') as f:
        f.write(workflow_content)

    # Create the processing script
    script_content = create_book_processing_script()
    with open('efficient_book_processor.py', 'w') as f:
        f.write(script_content)

    print("✅ Created efficient_extraction_workflow.txt")
    print("✅ Created efficient_book_processor.py")
    print()
    print("🚀 EFFICIENT EXTRACTION SYSTEM READY!")
    print()
    print("📋 Next Steps:")
    print("1. Review efficient_extraction_workflow.txt")
    print("2. Use single browser session for each book")
    print("3. Process all chapters systematically")
    print("4. Compile and test each book completely")
    print()
    print("💡 This approach eliminates browser conflicts and")
    print("   processes entire books efficiently!")

if __name__ == "__main__":
    main()
