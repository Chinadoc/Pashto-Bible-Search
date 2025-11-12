"use client";

import React, { useMemo } from 'react';

interface InflectionReasons {
  plural: number;
  sandwich: number;
  transitive_past: number;
  sandwich_types: string[];
}

interface Props {
  text: string;
  tokens: string[];
  formToReasons: Map<string, InflectionReasons>;
  formToInflectionType: Map<string, string>;
  translation?: string;
}

export default function EnhancedHighlightText({
  text,
  tokens,
  formToReasons,
  formToInflectionType,
  translation
}: Props) {
  const highlighted = useMemo(() => {
    if (!tokens.length) return <span>{text}</span>;

    // Create regex pattern from tokens
    const escapedTokens = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = escapedTokens.join('|');
    
    try {
      const re = new RegExp(`(${pattern})`, 'gi');
      const parts = text.split(re);
      
      return (
        <span>
          {parts.map((part, i) => {
            if (i % 2 === 0) {
              return <span key={i}>{part}</span>;
            }
            
            // This is a matched token
            const matchedForm = tokens.find(t => 
              part.toLowerCase() === t.toLowerCase() || 
              part.includes(t) || 
              t.includes(part)
            );
            
            if (!matchedForm) {
              return (
                <mark key={i} className="bg-yellow-200 dark:bg-yellow-700/60 px-0.5 rounded">
                  {part}
                </mark>
              );
            }
            
            const reasons = formToReasons.get(matchedForm);
            const inflectionType = formToInflectionType.get(matchedForm);
            
            // Build reason badges
            const badges: React.ReactNode[] = [];
            if (reasons) {
              if (reasons.plural > 0) {
                badges.push(
                  <span 
                    key="plural"
                    className="ml-1 inline-flex items-center px-1 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[10px] font-medium"
                    title={`Plural: ${reasons.plural}x`}
                  >
                    🔢 {reasons.plural}
                  </span>
                );
              }
              if (reasons.sandwich > 0) {
                badges.push(
                  <span 
                    key="sandwich"
                    className="ml-1 inline-flex items-center px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-medium"
                    title={`Sandwich: ${reasons.sandwich}x (${reasons.sandwich_types.join(', ')})`}
                  >
                    🥪 {reasons.sandwich}
                  </span>
                );
              }
              if (reasons.transitive_past > 0) {
                badges.push(
                  <span 
                    key="transitive"
                    className="ml-1 inline-flex items-center px-1 py-0.5 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-[10px] font-medium"
                    title={`Transitive Past: ${reasons.transitive_past}x`}
                  >
                    ⚡ {reasons.transitive_past}
                  </span>
                );
              }
            }
            
            return (
              <span key={i} className="inline-flex items-center">
                <mark className="bg-yellow-200 dark:bg-yellow-700/60 px-0.5 rounded">
                  {part}
                </mark>
                {badges.length > 0 && (
                  <span className="ml-1 flex items-center gap-0.5">
                    {badges}
                  </span>
                )}
              </span>
            );
          })}
        </span>
      );
    } catch (error) {
      console.warn('Enhanced highlight regex error:', error);
      return <span>{text}</span>;
    }
  }, [text, tokens, formToReasons, formToInflectionType]);

  return highlighted;
}





