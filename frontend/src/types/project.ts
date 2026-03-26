export type SectionType = "intro" | "verse" | "chorus" | "bridge" | "outro" | "instrumental";
export type SceneSource = "hedra" | "kling" | "deevid" | "runway" | "pika" | "image" | "other";
export type SceneType = "lip-sync" | "cinematic" | "static" | "lyric-video";
export type TransitionType = "cut" | "crossfade" | "fade-black" | "fade-white";
export type LyricsAnimation = "fade" | "typewriter" | "karaoke";
export type LyricsPosition = "bottom-center" | "bottom-left" | "center" | "top-center";

export interface Section {
  id: string;
  type: SectionType;
  label: string;
  startTime: number;
  endTime: number;
  text: string;
}

export interface Transition {
  type: TransitionType;
  duration: number;
}

export interface Scene {
  id: string;
  filename: string;
  originalName: string;
  source: SceneSource;
  sceneType: SceneType;
  startTime: number;
  endTime: number;
  sectionId: string | null;
  transitionIn: Transition;
  transitionOut: Transition;
  prompt: string;
  thumbnailUrl: string;
}

export interface LyricsOverlay {
  enabled: boolean;
  fontFamily: string;
  fontSize: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  position: LyricsPosition;
  animation: LyricsAnimation;
  backgroundOpacity: number;
}

export interface ExportSettings {
  width: number;
  height: number;
  fps: number;
  videoBitrate: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  audio: {
    filename: string;
    originalName: string;
    duration: number;
    waveformData: number[];
  } | null;
  sections: Section[];
  scenes: Scene[];
  lyricsOverlay: LyricsOverlay;
  exportSettings: ExportSettings;
}
