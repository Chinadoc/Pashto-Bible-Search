"use client";

/**
 * VerbFormsStrip Component
 * Displays the verb forms being searched with collapse/expand functionality
 */

import { useState, useMemo } from 'react';

interface VerbFormsStripProps {
  forms: string[];
  onPickForm?: (form: string) => void;
  maxVisible?: number;
  isLoading?: boolean;
}

export default function VerbFormsStrip({
  forms,
  onPickForm,
  maxVisible = 8,
  isLoading = false,
}: VerbFormsStripProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleForms = useMemo(() => {
    if (isExpanded) return forms;
    return forms.slice(0, maxVisible);
  }, [forms, isExpanded, maxVisible]);

  const hiddenCount = forms.length - maxVisible;
  const hasMore = forms.length > maxVisible;

  if (forms.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
      <div className="flex items-center gap-2 mb-2">
        <svg 
          className="w-4 h-4 text-indigo-500 dark:text-indigo-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className={`
          text-xs font-medium text-gray-600 dark:text-gray-400
          ${isLoading ? 'animate-pulse' : ''}
        `}>
          Searching with {isLoading ? '...' : forms.length} verb form{forms.length !== 1 ? 's' : ''}
        </span>
        
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="
              text-xs text-indigo-600 dark:text-indigo-400 
              hover:text-indigo-800 dark:hover:text-indigo-300
              hover:underline ml-auto
            "
          >
            {isExpanded ? 'Show less' : `Show all ${forms.length}`}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            />
          ))
        ) : (
          <>
            {visibleForms.map((form) => (
              <button
                key={form}
                onClick={() => onPickForm?.(form)}
                disabled={!onPickForm}
                className={`
                  px-2.5 py-1 text-xs font-medium rounded-md
                  transition-all duration-150
                  ${onPickForm
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 cursor-pointer'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-default'
                  }
                `}
                style={{ direction: 'rtl' }}
              >
                {form}
              </button>
            ))}
            
            {!isExpanded && hasMore && (
              <button
                onClick={() => setIsExpanded(true)}
                className="
                  px-2.5 py-1 text-xs font-medium rounded-md
                  bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400
                  hover:bg-gray-300 dark:hover:bg-gray-600
                  transition-all duration-150
                "
              >
                +{hiddenCount} more
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

