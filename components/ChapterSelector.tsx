"use client";

import { useState, useEffect } from "react";
import type { BookChapterInfo, ChapterInfo } from "../types";

interface Props {
  onChapterSelect: (book: string, chapter: number | null) => void;
  selectedBook: string | null;
  selectedChapter: number | null;
}

const OT_BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah",
  "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
  "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah",
  "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"
];

const NT_BOOKS = [
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
  "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
  "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
  "1 John", "2 John", "3 John", "Jude", "Revelation"
];

export default function ChapterSelector({ onChapterSelect, selectedBook, selectedChapter }: Props) {
  const [books, setBooks] = useState<BookChapterInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'ot' | 'nt'>('all');

  // Load books and chapters data
  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/chapters');
        if (response.ok) {
          const data = await response.json();
          setBooks(data.books || []);
        }
      } catch (error) {
        console.error('Failed to load books:', error);
      }
      setIsLoading(false);
    };

    loadBooks();
  }, []);

  const getBooksToShow = () => {
    switch (activeTab) {
      case 'ot': return books.filter(book => OT_BOOKS.includes(book.book));
      case 'nt': return books.filter(book => NT_BOOKS.includes(book.book));
      default: return books;
    }
  };

  const getSelectedDisplayText = () => {
    if (!selectedBook) return "Browse by Chapter";
    if (selectedChapter) return `${selectedBook} ${selectedChapter}`;
    return selectedBook;
  };

  const handleBookSelect = (book: string) => {
    onChapterSelect(book, null);
    setIsExpanded(false);
  };

  const handleChapterSelect = (book: string, chapter: number) => {
    onChapterSelect(book, chapter);
    setIsExpanded(false);
  };

  const handleClear = () => {
    onChapterSelect("", null);
    setIsExpanded(false);
  };

  const selectedBookData = books.find(b => b.book === selectedBook);

  return (
    <div className="w-full">
      {/* Collapsed state - dropdown button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Browse:</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {getSelectedDisplayText()}
          </span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded state - full chapter selector */}
      {isExpanded && (
        <div className="mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { key: 'all', label: 'All Books', count: books.length },
              { key: 'ot', label: 'Old Testament', count: books.filter(b => OT_BOOKS.includes(b.book)).length },
              { key: 'nt', label: 'New Testament', count: books.filter(b => NT_BOOKS.includes(b.book)).length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'all' | 'ot' | 'nt')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-b-2 border-blue-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Clear selection option */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={handleClear}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                !selectedBook
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              ✨ Browse All Books
            </button>
          </div>

          {/* Books and chapters */}
          <div className="max-h-96 overflow-y-auto p-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-sm text-gray-600">Loading books...</span>
              </div>
            ) : (
              <div className="space-y-1">
                {getBooksToShow().map(bookData => (
                  <div key={bookData.book} className="space-y-1">
                    {/* Book header */}
                    <button
                      onClick={() => handleBookSelect(bookData.book)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedBook === bookData.book && !selectedChapter
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{bookData.book}</span>
                        <span className="text-xs text-gray-500">
                          {bookData.totalVerses} verses
                        </span>
                      </div>
                    </button>

                    {/* Chapter options (only show if this book is selected) */}
                    {selectedBook === bookData.book && bookData.chapters.length > 0 && (
                      <div className="ml-4 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-3">
                        {bookData.chapters.map((chapter: ChapterInfo) => (
                          <button
                            key={chapter.chapter}
                            onClick={() => handleChapterSelect(bookData.book, chapter.chapter)}
                            className={`w-full text-left px-3 py-1 rounded-md text-xs transition-colors ${
                              selectedChapter === chapter.chapter
                                ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 font-medium'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            Chapter {chapter.chapter} ({chapter.verseCount} verses)
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {getBooksToShow().length === 0 && !isLoading && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No books found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
