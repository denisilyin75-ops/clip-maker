"use client";

export default function LyricsPanel() {
  return (
    <div className="w-[240px] shrink-0 bg-bg-panel border-r border-border flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-secondary">
          Lyrics
        </h2>
        <button className="text-[10px] font-medium text-accent hover:text-accent-hover transition-colors">
          Auto-detect
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex items-center justify-center h-32 text-text-tertiary text-xs">
          Import audio to detect lyrics
        </div>
      </div>
      <div className="p-2 border-t border-border">
        <button className="w-full py-2 text-xs text-text-tertiary border border-dashed border-border rounded hover:border-border-hover hover:text-text-secondary transition-colors">
          + Add section
        </button>
      </div>
    </div>
  );
}
