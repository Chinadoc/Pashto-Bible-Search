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
  translation_key: string;
  testament: string;
  text: string;
}

interface TopicsBrowserProps {
  onCategorySelect: (categoryKey: string) => void;
}

export default function TopicsBrowser({ onCategorySelect }: TopicsBrowserProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryVerses, setCategoryVerses] = useState<Verse[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);

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
            {categoryVerses.map((verse, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-green-600 dark:text-green-400 text-sm">
                    {verse.verse_ref}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {verse.book} {verse.chapter}:{verse.verse}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-2" dir="rtl">
                  {verse.text || 'No text available'}
                </p>
                {verse.pashto_word && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Word: <span className="font-semibold">{verse.pashto_word}</span>
                  </p>
                )}
              </div>
            ))}
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

