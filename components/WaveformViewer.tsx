'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface WaveformViewerProps {
  audioUrl: string;
  segments: Array<{ startTime: number; endTime: number; text?: string }>;
  onSegmentUpdate?: (segments: Array<{ startTime: number; endTime: number }>) => void;
  videoDuration?: number;
  onDetectSilence?: () => Promise<Array<{ startTime: number; endTime: number }>>;
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

        // Generate waveform data
        audio.addEventListener('loadeddata', () => {
          if (analyser) {
            generateWaveform();
          }
        });

        // Generate waveform periodically during playback
        const generateWaveform = () => {
          if (!analyser) return;
          
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyser.getByteFrequencyData(dataArray);
          
          // Sample waveform data
          const samples = 400; // More samples for better visualization
          const sampleSize = Math.floor(bufferLength / samples);
          const waveform: number[] = [];
          
          for (let i = 0; i < samples; i++) {
            let sum = 0;
            for (let j = 0; j < sampleSize; j++) {
              sum += dataArray[i * sampleSize + j];
            }
            waveform.push(sum / sampleSize / 255);
          }
          
          setWaveformData(waveform);
        };

        // Animate waveform during playback
        const animate = () => {
          if (isPlaying && analyser) {
            generateWaveform();
            animationFrameRef.current = requestAnimationFrame(animate);
          }
        };

        if (isPlaying) {
          animate();
        } else {
          generateWaveform();
        }
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
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={120}
          className="w-full h-24 cursor-pointer border border-gray-700 rounded"
          onClick={handleCanvasClick}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        />
        <audio ref={audioRef} src={audioUrl} preload="metadata" crossOrigin="anonymous" style={{ display: 'none' }} />
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Click to seek. Drag segment boundaries to adjust. Dark areas show potential pauses. Use "Detect Silence" to find natural sentence endings.
      </div>
    </div>
  );
}
