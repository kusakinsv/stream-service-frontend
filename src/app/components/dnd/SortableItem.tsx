import { CSS } from "@dnd-kit/utilities";
import React, { type ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { Box, Paper, ListItem } from "@mui/material";

import type { DraggableItem } from "@/app/components/dnd/types.ts";

import { getColors } from "@/app/theme/colors.ts";

interface SortableItemProps<T> {
  item: DraggableItem<T>;
  onDelete: (id: string) => void;
  elem: ReactNode;
}

export const SortableItem = ({ item, elem, onDelete }: SortableItemProps<unknown>) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      elevation={isDragging ? 4 : 1}
      sx={{
        mb: 1,
        "&:hover": {
          backgroundColor: getColors().grey.light,
        },
      }}
      {...attributes}
      {...listeners}
    >
      {elem}
    </Paper>
  );
};