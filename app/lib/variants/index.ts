import 'server-only';
import { getData } from '../data/load';
import { normalizeQuery, containsPashto } from '../normalize';

export type Variant = {
  form: string;
  label: string;
  pos: 'noun' | 'verb' | 'adjective' | 'other';
  count?: number;
  romanized?: string;
  score?: number;
};

export type VariantGroup = { key: string; label: string; items: Variant[] };
export type VariantDetails = Array<{ type: string; description?: string; count: number; groups?: VariantGroup[] }>;

export type RelatedFormsPayload = {
  root: string;
  total: number;
  forms: Array<{ form: string; count?: number; label?: string; pos?: string; romanized?: string }>;
  variantDetails?: VariantDetails;
  variantsFlat: string[];
  posGuess?: string;
};

type CollectOptions = {
  includeRelated?: boolean;
};

const HELPER_VERBS = new Set(['کول', 'کېدل', 'وهل', 'خوړل', 'ساتل']);

export async function collectRelatedForms(term: string, options: CollectOptions = {}): Promise<RelatedFormsPayload> {
  const input = term.trim();
  const normalised = containsPashto(input)
    ? { normalized: input, usedDictionary: false }
    : await normalizeQuery(input);

  const root = normalised.normalized || input;
  const { dictionaryByPashto, inflectionsByBase, formsByRoot, occurrenceMap } = await getData();

  const variantsMap = new Map<string, Variant>();

  const addVariant = (variant: Variant) => {
    const key = variant.form.trim();
    if (!key) return;

    const existing = variantsMap.get(key);
    if (existing) {
      existing.count = Math.max(existing.count ?? 0, variant.count ?? 0);
      existing.score = Math.max(existing.score ?? 0, variant.score ?? 0);
      if (!existing.romanized && variant.romanized) existing.romanized = variant.romanized;
      return;
    }

    variantsMap.set(key, variant);
  };

  const dictionaryEntry = dictionaryByPashto.get(root);
  const posGuess = dictionaryEntry?.pos?.toLowerCase();

  const addCountAndRoman = (form: string, pos: Variant['pos'], label: string): Variant => {
    const occurrence = occurrenceMap.get(form);
    const match = dictionaryByPashto.get(form);
    return {
      form,
      pos,
      label,
      romanized: match?.romanized,
      count: occurrence?.count,
      score: occurrence?.count,
    };
  };

  const verbInflections = inflectionsByBase.get(root) ?? [];
  const rootForms = formsByRoot.get(root) ?? [];

  if (!variantsMap.has(root)) {
    const defaultPos: Variant['pos'] = posGuess?.startsWith('v') ? 'verb' : posGuess?.startsWith('n') ? 'noun' : 'other';
    addVariant(addCountAndRoman(root, defaultPos, defaultPos === 'verb' ? 'Infinitive' : 'Root'));
  }

  if (!options.includeRelated) {
    const variantsFlat = Array.from(variantsMap.keys());
    return {
      root,
      total: variantsFlat.length,
      forms: variantsFlat.map((form) => ({ form })),
      variantsFlat,
      posGuess,
    };
  }

  if (verbInflections.length) {
    for (const inflection of verbInflections) {
      addVariant({
        ...addCountAndRoman(inflection.form, 'verb', 'Verb Form'),
        romanized: inflection.romanization,
      });
    }
  }

  if (rootForms.length) {
    for (const related of rootForms) {
      addVariant(addCountAndRoman(related, 'noun', 'Related Form'));
    }
  }

  // If we still have few variants and the root looks like a verb, include helper compounds conservatively
  if ((posGuess?.startsWith('v') || verbInflections.length > 0) && !HELPER_VERBS.has(root)) {
    const helpers = ['کول', 'کېدل'];
    for (const helper of helpers) {
      addVariant(addCountAndRoman(`${root} ${helper}`, 'verb', 'Compound'));
    }
  }

  const variants = Array.from(variantsMap.values());
  variants.sort((a, b) => (b.count ?? 0) - (a.count ?? 0));

  const forms = variants.map((variant) => ({
    form: variant.form,
    count: variant.count,
    label: variant.label,
    pos: variant.pos,
    romanized: variant.romanized,
  }));

  const nouns = variants.filter((variant) => variant.pos === 'noun');
  const verbs = variants.filter((variant) => variant.pos === 'verb');
  const others = variants.filter((variant) => variant.pos === 'other' || (variant.pos !== 'noun' && variant.pos !== 'verb'));

  const variantDetails: VariantDetails = [];
  if (nouns.length) {
    variantDetails.push({
      type: 'noun',
      count: nouns.length,
      groups: [{ key: 'n-core', label: 'Noun Forms', items: nouns }],
    });
  }

  if (verbs.length) {
    variantDetails.push({
      type: 'verb',
      count: verbs.length,
      groups: [{ key: 'v-core', label: 'Verb Forms', items: verbs }],
    });
  }

  if (others.length) {
    variantDetails.push({
      type: 'other',
      count: others.length,
      groups: [{ key: 'o-core', label: 'Other Forms', items: others }],
    });
  }

  const variantsFlat = variants.map((variant) => variant.form);

  return {
    root,
    total: variants.length,
    forms,
    variantDetails: variantDetails.length ? variantDetails : undefined,
    variantsFlat,
    posGuess,
  };
}
