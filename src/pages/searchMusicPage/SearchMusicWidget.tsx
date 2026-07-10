import { useMemo, useEffect } from "react";
import { Box, List, Stack } from "@mui/material";

import type { AudioTrackData } from "@/app/types.ts";

import { removeDuplicates } from "@/app/utils/utils.ts";
import { mapToPlayListItem } from "@/app/utils/playlistUtils.ts";
import { useAddTrackToLibrary } from "@/app/quires/useLibrary.ts";
import { useAudioStore } from "@/app/store/useAudioPlayerState.ts";
import { usePlaylistStore } from "@/app/store/usePlaylistState.ts";
import { useSearchStore } from "@/app/store/useMusicSearchtState.ts";
import { SearchPanel } from "@/pages/searchMusicPage/SearchPanel.tsx";
import { useSearchMusicTracks } from "@/app/quires/useSearchMusicTracks.ts";
import { TrackItem } from "@/pages/searchMusicPage/components/trackItem/TrackItem.tsx";
import { useValidateAudioTracks } from "@/app/hooks/audioValidator/useValidateAudioTracks.ts";


export const SearchMusicWidget = () => {
  const { isPlaying, currentTrack, setCurrentTrack, togglePlay } = useAudioStore();
  const {setCurrentSearchTrack,  foundTracks,  setFoundTracks, clear } = useSearchStore();
  const { addTrack } = usePlaylistStore();

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
  }, [foundTracks.length, setFoundTracks, validatedItems]);

  console.log(foundTracks.length);

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
    addTrackToLibrary(mapToPlayListItem(item));
  };


  const trackListFiltered = useMemo(() => {
      const audioTrackData = validatedItems.filter(item => item.isValid);
      return audioTrackData;
    },

    [validatedItems],
  );

  // const trackList = useMemo(() => mockTracks
  const trackList = useMemo(() => foundTracks
      .map((item) => {
        return (
          <TrackItem
            item={item as AudioTrackData}
            isPlaying={isPlaying}
            currentTrackUrl={currentTrack?.url}
            key={item.url}
            onPlayClick={() => onItemPlayButtonClickHandler(item, trackListFiltered)}
            onAddClick={() => handleAddTrackToLibrary(item)}
          />
        );
      }),
    [currentTrack?.url, isPlaying, onItemPlayButtonClickHandler, trackListFiltered, foundTracks],
  );

  return (
    <Stack sx={{
      height: "100%",
      maxHeight: "93vh",
      justifyContent: "space-between",
      // overflow: 'hidden', // важно! предотвращаем скролл всего стека
    }}>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: 0, // важно для flex-сжатия
        flexGrow: 1,

      }}>
        <SearchPanel onSearch={handleSearch} />
        <Box sx={{
          overflow: "auto",
          flex: 1,
          minHeight: 0, // критично для корректной работы overflow
        }}>
          <List sx={{ width: "100%" }}>
            {isPending ?? isLoading ? "Loading..." : trackList}
          </List>
        </Box>
      </Box>

      {/*todo вынести в область навигации*/}
      {/*<MusicPlayerControlsWidget />*/}

    </Stack>
  );
};
