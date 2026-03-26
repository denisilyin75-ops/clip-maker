"use client";

import { useRef } from "react";
import { useProjectStore } from "@/stores/projectStore";
import { uploadAudio } from "@/lib/api";

export default function Header() {
  const setAudio = useProjectStore((s) => s.setAudio);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleImportAudio = () => {
    audioInputRef.current?.click();
  };

  const handleAudioFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadAudio(file);
      setAudio({
        filename: result.filename,
        originalName: result.originalName,
        duration: result.duration,
        waveformData: result.waveformData,
      });
    } catch (err) {
      console.error("Audio upload failed:", err);
      alert(`Upload failed: ${err instanceof Error ? err.message : err}`);
    }

    // Reset input so same file can be re-selected
    e.target.value = "";
  };

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
        <input
          ref={audioInputRef}
          type="file"
          accept=".mp3,.wav,.ogg,.flac,.m4a"
          className="hidden"
          onChange={handleAudioFileChange}
        />
        <button
          onClick={handleImportAudio}
          className="px-3 py-1.5 text-xs font-medium text-text-secondary border border-border rounded hover:bg-bg-card hover:border-border-hover transition-colors"
        >
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
