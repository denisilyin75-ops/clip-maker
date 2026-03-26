"use client";

export default function Header() {
  return (
    <header className="h-12 flex items-center justify-between px-4 bg-bg-panel border-b border-border shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded bg-accent flex items-center justify-center text-white text-xs font-bold">
          C
        </div>
        <span className="text-[16px] font-medium text-text-primary">
          Untitled Project
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 text-xs font-medium text-text-secondary border border-border rounded hover:bg-bg-card hover:border-border-hover transition-colors">
          Import Audio
        </button>
        <button className="px-3 py-1.5 text-xs font-medium text-text-secondary border border-border rounded hover:bg-bg-card hover:border-border-hover transition-colors">
          Import Video
        </button>
        <div className="w-px h-5 bg-border mx-1" />
        <button className="px-3 py-1.5 text-xs font-medium text-text-secondary border border-border rounded hover:bg-bg-card hover:border-border-hover transition-colors">
          Save
        </button>
        <button className="px-3 py-1.5 text-xs font-medium text-white bg-accent rounded hover:bg-accent-hover transition-colors">
          Export MP4
        </button>
      </div>
    </header>
  );
}
