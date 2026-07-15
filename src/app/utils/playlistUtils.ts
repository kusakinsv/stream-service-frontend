import type { MusicPlaylist } from "@/app/quires/libraryQuires.ts";
import type { PlayListItem, AudioTrackData } from "@/app/types.ts";

export const EMPTY_LIST = {
  id: -1,
  title: undefined,
  positions: [],
} as MusicPlaylist;

//todo перепилить чтоб забирать лист по id
export const savePlayListToStorage = (key: string, data: MusicPlaylist) => {
  try {
    if (data) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const updatePlayListInStorage = (key: string, audioTracks: AudioTrackData[]) => {
  try {
    if (audioTracks) {
      const storageData = localStorage.getItem(key);
      if (storageData) {
        const playList = JSON.parse(storageData) as MusicPlaylist;
        playList.positions = mapToPlayList(audioTracks);
        localStorage.setItem(key, JSON.stringify(playList));
      }
    }
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

export const loadPlayListFromStorage = (key: string) => {
  const data = localStorage.getItem(key);
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


