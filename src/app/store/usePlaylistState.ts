import { create } from "zustand/react";

import type { AudioTrackData } from "@/app/types.ts";

interface LibraryState {
  libraryItems: AudioTrackData[];
  setLibraryItems: (items: AudioTrackData[]) => void;
  addTrack: (item: AudioTrackData) => void;
  deleteTrack: (item: AudioTrackData) => void;
}

export const useLibraryStore = create<LibraryState>()((set, get) => ({
    libraryItems: [],
    setLibraryItems: items => {
      set({
        libraryItems: items,
      });
    },
    addTrack: (item: AudioTrackData) => {
      const { libraryItems: li } = get();
      if (!li.some(i=> i.url === item.url)) {
        set({
          libraryItems: [...li, item],
        });
      }
    },
    deleteTrack: (item: AudioTrackData) => {
      const { libraryItems: li } = get();
      set({
        libraryItems: li.filter((i) => i.url !== item.url),
      });
    },
  }

));

