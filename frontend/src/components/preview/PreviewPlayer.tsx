"use client";

import { useEffect, useRef, useCallback } from "react";
import { Play, Pause } from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";
import { formatTime } from "@/lib/timeUtils";

export default function PreviewPlayer() {
  const audio = useProjectStore((s) => s.project.audio);
  const currentTime = useProjectStore((s) => s.currentTime);
  const isPlaying = useProjectStore((s) => s.isPlaying);
  const setCurrentTime = useProjectStore((s) => s.setCurrentTime);
  const togglePlayback = useProjectStore((s) => s.togglePlayback);

  const audioRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef<number>(0);

  const duration = audio?.duration ?? 0;

  // Sync audio element with store play state
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    if (isPlaying) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [isPlaying]);

  // Seek audio when currentTime changes from external source (timeline click)
  const seekAudio = useCallback((time: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = time;
  }, []);

  // Expose seekAudio globally for timeline to call
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__clipmaker_seekAudio = seekAudio;
    return () => {
      delete (window as unknown as Record<string, unknown>).__clipmaker_seekAudio;
    };
  }, [seekAudio]);

  // RAF loop: update currentTime from audio element while playing
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const tick = () => {
      if (!el.paused) {
        setCurrentTime(el.currentTime);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    if (isPlaying) {
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, setCurrentTime]);

  // Stop playback at end
  const handleEnded = () => {
    if (isPlaying) togglePlayback();
    setCurrentTime(0);
  };

  const audioSrc = audio
    ? `http://localhost:8000/api/files/uploads/${audio.filename}`
    : undefined;

  return (
    <div className="flex-1 flex flex-col bg-bg-app overflow-hidden">
      {/* Video area — 16:9 black preview */}
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="w-full max-w-full" style={{ aspectRatio: "16/9", maxHeight: "100%" }}>
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-text-tertiary text-sm">
              {audio ? "No video — import scenes to preview" : "Import audio to preview"}
            </span>
          </div>
        </div>
      </div>

      {/* Hidden audio element */}
      {audioSrc && (
        <audio ref={audioRef} src={audioSrc} preload="auto" onEnded={handleEnded} />
      )}

      {/* Controls */}
      <div className="h-10 flex items-center gap-3 px-4 bg-bg-panel border-t border-border shrink-0">
        <button
          onClick={() => {
            if (!audio) return;
            togglePlayback();
          }}
          className={`transition-colors ${
            audio
              ? "text-text-secondary hover:text-text-primary cursor-pointer"
              : "text-text-tertiary cursor-not-allowed"
          }`}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <span className="text-[11px] font-mono text-text-secondary">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        {audio && (
          <span className="text-[10px] text-text-tertiary ml-auto truncate max-w-[200px]">
            {audio.originalName}
          </span>
        )}
      </div>
    </div>
  );
}
