'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CompareTranscriptionsPage() {
  const [youtubeUrl, setYoutubeUrl] = useState('https://www.youtube.com/watch?v=935dWX6-c1E&t=94s');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/compare-transcriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to compare transcriptions');
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Transcription Comparison: Google Flash 2.5 vs ElevenLabs
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Enter YouTube URL"
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleCompare}
              disabled={loading || !youtubeUrl}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Compare'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}
        </div>

        {results && (
          <div className="space-y-6">
            {/* Comparison Stats */}
            {results.comparison && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Comparison Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Similarity</div>
                    <div className="text-2xl font-bold text-blue-600">{results.comparison.similarity}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Common Words</div>
                    <div className="text-2xl font-bold text-green-600">{results.comparison.commonWords}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Google Only</div>
                    <div className="text-2xl font-bold text-purple-600">{results.comparison.googleOnlyWords}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">ElevenLabs Only</div>
                    <div className="text-2xl font-bold text-orange-600">{results.comparison.elevenOnlyWords}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Unique</div>
                    <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">{results.comparison.totalUniqueWords}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Google Flash Results */}
            {results.transcriptions.googleFlash && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  Google Flash 2.5 Transcription
                  {results.transcriptions.googleFlash.wordCount && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({results.transcriptions.googleFlash.wordCount} words, {results.transcriptions.googleFlash.charCount} chars)
                    </span>
                  )}
                </h2>
                {results.transcriptions.googleFlash.error ? (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200">{results.transcriptions.googleFlash.error}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 font-sans text-sm leading-relaxed" dir="rtl">
                        {results.transcriptions.googleFlash.transcript}
                      </pre>
                    </div>
                    {results.transcriptions.googleFlash.segments && results.transcriptions.googleFlash.segments.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Segments ({results.transcriptions.googleFlash.segments.length})</h3>
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {results.transcriptions.googleFlash.segments.slice(0, 10).map((seg: any, idx: number) => (
                            <div key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded" dir="rtl">
                              <span className="text-gray-500">{seg.startTime?.toFixed(1)}s - {seg.endTime?.toFixed(1)}s:</span> {seg.text}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ElevenLabs Results */}
            {results.transcriptions.elevenLabs && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  ElevenLabs Transcription
                  {results.transcriptions.elevenLabs.wordCount && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({results.transcriptions.elevenLabs.wordCount} words, {results.transcriptions.elevenLabs.charCount} chars)
                    </span>
                  )}
                </h2>
                {results.transcriptions.elevenLabs.error ? (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200">{results.transcriptions.elevenLabs.error}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 font-sans text-sm leading-relaxed" dir="rtl">
                        {results.transcriptions.elevenLabs.transcript}
                      </pre>
                    </div>
                    {results.transcriptions.elevenLabs.segments && results.transcriptions.elevenLabs.segments.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Segments ({results.transcriptions.elevenLabs.segments.length})</h3>
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {results.transcriptions.elevenLabs.segments.slice(0, 10).map((seg: any, idx: number) => (
                            <div key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded" dir="rtl">
                              <span className="text-gray-500">{seg.startTime?.toFixed(1)}s - {seg.endTime?.toFixed(1)}s:</span> {seg.text}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Side-by-side comparison */}
            {results.transcriptions.googleFlash?.transcript && results.transcriptions.elevenLabs?.transcript && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Side-by-Side Comparison</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Google Flash 2.5</h3>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 font-sans text-sm leading-relaxed" dir="rtl">
                        {results.transcriptions.googleFlash.transcript}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">ElevenLabs</h3>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 font-sans text-sm leading-relaxed" dir="rtl">
                        {results.transcriptions.elevenLabs.transcript}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

