"use client";

import { useState, useEffect, useRef } from 'react';

interface TranscriptionAttempt {
  attempt: number;
  transcript: string;
  is_pashto: boolean;
  timestamp: number;
}

interface NormalizedClip {
  sentence_number: number;
  sentence: string;
  start_time: number;
  end_time: number;
  duration: number;
  filename: string;
  file_path: string;
  server_url: string | null;
  exists: boolean | null;
}

interface NormalizedVideo {
  success?: boolean;
  video_id?: string;
  youtube_url?: string;
  audio_file?: string;
  transcription?: TranscriptionAttempt;
  transcription_attempts?: TranscriptionAttempt[];
  clips: NormalizedClip[];
  total_clips: number;
  total_duration: number;
  updated_at: string | null;
}

interface VideosPanelProps {
  onSelectClip?: (clip: { query: string; startTime: number; endTime: number }) => void;
}

export default function VideosPanel({ onSelectClip }: VideosPanelProps) {
  const [videos, setVideos] = useState<NormalizedVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [retrying, setRetrying] = useState<string | null>(null);
  const [elevenLabsLoading, setElevenLabsLoading] = useState(false);
  const [elevenLabsResult, setElevenLabsResult] = useState<string | null>(null);
  const [elevenLabsError, setElevenLabsError] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadVideos = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate loading from local files
      const response = await fetch('/api/videos');
      const data = await response.json();
      
      if (data.success) {
        setVideos(data.videos || []);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const retryTranscription = async (videoId: string) => {
    setRetrying(videoId);
    try {
      const response = await fetch('/api/retry-transcription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Reload videos to get updated results
        await loadVideos();
      } else {
        alert(`Retry failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error retrying transcription:', error);
      alert('Retry failed. Please try again.');
    } finally {
      setRetrying(null);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const handleElevenLabsTranscription = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // If no file selected but we have a YouTube URL, process that
    if (!file && !youtubeUrl.trim()) {
      setElevenLabsError('Please select an audio file or enter a YouTube URL');
      return;
    }

    setElevenLabsLoading(true);
    setElevenLabsError(null);
    setElevenLabsResult(null);

    try {
      const formData = new FormData();

      if (file) {
        // Handle file upload
        if (!file.type.startsWith('audio/')) {
          setElevenLabsError('Please select an audio file');
          return;
        }

        if (file.size > 25 * 1024 * 1024) {
          setElevenLabsError('File size must be less than 25MB');
          return;
        }

        formData.append('audio', file);
      } else if (youtubeUrl.trim()) {
        // Handle YouTube URL
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        if (!youtubeRegex.test(youtubeUrl.trim())) {
          setElevenLabsError('Please enter a valid YouTube URL');
          return;
        }

        formData.append('youtubeUrl', youtubeUrl.trim());
      }

      const response = await fetch('/api/transcribe-audio', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setElevenLabsResult(result.transcript);

        // Show additional info for YouTube videos
        if (result.source === 'youtube' && result.originalSize && result.compressedSize) {
          console.log(`YouTube video compressed from ${result.originalSize} to ${result.compressedSize} bytes`);
        }
      } else {
        setElevenLabsError(result.error || 'Transcription failed');
      }
    } catch (error) {
      console.error('ElevenLabs transcription error:', error);
      setElevenLabsError('Failed to transcribe audio');
    } finally {
      setElevenLabsLoading(false);
    }
  };

  const handleYouTubeTranscription = async () => {
    if (!youtubeUrl.trim()) {
      setElevenLabsError('Please enter a YouTube URL');
      return;
    }

    setElevenLabsLoading(true);
    setElevenLabsError(null);
    setElevenLabsResult(null);

    try {
      const formData = new FormData();
      formData.append('youtubeUrl', youtubeUrl.trim());

      const response = await fetch('/api/transcribe-audio', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setElevenLabsResult(result.transcript);

        // Show compression info for YouTube videos
        if (result.originalSize && result.compressedSize) {
          console.log(`YouTube video compressed from ${result.originalSize} to ${result.compressedSize} bytes`);
        }
      } else {
        setElevenLabsError(result.error || 'Transcription failed');
      }
    } catch (error) {
      console.error('ElevenLabs transcription error:', error);
      setElevenLabsError('Failed to transcribe YouTube video');
    } finally {
      setElevenLabsLoading(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const resetElevenLabsState = () => {
    setElevenLabsResult(null);
    setElevenLabsError(null);
    setYoutubeUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          🎬 Processed Videos
        </h2>
        <button
          onClick={loadVideos}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        View processed YouTube videos with Pashto transcription and audio clips
      </p>

      {/* ElevenLabs Transcription Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-6 border border-blue-200 dark:border-blue-800">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            🎤 ElevenLabs Pashto Transcription
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload an audio file or enter a YouTube URL to get instant Pashto transcription using ElevenLabs AI
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setYoutubeUrl('')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              !youtubeUrl.trim()
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            📁 File Upload
          </button>
          <button
            onClick={() => {
              // Clear file input when switching to YouTube
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              youtubeUrl.trim()
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            🎥 YouTube URL
          </button>
        </div>

        {/* File Upload Tab */}
        {!youtubeUrl.trim() && (
          <div className="space-y-3">
            <div className="flex items-center justify-center">
              <button
                onClick={triggerFileUpload}
                disabled={elevenLabsLoading}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <span>{elevenLabsLoading ? 'Transcribing...' : 'Upload Audio'}</span>
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleElevenLabsTranscription}
              className="hidden"
            />
          </div>
        )}

        {/* YouTube URL Tab */}
        {youtubeUrl.trim() && (
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleYouTubeTranscription}
                disabled={elevenLabsLoading || !youtubeUrl.trim()}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-md hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 8a9 9 0 110-18 9 9 0 010 18z" />
                </svg>
                <span>{elevenLabsLoading ? 'Processing...' : 'Transcribe'}</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              YouTube videos will be automatically downloaded and compressed to under 25MB for transcription
            </p>
          </div>
        )}

        {elevenLabsLoading && (
          <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-blue-700 dark:text-blue-300">Transcribing your audio with ElevenLabs AI...</p>
          </div>
        )}

        {elevenLabsError && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-red-700 dark:text-red-300">{elevenLabsError}</p>
              <button
                onClick={resetElevenLabsState}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {elevenLabsResult && (
          <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-green-800 dark:text-green-200">Transcription Result</h4>
              <button
                onClick={resetElevenLabsState}
                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
              >
                ✕
              </button>
            </div>
            <p className="text-green-800 dark:text-green-200 leading-relaxed mb-3">
              {elevenLabsResult}
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  if (onSelectClip) {
                    onSelectClip({
                      query: elevenLabsResult,
                      startTime: 0,
                      endTime: 0
                    });
                  }
                }}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Search This Text
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(elevenLabsResult);
                }}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Copy Text
              </button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Loading videos...</p>
        </div>
      ) : videos.length > 0 ? (
        <div className="space-y-6">
          {videos.map((video) => (
            <div key={video.video_id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              {/* Video Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Video {video.video_id}
                  </h3>
                  <a
                    href={video.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    View on YouTube
                  </a>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div>Clips: {video.total_clips}</div>
                  <div>Duration: {formatDuration(video.total_duration)}</div>
                </div>
              </div>

              {/* Transcription Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    Transcription {video.transcription ? `(Attempt ${video.transcription.attempt})` : '(No transcription)'}
                  </h4>
                  <div className="flex items-center space-x-2">
                    {video.transcription ? (
                      <>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          video.transcription.is_pashto
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {video.transcription.is_pashto ? 'Pashto ✓' : 'Not Pashto ✗'}
                        </span>
                        {!video.transcription.is_pashto && (
                          <button
                            onClick={() => retryTranscription(video.video_id || '')}
                            disabled={retrying === (video.video_id || '')}
                            className="px-3 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                          >
                            {retrying === (video.video_id || '') ? 'Retrying...' : 'Re-send'}
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        No transcription available
                      </span>
                    )}
                  </div>
                </div>
                
                {video.transcription ? (
                  <div className="bg-white dark:bg-gray-800 rounded border p-4">
                    <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                      {video.transcription.transcript}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Generated: {formatTimestamp(video.transcription.timestamp)}
                    </p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded border p-4">
                    <p className="text-gray-900 dark:text-gray-100 leading-relaxed text-gray-500 italic">
                      No transcription available for this video.
                    </p>
                  </div>
                )}

                {/* Previous Attempts */}
                {video.transcription_attempts && video.transcription_attempts.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Previous Attempts
                    </h5>
                    <div className="space-y-2">
                      {video.transcription_attempts.map((attempt, index) => (
                        <div key={index} className="bg-gray-100 dark:bg-gray-600 rounded p-3 text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">Attempt {attempt.attempt}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              attempt.is_pashto 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {attempt.is_pashto ? 'Pashto' : 'Not Pashto'}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-xs">
                            {attempt.transcript.substring(0, 100)}...
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatTimestamp(attempt.timestamp)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Audio Clips */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Audio Clips ({video.clips.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                  {video.clips.map((clip) => (
                    <div
                      key={clip.sentence_number}
                      className="bg-white dark:bg-gray-800 rounded border p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => onSelectClip?.({
                        query: clip.sentence,
                        startTime: clip.start_time,
                        endTime: clip.end_time
                      })}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                          Clip {clip.sentence_number}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDuration(clip.duration)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {clip.sentence}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDuration(clip.start_time)} - {formatDuration(clip.end_time)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
          <p className="text-yellow-800 dark:text-yellow-300 mb-4">
            No processed videos found.
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            Run the offline video processor to process YouTube videos:
          </p>
          <div className="mt-4 bg-yellow-100 dark:bg-yellow-800 rounded p-3 text-left">
            <code className="text-sm text-yellow-800 dark:text-yellow-200">
              python3 process_video_offline.py
            </code>
          </div>
        </div>
      )}
    </div>
  );
}