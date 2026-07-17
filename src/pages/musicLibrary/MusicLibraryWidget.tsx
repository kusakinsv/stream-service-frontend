import { useEffect } from "react";
import { List, Paper, Typography } from "@mui/material";
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
import { useLibraryStore } from "@/app/store/usePlaylistState.ts";
import { useAudioStore } from "@/app/store/useAudioPlayerState.ts";
import { SortableItem } from "@/app/components/dnd/SortableItem.tsx";
import { PlayListTrackItem } from "@/pages/musicLibrary/PlayListTrackItem.tsx";
import { useGetMusicLibrary, useDeleteTrackFromLibrary } from "@/app/quires/useLibrary.ts";
import { useValidateAudioTracks } from "@/app/hooks/audioValidator/useValidateAudioTracks.ts";
import {
  mapToPlayList,
  mapToPlayListItem,
  savePlayListToStorage,
  updatePlayListInStorage,
} from "@/app/utils/playlistUtils.ts";


export const MusicLibraryWidget = () => {
  const { deleteTrack, libraryItems, setLibraryItems } = useLibraryStore();
  const { isPlaying, currentTrack, setCurrentTrack, togglePlay, setCurrentPlaylist, isShuffle} = useAudioStore();

  const { data, isLoading } = useGetMusicLibrary({});
  const { mutate: deleteItem } = useDeleteTrackFromLibrary();
  const { mutate: reOrderPlaylist, data: reordered } = useReOrderPlaylist();

  const {validatedItems } = useValidateAudioTracks(data?.positions ?? [], {
    concurrency: 5,
    itemTimeout: 2000,
    globalTimeout: 10000,
    checkWithProxyAfter: 1500,
    showValidatingTracks: false
  });

  const handleDeleteItem = (item: AudioTrackData) => {
    deleteTrack(item);
    updatePlayListInStorage("library", libraryItems)
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
      // console.log(data !== null && data !== undefined);
      setCurrentPlaylist(movedArr);
      if (data && !isShuffle) {
        reOrderPlaylist({ id: data.id, positions: mapToPlayList(movedArr) });
      }
    }
  };

  if (reordered) savePlayListToStorage("library", reordered?.data);

  //для добавления
  useEffect(() => {
    if (validatedItems.length >= libraryItems.length) {
      setLibraryItems(validatedItems);
    }
  }, [validatedItems]);

  const itemElements = libraryItems
    .sort((o1, o2) => (o1.position ?? Infinity) - (o2.position ?? Infinity))
    .map((value) => {
      return (
        <SortableItem
          key={value.url}
          item={{ id: value.url }}
          elem={<PlayListTrackItem
            item={value}
            isPlaying={isPlaying}
            currentTrackUrl={currentTrack?.url}
            key={value.url}
            onClick={() => onItemPlayButtonClickHandler(value, libraryItems)}
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
    <>
      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        {data?.title}
      </Typography>
      {isLoading ? "Loading..." : (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={libraryItems.map((item) => item.url)}
              strategy={verticalListSortingStrategy}
            >

                  <List>
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
        </>)
      }
    </>
  );
};