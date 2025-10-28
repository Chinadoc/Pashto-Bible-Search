"use client";

import { useState, useEffect, useRef } from 'react';

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
  const [uploadMode, setUploadMode] = useState<'file' | 'youtube'>('file');
  const [audioAnalysis, setAudioAnalysis] = useState<AudioAnalysis | null>(null);
  const [analyzingAudio, setAnalyzingAudio] = useState(false);
  const [selectedSegments, setSelectedSegments] = useState<number[]>([]);
  const [transcribingSegments, setTranscribingSegments] = useState(false);
  const [transcriptionService, setTranscriptionService] = useState<'assemblyai' | 'elevenlabs'>('elevenlabs');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      console.log('Starting complete video processing...');
      const response = await fetch('/api/process-video-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl: youtubeUrl.trim() })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setElevenLabsResult(result.transcript);
        console.log(`✅ Video processed: ${result.clipsCreated} clips created`);
        console.log(`📊 Saved to Supabase with video ID: ${result.videoId}`);
        
        // Reload videos to show the new one
        await new Promise(resolve => setTimeout(resolve, 1000));
        await loadVideos();
        
        // Clear the form
        setYoutubeUrl('');
      } else {
        setElevenLabsError(result.error || 'Video processing failed');
      }
    } catch (error) {
      console.error('Video processing error:', error);
      setElevenLabsError('Failed to process video. Please check console for details.');
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
                
                {/* Service Selector */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    🎯 Transcription Service
                  </label>
                  <select
                    value={transcriptionService}
                    onChange={(e) => setTranscriptionService(e.target.value as 'assemblyai' | 'elevenlabs')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="assemblyai">⚡ AssemblyAI (Cloud, Faster)</option>
                    <option value="elevenlabs">🎙️ ElevenLabs (Higher Quality)</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {transcriptionService === 'assemblyai'
                      ? 'Fast cloud-based transcription, processes entirely on servers'
                      : 'High-quality transcription, downloads locally then processes'}
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
                
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ✨ Creates audio clips, uploads to Google Drive, saves to Supabase, shows in Videos tab
                </p>
                
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  YouTube videos will be analyzed for speech segments before transcription
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
