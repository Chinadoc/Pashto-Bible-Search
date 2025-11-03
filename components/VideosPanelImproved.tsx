"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import WaveformViewer from './WaveformViewer';

// YouTube Player Component - Simplified direct embed approach
function YouTubePlayer({ 
  videoId, 
  segments, 
  onTimeUpdate 
}: { 
  videoId: string; 
  segments: NormalizedClip[]; 
  onTimeUpdate?: (time: number) => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoId) {
      setError('No video ID provided');
      return;
    }

    const cleanVideoId = videoId.trim().replace(/[^a-zA-Z0-9_-]/g, '');
    
    if (cleanVideoId.length < 11) {
      setError(`Invalid video ID: ${videoId}`);
      return;
    }

    const timer = setTimeout(() => {
      setPlayerReady(true);
      setError(null);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [videoId]);

  if (!videoId) {
    return (
      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No video ID provided</p>
      </div>
    );
  }

  const cleanVideoId = videoId.trim().replace(/[^a-zA-Z0-9_-]/g, '');
  
  if (cleanVideoId.length < 11) {
    return (
      <div className="w-full h-full bg-red-100 dark:bg-red-900/20 rounded flex items-center justify-center">
        <p className="text-red-700 dark:text-red-300">Invalid video ID: {videoId}</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${cleanVideoId}?enablejsapi=1&origin=${typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''}&rel=0&modestbranding=1`;

  return (
    <div className="w-full h-full relative bg-black rounded overflow-hidden">
      {error && (
        <div className="absolute top-2 left-2 right-2 bg-red-500 text-white text-sm p-2 rounded z-10">
          {error}
        </div>
      )}
      {!playerReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-white">Loading video...</div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        id={`youtube-player-${cleanVideoId}`}
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full absolute inset-0"
        onLoad={() => {
          setPlayerReady(true);
          setError(null);
        }}
        onError={() => {
          setError('Failed to load YouTube video');
        }}
      />
    </div>
  );
}

interface NormalizedClip {
  sentence_number?: number;
  segment_number?: number;
  sentence?: string;
  transcript_text?: string;
  start_time?: number;
  start_time_seconds?: number;
  end_time?: number;
  end_time_seconds?: number;
  duration: number;
  filename?: string;
  file_path?: string;
  server_url?: string | null;
  audio_url?: string;
  r2_key?: string;
  exists?: boolean | null;
}

interface NormalizedVideo {
  success?: boolean;
  video_id?: string;
  title?: string;
  youtube_url?: string;
  audio_file?: string;
  transcript?: string;
  clips: NormalizedClip[];
  total_clips: number;
  total_duration: number;
  updated_at: string | null;
  source?: 'cloudflare' | 'supabase';
  transcription_service?: string;
}

interface VideosPanelImprovedProps {
  onSelectClip?: (clip: { query: string; startTime: number; endTime: number }) => void;
}

export default function VideosPanelImproved({ onSelectClip }: VideosPanelImprovedProps) {
  const [videos, setVideos] = useState<NormalizedVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<NormalizedVideo | null>(null);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioErrors, setAudioErrors] = useState<Record<string, string>>({});
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [elevenLabsLoading, setElevenLabsLoading] = useState(false);
  const [elevenLabsError, setElevenLabsError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedSegments, setEditedSegments] = useState<Array<{startTime: number; endTime: number}>>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isDetectingSilence, setIsDetectingSilence] = useState(false);
  const [silenceRegions, setSilenceRegions] = useState<Array<{start: number; end: number}>>([]);
  const [processingStatus, setProcessingStatus] = useState<{
    stage: string;
    progress: number;
    message: string;
  } | null>(null);
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const segmentRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const extractVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const loadVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/videos');
      const data = await response.json();
      
      if (data.success) {
        setVideos(data.videos || []);
        // Auto-select first video if none selected
        if (!selectedVideo && data.videos && data.videos.length > 0) {
          setSelectedVideo(data.videos[0]);
        }
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  // Initialize edited segments when entering edit mode or video changes
  useEffect(() => {
    if (selectedVideo && isEditMode) {
      const initialSegments = selectedVideo.clips.map(clip => ({
        startTime: clip.start_time_seconds || clip.start_time || 0,
        endTime: clip.end_time_seconds || clip.end_time || 0,
      }));
      setEditedSegments(initialSegments);
    }
  }, [selectedVideo, isEditMode]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVideoTitle = (video: NormalizedVideo): string => {
    if (video.title) return video.title;
    if (video.youtube_url) {
      const videoId = extractVideoId(video.youtube_url);
      return videoId ? `Video ${videoId}` : 'Untitled Video';
    }
    return video.video_id ? `Video ${video.video_id}` : 'Untitled Video';
  };

  const handleSegmentClick = (segmentIndex: number) => {
    if (!selectedVideo) return;
    
    const segment = selectedVideo.clips[segmentIndex];
    if (!segment) return;
    
    const startTime = segment.start_time_seconds || segment.start_time || 0;
    setActiveSegmentIndex(segmentIndex);
    
    // Scroll to segment
    const segmentKey = `${selectedVideo.video_id}-${segmentIndex + 1}`;
    const segmentElement = segmentRefs.current.get(segmentKey);
    if (segmentElement) {
      segmentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300 ${
      isFullScreen ? 'fixed inset-0 z-50 rounded-none' : 'p-6 w-full'
    }`}>
      <div className={`flex items-center justify-between ${isFullScreen ? 'p-6 border-b border-gray-200 dark:border-gray-700' : 'mb-6'}`}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          🎬 Processed Videos
        </h2>
        <div className="flex items-center gap-2">
          {selectedVideo && (
            <>
                  <button
                    onClick={() => {
                      setIsEditMode(!isEditMode);
                      // When entering edit mode, ensure waveform refreshes
                      if (!isEditMode && selectedVideo) {
                        // Force a small delay to ensure state updates
                        setTimeout(() => {
                          // The WaveformViewer will re-render with the new audioUrl
                        }, 100);
                      }
                    }}
                className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isEditMode
                    ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                    : 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500'
                }`}
                title={isEditMode ? 'Exit edit mode' : 'Edit segment timestamps'}
              >
                {isEditMode ? '✓ Done Editing' : '✏️ Edit Timestamps'}
              </button>
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                title={isFullScreen ? 'Exit full screen' : 'Enter full screen'}
              >
                {isFullScreen ? '⤓ Exit Full Screen' : '⤢ Full Screen'}
              </button>
            </>
          )}
          <button
            onClick={loadVideos}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className={isFullScreen ? 'h-[calc(100vh-100px)] px-6 pb-6 overflow-hidden' : ''}>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Loading videos...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
          <p className="text-yellow-800 dark:text-yellow-300">
            No processed videos found.
          </p>
        </div>
      ) : (
        <>
          {/* Video Processing Form - Only show when NOT in edit mode */}
          {!isEditMode && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                🎤 Process New Video
              </h3>
              <div className="space-y-3">
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Optional: Custom video title"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={async () => {
                  if (!youtubeUrl.trim()) {
                    setElevenLabsError('Please enter a YouTube URL');
                    return;
                  }
                  setElevenLabsLoading(true);
                  setElevenLabsError(null);
                  setProcessingStatus({ stage: 'Starting', progress: 0, message: 'Initializing video processing...' });
                  
                  try {
                    // Simulate progress updates
                    const progressInterval = setInterval(() => {
                      setProcessingStatus(prev => {
                        if (!prev) return null;
                        const stages = [
                          { stage: 'Downloading', progress: 20, message: 'Downloading audio from YouTube...' },
                          { stage: 'Transcribing', progress: 40, message: 'Transcribing with ElevenLabs...' },
                          { stage: 'Aligning', progress: 60, message: 'Aligning timestamps with WhisperX...' },
                          { stage: 'Segmenting', progress: 80, message: 'Creating audio segments...' },
                          { stage: 'Uploading', progress: 90, message: 'Uploading to Cloudflare R2...' },
                        ];
                        const currentStageIndex = Math.floor(prev.progress / 20);
                        if (currentStageIndex < stages.length) {
                          return stages[currentStageIndex];
                        }
                        return { ...prev, progress: Math.min(prev.progress + 2, 95) };
                      });
                    }, 2000);

                    const response = await fetch('/api/process-video-cloudflare', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        youtubeUrl: youtubeUrl.trim(),
                        title: videoTitle.trim() || null,
                        apiKeys: {
                          elevenlabs: process.env.ELEVENLABS_API_KEY || 'sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543'
                        }
                      })
                    });
                    
                    clearInterval(progressInterval);
                    setProcessingStatus({ stage: 'Completing', progress: 95, message: 'Finalizing...' });
                    
                    const result = await response.json();
                    if (response.ok && result.success) {
                      setProcessingStatus({ stage: 'Complete', progress: 100, message: 'Video processed successfully!' });
                      setYoutubeUrl('');
                      setVideoTitle('');
                      await new Promise(resolve => setTimeout(resolve, 2000));
                      await loadVideos();
                      setProcessingStatus(null);
                    } else {
                      setProcessingStatus(null);
                      setElevenLabsError(result.error || result.details || 'Video processing failed');
                    }
                  } catch (error) {
                    setProcessingStatus(null);
                    setElevenLabsError(`Failed to process video: ${error instanceof Error ? error.message : 'Unknown error'}`);
                  } finally {
                    setElevenLabsLoading(false);
                  }
                }}
                disabled={elevenLabsLoading || !youtubeUrl.trim()}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 font-medium"
              >
                {elevenLabsLoading ? '⏳ Processing Video...' : '🚀 Process Video'}
              </button>
              
              {/* Processing Status */}
              {processingStatus && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-900 dark:text-blue-100">{processingStatus.stage}</span>
                    <span className="text-sm text-blue-700 dark:text-blue-300">{processingStatus.progress}%</span>
                  </div>
                  <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${processingStatus.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">{processingStatus.message}</p>
                </div>
              )}
              
              {elevenLabsError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 text-sm">{elevenLabsError}</p>
                </div>
              )}
            </div>
          </div>
          )}

          {/* Waveform Viewer - Replace Process New Video area when in edit mode */}
          {isEditMode && selectedVideo && selectedVideo.video_id && (() => {
            let correctVideoId = selectedVideo.video_id;
            if (selectedVideo.youtube_url && (!correctVideoId || correctVideoId.length < 11)) {
              const extracted = extractVideoId(selectedVideo.youtube_url);
              if (extracted) correctVideoId = extracted;
            }
            const CLOUDFLARE_WORKER_URL = 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';
            const fullAudioUrl = `${CLOUDFLARE_WORKER_URL}/api/video/${correctVideoId}/audio-full`;
            
            return (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-6 border-2 border-yellow-500 dark:border-yellow-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  🎵 Waveform Editor - Drag handles to adjust segment boundaries
                </h3>
                <WaveformViewer
                  audioUrl={fullAudioUrl}
                  segments={editedSegments}
                  onSegmentUpdate={(newSegments) => {
                    setEditedSegments(newSegments);
                  }}
                  videoDuration={selectedVideo.total_duration || 0}
                  onDetectSilence={async () => {
                    if (!selectedVideo) return [];
                    
                    setIsDetectingSilence(true);
                    try {
                      const response = await fetch('/api/detect-silence', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          videoId: selectedVideo.video_id,
                          youtubeUrl: selectedVideo.youtube_url,
                        }),
                      });
                      
                      const result = await response.json();
                      if (response.ok && result.success) {
                        setEditedSegments(result.segments);
                        
                        // Also store silence regions for visualization
                        if (result.silenceRegions) {
                          setSilenceRegions(result.silenceRegions);
                        }
                        
                        return result.segments;
                      } else {
                        throw new Error(result.error || 'Failed to detect silence');
                      }
                    } finally {
                      setIsDetectingSilence(false);
                    }
                  }}
                  silenceRegions={silenceRegions}
                />
              </div>
            );
          })()}

          <div className={`grid grid-cols-12 gap-6 ${isFullScreen ? 'h-[calc(100vh-350px)]' : 'h-[calc(100vh-400px)]'}`}>
          {/* Left Sidebar - Video List */}
          <div className="col-span-3 border-r border-gray-200 dark:border-gray-700 pr-4 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Videos ({videos.length})
            </h3>
            <div className="space-y-2">
              {videos.map((video) => {
                const isSelected = selectedVideo?.video_id === video.video_id;
                return (
                  <button
                    key={video.video_id}
                    onClick={() => setSelectedVideo(video)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">
                      {getVideoTitle(video)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {video.total_clips} segments • {video.total_duration ? formatDuration(video.total_duration) : 'N/A'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side - Video Player + Transcript */}
          {selectedVideo ? (
            <div className="col-span-9 flex flex-col gap-4 overflow-hidden">
              {/* Video Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {getVideoTitle(selectedVideo)}
                  </h3>
                  {selectedVideo.youtube_url && (
                    <a
                      href={selectedVideo.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      View on YouTube
                    </a>
                  )}
                </div>
              </div>

              {/* Two Column Layout: Video Left, Transcript Right */}
              <div className={`grid ${isFullScreen ? 'grid-cols-3' : 'grid-cols-5'} gap-6 flex-1 overflow-hidden`}>
                {/* Left Column - Video Player + Waveform */}
                <div className={`${isFullScreen ? 'col-span-1' : 'col-span-2'} flex flex-col gap-4`}>
                  <div className="bg-white dark:bg-gray-800 rounded border p-2 flex-1 min-h-0">
                    <div className="aspect-video w-full h-full">
                      {selectedVideo.youtube_url && selectedVideo.video_id ? (
                        (() => {
                          let videoId = selectedVideo.video_id;
                          if (!videoId || videoId.length < 11) {
                            const extracted = extractVideoId(selectedVideo.youtube_url);
                            if (extracted) videoId = extracted;
                          }
                          return (
                            <YouTubePlayer
                              videoId={videoId}
                              segments={selectedVideo.clips}
                              onTimeUpdate={(currentTime) => {
                                const activeSegment = selectedVideo.clips.findIndex((clip) => {
                                  const startTime = clip.start_time_seconds || clip.start_time || 0;
                                  const endTime = clip.end_time_seconds || clip.end_time || 0;
                                  return currentTime >= startTime && currentTime < endTime;
                                });
                                if (activeSegment !== -1) {
                                  setActiveSegmentIndex(activeSegment);
                                }
                              }}
                            />
                          );
                        })()
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                          <p className="text-gray-500 dark:text-gray-400">No video available</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Unified Waveform Viewer - Only show when NOT in edit mode (edit mode shows it at top) */}
                  {!isEditMode && selectedVideo.video_id && (() => {
                    let correctVideoId = selectedVideo.video_id;
                    if (selectedVideo.youtube_url && (!correctVideoId || correctVideoId.length < 11)) {
                      const extracted = extractVideoId(selectedVideo.youtube_url);
                      if (extracted) correctVideoId = extracted;
                    }
                    const CLOUDFLARE_WORKER_URL = 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';
                    // Try to get full audio URL
                    const fullAudioUrl = `${CLOUDFLARE_WORKER_URL}/api/video/${correctVideoId}/audio-full`;
                    
                    return (
                      <div className={`${isEditMode ? 'border-2 border-yellow-500 rounded-lg p-2 bg-yellow-50/50 dark:bg-yellow-900/10' : ''}`}>
                        <WaveformViewer
                          audioUrl={fullAudioUrl}
                          segments={isEditMode ? editedSegments : selectedVideo.clips.map(clip => ({
                            startTime: clip.start_time_seconds || clip.start_time || 0,
                            endTime: clip.end_time_seconds || clip.end_time || 0,
                          }))}
                          onSegmentUpdate={(newSegments) => {
                            if (isEditMode) {
                              setEditedSegments(newSegments);
                            }
                          }}
                          videoDuration={selectedVideo.total_duration || 0}
                          onDetectSilence={async () => {
                            if (!selectedVideo) return [];
                            
                            setIsDetectingSilence(true);
                            try {
                              const response = await fetch('/api/detect-silence', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  videoId: selectedVideo.video_id,
                                  youtubeUrl: selectedVideo.youtube_url,
                                }),
                              });
                              
                              const result = await response.json();
                              if (response.ok && result.success) {
                                setIsEditMode(true);
                                setEditedSegments(result.segments);
                                
                                // Also store silence regions for visualization
                                if (result.silenceRegions) {
                                  setSilenceRegions(result.silenceRegions);
                                }
                                
                                return result.segments;
                              } else {
                                throw new Error(result.error || 'Failed to detect silence');
                              }
                            } finally {
                              setIsDetectingSilence(false);
                            }
                          }}
                          silenceRegions={silenceRegions}
                        />
                      </div>
                    );
                  })()}
                </div>

                {/* Right Column - Transcript */}
                <div className={`${isFullScreen ? 'col-span-2' : 'col-span-3'} flex flex-col overflow-hidden`}>
                  <div className="bg-white dark:bg-gray-800 rounded border p-4 flex-1 overflow-y-auto">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Transcript ({selectedVideo.clips.length} segments)
                    </h4>
                    
                    {isEditMode && (
                      <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            ✏️ Edit Mode: Adjust segment boundaries on the waveform above, then click "Confirm Changes" to regenerate clips
                          </p>
                          <button
                            onClick={async () => {
                              if (!selectedVideo) return;
                              setIsRegenerating(true);
                              setProcessingStatus({ stage: 'Preparing', progress: 0, message: 'Preparing to regenerate segments...' });
                              
                              try {
                                const response = await fetch('/api/regenerate-segments', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    videoId: selectedVideo.video_id,
                                    youtubeUrl: selectedVideo.youtube_url,
                                    segments: editedSegments.map((seg, idx) => ({
                                      segment_number: idx + 1,
                                      text: selectedVideo.clips[idx]?.transcript_text || selectedVideo.clips[idx]?.sentence || '',
                                      startTime: seg.startTime,
                                      endTime: seg.endTime,
                                    })),
                                  }),
                                });
                                
                                const result = await response.json();
                                if (response.ok && result.success) {
                                  setProcessingStatus({ stage: 'Complete', progress: 100, message: 'Segments regenerated successfully!' });
                                  setIsEditMode(false);
                                  await new Promise(resolve => setTimeout(resolve, 2000));
                                  await loadVideos();
                                  setProcessingStatus(null);
                                } else {
                                  setProcessingStatus(null);
                                  alert(result.error || 'Failed to regenerate segments');
                                }
                              } catch (error) {
                                setProcessingStatus(null);
                                alert(`Failed to regenerate segments: ${error instanceof Error ? error.message : 'Unknown error'}`);
                              } finally {
                                setIsRegenerating(false);
                              }
                            }}
                            disabled={isRegenerating}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 font-medium"
                          >
                            {isRegenerating ? '⏳ Regenerating...' : '✅ Confirm Changes'}
                          </button>
                        </div>
                        {processingStatus && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">{processingStatus.stage}</span>
                              <span className="text-xs text-yellow-600 dark:text-yellow-400">{processingStatus.progress}%</span>
                            </div>
                            <div className="w-full bg-yellow-200 dark:bg-yellow-800 rounded-full h-1.5">
                              <div 
                                className="bg-yellow-600 dark:bg-yellow-400 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${processingStatus.progress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">{processingStatus.message}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      {selectedVideo.clips.map((clip, index) => {
                        const segmentNum = clip.segment_number || clip.sentence_number || (index + 1);
                        const text = clip.transcript_text || clip.sentence || '';
                        const originalStartTime = clip.start_time_seconds || clip.start_time || 0;
                        const originalEndTime = clip.end_time_seconds || clip.end_time || 0;
                        const startTime = isEditMode && editedSegments[index] ? editedSegments[index].startTime : originalStartTime;
                        const endTime = isEditMode && editedSegments[index] ? editedSegments[index].endTime : originalEndTime;
                        const duration = clip.duration || (endTime - startTime);
                        const audioKey = `${selectedVideo.video_id}-${segmentNum}`;
                        const isPlaying = playingAudio === audioKey;
                        const isActive = activeSegmentIndex === index;
                        
                        // Get video duration for slider max
                        const videoDuration = selectedVideo.total_duration || 300; // Default to 5 minutes if unknown
                        
                        let audioUrl = clip.audio_url || clip.server_url;
                        if (!audioUrl && selectedVideo.video_id) {
                          let correctVideoId = selectedVideo.video_id;
                          if (selectedVideo.youtube_url && (!correctVideoId || correctVideoId.length < 11)) {
                            const extracted = extractVideoId(selectedVideo.youtube_url);
                            if (extracted) correctVideoId = extracted;
                          }
                          const CLOUDFLARE_WORKER_URL = 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';
                          audioUrl = `${CLOUDFLARE_WORKER_URL}/api/video/${correctVideoId}/audio?segment=${segmentNum}`;
                        }

                        return (
                          <div
                            key={segmentNum}
                            ref={(el) => {
                              if (el) {
                                segmentRefs.current.set(`${selectedVideo.video_id}-${segmentNum}`, el);
                              }
                            }}
                            className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 ring-2 ring-blue-500'
                                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                            onClick={() => handleSegmentClick(index)}
                          >
                            <div className="flex items-start gap-3">
                              {audioUrl ? (
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    const audio = audioRefs.current.get(audioKey);
                                    if (audio) {
                                      if (isPlaying) {
                                        audio.pause();
                                        setPlayingAudio(null);
                                      } else {
                                        audioRefs.current.forEach((a, k) => {
                                          if (k !== audioKey) a.pause();
                                        });
                                        setAudioErrors(prev => ({ ...prev, [audioKey]: '' }));
                                        try {
                                          if (audio.readyState === 0) {
                                            audio.load();
                                            await new Promise((resolve, reject) => {
                                              const timeout = setTimeout(() => reject(new Error('Audio load timeout')), 10000);
                                              audio.oncanplay = () => {
                                                clearTimeout(timeout);
                                                resolve(undefined);
                                              };
                                              audio.onerror = () => {
                                                clearTimeout(timeout);
                                                reject(new Error('Audio failed to load'));
                                              };
                                            });
                                          }
                                          await audio.play();
                                          setPlayingAudio(audioKey);
                                        } catch (error) {
                                          console.error('Audio playback error:', error);
                                          setAudioErrors(prev => ({ ...prev, [audioKey]: error instanceof Error ? error.message : 'Failed to play audio' }));
                                          setPlayingAudio(null);
                                        }
                                      }
                                    }
                                  }}
                                  className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
                                >
                                  {isPlaying ? (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                  ) : (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                    </svg>
                                  )}
                                </button>
                              ) : null}
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    {formatDuration(startTime)} - {formatDuration(endTime)}
                                    {isEditMode && (startTime !== originalStartTime || endTime !== originalEndTime) && (
                                      <span className="ml-2 text-orange-600 dark:text-orange-400">(edited)</span>
                                    )}
                                  </span>
                                </div>
                                
                                {isEditMode ? (
                                  <div className="space-y-3 mt-2">
                                    <div>
                                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        Start: {formatDuration(startTime)}
                                      </label>
                                      <input
                                        type="range"
                                        min={index > 0 ? editedSegments[index - 1]?.endTime || 0 : 0}
                                        max={editedSegments[index + 1]?.startTime || videoDuration}
                                        step="0.1"
                                        value={startTime}
                                        onChange={(e) => {
                                          const newStart = parseFloat(e.target.value);
                                          if (newStart < endTime) {
                                            const newSegments = [...editedSegments];
                                            newSegments[index] = { ...newSegments[index], startTime: newStart };
                                            setEditedSegments(newSegments);
                                          }
                                        }}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        End: {formatDuration(endTime)}
                                      </label>
                                      <input
                                        type="range"
                                        min={startTime}
                                        max={editedSegments[index + 1]?.startTime || videoDuration}
                                        step="0.1"
                                        value={endTime}
                                        onChange={(e) => {
                                          const newEnd = parseFloat(e.target.value);
                                          if (newEnd > startTime) {
                                            const newSegments = [...editedSegments];
                                            newSegments[index] = { ...newSegments[index], endTime: newEnd };
                                            setEditedSegments(newSegments);
                                          }
                                        }}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                      />
                                    </div>
                                  </div>
                                ) : null}
                                
                                <p 
                                  className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed"
                                  dir="rtl"
                                >
                                  {text}
                                </p>
                              </div>
                            </div>
                            
                            {audioUrl && (
                              <audio
                                ref={(el) => {
                                  if (el) {
                                    audioRefs.current.set(audioKey, el);
                                    el.onended = () => setPlayingAudio(null);
                                    el.onpause = () => {
                                      if (!el.ended) setPlayingAudio(null);
                                    };
                                    el.onerror = () => {
                                      setAudioErrors(prev => ({ ...prev, [audioKey]: 'Failed to load audio' }));
                                      setPlayingAudio(null);
                                    };
                                  }
                                }}
                                src={audioUrl}
                                preload="none"
                                crossOrigin="anonymous"
                              >
                                <source src={audioUrl} type="audio/mpeg" />
                              </audio>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-span-9 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Select a video to view</p>
            </div>
          )}
          </div>
        </>
      )}
      </div>
    </div>
  );
}

