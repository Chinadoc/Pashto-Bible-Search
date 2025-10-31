'use client';

import { useState, useEffect } from 'react';

interface Category {
  category_key: string;
  category_name: string;
  description: string | null;
  word_count?: number;
  verse_count?: number;
}

interface TopicsBrowserProps {
  onCategorySelect: (categoryKey: string) => void;
}

export default function TopicsBrowser({ onCategorySelect }: TopicsBrowserProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryVerses, setCategoryVerses] = useState<any[]>([]);
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
      const response = await fetch(`/api/topics/verses?category=${encodeURIComponent(categoryKey)}&limit=50`);
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

  const filteredCategories = categories.filter(cat =>
    cat.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.category_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group categories by parent (e.g., body_parts_*)
  const groupedCategories = filteredCategories.reduce((acc, cat) => {
    const parts = cat.category_key.split('_');
    const parent = parts.length > 1 ? parts.slice(0, -1).join('_') : 'other';
    if (!acc[parent]) {
      acc[parent] = [];
    }
    acc[parent].push(cat);
    return acc;
  }, {} as Record<string, Category[]>);

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

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search categories (e.g., 'body', 'family', 'colors')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groupedCategories).map(([parent, cats]) => (
          <div key={parent} className="space-y-2">
            {cats.map((category) => (
              <button
                key={category.category_key}
                onClick={() => {
                  loadCategoryVerses(category.category_key);
                  onCategorySelect(category.category_key);
                }}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedCategory === category.category_key
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 bg-white dark:bg-gray-800'
                }`}
              >
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {category.category_name || formatCategoryName(category.category_key)}
                </h3>
                {category.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {category.description}
                  </p>
                )}
                {category.word_count !== undefined && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {category.word_count} words
                    {category.verse_count !== undefined && ` • ${category.verse_count} verses`}
                  </p>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Selected Category Verses */}
      {selectedCategory && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Verses in "{categories.find(c => c.category_key === selectedCategory)?.category_name || selectedCategory}"
          </h3>
          {loadingVerses ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
            </div>
          ) : categoryVerses.length > 0 ? (
            <div className="space-y-3">
              {categoryVerses.map((verse, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-green-600 dark:text-green-400 text-sm">
                      {verse.verse_ref}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {verse.book} {verse.chapter}:{verse.verse}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300" dir="rtl">
                    {verse.text || 'No text available'}
                  </p>
                  {verse.pashto_word && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Word: <span className="font-semibold">{verse.pashto_word}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No verses found for this category.</p>
          )}
        </div>
      )}
    </div>
  );
}

