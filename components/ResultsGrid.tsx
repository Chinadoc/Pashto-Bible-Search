"use client";

/**
 * ResultsGrid Component
 * Modern card-based grid layout for search results
 */

import type { Verse } from '@/types';
import { useState } from 'react';

interface ResultsGridProps {
  results: Verse[];
  isLoading: boolean;
  query: string;
  audioMap: Record<string, string>;
}

export default function ResultsGrid({
  results,
  isLoading,
  query,
  audioMap
}: ResultsGridProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCard = (ref: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(ref)) {
      newExpanded.delete(ref);
    } else {
      newExpanded.add(ref);
    }
    setExpandedCards(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="result-card animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
              <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          No results found
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Try adjusting your search terms or filters
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Results Header */}
      {results.length > 0 && (
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {results.length} {results.length === 1 ? 'Result' : 'Results'}
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Found in the Pashto Bible
          </p>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
        {results.map((verse, index) => {
          const ref = `${verse.book} ${verse.chapter}:${verse.verse}`;
          const isExpanded = expandedCards.has(ref);
          const maxLength = 150;
          const needsExpansion = verse.text.length > maxLength;
          const displayText = needsExpansion && !isExpanded
            ? verse.text.slice(0, maxLength) + '...'
            : verse.text;

          return (
            <div
              key={`${verse.book}-${verse.chapter}-${verse.verse}-${index}`}
              className="result-card group"
            >
              {/* Reference Badge */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent) 0%, var(--gradient-end) 100%)',
                    color: 'white'
                  }}
                >
                  <span>📖</span>
                  <span>{ref}</span>
                </div>

                {/* Audio Button */}
                {audioMap[ref] && (
                  <button
                    onClick={() => {
                      const audio = new Audio(audioMap[ref]);
                      audio.play();
                    }}
                    className="p-2 rounded-full transition-all hover:scale-110"
                    style={{
                      background: 'var(--surface-elevated)',
                      border: '1px solid var(--border)'
                    }}
                    title="Play audio"
                  >
                    🔊
                  </button>
                )}
              </div>

              {/* Verse Text */}
              <div
                className="text-lg leading-relaxed mb-3"
                dir="rtl"
                style={{
                  fontFamily: 'Noto Nastaliq Urdu, serif',
                  color: 'var(--text-primary)'
                }}
              >
                {displayText}
              </div>

              {/* Expand/Collapse Button */}
              {needsExpansion && (
                <button
                  onClick={() => toggleCard(ref)}
                  className="text-sm font-medium transition-colors"
                  style={{ color: 'var(--accent)' }}
                >
                  {isExpanded ? '▲ Show less' : '▼ Show more'}
                </button>
              )}

              {/* Translation Badge */}
              {verse.translation && (
                <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background: verse.translation === 'afghan2023'
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(249, 115, 22, 0.1)',
                      color: verse.translation === 'afghan2023'
                        ? '#10b981'
                        : '#f97316'
                    }}
                  >
                    {verse.translation === 'afghan2023' ? '🇦🇫 Afghan 2023' : '🕌 Yousafzai 2019'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
