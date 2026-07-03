import { useMemo } from "react";
import { Box, Stack } from "@mui/material";

import type { AudioTrackData } from "@/app/types.ts";

import { useAddTrackToLibrary } from "@/app/quires/useLibrary.ts";
import { SearchPanel } from "@/pages/searchMusicPage/SearchPanel.tsx";
import { removeDuplicates, mapToPlayListItem } from "@/app/utils/utils.ts";
import { useSearchMusicTracks } from "@/app/quires/useSearchMusicTracks.ts";
import { useAudioStore } from "@/app/store/GlobalPlayerStore/useAudioPlayerState.ts";
import { TrackItem } from "@/pages/searchMusicPage/components/trackItem/TrackItem.tsx";
import { useValidateAudioTracks } from "@/app/hooks/audioValidator/useValidateAudioTracks.ts";
import { MusicPlayerControlsWidget } from "@/app/components/widgets/MusicPlayerControlsWidget.tsx";


export const SearchMusicWidget = () => {

  const { data, isPending, mutate } = useSearchMusicTracks();

  const { mutate: addTrackToLibrary } = useAddTrackToLibrary();

  const searchedTracks = data?.data ?? [];
  const distinct = useMemo(() => removeDuplicates(searchedTracks), [searchedTracks]);

  const { isLoading, validatedItems } = useValidateAudioTracks(distinct, {
    concurrency: 5,
    itemTimeout: 10000,
    globalTimeout: 30000,
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


  // console.log(validatedItems.length);
  const trackListFiltered = useMemo(() => {
      const audioTrackData = validatedItems.filter(item => item.isValid);
      setCurrentPlaylist(audioTrackData);
      return audioTrackData;
    },

    [validatedItems],
  );

  const trackList = useMemo(() => trackListFiltered
      .map((item) => {
        // console.log(item.url);
        return (
          <TrackItem
            item={item}
            isPlaying={isPlaying}
            currentTrackUrl={currentTrack?.url}
            key={item.url}
            onPlayClick={() => onItemPlayButtonClickHandler(item, trackListFiltered)}
            onAddClick={() => handleAddTrackToLibrary(item)}
          />);
      }),
    [currentTrack?.url, isPlaying, onItemPlayButtonClickHandler, trackListFiltered],
  );

  return (
    <Stack sx={{
      height: "100%",
      justifyContent: "space-between",
    }}>
      <Stack spacing={1} useFlexGap={true}>
        <SearchPanel onSearch={handleSearch} />
        <Box>
          <Stack>
            {isPending ?? isLoading ? "Loading..." : trackList}
          </Stack>
        </Box>
      </Stack>

      {/*todo вынести в область навигации*/}
      <MusicPlayerControlsWidget />

    </Stack>
  );
};
