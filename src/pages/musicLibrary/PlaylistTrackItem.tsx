import PauseIcon from "@mui/icons-material/Pause";
import { Box, Stack, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import type { AudioTrackData } from "@/app/types.ts";

import { getColors } from "@/app/theme/colors.ts";
import { TextRunner } from "@/app/components/TextRunner/TextRunner.tsx";
import { CircleButton } from "@/app/components/button/ItemButton/CircleButton.ts";

interface ITrackItemProps {
  item: AudioTrackData;
  isPlaying: boolean;
  currentTrackUrl: string | undefined;
  onClick?: () => void;
  onDeleteClick: (item: AudioTrackData) => void;
}

export const PlaylistTrackItem = (
  { item, isPlaying, currentTrackUrl, onClick, onDeleteClick }: ITrackItemProps) => {

  const formattedDuration = item.duration ? formatDuration(item.duration) : "--:--";

  const sxInvalid = { color: "grey", whiteSpace: 'nowrap'};

  return (
    <Box sx={{
      borderRadius: "4px",
      margin: "0 0 0.4rem 0",
      padding: "0.3rem 1rem 0.3rem 1rem",
      backgroundColor: getColors().grey.panelsDark,
    }}>
      <Stack spacing={2} direction="row" sx={{
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Stack spacing={2} direction="row" sx={{
          flex: "1 1 auto",
          minWidth: 0,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "flex-start",
        }}>
          <CircleButton disabled={!item.isValid} onClick={onClick}>
            {(currentTrackUrl === item.url && isPlaying) ? <PauseIcon /> : <PlayArrowIcon />}
          </CircleButton>
            <Box sx={!item.isValid ? sxInvalid : {}}>
              {item.isValid ?
                (<TextRunner speed={8}>
                  {item.title}
                </TextRunner>)
                : item.title}
            </Box>
        </Stack>
        <Box sx={!item.isValid ? sxInvalid : {color: "text.secondary"}}>
          {formattedDuration}
        </Box>
        <IconButton onClick={() => onDeleteClick(item)}>
          <DeleteForeverIcon fontSize="large" sx={{
            color: "grey.500",
            "&:hover": {
              // backgroundColor: "red",
              color: getColors().red.error,
            },
          }} />
        </IconButton>
      </Stack>
    </Box>
  );
};

const formatDuration = (seconds: number): string => {
  if (isNaN(seconds)) return "00:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${paddedMinutes}:${paddedSeconds}`;
};