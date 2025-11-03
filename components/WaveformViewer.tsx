'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface WaveformViewerProps {
  audioUrl: string;
  segments: Array<{ startTime: number; endTime: number; text?: string }>;
  onSegmentUpdate?: (segments: Array<{ startTime: number; endTime: number }>) => void;
  videoDuration?: number;
  onDetectSilence?: () => Promise<Array<{ startTime: number; endTime: number }>>;
  silenceRegions?: Array<{ start: number; end: number }>; // Detected silence regions
  onTimeUpdate?: (currentTime: number) => void; // Callback for time updates
  onPlay?: () => void; // Callback when audio starts playing
  onPause?: () => void; // Callback when audio pauses
}

export default function WaveformViewer({ 
  audioUrl, 
  segments, 
  onSegmentUpdate,
  videoDuration = 0,
  onDetectSilence,
  silenceRegions = [],
  onTimeUpdate,
  onPlay,
  onPause
}: WaveformViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [actualDuration, setActualDuration] = useState(0); // Actual audio duration
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [draggingSegment, setDraggingSegment] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [draggingHandle, setDraggingHandle] = useState<{segmentIndex: number; isStart: boolean} | null>(null);
  const [isDetectingSilence, setIsDetectingSilence] = useState(false);
  const [isLoadingWaveform, setIsLoadingWaveform] = useState(true);
  const [audioUrlKey, setAudioUrlKey] = useState(0); // Force re-render when audio URL changes
  const [zoomLevel, setZoomLevel] = useState(1); // Zoom level (1 = no zoom, 2 = 2x zoom, etc.)
  const [zoomCenter, setZoomCenter] = useState(0.5); // Center of zoom (0-1, where 0.5 is center)

  // Load audio and generate waveform
  useEffect(() => {
    if (!audioUrl || !audioRef.current) return;

    const audio = audioRef.current;
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let source: MediaElementAudioSourceNode;
    
    // Store event handlers so they can be removed in cleanup
    let handleLoadedData: (() => void) | null = null;
    let handleLoadedMetadata: (() => void) | null = null;
    let handleCanPlay: (() => void) | null = null;

    const initAudio = async () => {
      try {
        setIsLoadingWaveform(true);
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.3;
        source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        sourceRef.current = source;

        // Generate initial waveform data from audio file
        const generateWaveform = async () => {
          if (!analyser || !audio) return;
          
          try {
            // First, try to decode the audio file to generate waveform
            // This works even when audio isn't playing
            const audioBuffer = await fetch(audioUrl)
              .then(response => response.arrayBuffer())
              .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
            
            // Get the actual duration from the decoded audio
            const duration = audioBuffer.duration;
            setActualDuration(duration);
            console.log(`Audio duration: ${duration}s`);
            
            // Get the audio channel data (use first channel)
            const channelData = audioBuffer.getChannelData(0);
            const dataLength = channelData.length;
            
            // Sample the waveform data - more samples for better visualization
            const samples = Math.min(1600, Math.floor(duration * 100)); // ~100 samples per second, max 1600
            const sampleSize = Math.floor(dataLength / samples);
            const waveform: number[] = [];
            
            for (let i = 0; i < samples; i++) {
              let max = 0;
              const start = i * sampleSize;
              const end = Math.min(start + sampleSize, dataLength);
              
              for (let j = start; j < end; j++) {
                const value = Math.abs(channelData[j]);
                max = Math.max(max, value);
              }
              
              waveform.push(max);
            }
            
            console.log(`Generated waveform from audio file: ${waveform.length} samples, duration: ${duration}s`);
            setWaveformData(waveform);
            setIsLoadingWaveform(false);
          } catch (decodeError) {
            console.warn('Failed to decode audio for waveform, trying analyser method:', decodeError);
            
            // Fallback: use analyser method (requires audio to be playing)
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyser.getByteTimeDomainData(dataArray);
            
            const samples = 800;
            const sampleSize = Math.floor(bufferLength / samples);
            const waveform: number[] = [];
            
            for (let i = 0; i < samples; i++) {
              let max = 0;
              for (let j = 0; j < sampleSize; j++) {
                const value = Math.abs(dataArray[i * sampleSize + j] - 128) / 128;
                max = Math.max(max, value);
              }
              waveform.push(max);
            }
            
            setWaveformData(waveform);
            setIsLoadingWaveform(false);
          }
        };

        // Generate waveform when audio loads
        handleLoadedData = () => {
          console.log('Audio loadeddata event fired');
          setTimeout(() => {
            generateWaveform();
          }, 500); // Increased delay to ensure audio is fully loaded
        };
        audio.addEventListener('loadeddata', handleLoadedData);

        // Generate waveform when metadata loads
        handleLoadedMetadata = () => {
          console.log('Audio loadedmetadata event fired');
          setTimeout(() => {
            generateWaveform();
          }, 500);
        };
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        
        // Also try when canplay fires
        handleCanPlay = () => {
          console.log('Audio canplay event fired');
          setTimeout(() => {
            generateWaveform();
          }, 500);
        };
        audio.addEventListener('canplay', handleCanPlay);
        
        // Also try when canplaythrough fires (audio fully buffered)
        const handleCanPlayThrough = () => {
          console.log('Audio canplaythrough event fired');
          setTimeout(() => {
            generateWaveform();
          }, 500);
        };
        audio.addEventListener('canplaythrough', handleCanPlayThrough);
        
        // Also try to load immediately if already ready
        if (audio.readyState >= 2) { // HAVE_CURRENT_DATA or higher
          console.log(`Audio already ready, state: ${audio.readyState}`);
          setTimeout(() => {
            generateWaveform();
          }, 500);
        } else {
          // Force load if not already loading
          console.log('Forcing audio load...');
          audio.load();
        }

        // Animate waveform during playback
        const animate = () => {
          if (isPlaying && analyser) {
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyser.getByteTimeDomainData(dataArray);
            
            const samples = 800;
            const sampleSize = Math.floor(bufferLength / samples);
            const waveform: number[] = [];
            
            for (let i = 0; i < samples; i++) {
              let max = 0;
              for (let j = 0; j < sampleSize; j++) {
                const value = Math.abs(dataArray[i * sampleSize + j] - 128) / 128;
                max = Math.max(max, value);
              }
              waveform.push(max);
            }
            
            setWaveformData(waveform);
            animationFrameRef.current = requestAnimationFrame(animate);
          }
        };

        audio.addEventListener('play', () => {
          animate();
        });

        audio.addEventListener('pause', () => {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
        });
      } catch (error) {
        console.error('Error initializing audio:', error);
        setIsLoadingWaveform(false);
      }
    };

    initAudio();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (source) source.disconnect();
      if (analyser) analyser.disconnect();
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close().catch(() => {});
      }
      // Remove event listeners
      if (audio) {
        if (handleLoadedData) {
          audio.removeEventListener('loadeddata', handleLoadedData);
        }
        if (handleLoadedMetadata) {
          audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        }
        if (handleCanPlay) {
          audio.removeEventListener('canplay', handleCanPlay);
        }
        // Note: handleCanPlayThrough is defined inside initAudio, so we can't remove it here
        // but that's okay since the component will unmount
      }
    };
  }, [audioUrl, isPlaying, audioUrlKey]); // Add audioUrlKey to dependencies

  // Draw waveform with silence regions and segments (with zoom support)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size based on container
    const container = canvas.parentElement;
    if (container) {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width || 800;
      canvas.height = 150; // Taller for better visibility
    }

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    // Use actual duration if available, otherwise fall back to videoDuration prop
    const duration = actualDuration > 0 ? actualDuration : (videoDuration > 0 ? videoDuration : 0);

    // Calculate zoom viewport
    const viewportWidth = duration / zoomLevel;
    const viewportStart = Math.max(0, Math.min(duration - viewportWidth, (duration - viewportWidth) * zoomCenter));
    const viewportEnd = viewportStart + viewportWidth;

    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, width, height);
    
    // Draw silence regions first (background layer) - only if duration is known
    if (duration > 0 && silenceRegions.length > 0) {
      silenceRegions.forEach((silence) => {
        // Only draw if silence region is within viewport
        if (silence.end >= viewportStart && silence.start <= viewportEnd) {
          const startX = ((silence.start - viewportStart) / viewportWidth) * width;
          const endX = ((silence.end - viewportStart) / viewportWidth) * width;
          ctx.fillStyle = 'rgba(239, 68, 68, 0.3)'; // Red tint for silence
          ctx.fillRect(Math.max(0, startX), 0, Math.min(width, endX) - Math.max(0, startX), height);
          
          // Draw silence label if visible
          if (startX >= 0 && startX < width) {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
            ctx.font = '10px sans-serif';
            ctx.fillText('SILENCE', startX + 2, 12);
          }
        }
      });
    }
    
    // Draw waveform bars if we have data - colorful gradient like the image
    if (waveformData.length > 0 && duration > 0) {
      const samplesPerSecond = waveformData.length / duration;
      const startSample = Math.floor(viewportStart * samplesPerSecond);
      const endSample = Math.ceil(viewportEnd * samplesPerSecond);
      const visibleSamples = Math.max(1, endSample - startSample);
      const barWidth = width / visibleSamples;
      
      for (let i = startSample; i < endSample && i < waveformData.length; i++) {
        const value = waveformData[i];
        const barHeight = Math.max(2, value * height * 0.7);
        const x = ((i - startSample) / visibleSamples) * width;
        const y = centerY - barHeight / 2;
        
        // Create colorful gradient based on position in full audio (not viewport)
        const positionInFullAudio = i / waveformData.length;
        const hue = positionInFullAudio * 360; // 0-360 degrees
        const saturation = value > 0.1 ? 80 : 20; // More saturated for louder sounds
        const lightness = value > 0.1 ? 60 : 40; // Brighter for louder sounds
        
        // Use HSL for vibrant colors
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.fillRect(x, y, Math.max(1, barWidth - 0.5), barHeight);
      }
    } else if (waveformData.length === 0) {
      // Show placeholder if no waveform data
      ctx.fillStyle = '#374151';
      ctx.fillRect(0, centerY - 1, width, 2);
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Loading waveform...', width / 2, centerY);
      ctx.textAlign = 'left';
    }

    // Draw segment boundaries with draggable handles - only if duration is known
    if (duration > 0) {
      segments.forEach((segment, index) => {
        // Only draw if segment is within viewport or overlaps
        if (segment.endTime >= viewportStart && segment.startTime <= viewportEnd) {
          const startX = ((segment.startTime - viewportStart) / viewportWidth) * width;
          const endX = ((segment.endTime - viewportStart) / viewportWidth) * width;
          
          // Highlight segment area
          ctx.fillStyle = 'rgba(79, 70, 229, 0.2)';
          ctx.fillRect(Math.max(0, startX), 0, Math.min(width, endX) - Math.max(0, startX), height);
          
          // Draw start boundary handle (if visible)
          if (startX >= -4 && startX <= width) {
            ctx.fillStyle = '#6366f1';
            ctx.fillRect(Math.max(0, startX - 2), 0, 4, height);
            // Draggable handle indicator
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(Math.max(0, startX - 1), 0, 2, height);
          }
          
          // Draw end boundary handle (if visible)
          if (endX >= -4 && endX <= width) {
            ctx.fillStyle = '#6366f1';
            ctx.fillRect(Math.max(0, endX - 2), 0, 4, height);
            // Draggable handle indicator
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(Math.max(0, endX - 1), 0, 2, height);
          }
          
          // Segment number label (if visible)
          if (startX >= 0 && startX < width) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText(`${index + 1}`, startX + 5, 18);
          }
          
          // Time labels (if visible)
          if (startX >= 0 && startX < width) {
            ctx.fillStyle = '#9ca3af';
            ctx.font = '9px sans-serif';
            const startTimeLabel = formatTime(segment.startTime);
            ctx.fillText(startTimeLabel, startX + 5, height - 5);
          }
          if (endX >= 0 && endX < width) {
            ctx.fillStyle = '#9ca3af';
            ctx.font = '9px sans-serif';
            const endTimeLabel = formatTime(segment.endTime);
            ctx.fillText(endTimeLabel, endX - 30, height - 5);
          }
        }
      });
    }

    // Draw progress indicator - only if duration is known
    if (duration > 0 && currentTime >= viewportStart && currentTime <= viewportEnd) {
      const progressX = ((currentTime - viewportStart) / viewportWidth) * width;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(progressX, 0);
      ctx.lineTo(progressX, height);
      ctx.stroke();
      
      // Progress indicator circle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(progressX, centerY, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [waveformData, currentTime, segments, videoDuration, actualDuration, silenceRegions, zoomLevel, zoomCenter]);

  // Update current time and notify parent
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      const time = audio.currentTime;
      setCurrentTime(time);
      if (onTimeUpdate) {
        onTimeUpdate(time);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if (onPlay) onPlay();
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (onPause) onPause();
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && audio.duration > 0) {
        setActualDuration(audio.duration);
        console.log(`Audio metadata loaded, duration: ${audio.duration}s`);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handlePause);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handlePause);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [audioUrl, onTimeUpdate, onPlay, onPause]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Don't seek if we're dragging a handle
    if (draggingHandle !== null) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const duration = actualDuration > 0 ? actualDuration : (videoDuration > 0 ? videoDuration : 0);
    if (duration === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    // Calculate time based on zoom viewport
    const viewportWidth = duration / zoomLevel;
    const viewportStart = Math.max(0, Math.min(duration - viewportWidth, (duration - viewportWidth) * zoomCenter));
    const time = viewportStart + (x / canvas.width) * viewportWidth;

    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, time));
      if (!isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
        });
      }
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const duration = actualDuration > 0 ? actualDuration : (videoDuration > 0 ? videoDuration : 0);
    if (duration === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    // Calculate zoom viewport
    const viewportWidth = duration / zoomLevel;
    const viewportStart = Math.max(0, Math.min(duration - viewportWidth, (duration - viewportWidth) * zoomCenter));

    // Check if clicking on a segment boundary handle
    segments.forEach((segment, index) => {
      const startX = ((segment.startTime - viewportStart) / viewportWidth) * canvas.width;
      const endX = ((segment.endTime - viewportStart) / viewportWidth) * canvas.width;
      
      // Check start handle (wider click area)
      if (Math.abs(x - startX) < 8) {
        setDraggingHandle({ segmentIndex: index, isStart: true });
        setDraggingSegment(index);
        setDragOffset(-1);
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      
      // Check end handle
      if (Math.abs(x - endX) < 8) {
        setDraggingHandle({ segmentIndex: index, isStart: false });
        setDraggingSegment(index);
        setDragOffset(1);
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingSegment === null || draggingHandle === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const duration = actualDuration > 0 ? actualDuration : (videoDuration > 0 ? videoDuration : 0);
    if (duration === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    // Calculate time based on zoom viewport
    const viewportWidth = duration / zoomLevel;
    const viewportStart = Math.max(0, Math.min(duration - viewportWidth, (duration - viewportWidth) * zoomCenter));
    const time = Math.max(0, Math.min(duration, viewportStart + (x / canvas.width) * viewportWidth));

    const newSegments = [...segments];
    const segment = newSegments[draggingSegment];
    
    if (draggingHandle.isStart) {
      // Dragging start handle
      const minTime = draggingSegment > 0 ? newSegments[draggingSegment - 1].endTime : 0;
      const maxTime = segment.endTime - 0.1;
      segment.startTime = Math.max(minTime, Math.min(time, maxTime));
    } else {
      // Dragging end handle
      const minTime = segment.startTime + 0.1;
      const maxTime = draggingSegment < segments.length - 1 ? newSegments[draggingSegment + 1].startTime : duration;
      segment.endTime = Math.max(minTime, Math.min(time, maxTime));
    }

    newSegments[draggingSegment] = segment;

    if (onSegmentUpdate) {
      onSegmentUpdate(newSegments);
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggingSegment(null);
    setDragOffset(0);
    setDraggingHandle(null);
  };

  const handleDetectSilence = async () => {
    if (!onDetectSilence) return;
    
    setIsDetectingSilence(true);
    try {
      const newSegments = await onDetectSilence();
      if (onSegmentUpdate) {
        onSegmentUpdate(newSegments);
      }
    } catch (error) {
      console.error('Error detecting silence:', error);
      alert('Failed to detect silence: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsDetectingSilence(false);
    }
  };

  return (
    <div className="w-full bg-gray-900 dark:bg-gray-950 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              if (audioRef.current) {
                try {
                  if (isPlaying) {
                    audioRef.current.pause();
                  } else {
                    await audioRef.current.play();
                    setIsPlaying(true);
                  }
                } catch (error) {
                  console.error('Error playing audio:', error);
                  // Try loading the audio first
                  audioRef.current.load();
                  try {
                    await audioRef.current.play();
                    setIsPlaying(true);
                  } catch (retryError) {
                    console.error('Retry failed:', retryError);
                    alert('Failed to play audio. Please check if the audio file is accessible.');
                  }
                }
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <span className="text-sm text-gray-300 font-mono">
            {formatTime(currentTime)} / {(actualDuration > 0 ? actualDuration : videoDuration) > 0 ? formatTime(actualDuration > 0 ? actualDuration : videoDuration) : '--:--'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2 px-2 py-1 bg-gray-800 rounded border border-gray-700">
            <button
              onClick={() => {
                if (zoomLevel > 1) {
                  setZoomLevel(prev => Math.max(1, prev / 2));
                  // Keep zoom centered on current play position
                  const duration = actualDuration > 0 ? actualDuration : (videoDuration > 0 ? videoDuration : 0);
                  if (duration > 0) {
                    setZoomCenter(currentTime / duration);
                  }
                }
              }}
              disabled={zoomLevel <= 1}
              className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom Out"
            >
              ➖
            </button>
            <span className="text-xs text-gray-300 min-w-[40px] text-center">
              {zoomLevel.toFixed(1)}x
            </span>
            <button
              onClick={() => {
                if (zoomLevel < 16) {
                  setZoomLevel(prev => Math.min(16, prev * 2));
                  // Keep zoom centered on current play position
                  const duration = actualDuration > 0 ? actualDuration : (videoDuration > 0 ? videoDuration : 0);
                  if (duration > 0) {
                    setZoomCenter(currentTime / duration);
                  }
                }
              }}
              disabled={zoomLevel >= 16}
              className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom In"
            >
              ➕
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setZoomCenter(0.5);
              }}
              className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs"
              title="Reset Zoom"
            >
              ⟲
            </button>
          </div>
          {onDetectSilence && (
            <button
              onClick={handleDetectSilence}
              disabled={isDetectingSilence || isLoadingWaveform}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDetectingSilence ? '⏳ Detecting...' : '🔍 Detect Silence'}
            </button>
          )}
        </div>
      </div>
      
      <div className="relative w-full bg-gray-800 rounded border-2 border-gray-700 overflow-hidden" style={{ height: '150px' }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-pointer"
          onClick={handleCanvasClick}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          style={{ display: 'block', cursor: draggingHandle ? 'ew-resize' : 'pointer' }}
        />
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          preload="auto" 
          crossOrigin="anonymous" 
          style={{ display: 'none' }}
          key={audioUrlKey} // Force re-render when key changes
          onError={(e) => {
            console.error('Audio loading error:', e);
            console.error('Audio URL:', audioUrl);
            console.error('Audio element state:', audioRef.current?.readyState);
            console.error('Audio element error:', audioRef.current?.error);
            setIsLoadingWaveform(false);
            // Don't show alert - just log and show message in UI
            console.warn(`Audio failed to load. URL: ${audioUrl}`);
          }}
          onLoadedData={() => {
            console.log('Audio loaded successfully');
            console.log('Audio duration:', audioRef.current?.duration);
            setIsLoadingWaveform(false);
          }}
          onCanPlay={() => {
            console.log('Audio can play');
            setIsLoadingWaveform(false);
          }}
          onLoadedMetadata={() => {
            console.log('Audio metadata loaded');
            console.log('Audio duration:', audioRef.current?.duration);
          }}
        />
        
        {isLoadingWaveform && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
            <div className="text-gray-400 text-sm">
              Loading waveform... 
              <br />
              <span className="text-xs text-gray-500 mt-1 block">
                {audioUrl ? `From: ${audioUrl.split('/').pop()}` : 'No audio URL'}
              </span>
            </div>
          </div>
        )}
        {!isLoadingWaveform && waveformData.length === 0 && audioUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
            <div className="text-gray-400 text-sm text-center px-4">
              <div className="mb-2">⚠️ Waveform not loading</div>
              <div className="text-xs text-gray-500 mb-2">
                Audio URL: {audioUrl.split('/').pop()}
              </div>
              <div className="text-xs text-gray-500">
                Check browser console for errors. The audio file may need to be reloaded.
              </div>
              <button
                onClick={() => {
                  console.log('Retry loading audio:', audioUrl);
                  // Force audio element to reload by changing key
                  setAudioUrlKey(prev => prev + 1);
                  setIsLoadingWaveform(true);
                  // Reset waveform data to trigger re-initialization
                  setWaveformData([]);
                  
                  // Also try to reload the audio element directly
                  setTimeout(() => {
                    if (audioRef.current) {
                      audioRef.current.load();
                    }
                  }, 100);
                }}
                className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Retry Loading
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500"></div>
          <span>Audio</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500/30"></div>
          <span>Silence regions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500/20"></div>
          <span>Segments</span>
        </div>
        <span className="ml-auto">Click to seek • Drag handles to adjust boundaries</span>
      </div>
    </div>
  );
}
