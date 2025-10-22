"use client";

import { useState, useEffect } from "react";

interface Props {
  onChapterSelect: (book: string, chapter: number) => void;
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

// Chapter counts for each book
const CHAPTER_COUNTS: Record<string, number> = {
  // Old Testament
  'Genesis': 50, 'Exodus': 40, 'Leviticus': 27, 'Numbers': 36, 'Deuteronomy': 34,
  'Joshua': 24, 'Judges': 21, 'Ruth': 4, '1 Samuel': 31, '2 Samuel': 24,
  '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36,
  'Ezra': 10, 'Nehemiah': 13, 'Esther': 10, 'Job': 42, 'Psalms': 150,
  'Proverbs': 31, 'Ecclesiastes': 12, 'Song of Solomon': 8, 'Isaiah': 66,
  'Jeremiah': 52, 'Lamentations': 5, 'Ezekiel': 48, 'Daniel': 12, 'Hosea': 14,
  'Joel': 3, 'Amos': 9, 'Obadiah': 1, 'Jonah': 4, 'Micah': 7, 'Nahum': 3,
  'Habakkuk': 3, 'Zephaniah': 3, 'Haggai': 2, 'Zechariah': 14, 'Malachi': 4,
  // New Testament
  'Matthew': 28, 'Mark': 16, 'Luke': 24, 'John': 21, 'Acts': 28, 'Romans': 16,
  '1 Corinthians': 16, '2 Corinthians': 13, 'Galatians': 6, 'Ephesians': 6,
  'Philippians': 4, 'Colossians': 4, '1 Thessalonians': 5, '2 Thessalonians': 3,
  '1 Timothy': 6, '2 Timothy': 4, 'Titus': 3, 'Philemon': 1, 'Hebrews': 13,
  'James': 5, '1 Peter': 5, '2 Peter': 3, '1 John': 5, '2 John': 1, '3 John': 1,
  'Jude': 1, 'Revelation': 22
};

export default function ChapterNavigator({ onChapterSelect }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'ot' | 'nt'>('all');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [showChapterSelector, setShowChapterSelector] = useState(false);

  const getBooksToShow = () => {
    switch (activeTab) {
      case 'ot': return OT_BOOKS;
      case 'nt': return NT_BOOKS;
      default: return ALL_BOOKS;
    }
  };

  const getChapters = (book: string): number[] => {
    const count = CHAPTER_COUNTS[book] || 0;
    return Array.from({ length: count }, (_, i) => i + 1);
  };

  const handleBookSelect = (book: string) => {
    setSelectedBook(book);
    setSelectedChapter(null);
    setIsExpanded(false);
    setShowChapterSelector(true);
  };

  const handleChapterSelect = (chapter: number) => {
    if (selectedBook) {
      setSelectedChapter(chapter);
      setShowChapterSelector(false);
      onChapterSelect(selectedBook, chapter);
    }
  };

  const getSelectedText = () => {
    if (selectedBook && selectedChapter) {
      return `${selectedBook} ${selectedChapter}`;
    }
    if (selectedBook) {
      return `${selectedBook} - Select Chapter`;
    }
    return "Browse by Chapter";
  };

  return (
    <div className="w-full">
      {/* Main dropdown button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Chapter Navigation:</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {getSelectedText()}
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

      {/* Book selector */}
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

          {/* Books grid */}
          <div className="max-h-64 overflow-y-auto p-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
              {getBooksToShow().map(book => (
                <button
                  key={book}
                  onClick={() => handleBookSelect(book)}
                  className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedBook === book
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

      {/* Chapter selector */}
      {showChapterSelector && selectedBook && (
        <div className="mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Select Chapter in {selectedBook}
            </h3>
            <button
              onClick={() => {
                setShowChapterSelector(false);
                setSelectedBook(null);
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto p-3">
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2">
              {getChapters(selectedBook).map(chapter => (
                <button
                  key={chapter}
                  onClick={() => handleChapterSelect(chapter)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedChapter === chapter
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                  }`}
                >
                  {chapter}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
