
import type {
    RelatedFormVariant,
    VerbFilterState,
    VerbFilterPerson,
    VerbFilterTense,
    VerbFilterAspect,
    VerbFilterMood,
} from "../../types";

export const PERSON_PATTERNS: Record<VerbFilterPerson, string[]> = {
    all: [],
    '1st': ['1sg', '1 pl', '1pl', '1st', 'first', 'i', 'we'],
    '2nd': ['2sg', '2 pl', '2pl', '2nd', 'second', 'you'],
    '3rd': ['3sg', '3 pl', '3pl', '3rd', 'third', 'he', 'she', 'they'],
};

export const TENSE_MATCHERS: Record<VerbFilterTense, (label: string) => boolean> = {
    all: () => true,
    present: (l) => l.toLowerCase().includes('present'),
    past: (l) => l.toLowerCase().includes('past') && !l.toLowerCase().includes('participle') && !l.toLowerCase().includes('perfect'),
    future: (l) => l.toLowerCase().includes('future'),
    perfect: (l) => l.toLowerCase().includes('perfect') || l.toLowerCase().includes('participle'),
    subjunctive: (l) => l.toLowerCase().includes('subj'),
    imperative: (l) => l.toLowerCase().includes('imperativ'),
    ability: (l) => l.toLowerCase().includes('ability') || l.toLowerCase().includes('able') || l.toLowerCase().includes('can'),
    habitual: (l) => l.toLowerCase().includes('habit'),
};

export const MOOD_MATCHERS: Record<VerbFilterMood, (label: string) => boolean> = {
    all: () => true,
    indicative: (l) => !l.toLowerCase().includes('subj') && !l.toLowerCase().includes('imperativ') && !l.toLowerCase().includes('ability'),
    subjunctive: (l) => l.toLowerCase().includes('subj'),
    imperative: (l) => l.toLowerCase().includes('imperativ'),
    ability: (l) => l.toLowerCase().includes('ability') || l.toLowerCase().includes('able') || l.toLowerCase().includes('can') || l.toLowerCase().includes('ش') || l.toLowerCase().includes('sh') || l.includes('ش'),
};

export const ASPECT_MATCHERS: Record<VerbFilterAspect, (label: string) => boolean> = {
    all: () => true,
    imperfective: (l) =>
        l.toLowerCase().includes('present') ||
        l.toLowerCase().includes('future') ||
        l.toLowerCase().includes('progressive') ||
        l.toLowerCase().includes('habit') ||
        l.toLowerCase().includes('subj') ||
        l.toLowerCase().includes('ability'),
    perfective: (l) => l.toLowerCase().includes('past') || l.toLowerCase().includes('perfect') || l.toLowerCase().includes('participle') || l.toLowerCase().includes('subj'),
};

export function normalizeLabel(label?: string): string {
    return (label || '').toLowerCase();
}

export function matchesPerson(label: string, person: VerbFilterPerson): boolean {
    if (person === 'all') return true;
    const patterns = PERSON_PATTERNS[person];
    if (!patterns?.length) return true;
    return patterns.some((pattern) => label.toLowerCase().includes(pattern.toLowerCase()));
}

export function matchesTense(label: string, tense: VerbFilterTense): boolean {
    const matcher = TENSE_MATCHERS[tense];
    return matcher ? matcher(label) : true;
}

export function matchesMood(label: string, mood: VerbFilterMood): boolean {
    const matcher = MOOD_MATCHERS[mood];
    return matcher ? matcher(label) : true;
}

export function matchesAspect(label: string, aspect: VerbFilterAspect): boolean {
    const matcher = ASPECT_MATCHERS[aspect];
    return matcher ? matcher(label) : true;
}

export function filterVerbVariants(
    verbs: RelatedFormVariant[] | undefined,
    filters: VerbFilterState
): RelatedFormVariant[] {
    if (!verbs?.length) return [];
    const labelFilter = (variant: RelatedFormVariant) => {
        const label = normalizeLabel(variant.label);
        const personMatch = matchesPerson(label, filters.person);
        const tenseMatch = matchesTense(label, filters.tense);
        const moodMatch = matchesMood(label, filters.mood);
        const aspectMatch = matchesAspect(label, filters.aspect);

        // console.log(`Filtering variant: "${variant.form}" label: "${variant.label}" (${label})`);
        // console.log(`  Person match (${filters.person}): ${personMatch}`);
        // console.log(`  Tense match (${filters.tense}): ${tenseMatch}`);
        // console.log(`  Mood match (${filters.mood}): ${moodMatch}`);
        // console.log(`  Aspect match (${filters.aspect}): ${aspectMatch}`);

        return personMatch && tenseMatch && moodMatch && aspectMatch;
    };

    const filtered = verbs.filter(labelFilter);
    // console.log(`Filtered ${verbs.length} verb variants down to ${filtered.length} for filters:`, filters);
    return filtered;
}
