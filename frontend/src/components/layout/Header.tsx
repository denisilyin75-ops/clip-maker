"use client";

import { useRef } from "react";
import { Upload, Film, Save, Download } from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";
import { uploadAudio } from "@/lib/api";

export default function Header() {
  const project = useProjectStore((s) => s.project);
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

    e.target.value = "";
  };

  const handleNameChange = (e: React.FocusEvent<HTMLSpanElement>) => {
    const newName = e.currentTarget.textContent?.trim();
    if (newName && newName !== project.name) {
      useProjectStore.setState((state) => ({
        project: { ...state.project, name: newName, updatedAt: new Date().toISOString() },
        isDirty: true,
      }));
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <header className="h-12 flex items-center justify-between px-4 bg-bg-panel border-b border-border shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded bg-accent flex items-center justify-center text-white text-xs font-bold">
          C
        </div>
        <span
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onBlur={handleNameChange}
          onKeyDown={handleNameKeyDown}
          className="text-[16px] font-medium text-text-primary outline-none border-b border-transparent hover:border-border-hover focus:border-accent transition-colors cursor-text px-0.5"
        >
          {project.name}
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
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary border border-border rounded hover:bg-bg-card hover:border-border-hover transition-colors"
        >
          <Upload size={14} />
          Import Audio
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary border border-border rounded hover:bg-bg-card hover:border-border-hover transition-colors">
          <Film size={14} />
          Import Video
        </button>
        <div className="w-px h-5 bg-border mx-1" />
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary border border-border rounded hover:bg-bg-card hover:border-border-hover transition-colors">
          <Save size={14} />
          Save
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-accent rounded hover:bg-accent-hover transition-colors">
          <Download size={14} />
          Export MP4
        </button>
      </div>
    </header>
  );
}
