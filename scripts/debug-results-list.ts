// Mock Verse type
interface Verse {
    ref: string;
    text: string;
    matchedForms?: string[];
    translation: string;
}

// Mock data
const results: Verse[] = Array(280).fill(null).map((_, i) => ({
    ref: `Book ${i + 1}:1`,
    text: `Verse text ${i + 1}`,
    matchedForms: ['form1'],
    translation: 'afghan2023'
}));

const page = 1;
const itemsPerPage = 10;

// Simulate filtering
const filteredResults = results.filter(verse => {
    if (!verse.matchedForms || verse.matchedForms.length === 0) {
        return false;
    }
    return true;
});

console.log('Filtered length:', filteredResults.length);

// Simulate slicing
const start = (page - 1) * itemsPerPage;
const end = page * itemsPerPage;
const paginatedResults = filteredResults.slice(start, end);

console.log('Paginated length:', paginatedResults.length);
console.log('Start:', start);
console.log('End:', end);

if (paginatedResults.length === 0 && filteredResults.length > 0) {
    console.error('CRITICAL: Slice returned empty array!');
} else {
    console.log('Slice worked correctly.');
}
