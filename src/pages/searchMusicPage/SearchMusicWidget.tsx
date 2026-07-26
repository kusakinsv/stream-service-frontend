import { Box, List } from "@mui/material";
import { useMemo, useEffect } from "react";

import type { AudioTrackData } from "@/app/types.ts";

import { removeDuplicates } from "@/app/utils/utils.ts";
import { useLibraryStore } from "@/app/store/usePlaylistState.ts";
import { useAudioStore } from "@/app/store/useAudioPlayerState.ts";
import { useSearchStore } from "@/app/store/useMusicSearchtState.ts";
import { useAddTrackToLibrary } from "@/app/api/quires/useLibrary.ts";
import { SearchPanel } from "@/pages/searchMusicPage/SearchPanel.tsx";
import { useSearchMusicTracks } from "@/app/api/quires/useSearchMusicTracks.ts";
import { mapToPlayListItem, updatePlayListInStorage } from "@/app/utils/playlistUtils.ts";
import { useValidateAudioTracks } from "@/app/hooks/audioValidator/useValidateAudioTracks.ts";
import { SearchTrackItem } from "@/pages/searchMusicPage/components/trackItem/SearchTrackItem.tsx";


export const SearchMusicWidget = () => {
  const { isPlaying, currentTrack, setCurrentTrack, togglePlay } = useAudioStore();
  const {setCurrentSearchTrack,  foundTracks,  setFoundTracks, clear } = useSearchStore();
  const { addTrack, libraryItems } = useLibraryStore();

  const { data, isPending, mutate } = useSearchMusicTracks();

  const { mutate: addTrackToLibrary } = useAddTrackToLibrary();
  
  const distinct = useMemo(() => removeDuplicates(data?.data ?? []), [data]);

  const { isLoading, validatedItems } = useValidateAudioTracks(distinct, {
    concurrency: 5,
    itemTimeout: 10000,
    globalTimeout: 30000,
    checkWithProxyAfter: 3000,
  });

  useEffect(() => {
    if (validatedItems.length > foundTracks.length) {
      setFoundTracks(validatedItems)
    }
  }, [foundTracks.length, setFoundTracks, validatedItems, data]);

   const handleSearch = (track: string) => {
    clear();
    setCurrentSearchTrack(track);
    mutate(track);
  };

  const onItemPlayButtonClickHandler = (item: AudioTrackData, trackList: AudioTrackData[]) => {
    if (currentTrack?.url !== item.url) {
      setCurrentTrack(item, trackList);
    } else {
      togglePlay();
    }
  };

  const handleAddTrackToLibrary = (item: AudioTrackData) => {
    addTrack(item);
    // updatePlayListInStorage("library", libraryItems)
    addTrackToLibrary(mapToPlayListItem(item));
  };

  updatePlayListInStorage("library", libraryItems)

  const trackList = useMemo(() => foundTracks
      // .filter(item => item.isValid)
      .map((item) => {
        return (
          <SearchTrackItem
            item={item as AudioTrackData}
            isPlaying={isPlaying}
            currentTrackUrl={currentTrack?.url}
            key={item.url}
            onPlayClick={() => onItemPlayButtonClickHandler(item, foundTracks)}
            onAddClick={() => handleAddTrackToLibrary(item)}
          />
        );
      }),
    [currentTrack?.url, isPlaying, onItemPlayButtonClickHandler, foundTracks],
  );

  return (
    <Box id="search-widget-box" sx={{
      // overflow: "auto",
      height: "100%",
    }}>
      <SearchPanel onSearch={handleSearch} />

          <List sx={{
            width: "100%",
            flexGrow: 1,
            minHeight: 0
          }}>

            {isPending ?? isLoading ? "Loading..." : trackList}
          </List>
    </Box>
);
};
