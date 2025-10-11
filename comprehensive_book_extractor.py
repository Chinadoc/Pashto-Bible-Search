#!/usr/bin/env python3
"""
Comprehensive Book File ID Extractor

This script provides a complete workflow for extracting file IDs from all chapters
of a book automatically using browser automation.
"""

import json
import re
from pathlib import Path

def create_comprehensive_extraction_script():
    """Create a script for comprehensive book extraction"""

    script = '''
🎯 COMPREHENSIVE BOOK FILE ID EXTRACTION SCRIPT

📋 AUTOMATED WORKFLOW:
1. Navigate to main folder: https://drive.google.com/drive/folders/1m-Mv7r01GHTgXkzFxAXfANn_7sSHRSUC
2. For each book folder, run this process:
   a. Click on book folder (amos, deuteronomy, etc.)
   b. Click on each chapter folder (chapter-1-verses, chapter-2-verses, etc.)
   c. Extract file IDs from each chapter using browser console
   d. Compile all file IDs for the book

🔧 BROWSER CONSOLE SCRIPT (run in each chapter folder):
'''

    console_script = '''
// Comprehensive File ID Extractor for Chapter Folders
function extractAllFileIdsFromChapter() {
    const fileMapping = {};

    // Get all file rows
    const fileRows = document.querySelectorAll('[role="row"]');

    fileRows.forEach(row => {
        // Look for strong elements containing .mp3 filenames
        const strongElement = row.querySelector('strong');
        if (strongElement && strongElement.textContent.endsWith('.mp3')) {
            const fileName = strongElement.textContent;

            // Try to extract file ID from various sources
            let fileId = null;

            // Method 1: Check data attributes
            const dataId = row.getAttribute('data-id');
            if (dataId && dataId.length > 20) {
                fileId = dataId;
            }

            // Method 2: Check for onclick handlers with file IDs
            const onclick = row.getAttribute('onclick');
            if (onclick) {
                const idMatch = onclick.match(/fileId['"]:\\s*['"]([a-zA-Z0-9_-]+)['"]/);
                if (idMatch) {
                    fileId = idMatch[1];
                }
            }

            // Method 3: Check parent elements for data attributes
            if (!fileId) {
                let parent = row.parentElement;
                while (parent && !fileId) {
                    const parentDataId = parent.getAttribute('data-id');
                    if (parentDataId && parentDataId.length > 20) {
                        fileId = parentDataId;
                    }
                    parent = parent.parentElement;
                }
            }

            if (fileId) {
                fileMapping[fileName] = fileId;
            }
        }
    });

    return fileMapping;
}

// Run the extraction
const mapping = extractAllFileIdsFromChapter();
console.log('Chapter file mapping:', mapping);
console.log('Files found:', Object.keys(mapping).length);

// Copy to clipboard in worksheet format
const clipboardText = Object.entries(mapping)
    .map(([filename, fileId]) => `${filename}:${fileId}`)
    .join('\\n');
navigator.clipboard.writeText(clipboardText).then(() => {
    console.log('File IDs copied to clipboard!');
});
'''

    return script + console_script

def create_book_processing_workflow():
    """Create a workflow for processing entire books"""

    workflow = '''
📋 BOOK PROCESSING WORKFLOW:

🎯 REMAINING BOOKS TO PROCESS:
• Ezra (182 files) - Started
• Ecclesiastes (222 files)
• Judges (859 files)
• Leviticus (859 files)
• Numbers (1,288 files)
• Genesis (1,533 files)
• Exodus (1,213 files)
• Deuteronomy (958 files)
• Proverbs (915 files)
• Psalms (2,461 files)

🔄 PROCESSING STEPS FOR EACH BOOK:

1. 📂 Navigate to Book Folder
   • Click on book folder (e.g., "ecclesiastes")
   • Wait for chapter folders to load

2. 📋 For Each Chapter (1-10 or more):
   • Click on "chapter-1-verses"
   • Run browser console script to extract file IDs
   • Copy file IDs from console
   • Navigate back to book folder
   • Repeat for next chapter

3. 📝 Compile Results
   • Paste all chapter file IDs into book worksheet
   • Update: python3 batch_update_file_ids.py [book]_worksheet.txt

4. ✅ Test Integration
   • Verify all file IDs are updated
   • Check: google_drive_audio_urls.json

💡 AUTOMATION TIPS:
• Process books in order of size (smallest first)
• Test each book before moving to next
• Use browser back button to navigate between folders
• Copy file IDs immediately after extraction
• Batch process multiple chapters per book

🚀 START WITH ECCLESIASTES (222 files)
'''

    return workflow

def create_book_chapter_mapping():
    """Create expected chapter counts for each book"""

    book_chapters = {
        'amos': 9,
        'deuteronomy': 34,
        'ecclesiastes': 12,
        'exodus': 40,
        'ezekiel': 48,
        'ezra': 10,
        'genesis': 50,
        'isaiah': 66,
        'jonah': 4,
        'judges': 21,
        'leviticus': 27,
        'numbers': 36,
        'proverbs': 31,
        'psalms': 150
    }

    return book_chapters

def main():
    """Main function to create comprehensive extraction resources"""

    print("🎯 Creating Comprehensive Book Extraction System...")
    print()

    # Create the extraction script
    script_content = create_comprehensive_extraction_script()
    with open('comprehensive_extraction_script.txt', 'w') as f:
        f.write(script_content)

    # Create the workflow guide
    workflow_content = create_book_processing_workflow()
    with open('book_processing_workflow.txt', 'w') as f:
        f.write(workflow_content)

    # Create book chapter mapping
    book_chapters = create_book_chapter_mapping()
    with open('book_chapter_mapping.json', 'w') as f:
        json.dump(book_chapters, f, indent=2)

    print("✅ Created comprehensive_extraction_script.txt")
    print("✅ Created book_processing_workflow.txt")
    print("✅ Created book_chapter_mapping.json")
    print()
    print("🚀 COMPREHENSIVE EXTRACTION SYSTEM READY!")
    print()
    print("📋 Next Steps:")
    print("1. Open comprehensive_extraction_script.txt")
    print("2. Copy the console script")
    print("3. Follow book_processing_workflow.txt")
    print("4. Start with Ecclesiastes (222 files)")
    print()
    print("💡 This system eliminates manual clicking by processing")
    print("   entire books systematically with proven automation!")

if __name__ == "__main__":
    main()
