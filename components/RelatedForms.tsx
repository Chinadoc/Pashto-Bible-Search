"use client";

import { useState } from 'react';
import type { RelatedFormsData } from '../types';

type VerbUnderstandingState = {
  person: '1st' | '2nd' | '3rd';
  tense: 'present' | 'past' | 'future' | 'perfect' | 'subjunctive' | 'imperative' | 'ability' | 'habitual';
  aspect: 'imperfective' | 'perfective';
  mood: 'indicative' | 'subjunctive' | 'imperative' | 'ability';
}

// Verb form categorization based on LingDocs structure
function categorizeVerbForms(forms: {form: string, count: number}[]) {
  const presentTense = forms.filter(f =>
    f.form.endsWith('م') || f.form.endsWith('و') || f.form.endsWith('ې') || f.form.endsWith('ئ') || f.form.endsWith('ي')
  )

  const subjunctiveTense = forms.filter(f =>
    f.form.includes('وو') || f.form.includes('ووه') || f.form.includes('و') || f.form.includes('وو')
  ).filter(f => f.form.endsWith('م') || f.form.endsWith('و') || f.form.endsWith('ې') || f.form.endsWith('ئ') || f.form.endsWith('ي'))

  const futureTense = forms.filter(f =>
    f.form.includes('به ') && (f.form.endsWith('م') || f.form.endsWith('و') || f.form.endsWith('ې') || f.form.endsWith('ئ') || f.form.endsWith('ي'))
  )

  const pastTense = forms.filter(f =>
    f.form.endsWith('لم') || f.form.endsWith('لو') || f.form.endsWith('لې') || f.form.endsWith('ل') || f.form.endsWith('له')
  )

  const imperativeForms = forms.filter(f =>
    f.form.includes('ه') && !f.form.includes(' ') && !f.form.includes('ش') &&
    (f.form.endsWith('ه') || f.form.endsWith('ئ'))
  )

  const abilityForms = forms.filter(f =>
    f.form.includes('ش') && (f.form.endsWith('م') || f.form.endsWith('و') || f.form.endsWith('ې') || f.form.endsWith('ئ') || f.form.endsWith('ي'))
  )

  const perfectForms = forms.filter(f =>
    f.form.includes('لی') || f.form.includes('کړی') || f.form.includes('شوی') ||
    f.form.includes('یم') || f.form.includes('یو') || f.form.includes('یې') ||
    f.form.includes('وم') || f.form.includes('وو') || f.form.includes('وې') ||
    f.form.includes('و') || f.form.includes('وه')
  ).filter(f => f.form.includes(' ')) // Perfect forms have space

  const habitualForms = forms.filter(f =>
    f.form.includes('به ') && (f.form.endsWith('لم') || f.form.endsWith('لو') || f.form.endsWith('لې') || f.form.endsWith('ل') || f.form.endsWith('له'))
  )

  const otherVerbs = forms.filter(f =>
    !presentTense.includes(f) && !subjunctiveTense.includes(f) &&
    !futureTense.includes(f) && !pastTense.includes(f) &&
    !imperativeForms.includes(f) && !abilityForms.includes(f) &&
    !perfectForms.includes(f) && !habitualForms.includes(f)
  )

  return {
    presentTense,
    subjunctiveTense,
    futureTense,
    pastTense,
    imperativeForms,
    abilityForms,
    perfectForms,
    habitualForms,
    otherVerbs
  }
}

export default function RelatedForms({
  relatedForms,
  onPick,
  verbState,
  setVerbState
}: {
  relatedForms: RelatedFormsData;
  onPick: (form: string) => void;
  verbState?: VerbUnderstandingState;
  setVerbState?: (state: VerbUnderstandingState) => void;
}) {
  const [open, setOpen] = useState<boolean>(false)

  if (!relatedForms) return null

  // Show the interface even if no forms found yet, to allow user to see the controls
  const hasAnyForms = relatedForms.total > 0

  const verbs = relatedForms.verbs || []
  const nouns = relatedForms.nouns || []
  const others = relatedForms.other || []

  const {
    presentTense,
    subjunctiveTense,
    futureTense,
    pastTense,
    imperativeForms,
    abilityForms,
    perfectForms,
    habitualForms,
    otherVerbs
  } = categorizeVerbForms(verbs)

  // Filter verbs based on current tense/aspect/mood/person selection
  const getFilteredVerbs = () => {
    if (!verbState) return verbs

    const { person, tense, aspect, mood } = verbState
    let filtered = verbs

    // Filter by tense
    if (tense === 'present') {
      filtered = presentTense
    } else if (tense === 'subjunctive') {
      filtered = subjunctiveTense
    } else if (tense === 'future') {
      filtered = futureTense
    } else if (tense === 'past') {
      filtered = pastTense
    } else if (tense === 'imperative') {
      filtered = imperativeForms
    } else if (tense === 'ability') {
      filtered = abilityForms
    } else if (tense === 'perfect') {
      filtered = perfectForms
    } else if (tense === 'habitual') {
      filtered = habitualForms
    } else {
      filtered = otherVerbs
    }

    // Filter by person (enhanced heuristic)
    if (person === '1st') {
      filtered = filtered.filter(f =>
        f.form.endsWith('م') || f.form.endsWith('و') ||
        f.form.includes(' به ') && (f.form.includes('م') || f.form.includes('و'))
      )
    } else if (person === '2nd') {
      filtered = filtered.filter(f =>
        f.form.endsWith('ې') || f.form.endsWith('ئ') ||
        (f.form.includes(' به ') && (f.form.includes('ې') || f.form.includes('ئ')))
      )
    } else if (person === '3rd') {
      filtered = filtered.filter(f =>
        f.form.endsWith('ي') ||
        (f.form.includes(' به ') && f.form.includes('ي'))
      )
    }

    return filtered
  }

  const filteredVerbs = getFilteredVerbs()

  const Section = ({ title, list }: { title: string; list: {form: string, count: number}[] }) => (
    <div className="mt-2">
      <div className="text-xs text-gray-500 mb-1">{title} ({list.length})</div>
      <div className="flex flex-wrap gap-2">
        {list.map(({ form, count }, idx) => (
          <button
            key={`${title}-${form}-${idx}`}
            onClick={() => onPick(form)}
            className="px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            title={`Click to search for: ${form}`}
          >
            <span className="font-medium">{form}</span>
            {count > 0 && <span className="ml-1 text-xs opacity-70">({count})</span>}
          </button>
        ))}
        {list.length === 0 && <span className="text-gray-400">—</span>}
      </div>
    </div>
  )

  return (
    <div className="mt-2 rounded border border-gray-200 dark:border-gray-700 p-2 text-sm">
      <div className="flex items-center justify-between">
        <div className="text-gray-700 dark:text-gray-300">Related forms</div>
        <button onClick={() => setOpen(!open)} className="text-xs px-2 py-0.5 border rounded">{open ? 'Hide' : 'Show'}</button>
      </div>

      {/* Verb understanding controls */}
      {verbState && setVerbState && (
        <div className="mt-2 space-y-2 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Tense:</span>
              <select
                value={verbState.tense}
                onChange={(e) => setVerbState({...verbState, tense: e.target.value as any})}
                className="p-1 border border-gray-300 rounded text-xs dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="present">Present (م)</option>
                <option value="subjunctive">Subjunctive (ووهم)</option>
                <option value="future">Future (به وهم)</option>
                <option value="past">Past (لم)</option>
                <option value="perfect">Perfect (لیدلی یم)</option>
                <option value="imperative">Imperative (ه)</option>
                <option value="ability">Ability (شم)</option>
                <option value="habitual">Habitual (به وهلم)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Person:</span>
              <select
                value={verbState.person}
                onChange={(e) => setVerbState({...verbState, person: e.target.value as '1st' | '2nd' | '3rd'})}
                className="p-1 border border-gray-300 rounded text-xs dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="1st">1st Person (م)</option>
                <option value="2nd">2nd Person (ې)</option>
                <option value="3rd">3rd Person (ي)</option>
              </select>
            </div>

            <div className="text-gray-500 dark:text-gray-400">
              {filteredVerbs.length} forms
            </div>
          </div>
        </div>
      )}
      {open && (
        <div className="mt-2">
          {/* Verb forms - filtered or unfiltered based on controls */}
          {hasAnyForms ? (
            <>
              {filteredVerbs.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-2 font-medium">
                    Verbs ({verbState ? `Filtered: ${filteredVerbs.length}` : verbs.length})
                  </div>
                  {verbState ? (
                    // Show filtered results when controls are active
                    <Section title={`${verbState.tense} - ${verbState.person}`} list={filteredVerbs} />
                  ) : (
                    // Show all LingDocs categories when no specific filtering
                    <>
                      {presentTense.length > 0 && <Section title="Present Tense (م)" list={presentTense} />}
                      {subjunctiveTense.length > 0 && <Section title="Subjunctive (ووهم)" list={subjunctiveTense} />}
                      {futureTense.length > 0 && <Section title="Future (به)" list={futureTense} />}
                      {pastTense.length > 0 && <Section title="Past Tense (لم)" list={pastTense} />}
                      {imperativeForms.length > 0 && <Section title="Imperative (ه)" list={imperativeForms} />}
                      {abilityForms.length > 0 && <Section title="Ability (شم)" list={abilityForms} />}
                      {perfectForms.length > 0 && <Section title="Perfect (لیدلی)" list={perfectForms} />}
                      {habitualForms.length > 0 && <Section title="Habitual (به وهلم)" list={habitualForms} />}
                      {otherVerbs.length > 0 && <Section title="Other Verbs" list={otherVerbs} />}
                    </>
                  )}
                </div>
              )}

              {/* Other forms */}
              {nouns.length > 0 && <Section title="Nouns" list={nouns} />}
              {others.length > 0 && <Section title="Other" list={others} />}
            </>
          ) : (
            // Show placeholder when no forms found
            <div className="text-xs text-gray-500 italic">
              No related forms found. Try searching for a different term.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
