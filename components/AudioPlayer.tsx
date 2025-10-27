"use client";

import { useState } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  verseRef: string;
}

export default function AudioPlayer({ audioUrl, verseRef }: AudioPlayerProps) {
  const [showIframe, setShowIframe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert Google Drive URL to preview URL for iframe embedding
  const getPreviewUrl = (url: string): string => {
    // Extract file ID from various Google Drive URL formats
    let fileId: string | null = null;
    
    // Format 1: https://drive.google.com/file/d/{ID}/view
    let match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)\//);
    if (match) {
      fileId = match[1];
    }
    
    // Format 2: https://drive.google.com/uc?id={ID}&export=...
    if (!fileId) {
      match = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
      if (match) {
        fileId = match[1];
      }
    }
    
    if (!fileId) return url;
    
    // Return Google Drive preview URL (works in iframe)
    return `https://drive.google.com/file/d/${fileId}/preview`;
  };

  const previewUrl = getPreviewUrl(audioUrl);

  // Also get direct download URL for fallback
  const getDownloadUrl = (url: string): string => {
    let fileId: string | null = null;
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
    if (!fileId) return url;
    return `https://drive.google.com/uc?id=${fileId}&export=download`;
  };

  const downloadUrl = getDownloadUrl(audioUrl);

  return (
    <div className="flex flex-col gap-2">
      {showIframe ? (
        <div className="bg-gray-100 dark:bg-gray-800 rounded p-2">
          <iframe
            src={previewUrl}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay"
            className="rounded"
          />
          <button
            onClick={() => setShowIframe(false)}
            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mt-1"
          >
            Hide player
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowIframe(true)}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            title="Play audio inline"
          >
            ▶ Play Audio
          </button>
          
          {/* Download link */}
          <a
            href={downloadUrl}
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
      )}
    </div>
  );
}
