"use client";

import { useState } from "react";

interface Props {
  bookFilter: string | null;
  setBookFilter: (book: string | null) => void;
}

// All 66 books of the Bible in order
const ALL_BOOKS = [
  // Old Testament (39 books)
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah",
  "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
  "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah",
  "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
  // New Testament (27 books)
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
  "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
  "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
  "1 John", "2 John", "3 John", "Jude", "Revelation"
];

const OT_BOOKS = ALL_BOOKS.slice(0, 39);
const NT_BOOKS = ALL_BOOKS.slice(39);

export default function BookSelector({ bookFilter, setBookFilter }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'ot' | 'nt'>('all');

  const getBooksToShow = () => {
    switch (activeTab) {
      case 'ot': return OT_BOOKS;
      case 'nt': return NT_BOOKS;
      default: return ALL_BOOKS;
    }
  };

  const getSelectedBookName = () => {
    return bookFilter || "All Books";
  };

  return (
    <div className="w-full">
      {/* Collapsed state - dropdown button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Filter by Book:</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {getSelectedBookName()}
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

      {/* Expanded state - full book selector */}
      {isExpanded && (
        <div className="mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { key: 'all', label: 'All Books', count: ALL_BOOKS.length },
              { key: 'ot', label: 'Old Testament', count: OT_BOOKS.length },
              { key: 'nt', label: 'New Testament', count: NT_BOOKS.length }
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

          {/* Clear filter option */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setBookFilter(null);
                setIsExpanded(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                bookFilter === null
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              ✨ Show All Books
            </button>
          </div>

          {/* Books grid */}
          <div className="max-h-64 overflow-y-auto p-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
              {getBooksToShow().map(book => (
                <button
                  key={book}
                  onClick={() => {
                    setBookFilter(book);
                    setIsExpanded(false);
                  }}
                  className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    bookFilter === book
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {book}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
