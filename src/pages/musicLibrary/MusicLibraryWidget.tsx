import { useEffect } from "react";
import { Box, List, Paper, Stack, Typography } from "@mui/material";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSensor,
  DndContext,
  useSensors,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  type DragEndEvent,
} from "@dnd-kit/core";

import type { AudioTrackData } from "@/app/types.ts";

import { useReOrderPlaylist } from "@/app/quires/usePlaylist.ts";
import { useAudioStore } from "@/app/store/useAudioPlayerState.ts";
import { usePlaylistStore } from "@/app/store/usePlaylistState.ts";
import { SortableItem } from "@/app/components/dnd/SortableItem.tsx";
import { PlayListTrackItem } from "@/pages/musicLibrary/PlayListTrackItem.tsx";
import { useGetMusicLibrary, useDeleteTrackFromLibrary } from "@/app/quires/useLibrary.ts";
import { useValidateAudioTracks } from "@/app/hooks/audioValidator/useValidateAudioTracks.ts";
import { mapToPlayList, mapToPlayListItem, savePlayListToStorage } from "@/app/utils/playlistUtils.ts";


export const MusicLibraryWidget = () => {
  const { deleteTrack, libraryItems, setLibraryItems } = usePlaylistStore();
  const { isPlaying, currentTrack, setCurrentTrack, togglePlay } = useAudioStore();

  const { data, isLoading} = useGetMusicLibrary({});
  const { mutate: deleteItem } = useDeleteTrackFromLibrary();
  const { mutate: reOrderPlaylist, data: reordered } = useReOrderPlaylist();

  const { isLoading: isValidationLoading, validatedItems } = useValidateAudioTracks(data?.positions ?? [], {
    concurrency: 5,
    itemTimeout: 2000,
    globalTimeout: 10000,
    checkWithProxyAfter: 1500
  });

  const handleDeleteItem = (item: AudioTrackData) => {
    deleteTrack(item);
    deleteItem(mapToPlayListItem(item));
  };

  const onItemPlayButtonClickHandler = (item: AudioTrackData, trackList: AudioTrackData[]) => {
    if (currentTrack?.url !== item.url) {
      setCurrentTrack(item, trackList);
    } else {
      togglePlay();
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = libraryItems.findIndex((item) => item.url === active.id);
      const newIndex = libraryItems.findIndex((item) => item.url === over.id);
      const movedArr = arrayMove(libraryItems, oldIndex, newIndex);
      for (let i = 0; i < movedArr.length; i++) {
        movedArr[i].position = i + 1;
      }
      setLibraryItems(movedArr);
      console.log(data !== null && data !== undefined);
      if (data) {
        reOrderPlaylist({ id: data.id, positions: mapToPlayList(movedArr) });
      }
    }
  };

  if (reordered) savePlayListToStorage(reordered?.data);

  //для добавления
  useEffect(() => {
    if (validatedItems.length > libraryItems.length) {
      setLibraryItems(validatedItems)
    }
  }, [validatedItems]);

  const itemElements = libraryItems
    .sort((o1, o2) => (o1.position ?? Infinity) - (o2.position ?? Infinity))
    .map((value) => {
      return (
        <SortableItem
          key={value.url}
          item={{id: value.url}}
          elem={<PlayListTrackItem
            item={value}
            isPlaying={isPlaying}
            currentTrackUrl={currentTrack?.url}
            key={value.url}
            onClick={() => onItemPlayButtonClickHandler(value, validatedItems)}
            onDeleteClick={() => handleDeleteItem(value)}
          />}
        />
      );
    });


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <Stack sx={{
      height: "100%",
      justifyContent: "space-between",
    }}>
      <Stack spacing={1} useFlexGap={true}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
            {data?.title}
          </Typography>
          {isLoading || isValidationLoading ? "Loading..." : (
            // <Container maxWidth="md">
            <Box sx={{ py: 1 }}>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={libraryItems.map((item) => item.url)}
                  strategy={verticalListSortingStrategy}
                >
                  <List sx={{ p: 0 }}>
                    {itemElements}
                  </List>
                </SortableContext>
              </DndContext>

              {libraryItems.length === 0 && (
                <Paper sx={{ p: 4, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    {"Список пуст. Добавьте музыку из раздела \"Поиск музыки\""}
                  </Typography>
                </Paper>
              )}
            </Box>
          )
          }
        </Box>
      </Stack>
    </Stack>
  );
};