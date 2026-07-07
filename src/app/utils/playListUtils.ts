import type { PlayListMusicResponse } from "@/app/quires/libraryQuires.ts";

export const STORAGE_KEY = "library";

export const EMPTY_LIST = {
  id: -1,
  title: undefined,
  positions: [],
} as PlayListMusicResponse;

export const savePlayListToStorage = (data: PlayListMusicResponse) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const loadPlayListFromStorage = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) as PlayListMusicResponse : EMPTY_LIST;
};