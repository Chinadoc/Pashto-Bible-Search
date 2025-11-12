import React from 'react';
import { renderHighlightedText, buildHighlightRegex } from '../utils/highlight';

interface HighlightTextProps {
  text: string;
  tokens: string[];
}

export default function HighlightText({ text, tokens }: HighlightTextProps) {
  // Validate inputs
  if (!text || typeof text !== 'string') {
    console.warn('Invalid text passed to HighlightText:', text);
    return <span>Invalid text</span>;
  }

  if (!Array.isArray(tokens)) {
    console.warn('Invalid tokens passed to HighlightText:', tokens);
    return <span>{text}</span>;
  }

  // Build regex directly without useMemo to avoid hooks violations
  const rx = (() => {
    try {
      return buildHighlightRegex(tokens);
    } catch (error) {
      console.warn('Error building highlight regex:', error);
      return null;
    }
  })();

  if (!rx) {
    return <span>{text}</span>;
  }

  try {
    // Split the text and render with highlights
    const chunks = text.split(rx);
    return (
      <span>
        {chunks.map((c, i) => {
          if (!c) return null; // Skip empty chunks
          return i % 2 === 1
            ? <mark key={i} className="bg-yellow-400/40 rounded px-0.5">{c}</mark>
            : <span key={i}>{c}</span>;
        }).filter(Boolean)}
      </span>
    );
  } catch (error) {
    console.warn('Error rendering highlighted text:', error);
    return <span>{text}</span>;
  }
}


