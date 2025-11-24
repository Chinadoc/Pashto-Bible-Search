#!/usr/bin/env node

/**
 * Test script to verify matchedForms data flow
 * Run this to test if the matched forms feature is working
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Matched Forms Data Flow Test\n');
console.log('This script verifies that matchedForms are properly tracked through the entire pipeline:\n');

// Check 1: Verse type definition
console.log('✅ Step 1: Check Verse type definition');
const typesPath = path.join(__dirname, '../types/index.ts');
const typesContent = fs.readFileSync(typesPath, 'utf8');
if (typesContent.includes('matchedForms?: string[]')) {
    console.log('   ✓ matchedForms property exists in Verse interface\n');
} else {
    console.log('   ✗ matchedForms property MISSING from Verse interface\n');
}

// Check 2: API Route populates matchedForms
console.log('✅ Step 2: Check API route populates matchedForms');
const apiPath = path.join(__dirname, '../app/api/search/route.ts');
const apiContent = fs.readFileSync(apiPath, 'utf8');
if (apiContent.includes('matchedForms:') && apiContent.includes('searchTerms.filter')) {
    console.log('   ✓ API route includes matchedForms population logic\n');
} else {
    console.log('   ✗ API route MISSING matchedForms population logic\n');
}

// Check 3: Normalization preserves matchedForms
console.log('✅ Step 3: Check normalization preserves matchedForms');
const normalizePath = path.join(__dirname, '../app/utils/normalize-results.ts');
const normalizeContent = fs.readFileSync(normalizePath, 'utf8');
if (normalizeContent.includes('matchedForms?:') && normalizeContent.includes('matchedForms:')) {
    console.log('   ✓ Normalization function preserves matchedForms\n');
} else {
    console.log('   ✗ Normalization function MISSING matchedForms preservation\n');
}

// Check 4: UI displays matchedForms
console.log('✅ Step 4: Check UI displays matchedForms');
const uiPath = path.join(__dirname, '../components/ResultsList.tsx');
const uiContent = fs.readFileSync(uiPath, 'utf8');
if (uiContent.includes('verse.matchedForms') && uiContent.includes('bg-purple')) {
    console.log('   ✓ UI component includes matchedForms display\n');
} else {
    console.log('   ✗ UI component MISSING matchedForms display\n');
}

console.log('\n' + '='.repeat(60));
console.log('DATA FLOW PATH:');
console.log('='.repeat(60));
console.log('1. User searches with "Related Forms" enabled');
console.log('2. API gets conjugated forms (e.g., وهم, وهي, وهې)');
console.log('3. API searches verses containing these forms');
console.log('4. API checks which forms appear in each verse → matchedForms[]');
console.log('5. Normalization preserves matchedForms through pipeline');
console.log('6. Frontend receives verses with matchedForms populated');
console.log('7. ResultsList shows purple badges for each matched form');
console.log('='.repeat(60) + '\n');

console.log('🎯 Expected Result:');
console.log('   When searching "وهل" with Related Forms:');
console.log('   - 1 Cor 4:11 should show badge: "وهل کېږو"');
console.log('   - Matthew 20:19 should show badge: "وهي"');
console.log('   - Each verse shows the specific form it contains\n');

console.log('🔧 If badges are not showing:');
console.log('   1. Check browser console for errors');
console.log('   2. Verify API response includes matchedForms: ["form1", "form2"]');
console.log('   3. Hard refresh (Cmd+Shift+R) to clear cache');
console.log('   4. Deployment may take 60-90 seconds after push\n');
