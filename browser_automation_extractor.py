#!/usr/bin/env python3
"""
Browser Automation File ID Extractor for Google Drive

This script provides browser automation commands to systematically extract
file IDs from all Google Drive folders and update the worksheet.
"""

import json
import re
from pathlib import Path

def create_browser_automation_script():
    """Create a comprehensive browser automation script"""
    
    script = '''
🎯 BROWSER AUTOMATION SCRIPT FOR GOOGLE DRIVE FILE ID EXTRACTION

📋 STEP 1: Navigate to Main Folder
   URL: https://drive.google.com/drive/folders/1m-Mv7r01GHTgXkzFxAXfANn_7sSHRSUC

📋 STEP 2: For Each Book Folder (in order of size):
   1. amos (144 files)
   2. jonah (48 files) 
   3. isaiah (31 files)
   4. ezra (182 files)
   5. ecclesiastes (222 files)
   6. deuteronomy (958 files)
   7. ezekiel (1,216 files)
   8. genesis (1,533 files)
   9. exodus (1,213 files)
   10. leviticus (859 files)
   11. numbers (1,288 files)
   12. psalms (2,461 files)
   13. proverbs (915 files)

📋 STEP 3: For Each Chapter Folder:
   a. Double-click chapter folder
   b. Extract file IDs using browser console script
   c. Navigate back to book folder
   d. Repeat for next chapter

📋 STEP 4: Update Worksheet:
   python3 batch_update_file_ids.py [book]_worksheet.txt

🔧 BROWSER CONSOLE SCRIPT (run in browser console):
'''
    
    console_script = '''
// Browser Console Script for Google Drive File ID Extraction
function extractFileIdsFromPage() {
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
                const idMatch = onclick.match(/fileId['"]:\s*['"]([a-zA-Z0-9_-]+)['"]/);
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
const mapping = extractFileIdsFromPage();
console.log('File mapping:', mapping);

// Copy to clipboard
const clipboardText = Object.entries(mapping)
    .map(([filename, fileId]) => `${filename}:${fileId}`)
    .join('\\n');
navigator.clipboard.writeText(clipboardText).then(() => {
    console.log('File IDs copied to clipboard!');
});
'''
    
    return script + console_script

def create_workflow_guide():
    """Create a step-by-step workflow guide"""
    
    guide = '''
🚀 AUTOMATED WORKFLOW FOR GOOGLE DRIVE FILE ID EXTRACTION

📋 PHASE 1: Setup
   1. Open browser to: https://drive.google.com/drive/folders/1m-Mv7r01GHTgXkzFxAXfANn_7sSHRSUC
   2. Open browser console (F12)
   3. Copy the console script above

📋 PHASE 2: Process Each Book (start with smallest)
   
   🎯 BOOK 1: AMOS (144 files)
   1. Double-click 'amos' folder
   2. For each chapter folder (chapter-1-verses, chapter-2-verses, etc.):
      a. Double-click chapter folder
      b. Paste console script and run
      c. Copy file IDs from console
      d. Navigate back to amos folder
      e. Repeat for next chapter
   3. Update amos_worksheet.txt with all file IDs
   4. Test: python3 batch_update_file_ids.py amos_worksheet.txt

   🎯 BOOK 2: JONAH (48 files) - PARTIALLY DONE
   1. Continue from where we left off
   2. Process remaining chapters (2-4)
   3. Update jonah_worksheet.txt
   4. Test: python3 batch_update_file_ids.py jonah_worksheet.txt

   🎯 BOOK 3: ISAIAH (31 files)
   1. Double-click 'isaiah' folder
   2. Process all chapters
   3. Update isaiah_worksheet.txt
   4. Test: python3 batch_update_file_ids.py isaiah_worksheet.txt

   🎯 Continue with remaining books...

📋 PHASE 3: Final Integration
   1. Update main google_drive_audio_urls.json
   2. Test audio playback in application
   3. Deploy changes

💡 TIPS:
   • Process one book at a time
   • Test each book before moving to next
   • Keep browser console open
   • Use browser back button to navigate between folders
   • Copy file IDs immediately after extraction
'''
    
    return guide

def main():
    """Main function to create automation resources"""
    
    print("🎯 Creating Browser Automation Resources...")
    print()
    
    # Create the automation script
    script_content = create_browser_automation_script()
    with open('browser_automation_script.txt', 'w') as f:
        f.write(script_content)
    
    # Create the workflow guide
    guide_content = create_workflow_guide()
    with open('automation_workflow_guide.txt', 'w') as f:
        f.write(guide_content)
    
    print("✅ Created browser_automation_script.txt")
    print("✅ Created automation_workflow_guide.txt")
    print()
    print("🚀 READY TO AUTOMATE!")
    print()
    print("📋 Next Steps:")
    print("1. Open browser_automation_script.txt")
    print("2. Copy the console script")
    print("3. Follow automation_workflow_guide.txt")
    print("4. Start with AMOS book (144 files)")
    print()
    print("💡 The browser automation will extract file IDs automatically!")
    print("   No more manual clicking through 8,461 files!")

if __name__ == "__main__":
    main()
