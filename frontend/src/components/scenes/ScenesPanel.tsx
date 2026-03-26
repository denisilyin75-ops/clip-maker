"use client";

import { Film } from "lucide-react";

export default function ScenesPanel() {
  return (
    <div className="w-[260px] shrink-0 bg-bg-panel border-l border-border flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-secondary">
          Scenes
        </h2>
        <span className="text-[11px] text-text-tertiary">0 scenes</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex flex-col items-center justify-center h-full text-center gap-3">
          <Film size={32} className="text-text-tertiary" />
          <div>
            <p className="text-xs text-text-tertiary">No scenes yet.</p>
            <p className="text-xs text-text-tertiary mt-1">Import video clips.</p>
          </div>
        </div>
      </div>
      <div className="p-2 border-t border-border">
        <button className="w-full py-2 text-xs text-text-tertiary border border-dashed border-border rounded hover:border-border-hover hover:text-text-secondary transition-colors">
          + Add scene
        </button>
      </div>
    </div>
  );
}
