import { useMemo } from 'react';
import { Verse, AudioMap } from '@/types';
import { audioUrlFromRef } from '@/utils/audio';

// A more robust function to clean up verse references for display
const cleanVerseRef = (ref: string): string => {
  if (!ref) return "";
  // Removes trailing digits from the book name, e.g., "1 Chronicles1" -> "1 Chronicles"
  return ref.replace(/([a-zA-Z])(\d+)\s/, '$1 ');
};

const HighlightedText = ({ text, terms }: { text: string; terms: string[] }) => {
  if (!terms.length || !text) {
    return <>{text}</>;
  }
  // Create a regex to find all terms, sorted by length to match longer terms first
  const sortedTerms = [...terms].sort((a, b) => b.length - a.length);
  const regex = new RegExp(`(${sortedTerms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        sortedTerms.includes(part) ? (
          <mark key={i} className="bg-yellow-300 dark:bg-yellow-500 text-black rounded px-1">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

const ResultsList = ({ results, highlightTerms, audioMap }: { results: Verse[]; highlightTerms: string[]; audioMap: AudioMap }) => {
  if (!results.length) {
    return <div className="text-center py-8 text-gray-500">No search results</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm text-gray-600 dark:text-gray-400">{results.length} results</div>
      {results.map((verse) => {
        const audioUrl = verse.ref ? audioUrlFromRef(verse.ref, audioMap) : null;
        return (
          <div key={verse.ref} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold text-gray-700 dark:text-gray-200">{cleanVerseRef(verse.ref)}</div>
              {audioUrl && (
                <audio controls src={audioUrl} className="h-8 w-64">
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
            <p className="text-lg text-gray-800 dark:text-gray-100 leading-relaxed" style={{ direction: 'rtl' }}>
              <HighlightedText text={verse.text} terms={highlightTerms} />
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ResultsList;
