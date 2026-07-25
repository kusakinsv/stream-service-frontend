import type { PlayListItem } from "@/app/types.ts";

import { streamServiceClient } from "@/app/api/clients.ts";

export type MusicPlaylist = {
  id: number;
  title: string | undefined,
  positions: PlayListItem[]
}

export const getMyMusicLibrary = () => {
  return streamServiceClient.get<MusicPlaylist>("/api/v1/library")
};

export const addTrackToLibrary = (item: PlayListItem) => {
  return streamServiceClient.post<MusicPlaylist>("/api/v1/library", item)
};

export const deleteTrackFromLibraryById = (position: number) => {
  return streamServiceClient.delete<MusicPlaylist>(`/api/v1/library/${position}`)
};

export const deleteTrackFromLibrary = (item: PlayListItem) => {
  console.log(JSON.stringify(item));
  return streamServiceClient.delete<MusicPlaylist>("/api/v1/library", {
    data: item
  })
};

export const updatePlayList = (playlistId: number, playlistItems: PlayListItem[]) => {
  return streamServiceClient.put<MusicPlaylist>(`/api/v1/library/playlist/${playlistId}`, playlistItems)
};