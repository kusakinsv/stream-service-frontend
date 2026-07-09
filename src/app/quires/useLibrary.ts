import type { AxiosError, AxiosResponse } from "axios";

import { useQuery, useMutation } from "@tanstack/react-query";

import type { BaseError } from "@/app/quires/types.ts";
import type { PlayListItem, AudioTrackData } from "@/app/types.ts";
import type { DraggableItem } from "@/app/components/dnd/types.ts";

import { EMPTY_LIST, savePlayListToStorage, loadPlayListFromStorage } from "@/app/utils/playlistUtils.ts";
import {
  addTrackToLibrary,
  getMyMusicLibrary,
  type MusicPlaylist,
  deleteTrackFromLibrary,
  deleteTrackFromLibraryById,
} from "@/app/quires/libraryQuires.ts";


interface UseGetDataProps{
  onDelete?: (item: AudioTrackData) => void;
  items?: DraggableItem<AudioTrackData>[];
  // onAddTrack: () => void;
}

export const useGetMusicLibrary = ({onDelete}: UseGetDataProps) => {



  return useQuery<MusicPlaylist, AxiosError<BaseError>>({
    enabled: true,
    queryKey: ["library-1", {onDelete}],
    queryFn: async () => {
      try {
        const { data } = await getMyMusicLibrary();
        const hasData = data?.positions?.length > 0;

        if (hasData) {
          savePlayListToStorage(data);
          return data;
        }

        const cached = loadPlayListFromStorage();
        if (cached?.positions?.length > 0) {
          return cached;
        }

        return EMPTY_LIST
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        const cached = loadPlayListFromStorage();
        if (cached?.positions?.length > 0) {
          return cached;
        }

        return EMPTY_LIST
      }
    },
  });
};

export const useAddTrackToLibrary = () => {
  return useMutation<AxiosResponse<MusicPlaylist>, AxiosError<BaseError>, PlayListItem>({
    mutationFn: (item: PlayListItem) => addTrackToLibrary(item),
  });
};

//todo переделать на url
export const useDeleteTrackFromLibraryById = () => {
  return useMutation<AxiosResponse<MusicPlaylist>, AxiosError<BaseError>, number>({
    mutationFn: (position: number) => deleteTrackFromLibraryById(position),
  });
};

export const useDeleteTrackFromLibrary = () => {
  return useMutation<AxiosResponse<MusicPlaylist>, AxiosError<BaseError>, PlayListItem>({
    mutationFn: (item: PlayListItem) => deleteTrackFromLibrary(item),
  });
};