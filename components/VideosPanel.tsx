"use client";

import { useState, useEffect } from 'react';

interface TranscriptionAttempt {
  attempt: number;
  transcript: string;
  is_pashto: boolean;
  timestamp: number;
}

interface VideoResult {
  success: boolean;
  video_id: string;
  youtube_url: string;
  audio_file: string;
  transcription: TranscriptionAttempt;
  transcription_attempts?: TranscriptionAttempt[];
  clips: Array<{
    sentence_number: number;
    sentence: string;
    start_time: number;
    end_time: number;
    duration: number;
    filename: string;
    file_path: string;
  }>;
  total_clips: number;
  total_duration: number;
}

interface VideosPanelProps {
  onSelectClip?: (clip: { query: string; startTime: number; endTime: number }) => void;
}

export default function VideosPanel({ onSelectClip }: VideosPanelProps) {
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [retrying, setRetrying] = useState<string | null>(null);

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
                    Transcription (Attempt {video.transcription.attempt})
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      video.transcription.is_pashto 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {video.transcription.is_pashto ? 'Pashto ✓' : 'Not Pashto ✗'}
                    </span>
                    {!video.transcription.is_pashto && (
                      <button
                        onClick={() => retryTranscription(video.video_id)}
                        disabled={retrying === video.video_id}
                        className="px-3 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                      >
                        {retrying === video.video_id ? 'Retrying...' : 'Re-send'}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded border p-4">
                  <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                    {video.transcription.transcript}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Generated: {formatTimestamp(video.transcription.timestamp)}
                  </p>
                </div>

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