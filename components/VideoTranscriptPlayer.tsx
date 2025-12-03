'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import InteractiveVerse from './InteractiveVerse';

const CLOUDFLARE_WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 
  'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

interface VideoSegment {
  segmentNumber: number;
  text: string;
  transcript?: string;
  startTime: number;
  endTime: number;
  duration: number;
  audioUrl?: string; // R2 key if available
}

interface VideoTranscriptPlayerProps {
  videoId: string;
  title: string;
  segments: VideoSegment[];
  youtubeUrl: string;
}

export default function VideoTranscriptPlayer({ 
  videoId, 
  title, 
  segments,
  youtubeUrl 
}: VideoTranscriptPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [expandedSegment, setExpandedSegment] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [playingAudioIndex, setPlayingAudioIndex] = useState<number | null>(null);
  const playerRef = useRef<any>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Convert R2 key to streaming URL
  const getAudioStreamUrl = (r2Key: string) => {
    if (r2Key.startsWith('http')) return r2Key;
    return `${CLOUDFLARE_WORKER_URL}/api/audio/stream/${encodeURIComponent(r2Key)}`;
  };

  // Play individual audio clip
  const playSegmentAudio = useCallback((segmentIndex: number, r2Key: string) => {
    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    if (playingAudioIndex === segmentIndex) {
      setPlayingAudioIndex(null);
      return;
    }
    
    const audio = new Audio(getAudioStreamUrl(r2Key));
    audio.preload = 'auto';
    audioRef.current = audio;
    
    audio.onplay = () => setPlayingAudioIndex(segmentIndex);
    audio.onended = () => setPlayingAudioIndex(null);
    audio.onerror = () => {
      console.error('Audio playback error');
      setPlayingAudioIndex(null);
    };
    
    audio.play().catch(err => {
      console.error('Failed to play audio:', err);
      setPlayingAudioIndex(null);
    });
  }, [playingAudioIndex]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Find active segment based on current time
  useEffect(() => {
    const index = segments.findIndex((seg, i) => {
      const nextSeg = segments[i + 1];
      return currentTime >= seg.startTime && 
             (nextSeg ? currentTime < nextSeg.startTime : true);
    });
    if (index !== -1 && index !== activeSegmentIndex) {
      setActiveSegmentIndex(index);
      // Auto-scroll to active segment
      segmentRefs.current[index]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [currentTime, segments, activeSegmentIndex]);

  // Load YouTube IFrame API
  useEffect(() => {
    // Create YouTube player
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // @ts-expect-error - YouTube IFrame API
    window.onYouTubeIframeAPIReady = () => {
      // @ts-expect-error - YouTube IFrame API
      playerRef.current = new YT.Player(`youtube-player-${videoId}`, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onStateChange: (event: any) => {
            // @ts-expect-error - YouTube IFrame API
            setIsPlaying(event.data === YT.PlayerState.PLAYING);
          },
        },
      });
    };

    // If API already loaded
    // @ts-expect-error - YouTube IFrame API
    if (window.YT && window.YT.Player) {
      // @ts-expect-error - YouTube IFrame API
      window.onYouTubeIframeAPIReady();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy?.();
      }
    };
  }, [videoId]);

  // Track current time while playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && playerRef.current) {
      interval = setInterval(() => {
        const time = playerRef.current?.getCurrentTime?.() || 0;
        setCurrentTime(time);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Seek to timestamp
  const seekTo = useCallback((seconds: number) => {
    if (playerRef.current?.seekTo) {
      playerRef.current.seekTo(seconds, true);
      playerRef.current.playVideo?.();
    }
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <div className="flex items-center gap-4 mt-2 text-sm text-blue-100">
          <span>{segments.length} segments</span>
          <span>•</span>
          <span>{formatTime(segments[segments.length - 1]?.endTime || 0)} total</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Video Player - Left/Top */}
        <div className="lg:w-1/2 p-4">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <div 
              id={`youtube-player-${videoId}`}
              className="absolute top-0 left-0 w-full h-full rounded-lg overflow-hidden"
            />
          </div>
          
          {/* Current Time Indicator */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Current: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{formatTime(currentTime)}</span>
            </span>
            <span className="text-gray-500 dark:text-gray-500">
              Segment {activeSegmentIndex + 1} of {segments.length}
            </span>
          </div>
        </div>

        {/* Transcript - Right/Bottom */}
        <div className="lg:w-1/2 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
          <div className="p-4 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              📝 Transcript
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Click any segment to jump to that time • Hover over words for analysis
            </p>
          </div>
          
          <div 
            ref={transcriptRef}
            className="max-h-[400px] lg:max-h-[500px] overflow-y-auto p-3 lg:p-4 space-y-2 lg:space-y-3"
          >
            {segments.map((segment, index) => {
              const isActive = index === activeSegmentIndex;
              const text = segment.transcript || segment.text || '';
              
              return (
                <div
                  key={index}
                  ref={el => { segmentRefs.current[index] = el; }}
                  onClick={() => seekTo(segment.startTime)}
                  className={`
                    p-3 lg:p-4 rounded-lg cursor-pointer transition-all duration-300 active:scale-[0.98]
                    ${isActive 
                      ? 'bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-500 shadow-lg' 
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                    }
                  `}
                >
                  {/* Segment Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${isActive 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }
                      `}>
                        {index + 1}
                      </span>
                      {isActive && (
                        <span className="text-xs px-2 py-0.5 bg-green-500 text-white rounded-full animate-pulse">
                          ▶ Playing
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        seekTo(segment.startTime);
                      }}
                      className={`
                        text-xs font-mono px-2 py-1 rounded transition-colors
                        ${isActive 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900'
                        }
                      `}
                    >
                      {formatTime(segment.startTime)} → {formatTime(segment.endTime)}
                    </button>
                  </div>
                  
                  {/* Transcript Text with Interactive Words */}
                  <div 
                    dir="rtl" 
                    className={`
                      text-base lg:text-lg leading-relaxed
                      ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}
                    `}
                  >
                    <InteractiveVerse text={text} showAnalysis={true} />
                  </div>
                  
                  {/* Duration indicator + Actions */}
                  <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                      <span>Duration: {segment.duration?.toFixed(1) || (segment.endTime - segment.startTime).toFixed(1)}s</span>
                      <span>•</span>
                      <span>{text.split(/\s+/).length} words</span>
                    </div>
                    
                    {/* Segment Actions */}
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {/* Play/Pause Audio Clip */}
                      {segment.audioUrl ? (
                        <>
                          <button
                            onClick={() => playSegmentAudio(index, segment.audioUrl!)}
                            className={`px-2 py-1 text-xs rounded transition-colors ${
                              playingAudioIndex === index 
                                ? 'bg-green-500 text-white animate-pulse' 
                                : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
                            }`}
                            title={playingAudioIndex === index ? 'Stop audio' : 'Play audio clip'}
                          >
                            {playingAudioIndex === index ? '⏹️ Stop' : '🔊 Play'}
                          </button>
                          <a
                            href={getAudioStreamUrl(segment.audioUrl)}
                            download={`segment-${index + 1}.mp3`}
                            className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-800"
                            title="Download audio clip"
                          >
                            ⬇️
                          </a>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            // Open segment in new tab with timestamp for manual download
                            const ytUrl = `https://www.youtube.com/watch?v=${videoId}&t=${Math.floor(segment.startTime)}s`;
                            window.open(ytUrl, '_blank');
                          }}
                          className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800"
                          title="Open in YouTube at timestamp"
                        >
                          ▶️ YouTube
                        </button>
                      )}
                      
                      {/* Copy Text */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(text);
                          setCopiedIndex(index);
                          setTimeout(() => setCopiedIndex(null), 2000);
                        }}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          copiedIndex === index 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                        title="Copy transcript"
                      >
                        {copiedIndex === index ? '✓' : '📋'}
                      </button>
                      
                      {/* Expand/Collapse for editing */}
                      <button
                        onClick={() => setExpandedSegment(expandedSegment === index ? null : index)}
                        className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                        title={expandedSegment === index ? 'Collapse' : 'Expand for details'}
                      >
                        {expandedSegment === index ? '▲' : '▼'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {expandedSegment === index && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2" onClick={(e) => e.stopPropagation()}>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <strong>Timestamps:</strong> {formatTime(segment.startTime)} - {formatTime(segment.endTime)} ({(segment.endTime - segment.startTime).toFixed(2)}s)
                      </div>
                      <textarea
                        defaultValue={text}
                        className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded resize-none"
                        rows={3}
                        dir="rtl"
                        readOnly
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            // Could add re-transcription here
                            alert('Re-transcription feature coming soon!');
                          }}
                          className="px-3 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded hover:bg-yellow-200"
                        >
                          🔄 Re-transcribe
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

