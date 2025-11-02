"use client";

import VideosPanelImproved from './VideosPanelImproved';

interface VideosPanelProps {
  onSelectClip?: (clip: { query: string; startTime: number; endTime: number }) => void;
}

export default function VideosPanel({ onSelectClip }: VideosPanelProps) {
  // Use the improved component with side-by-side layout
  return <VideosPanelImproved onSelectClip={onSelectClip} />;
}
