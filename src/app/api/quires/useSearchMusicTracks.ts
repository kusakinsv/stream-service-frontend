import type { AxiosError, AxiosResponse } from "axios";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { AudioItem } from "@/app/types.ts";
import type { BaseError } from "@/app/api/quires/types.ts";

import { searchQuires } from "@/app/api/quires/searchQuires.ts";

export const useSearchMusicTracks = () => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<AudioItem[]>, AxiosError<BaseError>, string>({
    mutationFn: (trackName: string) => searchQuires({
      query: trackName ?? "",
    }),
    onSuccess: (data) => {
      queryClient.setQueryData(['search-results'], data);
    }
  });
};