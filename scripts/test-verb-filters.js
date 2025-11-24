#!/usr/bin/env node

/**
 * Test script to verify verb filtering is working correctly
 * This creates a sample search and tests if filtering reduces results properly
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Verb Filter Test\n');
console.log('='.repeat(60));

// Simulate the filter logic from verb-filters.ts
function normalizeLabel(label = '') {
    return label?.toLowerCase() || '';
}

function matchesPerson(label, person) {
    if (person === 'all') return true;
    const personPatterns = {
        '1st': ['1st', 'first'],
        '2nd': ['2nd', 'second'],
        '3rd': ['3rd', 'third'],
    };
    const patterns = personPatterns[person] || [];
    return patterns.some(p => label.includes(p));
}

function matchesTense(label, tense) {
    if (tense === 'all') return true;
    const tenseMatchers = {
        'present': ['present', 'pres'],
        'past': ['past'],
        'future': ['future', 'fut'],
        'perfect': ['perfect', 'perf'],
        'subjunctive': ['subjunctive', 'subj'],
        'imperative': ['imperative', 'imper'],
        'ability': ['ability', 'can'],
        'habitual': ['habitual', 'hab'],
    };
    const matchers = tenseMatchers[tense] || [];
    return matchers.some(m => label.includes(m));
}

function matchesMood(label, mood) {
    if (mood === 'all') return true;
    const moodMatchers = {
        'indicative': ['indic'],
        'subjunctive': ['subj'],
        'imperative': ['imper'],
        'ability': ['ability', 'can'],
    };
    const matchers = moodMatchers[mood] || [];
    return matchers.some(m => label.includes(m));
}

function matchesAspect(label, aspect) {
    if (aspect === 'all') return true;
    const aspectMatchers = {
        'imperfective': ['imperf'],
        'perfective': ['perf'],
    };
    const matchers = aspectMatchers[aspect] || [];
    return matchers.some(m => label.includes(m));
}

function filterVerbVariants(verbs, filters) {
    return verbs.filter(variant => {
        const label = normalizeLabel(variant.label);
        const personMatch = matchesPerson(label, filters.person);
        const tenseMatch = matchesTense(label, filters.tense);
        const moodMatch = matchesMood(label, filters.mood);
        const aspectMatch = matchesAspect(label, filters.aspect);

        return personMatch && tenseMatch && moodMatch && aspectMatch;
    });
}

// Sample verb forms for وهل (wahul - to hit/strike)
const sampleVerbForms = [
    { form: 'وهم', label: 'present 1st sing' },
    { form: 'وهې', label: 'present 2nd sing' },
    { form: 'وهي', label: 'present 3rd sing' },
    { form: 'وهو', label: 'present 1st plur' },
    { form: 'وهئ', label: 'present 2nd plur' },
    { form: 'ووهم', label: 'subjunctive 1st sing' },
    { form: 'ووهې', label: 'subjunctive 2nd sing' },
    { form: 'ووهي', label: 'subjunctive 3rd sing' },
    { form: 'وهل', label: 'infinitive' },
    { form: 'وهلم', label: 'past 1st sing' },
    { form: 'وهلې', label: 'past 2nd sing' },
    { form: 'وهلو', label: 'past 3rd masc sing' },
    { form: 'ووهلم', label: 'perfect 1st sing' },
    { form: 'ووهلې', label: 'perfect 2nd sing' },
];

console.log(`\n📊 Test Data: ${sampleVerbForms.length} verb forms\n`);

// Test 1: All filters
console.log('Test 1: No filters (all persons, all tenses)');
const test1 = filterVerbVariants(sampleVerbForms, {
    person: 'all',
    tense: 'all',
    aspect: 'all',
    mood: 'all',
});
console.log(`   Result: ${test1.length}/${sampleVerbForms.length} forms`);
console.log(`   ${test1.length === sampleVerbForms.length ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 2: Filter by person
console.log('Test 2: Filter by 1st person only');
const test2 = filterVerbVariants(sampleVerbForms, {
    person: '1st',
    tense: 'all',
    aspect: 'all',
    mood: 'all',
});
console.log(`   Expected: ~4 forms (1st sing/plur in different tenses)`);
console.log(`   Result: ${test2.length} forms`);
console.log(`   Forms: ${test2.map(v => v.form).join(', ')}`);
console.log(`   ${test2.length >= 3 && test2.length <= 5 ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 3: Filter by tense
console.log('Test 3: Filter by present tense only');
const test3 = filterVerbVariants(sampleVerbForms, {
    person: 'all',
    tense: 'present',
    aspect: 'all',
    mood: 'all',
});
console.log(`   Expected: 5 forms (present 1st/2nd/3rd sing + 1st/2nd plur)`);
console.log(`   Result: ${test3.length} forms`);
console.log(`   Forms: ${test3.map(v => v.form).join(', ')}`);
console.log(`   ${test3.length === 5 ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 4: Combined filters
console.log('Test 4: Filter by 3rd person + present tense');
const test4 = filterVerbVariants(sampleVerbForms, {
    person: '3rd',
    tense: 'present',
    aspect: 'all',
    mood: 'all',
});
console.log(`   Expected: 1 form (وهي - present 3rd sing)`);
console.log(`   Result: ${test4.length} forms`);
console.log(`   Forms: ${test4.map(v => v.form).join(', ')}`);
console.log(`   ${test4.length === 1 && test4[0].form === 'وهي' ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 5: Subjunctive mood
console.log('Test 5: Filter by subjunctive mood');
const test5 = filterVerbVariants(sampleVerbForms, {
    person: 'all',
    tense: 'all',
    aspect: 'all',
    mood: 'subjunctive',
});
console.log(`   Expected: 3 forms (subjunctive 1st/2nd/3rd sing)`);
console.log(`   Result: ${test5.length} forms`);
console.log(`   Forms: ${test5.map(v => v.form).join(', ')}`);
console.log(`   ${test5.length === 3 ? '✅ PASS' : '❌ FAIL'}\n`);

console.log('='.repeat(60));
console.log('\n🎯 Summary:');
console.log('The filtering logic is working if all tests show ✅ PASS');
console.log('This means when users select filters in the UI, the results');
console.log('should be properly filtered to show only matching forms.\n');

console.log('💡 To test in the browser:');
console.log('1. Search for "وهل" with Related Forms');
console.log('2. Click "1st" person filter');
console.log('3. Results should reduce from 280 to ~60-80 (only 1st person forms)');
console.log('4. Additionally select "present" tense');
console.log('5. Results should reduce further to ~15-20 (only 1st person present forms)\n');
