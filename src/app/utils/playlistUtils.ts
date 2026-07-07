import type { MusicPlaylist } from "@/app/quires/libraryQuires.ts";
import type { PlayListItem, AudioTrackData } from "@/app/types.ts";

export const STORAGE_KEY = "library";

export const EMPTY_LIST = {
  id: -1,
  title: undefined,
  positions: [],
} as MusicPlaylist;

export const savePlayListToStorage = (data: MusicPlaylist) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const loadPlayListFromStorage = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) as MusicPlaylist : EMPTY_LIST;
};

export const mapToPlayList = (trackDataList: AudioTrackData[]): PlayListItem[] => {
  return trackDataList.map(item => mapToPlayListItem(item));
};

export const mapToPlayListItem = (trackData: AudioTrackData): PlayListItem => {
  return {
    position: trackData.position ?? 0,
    url: trackData.url,
    duration: trackData.duration,
    title: trackData.title,
    isNeedProxy: trackData.isNeedProxy ?? false,
  };
};


