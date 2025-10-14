
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
        .join('\n');
    
    navigator.clipboard.writeText(mappingText).then(() => {
        console.log('File mapping copied to clipboard!');
    });
    
    return mapping;
}

// Run the extraction
console.log('Starting file ID extraction...');
const mapping = createFileMapping();
