import { useMemo } from "react";
import { Box, List, Stack } from "@mui/material";

import type { AudioTrackData } from "@/app/types.ts";

import { removeDuplicates } from "@/app/utils/utils.ts";
import { mapToPlayListItem } from "@/app/utils/playlistUtils.ts";
import { useAddTrackToLibrary } from "@/app/quires/useLibrary.ts";
import { useAudioStore } from "@/app/store/useAudioPlayerState.ts";
import { SearchPanel } from "@/pages/searchMusicPage/SearchPanel.tsx";
import { useSearchMusicTracks } from "@/app/quires/useSearchMusicTracks.ts";
import { TrackItem } from "@/pages/searchMusicPage/components/trackItem/TrackItem.tsx";
import { useValidateAudioTracks } from "@/app/hooks/audioValidator/useValidateAudioTracks.ts";


export const SearchMusicWidget = () => {

  const { data, isPending, mutate } = useSearchMusicTracks();

  const { mutate: addTrackToLibrary } = useAddTrackToLibrary();

  const searchedTracks = data?.data ?? [];
  const distinct = useMemo(() => removeDuplicates(searchedTracks), [searchedTracks]);

  const { isLoading, validatedItems } = useValidateAudioTracks(distinct, {
    concurrency: 5,
    itemTimeout: 10000,
    globalTimeout: 30000,
    checkWithProxyAfter: 3000
  });

  const { isPlaying, currentTrack, setCurrentTrack, togglePlay, setCurrentPlaylist } = useAudioStore();

  const handleSearch = (track: string) => {
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
    addTrackToLibrary(mapToPlayListItem(item));
  };


  const trackListFiltered = useMemo(() => {
      const audioTrackData = validatedItems.filter(item => item.isValid);
      setCurrentPlaylist(audioTrackData);
      return audioTrackData;
    },

    [validatedItems],
  );

  // const trackList = useMemo(() => mockTracks
  const trackList = useMemo(() => trackListFiltered
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
    [currentTrack?.url, isPlaying, onItemPlayButtonClickHandler, trackListFiltered],
  );

  return (
    <Stack sx={{
      height: "100%",
      maxHeight: "93vh",
      justifyContent: "space-between",
      // overflow: 'hidden', // важно! предотвращаем скролл всего стека
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0, // важно для flex-сжатия
        flexGrow: 1,

      }}>
        <SearchPanel onSearch={handleSearch} />
        <Box sx={{
          overflow: "auto",
            flex: 1,
            minHeight: 0, // критично для корректной работы overflow
          }}>
            <List sx={{ width: '100%'}}>
              {isPending ?? isLoading ? "Loading..." : trackList}
            </List>
        </Box>
      </Box>

      {/*todo вынести в область навигации*/}
      {/*<MusicPlayerControlsWidget />*/}

    </Stack>
  );
};
