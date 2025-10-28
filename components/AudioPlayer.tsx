"use client";

import { useState, useRef, useEffect, useMemo } from 'react';

interface AudioPlayerProps {
  audioUrl: string | null | undefined;
  verseRef: string;
}

export default function AudioPlayer({ audioUrl, verseRef }: AudioPlayerProps) {
  const [showPlayer, setShowPlayer] = useState(false);
  const [loading, setLoading] = useState(false);
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

  // Extract file ID from Google Drive URL (memoized to avoid recalculation)
  const fileId = useMemo(() => {
    let id: string | null = null;
    
    // Extract file ID from various formats
    let match = audioUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)\//);
    if (match) {
      id = match[1];
    }
    if (!id) {
      match = audioUrl.match(/[?&]id=([a-zA-Z0-9-_]+)/);
      if (match) {
        id = match[1];
      }
    }
    
    return id;
  }, [audioUrl]);
  
  // Use Cloudflare Worker as CORS proxy for Google Drive audio
  // This provides better reliability and CORS handling
  const CLOUDFLARE_WORKER_URL = 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';
  const streamingUrl = fileId ? `${CLOUDFLARE_WORKER_URL}?id=${fileId}` : audioUrl;
  const downloadUrl = fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : audioUrl;

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
      fileId,
    });
    
    setError(`Audio could not be loaded (Error ${errorCode}). Try downloading instead.`);
  };

  return (
    <div className="flex flex-col gap-2">
      {showPlayer ? (
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
              preload="none"
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
            <button
              onClick={() => setShowPlayer(false)}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Hide player
            </button>
            <span className="text-gray-400">|</span>
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
              Open in Drive
            </a>
          </div>
        </div>
      ) : (
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
            title="Open in Google Drive"
          >
            Open
          </a>
        </div>
      )}
    </div>
  );
}
