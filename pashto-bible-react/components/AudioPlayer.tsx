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
  const [src, setSrc] = useState<string>(audioUrl);
  const [triedAlt, setTriedAlt] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Reset source when incoming URL changes
  useEffect(() => {
    setSrc(audioUrl);
    setTriedAlt(false);
    setIsLoading(true);
    setError(null);
    setDebugInfo('');
  }, [audioUrl]);

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

      // Try alternate Drive host once if we haven't yet
      let attemptedFallback = false;
      const primary = src;
      const idMatch = primary.match(/[?&](?:id|ids)=([^&]+)/) || primary.match(/\/uc\?export=download&id=([^&]+)/) || primary.match(/\/d\/([^/]+)/);
      if (!triedAlt && idMatch && idMatch[1]) {
        const alt = primary.includes('drive.usercontent.google.com')
          ? `https://drive.google.com/uc?export=download&id=${idMatch[1]}`
          : `https://drive.usercontent.google.com/uc?export=download&id=${idMatch[1]}`;
        setTriedAlt(true);
        setSrc(alt);
        attemptedFallback = true;
        friendlyError = 'Retrying audio...';
      }

      console.error(`❌ Audio error for ${verseRef}:`, {
        code: errorCode,
        message: errorMessage,
        url: primary,
        attemptedFallback
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
  }, [src, verseRef, triedAlt]);

  return (
    <div className="flex items-center gap-2">
      <audio 
        ref={audioRef}
        controls 
        preload="metadata"
        crossOrigin="anonymous"
        className="h-8 w-48"
        src={src}
      >
        <source src={src} type="audio/mpeg" />
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

      {/* Download + Open links */}
      <a
        href={src}
        download
        className="text-xs text-blue-300 hover:text-blue-200 underline"
      >
        Download
      </a>
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-300 hover:text-blue-200 underline"
      >
        Open
      </a>
      
      {/* Debug info - remove in production */}
      <details className="text-xs">
        <summary className="cursor-pointer text-gray-400">🔧</summary>
        <div className="mt-1 text-gray-500 space-y-1">
          <div>Ref: {verseRef}</div>
          <div>URL: {src.substring(0, 50)}...</div>
          {debugInfo && <div>Debug: {debugInfo}</div>}
          {error && <div className="text-yellow-500">Status: {error}</div>}
        </div>
      </details>
    </div>
  );
}
