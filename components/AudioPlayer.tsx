"use client";

import { useState, useRef, useEffect, useMemo } from 'react';

interface AudioPlayerProps {
  audioUrl: string | null | undefined;
  verseRef: string;
  autoLoad?: boolean; // Auto-load and show player when audio URL is available
}

export default function AudioPlayer({ audioUrl, verseRef, autoLoad = false }: AudioPlayerProps) {
  const [showPlayer, setShowPlayer] = useState(autoLoad); // Auto-show if autoLoad is true
  const [loading, setLoading] = useState(autoLoad); // Auto-start loading if autoLoad is true
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Return early if no audio URL (all hooks must be called before any returns)
  if (!audioUrl) {
    return (
      <div className="text-xs text-gray-400 dark:text-gray-500">
        🔇 Audio not available
      </div>
    );
  }

  // All audio is served via Cloudflare R2
  // URLs are already resolved to Cloudflare Worker streaming endpoints
  const streamingUrl = audioUrl;
  const downloadUrl = audioUrl;

  // Auto-load audio when component mounts if autoLoad is true
  useEffect(() => {
    if (autoLoad && audioUrl && audioRef.current) {
      audioRef.current.load();
      setLoading(true);
      setError(null);
    }
  }, [autoLoad, audioUrl]);

  const handlePlayClick = () => {
    setShowPlayer(true);
    setLoading(true);
    setError(null);

    // Automatically play after a brief delay to ensure source is loaded
    if (audioRef.current) {
      audioRef.current.load();
      // Schedule play after load is initiated
      setTimeout(() => {
        audioRef.current?.play().catch(err => {
          console.warn('Auto-play failed (likely due to browser policy):', err);
        });
      }, 100);
    }
  };

  const handleAudioLoaded = () => {
    setLoading(false);
    setError(null);
  };

  const handleAudioError = (e: any) => {
    setLoading(false);
    const audio = audioRef.current;
    const errorCode = audio?.error?.code;
    const errorMessage = audio?.error?.message || 'Unknown error';

    console.error(`❌ Audio error for ${verseRef}:`, {
      code: errorCode,
      message: errorMessage,
      url: streamingUrl,
    });

    setError(`Audio could not be loaded (Error ${errorCode}). Try downloading instead.`);
  };

  // If autoLoad is true, always show the player (no toggle button needed)
  const shouldShowPlayer = autoLoad ? true : showPlayer;

  return (
    <div className="flex flex-col gap-2">
      {shouldShowPlayer ? (
        <div className="bg-gray-100 dark:bg-gray-800 rounded p-3 border border-gray-300 dark:border-gray-600">
          {loading && (
            <div className="text-xs text-gray-500 mb-2">Loading audio...</div>
          )}

          {error ? (
            <div className="text-xs text-red-500 mb-2">{error}</div>
          ) : (
            <audio
              ref={audioRef}
              controls
              controlsList="nodownload"
              className="w-full h-10"
              preload={autoLoad ? "auto" : "none"}
              crossOrigin="anonymous"
              onLoadedData={handleAudioLoaded}
              onError={handleAudioError}
              onCanPlay={() => setLoading(false)}
            >
              <source src={streamingUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}

          <div className="flex items-center gap-2 mt-2">
            {!autoLoad && (
              <>
                <button
                  onClick={() => setShowPlayer(false)}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Hide player
                </button>
                <span className="text-gray-400">|</span>
              </>
            )}
            <a
              href={downloadUrl}
              download
              className="text-xs text-blue-300 hover:text-blue-200 underline"
            >
              Download
            </a>
            <span className="text-gray-400">|</span>
            <a
              href={audioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-300 hover:text-blue-200 underline"
            >
              Open
            </a>
          </div>
        </div>
      ) : (
        // Only show play button if not auto-loading
        !autoLoad && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayClick}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              title="Play audio inline"
            >
              ▶ Play Audio
            </button>

            <a
              href={downloadUrl}
              download
              className="text-xs text-blue-300 hover:text-blue-200 underline"
              title="Download audio"
            >
              Download
            </a>

            <a
              href={audioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-300 hover:text-blue-200 underline"
              title="Open audio URL"
            >
              Open
            </a>
          </div>
        )
      )}
    </div>
  );
}
