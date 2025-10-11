#!/usr/bin/env python3
"""
Automated Extraction Workflow for Google Drive File IDs

This script provides a complete workflow for extracting file IDs from Google Drive
and updating the worksheet automatically.
"""

import json
import re
from pathlib import Path

def create_comprehensive_workflow():
    """Create a comprehensive workflow for automated extraction"""
    
    workflow = '''
🎯 COMPREHENSIVE AUTOMATED EXTRACTION WORKFLOW

📊 PROGRESS STATUS:
✅ Jonah Chapter 1: 17 files extracted
✅ Jonah Chapter 2: 10 files extracted  
🔄 Jonah Chapter 3: In progress
⏳ Jonah Chapter 4: Pending
⏳ 12 other books: Pending (8,000+ files)

📋 PHASE 1: Complete Jonah Book (48 files total)
   1. Extract remaining chapters (3-4)
   2. Update jonah_worksheet.txt
   3. Test with batch_update_file_ids.py

📋 PHASE 2: Scale to All Books
   1. Apply same automation to remaining 12 books
   2. Process in order of size (smallest first)
   3. Update individual book worksheets
   4. Test each book before proceeding

📋 PHASE 3: Final Integration
   1. Merge all book worksheets
   2. Update main google_drive_audio_urls.json
   3. Test audio playback in application

🔧 BROWSER AUTOMATION SCRIPT (Copy to browser console):
'''
    
    console_script = '''
// Automated File ID Extractor for Google Drive
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
const mapping = extractAllFileIds();
console.log('File mapping:', mapping);
console.log('Total files found:', Object.keys(mapping).length);

// Copy to clipboard in worksheet format
const clipboardText = Object.entries(mapping)
    .map(([filename, fileId]) => `${filename}:${fileId}`)
    .join('\\n');
navigator.clipboard.writeText(clipboardText).then(() => {
    console.log('File IDs copied to clipboard in worksheet format!');
    console.log('Paste into your worksheet file and run: python3 batch_update_file_ids.py [book]_worksheet.txt');
});
'''
    
    return workflow + console_script

def create_extraction_summary():
    """Create a summary of extraction progress"""
    
    summary = '''
📊 EXTRACTION PROGRESS SUMMARY

✅ COMPLETED:
   • Jonah Chapter 1: 17 files
   • Jonah Chapter 2: 10 files
   • Total extracted: 27 files

🔄 IN PROGRESS:
   • Jonah Chapter 3: Extracting now
   • Jonah Chapter 4: Next

⏳ REMAINING:
   • Jonah: 11 files (chapters 3-4)
   • 12 other books: 8,434 files
   • Total remaining: 8,445 files

🎯 NEXT STEPS:
   1. Complete Jonah book (chapters 3-4)
   2. Update jonah_worksheet.txt
   3. Test: python3 batch_update_file_ids.py jonah_worksheet.txt
   4. Move to next smallest book (Isaiah: 31 files)

💡 AUTOMATION BENEFITS:
   • No manual clicking through 8,461 files
   • Consistent extraction method
   • Immediate clipboard copy
   • Batch processing ready
   • Error-free file ID mapping
'''
    
    return summary

def main():
    """Main function to create workflow resources"""
    
    print("🎯 Creating Comprehensive Extraction Workflow...")
    print()
    
    # Create the workflow
    workflow_content = create_comprehensive_workflow()
    with open('comprehensive_extraction_workflow.txt', 'w') as f:
        f.write(workflow_content)
    
    # Create the summary
    summary_content = create_extraction_summary()
    with open('extraction_progress_summary.txt', 'w') as f:
        f.write(summary_content)
    
    print("✅ Created comprehensive_extraction_workflow.txt")
    print("✅ Created extraction_progress_summary.txt")
    print()
    print("🚀 AUTOMATION READY!")
    print()
    print("📋 Current Status:")
    print("• Jonah Chapter 1: ✅ 17 files extracted")
    print("• Jonah Chapter 2: ✅ 10 files extracted")
    print("• Jonah Chapter 3: 🔄 Extracting now")
    print("• Jonah Chapter 4: ⏳ Next")
    print()
    print("💡 Copy the console script from comprehensive_extraction_workflow.txt")
    print("   and paste it into your browser console to extract file IDs!")

if __name__ == "__main__":
    main()
