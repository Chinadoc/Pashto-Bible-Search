'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface WaveformViewerProps {
  audioUrl: string;
  segments: Array<{ startTime: number; endTime: number; text?: string }>;
  onSegmentUpdate?: (segments: Array<{ startTime: number; endTime: number }>) => void;
  videoDuration?: number;
  onDetectSilence?: () => Promise<Array<{ startTime: number; endTime: number }>>;
  silenceRegions?: Array<{ start: number; end: number }>; // Detected silence regions
}

export default function WaveformViewer({ 
  audioUrl, 
  segments, 
  onSegmentUpdate,
  videoDuration = 0,
  onDetectSilence,
  silenceRegions = []
}: WaveformViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [draggingSegment, setDraggingSegment] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [draggingHandle, setDraggingHandle] = useState<{segmentIndex: number; isStart: boolean} | null>(null);
  const [isDetectingSilence, setIsDetectingSilence] = useState(false);
  const [isLoadingWaveform, setIsLoadingWaveform] = useState(true);

  // Load audio and generate waveform
  useEffect(() => {
    if (!audioUrl || !audioRef.current) return;

    const audio = audioRef.current;
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let source: MediaElementAudioSourceNode;

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

        // Generate initial waveform data
        const generateWaveform = () => {
          if (!analyser) return;
          
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          // Use time domain data for waveform (amplitude over time)
          analyser.getByteTimeDomainData(dataArray);
          
          // Sample waveform data - more samples for better visualization
          const samples = 800; // Higher resolution
          const sampleSize = Math.floor(bufferLength / samples);
          const waveform: number[] = [];
          
          for (let i = 0; i < samples; i++) {
            let max = 0;
            for (let j = 0; j < sampleSize; j++) {
              const value = Math.abs(dataArray[i * sampleSize + j] - 128) / 128; // Normalize to 0-1
              max = Math.max(max, value);
            }
            waveform.push(max);
          }
          
          setWaveformData(waveform);
          setIsLoadingWaveform(false);
        };

        // Generate waveform when audio loads
        audio.addEventListener('loadeddata', () => {
          setTimeout(() => {
            generateWaveform();
          }, 200);
        });

        // Generate waveform when metadata loads
        audio.addEventListener('loadedmetadata', () => {
          setTimeout(() => {
            generateWaveform();
          }, 200);
        });

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
      if (audioContext) audioContext.close();
    };
  }, [audioUrl, isPlaying]);

  // Draw waveform with silence regions and segments
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

    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, width, height);
    
    // Draw silence regions first (background layer)
    if (videoDuration > 0 && silenceRegions.length > 0) {
      silenceRegions.forEach((silence) => {
        const startX = (silence.start / videoDuration) * width;
        const endX = (silence.end / videoDuration) * width;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)'; // Red tint for silence
        ctx.fillRect(startX, 0, endX - startX, height);
        
        // Draw silence label
        ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.font = '10px sans-serif';
        ctx.fillText('SILENCE', startX + 2, 12);
      });
    }
    
    // Draw waveform bars if we have data
    if (waveformData.length > 0) {
      const barWidth = width / waveformData.length;
      
      waveformData.forEach((value, index) => {
        const barHeight = Math.max(2, value * height * 0.7);
        const x = index * barWidth;
        const y = centerY - barHeight / 2;
        
        // Color based on amplitude
        const isLow = value < 0.1;
        ctx.fillStyle = isLow ? '#374151' : '#6366f1'; // Darker for quiet, brighter blue for sound
        ctx.fillRect(x, y, Math.max(1, barWidth - 0.5), barHeight);
      });
    } else {
      // Show placeholder if no waveform data
      ctx.fillStyle = '#374151';
      ctx.fillRect(0, centerY - 1, width, 2);
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Loading waveform...', width / 2, centerY);
      ctx.textAlign = 'left';
    }

    // Draw segment boundaries with draggable handles
    if (videoDuration > 0) {
      segments.forEach((segment, index) => {
        const startX = (segment.startTime / videoDuration) * width;
        const endX = (segment.endTime / videoDuration) * width;
        
        // Highlight segment area
        ctx.fillStyle = 'rgba(79, 70, 229, 0.2)';
        ctx.fillRect(startX, 0, endX - startX, height);
        
        // Draw start boundary handle
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(startX - 2, 0, 4, height);
        // Draggable handle indicator
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(startX - 1, 0, 2, height);
        
        // Draw end boundary handle
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(endX - 2, 0, 4, height);
        // Draggable handle indicator
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(endX - 1, 0, 2, height);
        
        // Segment number label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`${index + 1}`, startX + 5, 18);
        
        // Time labels
        ctx.fillStyle = '#9ca3af';
        ctx.font = '9px sans-serif';
        const startTimeLabel = formatTime(segment.startTime);
        const endTimeLabel = formatTime(segment.endTime);
        ctx.fillText(startTimeLabel, startX + 5, height - 5);
        ctx.fillText(endTimeLabel, endX - 30, height - 5);
      });
    }

    // Draw progress indicator
    if (videoDuration > 0) {
      const progressX = (currentTime / videoDuration) * width;
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
  }, [waveformData, currentTime, segments, videoDuration, silenceRegions]);

  // Update current time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('play', () => setIsPlaying(true));
      audio.removeEventListener('pause', () => setIsPlaying(false));
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [audioUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || videoDuration === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / canvas.width) * videoDuration;

    if (audioRef.current) {
      audioRef.current.currentTime = time;
      if (!isPlaying) {
        audioRef.current.play();
      }
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || videoDuration === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / canvas.width) * videoDuration;

    // Check if clicking on a segment boundary handle
    segments.forEach((segment, index) => {
      const startX = (segment.startTime / videoDuration) * canvas.width;
      const endX = (segment.endTime / videoDuration) * canvas.width;
      
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
    if (!canvas || videoDuration === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = Math.max(0, Math.min(videoDuration, (x / canvas.width) * videoDuration));

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
      const maxTime = draggingSegment < segments.length - 1 ? newSegments[draggingSegment + 1].startTime : videoDuration;
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
            onClick={() => {
              if (audioRef.current) {
                if (isPlaying) {
                  audioRef.current.pause();
                } else {
                  audioRef.current.play();
                }
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <span className="text-sm text-gray-300 font-mono">
            {formatTime(currentTime)} / {videoDuration > 0 ? formatTime(videoDuration) : '--:--'}
          </span>
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
        <audio ref={audioRef} src={audioUrl} preload="metadata" crossOrigin="anonymous" style={{ display: 'none' }} />
        
        {isLoadingWaveform && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
            <div className="text-gray-400 text-sm">Loading waveform...</div>
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

export default function WaveformViewer({ 
  audioUrl, 
  segments, 
  onSegmentUpdate,
  videoDuration = 0,
  onDetectSilence
}: WaveformViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [draggingSegment, setDraggingSegment] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDetectingSilence, setIsDetectingSilence] = useState(false);

  // Load and analyze audio
  useEffect(() => {
    if (!audioUrl || !audioRef.current) return;

    const audio = audioRef.current;
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let source: MediaElementAudioSourceNode;

    const initAudio = async () => {
      try {
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

        // Generate waveform data once audio is loaded
        const generateWaveform = () => {
          if (!analyser) return;
          
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          // Use time domain data for waveform (amplitude over time)
          analyser.getByteTimeDomainData(dataArray);
          
          // Sample waveform data
          const samples = 400; // More samples for better visualization
          const sampleSize = Math.floor(bufferLength / samples);
          const waveform: number[] = [];
          
          for (let i = 0; i < samples; i++) {
            let max = 0;
            for (let j = 0; j < sampleSize; j++) {
              const value = Math.abs(dataArray[i * sampleSize + j] - 128) / 128; // Normalize to 0-1
              max = Math.max(max, value);
            }
            waveform.push(max);
          }
          
          setWaveformData(waveform);
        };

        // Generate waveform when audio loads
        audio.addEventListener('loadeddata', () => {
          setTimeout(() => {
            if (analyser) {
              generateWaveform();
            }
          }, 100);
        });

        // Animate waveform during playback
        const animate = () => {
          if (isPlaying && analyser) {
            generateWaveform();
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
      }
    };

    initAudio();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (source) source.disconnect();
      if (analyser) analyser.disconnect();
      if (audioContext) audioContext.close();
    };
  }, [audioUrl, isPlaying]);

  // Draw waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || waveformData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / waveformData.length;

    ctx.clearRect(0, 0, width, height);
    
    // Draw waveform bars
    waveformData.forEach((value, index) => {
      const barHeight = value * height * 0.8;
      const x = index * barWidth;
      const y = (height - barHeight) / 2;
      
      // Color based on amplitude (darker = quieter = potential pause)
      const isLow = value < 0.1;
      ctx.fillStyle = isLow ? '#1f2937' : '#4f46e5';
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    });

    // Draw progress indicator
    if (videoDuration > 0) {
      const progressX = (currentTime / videoDuration) * width;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(progressX, 0);
      ctx.lineTo(progressX, height);
      ctx.stroke();
    }

    // Draw segment boundaries
    segments.forEach((segment, index) => {
      const startX = (segment.startTime / videoDuration) * width;
      const endX = (segment.endTime / videoDuration) * width;
      
      // Start boundary
      ctx.fillStyle = 'rgba(79, 70, 229, 0.7)';
      ctx.fillRect(startX, 0, 3, height);
      
      // End boundary
      ctx.fillRect(endX - 3, 0, 3, height);
      
      // Highlight segment area
      ctx.fillStyle = 'rgba(79, 70, 229, 0.15)';
      ctx.fillRect(startX, 0, endX - startX, height);
      
      // Segment number label
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px sans-serif';
      ctx.fillText(`${index + 1}`, startX + 5, 15);
    });
  }, [waveformData, currentTime, segments, videoDuration]);

  // Update current time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('play', () => setIsPlaying(true));
      audio.removeEventListener('pause', () => setIsPlaying(false));
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [audioUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || videoDuration === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / canvas.width) * videoDuration;

    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || videoDuration === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / canvas.width) * videoDuration;

    // Check if clicking on a segment boundary
    segments.forEach((segment, index) => {
      const startX = (segment.startTime / videoDuration) * canvas.width;
      const endX = (segment.endTime / videoDuration) * canvas.width;
      
      if (Math.abs(x - startX) < 10) {
        setDraggingSegment(index);
        setDragOffset(-1); // Start boundary
        e.preventDefault();
      } else if (Math.abs(x - endX) < 10) {
        setDraggingSegment(index);
        setDragOffset(1); // End boundary
        e.preventDefault();
      }
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingSegment === null) return;

    const canvas = canvasRef.current;
    if (!canvas || videoDuration === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / canvas.width) * videoDuration;

    const newSegments = [...segments];
    if (dragOffset === -1) {
      // Dragging start
      newSegments[draggingSegment].startTime = Math.max(0, Math.min(time, newSegments[draggingSegment].endTime - 0.1));
    } else {
      // Dragging end
      newSegments[draggingSegment].endTime = Math.min(videoDuration, Math.max(time, newSegments[draggingSegment].startTime + 0.1));
    }

    if (onSegmentUpdate) {
      onSegmentUpdate(newSegments);
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggingSegment(null);
    setDragOffset(0);
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
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (audioRef.current) {
                if (isPlaying) {
                  audioRef.current.pause();
                } else {
                  audioRef.current.play();
                }
              }
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <span className="text-sm text-gray-400">
            {formatTime(currentTime)} / {videoDuration > 0 ? formatTime(videoDuration) : '--:--'}
          </span>
        </div>
        {onDetectSilence && (
          <button
            onClick={handleDetectSilence}
            disabled={isDetectingSilence}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:opacity-50"
          >
            {isDetectingSilence ? '⏳ Detecting...' : '🔍 Detect Silence'}
          </button>
        )}
      </div>
      <div className="relative w-full">
        <div className="w-full h-24 bg-gray-800 rounded border border-gray-700 overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-pointer"
            onClick={handleCanvasClick}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            style={{ display: 'block' }}
          />
        </div>
        <audio ref={audioRef} src={audioUrl} preload="metadata" crossOrigin="anonymous" style={{ display: 'none' }} />
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Click to seek. Drag segment boundaries to adjust. Dark areas show potential pauses. Use "Detect Silence" to find natural sentence endings.
      </div>
    </div>
  );
}
