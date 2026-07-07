import { useMemo, useState, useEffect } from "react";
import { Box, List, Paper, Stack, Container, Typography } from "@mui/material";
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
import type { DraggableItem } from "@/app/components/dnd/types.ts";

import { mapToPlayListItem } from "@/app/utils/utils.ts";
import { SortableItem } from "@/app/components/dnd/SortableItem.tsx";
import { PlayListTrackItem } from "@/pages/musicLibrary/PlayListTrackItem.tsx";
import { useAudioStore } from "@/app/store/GlobalPlayerStore/useAudioPlayerState.ts";
import { useGetMusicLibrary, useDeleteTrackFromLibrary } from "@/app/quires/useLibrary.ts";
import { useValidateAudioTracks } from "@/app/hooks/audioValidator/useValidateAudioTracks.ts";


export const MusicLibraryWidget = () => {
  const handleDeleteItem = (item: AudioTrackData) => {
    deleteItem(mapToPlayListItem(item));
  };


  const { data, isLoading } = useGetMusicLibrary({ onDelete: handleDeleteItem });
  const { mutate: deleteItem } = useDeleteTrackFromLibrary();

  const { isPlaying, currentTrack, setCurrentTrack, togglePlay } = useAudioStore();

  const { isLoading: isValidationLoading, validatedItems } = useValidateAudioTracks(data?.positions ?? [], {
    concurrency: 2,
    itemTimeout: 10000,
    globalTimeout: 20000,
  });

  // const playList = useMemo(() => validatedItems
  //   .sort((o1, o2) => (o1.position ?? Infinity) - (o2.position ?? Infinity))
  //   .map(item => {
  //       // console.log(item.url);
  //       return <PlayListTrackItem
  //         item={item}
  //         isPlaying={isPlaying}
  //         currentTrackUrl={currentTrack?.url}
  //         key={item.url}
  //         onClick={() => onItemPlayButtonClickHandler(item, validatedItems)}
  //         onDeleteClick={() => handleDeleteItem(item)}
  //       />;
  //     },
  //   ), [validatedItems, isPlaying, deleteItem, currentTrack, setCurrentTrack, togglePlay]);

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
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const movedArr = arrayMove(items, oldIndex, newIndex);
        for (let i = 0; i < movedArr.length; i++){
          movedArr[i].position = i+1;
        }
      setItems( movedArr);
      
    }


  };

  const handleDelete = (id: string) => {
    setItems((items) => items.filter((item) => item.id !== id));
  };

  const draggables: DraggableItem<AudioTrackData>[] = useMemo(() => validatedItems
    .sort((o1, o2) => (o1.position ?? Infinity) - (o2.position ?? Infinity))
    .map((value, index) => ({ ...value, id: String(index) })), [validatedItems]);

  // const tracks = useMemo(() => validatedItems
  //   .sort((o1, o2) => (o1.position ?? Infinity) - (o2.position ?? Infinity))
  //   .map((value, index) => {
  //       return (
  //         <SortableItem
  //           key={index}
  //           item={{
  //               ...value,
  //               id: String(index),
  //             }}
  //           elem={<PlayListTrackItem
  //             item={value}
  //             isPlaying={isPlaying}
  //             currentTrackUrl={currentTrack?.url}
  //             key={value.url}
  //             onClick={() => onItemPlayButtonClickHandler(value, validatedItems)}
  //             onDeleteClick={() => handleDeleteItem(value)}
  //           />}
  //           onDelete={handleDelete}
  //
  //         />
  //       );
  //     },
  //   ), [validatedItems, isPlaying, deleteItem, currentTrack, setCurrentTrack, togglePlay]);

  // const draggables: DraggableItem<AudioTrackData>[] = useMemo(() => tracks.map((value, index) => ({
  //   ...value,
  //   id: String(index),
  // })), [tracks]);

  const [items, setItems] = useState<DraggableItem<AudioTrackData>[]>(draggables);

  useEffect(() => {
    setItems(draggables);
  }, [draggables]);

  const itemElements = items
    .map((value) => {
      return (
        <SortableItem
          key={value.id}
          item={value}
          elem={<PlayListTrackItem
            item={value}
            isPlaying={isPlaying}
            currentTrackUrl={currentTrack?.url}
            key={value.url}
            onClick={() => onItemPlayButtonClickHandler(value, validatedItems)}
            onDeleteClick={() => handleDeleteItem(value)}
          />}
          onDelete={handleDelete}

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

  console.log(JSON.stringify(items));

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
                  items={items.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <List sx={{ p: 0 }}>
                    {itemElements}
                  </List>
                </SortableContext>
              </DndContext>

              {items.length === 0 && (
                <Paper sx={{ p: 4, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    {"Список пуст. Добавьте музыку из раздела \"Поиск музыки\""}
                  </Typography>
                </Paper>
              )}
            </Box>
          // </Container>
            )
        }



          {/*<Stack>*/}
          {/*  {isLoading || isValidationLoading ? "Loading..." : playList}*/}
          {/*</Stack>*/}
        </Box>
      </Stack>
    </Stack>
  );
};