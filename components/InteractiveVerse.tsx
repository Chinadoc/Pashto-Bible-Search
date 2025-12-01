"use client";

/**
 * InteractiveVerse Component
 * 
 * Renders a verse with hoverable words that show grammatical analysis.
 * Each word can be hovered to see:
 * - Part of speech
 * - Base form
 * - For nouns: inflection info and reason
 * - For verbs: conjugation details
 */

import { useState, useCallback, useMemo, createContext, useContext } from 'react';
import WordTooltip, { type WordAnalysis } from './WordTooltip';

// Global toggle context for verse analysis
interface VerseAnalysisContextType {
  isEnabled: boolean;
  toggle: () => void;
}

const VerseAnalysisContext = createContext<VerseAnalysisContextType>({
  isEnabled: true,
  toggle: () => {},
});

export function useVerseAnalysis() {
  return useContext(VerseAnalysisContext);
}

export function VerseAnalysisProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(true);
  
  const toggle = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);
  
  return (
    <VerseAnalysisContext.Provider value={{ isEnabled, toggle }}>
      {children}
    </VerseAnalysisContext.Provider>
  );
}

// Toggle button component
export function VerseAnalysisToggle({ className = '' }: { className?: string }) {
  const { isEnabled, toggle } = useVerseAnalysis();
  
  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors
        ${isEnabled 
          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
        } ${className}`}
      title={isEnabled ? 'Disable word analysis tooltips' : 'Enable word analysis tooltips'}
    >
      <span className="text-base">{isEnabled ? '📖' : '📕'}</span>
      <span>Word Analysis</span>
      <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-green-500' : 'bg-gray-400'}`} />
    </button>
  );
}

interface InteractiveVerseProps {
  text: string;
  verseRef?: string;
  highlightedForms?: string[];
  showAnalysis?: boolean;
  className?: string;
}

// Cache for word analyses to avoid repeated API calls
const analysisCache = new Map<string, WordAnalysis | null>();
const pendingRequests = new Map<string, Promise<WordAnalysis | null>>();

export default function InteractiveVerse({
  text,
  verseRef,
  highlightedForms = [],
  showAnalysis: showAnalysisProp,
  className = '',
}: InteractiveVerseProps) {
  // Use context for global toggle, with prop override
  const { isEnabled: globalEnabled } = useVerseAnalysis();
  const showAnalysis = showAnalysisProp ?? globalEnabled;
  
  const [wordAnalyses, setWordAnalyses] = useState<Map<string, WordAnalysis | null>>(new Map());
  const [loadingWords, setLoadingWords] = useState<Set<string>>(new Set());

  // Parse text into words while preserving punctuation
  const parsedWords = useMemo(() => {
    if (!text) return [];
    
    // Split by whitespace but keep the structure
    const parts: Array<{ text: string; isWord: boolean; index: number }> = [];
    let currentIndex = 0;
    
    // Match words (Arabic/Pashto characters) and non-words separately
    const regex = /([ا-ی\u0600-\u06FF]+)|([^ا-ی\u0600-\u06FF\s]+)|(\s+)/gu;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      if (match[1]) {
        // It's a Pashto/Arabic word
        parts.push({ text: match[1], isWord: true, index: currentIndex });
      } else if (match[2]) {
        // It's punctuation
        parts.push({ text: match[2], isWord: false, index: currentIndex });
      } else if (match[3]) {
        // It's whitespace
        parts.push({ text: match[3], isWord: false, index: currentIndex });
      }
      currentIndex++;
    }
    
    return parts;
  }, [text]);

  // Fetch word analysis
  const fetchAnalysis = useCallback(async (word: string): Promise<WordAnalysis | null> => {
    // Check cache first
    if (analysisCache.has(word)) {
      return analysisCache.get(word) || null;
    }
    
    // Check if there's already a pending request for this word
    if (pendingRequests.has(word)) {
      return pendingRequests.get(word)!;
    }
    
    // Create new request
    const requestPromise = (async () => {
      try {
        const response = await fetch(
          `/api/word-analysis?word=${encodeURIComponent(word)}&context=${encodeURIComponent(text)}`
        );
        
        if (!response.ok) {
          analysisCache.set(word, null);
          return null;
        }
        
        const data = await response.json();
        const analysis: WordAnalysis = {
          word: data.word,
          pos: data.pos,
          baseForm: data.baseForm,
          romanized: data.romanized,
          english: data.english,
          gender: data.gender,
          inflectionPattern: data.inflectionPattern,
          inflectionState: data.inflectionState,
          inflectionReason: data.inflectionReason,
          person: data.person,
          number: data.number,
          tense: data.tense,
          aspect: data.aspect,
          mood: data.mood,
          isCompound: data.isCompound,
          compoundType: data.compoundType,
          auxiliaryVerb: data.auxiliaryVerb,
          confidence: data.confidence || 0.5,
          source: data.source || 'inferred',
        };
        
        analysisCache.set(word, analysis);
        return analysis;
      } catch (error) {
        console.warn(`Failed to fetch analysis for "${word}":`, error);
        analysisCache.set(word, null);
        return null;
      } finally {
        pendingRequests.delete(word);
      }
    })();
    
    pendingRequests.set(word, requestPromise);
    return requestPromise;
  }, [text]);

  // Handle word hover
  const handleWordHover = useCallback(async (word: string) => {
    if (!showAnalysis) return;
    if (wordAnalyses.has(word)) return;
    if (loadingWords.has(word)) return;
    
    setLoadingWords(prev => new Set(prev).add(word));
    
    const analysis = await fetchAnalysis(word);
    
    setWordAnalyses(prev => new Map(prev).set(word, analysis));
    setLoadingWords(prev => {
      const next = new Set(prev);
      next.delete(word);
      return next;
    });
  }, [showAnalysis, wordAnalyses, loadingWords, fetchAnalysis]);

  // Check if a word should be highlighted
  const isHighlighted = useCallback((word: string) => {
    if (highlightedForms.length === 0) return false;
    return highlightedForms.some(form => 
      word === form || 
      word.includes(form) || 
      form.includes(word)
    );
  }, [highlightedForms]);

  if (!showAnalysis) {
    // Simple render without tooltips - just highlight matched words
    return (
      <span className={className} dir="rtl" style={{ unicodeBidi: 'plaintext' }}>
        {parsedWords.map((part, idx) => {
          if (!part.isWord) {
            return <span key={idx}>{part.text}</span>;
          }
          const highlighted = isHighlighted(part.text);
          return (
            <span 
              key={idx}
              className={highlighted ? 'bg-yellow-200/60 dark:bg-yellow-700/40 rounded px-0.5' : ''}
            >
              {part.text}
            </span>
          );
        })}
      </span>
    );
  }

  return (
    <span className={`${className} interactive-verse`} dir="rtl" style={{ unicodeBidi: 'plaintext' }}>
      {parsedWords.map((part, idx) => {
        if (!part.isWord) {
          // Render punctuation/whitespace as-is
          return <span key={idx}>{part.text}</span>;
        }
        
        const word = part.text;
        const analysis = wordAnalyses.get(word) || null;
        const isLoading = loadingWords.has(word);
        const highlighted = isHighlighted(word);
        
        return (
          <WordTooltip
            key={`${word}-${idx}`}
            word={word}
            analysis={analysis}
            isLoading={isLoading}
            onHover={handleWordHover}
            position="below"
          >
            <span
              className={`
                transition-colors duration-100 rounded-sm
                hover:bg-blue-100/60 dark:hover:bg-blue-900/40
                ${highlighted ? 'bg-yellow-200/60 dark:bg-yellow-700/40 px-0.5' : ''}
                ${analysis?.pos === 'verb' ? 'hover:underline decoration-green-500 decoration-2 underline-offset-4' : ''}
                ${analysis?.pos === 'noun' ? 'hover:underline decoration-blue-500 decoration-2 underline-offset-4' : ''}
                ${analysis?.pos === 'pronoun' ? 'hover:underline decoration-pink-500 decoration-2 underline-offset-4' : ''}
              `}
            >
              {word}
            </span>
          </WordTooltip>
        );
      })}
    </span>
  );
}

