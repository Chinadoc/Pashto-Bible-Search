"use client";

/**
 * SearchHero Component
 * Reimagined hero-style search interface with modern design
 */

import { TextField, Button, IconButton } from '@mui/material';
import Link from 'next/link';
import type { SearchLanguage } from '@/types';

interface SearchHeroProps {
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

export default function SearchHero({
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
}: SearchHeroProps) {
  return (
    <>
      {/* Hero Section with Gradient Background */}
      <div className="hero-gradient min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-4xl w-full space-y-8 fade-in">
          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg">
              {isEnglishMode ? '🇬🇧 English Search' : 'پښتو انجیل'}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              {isEnglishMode
                ? 'Discover the Bible in Pashto through English translations'
                : 'Search the Bible in Pashto with advanced linguistic tools'}
            </p>
          </div>

          {/* Translation Selector - Floating Pills */}
          <div className="flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => setActiveTranslation('afghan2023')}
              className={`tab-pill ${activeTranslation === 'afghan2023' ? 'active' : ''}`}
              style={{
                background: activeTranslation === 'afghan2023'
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : undefined
              }}
            >
              <span className="text-xl">🇦🇫</span>
              <span>Afghan 2023</span>
            </button>
            <button
              onClick={() => setActiveTranslation('yousafzai2019')}
              className={`tab-pill ${activeTranslation === 'yousafzai2019' ? 'active' : ''}`}
              style={{
                background: activeTranslation === 'yousafzai2019'
                  ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
                  : undefined
              }}
            >
              <span className="text-xl">🕌</span>
              <span>Yousafzai 2019</span>
            </button>
            <button
              onClick={() => setActiveTranslation('unified')}
              className={`tab-pill ${activeTranslation === 'unified' ? 'active' : ''}`}
              style={{
                background: activeTranslation === 'unified'
                  ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                  : undefined
              }}
            >
              <span className="text-xl">🔀</span>
              <span>Unified</span>
            </button>
          </div>

          {/* Search Card */}
          <div className="search-card">
            <TextField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isEnglishMode
                  ? "Search in English... (e.g., 'love', 'peace', 'baptize')"
                  : "د پښتو متن لټول... (مثلاً: خدای، محبت، امن)"
              }
              variant="outlined"
              fullWidth
              autoFocus
              inputProps={{
                dir: isEnglishMode ? 'ltr' : 'rtl',
                style: {
                  textAlign: isEnglishMode ? 'left' : 'right',
                  fontSize: '1.25rem',
                  padding: '1rem 1.5rem'
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  backgroundColor: 'var(--surface-elevated)',
                  border: '2px solid var(--border)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'var(--accent)',
                  },
                  '&.Mui-focused': {
                    borderColor: 'var(--accent)',
                    boxShadow: '0 0 0 4px rgba(139, 92, 246, 0.1)'
                  },
                  '& fieldset': {
                    border: 'none'
                  }
                }
              }}
              InputProps={{
                startAdornment: !isEnglishMode && (
                  <IconButton
                    onClick={() => handleSearch()}
                    disabled={isLoading}
                    sx={{ color: 'var(--accent)' }}
                  >
                    🔍
                  </IconButton>
                ),
                endAdornment: (
                  <Button
                    onClick={() => handleSearch()}
                    disabled={isLoading}
                    variant="contained"
                    size="large"
                    sx={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      color: '#fff',
                      borderRadius: '12px',
                      padding: '0.75rem 2rem',
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                        boxShadow: '0 6px 16px rgba(139, 92, 246, 0.4)',
                      },
                      '&:disabled': {
                        background: '#94a3b8',
                        color: '#fff'
                      }
                    }}
                  >
                    {isLoading ? '⏳ Searching...' : '✨ Search'}
                  </Button>
                )
              }}
            />

            {/* Search Tips */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <span className="text-sm px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                💡 Try: "محبت" (love)
              </span>
              <span className="text-sm px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                🔤 English: "peace"
              </span>
              <span className="text-sm px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                📖 Book: "John 3:16"
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Navigation */}
      <nav className="floating-nav">
        <Link href="/search" className={`nav-item ${activeMainTab === 'search' ? 'active' : ''}`}>
          🔍 Search
        </Link>
        <Link href="/chapters" className={`nav-item ${activeMainTab === 'chapters' ? 'active' : ''}`}>
          📖 Chapters
        </Link>
        <Link href="/topics" className={`nav-item ${activeMainTab === 'topics' ? 'active' : ''}`}>
          📚 Topics
        </Link>
        <Link href="/lexicon" className={`nav-item ${activeMainTab === 'lexicon' ? 'active' : ''}`}>
          📝 Lexicon
        </Link>
        <Link href="/videos" className={`nav-item ${activeMainTab === 'videos' ? 'active' : ''}`}>
          🎬 Videos
        </Link>
        <Link href="/poems" className={`nav-item ${activeMainTab === 'poems' ? 'active' : ''}`}>
          ✍️ Poems
        </Link>
      </nav>
    </>
  );
}
