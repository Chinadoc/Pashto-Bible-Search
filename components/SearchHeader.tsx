"use client";

/**
 * SearchHeader Component
 * Extracted header section with title, tabs, translation selector, and search input
 */

import { TextField, Button, IconButton } from '@mui/material';
import Link from 'next/link';
import type { Scope, SearchLanguage } from '@/types';

interface SearchHeaderProps {
  query: string;
  setQuery: (query: string) => void;
  handleSearch: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  activeMainTab: 'search' | 'topics' | 'chapters' | 'lexicon' | 'videos' | 'poems';
  activeTranslation: 'afghan2023' | 'yousafzai2019' | 'unified';
  setActiveTranslation: (translation: 'afghan2023' | 'yousafzai2019' | 'unified') => void;
  searchLanguage: SearchLanguage;
  isEnglishMode: boolean;
}

export default function SearchHeader({
  query,
  setQuery,
  handleSearch,
  handleKeyPress,
  isLoading,
  activeMainTab,
  activeTranslation,
  setActiveTranslation,
  searchLanguage,
  isEnglishMode,
}: SearchHeaderProps) {
  return (
    <>
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className={`text-3xl font-bold mb-2 transition-colors ${isEnglishMode ? 'text-orange-700 dark:text-orange-300' : 'text-gray-900 dark:text-gray-100'}`}>
          Pashto Bible Search
        </h1>
        <p className={`transition-colors ${isEnglishMode ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'}`}>
          {isEnglishMode ? 'Searching in English - Finding Pashto translations' : 'Search the Bible in Pashto with linguistic analysis'}
        </p>
      </header>

      {/* Main Tabs */}
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-4xl">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex gap-1 overflow-x-auto scrollbar-hide">
            <Link
              href="/search"
              className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeMainTab === 'search'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              🔍 Search
            </Link>
            <Link
              href="/topics"
              className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeMainTab === 'topics'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              📚 Topics
            </Link>
            <Link
              href="/chapters"
              className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeMainTab === 'chapters'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              📖 Chapters
            </Link>
            <Link
              href="/lexicon"
              className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeMainTab === 'lexicon'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              📚 Lexicon
            </Link>
            <Link
              href="/videos"
              className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeMainTab === 'videos'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              🎬 Videos
            </Link>
            <Link
              href="/poems"
              className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeMainTab === 'poems'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              📝 Poems
            </Link>
          </div>
        </div>
      </div>

      {/* Translation Tabs - Only show when on search tab */}
      {activeMainTab === 'search' && (
        <>
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex gap-1">
              <button
                onClick={() => setActiveTranslation('afghan2023')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                  activeTranslation === 'afghan2023'
                    ? 'bg-green-600 text-white shadow-lg transform scale-105 ring-2 ring-green-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                🇦🇫 Afghan 2023
              </button>
              <button
                onClick={() => setActiveTranslation('yousafzai2019')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                  activeTranslation === 'yousafzai2019'
                    ? 'bg-orange-500 text-white shadow-lg transform scale-105 ring-2 ring-orange-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                🕌 Yousafzai 2019
              </button>
              <button
                onClick={() => setActiveTranslation('unified')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                  activeTranslation === 'unified'
                    ? 'bg-purple-600 text-white shadow-lg transform scale-105 ring-2 ring-purple-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                🔀 Unified Search
              </button>
            </div>
          </div>

          {/* Translation Indicator */}
          <div className="mb-4 text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              activeTranslation === 'afghan2023'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : activeTranslation === 'yousafzai2019'
                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
            }`}>
              {activeTranslation === 'afghan2023' ? '🇦🇫' : activeTranslation === 'yousafzai2019' ? '🕌' : '🔀'}
              <span className="ml-2">
                {activeTranslation === 'afghan2023' ? 'Afghan 2023 Translation' : activeTranslation === 'yousafzai2019' ? 'Yousafzai 2019 Translation' : 'Unified Search (Both Translations)'}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Search Bar - Only show when on search tab */}
      {activeMainTab === 'search' && (
        <div className="relative z-10 mb-6">
        <div className={`absolute inset-0 rounded-lg opacity-10 ${
          activeTranslation === 'afghan2023' ? 'bg-green-500' : 'bg-orange-500'
        }`} style={{ zIndex: -1 }}></div>
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            isEnglishMode
              ? "Enter English word (e.g., 'baptize', 'love', 'peace')..."
              : "Enter Pashto text to search..."
          }
          variant="outlined"
          fullWidth
          inputProps={{
            dir: isEnglishMode ? 'ltr' : 'rtl',
            style: { textAlign: isEnglishMode ? 'left' : 'right', padding: '12px 16px' }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: isEnglishMode ? '#FFF7ED' : '#374151',
              borderColor: isEnglishMode ? '#F97316' : '#4B5563',
              color: isEnglishMode ? '#9A3412' : '#F9FAFB',
              '&:hover': {
                borderColor: isEnglishMode ? '#EA580C' : '#6B7280'
              },
              '&.Mui-focused': {
                borderColor: isEnglishMode ? '#F97316' : '#3B82F6',
                boxShadow: isEnglishMode ? '0 0 0 2px rgba(249, 115, 22, 0.3)' : '0 0 0 2px rgba(59, 130, 246, 0.5)'
              }
            },
            '& .MuiInputBase-input::placeholder': {
              color: isEnglishMode ? '#C2410C' : '#9CA3AF'
            }
          }}
          InputProps={{
            startAdornment: (
              <IconButton
                onClick={() => handleSearch()}
                disabled={isLoading}
                sx={{
                  color: isEnglishMode ? '#9A3412' : '#F9FAFB',
                  '&:disabled': { color: '#6B7280' }
                }}
              >
                {isEnglishMode ? '🇬🇧' : '🔍'}
              </IconButton>
            ),
            endAdornment: (
              <Button
                onClick={() => handleSearch()}
                disabled={isLoading}
                variant="contained"
                sx={{
                  backgroundColor: '#3B82F6',
                  color: '#FFFFFF',
                  minWidth: '80px',
                  height: '100%',
                  '&:hover': {
                    backgroundColor: '#2563EB'
                  },
                  '&:disabled': {
                    backgroundColor: '#6B7280',
                    color: '#D1D5DB'
                  }
                }}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            )
          }}
        />
        </div>
      )}
    </>
  );
}

