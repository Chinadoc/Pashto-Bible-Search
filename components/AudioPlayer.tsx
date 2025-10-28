"use client";

import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  verseRef: string;
}

export default function AudioPlayer({ audioUrl, verseRef }: AudioPlayerProps) {
  const [showPlayer, setShowPlayer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Extract file ID from Google Drive URL
  const getFileId = (url: string): string | null => {
    let fileId: string | null = null;
    
    // Extract file ID from various formats
    let match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)\//);
    if (match) {
      fileId = match[1];
    }
    if (!fileId) {
      match = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
      if (match) {
        fileId = match[1];
      }
    }
    
    return fileId;
  };

  const fileId = getFileId(audioUrl);
  
  // Use Vercel API route as CORS proxy for Google Drive audio
  // This endpoint is already set up and working
  const streamingUrl = fileId ? `/api/audio-proxy?id=${fileId}&export=download` : audioUrl;
  const downloadUrl = fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : audioUrl;

  const handlePlayClick = () => {
    setShowPlayer(true);
    setLoading(true);
    setError(null);
    
    // Try to load the audio
    if (audioRef.current) {
      audioRef.current.load();
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
              onLoadedData={handleAudioLoaded}
              onError={handleAudioError}
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
