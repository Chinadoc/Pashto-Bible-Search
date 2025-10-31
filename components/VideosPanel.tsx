"use client";

import { useState, useEffect, useRef, useMemo } from 'react';

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

    // Clean video ID (remove any invalid characters)
    const cleanVideoId = videoId.trim().replace(/[^a-zA-Z0-9_-]/g, '');
    
    if (cleanVideoId.length < 11) {
      setError(`Invalid video ID: ${videoId}`);
      return;
    }

    console.log(`Initializing YouTube player with videoId: ${cleanVideoId}`);

    // Set up message listener for YouTube iframe API
    const handleMessage = (event: MessageEvent) => {
      // YouTube iframe API sends messages with video progress
      if (event.origin !== 'https://www.youtube.com') return;
      
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'onVideoProgress' && data.info) {
          const currentTime = data.info.currentTime;
          if (typeof currentTime === 'number' && onTimeUpdate) {
            onTimeUpdate(currentTime);
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
    };

    window.addEventListener('message', handleMessage);

    // Mark as ready after a short delay
    const timer = setTimeout(() => {
      setPlayerReady(true);
      setError(null);
    }, 1000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timer);
    };
  }, [videoId, onTimeUpdate]);

  if (!videoId) {
    return (
      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No video ID provided</p>
      </div>
    );
  }

  // Clean video ID
  const cleanVideoId = videoId.trim().replace(/[^a-zA-Z0-9_-]/g, '');
  
  if (cleanVideoId.length < 11) {
    return (
      <div className="w-full h-full bg-red-100 dark:bg-red-900/20 rounded flex items-center justify-center">
        <p className="text-red-700 dark:text-red-300">Invalid video ID: {videoId}</p>
      </div>
    );
  }

  // Build YouTube embed URL with proper parameters
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
          console.log('YouTube iframe loaded');
          setPlayerReady(true);
          setError(null);
        }}
        onError={() => {
          console.error('YouTube iframe failed to load');
          setError('Failed to load YouTube video');
        }}
      />
    </div>
  );
}

interface TranscriptionAttempt {
  attempt: number;
  transcript: string;
  is_pashto: boolean;
  timestamp: number;
}

interface AudioSegment {
  start: number;
  end: number;
  duration: number;
  hasSpeech: boolean;
  confidence: number;
}

interface AudioAnalysis {
  segments: AudioSegment[];
  audioInfo: {
    duration: number;
    size: number;
    bitrate: number;
    sampleRate: number;
    channels: number;
  };
  videoId: string | null;
  driveFileId: string | null;
  driveUrl: string | null;
  youtubeUrl?: string | null;
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
  youtube_url?: string;
  audio_file?: string;
  transcript?: string;
  transcription?: TranscriptionAttempt;
  transcription_attempts?: TranscriptionAttempt[];
  clips: NormalizedClip[];
  total_clips: number;
  total_duration: number;
  updated_at: string | null;
  source?: 'cloudflare' | 'supabase';
  transcription_service?: string;
}

interface VideosPanelProps {
  onSelectClip?: (clip: { query: string; startTime: number; endTime: number }) => void;
}

interface WordFrequencyItem {
  word: string;
  count: number;
  segments: number[];
}

/**
 * Word Frequency Component for Video Transcript
 */
function VideoWordFrequency({ transcript, videoId }: { transcript: string; videoId: string }) {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Extract words and count frequency
  const wordFrequency = useMemo(() => {
    if (!transcript) return [];
    
    // Split by spaces and filter out punctuation
    const words = transcript
      .split(/\s+/)
      .map(w => w.replace(/[.!?؟،,;:()[\]{}""''«»]/g, '').trim())
      .filter(w => w.length > 0);

    const freqMap = new Map<string, { count: number; segments: number[] }>();
    
    words.forEach((word, index) => {
      const normalized = word;
      if (!freqMap.has(normalized)) {
        freqMap.set(normalized, { count: 0, segments: [] });
      }
      const entry = freqMap.get(normalized)!;
      entry.count++;
      // Track which segment this word appears in (rough estimate)
      const segmentIndex = Math.floor(index / 10); // Approximate segments
      if (!entry.segments.includes(segmentIndex)) {
        entry.segments.push(segmentIndex);
      }
    });

    return Array.from(freqMap.entries())
      .map(([word, data]) => ({ word, count: data.count, segments: data.segments }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 100); // Top 100 words
  }, [transcript]);

  // Fetch translations for words
  useEffect(() => {
    if (wordFrequency.length === 0) return;
    
    const fetchTranslations = async () => {
      setLoading(true);
      try {
        // Fetch translations for top 20 words
        const topWords = wordFrequency.slice(0, 20).map(w => w.word);
        const response = await fetch('/api/word-translations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ words: topWords }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setTranslations(data.translations || {});
        }
      } catch (error) {
        console.error('Failed to fetch translations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();
  }, [wordFrequency]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Top {wordFrequency.length} words from transcript
        </p>
        {loading && (
          <span className="text-xs text-gray-500 dark:text-gray-400">Loading translations...</span>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
        {wordFrequency.map((item, index) => (
          <div
            key={item.word}
            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-xs text-gray-500 dark:text-gray-400 w-6">
                {index + 1}
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100" dir="rtl">
                {item.word}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({item.count}x)
              </span>
            </div>
            {translations[item.word] && (
              <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                {translations[item.word]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function VideosPanel({ onSelectClip }: VideosPanelProps) {
  const [videos, setVideos] = useState<NormalizedVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [retrying, setRetrying] = useState<string | null>(null);
  const [elevenLabsLoading, setElevenLabsLoading] = useState(false);
  const [elevenLabsResult, setElevenLabsResult] = useState<string | null>(null);
  const [elevenLabsError, setElevenLabsError] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'youtube'>('file');
  const [audioAnalysis, setAudioAnalysis] = useState<AudioAnalysis | null>(null);
  const [analyzingAudio, setAnalyzingAudio] = useState(false);
  const [selectedSegments, setSelectedSegments] = useState<number[]>([]);
  const [transcribingSegments, setTranscribingSegments] = useState(false);
  const [transcriptionService, setTranscriptionService] = useState<'elevenlabs'>('elevenlabs');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [activeTabs, setActiveTabs] = useState<Record<string, 'segments' | 'frequency'>>({});
  const [videoCurrentTime, setVideoCurrentTime] = useState<Record<string, number>>({});
  const [activeSegmentIds, setActiveSegmentIds] = useState<Record<string, number | null>>({});
  const [audioErrors, setAudioErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const segmentRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const setActiveTab = (videoId: string, tab: 'segments' | 'frequency') => {
    setActiveTabs(prev => ({ ...prev, [videoId]: tab }));
  };

  const getActiveTab = (videoId: string): 'segments' | 'frequency' => {
    return activeTabs[videoId] || 'segments';
  };

  const extractVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

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

  const retryLowConfidenceClips = async (videoId: string) => {
    setRetrying(videoId);
    try {
      console.log(`🔄 Retrying low-confidence clips for video: ${videoId}`);
      
      const response = await fetch('/api/retry-clips-elevenlabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Retried ${result.retried} clips with ElevenLabs`);
        alert(`Successfully retried ${result.retried} clips with ElevenLabs for better quality!`);
        // Reload videos to get updated results
        await loadVideos();
      } else {
        alert(`Retry failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error retrying clips:', error);
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

    if (!file) {
      if (uploadMode === 'youtube') {
        void analyzeYouTubeAudio();
        return;
      }
      setElevenLabsError('Please select an audio file');
      return;
    }

    setElevenLabsLoading(true);
    setElevenLabsError(null);
    setElevenLabsResult(null);

    try {
      const formData = new FormData();

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
      formData.append('service', transcriptionService);

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
        
        // Show which service was used
        console.log(`Transcription completed with ${result.service}`);
      } else {
        setElevenLabsError(result.error || 'Transcription failed');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      setElevenLabsError('Failed to transcribe audio');
    } finally {
      setElevenLabsLoading(false);
    }
  };

  const analyzeYouTubeAudio = async () => {
    if (!youtubeUrl.trim()) {
      setElevenLabsError('Please enter a YouTube URL');
      return;
    }

    setAnalyzingAudio(true);
    setElevenLabsError(null);
    setAudioAnalysis(null);
    setSelectedSegments([]);

    try {
      const response = await fetch('/api/analyze-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl: youtubeUrl.trim() }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const audioInfo = result.audioInfo ?? {
          duration: 0,
          size: 0,
          bitrate: 0,
          sampleRate: 0,
          channels: 0,
        };

        setAudioAnalysis({
          segments: Array.isArray(result.segments) ? result.segments : [],
          audioInfo,
          videoId: result.videoId ?? extractVideoId(youtubeUrl.trim()),
          driveFileId: result.driveFileId ?? null,
          driveUrl: result.driveUrl ?? null,
          youtubeUrl: youtubeUrl.trim(),
        });
      } else {
        setElevenLabsError(result.error || 'Audio analysis failed');
      }
    } catch (error) {
      console.error('Audio analysis error:', error);
      setElevenLabsError('Failed to analyze YouTube audio');
    } finally {
      setAnalyzingAudio(false);
    }
  };

  const processCompleteVideo = async () => {
    if (!youtubeUrl.trim()) {
      setElevenLabsError('Please enter a YouTube URL');
      return;
    }

    setElevenLabsLoading(true);
    setElevenLabsError(null);
    setElevenLabsResult(null);

    try {
      console.log('🎬 Starting complete video processing with Cloudflare...');
      const response = await fetch('/api/process-video-cloudflare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          youtubeUrl: youtubeUrl.trim(),
          apiKeys: {
            elevenlabs: process.env.ELEVENLABS_API_KEY || 'sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543'
          }
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setElevenLabsResult(result.transcript || 'Video processed successfully!');
        console.log(`✅ Video processed: ${result.segments?.length || 0} segments created`);
        console.log(`📊 Video ID: ${result.videoId}`);
        
        // Reload videos to show the new one
        await new Promise(resolve => setTimeout(resolve, 2000));
        await loadVideos();
        
        // Clear the form
        setYoutubeUrl('');
      } else {
        setElevenLabsError(result.error || result.details || 'Video processing failed');
      }
    } catch (error) {
      console.error('Video processing error:', error);
      setElevenLabsError(`Failed to process video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setElevenLabsLoading(false);
    }
  };

  const handleSegmentSelection = (segmentIndex: number) => {
    setSelectedSegments(prev =>
      prev.includes(segmentIndex)
        ? prev.filter(i => i !== segmentIndex)
        : [...prev, segmentIndex]
    );
  };

  const base64ToUint8Array = (base64: string) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  };

  const transcribeSelectedSegments = async () => {
    if (!audioAnalysis || selectedSegments.length === 0) {
      setElevenLabsError('Please select audio segments to transcribe');
      return;
    }

    if (!audioAnalysis.driveFileId) {
      setElevenLabsError('Original audio is not stored in Google Drive. Please analyze the video again.');
      return;
    }

    setTranscribingSegments(true);
    setElevenLabsError(null);

    try {
      const segmentsToTranscribe = selectedSegments.map(index => audioAnalysis.segments[index]);
      const videoId = audioAnalysis.videoId ?? extractVideoId(youtubeUrl.trim());

      const response = await fetch('/api/split-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          youtubeUrl: youtubeUrl.trim(),
          selectedSegments: segmentsToTranscribe,
          driveFileId: audioAnalysis.driveFileId,
          videoId,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Process each extracted segment for transcription
        const transcriptions: string[] = [];
        const audioSegments: any[] = [];

        for (const segment of result.extractedSegments) {
          try {
            // Send each segment to ElevenLabs for transcription
            const formData = new FormData();
            if (!segment.audioBase64) {
              transcriptions.push(`[Segment ${segment.segmentIndex + 1}: ${formatDuration(segment.start)} - ${formatDuration(segment.end)}] [Missing audio data]`);
              continue;
            }

            const audioBytes = base64ToUint8Array(segment.audioBase64);
            const audioBlob = new Blob([audioBytes], { type: 'audio/mp3' });
            formData.append('audio', audioBlob, `segment_${segment.segmentIndex}.mp3`);

            const transResponse = await fetch('/api/transcribe-audio', {
              method: 'POST',
              body: formData,
            });

            const transResult = await transResponse.json();

            if (transResponse.ok && transResult.success) {
              transcriptions.push(`[Segment ${segment.segmentIndex + 1}: ${formatDuration(segment.start)} - ${formatDuration(segment.end)}] ${transResult.transcript}`);

              // Store audio segment info for Supabase storage
              audioSegments.push({
                segmentIndex: segment.segmentIndex,
                startTime: segment.start,
                endTime: segment.end,
                duration: segment.duration,
                size: segment.size,
                transcript: transResult.transcript,
                validation: transResult.validation,
                driveFileId: segment.driveFileId,
                driveUrl: segment.driveUrl,
              });

            } else {
              transcriptions.push(`[Segment ${segment.segmentIndex + 1}: ${formatDuration(segment.start)} - ${formatDuration(segment.end)}] [Transcription failed: ${transResult.error || 'Unknown error'}]`);
            }
          } catch (error) {
            transcriptions.push(`[Segment ${segment.segmentIndex + 1}: ${formatDuration(segment.start)} - ${formatDuration(segment.end)}] [Error: ${error}]`);
          }
        }

        // Store the complete transcript in Supabase
        try {
          const storeResponse = await fetch('/api/store-video-transcript', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              videoId: videoId,
              videoUrl: youtubeUrl.trim(),
              transcript: transcriptions.join('\n\n'),
              segments: segmentsToTranscribe,
              audioSegments: audioSegments,
              metadata: {
                totalSegments: selectedSegments.length,
                audioInfo: audioAnalysis.audioInfo,
                processingDate: new Date().toISOString(),
                sourceDriveFileId: audioAnalysis.driveFileId,
                sourceDriveUrl: audioAnalysis.driveUrl,
                youtubeUrl: audioAnalysis.youtubeUrl ?? youtubeUrl.trim(),
              }
            }),
          });

          const storeResult = await storeResponse.json();
          if (storeResponse.ok && storeResult.success) {
            console.log('✅ Transcript stored in Supabase:', storeResult.transcriptId);
          } else {
            console.warn('⚠️ Failed to store transcript in Supabase:', storeResult.error);
          }
        } catch (error) {
          console.warn('⚠️ Error storing transcript in Supabase:', error);
        }

        setElevenLabsResult(transcriptions.join('\n\n'));
      } else {
        setElevenLabsError(result.error || 'Failed to process video segments');
      }
    } catch (error) {
      console.error('Segment transcription error:', error);
      setElevenLabsError('Failed to transcribe selected segments');
    } finally {
      setTranscribingSegments(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const resetElevenLabsState = () => {
    setElevenLabsResult(null);
    setElevenLabsError(null);
    setYoutubeUrl('');
    setUploadMode('file');
    setAudioAnalysis(null);
    setSelectedSegments([]);
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
            Upload an audio file or enter a YouTube URL to analyze audio segments and get targeted Pashto transcription using ElevenLabs AI
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => {
              setUploadMode('file');
              setAudioAnalysis(null);
              setSelectedSegments([]);
              setYoutubeUrl('');
            }}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              uploadMode === 'file'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            📁 File Upload
          </button>
          <button
            onClick={() => {
              setUploadMode('youtube');
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
              setAudioAnalysis(null);
              setSelectedSegments([]);
            }}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              uploadMode === 'youtube'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            🎥 YouTube URL
          </button>
        </div>

        {/* File Upload Tab */}
        {uploadMode === 'file' && (
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
        {uploadMode === 'youtube' && (
          <div className="space-y-4">
            {/* URL Input and Analysis */}
            {!audioAnalysis && !analyzingAudio && (
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
                    onClick={analyzeYouTubeAudio}
                    disabled={analyzingAudio || !youtubeUrl.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <span>{analyzingAudio ? 'Analyzing...' : 'Analyze Audio'}</span>
                  </button>
                </div>
                
                {/* Service Info */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    🎙️ Using <strong>ElevenLabs</strong> for high-quality Pashto transcription
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Downloads audio locally, transcribes with ElevenLabs, then splits into segments
                  </p>
                </div>

                {/* Complete Video Processing Button */}
                <button
                  onClick={processCompleteVideo}
                  disabled={elevenLabsLoading || !youtubeUrl.trim()}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center space-x-2 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {elevenLabsLoading ? '⏳ Processing Video...' : '🚀 Process Complete Video'}
                  </span>
                </button>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Downloads audio → Transcribes with ElevenLabs → Creates segments → Uploads to Cloudflare R2 → Saves to D1
                </p>
              </div>
            )}

            {/* Audio Analysis in Progress */}
            {analyzingAudio && (
              <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="text-blue-700 dark:text-blue-300">Analyzing audio segments...</p>
              </div>
            )}

            {/* Audio Analysis Results and Segment Selection */}
            {audioAnalysis && !analyzingAudio && (
              <div className="space-y-4">
                {/* Audio Info */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Audio Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>Duration: {formatDuration(audioAnalysis.audioInfo.duration)}</div>
                    <div>Size: {(audioAnalysis.audioInfo.size / 1024 / 1024).toFixed(1)}MB</div>
                    <div>Bitrate: {audioAnalysis.audioInfo.bitrate}kbps</div>
                    <div>Sample Rate: {audioAnalysis.audioInfo.sampleRate}Hz</div>
                  </div>
                </div>

                {/* Segments */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Audio Segments ({audioAnalysis.segments.length})
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {audioAnalysis.segments.map((segment, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          selectedSegments.includes(index)
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => handleSegmentSelection(index)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={selectedSegments.includes(index)}
                              onChange={() => handleSegmentSelection(index)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="font-medium text-sm">Segment {index + 1}</span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDuration(segment.start)} - {formatDuration(segment.end)}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Duration: {formatDuration(segment.duration)}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              segment.hasSpeech
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}>
                              {segment.hasSpeech ? 'Speech' : 'Silence'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {Math.round(segment.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transcribe Selected Segments */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedSegments.length} of {audioAnalysis.segments.length} segments selected
                  </span>
                  <button
                    onClick={transcribeSelectedSegments}
                    disabled={transcribingSegments || selectedSegments.length === 0}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    <span>{transcribingSegments ? 'Transcribing...' : 'Transcribe Selected'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {(elevenLabsLoading || transcribingSegments) && (
          <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-blue-700 dark:text-blue-300">
              {transcribingSegments ? 'Transcribing selected segments...' : 'Transcribing your audio with ElevenLabs AI...'}
            </p>
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
                  <div>Segments: {video.total_clips}</div>
                  {video.total_duration && <div>Duration: {formatDuration(video.total_duration)}</div>}
                </div>
              </div>

              {/* YouTube Embed */}
              {video.youtube_url && video.video_id ? (
                <div className="bg-white dark:bg-gray-800 rounded border p-4 mb-4">
                  <div className="aspect-video w-full min-h-[400px]">
                    {(() => {
                      // Extract video ID from URL if video_id is not valid
                      let videoId = video.video_id;
                      if (!videoId || videoId.length < 11) {
                        const extracted = extractVideoId(video.youtube_url);
                        if (extracted) {
                          videoId = extracted;
                          console.log(`Extracted video ID from URL: ${videoId}`);
                        }
                      }
                      console.log(`Rendering YouTube player with videoId: ${videoId}, youtube_url: ${video.youtube_url}`);
                      return (
                        <YouTubePlayer
                          videoId={videoId}
                          segments={video.clips}
                          onTimeUpdate={(currentTime) => {
                            setVideoCurrentTime(prev => ({ ...prev, [video.video_id || '']: currentTime }));
                            
                            // Find active segment
                            const activeSegment = video.clips.findIndex((clip) => {
                              const startTime = clip.start_time_seconds || clip.start_time || 0;
                              const endTime = clip.end_time_seconds || clip.end_time || 0;
                              return currentTime >= startTime && currentTime < endTime;
                            });
                            
                            if (activeSegment !== -1) {
                              setActiveSegmentIds(prev => ({ ...prev, [video.video_id || '']: activeSegment }));
                              
                              // Auto-scroll to active segment
                              const segmentKey = `${video.video_id}-${activeSegment + 1}`;
                              const segmentElement = segmentRefs.current.get(segmentKey);
                              if (segmentElement) {
                                segmentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            } else {
                              setActiveSegmentIds(prev => ({ ...prev, [video.video_id || '']: null }));
                            }
                          }}
                        />
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-4 mb-4">
                  <p className="text-yellow-800 dark:text-yellow-300">
                    Missing video ID or YouTube URL. Video ID: {video.video_id || 'N/A'}, YouTube URL: {video.youtube_url || 'N/A'}
                  </p>
                </div>
              )}

              {/* Transcript with Word Frequency Tab */}
              {(video.transcript || video.transcription) && (
                <div className="bg-white dark:bg-gray-800 rounded border p-4 mb-4">
                  {/* Tabs */}
                  <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                    <button
                      onClick={() => setActiveTab(video.video_id || '', 'segments')}
                      className={`px-4 py-2 font-medium text-sm transition-colors ${
                        getActiveTab(video.video_id || '') === 'segments'
                          ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      Transcript
                    </button>
                    <button
                      onClick={() => setActiveTab(video.video_id || '', 'frequency')}
                      className={`px-4 py-2 font-medium text-sm transition-colors ${
                        getActiveTab(video.video_id || '') === 'frequency'
                          ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      Word Frequency
                    </button>
                    {video.transcription_service && (
                      <span className="ml-auto text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 self-center">
                        {video.transcription_service}
                      </span>
                    )}
                  </div>

                  {/* Transcript Tab */}
                  {getActiveTab(video.video_id || '') === 'segments' && (
                    <div>
                      <p className="text-gray-900 dark:text-gray-100 leading-relaxed" dir="rtl">
                        {video.transcript || video.transcription?.transcript}
                      </p>
                      {video.transcription && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Generated: {formatTimestamp(video.transcription.timestamp)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Word Frequency Tab */}
                  {getActiveTab(video.video_id || '') === 'frequency' && (
                    <VideoWordFrequency 
                      transcript={video.transcript || video.transcription?.transcript || ''}
                      videoId={video.video_id || ''}
                    />
                  )}
                </div>
              )}


              {/* Audio Clips */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Audio Segments ({video.clips.length})
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {video.clips.map((clip, index) => {
                    const segmentNum = clip.segment_number || clip.sentence_number || (index + 1);
                    const text = clip.transcript_text || clip.sentence || '';
                    const startTime = clip.start_time_seconds || clip.start_time || 0;
                    const endTime = clip.end_time_seconds || clip.end_time || 0;
                    const duration = clip.duration || (endTime - startTime);
                    const audioKey = `${video.video_id}-${segmentNum}`;
                    const isPlaying = playingAudio === audioKey;
                    
                    // Construct audio URL - prefer audio_url from API, fallback to constructed URL
                    let audioUrl = clip.audio_url || clip.server_url;
                    
                    // If no audio_url from API, try to construct it
                    if (!audioUrl && video.video_id) {
                      // Use the correct video ID (try to extract from URL if video_id looks wrong)
                      let correctVideoId = video.video_id;
                      
                      // If video_id looks invalid or doesn't match URL, extract from URL
                      if (video.youtube_url && (!correctVideoId || correctVideoId.length < 11)) {
                        const extracted = extractVideoId(video.youtube_url);
                        if (extracted) {
                          correctVideoId = extracted;
                          console.log(`Using extracted video ID for audio: ${correctVideoId}`);
                        }
                      }
                      
                      // Construct worker URL
                      const CLOUDFLARE_WORKER_URL = 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';
                      audioUrl = `${CLOUDFLARE_WORKER_URL}/api/video/${correctVideoId}/audio?segment=${segmentNum}`;
                    }
                    
                    // Debug: log audio URL construction for first few segments
                    if (index < 3) {
                      console.log(`Segment ${segmentNum} audio URL:`, audioUrl);
                      console.log('Clip data:', { 
                        audio_url: clip.audio_url, 
                        server_url: clip.server_url, 
                        r2_key: clip.r2_key,
                        video_id: video.video_id 
                      });
                    }

                    return (
                      <div
                        key={segmentNum}
                        ref={(el) => {
                          if (el) {
                            segmentRefs.current.set(`${video.video_id}-${segmentNum}`, el);
                          }
                        }}
                        className={`bg-white dark:bg-gray-800 rounded border p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          activeSegmentIds[video.video_id || ''] === index
                            ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30 border-blue-500'
                            : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Audio Player */}
                          {audioUrl ? (
                            <div className="flex flex-col items-center gap-1">
                              <button
                                onClick={async () => {
                                  const audio = audioRefs.current.get(audioKey);
                                  if (audio) {
                                    if (isPlaying) {
                                      audio.pause();
                                      setPlayingAudio(null);
                                    } else {
                                      // Pause other audios
                                      audioRefs.current.forEach((a, k) => {
                                        if (k !== audioKey) a.pause();
                                      });
                                      setAudioErrors(prev => ({ ...prev, [audioKey]: '' }));
                                      try {
                                        // Ensure audio is loaded
                                        if (audio.readyState === 0) {
                                          audio.load();
                                          // Wait for audio to load
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
                                        const errorMsg = error instanceof Error ? error.message : 'Failed to play audio';
                                        setAudioErrors(prev => ({ ...prev, [audioKey]: errorMsg }));
                                        setPlayingAudio(null);
                                      }
                                    }
                                  } else if (audioUrl) {
                                    // Fallback: create new audio element
                                    const newAudio = new Audio(audioUrl);
                                    newAudio.onended = () => setPlayingAudio(null);
                                    newAudio.onpause = () => setPlayingAudio(null);
                                    newAudio.onerror = (e) => {
                                      console.error('Audio element error:', e);
                                      setAudioErrors(prev => ({ ...prev, [audioKey]: 'Failed to load audio source' }));
                                      setPlayingAudio(null);
                                    };
                                    setAudioErrors(prev => ({ ...prev, [audioKey]: '' }));
                                    try {
                                      await newAudio.play();
                                      setPlayingAudio(audioKey);
                                      audioRefs.current.set(audioKey, newAudio);
                                    } catch (error) {
                                      console.error('Audio playback error:', error);
                                      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
                                      setAudioErrors(prev => ({ ...prev, [audioKey]: errorMsg }));
                                    }
                                  }
                                }}
                                className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors disabled:opacity-50"
                                disabled={!!audioErrors[audioKey]}
                              >
                                {isPlaying ? (
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                  </svg>
                                )}
                              </button>
                              {audioErrors[audioKey] && (
                                <p className="text-xs text-red-500 max-w-[80px] text-center">{audioErrors[audioKey]}</p>
                              )}
                            </div>
                          ) : (
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          
                          {/* Clip Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                Segment {segmentNum}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDuration(startTime)} - {formatDuration(endTime)} ({formatDuration(duration)})
                              </span>
                            </div>
                            <p 
                              className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed cursor-pointer"
                              dir="rtl"
                              onClick={(e) => {
                                // Don't navigate to search, just show transcript text
                                e.stopPropagation();
                              }}
                            >
                              {text}
                            </p>
                          </div>
                        </div>
                        
                        {/* Hidden Audio Element */}
                        {audioUrl && (
                          <audio
                            ref={(el) => {
                              if (el) {
                                audioRefs.current.set(audioKey, el);
                                el.onended = () => setPlayingAudio(null);
                                el.onpause = () => {
                                  if (!el.ended) setPlayingAudio(null);
                                };
                                el.onerror = (e) => {
                                  console.error(`Audio error for ${audioKey}:`, el.error);
                                  const errorCode = el.error?.code;
                                  let errorMsg = 'Failed to load audio';
                                  if (errorCode === 4) {
                                    errorMsg = 'Audio source not found';
                                  } else if (errorCode === 3) {
                                    errorMsg = 'Audio decoding failed';
                                  } else if (errorCode === 2) {
                                    errorMsg = 'Network error';
                                  }
                                  setAudioErrors(prev => ({ ...prev, [audioKey]: errorMsg }));
                                  setPlayingAudio(null);
                                };
                                el.onloadstart = () => {
                                  setAudioErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors[audioKey];
                                    return newErrors;
                                  });
                                };
                              }
                            }}
                            src={audioUrl}
                            preload="none"
                            crossOrigin="anonymous"
                          >
                            <source src={audioUrl} type="audio/mpeg" />
                            <source src={audioUrl} type="audio/mp3" />
                            Your browser does not support the audio element.
                          </audio>
                        )}
                      </div>
                    );
                  })}
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
