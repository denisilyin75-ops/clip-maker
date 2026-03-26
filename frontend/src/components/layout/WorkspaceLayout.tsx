"use client";

import Header from "./Header";
import LyricsPanel from "../lyrics/LyricsPanel";
import PreviewPlayer from "../preview/PreviewPlayer";
import Timeline from "../timeline/Timeline";
import ScenesPanel from "../scenes/ScenesPanel";

export default function WorkspaceLayout() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <LyricsPanel />
        <div className="flex-1 flex flex-col overflow-hidden">
          <PreviewPlayer />
          <Timeline />
        </div>
        <ScenesPanel />
      </div>
    </div>
  );
}
