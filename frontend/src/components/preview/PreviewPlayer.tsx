"use client";

export default function PreviewPlayer() {
  return (
    <div className="flex-1 flex flex-col bg-bg-app overflow-hidden">
      {/* Video area */}
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="text-text-tertiary text-sm">
          No video — import scenes to preview
        </div>
      </div>
      {/* Controls */}
      <div className="h-10 flex items-center gap-3 px-4 bg-bg-panel border-t border-border shrink-0">
        <button className="text-text-secondary hover:text-text-primary transition-colors text-sm">
          ▶
        </button>
        <span className="text-[11px] font-mono text-text-secondary">
          0:00 / 0:00
        </span>
      </div>
    </div>
  );
}
