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
      <header className="text-center mb-8">
        <h1 className={`text-4xl sm:text-5xl font-bold mb-3 transition-colors ${isEnglishMode ? 'text-orange-700 dark:text-orange-300' : 'text-gray-900 dark:text-gray-100'}`}>
          Pashto Bible Search
        </h1>
        <p className={`text-base sm:text-lg transition-colors ${isEnglishMode ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'}`}>
          {isEnglishMode ? 'Searching in English - Finding Pashto translations' : 'Search the Bible in Pashto with linguistic analysis'}
        </p>
      </header>

      {/* Main Tabs */}
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-5xl">
          <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl p-2 flex gap-2 overflow-x-auto scrollbar-hide">
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

      {/* Translation Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl p-2 flex gap-2">
          <button
            onClick={() => setActiveTranslation('afghan2023')}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTranslation === 'afghan2023'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-lg">🇦🇫</span>
            <span className="hidden sm:inline">Afghan 2023</span>
          </button>
          <button
            onClick={() => setActiveTranslation('yousafzai2019')}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTranslation === 'yousafzai2019'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-lg">🕌</span>
            <span className="hidden sm:inline">Yousafzai 2019</span>
          </button>
          <button
            onClick={() => setActiveTranslation('unified')}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTranslation === 'unified'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-lg">🔀</span>
            <span className="hidden sm:inline">Unified</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-3xl">
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
              style: { textAlign: isEnglishMode ? 'left' : 'right', padding: '14px 18px', fontSize: '16px' }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '2px solid',
                borderColor: isEnglishMode ? '#fb923c' : '#e5e7eb',
                '&:hover': {
                  borderColor: isEnglishMode ? '#f97316' : '#d1d5db'
                },
                '&.Mui-focused': {
                  borderColor: '#3b82f6',
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
                },
                '.dark &': {
                  backgroundColor: '#1f2937',
                  borderColor: isEnglishMode ? '#f97316' : '#374151',
                  color: '#f9fafb'
                }
              },
              '& .MuiInputBase-input::placeholder': {
                color: isEnglishMode ? '#c2410c' : '#9ca3af',
                opacity: 0.7
              }
            }}
            InputProps={{
              startAdornment: (
                <span className="text-2xl mr-2">
                  {isEnglishMode ? '🇬🇧' : '🔍'}
                </span>
              ),
              endAdornment: (
                <Button
                  onClick={() => handleSearch()}
                  disabled={isLoading}
                  variant="contained"
                  sx={{
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    minWidth: '100px',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '15px',
                    '&:hover': {
                      backgroundColor: '#2563eb'
                    },
                    '&:disabled': {
                      backgroundColor: '#9ca3af',
                      color: '#e5e7eb'
                    }
                  }}
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
              )
            }}
          />
        </div>
      </div>
    </>
  );
}

