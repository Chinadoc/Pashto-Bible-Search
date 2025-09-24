export type VerbFeatures = {
  mood?: 'present'|'subjunctive'|'future'|'past'|'perfect'|'imperative'|'ability'|'habitual';
  person?: '1'|'2'|'3';
  number?: 'sg'|'pl'|'any';
};

export function normalizeLabel(label: string): VerbFeatures['mood'] {
  const L = label.toLowerCase();
  if (L.includes('subjunctive')) return 'subjunctive';
  if (L.includes('present'))     return 'present';
  if (L.includes('future'))      return 'future';
  if (L.includes('past participle')) return 'perfect';
  if (L.includes('past'))        return 'past';
  if (L.includes('imperative'))  return 'imperative';
  if (L.includes('ability'))     return 'ability';
  if (L.includes('habitual'))    return 'habitual';
  return undefined;
}

export function matchesVerb(v: {label?: string; flags?: string[]}, sel: VerbFeatures) {
  const mood = normalizeLabel(v.label ?? '');
  if (sel.mood && mood && sel.mood !== mood) return false;
  // If you encode person/number in labels later, add tests here.
  return true;
}
