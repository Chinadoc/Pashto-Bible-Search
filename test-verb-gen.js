// Test script for verb conjugation
import { readFileSync } from 'fs';

// Extract the generateVerbConjugations function from route.ts
const routeContent = readFileSync('./app/api/search/route.ts', 'utf-8');

// For testing, let me manually define it
function generateVerbConjugations(infinitive, cap) {
    const variants = [];

    // Remove infinitive ending if present (ل or یل)
    let stem = infinitive;
    if (infinitive.endsWith('ل')) {
        stem = infinitive.slice(0, -1); // Remove ل
    } else if (infinitive.endsWith('یل')) {
        stem = infinitive.slice(0, -2); // Remove یل
    }

    console.log(`[VERB_GEN] Generating forms for "${infinitive}" (stem: "${stem}")`);

    // Present tense conjugations (agrees with subject)
    const presentEndings = [
        { ending: 'م', label: 'present 1st sing', person: '1st sing' },
        { ending: 'ې', label: 'present 2nd sing', person: '2nd sing' },
        { ending: 'ي', label: 'present 3rd sing', person: '3rd sing' },
        { ending: 'و', label: 'present 1st plur', person: '1st plur' },
        { ending: 'ئ', label: 'present 2nd plur', person: '2nd plur' },
        { ending: 'ي', label: 'present 3rd plur', person: '3rd plur' },
    ];

    for (const { ending, label, person } of presentEndings) {
        const form = stem + ending;
        variants.push({
            form,
            label,
            pos: 'verb',
            score: 0.8,
            romanized: undefined,
            flags: ['algorithmic'],
        });
    }

    // Add the infinitive itself
    variants.push({
        form: infinitive,
        label: 'infinitive',
        pos: 'verb',
        score: 1.0,
    });

    // Simple past tense (add و prefix for perfective)
    if (!infinitive.startsWith('و')) {
        variants.push({
            form: 'و' + infinitive,
            label: 'perfective infinitive',
            pos: 'verb',
            score: 0.9,
            flags: ['perfective'],
        });

        // Past perfective conjugations
        for (const { ending, label } of presentEndings) {
            variants.push({
                form: 'و' + stem + ending,
                label: `past perfective ${label.split(' ').slice(1).join(' ')}`,
                pos: 'verb',
                score: 0.7,
                flags: ['perfective', 'algorithmic'],
            });
        }
    }

    console.log(`[VERB_GEN] Generated ${variants.length} algorithmic forms`);
    return variants.slice(0, cap);
}

// Test it
const forms = generateVerbConjugations('وهل', 20);
console.log('\nGenerated forms:');
forms.forEach((f, i) => {
    console.log(`${i + 1}. ${f.form} (${f.label})`);
});
