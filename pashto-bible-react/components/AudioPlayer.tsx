"use client";

import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  verseRef: string;
}

export default function AudioPlayer({ audioUrl, verseRef }: AudioPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      console.log(`✅ Audio loaded for ${verseRef}: ${audio.duration}s`);
    };

    const handleError = (e: Event) => {
      const target = e.target as HTMLAudioElement;
      const errorCode = target.error?.code;
      const errorMessage = target.error?.message || 'Unknown error';
      
      let friendlyError = 'Audio could not be loaded';
      if (errorCode === MediaError.MEDIA_ERR_NETWORK) {
        friendlyError = 'Network error (possibly CORS)';
      } else if (errorCode === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
        friendlyError = 'Audio format not supported';
      }
      
      console.error(`❌ Audio error for ${verseRef}:`, {
        code: errorCode,
        message: errorMessage,
        url: audioUrl
      });
      
      setError(friendlyError);
      setDebugInfo(`Error ${errorCode}: ${errorMessage}`);
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audioUrl, verseRef]);

  if (error) {
    return (
      <div className="text-xs text-red-500 border border-red-300 rounded px-2 py-1">
        Audio unavailable
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <audio 
        ref={audioRef}
        controls 
        preload="metadata"
        className="h-8 w-48"
        src={audioUrl}
      >
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      {isLoading && (
        <div className="text-xs text-gray-500">Loading...</div>
      )}
      
      {duration && (
        <div className="text-xs text-gray-500">
          {Math.round(duration)}s
        </div>
      )}
      
      {/* Debug info - remove in production */}
      <details className="text-xs">
        <summary className="cursor-pointer text-gray-400">🔧</summary>
        <div className="mt-1 text-gray-500 space-y-1">
          <div>Ref: {verseRef}</div>
          <div>URL: {audioUrl.substring(0, 50)}...</div>
          {debugInfo && <div>Debug: {debugInfo}</div>}
          {error && <div className="text-red-500">Error: {error}</div>}
        </div>
      </details>
    </div>
  );
}
