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

import { useState, useCallback, useMemo } from 'react';
import WordTooltip, { type WordAnalysis } from './WordTooltip';

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
  showAnalysis = true,
  className = '',
}: InteractiveVerseProps) {
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
    // Simple render without tooltips
    return (
      <span className={className} dir="rtl" style={{ unicodeBidi: 'plaintext' }}>
        {text}
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
          >
            <span
              className={`
                inline-block transition-colors duration-150
                hover:bg-blue-100/50 dark:hover:bg-blue-900/30 rounded px-0.5
                ${highlighted ? 'bg-yellow-200/60 dark:bg-yellow-700/40 rounded' : ''}
                ${analysis?.pos === 'verb' ? 'hover:underline decoration-green-500/50 decoration-2 underline-offset-2' : ''}
                ${analysis?.pos === 'noun' ? 'hover:underline decoration-blue-500/50 decoration-2 underline-offset-2' : ''}
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

