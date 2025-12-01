'use client';

import React, { useMemo } from 'react';
import type { RelatedFormVariant, MultiVerbFilterState, VerbFilterState } from '../types';

interface VerbConjugationTableProps {
  lemma: string;
  romanized?: string;
  english?: string;
  verbType?: string; // 'transitive' | 'intransitive' | 'dynamic compound' | 'stative compound'
  verbs: RelatedFormVariant[];
  filters?: MultiVerbFilterState | VerbFilterState;
  compact?: boolean;
}

// Grammatical explanations based on LingDocs grammar
const GRAMMAR_EXPLANATIONS: Record<string, { title: string; description: string; link?: string }> = {
  'present': {
    title: 'Present Tense',
    description: 'Used for habitual actions, general truths, and ongoing situations. In intransitive verbs, the verb agrees with the subject.',
    link: 'https://grammar.lingdocs.com/verbs/present-verbs/',
  },
  'past': {
    title: 'Simple Past',
    description: 'Used for completed actions in the past. With transitive verbs, the verb agrees with the object (ergative alignment).',
    link: 'https://grammar.lingdocs.com/verbs/past-verbs/',
  },
  'perfect': {
    title: 'Perfect Tense',
    description: 'Expresses completed actions with relevance to the present. Uses the past participle + auxiliary.',
    link: 'https://grammar.lingdocs.com/verbs/perfect-verbs/',
  },
  'subjunctive': {
    title: 'Subjunctive Mood',
    description: 'Used for wishes, possibilities, suggestions, and after certain conjunctions. Often follows و- prefix.',
    link: 'https://grammar.lingdocs.com/verbs/subjunctive-verbs/',
  },
  'imperative': {
    title: 'Imperative Mood',
    description: 'Used for commands and requests. Only exists for 2nd person (you).',
    link: 'https://grammar.lingdocs.com/verbs/imperative-verbs/',
  },
  'ability': {
    title: 'Ability Form',
    description: 'Expresses ability or possibility. Uses شکل + perfective root.',
    link: 'https://grammar.lingdocs.com/verbs/ability/',
  },
  'imperfective': {
    title: 'Imperfective Aspect',
    description: 'Views action as ongoing, habitual, or incomplete. Used in present tense and continuous forms.',
    link: 'https://grammar.lingdocs.com/verbs/roots-and-stems/',
  },
  'perfective': {
    title: 'Perfective Aspect',
    description: 'Views action as completed or whole. Used in simple past and subjunctive. Often marked with و- prefix.',
    link: 'https://grammar.lingdocs.com/verbs/roots-and-stems/',
  },
  '1st': {
    title: 'First Person',
    description: 'The speaker(s): I/we (زه/موږ)',
  },
  '2nd': {
    title: 'Second Person',
    description: 'The addressee(s): you (ته/تاسو)',
  },
  '3rd': {
    title: 'Third Person',
    description: 'The one(s) spoken about: he/she/it/they (هغه/هغوی)',
  },
};

// Person labels for display
const PERSON_LABELS: Record<string, { pashto: string; english: string }> = {
  '1sg': { pashto: 'زه', english: 'I' },
  '1pl': { pashto: 'موږ', english: 'we' },
  '2sg': { pashto: 'ته', english: 'you (sg)' },
  '2pl': { pashto: 'تاسو', english: 'you (pl)' },
  '3sg': { pashto: 'هغه', english: 'he/she/it' },
  '3sg_m': { pashto: 'هغه', english: 'he' },
  '3sg_f': { pashto: 'هغه', english: 'she' },
  '3pl': { pashto: 'هغوی', english: 'they' },
};

// Helper to normalize person from filters
const normalizePersonFilter = (person: string): string => {
  if (person === '1st') return '1';
  if (person === '2nd') return '2';
  if (person === '3rd') return '3';
  return person;
};

// Helper to get person number from D1 format
const getPersonNumber = (d1Person?: string): { person: string; number: 'sg' | 'pl' } | null => {
  if (!d1Person) return null;
  const match = d1Person.match(/^(\d)(sg|pl)/);
  if (!match) return null;
  return { person: match[1], number: match[2] as 'sg' | 'pl' };
};

export default function VerbConjugationTable({
  lemma,
  romanized,
  english,
  verbType,
  verbs,
  filters,
  compact = false,
}: VerbConjugationTableProps) {
  // Group verbs by tense and then by person/number
  const conjugationTable = useMemo(() => {
    const table: Record<string, Record<string, RelatedFormVariant[]>> = {};
    
    for (const verb of verbs) {
      const tense = verb.tense || 'other';
      const personInfo = getPersonNumber(verb.person);
      const key = personInfo ? `${personInfo.person}${personInfo.number}` : 'unknown';
      
      if (!table[tense]) {
        table[tense] = {};
      }
      if (!table[tense][key]) {
        table[tense][key] = [];
      }
      table[tense][key].push(verb);
    }
    
    return table;
  }, [verbs]);

  // Determine which tenses are active based on filters
  const activeTenses = useMemo(() => {
    if (!filters) return Object.keys(conjugationTable);
    
    const tenseFilters = 'tense' in filters 
      ? (Array.isArray(filters.tense) ? filters.tense : [filters.tense])
      : [];
    
    if (tenseFilters.length === 0 || tenseFilters.includes('all')) {
      return Object.keys(conjugationTable);
    }
    
    return tenseFilters.filter(t => t !== 'all' && conjugationTable[t]);
  }, [filters, conjugationTable]);

  // Determine which persons are active based on filters
  const activePersons = useMemo(() => {
    if (!filters) return ['1', '2', '3'];
    
    const personFilters = 'person' in filters
      ? (Array.isArray(filters.person) ? filters.person : [filters.person])
      : [];
    
    if (personFilters.length === 0 || personFilters.includes('all')) {
      return ['1', '2', '3'];
    }
    
    return personFilters
      .filter(p => p !== 'all')
      .map(normalizePersonFilter);
  }, [filters]);

  // Build grammatical explanation based on active filters
  const grammaticalExplanation = useMemo(() => {
    const parts: string[] = [];
    
    // Tense explanation
    if (activeTenses.length === 1) {
      const tenseInfo = GRAMMAR_EXPLANATIONS[activeTenses[0]];
      if (tenseInfo) {
        parts.push(tenseInfo.description);
      }
    }
    
    // Add transitivity note for past tense
    if (activeTenses.includes('past') && verbType?.includes('transitive')) {
      parts.push('⚠️ Note: In past tense, transitive verbs agree with the object, not the subject (ergative alignment).');
    }
    
    return parts;
  }, [activeTenses, verbType]);

  // Get matching forms for display
  const matchingForms = useMemo(() => {
    const forms: Array<{ form: string; person: string; romanized?: string; label: string }> = [];
    
    for (const tense of activeTenses) {
      const tenseTable = conjugationTable[tense];
      if (!tenseTable) continue;
      
      for (const personKey of Object.keys(tenseTable)) {
        const personNumber = getPersonNumber(personKey);
        if (!personNumber) continue;
        
        if (!activePersons.includes(personNumber.person)) continue;
        
        for (const verb of tenseTable[personKey]) {
          forms.push({
            form: verb.form,
            person: personKey,
            romanized: verb.romanized,
            label: verb.label || `${tense} ${personKey}`,
          });
        }
      }
    }
    
    return forms;
  }, [conjugationTable, activeTenses, activePersons]);

  if (verbs.length === 0) {
    return null;
  }

  // Compact mode: just show the forms in a simple list
  if (compact) {
    return (
      <div className="text-sm">
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {lemma}
          {romanized && <span className="ml-1 text-gray-500">({romanized})</span>}
        </span>
        {english && (
          <span className="ml-2 text-gray-600 dark:text-gray-400">"{english}"</span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
      {/* Header: Lemma and definition */}
      <div className="mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <a 
            href={`/lexicon?q=${encodeURIComponent(lemma)}`}
            className="text-2xl font-bold text-blue-700 dark:text-blue-400 hover:underline"
            style={{ fontFamily: 'Noto Naskh Arabic, serif' }}
          >
            {lemma}
          </a>
          {romanized && (
            <span className="text-lg text-gray-600 dark:text-gray-400 italic">
              {romanized}
            </span>
          )}
          {verbType && (
            <span className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
              {verbType}
            </span>
          )}
        </div>
        {english && (
          <p className="text-gray-700 dark:text-gray-300 mt-1">
            <span className="font-medium">Definition:</span> {english}
          </p>
        )}
      </div>

      {/* Grammatical explanation based on active filters */}
      {grammaticalExplanation.length > 0 && (
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/40 rounded-md border border-amber-200 dark:border-amber-800">
          <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-1 text-sm">
            📚 Grammar Note
          </h4>
          {grammaticalExplanation.map((note, idx) => (
            <p key={idx} className="text-sm text-amber-700 dark:text-amber-400">
              {note}
            </p>
          ))}
        </div>
      )}

      {/* Conjugation tables by tense */}
      {activeTenses.map(tense => {
        const tenseTable = conjugationTable[tense];
        if (!tenseTable) return null;

        const tenseInfo = GRAMMAR_EXPLANATIONS[tense];
        
        return (
          <div key={tense} className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-slate-700 dark:text-slate-300 capitalize">
                {tenseInfo?.title || tense}
              </h4>
              {tenseInfo?.link && (
                <a
                  href={tenseInfo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400"
                  title="Learn more on LingDocs"
                >
                  📖
                </a>
              )}
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 dark:border-slate-600">
                    <th className="text-left py-1 px-2 text-slate-600 dark:text-slate-400 font-medium">
                      Person
                    </th>
                    <th className="text-center py-1 px-2 text-slate-600 dark:text-slate-400 font-medium">
                      Singular
                    </th>
                    <th className="text-center py-1 px-2 text-slate-600 dark:text-slate-400 font-medium">
                      Plural
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activePersons.map(person => {
                    const sgKey = `${person}sg`;
                    const plKey = `${person}pl`;
                    const sgForms = tenseTable[sgKey] || [];
                    const plForms = tenseTable[plKey] || [];
                    const sgMForms = tenseTable[`${person}sg_m`] || [];
                    const sgFForms = tenseTable[`${person}sg_f`] || [];
                    
                    // Combine gender variants for display
                    const allSgForms = [...sgForms, ...sgMForms, ...sgFForms];
                    
                    if (allSgForms.length === 0 && plForms.length === 0) {
                      return null;
                    }
                    
                    const personLabel = person === '1' ? '1st' : person === '2' ? '2nd' : '3rd';
                    const personInfo = GRAMMAR_EXPLANATIONS[`${personLabel}`];
                    
                    return (
                      <tr key={person} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                        <td className="py-2 px-2 text-slate-600 dark:text-slate-400">
                          <span className="font-medium">{personLabel}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-500 ml-1">
                            ({PERSON_LABELS[`${person}sg`]?.english || ''}/{PERSON_LABELS[`${person}pl`]?.english || ''})
                          </span>
                        </td>
                        <td className="py-2 px-2 text-center">
                          {allSgForms.length > 0 ? (
                            <div className="flex flex-col items-center gap-1">
                              {allSgForms.map((f, idx) => (
                                <div key={idx} className="flex flex-col items-center">
                                  <span 
                                    className="text-lg text-blue-700 dark:text-blue-300 font-semibold"
                                    style={{ fontFamily: 'Noto Naskh Arabic, serif' }}
                                  >
                                    {f.form}
                                  </span>
                                  {f.romanized && (
                                    <span className="text-xs text-slate-500 dark:text-slate-500 italic">
                                      {f.romanized}
                                    </span>
                                  )}
                                  {(f.gender || f.person?.includes('_m') || f.person?.includes('_f')) && (
                                    <span className="text-xs text-purple-600 dark:text-purple-400">
                                      {f.gender || (f.person?.includes('_m') ? 'm.' : f.person?.includes('_f') ? 'f.' : '')}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600">—</span>
                          )}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {plForms.length > 0 ? (
                            <div className="flex flex-col items-center gap-1">
                              {plForms.map((f, idx) => (
                                <div key={idx} className="flex flex-col items-center">
                                  <span 
                                    className="text-lg text-blue-700 dark:text-blue-300 font-semibold"
                                    style={{ fontFamily: 'Noto Naskh Arabic, serif' }}
                                  >
                                    {f.form}
                                  </span>
                                  {f.romanized && (
                                    <span className="text-xs text-slate-500 dark:text-slate-500 italic">
                                      {f.romanized}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* Summary of forms being searched */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-500">
          Searching with <strong>{matchingForms.length}</strong> verb form{matchingForms.length !== 1 ? 's' : ''}:
          <span className="ml-2">
            {matchingForms.slice(0, 6).map((f, idx) => (
              <span key={idx} className="inline-block mx-1 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 rounded text-blue-700 dark:text-blue-300" style={{ fontFamily: 'Noto Naskh Arabic, serif' }}>
                {f.form}
              </span>
            ))}
            {matchingForms.length > 6 && (
              <span className="text-slate-400">+{matchingForms.length - 6} more</span>
            )}
          </span>
        </p>
      </div>
    </div>
  );
}

