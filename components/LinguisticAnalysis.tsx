"use client";

import { useState, useEffect } from 'react';
// Using simple text symbols instead of heroicons for now

interface LinguisticAnalysisProps {
  word: string;
  onRelatedWordClick?: (word: string) => void;
}

interface VerbCategory {
  type: 'irregular_verb' | 'regular_verb' | 'compound_irregular_verb' | 'compound_regular_verb';
  part_of_speech: 'verb';
  transitivity: string;
  compound_info?: {
    full_phrase: string;
    noun_part: string;
    auxiliary_verb: string;
    compound_type: string;
  };
  stems: {
    imperfective: string;
    perfective: string;
  };
  roots: {
    imperfective: string;
    perfective: string;
  };
  past_participle: string;
  romanization: any;
  conjugations: any;
  irregularity_type?: string;
  aspect?: string;
}

interface NounCategory {
  type: 'noun';
  part_of_speech: 'noun';
  gender: string;
  pattern: string;
  pattern_info: string;
  plural_forms: string[];
  inflection_type: string;
}

interface AnalysisData {
  word: string;
  categories: (VerbCategory | NounCategory)[];
  definition?: {
    english: string;
    romanized: string;
    pos: string;
    gender: string;
  };
  related_forms?: string[];
  frequency?: {
    count: number;
    rank: number;
    testament: string;
  };
}

export default function LinguisticAnalysis({ word, onRelatedWordClick }: LinguisticAnalysisProps) {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['definition']));

  useEffect(() => {
    if (word && word.trim()) {
      fetchAnalysis(word.trim());
    }
  }, [word]);

  const fetchAnalysis = async (searchWord: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/word-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: searchWord })
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data.analysis);
      }
    } catch (error) {
      console.error('Analysis fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // ✅ Early returns only after all hooks are declared
  if (!word) return null;
  if (loading) return <div className="p-4 text-center">Loading linguistic analysis...</div>;
  if (!analysis) return null;

  const verbCategory = analysis.categories.find(c => 
    c.type === 'irregular_verb' || 
    c.type === 'regular_verb' || 
    c.type === 'compound_irregular_verb' || 
    c.type === 'compound_regular_verb'
  ) as VerbCategory | undefined;
  const nounCategory = analysis.categories.find(c => c.type === 'noun') as NounCategory | undefined;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b pb-2">
        {analysis.word}
        {analysis.definition?.romanized && (
          <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
            - {analysis.definition.romanized}
          </span>
        )}
      </div>

      {/* Definition */}
      {analysis.definition && (
        <div className="space-y-2">
          <button 
            onClick={() => toggleSection('definition')}
            className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100"
          >
            {expandedSections.has('definition') ? '▲' : '▼'}
            Definition
          </button>
          {expandedSections.has('definition') && (
            <div className="pl-6 space-y-1">
              <div className="text-gray-800 dark:text-gray-200">{analysis.definition.english}</div>
              {analysis.definition.pos && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Part of Speech: {analysis.definition.pos}
                  {analysis.definition.gender && ` • Gender: ${analysis.definition.gender}`}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Compound Verb Information */}
      {verbCategory?.compound_info && (
        <div className="space-y-2">
          <button 
            onClick={() => toggleSection('compound')}
            className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100"
          >
            {expandedSections.has('compound') ? '▲' : '▼'}
            Compound Structure
          </button>
          {expandedSections.has('compound') && (
            <div className="pl-6 space-y-2 text-sm">
              <div className="font-medium text-gray-700 dark:text-gray-300">{verbCategory.compound_info.compound_type}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Noun Part (Object)</div>
                  <div className="text-lg font-mono">{verbCategory.compound_info.noun_part}</div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Auxiliary Verb</div>
                  <div className="text-lg font-mono">{verbCategory.compound_info.auxiliary_verb}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Full phrase: {verbCategory.compound_info.full_phrase}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Verb Information */}
      {verbCategory && (
        <div className="space-y-2">
          <button 
            onClick={() => toggleSection('verb')}
            className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100"
          >
            {expandedSections.has('verb') ? '▲' : '▼'}
            🌳 Roots and Stems {verbCategory.compound_info ? 'for Aux. Verb' : ''}
          </button>
          {expandedSections.has('verb') && (
            <div className="pl-6 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">Imperfective Stem</div>
                  <div className="text-lg font-mono">{verbCategory.stems.imperfective}</div>
                  <div className="text-xs text-gray-500">
                    {verbCategory.romanization?.imperfective_stem}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">Perfective Stem</div>
                  <div className="text-lg font-mono">{verbCategory.stems.perfective}</div>
                  <div className="text-xs text-gray-500">
                    {verbCategory.romanization?.perfective_stem}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">Imperfective Root</div>
                  <div className="text-lg font-mono">{verbCategory.roots.imperfective}</div>
                  <div className="text-xs text-gray-500">
                    {verbCategory.romanization?.imperfective_root}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">Perfective Root</div>
                  <div className="text-lg font-mono">{verbCategory.roots.perfective}</div>
                  <div className="text-xs text-gray-500">
                    {verbCategory.romanization?.perfective_root}
                  </div>
                </div>
              </div>
              {verbCategory.past_participle && (
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">Past Participle</div>
                  <div className="text-lg font-mono">{verbCategory.past_participle}</div>
                  <div className="text-xs text-gray-500">
                    {verbCategory.romanization?.past_participle}
                  </div>
                </div>
              )}
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Type: {verbCategory.type === 'irregular_verb' ? 'Irregular' : 'Regular'} • 
                Transitivity: {verbCategory.transitivity}
                {verbCategory.irregularity_type && ` • ${verbCategory.irregularity_type}`}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Conjugations */}
      {verbCategory?.conjugations && Object.keys(verbCategory.conjugations).length > 0 && (
        <div className="space-y-2">
          <button 
            onClick={() => toggleSection('conjugations')}
            className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100"
          >
            {expandedSections.has('conjugations') ? '▲' : '▼'}
            🧪 Tense Category
          </button>
          {expandedSections.has('conjugations') && (
            <div className="pl-6 space-y-4 text-sm">
              
              {/* Imperative Forms */}
              {(verbCategory.conjugations.imperfective_imperative || verbCategory.conjugations.perfective_imperative) && (
                <div className="space-y-2">
                  {verbCategory.conjugations.imperfective_imperative && (
                    <div>
                      <div className="font-medium text-gray-700 dark:text-gray-300">Imperfective Imperative</div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                        imperfective stem + imperative ending • agrees w/ subject
                      </div>
                      <div className="font-mono text-base">
                        {verbCategory.conjugations.imperfective_imperative.second_person_singular}
                      </div>
                    </div>
                  )}
                  {verbCategory.conjugations.perfective_imperative && (
                    <div>
                      <div className="font-medium text-gray-700 dark:text-gray-300">Perfective Imperative</div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                        perfective stem + imperative ending • agrees w/ subject
                      </div>
                      <div className="font-mono text-base">
                        {verbCategory.conjugations.perfective_imperative.second_person_singular}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Present Tense */}
              {verbCategory.conjugations.present && (
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">Present</div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                    imperfective stem + present verb ending • agrees w/ subject
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="font-medium">Pers.</div>
                    <div className="font-medium">Singular</div>
                    <div className="font-medium">Plural</div>
                    <div>1st</div>
                    <div className="font-mono">{verbCategory.conjugations.present.first_person_singular}</div>
                    <div className="font-mono">{verbCategory.conjugations.present.first_person_plural}</div>
                    <div>2nd</div>
                    <div className="font-mono">{verbCategory.conjugations.present.second_person_singular}</div>
                    <div className="font-mono">{verbCategory.conjugations.present.second_person_plural}</div>
                    <div>3rd</div>
                    <div className="font-mono">{verbCategory.conjugations.present.third_person_singular}</div>
                    <div className="font-mono">{verbCategory.conjugations.present.third_person_plural}</div>
                  </div>
                </div>
              )}

              {/* Subjunctive */}
              {verbCategory.conjugations.subjunctive && (
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">Subjunctive</div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                    perfective stem + present verb ending • agrees w/ subject
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="font-medium">Pers.</div>
                    <div className="font-medium">Singular</div>
                    <div className="font-medium">Plural</div>
                    <div>1st</div>
                    <div className="font-mono">{verbCategory.conjugations.subjunctive.first_person_singular}</div>
                    <div className="font-mono">{verbCategory.conjugations.subjunctive.first_person_plural}</div>
                    <div>2nd</div>
                    <div className="font-mono">{verbCategory.conjugations.subjunctive.second_person_singular}</div>
                    <div className="font-mono">{verbCategory.conjugations.subjunctive.second_person_plural}</div>
                    <div>3rd</div>
                    <div className="font-mono">{verbCategory.conjugations.subjunctive.third_person_singular}</div>
                    <div className="font-mono">{verbCategory.conjugations.subjunctive.third_person_plural}</div>
                  </div>
                </div>
              )}

              {/* Future Tenses */}
              {(verbCategory.conjugations.imperfective_future || verbCategory.conjugations.perfective_future) && (
                <div className="space-y-3">
                  {verbCategory.conjugations.imperfective_future && (
                    <div>
                      <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">Imperfective Future</div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs mb-2">ba + present • agrees w/ subject</div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="font-medium">Pers.</div>
                        <div className="font-medium">Singular</div>
                        <div className="font-medium">Plural</div>
                        <div>1st</div>
                        <div className="font-mono">{verbCategory.conjugations.imperfective_future.first_person_singular}</div>
                        <div className="font-mono">{verbCategory.conjugations.imperfective_future.first_person_plural}</div>
                        <div>2nd</div>
                        <div className="font-mono">{verbCategory.conjugations.imperfective_future.second_person_singular}</div>
                        <div className="font-mono">{verbCategory.conjugations.imperfective_future.second_person_plural}</div>
                        <div>3rd</div>
                        <div className="font-mono">{verbCategory.conjugations.imperfective_future.third_person_singular}</div>
                        <div className="font-mono">{verbCategory.conjugations.imperfective_future.third_person_plural}</div>
                      </div>
                    </div>
                  )}
                  
                  {verbCategory.conjugations.perfective_future && (
                    <div>
                      <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">Perfective Future</div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs mb-2">ba + subjunctive • agrees w/ subject</div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="font-medium">Pers.</div>
                        <div className="font-medium">Singular</div>
                        <div className="font-medium">Plural</div>
                        <div>1st</div>
                        <div className="font-mono">{verbCategory.conjugations.perfective_future.first_person_singular}</div>
                        <div className="font-mono">{verbCategory.conjugations.perfective_future.first_person_plural}</div>
                        <div>2nd</div>
                        <div className="font-mono">{verbCategory.conjugations.perfective_future.second_person_singular}</div>
                        <div className="font-mono">{verbCategory.conjugations.perfective_future.second_person_plural}</div>
                        <div>3rd</div>
                        <div className="font-mono">{verbCategory.conjugations.perfective_future.third_person_singular}</div>
                        <div className="font-mono">{verbCategory.conjugations.perfective_future.third_person_plural}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Past Tenses */}
              {(verbCategory.conjugations.continuous_past || verbCategory.conjugations.simple_past) && (
                <div className="space-y-3">
                  {verbCategory.conjugations.continuous_past && (
                    <div>
                      <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">Continuous Past</div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                        imperfective root + past verb ending • {verbCategory.conjugations.continuous_past.note}
                      </div>
                      <div className="font-mono text-base">{verbCategory.conjugations.continuous_past.form}</div>
                    </div>
                  )}
                  
                  {verbCategory.conjugations.simple_past && (
                    <div>
                      <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">Simple Past</div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                        perfective root + past verb ending • {verbCategory.conjugations.simple_past.note}
                      </div>
                      <div className="font-mono text-base">{verbCategory.conjugations.simple_past.form}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Noun Information */}
      {nounCategory && (
        <div className="space-y-2">
          <button 
            onClick={() => toggleSection('noun')}
            className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100"
          >
            {expandedSections.has('noun') ? '▲' : '▼'}
            Noun Properties
          </button>
          {expandedSections.has('noun') && (
            <div className="pl-6 space-y-2 text-sm">
              <div>Gender: {nounCategory.gender}</div>
              <div>Pattern: {nounCategory.pattern}</div>
              {nounCategory.pattern_info && <div>Pattern Info: {nounCategory.pattern_info}</div>}
              <div>Inflection Type: {nounCategory.inflection_type}</div>
              {nounCategory.plural_forms.length > 0 && (
                <div>
                  Plural Forms: {nounCategory.plural_forms.join(', ')}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Related Words */}
      {analysis.related_forms && analysis.related_forms.length > 0 && (
        <div className="space-y-2">
          <button 
            onClick={() => toggleSection('related')}
            className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100"
          >
            {expandedSections.has('related') ? '▲' : '▼'}
            Related Words ({analysis.related_forms.length})
          </button>
          {expandedSections.has('related') && (
            <div className="pl-6">
              <div className="flex flex-wrap gap-2">
                {analysis.related_forms.slice(0, 12).map((form, idx) => (
                  <button
                    key={idx}
                    onClick={() => onRelatedWordClick?.(form)}
                    className="px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    {form}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Frequency */}
      {analysis.frequency && (
        <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t">
          Frequency: {analysis.frequency.count} occurrences 
          {analysis.frequency.rank > 0 && ` • Rank: ${analysis.frequency.rank}`}
          {analysis.frequency.testament !== 'both' && ` • ${analysis.frequency.testament}`}
        </div>
      )}
    </div>
  );
}
