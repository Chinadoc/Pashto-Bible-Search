"use client";

/**
 * SearchHeader Component
 * Extracted header section with title, tabs, translation selector, and search input
 */

import { TextField, Button, IconButton } from '@mui/material';
import Link from 'next/link';
import type { SearchLanguage } from '@/types';

interface SearchHeaderProps {
  query: string;
  setQuery: (query: string) => void;
  handleSearch: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  activeMainTab: 'search' | 'topics' | 'chapters' | 'lexicon' | 'videos' | 'poems' | 'typer';
  activeTranslation: 'afghan2023' | 'yousafzai2019' | 'unified';
  setActiveTranslation: (translation: 'afghan2023' | 'yousafzai2019' | 'unified') => void;
  searchLanguage: SearchLanguage;
  isEnglishMode: boolean;
}

const NAV_TABS = [
  { href: '/search', label: '🔍 Search', key: 'search' },
  { href: '/topics', label: '📚 Topics', key: 'topics' },
  { href: '/chapters', label: '📖 Chapters', key: 'chapters' },
  { href: '/lexicon', label: '📚 Lexicon', key: 'lexicon' },
  { href: '/videos', label: '🎬 Videos', key: 'videos' },
  { href: '/poems', label: '📝 Poems', key: 'poems' },
  { href: '/typer', label: '⌨️ Typer', key: 'typer' },
] as const;

const TRANSLATION_META = {
  afghan2023: {
    label: 'Afghan 2023 Translation',
    emoji: '🇦🇫',
    chipClass: 'text-emerald-200',
  },
  yousafzai2019: {
    label: 'Yousafzai 2019 Translation',
    emoji: '🕌',
    chipClass: 'text-orange-200',
  },
  unified: {
    label: 'Unified Search (Both Translations)',
    emoji: '🔀',
    chipClass: 'text-purple-200',
  },
} as const;

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
  const translation = TRANSLATION_META[activeTranslation];

  return (
    <>
      <header className="search-header">
        <h1
          className={`text-3xl sm:text-4xl font-bold mb-2 transition-colors ${isEnglishMode ? 'text-orange-200' : 'text-white'
            }`}
        >
          Pashto Bible Search
        </h1>
        <p
          className={`search-subtitle text-base sm:text-lg ${isEnglishMode ? 'text-orange-200/80' : 'text-slate-200/80'
            }`}
        >
          {isEnglishMode
            ? 'Searching in English — Finding Pashto translations'
            : 'Search the Bible in Pashto with linguistic analysis'}
        </p>
      </header>

      <div className="flex justify-center mb-6">
        <div className="w-full max-w-4xl">
          <div className="nav-pill scrollbar-hide">
            {NAV_TABS.map((tab) => (
              <Link
                key={tab.key}
                href={tab.href}
                className={`nav-pill__link ${activeMainTab === tab.key ? 'is-active' : ''}`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-5">
        <div className="translation-toggle">
          <button
            type="button"
            onClick={() => setActiveTranslation('afghan2023')}
            className={`translation-toggle__button translation-toggle__button--afghan ${activeTranslation === 'afghan2023' ? 'is-active' : ''
              }`}
          >
            🇦🇫 Afghan 2023
          </button>
          <button
            type="button"
            onClick={() => setActiveTranslation('yousafzai2019')}
            className={`translation-toggle__button translation-toggle__button--yousafzai ${activeTranslation === 'yousafzai2019' ? 'is-active' : ''
              }`}
          >
            🕌 Yousafzai 2019
          </button>
          <button
            type="button"
            onClick={() => setActiveTranslation('unified')}
            className={`translation-toggle__button translation-toggle__button--unified ${activeTranslation === 'unified' ? 'is-active' : ''
              }`}
          >
            🔀 Unified Search
          </button>
        </div>
      </div>

      <div className="mb-4 text-center">
        <div className={`translation-chip ${translation.chipClass}`}>
          {translation.emoji}
          <span>{translation.label}</span>
        </div>
      </div>

      <div className="search-bar mb-6">
        <div className="search-bar__inner">
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isEnglishMode
                ? "Enter English word (e.g., 'baptize', 'love', 'peace')..."
                : 'Enter Pashto text to search...'
            }
            variant="outlined"
            fullWidth
            inputProps={{
              dir: isEnglishMode ? 'ltr' : 'rtl',
              style: { textAlign: isEnglishMode ? 'left' : 'right', padding: '12px 16px' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: isEnglishMode ? 'rgba(255, 247, 237, 0.95)' : 'rgba(15,23,42,0.9)',
                borderRadius: '0.75rem',
                borderColor: 'transparent',
                color: isEnglishMode ? '#7C2D12' : '#F9FAFB',
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.25)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: isEnglishMode ? '#fb923c' : '#60a5fa',
                  boxShadow: `0 0 0 2px ${isEnglishMode ? 'rgba(249, 115, 22, 0.35)' : 'rgba(96, 165, 250, 0.4)'}`,
                },
              },
              '& input': {
                color: isEnglishMode ? '#7C2D12' : '#F9FAFB',
                fontSize: '1rem',
              },
            }}
            InputProps={{
              startAdornment: (
                <IconButton
                  onClick={() => handleSearch()}
                  disabled={isLoading}
                  sx={{
                    color: isEnglishMode ? '#9A3412' : '#F9FAFB',
                    '&:disabled': { color: '#6B7280' },
                  }}
                >
                  {searchLanguage === 'english' ? '🇬🇧' : '🔍'}
                </IconButton>
              ),
              endAdornment: (
                <Button
                  onClick={() => handleSearch()}
                  disabled={isLoading}
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(120deg, rgba(90, 166, 255, 0.95), rgba(98, 233, 255, 0.85))',
                    color: '#041229',
                    px: 3,
                    py: 1,
                    borderRadius: '999px',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(120deg, rgba(90, 166, 255, 1), rgba(98, 233, 255, 0.95))',
                      boxShadow: '0 10px 20px rgba(78, 133, 243, 0.35)',
                    },
                    '&:disabled': {
                      background: 'rgba(148, 163, 184, 0.4)',
                      color: '#e5e7eb',
                    },
                  }}
                >
                  {isLoading ? 'Searching…' : 'Search'}
                </Button>
              ),
            }}
          />
        </div>
      </div>
    </>
  );
}
