import { create } from "zustand";
import type {
  Project,
  Section,
  Scene,
  LyricsOverlay,
  ExportSettings,
} from "@/types/project";

function createDefaultProject(): Project {
  return {
    id: crypto.randomUUID(),
    name: "Untitled Project",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    audio: null,
    sections: [],
    scenes: [],
    lyricsOverlay: {
      enabled: true,
      fontFamily: "Inter",
      fontSize: 32,
      color: "#ffffff",
      strokeColor: "#000000",
      strokeWidth: 2,
      position: "bottom-center",
      animation: "fade",
      backgroundOpacity: 0.5,
    },
    exportSettings: {
      width: 1920,
      height: 1080,
      fps: 30,
      videoBitrate: "8M",
    },
  };
}

interface ProjectStore {
  project: Project;
  currentTime: number;
  isPlaying: boolean;
  selectedSceneId: string | null;
  selectedSectionId: string | null;
  timelineZoom: number;
  isDirty: boolean;

  // Audio
  setAudio: (audio: Project["audio"]) => void;

  // Sections
  addSection: (section: Section) => void;
  updateSection: (id: string, partial: Partial<Section>) => void;
  removeSection: (id: string) => void;

  // Scenes
  addScene: (scene: Scene) => void;
  updateScene: (id: string, partial: Partial<Scene>) => void;
  removeScene: (id: string) => void;
  reorderScenes: (ids: string[]) => void;

  // Playback
  setCurrentTime: (time: number) => void;
  togglePlayback: () => void;

  // Selection
  selectScene: (id: string | null) => void;
  selectSection: (id: string | null) => void;

  // Timeline
  setTimelineZoom: (zoom: number) => void;

  // Lyrics & Export
  updateLyricsOverlay: (partial: Partial<LyricsOverlay>) => void;
  updateExportSettings: (partial: Partial<ExportSettings>) => void;

  // Project
  loadProject: (project: Project) => void;
  resetProject: () => void;
  markClean: () => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  project: createDefaultProject(),
  currentTime: 0,
  isPlaying: false,
  selectedSceneId: null,
  selectedSectionId: null,
  timelineZoom: 10,
  isDirty: false,

  setAudio: (audio) =>
    set((state) => ({
      project: { ...state.project, audio, updatedAt: new Date().toISOString() },
      isDirty: true,
    })),

  addSection: (section) =>
    set((state) => ({
      project: {
        ...state.project,
        sections: [...state.project.sections, section],
        updatedAt: new Date().toISOString(),
      },
      isDirty: true,
    })),

  updateSection: (id, partial) =>
    set((state) => ({
      project: {
        ...state.project,
        sections: state.project.sections.map((s) =>
          s.id === id ? { ...s, ...partial } : s
        ),
        updatedAt: new Date().toISOString(),
      },
      isDirty: true,
    })),

  removeSection: (id) =>
    set((state) => ({
      project: {
        ...state.project,
        sections: state.project.sections.filter((s) => s.id !== id),
        updatedAt: new Date().toISOString(),
      },
      isDirty: true,
    })),

  addScene: (scene) =>
    set((state) => ({
      project: {
        ...state.project,
        scenes: [...state.project.scenes, scene],
        updatedAt: new Date().toISOString(),
      },
      isDirty: true,
    })),

  updateScene: (id, partial) =>
    set((state) => ({
      project: {
        ...state.project,
        scenes: state.project.scenes.map((s) =>
          s.id === id ? { ...s, ...partial } : s
        ),
        updatedAt: new Date().toISOString(),
      },
      isDirty: true,
    })),

  removeScene: (id) =>
    set((state) => ({
      project: {
        ...state.project,
        scenes: state.project.scenes.filter((s) => s.id !== id),
        updatedAt: new Date().toISOString(),
      },
      isDirty: true,
    })),

  reorderScenes: (ids) =>
    set((state) => {
      const sceneMap = new Map(state.project.scenes.map((s) => [s.id, s]));
      const reordered = ids.map((id) => sceneMap.get(id)!).filter(Boolean);
      return {
        project: {
          ...state.project,
          scenes: reordered,
          updatedAt: new Date().toISOString(),
        },
        isDirty: true,
      };
    }),

  setCurrentTime: (time) => set({ currentTime: time }),

  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),

  selectScene: (id) => set({ selectedSceneId: id }),

  selectSection: (id) => set({ selectedSectionId: id }),

  setTimelineZoom: (zoom) =>
    set({ timelineZoom: Math.max(5, Math.min(50, zoom)) }),

  updateLyricsOverlay: (partial) =>
    set((state) => ({
      project: {
        ...state.project,
        lyricsOverlay: { ...state.project.lyricsOverlay, ...partial },
        updatedAt: new Date().toISOString(),
      },
      isDirty: true,
    })),

  updateExportSettings: (partial) =>
    set((state) => ({
      project: {
        ...state.project,
        exportSettings: { ...state.project.exportSettings, ...partial },
        updatedAt: new Date().toISOString(),
      },
      isDirty: true,
    })),

  loadProject: (project) =>
    set({
      project,
      currentTime: 0,
      isPlaying: false,
      selectedSceneId: null,
      selectedSectionId: null,
      isDirty: false,
    }),

  resetProject: () =>
    set({
      project: createDefaultProject(),
      currentTime: 0,
      isPlaying: false,
      selectedSceneId: null,
      selectedSectionId: null,
      timelineZoom: 10,
      isDirty: false,
    }),

  markClean: () => set({ isDirty: false }),
}));
