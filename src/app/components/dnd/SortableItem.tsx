import { Paper } from "@mui/material";
import { CSS } from "@dnd-kit/utilities";
import React, { type ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";

import type { DraggableItem } from "@/app/components/dnd/types.ts";

import { getColors } from "@/app/theme/colors.ts";

interface SortableItemProps<T> {
  item: DraggableItem<T>;
  elem: ReactNode;
}

export const SortableItem = ({ item, elem}: SortableItemProps<unknown>) => {
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