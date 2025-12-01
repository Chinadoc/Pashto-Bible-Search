"use client";

/**
 * FacetGroup Component
 * Displays a group of filter options with counts and disabled states
 * Shows context-aware counts that update as other facets are filtered
 */

import { useMemo } from 'react';

export interface FacetOption {
  value: string;
  label: string;
  count: number;
  disabled?: boolean;
}

interface FacetGroupProps {
  title: string;
  options: FacetOption[];
  selected: string[];
  onToggle: (value: string) => void;
  isLoading?: boolean;
  showSelectAll?: boolean;
  allValue?: string;
}

export default function FacetGroup({
  title,
  options,
  selected,
  onToggle,
  isLoading = false,
  showSelectAll = true,
  allValue = 'all',
}: FacetGroupProps) {
  // Calculate if "all" is effectively selected (no specific selections or explicit all)
  const isAllSelected = useMemo(() => {
    return selected.length === 0 || selected.includes(allValue);
  }, [selected, allValue]);

  // Get total count for "All" option
  const totalCount = useMemo(() => {
    return options.reduce((sum, opt) => sum + opt.count, 0);
  }, [options]);

  return (
    <div className="facet-group">
      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
        {title}
      </label>
      
      <div className="space-y-0.5">
        {/* All / Select All option */}
        {showSelectAll && (
          <label
            className={`
              flex items-center justify-between gap-2 text-sm cursor-pointer
              px-2.5 py-1.5 rounded-md transition-all duration-150
              ${isAllSelected
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={() => onToggle(allValue)}
                className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 
                  dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 
                  dark:bg-gray-700 dark:border-gray-600"
              />
              <span>All</span>
            </div>
            <span className={`
              text-xs tabular-nums px-1.5 py-0.5 rounded-full min-w-[2rem] text-center
              ${isLoading ? 'animate-pulse bg-gray-200 dark:bg-gray-600' : ''}
              ${isAllSelected 
                ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }
            `}>
              {isLoading ? '...' : totalCount}
            </span>
          </label>
        )}

        {/* Individual options */}
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          const isDisabled = option.disabled || option.count === 0;
          
          return (
            <label
              key={option.value}
              className={`
                flex items-center justify-between gap-2 text-sm
                px-2.5 py-1.5 rounded-md transition-all duration-150
                ${isDisabled
                  ? 'opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-600'
                  : isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium cursor-pointer'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => !isDisabled && onToggle(option.value)}
                  className={`
                    w-4 h-4 rounded focus:ring-2 
                    ${isDisabled
                      ? 'text-gray-300 bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700 cursor-not-allowed'
                      : 'text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600'
                    }
                  `}
                />
                <span className="capitalize">{option.label}</span>
              </div>
              <span className={`
                text-xs tabular-nums px-2 py-0.5 rounded-full min-w-[2.5rem] text-center font-medium
                ${isLoading ? 'animate-pulse bg-gray-200 dark:bg-gray-600' : ''}
                ${isDisabled
                  ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                  : isSelected
                    ? 'bg-indigo-200 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100'
                    : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                }
              `}>
                {isLoading ? '...' : option.count}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

