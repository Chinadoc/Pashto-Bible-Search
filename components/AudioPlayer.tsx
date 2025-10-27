"use client";

import { useState } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  verseRef: string;
}

export default function AudioPlayer({ audioUrl, verseRef }: AudioPlayerProps) {
  const [error, setError] = useState<string | null>(null);

  // Convert Google Drive viewer URL to download URL for audio element
  const getAudioSrc = (url: string): string => {
    // Extract file ID from viewer URL: https://drive.google.com/file/d/{ID}/view
    const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)\//);
    if (match) {
      const fileId = match[1];
      // Return Google Drive download URL
      return `https://drive.google.com/uc?id=${fileId}&export=download`;
    }
    return url;
  };

  const audioSrc = getAudioSrc(audioUrl);

  const handleError = () => {
    setError('Audio playback failed. Try downloading instead.');
  };

  return (
    <div className="flex items-center gap-2">
      {error ? (
        <div className="text-xs text-red-500">{error}</div>
      ) : (
        <audio 
          controls 
          preload="metadata"
          className="h-8 w-48"
          src={audioSrc}
          onError={handleError}
        >
          <source src={audioSrc} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
      
      {/* Download link */}
      <a
        href={audioSrc}
        download
        className="text-xs text-blue-300 hover:text-blue-200 underline"
        title="Download audio"
      >
        Download
      </a>
      
      {/* Open in Google Drive */}
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
  );
}
