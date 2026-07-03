import { useMemo } from "react";
import { Box, Stack } from "@mui/material";

import type { AudioTrackData } from "@/app/types.ts";

import { mapToPlayListItem } from "@/app/utils/utils.ts";
import { PlayListTrackItem } from "@/pages/musicLibrary/PlayListTrackItem.tsx";
import { useAudioStore } from "@/app/store/GlobalPlayerStore/useAudioPlayerState.ts";
import { useGetMusicLibrary, useDeleteTrackFromLibrary } from "@/app/quires/useLibrary.ts";
import { useValidateAudioTracks } from "@/app/hooks/audioValidator/useValidateAudioTracks.ts";
import { MusicPlayerControlsWidget } from "@/app/components/widgets/MusicPlayerControlsWidget.tsx";


export const MusicLibraryWidget = () => {

    const {data, isLoading} = useGetMusicLibrary();
    const {mutate: deleteItem} = useDeleteTrackFromLibrary();

    const { isPlaying, currentTrack, setCurrentTrack, togglePlay} = useAudioStore();

    const { isLoading: isValidationLoading, validatedItems } = useValidateAudioTracks(data?.positions ?? [], {
        concurrency: 2,
        itemTimeout: 10000,
        globalTimeout: 20000,
    });

    const onItemPlayButtonClickHandler = (item: AudioTrackData, trackList: AudioTrackData[]) => {
        if (currentTrack?.url !== item.url) {
            setCurrentTrack(item, trackList);
        } else {
            togglePlay();
        }
    };

    const handleDelete = (item: AudioTrackData) => {
      deleteItem(mapToPlayListItem(item));
    }

    const playList = useMemo(() => validatedItems
      .sort((o1, o2) => (o1.position ?? Infinity) - (o2.position ?? Infinity))
      .map(item => {
        // console.log(item.url);
        return <PlayListTrackItem
          item={item}
          isPlaying={isPlaying}
          currentTrackUrl={currentTrack?.url}
          key={item.url}
          onClick={() => onItemPlayButtonClickHandler(item, validatedItems)}
          onDeleteClick={() => handleDelete(item)}
        />;
      }),[validatedItems, isPlaying, deleteItem, currentTrack, setCurrentTrack, togglePlay]);

    return(
      <Stack sx={{
          height: "100%",
          justifyContent: "space-between",
      }}>
        <Stack spacing={1} useFlexGap={true}>
            <Box>
                <Stack>
                    {isLoading || isValidationLoading ? "Loading..." : playList}
                </Stack>
            </Box>
        </Stack>
        <MusicPlayerControlsWidget />
      </Stack>
    );
}