/**
 * Comprehensive Pashto Verb Conjugator
 * Based on LingDocs grammar rules
 * 
 * Generates all possible forms including:
 * - Split head perfective (و __ وه-)
 * - Join head perfective (ووه-)
 * - Compound constructions (passive, perfect, continuous)
 * - Common auxiliary combinations
 */

export interface VerbForm {
    form: string;
    label: string;
    person?: string;
    tense?: string;
    aspect?: string;
    mood?: string;
    constructionType?: 'simple' | 'compound' | 'passive' | 'perfect' | 'continuous';
}

export interface VerbConjugation {
    infinitive: string;
    stems: {
        imperfective: string;
        perfective: string;
        perfectiveSplit?: string; // For split head: "و __ وه"
    };
    roots: {
        imperfective: string;
        perfective: string;
    };
    pastParticiple: string;
    allForms: VerbForm[];
}

// Common verb endings for present tense
const PRESENT_ENDINGS = [
    { ending: 'م', person: '1st', number: 'sing', label: '1st sing' },
    { ending: 'ې', person: '2nd', number: 'sing', label: '2nd sing' },
    { ending: 'ي', person: '3rd', number: 'sing', label: '3rd sing' },
    { ending: 'و', person: '1st', number: 'plur', label: '1st plur' },
    { ending: 'ئ', person: '2nd', number: 'plur', label: '2nd plur' },
    { ending: 'ي', person: '3rd', number: 'plur', label: '3rd plur' },
];

// Common auxiliaries for compound constructions
const AUXILIARIES = {
    keGee: ['کېږم', 'کېږې', 'کېږي', 'کېږو', 'کېږئ'],  // "becomes" - passive
    shee: ['شم', 'شې', 'شي', 'شو', 'شئ'],  // "becomes" - passive
    yum: ['یم', 'یې', 'دی', 'یو', 'یئ'],  // "am/is/are" - perfect
    dee: ['دی', 'ده', 'دي'],  // "is/are"
};

/**
 * Separable prefixes (split heads) in Pashto
 * These are directional/aspectual prefixes that can be separated from the verb stem
 * in certain grammatical contexts, especially in perfective aspect.
 * 
 * Reference: https://grammar.lingdocs.com/verbs/roots-and-stems/#split-and-non-split
 * 
 * In the perfective, the و prefix can "split" the directional prefix from the stem:
 * - را + کوي → را و کړي (perfective: "he/she does it coming here")
 * - در + کوي → در و کړي (perfective: "he/she does it going to you")
 * - ور + کوي → ور و کړي (perfective: "he/she does it going away")
 */
export const SEPARABLE_PREFIXES: { prefix: string; meaning: string; type: 'directional' | 'aspectual' }[] = [
    { prefix: 'را', meaning: 'hither (towards speaker)', type: 'directional' },
    { prefix: 'در', meaning: 'thither (towards addressee)', type: 'directional' },
    { prefix: 'ور', meaning: 'thither (away from both)', type: 'directional' },
    { prefix: 'ور', meaning: 'thither (away from both)', type: 'directional' },
    // Note: ننـ (inside), وتـ (outside), ختـ (up), and کوزـ (down) are also directional
    // but typically don't separate as cleanly
];

/**
 * Check if a verb has a separable prefix
 */
export function hasSeparablePrefix(verb: string): { hasPrefix: boolean; prefix?: string; stem?: string } {
    for (const { prefix } of SEPARABLE_PREFIXES) {
        if (verb.startsWith(prefix)) {
            return {
                hasPrefix: true,
                prefix,
                stem: verb.slice(prefix.length),
            };
        }
    }
    return { hasPrefix: false };
}

/**
 * Generate split head forms for a verb with separable prefix
 * E.g., راتلل (to come) → را و تلل (perfective past split)
 */
export function generateSplitHeadForms(infinitive: string): VerbForm[] {
    const forms: VerbForm[] = [];
    const { hasPrefix, prefix, stem } = hasSeparablePrefix(infinitive);
    
    if (!hasPrefix || !prefix || !stem) {
        return forms;
    }
    
    // Generate split perfective forms
    // Pattern: PREFIX + و + STEM
    const stemBase = stem.endsWith('ل') ? stem.slice(0, -1) : stem;
    
    // Present perfective (split) conjugations
    PRESENT_ENDINGS.forEach(({ ending, label }) => {
        // Split form: را و کړم (ra + w + kRam)
        forms.push({
            form: `${prefix} و ${stemBase}${ending}`,
            label: `${label} perf split`,
            aspect: 'perfective',
            constructionType: 'simple',
        });
    });
    
    // Past perfective (split)
    forms.push({
        form: `${prefix} و ${stem}`,
        label: 'infinitive split (past)',
        aspect: 'perfective',
        constructionType: 'simple',
    });
    
    // Also add forms with به for future
    forms.push({
        form: `به ${prefix} و ${stemBase}ي`,
        label: '3rd sing fut perf split',
        tense: 'future',
        aspect: 'perfective',
        constructionType: 'simple',
    });
    
    return forms;
}

/**
 * Generate comprehensive verb forms following LingDocs grammar rules
 */
export function generateComprehensiveVerbForms(infinitive: string): VerbConjugation {
    // Step 1: Determine stems and roots
    const { imperfectiveStem, perfectiveStem, perfectiveSplit, imperfectiveRoot, perfectiveRoot, pastParticiple } =
        deriveVerbParts(infinitive);

    const allForms: VerbForm[] = [];

    // Step 2: Generate present tense forms (imperfective stem + endings)
    PRESENT_ENDINGS.forEach(({ ending, person, label }) => {
        allForms.push({
            form: imperfectiveStem + ending,
            label: `present ${label}`,
            person,
            tense: 'present',
            aspect: 'imperfective',
            mood: 'indicative',
            constructionType: 'simple',
        });
    });

    // Step 3: Generate perfective forms (join head: ووه + endings)
    PRESENT_ENDINGS.forEach(({ ending, person, label }) => {
        allForms.push({
            form: perfectiveStem + ending,
            label: `perfective ${label}`,
            person,
            tense: 'future',
            aspect: 'perfective',
            mood: 'subjunctive',
            constructionType: 'simple',
        });
    });

    // Step 4: Generate past tense forms (perfective root + endings)
    const PAST_ENDINGS = [
        { ending: 'م', person: '1st', label: '1st sing' },
        { ending: 'ې', person: '2nd', label: '2nd sing' },
        { ending: 'و', person: '3rd', label: '3rd masc sing' },
        { ending: 'ه', person: '3rd', label: '3rd fem sing' },
        { ending: 'و', person: '1st', label: '1st plur' },
        { ending: 'ئ', person: '2nd', label: '2nd plur' },
        { ending: 'ل', person: '3rd', label: '3rd plur' },
    ];

    PAST_ENDINGS.forEach(({ ending, person, label }) => {
        allForms.push({
            form: perfectiveRoot + ending,
            label: `past ${label}`,
            person,
            tense: 'past',
            aspect: 'perfective',
            mood: 'indicative',
            constructionType: 'simple',
        });
    });

    // Step 5: Generate passive constructions (infinitive + کېږي/شي)
    allForms.push({
        form: `${infinitive} کېږي`,
        label: 'passive present 3rd sing',
        person: '3rd',
        tense: 'present',
        aspect: 'imperfective',
        constructionType: 'passive',
    });

    allForms.push({
        form: `${infinitive} کېږو`,
        label: 'passive present 1st plur',
        person: '1st',
        tense: 'present',
        aspect: 'imperfective',
        constructionType: 'passive',
    });

    allForms.push({
        form: `${infinitive} شي`,
        label: 'passive subjunctive 3rd sing',
        person: '3rd',
        tense: 'future',
        aspect: 'perfective',
        constructionType: 'passive',
    });

    // Step 6: Generate perfect constructions (past participle + auxiliary)
    AUXILIARIES.yum.forEach((aux, idx) => {
        const personLabel = PRESENT_ENDINGS[idx].label;
        allForms.push({
            form: `${pastParticiple} ${aux}`,
            label: `perfect ${personLabel}`,
            person: PRESENT_ENDINGS[idx].person,
            tense: 'perfect',
            aspect: 'perfective',
            constructionType: 'perfect',
        });
    });

    // Step 7: Generate split head variations (for examples in text)
    // These might appear as "به و ... infinitive" or similar constructions
    if (perfectiveSplit) {
        allForms.push({
            form: perfectiveSplit,
            label: 'perfective split head',
            aspect: 'perfective',
            constructionType: 'simple',
        });
    }
    
    // Step 8: Generate split head forms for verbs with separable prefixes
    // (را، در، ور، etc.)
    const splitHeadForms = generateSplitHeadForms(infinitive);
    allForms.push(...splitHeadForms);

    // Step 8: Add the infinitive itself
    allForms.push({
        form: infinitive,
        label: 'infinitive',
        constructionType: 'simple',
    });

    // Step 9: Add past participle
    allForms.push({
        form: pastParticiple,
        label: 'past participle',
        constructionType: 'simple',
    });

    return {
        infinitive,
        stems: {
            imperfective: imperfectiveStem,
            perfective: perfectiveStem,
            perfectiveSplit,
        },
        roots: {
            imperfective: imperfectiveRoot,
            perfective: perfectiveRoot,
        },
        pastParticiple,
        allForms,
    };
}

/**
 * Derive verb parts from infinitive following LingDocs rules
 */
function deriveVerbParts(infinitive: string): {
    imperfectiveStem: string;
    perfectiveStem: string;
    perfectiveSplit: string;
    imperfectiveRoot: string;
    perfectiveRoot: string;
    pastParticiple: string;
} {
    // Default pattern for regular verbs ending in ل
    if (infinitive.endsWith('ل')) {
        const base = infinitive.slice(0, -1); // Remove final ل

        return {
            // Stems (for present/future)
            imperfectiveStem: base, // وه
            perfectiveStem: 'و' + base, // ووه
            perfectiveSplit: `و __ ${base}`, // Represents split: و __ وه

            // Roots (for past)
            imperfectiveRoot: infinitive, // وهل
            perfectiveRoot: 'و' + infinitive, // ووهل

            // Past participle
            pastParticiple: base + 'لی', // وهلی
        };
    }

    // Handle other verb patterns (to be expanded)
    // For now, return basic pattern
    return {
        imperfectiveStem: infinitive.slice(0, -1),
        perfectiveStem: 'و' + infinitive.slice(0, -1),
        perfectiveSplit: `و __ ${infinitive.slice(0, -1)}`,
        imperfectiveRoot: infinitive,
        perfectiveRoot: 'و' + infinitive,
        pastParticiple: infinitive.slice(0, -1) + 'لی',
    };
}

/**
 * Generate common compound forms that appear in Bible verses
 */
export function generateBibleSpecificCompounds(infinitive: string): VerbForm[] {
    const forms: VerbForm[] = [];

    // Common passive patterns found in Bible
    forms.push(
        { form: `${infinitive} کېږو`, label: 'passive 1st plur', constructionType: 'passive' },
        { form: `${infinitive} کېږي`, label: 'passive 3rd sing', constructionType: 'passive' },
        { form: `${infinitive} کېږې`, label: 'passive 2nd sing', constructionType: 'passive' },
        { form: `${infinitive} شي`, label: 'passive subjunctive', constructionType: 'passive' },
    );

    // Continuous aspect patterns
    const base = infinitive.slice(0, -1);
    forms.push(
        { form: `${infinitive} ته یم`, label: 'continuous 1st sing', constructionType: 'continuous' },
        { form: `${base}لو`, label: 'past 1st/3rd plur', constructionType: 'simple' },
    );

    return forms;
}

/**
 * Main export function for verb family expansion
 * Returns all possible forms for searching
 */
export function expandVerbForms(infinitive: string): string[] {
    const conjugation = generateComprehensiveVerbForms(infinitive);
    const bibleCompounds = generateBibleSpecificCompounds(infinitive);

    const allForms = [
        ...conjugation.allForms.map(f => f.form),
        ...bibleCompounds.map(f => f.form),
    ];

    // Deduplicate
    return Array.from(new Set(allForms));
}
