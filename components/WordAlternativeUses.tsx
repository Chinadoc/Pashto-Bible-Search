/**
 * Component to display alternative uses of a word
 * Shows compound verbs, stative compounds, etc.
 */

import { useEffect, useState } from 'react';

interface AlternativeUse {
  type: 'compound_verb' | 'stative_compound' | 'other';
  forms: string[];
  description: string;
}

interface AlternativeUsesResponse {
  word: string;
  pos?: string;
  alternative_uses: AlternativeUse[];
  total_uses: number;
}

interface WordAlternativeUsesProps {
  word: string;
  pos?: string;
  onSelectForm?: (form: string) => void;
}

export default function WordAlternativeUses({ word, pos, onSelectForm }: WordAlternativeUsesProps) {
  const [alternativeUses, setAlternativeUses] = useState<AlternativeUsesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!word || word.length < 2) {
      setAlternativeUses(null);
      return;
    }

    setLoading(true);
    fetch(`/api/word-alternative-uses?word=${encodeURIComponent(word)}${pos ? `&pos=${encodeURIComponent(pos)}` : ''}`)
      .then(res => res.json())
      .then((data: AlternativeUsesResponse) => {
        // Ensure data structure is valid
        if (data && Array.isArray(data.alternative_uses)) {
          setAlternativeUses(data);
        } else {
          setAlternativeUses(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching alternative uses:', err);
        setAlternativeUses(null);
        setLoading(false);
      });
  }, [word, pos]);

  if (loading || !alternativeUses || !Array.isArray(alternativeUses.alternative_uses) || alternativeUses.alternative_uses.length === 0) {
    return null;
  }

  const hasMultipleTypes = alternativeUses.alternative_uses.length > 1;
  const totalForms = alternativeUses.total_uses;

  return (
    <div className="mb-4 px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
              💡 Alternative Uses Found
            </span>
            {totalForms > 0 && (
              <span className="text-xs text-yellow-600 dark:text-yellow-300">
                ({totalForms} form{totalForms !== 1 ? 's' : ''})
              </span>
            )}
          </div>

          {alternativeUses.alternative_uses.map((use, idx) => (
            <div key={idx} className="mb-2 last:mb-0">
              <p className="text-xs font-medium text-yellow-700 dark:text-yellow-300 mb-1">
                {use.description}:
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(use.forms) && (expanded ? use.forms : use.forms.slice(0, 5)).map((form, formIdx) => (
                  <button
                    key={formIdx}
                    onClick={() => onSelectForm?.(form)}
                    className="px-2 py-1 text-xs rounded-md bg-yellow-100 dark:bg-yellow-800/50 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-600 hover:bg-yellow-200 dark:hover:bg-yellow-700 transition-colors"
                  >
                    {form}
                  </button>
                ))}
                {Array.isArray(use.forms) && use.forms.length > 5 && !expanded && (
                  <button
                    onClick={() => setExpanded(true)}
                    className="px-2 py-1 text-xs rounded-md bg-yellow-100 dark:bg-yellow-800/50 text-yellow-600 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-600 hover:bg-yellow-200 dark:hover:bg-yellow-700 transition-colors"
                  >
                    +{use.forms.length - 5} more
                  </button>
                )}
              </div>
            </div>
          ))}

          {expanded && (
            <button
              onClick={() => setExpanded(false)}
              className="mt-2 text-xs text-yellow-600 dark:text-yellow-300 hover:underline"
            >
              Show less
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

