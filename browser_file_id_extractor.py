#!/usr/bin/env python3
"""
Browser-based Google Drive File ID Extractor

This script provides instructions for using the browser automation
to extract file IDs from Google Drive folders.
"""

import json
import re
from pathlib import Path

def create_browser_automation_guide():
    """Create a guide for browser automation"""
    guide = """
🎯 BROWSER AUTOMATION GUIDE FOR GOOGLE DRIVE FILE ID EXTRACTION

📋 STEP 1: Navigate to Main Folder
   URL: https://drive.google.com/drive/folders/1m-Mv7r01GHTgXkzFxAXfANn_7sSHRSUC
   
📋 STEP 2: For Each Book Folder (amos, deuteronomy, ecclesiastes, etc.)
   1. Double-click the book folder
   2. Note the folder ID from URL
   3. For each chapter folder (chapter-1-verses, chapter-2-verses, etc.)
       a. Double-click chapter folder
       b. Note the folder ID from URL
       c. Extract file IDs from the file list

📋 STEP 3: Extract File IDs
   Method 1: From URL when clicking files
   Method 2: From page source (right-click → View Page Source)
   Method 3: From browser console (F12 → Console)

📋 STEP 4: Update Worksheet
   Format: filename.mp3:FILE_ID
   Example: jonah001_verse_001.mp3:1ABC123DEF456

🔧 AUTOMATED APPROACH:
   Instead of manual clicking, use browser automation:
   1. Navigate to folder
   2. Extract all file IDs from page
   3. Match with expected filenames
   4. Update worksheet automatically
"""
    return guide

def create_folder_structure_mapping():
    """Create mapping of folder structure discovered"""
    structure = {
        "main_folder": {
            "id": "1m-Mv7r01GHTgXkzFxAXfANn_7sSHRSUC",
            "url": "https://drive.google.com/drive/folders/1m-Mv7r01GHTgXkzFxAXfANn_7sSHRSUC",
            "books": {
                "amos": {
                    "id": "unknown",
                    "chapters": {}
                },
                "deuteronomy": {
                    "id": "unknown", 
                    "chapters": {}
                },
                "ecclesiastes": {
                    "id": "unknown",
                    "chapters": {}
                },
                "exodus": {
                    "id": "unknown",
                    "chapters": {}
                },
                "ezekiel": {
                    "id": "unknown",
                    "chapters": {}
                },
                "ezra": {
                    "id": "unknown",
                    "chapters": {}
                },
                "genesis": {
                    "id": "unknown",
                    "chapters": {}
                },
                "isaiah": {
                    "id": "unknown",
                    "chapters": {}
                },
                "jonah": {
                    "id": "13eGR6-EoOiGwK1_bfNzh2Ry4F3DxXBM7",
                    "url": "https://drive.google.com/drive/folders/13eGR6-EoOiGwK1_bfNzh2Ry4F3DxXBM7",
                    "chapters": {
                        "chapter-1-verses": {
                            "id": "1qFOYBiLY43dG_Hro7-V38nEAU0J2FzBI",
                            "url": "https://drive.google.com/drive/folders/1qFOYBiLY43dG_Hro7-V38nEAU0J2FzBI",
                            "files": [
                                "jonah001_verse_001.mp3",
                                "jonah001_verse_002.mp3",
                                "jonah001_verse_003.mp3",
                                "jonah001_verse_004.mp3",
                                "jonah001_verse_005.mp3",
                                "jonah001_verse_006.mp3",
                                "jonah001_verse_007.mp3",
                                "jonah001_verse_008.mp3",
                                "jonah001_verse_009.mp3",
                                "jonah001_verse_010.mp3",
                                "jonah001_verse_011.mp3",
                                "jonah001_verse_012.mp3",
                                "jonah001_verse_013.mp3",
                                "jonah001_verse_014.mp3",
                                "jonah001_verse_015.mp3",
                                "jonah001_verse_016.mp3",
                                "jonah001_verse_017.mp3"
                            ]
                        },
                        "chapter-2-verses": {
                            "id": "unknown",
                            "files": []
                        },
                        "chapter-3-verses": {
                            "id": "unknown", 
                            "files": []
                        },
                        "chapter-4-verses": {
                            "id": "unknown",
                            "files": []
                        }
                    }
                },
                "judges": {
                    "id": "unknown",
                    "chapters": {}
                },
                "leviticus": {
                    "id": "unknown",
                    "chapters": {}
                },
                "numbers": {
                    "id": "unknown",
                    "chapters": {}
                },
                "proverbs": {
                    "id": "unknown",
                    "chapters": {}
                }
            }
        }
    }
    return structure

def create_browser_automation_script():
    """Create a JavaScript snippet for browser automation"""
    js_script = """
// Browser Console Script for Google Drive File ID Extraction
// Run this in the browser console (F12 → Console) on a Google Drive folder page

function extractFileIdsFromPage() {
    const fileIds = [];
    
    // Method 1: Extract from page data
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
        const content = script.textContent;
        if (content.includes('fileId') || content.includes('id":')) {
            // Look for file ID patterns
            const matches = content.match(/"id":"([a-zA-Z0-9_-]{20,})"/g);
            if (matches) {
                matches.forEach(match => {
                    const id = match.match(/"id":"([a-zA-Z0-9_-]{20,})"/)[1];
                    if (id && id.length > 20) {
                        fileIds.push(id);
                    }
                });
            }
        }
    });
    
    // Method 2: Extract from data attributes
    const elements = document.querySelectorAll('[data-id]');
    elements.forEach(el => {
        const id = el.getAttribute('data-id');
        if (id && id.length > 20) {
            fileIds.push(id);
        }
    });
    
    // Method 3: Extract from URLs in page
    const links = document.querySelectorAll('a[href*="/file/d/"]');
    links.forEach(link => {
        const href = link.href;
        const match = href.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match) {
            fileIds.push(match[1]);
        }
    });
    
    // Remove duplicates
    const uniqueIds = [...new Set(fileIds)];
    
    console.log('Found file IDs:', uniqueIds);
    return uniqueIds;
}

function extractFileNamesFromPage() {
    const fileNames = [];
    
    // Extract file names from the page
    const nameElements = document.querySelectorAll('[data-tooltip-unhoverable="true"]');
    nameElements.forEach(el => {
        const name = el.textContent.trim();
        if (name.endsWith('.mp3')) {
            fileNames.push(name);
        }
    });
    
    // Alternative method
    const gridCells = document.querySelectorAll('[role="gridcell"]');
    gridCells.forEach(cell => {
        const strong = cell.querySelector('strong');
        if (strong && strong.textContent.endsWith('.mp3')) {
            fileNames.push(strong.textContent);
        }
    });
    
    console.log('Found file names:', fileNames);
    return fileNames;
}

function createFileMapping() {
    const fileIds = extractFileIdsFromPage();
    const fileNames = extractFileNamesFromPage();
    
    const mapping = {};
    const minLength = Math.min(fileIds.length, fileNames.length);
    
    for (let i = 0; i < minLength; i++) {
        mapping[fileNames[i]] = fileIds[i];
    }
    
    console.log('File mapping:', mapping);
    
    // Copy to clipboard
    const mappingText = Object.entries(mapping)
        .map(([name, id]) => `${name}:${id}`)
        .join('\\n');
    
    navigator.clipboard.writeText(mappingText).then(() => {
        console.log('File mapping copied to clipboard!');
    });
    
    return mapping;
}

// Run the extraction
console.log('Starting file ID extraction...');
const mapping = createFileMapping();
"""
    return js_script

def create_manual_extraction_template():
    """Create a template for manual extraction"""
    template = """
📋 MANUAL EXTRACTION TEMPLATE

For each book folder, follow these steps:

1. Navigate to book folder
2. Copy the folder ID from URL
3. For each chapter folder:
   a. Navigate to chapter folder
   b. Copy the folder ID from URL
   c. Extract file IDs using one of these methods:

   METHOD A: Browser Console
   - Press F12 to open developer tools
   - Go to Console tab
   - Paste the JavaScript code provided
   - Copy the results

   METHOD B: Page Source
   - Right-click → View Page Source
   - Search for "fileId" or "id":
   - Extract the file IDs manually

   METHOD C: URL Navigation
   - Click on each file
   - Copy the file ID from the URL
   - Format: filename.mp3:FILE_ID

4. Update the worksheet file with the extracted IDs

📝 WORKSHEET FORMAT:
jonah001_verse_001.mp3:FILE_ID_HERE
jonah001_verse_002.mp3:FILE_ID_HERE
jonah001_verse_003.mp3:FILE_ID_HERE
...

🎯 QUICK START:
1. Open file_ids_worksheet.txt
2. Start with Jonah (smallest book)
3. Navigate to each chapter folder
4. Extract file IDs using browser console
5. Replace FILE_ID_HERE with actual IDs
6. Test with batch_update_file_ids.py
7. Repeat for other books
"""
    return template

def main():
    """Main function"""
    print("🎵 Browser-based Google Drive File ID Extractor")
    print("=" * 55)
    
    # Show guide
    guide = create_browser_automation_guide()
    print(guide)
    
    # Show structure
    print("\n📁 DISCOVERED FOLDER STRUCTURE:")
    structure = create_folder_structure_mapping()
    print(f"Main folder: {structure['main_folder']['id']}")
    print(f"Jonah folder: {structure['main_folder']['books']['jonah']['id']}")
    print(f"Jonah Chapter 1: {structure['main_folder']['books']['jonah']['chapters']['chapter-1-verses']['id']}")
    
    # Show JavaScript script
    print("\n🔧 BROWSER CONSOLE SCRIPT:")
    js_script = create_browser_automation_script()
    print(js_script)
    
    # Show manual template
    template = create_manual_extraction_template()
    print(template)
    
    # Save JavaScript to file
    with open("browser_console_script.js", "w") as f:
        f.write(js_script)
    
    print("\n✅ Files created:")
    print("   • browser_console_script.js - JavaScript for browser console")
    print("   • file_ids_worksheet.txt - Worksheet to update")
    print("   • batch_update_file_ids.py - Script to process updates")
    
    print("\n🚀 NEXT STEPS:")
    print("   1. Open Google Drive in browser")
    print("   2. Navigate to Jonah Chapter 1 folder")
    print("   3. Open browser console (F12)")
    print("   4. Paste the JavaScript code")
    print("   5. Copy the results to worksheet")
    print("   6. Run batch update script")

if __name__ == "__main__":
    main()
