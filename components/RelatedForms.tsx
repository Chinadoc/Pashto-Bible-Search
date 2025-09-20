"use client";

import { useState } from 'react';

type VerbUnderstandingState = {
  person: '1st' | '2nd' | '3rd';
  tense: 'present' | 'past' | 'future' | 'perfect';
}

type RelatedFormsData = {
  verbs: Array<{form: string, count: number}>
  nouns: Array<{form: string, count: number}>
  other: Array<{form: string, count: number}>
  total: number
} | null

// Verb form categorization
function categorizeVerbForms(forms: {form: string, count: number}[]) {
  const presentTense = forms.filter(f =>
    f.form.endsWith('م') || f.form.endsWith('و') || f.form.endsWith('ې') || f.form.endsWith('ئ') || f.form.endsWith('ي')
  )
  const pastTense = forms.filter(f =>
    f.form.endsWith('لم') || f.form.endsWith('لو') || f.form.endsWith('لې') || f.form.endsWith('ل') || f.form.endsWith('له')
  )
  const perfectForms = forms.filter(f =>
    f.form.includes('لیدلی') || f.form.includes('کړی') || f.form.includes('شوی')
  )
  const otherVerbs = forms.filter(f =>
    !presentTense.includes(f) && !pastTense.includes(f) && !perfectForms.includes(f)
  )

  return { presentTense, pastTense, perfectForms, otherVerbs }
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

  if (!relatedForms || relatedForms.total === 0) return null

  const verbs = relatedForms.verbs || []
  const nouns = relatedForms.nouns || []
  const others = relatedForms.other || []

  const { presentTense, pastTense, perfectForms, otherVerbs } = categorizeVerbForms(verbs)

  // Filter verbs based on current tense/person selection
  const getFilteredVerbs = () => {
    if (!verbState) return verbs

    const { person, tense } = verbState
    let filtered = verbs

    // Filter by tense
    if (tense === 'present') {
      filtered = presentTense
    } else if (tense === 'past') {
      filtered = pastTense
    } else if (tense === 'perfect') {
      filtered = perfectForms
    } else {
      filtered = otherVerbs
    }

    // Filter by person (basic heuristic)
    if (person === '1st') {
      filtered = filtered.filter(f => f.form.endsWith('م') || f.form.endsWith('و'))
    } else if (person === '2nd') {
      filtered = filtered.filter(f => f.form.endsWith('ې') || f.form.endsWith('ئ'))
    } else if (person === '3rd') {
      filtered = filtered.filter(f => f.form.endsWith('ي'))
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
        <div className="mt-2 flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400">Tense:</span>
            <select
              value={verbState.tense}
              onChange={(e) => setVerbState({...verbState, tense: e.target.value as 'present' | 'past' | 'future' | 'perfect'})}
              className="p-1 border border-gray-300 rounded text-xs dark:border-gray-600 dark:bg-gray-800"
            >
              <option value="present">Present (م)</option>
              <option value="past">Past (لم)</option>
              <option value="future">Future (به)</option>
              <option value="perfect">Perfect (لیدلی)</option>
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
      )}
      {open && (
        <div className="mt-2">
          {/* Verb forms - filtered or unfiltered based on controls */}
          {filteredVerbs.length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-gray-500 mb-2 font-medium">
                Verbs ({verbState ? `Filtered: ${filteredVerbs.length}` : verbs.length})
              </div>
              {verbState ? (
                // Show filtered results when controls are active
                <Section title={`${verbState.tense} - ${verbState.person}`} list={filteredVerbs} />
              ) : (
                // Show categorized when no specific filtering
                <>
                  {presentTense.length > 0 && <Section title="Present Tense" list={presentTense} />}
                  {pastTense.length > 0 && <Section title="Past Tense" list={pastTense} />}
                  {perfectForms.length > 0 && <Section title="Perfect Forms" list={perfectForms} />}
                  {otherVerbs.length > 0 && <Section title="Other Verbs" list={otherVerbs} />}
                </>
              )}
            </div>
          )}

          {/* Other forms */}
          <Section title="Nouns" list={nouns} />
          <Section title="Other" list={others} />
        </div>
      )}
    </div>
  )
}
