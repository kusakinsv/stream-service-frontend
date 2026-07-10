import { create } from "zustand/react";

import type { AudioTrackData } from "@/app/types.ts";

interface PlaylistState {
  currentSearchTrack: string;
  setCurrentSearchTrack: (value: string) => void;
  foundTracks: AudioTrackData[];
  setFoundTracks: (items: AudioTrackData[]) => void;
  clear: () => void;
}

export const useSearchStore = create<PlaylistState>()((set) => ({
    foundTracks: [],
    setFoundTracks: items => {
      set({
        foundTracks: items,
      });
    },
    currentSearchTrack: "",
    setCurrentSearchTrack: (track: string) => {
      set({currentSearchTrack: track})
    },
    clear: () => {
      set({
        foundTracks: []
      })
    }
  }

));

