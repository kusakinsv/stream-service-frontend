import type { AxiosError, AxiosResponse } from "axios";

import { useQuery, useMutation } from "@tanstack/react-query";

import type { BaseError } from "@/app/quires/types.ts";
import type { PlayListItem, AudioTrackData } from "@/app/types.ts";

import {
  addTrackToLibrary,
  getMyMusicLibrary,
  deleteTrackFromLibrary,
  deleteTrackFromLibraryById,
  type PlayListMusicResponse,
} from "@/app/quires/libraryQuires.ts";

const STORAGE_KEY = "library";

const EMPTY_LIST = {
  title: undefined,
  positions: [],
} as PlayListMusicResponse;



const saveToStorage = (data: PlayListMusicResponse) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

const loadFromStorage = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) as PlayListMusicResponse : EMPTY_LIST;
};

interface UseGetDataProps{
  onDelete: (item: AudioTrackData) => void;
  // onAddTrack: () => void;
}

export const useGetMusicLibrary = ({ onDelete }: UseGetDataProps) => {

  return useQuery<PlayListMusicResponse, AxiosError<BaseError>>({
    enabled: true,
    queryKey: ["library", {onDelete}],
    queryFn: async () => {
      try {
        const { data } = await getMyMusicLibrary();
        const hasData = data?.positions?.length > 0;

        if (hasData) {
          saveToStorage(data);
          return data;
        }

        const cached = loadFromStorage();
        if (cached?.positions?.length > 0) {
          return cached;
        }

        return EMPTY_LIST
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        const cached = loadFromStorage();
        if (cached?.positions?.length > 0) {
          return cached;
        }

        return EMPTY_LIST
      }
    },
  });
};

export const useAddTrackToLibrary = () => {
  return useMutation<AxiosResponse<PlayListMusicResponse>, AxiosError<BaseError>, PlayListItem>({
    mutationFn: (item: PlayListItem) => addTrackToLibrary(item),
  });
};

//todo переделать на url
export const useDeleteTrackFromLibraryById = () => {
  return useMutation<AxiosResponse<PlayListMusicResponse>, AxiosError<BaseError>, number>({
    mutationFn: (position: number) => deleteTrackFromLibraryById(position),
  });
};

export const useDeleteTrackFromLibrary = () => {
  return useMutation<AxiosResponse<PlayListMusicResponse>, AxiosError<BaseError>, PlayListItem>({
    mutationFn: (item: PlayListItem) => deleteTrackFromLibrary(item),
  });
};