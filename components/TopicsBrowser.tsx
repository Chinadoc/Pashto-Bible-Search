'use client';

import { useState, useEffect } from 'react';

interface Category {
  category_key: string;
  category_name: string;
  description: string | null;
  word_count?: number;
  verse_count?: number;
}

interface Verse {
  verse_ref: string;
  book: string;
  chapter: number;
  verse: number;
  pashto_word: string;
  english_translation?: string | null;
  romanization?: string | null;
  translation_key: string;
  testament: string;
  text: string;
  audio_url?: string | null;
}

interface TopicsBrowserProps {
  onCategorySelect: (categoryKey: string) => void;
}

// Helper function to highlight a word in text
function highlightWord(text: string, word: string): string {
  if (!text || !word) return text;
  
  // Escape special regex characters in the word
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Create a regex that matches the word as a whole word (with word boundaries)
  // Also handle cases where the word might be part of a compound or have attached pronouns
  const regex = new RegExp(`(${escapedWord})`, 'gi');
  
  return text.replace(regex, '<mark class="bg-yellow-300 dark:bg-yellow-700 font-semibold">$1</mark>');
}

export default function TopicsBrowser({ onCategorySelect }: TopicsBrowserProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryVerses, setCategoryVerses] = useState<Verse[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/topics/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryVerses = async (categoryKey: string) => {
    setLoadingVerses(true);
    setSelectedCategory(categoryKey);
    try {
      const response = await fetch(`/api/topics/verses?category=${encodeURIComponent(categoryKey)}&limit=200`);
      if (response.ok) {
        const data = await response.json();
        setCategoryVerses(data.verses || []);
      }
    } catch (error) {
      console.error('Failed to load category verses:', error);
    } finally {
      setLoadingVerses(false);
    }
  };

  const formatCategoryName = (key: string): string => {
    return key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const handleAudioPlay = (verseRef: string) => {
    setPlayingAudio(verseRef);
  };

  const handleAudioEnd = () => {
    setPlayingAudio(null);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Loading topics...</p>
      </div>
    );
  }

  // If a category is selected, show verses
  if (selectedCategory) {
    const category = categories.find(c => c.category_key === selectedCategory);
    return (
      <div className="space-y-4">
        <button
          onClick={() => {
            setSelectedCategory(null);
            setCategoryVerses([]);
          }}
          className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          ← Back to Topics
        </button>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {category?.category_name || formatCategoryName(selectedCategory)}
          {category?.verse_count !== undefined && (
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
              ({category.verse_count} verses)
            </span>
          )}
        </h3>

        {loadingVerses ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Loading verses...</p>
          </div>
        ) : categoryVerses.length > 0 ? (
          <div className="space-y-3">
            {categoryVerses.map((verse, idx) => {
              const highlightedText = highlightWord(verse.text || '', verse.pashto_word);
              const isPlaying = playingAudio === verse.verse_ref;
              
              return (
                <div
                  key={idx}
                  className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-green-600 dark:text-green-400 text-sm">
                      {verse.verse_ref}
                    </span>
                    <div className="flex items-center gap-2">
                      {verse.audio_url && (
                        <button
                          onClick={() => {
                            const audio = document.getElementById(`audio-${idx}`) as HTMLAudioElement;
                            if (audio) {
                              if (isPlaying) {
                                audio.pause();
                                audio.currentTime = 0;
                              } else {
                                audio.play();
                              }
                            }
                          }}
                          className="p-1.5 rounded-full bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                          title={isPlaying ? 'Stop audio' : 'Play audio'}
                        >
                          {isPlaying ? (
                            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          )}
                        </button>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {verse.book} {verse.chapter}:{verse.verse}
                      </span>
                    </div>
                  </div>
                  
                  {verse.audio_url && (
                    <audio
                      id={`audio-${idx}`}
                      src={verse.audio_url}
                      onPlay={() => handleAudioPlay(verse.verse_ref)}
                      onEnded={handleAudioEnd}
                      onPause={handleAudioEnd}
                      preload="none"
                      className="hidden"
                    />
                  )}
                  
                  <p 
                    className="text-gray-700 dark:text-gray-300 mb-2" 
                    dir="rtl"
                    dangerouslySetInnerHTML={{ __html: highlightedText || 'No text available' }}
                  />
                  
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {verse.pashto_word}
                    </span>
                    {verse.romanization && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                        ({verse.romanization})
                      </span>
                    )}
                    {verse.english_translation && (
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        — {verse.english_translation}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No verses found for this category.
          </p>
        )}
      </div>
    );
  }

  // Show clickable menu of topics
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((category) => (
          <button
            key={category.category_key}
            onClick={() => loadCategoryVerses(category.category_key)}
            className="w-full text-left p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-600 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all cursor-pointer"
          >
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {category.category_name || formatCategoryName(category.category_key)}
            </h3>
            {category.verse_count !== undefined && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {category.verse_count} {category.verse_count === 1 ? 'verse' : 'verses'}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

