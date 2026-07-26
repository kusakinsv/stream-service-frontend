import PauseIcon from "@mui/icons-material/Pause";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Box, Stack, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import type { AudioTrackData } from "@/app/types.ts";

import { getColors } from "@/app/theme/colors.ts";
import { CircleButton } from "@/app/components/button/ItemButton/CircleButton.ts";

interface ITrackItemProps {
  item: AudioTrackData;
  isPlaying: boolean;
  currentTrackUrl: string | undefined;
  onPlayClick?: () => void;
  onAddClick: (item: AudioTrackData) => void;
}

export const SearchTrackItem = (
  { item, isPlaying, currentTrackUrl, onPlayClick, onAddClick }: ITrackItemProps) => {

  const formattedDuration = item.duration ? formatDuration(item.duration) : "--:--";

  const sxInvalid = { color: "grey" };

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
          alignItems: "center",
          justifyContent: "flex-start",
        }}>
          <CircleButton disabled={!item.isValid} onClick={onPlayClick}>
            {(currentTrackUrl === item.url && isPlaying) ? <PauseIcon /> : <PlayArrowIcon />}
          </CircleButton>
          <Stack spacing={2} direction="row" sx={{
            justifyContent: "space-between",
          }}>
            <Box sx={!item.isValid ? sxInvalid : {}}>
              {item.title}
            </Box>
            <Box sx={!item.isValid ? sxInvalid : {}}>
              {formattedDuration}
            </Box>
          </Stack>
        </Stack>
        <IconButton onClick={() => onAddClick(item)}>
          <AddBoxIcon fontSize={"large"} sx={{
            color: "grey.500",
            "&:hover": {
              color: getColors().blue.main,
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