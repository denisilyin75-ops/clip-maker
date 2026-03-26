"use client";

import { useRef, useCallback, useEffect } from "react";
import { useProjectStore } from "@/stores/projectStore";
import { formatRulerTime } from "@/lib/timeUtils";

const TRACK_LABEL_WIDTH = 56; // px

export default function Timeline() {
  const audio = useProjectStore((s) => s.project.audio);
  const currentTime = useProjectStore((s) => s.currentTime);
  const isPlaying = useProjectStore((s) => s.isPlaying);
  const setCurrentTime = useProjectStore((s) => s.setCurrentTime);
  const zoom = useProjectStore((s) => s.timelineZoom);
  const setTimelineZoom = useProjectStore((s) => s.setTimelineZoom);

  const duration = audio?.duration ?? 60;
  const pxPerSecond = zoom;
  const totalWidth = Math.max(duration * pxPerSecond, 600);
  const playheadX = currentTime * pxPerSecond;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null);

  // Generate ruler marks
  const rulerStep = pxPerSecond >= 20 ? 5 : pxPerSecond >= 10 ? 10 : 30;
  const rulerMarks: { time: number; x: number }[] = [];
  for (let t = 0; t <= duration; t += rulerStep) {
    rulerMarks.push({ time: t, x: t * pxPerSecond });
  }

  // Seek on click / drag
  const seekFromMouseEvent = useCallback(
    (clientX: number) => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const scrollLeft = container.scrollLeft;
      const x = clientX - rect.left + scrollLeft - TRACK_LABEL_WIDTH;
      const time = Math.max(0, Math.min(x / pxPerSecond, duration));
      setCurrentTime(time);

      // Seek the audio element
      const seekFn = (window as unknown as Record<string, (t: number) => void>)
        .__clipmaker_seekAudio;
      if (seekFn) seekFn(time);
    },
    [pxPerSecond, duration, setCurrentTime]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDraggingRef.current = true;
      seekFromMouseEvent(e.clientX);

      const handleMove = (ev: MouseEvent) => {
        if (isDraggingRef.current) seekFromMouseEvent(ev.clientX);
      };
      const handleUp = () => {
        isDraggingRef.current = false;
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [seekFromMouseEvent]
  );

  // Ctrl+Wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -2 : 2;
        setTimelineZoom(zoom + delta);
      }
    },
    [zoom, setTimelineZoom]
  );

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Auto-scroll to follow playhead during playback
  useEffect(() => {
    if (!isPlaying) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const viewLeft = container.scrollLeft;
    const viewRight = viewLeft + rect.width;
    const headX = playheadX + TRACK_LABEL_WIDTH;

    if (headX > viewRight - 40 || headX < viewLeft) {
      container.scrollLeft = Math.max(0, headX - rect.width / 3);
    }
  }, [playheadX, isPlaying]);

  // Draw waveform on canvas
  useEffect(() => {
    const canvas = waveformCanvasRef.current;
    if (!canvas || !audio?.waveformData) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = totalWidth;
    const h = 24;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#3b82f680";

    const peaks = audio.waveformData;
    const barWidth = w / peaks.length;
    const midY = h / 2;

    for (let i = 0; i < peaks.length; i++) {
      const peak = peaks[i];
      const barH = peak * (h - 2);
      const x = i * barWidth;
      ctx.fillRect(x, midY - barH / 2, Math.max(barWidth - 0.5, 0.5), barH || 1);
    }
  }, [audio?.waveformData, totalWidth]);

  return (
    <div className="h-[180px] shrink-0 bg-bg-panel border-t border-border flex flex-col overflow-hidden">
      {/* Zoom controls */}
      <div className="h-6 flex items-center justify-between px-2 border-b border-border shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTimelineZoom(zoom - 2)}
            className="text-[10px] text-text-tertiary hover:text-text-secondary w-4 h-4 flex items-center justify-center"
          >
            -
          </button>
          <span className="text-[10px] font-mono text-text-tertiary w-10 text-center">
            {zoom}px/s
          </span>
          <button
            onClick={() => setTimelineZoom(zoom + 2)}
            className="text-[10px] text-text-tertiary hover:text-text-secondary w-4 h-4 flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>

      {/* Scrollable tracks area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto overflow-y-hidden relative"
        onMouseDown={handleMouseDown}
      >
        {/* Inner container with full width */}
        <div
          className="relative"
          style={{ width: totalWidth + TRACK_LABEL_WIDTH, minHeight: "100%" }}
        >
          {/* Time ruler */}
          <div className="h-6 border-b border-border relative" style={{ paddingLeft: TRACK_LABEL_WIDTH }}>
            {rulerMarks.map((mark) => (
              <div
                key={mark.time}
                className="absolute top-0 h-full flex flex-col justify-end"
                style={{ left: mark.x + TRACK_LABEL_WIDTH }}
              >
                <span className="text-[9px] font-mono text-text-tertiary -translate-x-1/2 mb-0.5">
                  {formatRulerTime(mark.time)}
                </span>
                <div className="w-px h-1.5 bg-border-hover mx-auto" />
              </div>
            ))}
          </div>

          {/* Audio track */}
          <div className="h-9 flex items-center border-b border-border">
            <span className="text-[10px] font-mono text-text-tertiary shrink-0 px-2" style={{ width: TRACK_LABEL_WIDTH }}>
              Audio
            </span>
            <div className="relative h-6" style={{ width: totalWidth }}>
              {audio?.waveformData ? (
                <canvas ref={waveformCanvasRef} className="rounded" />
              ) : (
                <div className="w-full h-full bg-bg-card rounded border border-border flex items-center justify-center">
                  <span className="text-[10px] text-text-tertiary">No audio loaded</span>
                </div>
              )}
            </div>
          </div>

          {/* Video track */}
          <div className="h-9 flex items-center border-b border-border">
            <span className="text-[10px] font-mono text-text-tertiary shrink-0 px-2" style={{ width: TRACK_LABEL_WIDTH }}>
              Video
            </span>
            <div className="h-6 bg-bg-card rounded border border-border flex items-center justify-center" style={{ width: totalWidth }}>
              <span className="text-[10px] text-text-tertiary">No scenes</span>
            </div>
          </div>

          {/* Lyrics track */}
          <div className="h-9 flex items-center border-b border-border">
            <span className="text-[10px] font-mono text-text-tertiary shrink-0 px-2" style={{ width: TRACK_LABEL_WIDTH }}>
              Lyrics
            </span>
            <div className="h-6 bg-bg-card rounded border border-border flex items-center justify-center" style={{ width: totalWidth }}>
              <span className="text-[10px] text-text-tertiary">No sections</span>
            </div>
          </div>

          {/* Effects track */}
          <div className="h-9 flex items-center">
            <span className="text-[10px] font-mono text-text-tertiary shrink-0 px-2" style={{ width: TRACK_LABEL_WIDTH }}>
              FX
            </span>
            <div className="h-4 bg-bg-card rounded border border-border" style={{ width: totalWidth }} />
          </div>

          {/* Playhead */}
          {audio && (
            <div
              className="absolute top-0 bottom-0 pointer-events-none z-10"
              style={{ left: playheadX + TRACK_LABEL_WIDTH }}
            >
              {/* Triangle marker */}
              <div
                className="absolute -top-0 -translate-x-1/2"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderTop: "6px solid var(--playhead)",
                }}
              />
              {/* Vertical line */}
              <div className="absolute top-1.5 bottom-0 w-px bg-playhead -translate-x-1/2" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
