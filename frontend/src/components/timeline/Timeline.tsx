"use client";

export default function Timeline() {
  return (
    <div className="h-[180px] shrink-0 bg-bg-panel border-t border-border flex flex-col overflow-hidden">
      {/* Time ruler */}
      <div className="h-6 flex items-end px-2 border-b border-border shrink-0">
        <div className="flex items-end gap-[100px]">
          {["0:00", "0:10", "0:20", "0:30", "0:40", "0:50", "1:00"].map(
            (t) => (
              <span
                key={t}
                className="text-[10px] font-mono text-text-tertiary"
              >
                {t}
              </span>
            )
          )}
        </div>
      </div>
      {/* Tracks */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        {/* Audio track */}
        <div className="h-9 flex items-center px-2 border-b border-border">
          <span className="text-[10px] font-mono text-text-tertiary w-14 shrink-0">
            Audio
          </span>
          <div className="flex-1 h-6 bg-bg-card rounded border border-border flex items-center justify-center">
            <span className="text-[10px] text-text-tertiary">
              No audio loaded
            </span>
          </div>
        </div>
        {/* Video track */}
        <div className="h-9 flex items-center px-2 border-b border-border">
          <span className="text-[10px] font-mono text-text-tertiary w-14 shrink-0">
            Video
          </span>
          <div className="flex-1 h-6 bg-bg-card rounded border border-border flex items-center justify-center">
            <span className="text-[10px] text-text-tertiary">
              No scenes
            </span>
          </div>
        </div>
        {/* Lyrics track */}
        <div className="h-9 flex items-center px-2 border-b border-border">
          <span className="text-[10px] font-mono text-text-tertiary w-14 shrink-0">
            Lyrics
          </span>
          <div className="flex-1 h-6 bg-bg-card rounded border border-border flex items-center justify-center">
            <span className="text-[10px] text-text-tertiary">
              No sections
            </span>
          </div>
        </div>
        {/* Effects track */}
        <div className="h-9 flex items-center px-2">
          <span className="text-[10px] font-mono text-text-tertiary w-14 shrink-0">
            FX
          </span>
          <div className="flex-1 h-4 bg-bg-card rounded border border-border" />
        </div>
      </div>
    </div>
  );
}
