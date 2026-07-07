import type { PlayListItem } from "@/app/types.ts";

import { streamServiceClient } from "@/app/api/client.ts";

export type PlayListMusicResponse = {
  id: number;
  title: string | undefined,
  positions: PlayListItem[]
}

export const getMyMusicLibrary = () => {
  return streamServiceClient.get<PlayListMusicResponse>("/stream-service/api/v1/library")
};

export const addTrackToLibrary = (item: PlayListItem) => {
  return streamServiceClient.post<PlayListMusicResponse>("/stream-service/api/v1/library", item)
};

export const deleteTrackFromLibraryById = (position: number) => {
  return streamServiceClient.delete<PlayListMusicResponse>(`/stream-service/api/v1/library/${position}`)
};

export const deleteTrackFromLibrary = (item: PlayListItem) => {
  console.log(JSON.stringify(item));
  return streamServiceClient.delete<PlayListMusicResponse>("/stream-service/api/v1/library", {
    data: item
  })
};

export const updatePlayList = () => {
  return streamServiceClient.get<PlayListMusicResponse>("/stream-service/api/v1/library")
};