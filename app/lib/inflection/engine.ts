// Main rule engine that orchestrates form generation based on pattern families
// Uses the rule modules and stem data to generate complete conjugations

import {
  generateStativeStandard,
  generateStativeShul,
  generateStativeKedul,
  generateSplitStem,
  generateSuppletive,
  generateTransport,
  generateDynamic,
  type Person,
  type Stems
} from './rules';

export type Family =
  | 'regular_simple'
  | 'split_stem'
  | 'suppletive'
  | 'transport'
  | 'dynamic_compound'
  | 'stative_compound_standard'
  | 'stative_compound_special'
  | 'modal'
  | 'irregular_one_off';

export interface LemmaData {
  pashto: string;
  family: Family;
  stems?: Stems;
  helper?: string;  // for compounds
  compoundType?: 'dynamic' | 'stative';
}

// LingDocs-inspired structured output (person × gender × length)
export type Gender = 'masc' | 'fem';
export type Length = 'long' | 'short';

export interface StructuredForms {
  // person → gender → length → form
  present: Record<Person, Record<Gender, Record<Length, string>>>;
  past: Record<Person, Record<Gender, Record<Length, string>>>;
  subjunctive: Record<Person, Record<Gender, Record<Length, string>>>;
  imperative: Record<Person, Record<Gender, Record<Length, string>>>;
  pastParticiple: Record<Gender, Record<Length, string>>;
  allPersons: Person[];
  allGenders: Gender[];
  allLengths: Length[];
}

export interface GeneratedForms {
  present: Record<Person, string>;
  past: Record<Person, string>;
  subjunctive: Record<Person, string>;
  imperative: Record<Person, string>;
  pastParticiple: string;
  allPersons: Person[];
}

// Generate complete conjugation for any lemma
export function generateForms(lemma: LemmaData): GeneratedForms {
  const allPersons: Person[] = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'];

  // Initialize empty forms
  const forms: GeneratedForms = {
    present: {} as Record<Person, string>,
    past: {} as Record<Person, string>,
    subjunctive: {} as Record<Person, string>,
    imperative: {} as Record<Person, string>,
    pastParticiple: '',
    allPersons
  };

  switch (lemma.family) {
    case 'stative_compound_standard':
      if (lemma.stems?.present) {
        const generator = generateStativeStandard(lemma.stems.present);
        forms.present = {
          '1sg': generator.present('1sg'),
          '2sg': generator.present('2sg'),
          '3sg': generator.present('3sg'),
          '1pl': generator.present('1pl'),
          '2pl': generator.present('2pl'),
          '3pl': generator.present('3pl')
        };
        forms.past = {
          '1sg': generator.past('1sg'),
          '2sg': generator.past('2sg'),
          '3sg': generator.past('3sg'),
          '1pl': generator.past('1pl'),
          '2pl': generator.past('2pl'),
          '3pl': generator.past('3pl')
        };
        forms.subjunctive = {
          '1sg': generator.subjunctive('1sg'),
          '2sg': generator.subjunctive('2sg'),
          '3sg': generator.subjunctive('3sg'),
          '1pl': generator.subjunctive('1pl'),
          '2pl': generator.subjunctive('2pl'),
          '3pl': generator.subjunctive('3pl')
        };
        forms.imperative = {
          '1sg': '',
          '2sg': generator.imperative('2sg'),
          '3sg': '',
          '1pl': '',
          '2pl': generator.imperative('2pl'),
          '3pl': ''
        };
        forms.pastParticiple = generator.pp;
      }
      break;

    case 'stative_compound_special':
      if (lemma.helper === 'شول' && lemma.stems?.present) {
        const generator = generateStativeShul(lemma.stems.present);
        forms.past = {
          '1sg': generator.past('1sg'),
          '2sg': generator.past('2sg'),
          '3sg': generator.past('3sg'),
          '1pl': generator.past('1pl'),
          '2pl': generator.past('2pl'),
          '3pl': generator.past('3pl')
        };
        forms.subjunctive = {
          '1sg': generator.subjunctive('1sg'),
          '2sg': generator.subjunctive('2sg'),
          '3sg': generator.subjunctive('3sg'),
          '1pl': generator.subjunctive('1pl'),
          '2pl': generator.subjunctive('2pl'),
          '3pl': generator.subjunctive('3pl')
        };
        forms.pastParticiple = generator.pp;
      } else if (lemma.helper === 'کېدل' && lemma.stems?.present) {
        const generator = generateStativeKedul(lemma.stems.present);
        forms.present = {
          '1sg': generator.present('1sg'),
          '2sg': generator.present('2sg'),
          '3sg': generator.present('3sg'),
          '1pl': generator.present('1pl'),
          '2pl': generator.present('2pl'),
          '3pl': generator.present('3pl')
        };
        forms.past = {
          '1sg': generator.past('1sg'),
          '2sg': generator.past('2sg'),
          '3sg': generator.past('3sg'),
          '1pl': generator.past('1pl'),
          '2pl': generator.past('2pl'),
          '3pl': generator.past('3pl')
        };
        forms.subjunctive = {
          '1sg': generator.subjunctive('1sg'),
          '2sg': generator.subjunctive('2sg'),
          '3sg': generator.subjunctive('3sg'),
          '1pl': generator.subjunctive('1pl'),
          '2pl': generator.subjunctive('2pl'),
          '3pl': generator.subjunctive('3pl')
        };
        forms.pastParticiple = generator.pp;
      }
      break;

    case 'split_stem':
      if (lemma.stems?.present && lemma.stems?.perfective && lemma.stems?.past_participle) {
        const generator = generateSplitStem(lemma.stems.present, lemma.stems.perfective, lemma.stems.past_participle);
        forms.present = {
          '1sg': generator.present('1sg'),
          '2sg': generator.present('2sg'),
          '3sg': generator.present('3sg'),
          '1pl': generator.present('1pl'),
          '2pl': generator.present('2pl'),
          '3pl': generator.present('3pl')
        };
        forms.past = {
          '1sg': generator.past('1sg'),
          '2sg': generator.past('2sg'),
          '3sg': generator.past('3sg'),
          '1pl': generator.past('1pl'),
          '2pl': generator.past('2pl'),
          '3pl': generator.past('3pl')
        };
        forms.subjunctive = {
          '1sg': generator.subjunctive('1sg'),
          '2sg': generator.subjunctive('2sg'),
          '3sg': generator.subjunctive('3sg'),
          '1pl': generator.subjunctive('1pl'),
          '2pl': generator.subjunctive('2pl'),
          '3pl': generator.subjunctive('3pl')
        };
        forms.imperative = {
          '1sg': '',
          '2sg': generator.imperative('2sg'),
          '3sg': '',
          '1pl': '',
          '2pl': generator.imperative('2pl'),
          '3pl': ''
        };
        forms.pastParticiple = generator.pp;
      }
      break;

    case 'suppletive':
      if (lemma.stems?.present && lemma.stems?.perfective && lemma.stems?.past_participle) {
        const generator = generateSuppletive(lemma.stems.present, lemma.stems.perfective, lemma.stems.past_participle);
        forms.present = {
          '1sg': generator.present('1sg'),
          '2sg': generator.present('2sg'),
          '3sg': generator.present('3sg'),
          '1pl': generator.present('1pl'),
          '2pl': generator.present('2pl'),
          '3pl': generator.present('3pl')
        };
        forms.past = {
          '1sg': generator.past('1sg'),
          '2sg': generator.past('2sg'),
          '3sg': generator.past('3sg'),
          '1pl': generator.past('1pl'),
          '2pl': generator.past('2pl'),
          '3pl': generator.past('3pl')
        };
        forms.subjunctive = {
          '1sg': generator.subjunctive('1sg'),
          '2sg': generator.subjunctive('2sg'),
          '3sg': generator.subjunctive('3sg'),
          '1pl': generator.subjunctive('1pl'),
          '2pl': generator.subjunctive('2pl'),
          '3pl': generator.subjunctive('3pl')
        };
        forms.imperative = {
          '1sg': '',
          '2sg': generator.imperative('2sg'),
          '3sg': '',
          '1pl': '',
          '2pl': generator.imperative('2pl'),
          '3pl': ''
        };
        forms.pastParticiple = generator.pp;
      }
      break;

    case 'transport':
      if (lemma.stems?.present && lemma.stems?.perfective && lemma.stems?.past_participle) {
        const generator = generateTransport(lemma.stems.present, lemma.stems.perfective, lemma.stems.past_participle);
        forms.present = {
          '1sg': generator.present('1sg'),
          '2sg': generator.present('2sg'),
          '3sg': generator.present('3sg'),
          '1pl': generator.present('1pl'),
          '2pl': generator.present('2pl'),
          '3pl': generator.present('3pl')
        };
        forms.past = {
          '1sg': generator.past('1sg'),
          '2sg': generator.past('2sg'),
          '3sg': generator.past('3sg'),
          '1pl': generator.past('1pl'),
          '2pl': generator.past('2pl'),
          '3pl': generator.past('3pl')
        };
        forms.subjunctive = {
          '1sg': generator.subjunctive('1sg'),
          '2sg': generator.subjunctive('2sg'),
          '3sg': generator.subjunctive('3sg'),
          '1pl': generator.subjunctive('1pl'),
          '2pl': generator.subjunctive('2pl'),
          '3pl': generator.subjunctive('3pl')
        };
        forms.imperative = {
          '1sg': '',
          '2sg': generator.imperative('2sg'),
          '3sg': '',
          '1pl': '',
          '2pl': generator.imperative('2pl'),
          '3pl': ''
        };
        forms.pastParticiple = generator.pp;
      }
      break;

    case 'dynamic_compound':
      if (lemma.helper && lemma.stems?.present) {
        const generator = generateDynamic(lemma.pashto.split(' ')[0], lemma.stems.present);
        forms.present = {
          '1sg': generator.present('1sg'),
          '2sg': generator.present('2sg'),
          '3sg': generator.present('3sg'),
          '1pl': generator.present('1pl'),
          '2pl': generator.present('2pl'),
          '3pl': generator.present('3pl')
        };
      }
      break;

    case 'regular_simple':
      // For regular verbs, we'd need to implement pattern-based generation
      // For now, return empty forms - this would be implemented later
      break;

    case 'irregular_one_off':
      // These are handled by the irregular overrides table
      // For now, return empty forms
      break;

    default:
      // Unknown family - return empty forms
      break;
  }

  return forms;
}

// Generate structured forms (LingDocs-inspired person × gender × length)
export function generateStructuredForms(lemma: LemmaData): StructuredForms {
  const allPersons: Person[] = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'];
  const allGenders: Gender[] = ['masc', 'fem'];
  const allLengths: Length[] = ['long', 'short'];

  // Initialize empty structured forms
  const forms: StructuredForms = {
    present: {} as Record<Person, Record<Gender, Record<Length, string>>>,
    past: {} as Record<Person, Record<Gender, Record<Length, string>>>,
    subjunctive: {} as Record<Person, Record<Gender, Record<Length, string>>>,
    imperative: {} as Record<Person, Record<Gender, Record<Length, string>>>,
    pastParticiple: {} as Record<Gender, Record<Length, string>>,
    allPersons,
    allGenders,
    allLengths
  };

  // Initialize nested structures
  for (const person of allPersons) {
    forms.present[person] = { masc: { long: '', short: '' }, fem: { long: '', short: '' } };
    forms.past[person] = { masc: { long: '', short: '' }, fem: { long: '', short: '' } };
    forms.subjunctive[person] = { masc: { long: '', short: '' }, fem: { long: '', short: '' } };
    forms.imperative[person] = { masc: { long: '', short: '' }, fem: { long: '', short: '' } };
  }
  forms.pastParticiple = { masc: { long: '', short: '' }, fem: { long: '', short: '' } };

  // Generate forms based on family (simplified for now)
  switch (lemma.family) {
    case 'stative_compound_standard':
      if (lemma.stems?.present) {
        const stem = lemma.stems.present;
        for (const person of allPersons) {
          for (const gender of allGenders) {
            for (const length of allLengths) {
              // Simplified: use same form for both genders/lengths for now
              const form = generateStativeStandardForm(stem, person, 'present');
              forms.present[person][gender][length] = form;
              forms.subjunctive[person][gender][length] = `و${form}`;
            }
          }
        }
        // Add past and perfective forms
        for (const person of allPersons) {
          for (const gender of allGenders) {
            for (const length of allLengths) {
              const pastForm = generateStativeStandardForm(stem, person, 'past');
              forms.past[person][gender][length] = pastForm;
            }
          }
        }
        // Past participle
        const pp = `${stem}ېدلی`;
        for (const gender of allGenders) {
          for (const length of allLengths) {
            forms.pastParticiple[gender][length] = pp;
          }
        }
      }
      break;

    // Add other family cases here...
    default:
      // For now, use simple fallback
      break;
  }

  return forms;
}

// Helper function for stative standard forms
function generateStativeStandardForm(stem: string, person: Person, tense: 'present' | 'past'): string {
  const presentEndings: Record<Person, string> = {
    '1sg': 'ېږم', '2sg': 'ېږې', '3sg': 'ېږي',
    '1pl': 'ېږو', '2pl': 'ېږئ', '3pl': 'ېږي'
  };

  const pastEndings: Record<Person, string> = {
    '1sg': 'م', '2sg': 'ې', '3sg': '',
    '1pl': 'و', '2pl': 'ئ', '3pl': ''
  };

  if (tense === 'present') {
    return `${stem}ېږ${presentEndings[person]}`;
  } else {
    return `${stem}${pastEndings[person]}`;
  }
}

// Helper to flatten forms into a simple array for UI consumption
export function flattenForms(generated: GeneratedForms): string[] {
  const forms: string[] = [];

  // Add all present forms
  Object.values(generated.present).forEach(form => {
    if (form) forms.push(form);
  });

  // Add all past forms
  Object.values(generated.past).forEach(form => {
    if (form) forms.push(form);
  });

  // Add all subjunctive forms
  Object.values(generated.subjunctive).forEach(form => {
    if (form) forms.push(form);
  });

  // Add imperative forms
  Object.values(generated.imperative).forEach(form => {
    if (form) forms.push(form);
  });

  // Add past participle
  if (generated.pastParticiple) forms.push(generated.pastParticiple);

  return [...new Set(forms)]; // Remove duplicates
}

// Helper to flatten structured forms for UI
export function flattenStructuredForms(structured: StructuredForms): string[] {
  const forms: string[] = [];

  for (const person of structured.allPersons) {
    for (const gender of structured.allGenders) {
      for (const length of structured.allLengths) {
        const form = structured.present[person]?.[gender]?.[length];
        if (form) forms.push(form);
      }
    }
  }

  return [...new Set(forms)];
}
