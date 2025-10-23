"use client";

import { useState, useEffect } from "react";
import AudioPlayer from "./AudioPlayer";

interface Verse {
  ref: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  testament?: string;
  dialect?: string;
  audioUrl?: string | null;
}

interface Props {
  book: string;
  chapter: number;
  translation?: 'afghan2023' | 'yousafzai2019';
}

export default function ChapterView({ book, chapter, translation = 'afghan2023' }: Props) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChapter() {
      setLoading(true);
      setError(null);

      try {
        // Fetch chapter verses from Supabase via API (includes audio URLs)
        const response = await fetch(`/api/chapter?book=${encodeURIComponent(book)}&chapter=${chapter}&translation=${translation}`);

        if (!response.ok) {
          throw new Error('Failed to fetch chapter verses');
        }

        const data = await response.json();

        // Verses now include audioUrl directly - no need for separate audio-batch call
        setVerses(data.verses || []);
      } catch (err) {
        console.error('Error fetching chapter:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchChapter();
  }, [book, chapter, translation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading chapter...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">Error: {error}</p>
      </div>
    );
  }

  if (verses.length === 0) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-yellow-800 dark:text-yellow-200">No verses found for this chapter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chapter Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 text-white rounded-lg p-4 shadow-lg">
        <h2 className="text-2xl font-bold">{book} {chapter}</h2>
        <p className="text-blue-100 text-sm mt-1">{verses.length} verses</p>
      </div>

      {/* Verses List */}
      <div className="space-y-3">
        {verses.map((verse) => (
          <div
            key={verse.ref}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            {/* Verse Number */}
            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold rounded-full flex-shrink-0">
                {verse.verse}
              </span>

              <div className="flex-1">
                {/* Verse Text */}
                <p className="text-lg text-gray-900 dark:text-gray-100 leading-relaxed mb-3" dir="rtl">
                  {verse.text}
                </p>

                {/* Audio Player - uses audioUrl directly from verse */}
                {verse.audioUrl && (
                  <div className="mt-2">
                    <AudioPlayer audioUrl={verse.audioUrl} verseRef={verse.ref} />
                  </div>
                )}

                {/* Verse Reference (small) */}
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {verse.ref}
                  {verse.dialect && (
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                      {verse.dialect}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
