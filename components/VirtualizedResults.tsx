"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Verse } from '../app/lib/types';

interface VirtualizedResultsProps {
  verses: Verse[];
  itemHeight?: number;
  containerHeight?: number;
  overscan?: number;
  renderItem: (verse: Verse, index: number) => React.ReactNode;
  className?: string;
}

export default function VirtualizedResults({
  verses,
  itemHeight = 120, // Default height for each verse item
  containerHeight = 600, // Default container height
  overscan = 5, // Number of items to render outside visible area
  renderItem,
  className = '',
}: VirtualizedResultsProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
      verses.length - 1
    );
    
    return {
      start: Math.max(0, startIndex - overscan),
      end: endIndex,
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, verses.length]);

  // Handle scroll events
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Reset scroll position when verses change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  }, [verses]);

  // Calculate total height for scrollbar
  const totalHeight = verses.length * itemHeight;

  // Get visible items
  const visibleItems = verses.slice(visibleRange.start, visibleRange.end + 1);

  // Calculate offset for visible items
  const offsetY = visibleRange.start * itemHeight;

  if (verses.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 text-gray-500 ${className}`}>
        No results found
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((verse, index) => (
            <div
              key={`${verse.ref}-${visibleRange.start + index}`}
              style={{ height: itemHeight }}
              className="border-b border-gray-100 last:border-b-0"
            >
              {renderItem(verse, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Hook for managing virtual scrolling state
export function useVirtualScrolling(
  totalItems: number,
  itemHeight: number = 120,
  containerHeight: number = 600
) {
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      totalItems - 1
    );
    
    return {
      start: Math.max(0, startIndex),
      end: endIndex,
    };
  }, [scrollTop, itemHeight, containerHeight, totalItems]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
    setIsScrolling(true);
    
    // Reset scrolling flag after a delay
    setTimeout(() => setIsScrolling(false), 150);
  };

  return {
    scrollTop,
    visibleRange,
    handleScroll,
    isScrolling,
  };
}

// Performance-optimized verse item component
export function VerseItem({ 
  verse, 
  index, 
  isVisible 
}: { 
  verse: Verse; 
  index: number; 
  isVisible: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) {
    return (
      <div className="p-4 h-full flex items-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <span className="text-sm font-medium text-blue-600">
            {verse.ref}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 leading-relaxed">
            {verse.text}
          </p>
          {verse.translation && (
            <p className="text-xs text-gray-600 mt-1">
              {verse.translation}
            </p>
          )}
          {verse.audio_verse_url && (
            <audio
              controls
              className="mt-2 w-full max-w-xs"
              preload="none"
            >
              <source src={verse.audio_verse_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      </div>
    </div>
  );
}
