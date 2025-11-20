
import { filterVerbVariants } from './app/utils/verb-filters';
import { RelatedFormVariant } from './types';

// Mock data
const variants: RelatedFormVariant[] = [
    { form: 'وهل', label: 'infinitive', pos: 'verb', score: 1 },
    { form: 'وهي', label: 'present 3rd person singular', pos: 'verb', score: 1 },
    { form: 'ووهل', label: 'past 3rd person singular', pos: 'verb', score: 1 },
    { form: 'ووهي', label: 'subjunctive 3rd person singular', pos: 'verb', score: 1 },
    { form: 'وهلی دی', label: 'perfect 3rd person singular', pos: 'verb', score: 1 },
];

// Test cases
const tests = [
    {
        name: 'Filter by Present Tense',
        filters: { person: [], tense: ['present'], mood: [], aspect: [] },
        expected: ['وهي']
    },
    {
        name: 'Filter by Past Tense',
        filters: { person: [], tense: ['past'], mood: [], aspect: [] },
        expected: ['ووهل']
    },
    {
        name: 'Filter by Subjunctive Mood',
        filters: { person: [], tense: [], mood: ['subjunctive'], aspect: [] },
        expected: ['ووهي']
    },
    {
        name: 'Filter by 3rd Person (should match all except infinitive)',
        filters: { person: ['3rd'], tense: [], mood: [], aspect: [] },
        expected: ['وهي', 'ووهل', 'ووهي', 'وهلی دی']
    }
];

console.log('Running Verb Filter Tests...\n');

tests.forEach(test => {
    console.log(`Test: ${test.name}`);
    const result = filterVerbVariants(variants, test.filters as any);
    const resultForms = result.map(v => v.form);

    const passed = JSON.stringify(resultForms.sort()) === JSON.stringify(test.expected.sort());

    if (passed) {
        console.log(`  ✅ PASS`);
    } else {
        console.log(`  ❌ FAIL`);
        console.log(`     Expected: ${JSON.stringify(test.expected)}`);
        console.log(`     Got:      ${JSON.stringify(resultForms)}`);
    }
    console.log('');
});
