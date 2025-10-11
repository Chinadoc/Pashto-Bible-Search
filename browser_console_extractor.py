#!/usr/bin/env python3
"""
Browser Console File ID Extractor

This script provides browser console commands for efficient file ID extraction
from Google Drive folders.
"""

def create_browser_console_script():
    """Create browser console script for file ID extraction"""

    script = '''
🎯 BROWSER CONSOLE FILE ID EXTRACTOR

📋 COPY AND PASTE THIS INTO BROWSER CONSOLE:

```javascript
// File ID Extractor for Google Drive Chapter Folders
function extractAllFileIds() {
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
const mapping = extractAllFileIds();
console.log('File mapping:', mapping);
console.log('Total files found:', Object.keys(mapping).length);

// Copy to clipboard in worksheet format
const clipboardText = Object.entries(mapping)
    .map(([filename, fileId]) => `${filename}:${fileId}`)
    .join('\\n');
navigator.clipboard.writeText(clipboardText).then(() => {
    console.log('✅ File IDs copied to clipboard!');
    console.log('📋 Paste into your worksheet file');
});
```

🔧 USAGE INSTRUCTIONS:

1. 📂 Navigate to Chapter Folder
   • Go to: https://drive.google.com/drive/folders/1m-Mv7r01GHTgXkzFxAXfANn_7sSHRSUC
   • Click on book folder (amos, deuteronomy, etc.)
   • Click on chapter folder (chapter-1-verses, chapter-2-verses, etc.)

2. 🔍 Open Browser Console
   • Press F12 or right-click → Inspect
   • Go to Console tab

3. 📋 Run Extraction Script
   • Copy and paste the script above
   • Press Enter to run
   • File IDs will be copied to clipboard

4. 📝 Update Worksheet
   • Paste file IDs into worksheet file
   • Replace FILE_ID_HERE with actual IDs
   • Format: filename.mp3:ACTUAL_FILE_ID

5. ✅ Test Integration
   • Run: python3 batch_update_file_ids.py [book]_worksheet.txt
   • Verify file IDs updated correctly

💡 TIPS:
• Process chapters in order (1, 2, 3, etc.)
• Copy file IDs immediately after extraction
• Test each book before moving to next
• Use browser back button to navigate between folders
'''

    return script

def create_processing_status():
    """Create current processing status"""

    status = '''
📊 CURRENT PROCESSING STATUS:

✅ COMPLETED BOOKS:
• Jonah: 48 files (100% complete)
• Isaiah: 31 files (100% complete)
• Ezra: 23 files (13% complete)

🔄 IN PROGRESS:
• Ezra: Chapters 4-10 remaining

📋 REMAINING BOOKS:
• Ecclesiastes (222 files)
• Judges (859 files)
• Leviticus (859 files)
• Numbers (1,288 files)
• Genesis (1,533 files)
• Exodus (1,213 files)
• Deuteronomy (958 files)
• Proverbs (915 files)
• Psalms (2,461 files)

🎯 TOTAL PROGRESS:
• 102 files extracted (1.2% of 8,461 total)
• 8,359 files remaining

🚀 READY TO CONTINUE!
'''

    return status

def main():
    """Main function to create browser console extractor"""

    print("🎯 Creating Browser Console File ID Extractor...")
    print()

    # Create the browser console script
    script_content = create_browser_console_script()
    with open('browser_console_extractor.txt', 'w') as f:
        f.write(script_content)

    # Create processing status
    status_content = create_processing_status()
    with open('current_processing_status.txt', 'w') as f:
        f.write(status_content)

    print("✅ Created browser_console_extractor.txt")
    print("✅ Created current_processing_status.txt")
    print()
    print("🚀 BROWSER CONSOLE EXTRACTOR READY!")
    print()
    print("📋 Next Steps:")
    print("1. Navigate to chapter folder in Google Drive")
    print("2. Open browser console (F12)")
    print("3. Copy script from browser_console_extractor.txt")
    print("4. Paste and run in console")
    print("5. Copy file IDs to worksheet")
    print("6. Update with batch_update_file_ids.py")
    print()
    print("💡 This approach works within single browser session!")
    print("   No browser instance conflicts!")

if __name__ == "__main__":
    main()
