import type { DragEndEvent } from "@dnd-kit/core";

import { useMemo, useState } from "react";
import { Box, List, Paper, Container, Typography } from "@mui/material";
import { useSensor, DndContext, useSensors, closestCenter, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { AudioTrackData } from "@/app/types.ts";
import type { DraggableItem } from "@/app/components/dnd/types.ts";

import { SortableItem } from "@/app/components/dnd/SortableItem.tsx";
import { PlayListTrackItem } from "@/pages/musicLibrary/PlayListTrackItem.tsx";
import { useAudioStore } from "@/app/store/GlobalPlayerStore/useAudioPlayerState.ts";


interface DndProps {
  tracks: AudioTrackData[];
  isLoading: boolean;
  onItemPlayButtonClickHandler: (item: AudioTrackData, trackList: AudioTrackData[]) => void;
  handleDeleteItem: (item: AudioTrackData) => void;
}

export const DraggableList = ({tracks, onItemPlayButtonClickHandler, handleDeleteItem, isLoading}: DndProps) => {

  const { isPlaying, currentTrack, currentPlaylist} = useAudioStore();

  const draggables: DraggableItem<AudioTrackData>[] = useMemo(()=> tracks.map((value, index) => ({...value, id: String(index)})),[tracks] );
  // const draggables: DraggableItem<AudioTrackData>[] = tracks.map((value, index) => ({...value, id: String(index)}));

  const [items, setItems] = useState<DraggableItem<AudioTrackData>[]>(draggables);


  // useEffect(() => {
  //   setItems(draggables)
  // }, [isLoading]);
  
  console.log("d: " + draggables.length);
  console.log("i: " + items.length);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDelete = (id: string) => {
    setItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <Container maxWidth="md">
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
              {items.map((item) => (
                <SortableItem
                  key={item.id}
                  elem={
                    <PlayListTrackItem
                      item={item}
                      isPlaying={isPlaying}
                      currentTrackUrl={currentTrack?.url}
                      key={item.url}
                      onClick={() => onItemPlayButtonClickHandler(item, tracks)}
                      onDeleteClick={() => handleDeleteItem(item)}
                    />
                  }
                  item={item}
                  onDelete={handleDelete}
                />
              ))}
            </List>
          </SortableContext>
        </DndContext>

        {items.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {"Список пуст. Добавьте музыку из раздела \"Поиск музыки\""}
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
};