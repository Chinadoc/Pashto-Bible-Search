// LingDocs-aligned rule modules (stateless) for verb inflection
// No I/O; pure functions only. The caller provides stems and features.

export type Person = '1sg'|'2sg'|'3sg'|'1pl'|'2pl'|'3pl';
export type Tense = 'present'|'past'|'subjunctive'|'imperative'|'perfect';
export type Aspect = 'imperfective'|'perfective'|'none';

export interface Features {
  person: Person;
  tense: Tense;
  aspect: Aspect;
}

export interface Stems {
  present?: string;        // e.g., STEM + ېږ for stative
  perfective?: string;     // e.g., STEM + ش
  pastParticiple?: string; // STEM + ېدلی / irregular
}

// Verb endings (present) per LingDocs verb-endings overview
// https://grammar.lingdocs.com/verbs/verb-endings/
export const PRESENT_ENDINGS: Record<Person, string> = {
  '1sg': 'م',
  '2sg': 'ې',
  '3sg': 'ي',
  '1pl': 'و',
  '2pl': 'ئ',
  '3pl': 'ي',
};

export const PAST_ENDINGS: Record<Person, string> = {
  '1sg': 'م',
  '2sg': 'ې',
  '3sg': '',
  '1pl': 'و',
  '2pl': 'ئ',
  '3pl': '',
};

// Standard stative compound rule (STEM + ېدل)
// Based on LingDocs بکېدل analysis: imperfective STEM+ېږ-, perfective STEM+ش-, pp STEM+ېدلی
export function generateStativeStandard(stem: string) {
  const presentBase = `${stem}ېږ`;
  const perfectiveBase = `${stem}ش`; // LingDocs shows "buk sh-" for perfective
  const pp = `${stem}ېدلی`;

  function present(person: Person) {
    return presentBase + PRESENT_ENDINGS[person];
  }
  function past(person: Person) {
    return perfectiveBase + PAST_ENDINGS[person];
  }
  function subjunctive(person: Person) {
    return `و${presentBase}${PRESENT_ENDINGS[person]}`;
  }
  function imperative(person: Person) {
    if (person === '2sg') return `${presentBase}ه`;
    if (person === '2pl') return `${presentBase}ئ`;
    return '';
  }

  return { present, past, subjunctive, imperative, pp };
}

// Special-helper stative with شول (خوب شول pattern)
export function generateStativeShul(base: string) {
  function past(person: Person) {
    switch (person) {
      case '1sg': return `${base} شوم`;
      case '2sg': return `${base} شوې`;
      case '3sg': return `${base} شو`;
      case '1pl': return `${base} شوو`;
      case '2pl': return `${base} شوئ`;
      case '3pl': return `${base} شول`;
    }
  }
  function subjunctive(person: Person) {
    switch (person) {
      case '1sg': return `و${base} شوم`;
      case '2sg': return `و${base} شوې`;
      case '3sg': return `و${base} شو`;
      case '1pl': return `و${base} شوو`;
      case '2pl': return `و${base} شوئ`;
      case '3pl': return `و${base} شول`;
    }
  }
  const pp = `${base} شوی`;
  return { past, subjunctive, pp };
}

// Special-helper stative with کېدل (تازه کېدل، غوره کېدل pattern)
export function generateStativeKedul(base: string) {
  function present(person: Person) {
    const baseWithKe = `${base}کېږ`;
    return baseWithKe + PRESENT_ENDINGS[person];
  }
  function past(person: Person) {
    const baseWithK = `${base}ک`;
    return baseWithK + PAST_ENDINGS[person];
  }
  function subjunctive(person: Person) {
    return `و${present(person)}`;
  }
  const pp = `${base}کېدلی`;
  return { present, past, subjunctive, pp };
}

// Split-stem verbs (لیدل → وین-/ووین-)
export function generateSplitStem(presentStem: string, perfectiveStem: string, pastParticiple: string) {
  function present(person: Person) {
    return presentStem + PRESENT_ENDINGS[person];
  }
  function past(person: Person) {
    return perfectiveStem + PAST_ENDINGS[person];
  }
  function subjunctive(person: Person) {
    return `و${present(person)}`;
  }
  function imperative(person: Person) {
    if (person === '2sg') return `${presentStem}ه`;
    if (person === '2pl') return `${presentStem}ئ`;
    return '';
  }
  return { present, past, subjunctive, imperative, pp: pastParticiple };
}

// Suppletive verbs (کېدل، تلل، کول)
export function generateSuppletive(presentStem: string, perfectiveStem: string, pastParticiple: string) {
  function present(person: Person) {
    return presentStem + PRESENT_ENDINGS[person];
  }
  function past(person: Person) {
    return perfectiveStem + PAST_ENDINGS[person];
  }
  function subjunctive(person: Person) {
    return `و${present(person)}`;
  }
  function imperative(person: Person) {
    if (person === '2sg') return `${presentStem}ه`;
    if (person === '2pl') return `${presentStem}ئ`;
    return '';
  }
  return { present, past, subjunctive, imperative, pp: pastParticiple };
}

// Transport verbs (وړل، بوتلل)
export function generateTransport(presentStem: string, perfectiveStem: string, pastParticiple: string) {
  function present(person: Person) {
    return presentStem + PRESENT_ENDINGS[person];
  }
  function past(person: Person) {
    return perfectiveStem + PAST_ENDINGS[person];
  }
  function subjunctive(person: Person) {
    return `و${present(person)}`;
  }
  function imperative(person: Person) {
    if (person === '2sg') return `${presentStem}ه`;
    if (person === '2pl') return `${presentStem}ئ`;
    return '';
  }
  return { present, past, subjunctive, imperative, pp: pastParticiple };
}

// Dynamic compound: prefix + conjugated helper (simplified helper present)
export function generateDynamic(prefix: string, helperPresentStem: string) {
  function present(person: Person) {
    return `${prefix} ${helperPresentStem}${PRESENT_ENDINGS[person]}`;
  }
  return { present };
}


