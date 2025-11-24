#!/usr/bin/env node

/**
 * Test the comprehensive verb conjugator
 */

// Import the conjugator (simulating since we can't actually import TS in Node)
// We'll inline the logic for testing

const PRESENT_ENDINGS = [
    { ending: 'م', person: '1st', number: 'sing', label: '1st sing' },
    { ending: 'ې', person: '2nd', number: 'sing', label: '2nd sing' },
    { ending: 'ي', person: '3rd', number: 'sing', label: '3rd sing' },
    { ending: 'و', person: '1st', number: 'plur', label: '1st plur' },
    { ending: 'ئ', person: '2nd', number: 'plur', label: '2nd plur' },
    { ending: 'ي', person: '3rd', number: 'plur', label: '3rd plur' },
];

function generateComprehensiveVerbForms(infinitive) {
    const forms = [];

    // Derive stems
    const base = infinitive.slice(0, -1); // وه from وهل
    const imperfectiveStem = base;
    const perfectiveStem = 'و' + base; // ووه
    const perfectiveRoot = 'و' + infinitive; // ووهل
    const pastParticiple = base + 'لی'; // وهلی

    // Present tense (imperfective stem)
    PRESENT_ENDINGS.forEach(({ ending, person, label }) => {
        forms.push({
            form: imperfectiveStem + ending,
            label: `present ${label}`,
            person,
            type: 'present',
        });
    });

    // Perfective forms (join head)
    PRESENT_ENDINGS.forEach(({ ending, person, label }) => {
        forms.push({
            form: perfectiveStem + ending,
            label: `perfective ${label}`,
            person,
            type: 'perfective',
        });
    });

    // Past tense
    const PAST_ENDINGS = ['م', 'ې', 'و', 'ه', 'و', 'ئ', 'ل'];
    PAST_ENDINGS.forEach((ending, idx) => {
        forms.push({
            form: perfectiveRoot + ending,
            label: `past ${idx + 1}`,
            type: 'past',
        });
    });

    // Passive constructions (CRITICAL for Bible)
    forms.push(
        { form: `${infinitive} کېږو`, label: 'passive 1st plur', type: 'passive' },
        { form: `${infinitive} کېږي`, label: 'passive 3rd sing', type: 'passive' },
        { form: `${infinitive} کېږې`, label: 'passive 2nd sing', type: 'passive' },
        { form: `${infinitive} شي`, label: 'passive subjunctive', type: 'passive' },
    );

    // Perfect constructions
    forms.push(
        { form: `${pastParticiple} یم`, label: 'perfect 1st sing', type: 'perfect' },
        { form: `${pastParticiple} یې`, label: 'perfect 2nd sing', type: 'perfect' },
        { form: `${pastParticiple} دی`, label: 'perfect 3rd masc', type: 'perfect' },
    );

    // Infinitive and participle
    forms.push(
        { form: infinitive, label: 'infinitive', type: 'base' },
        { form: pastParticiple, label: 'past participle', type: 'base' },
    );

    return forms;
}

// Test with وهل (wahul - to hit)
console.log('🧪 Testing Comprehensive Verb Conjugator\n');
console.log('='.repeat(70));

const infinitive = 'وهل';
const forms = generateComprehensiveVerbForms(infinitive);

console.log(`\n📊 Generated ${forms.length} forms for "${infinitive}"\n`);

// Group by type
const byType = {};
forms.forEach(f => {
    if (!byType[f.type]) byType[f.type] = [];
    byType[f.type].push(f);
});

Object.keys(byType).forEach(type => {
    console.log(`\n${type.toUpperCase()}:`);
    byType[type].forEach(f => {
        console.log(`  ${f.form.padEnd(20)} - ${f.label}`);
    });
});

// Test against Bible verse coverage
console.log('\n\n' + '='.repeat(70));
console.log('📖 Testing Coverage Against Bible Verses\n');

const sampleVerses = [
    { ref: '1 Cor 4:11', text: 'تر اوسه هم  وړي او تږي يو او لوڅ يو او بې کورې هم يو او نهر لویږو او وهل کېږو' },
    { ref: 'Matthew 20:19', text: 'او به  د غیر قومونو په لاسونو کې سپاری گردي چې د هغه په سر هُزف ووهي او کړکمن کړي او په صليب ووهي او د درې م ورځي به وژلاي شي' },
    { ref: 'Matthew 21:35', text: 'او کاره ګارانو د  د کارونو د زمینونو د خوږنو په نيولو سره بعضي وهل او بعضي وواژه او بعضي غړو' },
    { ref: 'Luke 12:47', text: 'او هغې نکورې چې د خپل مالک منشاء وپه ژانده او هم جوړ تیار نه و نه  به اړین ځانته تیار کړی و هغه ډیر وهل کېږی' },
];

let matchCount = 0;
let formsFound = new Set();

forms.forEach(f => {
    const collapsedForm = f.form.toLowerCase().replace(/\s+/g, '');
    sampleVerses.forEach(v => {
        const collapsedVerse = v.text.toLowerCase().replace(/\s+/g, '');
        if (collapsedVerse.includes(collapsedForm)) {
            matchCount++;
            formsFound.add(f.form);
        }
    });
});

console.log(`✅ Forms found in verses: ${formsFound.size} out of ${forms.length}`);
console.log(`✅ Total matches: ${matchCount}`);
console.log(`✅ Coverage: ${((formsFound.size / forms.length) * 100).toFixed(1)}%\n`);

console.log('Forms found:');
Array.from(formsFound).forEach(form => {
    console.log(`  - ${form}`);
});

console.log('\n' + '='.repeat(70));
console.log('\n💡 Expected Improvements:');
console.log('  Previous coverage: 25% (3 out of 12 D1 forms)');
console.log(`  New coverage: ${((formsFound.size / forms.length) * 100).toFixed(1)}% (${formsFound.size} out of ${forms.length} comprehensive forms)`);
console.log('\n  The comprehensive conjugator includes passive constructions');
console.log('  like "وهل کېږو" which are commonly used in Bible verses!\n');
