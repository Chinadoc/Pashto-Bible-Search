"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

interface FrequencyItem {
  form: string;
  root?: string;
  pos?: 'verb' | 'noun';
  frequency: number;
  dictionary?: {
    definition?: string;
    romanized?: string;
    pos?: string;
    english?: string;
  };
  morphological?: {
    relatedForms?: Array<{ form: string; count: number }>;
    inflections?: Array<{ form: string; grammatical_info: any; frequency: number }>;
  };
  verseContexts?: Array<{
    verse_ref: string;
    verse_text: string;
    book: string;
    chapter: number;
    verse: number;
  }>;
}

interface Props { onPickForm?: (form: string) => void; queryProp?: string }

export default function LexiconPanel({ onPickForm, queryProp }: Props) {
  const [frequencyData, setFrequencyData] = useState<FrequencyItem[]>([]);
  const [filteredData, setFilteredData] = useState<FrequencyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [posFilter, setPosFilter] = useState<'any' | 'verb' | 'noun'>('any');
  const [scope, setScope] = useState<'all' | 'ot' | 'nt'>('all');
  const [limit, setLimit] = useState(300);
  const [sortBy, setSortBy] = useState<'frequency' | 'form'>('frequency');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [audioMap, setAudioMap] = useState<Record<string, string>>({});
  const [searchMode, setSearchMode] = useState<'exact' | 'fuzzy' | 'regex' | 'root'>('exact');
  const [showStats, setShowStats] = useState(false);
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [showNoteForm, setShowNoteForm] = useState<string | null>(null);

  // Fetch frequency data
  const fetchFrequencyData = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        scope,
        limit: limit.toString(),
        pos: posFilter,
      });

      const response = await fetch(`/api/lexicon_frequency?${params}`);
      const data = await response.json();

      if (response.ok && data.items && data.items.length > 0) {
        setFrequencyData(data.items || []);
      } else {
        // Fallback to static JSON data
        console.log('Using fallback JSON data');
        const fallbackResponse = await fetch('/word_frequency_list.json');
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          let filteredItems: FrequencyItem[] = fallbackData.slice(0, limit).map((item: any) => ({
            form: item.pashto,
            frequency: item.frequency,
            pos: item.pos === 'verb' ? 'verb' : item.pos === 'noun' ? 'noun' : undefined,
            dictionary: item.romanization || item.definition ? {
              romanized: item.romanization || '',
              definition: item.definition || '',
              pos: item.pos || '',
              english: item.english || '',
            } : undefined,
          }));

          // Apply POS filter for fallback data
          if (posFilter !== 'any') {
            filteredItems = filteredItems.filter(item => item.pos === posFilter);
          }

          setFrequencyData(filteredItems);
        } else {
          setError('Failed to fetch frequency data');
        }
      }
    } catch (err) {
      // Fallback to static JSON data on error
      console.log('Using fallback JSON data due to error');
      try {
        const fallbackResponse = await fetch('/word_frequency_list.json');
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          let filteredItems: FrequencyItem[] = fallbackData.slice(0, limit).map((item: any) => ({
            form: item.pashto,
            frequency: item.frequency,
            pos: item.pos === 'verb' ? 'verb' : item.pos === 'noun' ? 'noun' : undefined,
            dictionary: item.romanization || item.definition ? {
              romanized: item.romanization || '',
              definition: item.definition || '',
              pos: item.pos || '',
              english: item.english || '',
            } : undefined,
          }));

          // Apply POS filter for fallback data
          if (posFilter !== 'any') {
            filteredItems = filteredItems.filter(item => item.pos === posFilter);
          }

          setFrequencyData(filteredItems);
        } else {
          setError('Failed to fetch frequency data');
        }
      } catch (fallbackErr) {
        setError('Failed to fetch frequency data');
        console.error('Error fetching frequency data:', err);
        console.error('Fallback also failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchFrequencyData();
  }, [scope, limit, posFilter]);

  // Filter and search data
  useEffect(() => {
    let filtered = frequencyData;

    // Apply search query filter with advanced modes
    if (searchQuery.trim()) {
      const query = searchQuery.trim();

      filtered = filtered.filter(item => {
        const form = item.form.toLowerCase();
        const root = (item.root || '').toLowerCase();

        switch (searchMode) {
          case 'exact':
            return form.includes(query.toLowerCase()) || root.includes(query.toLowerCase());

          case 'fuzzy':
            // Simple fuzzy matching - check for similar characters
            return form.includes(query.toLowerCase()) ||
                   root.includes(query.toLowerCase()) ||
                   levenshteinDistance(form, query.toLowerCase()) <= 2 ||
                   levenshteinDistance(root, query.toLowerCase()) <= 2;

          case 'regex':
            try {
              const regex = new RegExp(query, 'i');
              return regex.test(item.form) || regex.test(item.root || '');
            } catch {
              // Invalid regex, fall back to exact match
              return form.includes(query.toLowerCase()) || root.includes(query.toLowerCase());
            }

          case 'root':
            // Search for words that could be related to this root pattern
            return root.includes(query.toLowerCase()) ||
                   form.includes(query.toLowerCase()) ||
                   // Check if this looks like a root pattern (typically 2-4 consonants)
                   (query.length >= 2 && query.length <= 4 && /^[بپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]+$/.test(query) && root.includes(query));

          default:
            return form.includes(query.toLowerCase()) || root.includes(query.toLowerCase());
        }
      });
    }

    // Apply POS filter for local data (API data already filtered)
    if (posFilter !== 'any') {
      filtered = filtered.filter(item => item.pos === posFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'frequency') {
        comparison = a.frequency - b.frequency;
      } else if (sortBy === 'form') {
        comparison = a.form.localeCompare(b.form);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredData(filtered);
  }, [frequencyData, searchQuery, sortBy, sortOrder, posFilter, searchMode]);

  // Simple Levenshtein distance for fuzzy matching
  function levenshteinDistance(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[b.length][a.length];
  }

  // Load audio map for verse references
  const loadAudioMap = async () => {
    try {
      const response = await fetch('/api/get_audio_map');
      if (response.ok) {
        const audioData = await response.json();
        setAudioMap(audioData);
      }
    } catch (err) {
      console.warn('Failed to load audio map:', err);
    }
  };

  // Load audio map on component mount
  useEffect(() => {
    loadAudioMap();
  }, []);

  // Load user notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('pashto-lexicon-notes');
    if (savedNotes) {
      try {
        setUserNotes(JSON.parse(savedNotes));
      } catch (err) {
        console.warn('Failed to load user notes:', err);
      }
    }
  }, []);

  // Save user notes to localStorage
  const saveUserNotes = (notes: Record<string, string>) => {
    localStorage.setItem('pashto-lexicon-notes', JSON.stringify(notes));
    setUserNotes(notes);
  };

  // Add or update a user note
  const addUserNote = (word: string, note: string) => {
    const newNotes = { ...userNotes, [word]: note };
    saveUserNotes(newNotes);
    setShowNoteForm(null);
  };

  // Submit correction to API
  const submitCorrection = async (word: string, correction: string) => {
    try {
      await fetch('/api/user-corrections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, correction, timestamp: new Date().toISOString() }),
      });
      alert('تصحیح شما ارسال شد. با تشکر!');
      setShowNoteForm(null);
    } catch (err) {
      console.error('Failed to submit correction:', err);
      alert('خطا در ارسال تصحیح. لطفاً دوباره امتحان کنید.');
    }
  };

  // Export functionality
  const exportToCSV = (data: FrequencyItem[]) => {
    const headers = [
      'رتبه',
      'کلمه',
      'ریشه',
      'نوع',
      'فریکونسی',
      'لغت‌نامه',
      'تعریف',
      'رومنیزه',
      'اشکال مرتبط',
      'آیات',
      'یادداشت کاربر'
    ];

    const csvData = data.map((item, index) => [
      (index + 1).toString(),
      item.form,
      item.root || '',
      item.pos === 'verb' ? 'فعل' : item.pos === 'noun' ? 'اسم' : 'نامشخص',
      item.frequency.toString(),
      item.dictionary?.pos || '',
      item.dictionary?.definition || '',
      item.dictionary?.romanized || '',
      item.morphological?.relatedForms?.map(f => `${f.form}(${f.count})`).join('; ') || '',
      item.verseContexts?.map(c => c.verse_ref).join('; ') || '',
      userNotes[item.form] || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pashto_frequency_list_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sync external query if provided
  useEffect(() => {
    if (typeof queryProp === 'string') {
      setSearchQuery(queryProp);
    }
  }, [queryProp]);

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4" dir="rtl">
      <h2 className="text-xl font-bold mb-4">لغت نامه - فریکونسی لیست</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Pashto Lexicon - Word frequency list from Bible text
      </p>

      {/* Controls */}
      <div className="mb-6 space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        {/* Search Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              searchMode === 'exact' ? 'جستجوی دقیق...' :
              searchMode === 'fuzzy' ? 'جستجوی تقریبی...' :
              searchMode === 'regex' ? 'عبارت منظم (regex)...' :
              'جستجوی ریشه...'
            }
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
          />
          <select
            value={searchMode}
            onChange={(e) => setSearchMode(e.target.value as 'exact' | 'fuzzy' | 'regex' | 'root')}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
          >
            <option value="exact">دقیق</option>
            <option value="fuzzy">تقریبی</option>
            <option value="regex">عبارت منظم</option>
            <option value="root">ریشه</option>
          </select>
          <button
            onClick={fetchFrequencyData}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            disabled={loading}
          >
            {loading ? 'بارگذاری...' : 'بارگذاری مجدد'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowStats(!showStats)}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-2"
          >
            📊 آمار {showStats ? 'مخفی' : 'نمایش'}
          </button>
          <button
            onClick={() => exportToCSV(filteredData)}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
          >
            📥 خروجی CSV
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1">محدوده</label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as 'all' | 'ot' | 'nt')}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
            >
              <option value="all">کل کتاب مقدس</option>
              <option value="ot">عهد عتیق</option>
              <option value="nt">عهد جدید</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">نوع کلمه</label>
            <select
              value={posFilter}
              onChange={(e) => setPosFilter(e.target.value as 'any' | 'verb' | 'noun')}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
            >
              <option value="any">همه</option>
              <option value="verb">فعل‌ها</option>
              <option value="noun">اسم‌ها</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">تعداد نتایج</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
            >
              <option value={100}>۱۰۰</option>
              <option value={300}>۳۰۰</option>
              <option value={500}>۵۰۰</option>
              <option value={1000}>۱۰۰۰</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">مرتب‌سازی</label>
            <div className="flex gap-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'frequency' | 'form')}
                className="flex-1 p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
              >
                <option value="frequency">فریکونسی</option>
                <option value="form">حرف الفبا</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  رتبه
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  کلمه
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ریشه
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  نوع
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  فریکونسی
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  لغت‌نامه
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  اشکال مرتبط
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  صوت
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  آیات
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  یادداشت‌ها
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-3 py-4 text-center text-gray-500">
                    بارگذاری...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-3 py-4 text-center text-gray-500">
                    هیچ نتیجه‌ای یافت نشد
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={`${item.form}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {index + 1}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 font-mono">
                      {item.form}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.root || '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                        item.pos === 'verb'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : item.pos === 'noun'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {item.pos === 'verb' ? 'فعل' : item.pos === 'noun' ? 'اسم' : 'نامشخص'}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.frequency.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.dictionary?.definition ? (
                        <div className="max-w-xs truncate" title={item.dictionary.definition}>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {item.dictionary.romanized && `${item.dictionary.romanized}: `}
                          </span>
                          <span className="text-xs">
                            {item.dictionary.definition}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.morphological?.relatedForms && item.morphological.relatedForms.length > 0 ? (
                        <div className="max-w-xs">
                          {item.morphological.relatedForms.slice(0, 3).map((form, idx) => (
                            <div key={idx} className="text-xs">
                              {form.form} ({form.count})
                            </div>
                          ))}
                          {item.morphological.relatedForms.length > 3 && (
                            <div className="text-xs text-gray-400">+{item.morphological.relatedForms.length - 3} more</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {Object.keys(audioMap).length > 0 ? (
                        <span className="text-xs">
                          📊
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.verseContexts && item.verseContexts.length > 0 ? (
                        <div className="max-w-xs">
                          {item.verseContexts.slice(0, 2).map((ctx, idx) => (
                            <div key={idx} className="text-xs">
                              {ctx.verse_ref}
                            </div>
                          ))}
                          {item.verseContexts.length > 2 && (
                            <div className="text-xs text-gray-400">+{item.verseContexts.length - 2} more</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {showNoteForm === item.form ? (
                        <div className="space-y-2">
                          <textarea
                            className="w-full p-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                            placeholder="یادداشت یا تصحیح خود را بنویسید..."
                            rows={2}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.ctrlKey) {
                                const note = (e.target as HTMLTextAreaElement).value.trim();
                                if (note) {
                                  submitCorrection(item.form, note);
                                }
                              }
                              if (e.key === 'Escape') {
                                setShowNoteForm(null);
                              }
                            }}
                          />
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                const note = (e.target as any).previousElementSibling?.querySelector('textarea')?.value?.trim();
                                if (note) {
                                  submitCorrection(item.form, note);
                                }
                              }}
                              className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              ارسال
                            </button>
                            <button
                              onClick={() => setShowNoteForm(null)}
                              className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                              لغو
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {userNotes[item.form] && (
                            <span className="text-xs text-blue-600 dark:text-blue-400">✓</span>
                          )}
                          <button
                            onClick={() => setShowNoteForm(item.form)}
                            className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            {userNotes[item.form] ? 'ویرایش' : 'افزودن'}
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onPickForm?.(item.form)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        جستجو
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics Panel */}
      {showStats && filteredData.length > 0 && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">📊 آمار فریکونسی</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Basic Statistics */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {filteredData.length.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">کل کلمات</div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round(filteredData.reduce((sum, item) => sum + item.frequency, 0) / filteredData.length).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">میانگین فریکونسی</div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {filteredData[0]?.frequency.toLocaleString() || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">بالاترین فریکونسی</div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {filteredData.reduce((sum, item) => sum + item.frequency, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">مجموع فریکونسی</div>
            </div>
          </div>

          {/* Distribution Charts */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* POS Distribution */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">توزیع بر اساس نوع کلمه</h4>
              <div className="space-y-2">
                {Object.entries(
                  filteredData.reduce((acc, item) => {
                    const pos = item.pos === 'verb' ? 'فعل‌ها' : item.pos === 'noun' ? 'اسم‌ها' : 'نامشخص';
                    acc[pos] = (acc[pos] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([pos, count]) => (
                  <div key={pos} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{pos}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            pos === 'فعل‌ها' ? 'bg-blue-500' :
                            pos === 'اسم‌ها' ? 'bg-green-500' : 'bg-gray-500'
                          }`}
                          style={{ width: `${(count / filteredData.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Frequency Ranges */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">توزیع فریکونسی</h4>
              <div className="space-y-2">
                {[
                  { label: 'کم (۱-۱۰)', min: 1, max: 10 },
                  { label: 'متوسط (۱۱-۱۰۰)', min: 11, max: 100 },
                  { label: 'زیاد (۱۰۱-۱۰۰۰)', min: 101, max: 1000 },
                  { label: 'بسیار زیاد (۱۰۰۰+)', min: 1001, max: Infinity },
                ].map(range => {
                  const count = filteredData.filter(item => item.frequency >= range.min && item.frequency <= range.max).length;
                  return (
                    <div key={range.label} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{range.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 bg-purple-500 rounded-full"
                            style={{ width: `${(count / filteredData.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {filteredData.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          نمایش {filteredData.length} نتیجه از {frequencyData.length} کلمه
        </div>
      )}
    </div>
  );
}









