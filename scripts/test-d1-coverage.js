#!/usr/bin/env node

/**
 * Diagnostic script to check if D1 verb forms appear in actual verses
 * This tests if the verb conjugations from D1 match the words used in Bible verses
 */

console.log('🔍 D1 Verb Forms Coverage Test\n');
console.log('='.repeat(70));

// Sample verb forms that D1 claims exist for وهل
const d1Forms = [
    'وهل',    // infinitive
    'وهم',    // present 1st sing
    'وهې',    // present 2nd sing  
    'وهي',    // present 3rd sing
    'وهو',    // present 1st plur
    'وهئ',    // present 2nd plur
    'ووهلو',  // some other form
    'ووهلوي', // some other form
    'ووهلي',  // some other form
    'وهلو',   // past 3rd masc sing
    'وهلې',   // past 2nd sing
    'وهلم',   // past 1st sing
];

// Sample verses that contain these forms (from your Bible search results)
const sampleVerses = [
    { ref: '1 Cor 4:11', text: 'تر اوسه هم  وړي او تږي يو او لوڅ يو او بې کورې هم يو او نهر لویږو او وهل کېږو' },
    { ref: 'Matthew 20:19', text: 'او به  د غیر قومونو په لاسونو کې سپاری گردي چې د هغه په سر هُزف ووهي او کړکمن کړي او په صليب ووهي او د درې م ورځي به وژلاي شي' },
    { ref: 'Matthew 21:35', text: 'او کاره ګارانو د  د کارونو د زمینونو د خوږنو په نيولو سره بعضي وهل او بعضي وواژه او بعضي غړو' },
    { ref: 'Luke 12:47', text: 'او هغې نکورې چې د خپل مالک منشاء وپه ژانده او هم جوړ تیار نه و نه  به اړین ځانته تیار کړی و هغه ډیر وهل کېږی' },
    { ref: 'Luke 12:48', text: 'خو هغه نوکر چې د هغه په خبره نه و او گناهونه کول ډېر گناهی نه دی' },
];

console.log(`\n📊 Testing ${d1Forms.length} D1 forms against ${sampleVerses.length} sample verses\n`);

let totalMatches = 0;
let formsFound = new Set();

d1Forms.forEach(form => {
    let matchCount = 0;
    let matchingVerses = [];

    sampleVerses.forEach(verse => {
        // Use the same logic as the app: collapsed text matching
        const collapsedText = verse.text.toLowerCase().replace(/\s+/g, '');
        const collapsedForm = form.toLowerCase().replace(/\s+/g, '');

        if (collapsedText.includes(collapsedForm)) {
            matchCount++;
            matchingVerses.push(verse.ref);
            formsFound.add(form);
        }
    });

    if (matchCount > 0) {
        console.log(`✅ "${form}" - found in ${matchCount} verse(s): ${matchingVerses.join(', ')}`);
        totalMatches += matchCount;
    } else {
        console.log(`❌ "${form}" - NOT FOUND in any sample verse`);
    }
});

console.log('\n' + '='.repeat(70));
console.log(`\n📈 Results Summary:`);
console.log(`   Forms tested: ${d1Forms.length}`);
console.log(`   Forms found in verses: ${formsFound.size}`);
console.log(`   Forms NOT found: ${d1Forms.length - formsFound.size}`);
console.log(`   Total matches: ${totalMatches}`);
console.log(`   Coverage: ${((formsFound.size / d1Forms.length) * 100).toFixed(1)}%\n`);

if (formsFound.size < d1Forms.length / 2) {
    console.log('⚠️  WARNING: Less than 50% of D1 forms found in verses!');
    console.log('   This suggests:');
    console.log('   1. D1 verb forms don\'t match actual Bible text');
    console.log('   2. Forms are theoretically correct but not used in these verses');
    console.log('   3. Need to check if D1 forms match LingDocs vs Bible usage\n');
}

console.log('💡 Next Steps:');
console.log('   1. Query D1 to see actual verb forms stored');
console.log('   2. Compare D1 forms vs what appears in verses');
console.log('   3. Check if filtering works for forms that DO exist');
console.log('   4. Verify "1st person" filter actually selects وهم, وهو\n');

// Test specific filter scenario
console.log('\n🧪 Testing 1st Person Filter:');
const firstPersonForms = d1Forms.filter(form =>
    ['وهم', 'وهو', 'وهلم'].includes(form) // Theoretically 1st person
);
console.log(`   1st person forms: ${firstPersonForms.join(', ')}`);

let firstPersonMatches = 0;
firstPersonForms.forEach(form => {
    sampleVerses.forEach(verse => {
        const collapsedText = verse.text.toLowerCase().replace(/\s+/g, '');
        const collapsedForm = form.toLowerCase().replace(/\s+/g, '');
        if (collapsedText.includes(collapsedForm)) {
            firstPersonMatches++;
        }
    });
});

console.log(`   Verses matching 1st person: ${firstPersonMatches} out of ${sampleVerses.length}`);
console.log(`   Expected result count if filtering worked: ~${firstPersonMatches}\n`);
