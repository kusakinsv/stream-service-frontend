import type { AxiosError, AxiosResponse } from "axios";

import { useMutation } from "@tanstack/react-query";

import type { PlayListItem } from "@/app/types.ts";
import type { BaseError } from "@/app/quires/types.ts";

import { updatePlayList, type MusicPlaylist } from "@/app/quires/libraryQuires.ts";

interface ReOrderPositionsQuery {
  id: number;
  positions: PlayListItem[];
}

export const useReOrderPlaylist = () => {
  return useMutation<AxiosResponse<MusicPlaylist>, AxiosError<BaseError>, ReOrderPositionsQuery>({
    mutationFn: ({id, positions}) => updatePlayList(id, positions),
  });
};