import React from "react";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";
import { Box, Stack, Button, useTheme, ListItem, Typography, ListItemText, ListItemButton } from "@mui/material";

import { formatTime } from "@/app/utils/utils.ts";
import { RepeatIcon } from "@/app/components/icons/RepeatIcon.tsx";
import { TextRunner } from "@/app/components/TextRunner/TextRunner.tsx";
import { RepeatType, useAudioStore } from "@/app/store/useAudioPlayerState.ts";
import { AudioProgress } from "@/app/components/widgets/musicPlayerControls/components/AudioProgress.tsx";
import { VolumeControl } from "@/app/components/widgets/musicPlayerControls/components/VolumeControl.tsx";

const sxIconsArrow = {
  fontSize: "3rem",
  cursor: "pointer",
};

const sxIconsPlayPause = {
  fontSize: "4rem",
  cursor: "pointer",
};

const unExpandedControls = {
  fontSize: "2.5rem",
  cursor: "pointer",
};

export const MusicPlayerControlsWidget = () => {
  const state = useAudioStore();
  const theme = useTheme();
  const activeColor = theme.palette.action.active;
  const disabledColor = theme.palette.action.disabled;

  const onNextHandler = () => {
    state.next();
  };

  const handleShuffleClick = () => {
    state.toggleShuffle();
  };

  const handleRepeatClick = () => {
    state.toggleRepeat();
  };

  const timerRef = React.useRef(0);
  const handleClickPrev = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      state.progressTo(0);
    }, 200);
  };

  const handleDoubleClickPrev = () => {
    clearTimeout(timerRef.current);
    state.prev();
  };

  const onChangeProgress = (value: number) => {
    state.progressTo(value);
  };

  const handleExpandedClick = () => {
    state.toggleControlsExpanded();
  };

  const currentPosition = state.getCurrentPlaylist().findIndex(track => track === state.currentTrack);
  const trackPosition = `${currentPosition + 1} / ${state.getCurrentPlaylist().length}`;

  if (!state.isControlsExpanded) {

    return <Box id="controls-unexpanded">
      <ListItem disablePadding sx={{
        maxWidth: "lg",
        margin: "0 auto",
      }}>
        <ListItemButton sx={{
          paddingLeft: {
            xs: "4px",
            md: "1.1rem"
          },
          margin: "0 3.2px",
          display: "flex",
          gap: 1,
          minWidth: 0, // Важно для сжатия
        }}>
          <Box sx={{
            flex: "1 1 auto",
            minWidth: 0,
            overflow: "hidden",
            justifyContent: "space-between",

          }} onClick={handleExpandedClick}>
            <TextRunner speed={8}>
              <ListItemText primary={state.currentTrack?.title ?? "-"}
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                            }}/>
            </TextRunner>
          </Box>
          <Stack spacing={1} direction={"row"} sx={{
            flex: "0 0 auto",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0, // Запрещаем сжатие
          }}>
            <SkipPreviousRoundedIcon sx={unExpandedControls} onClick={handleClickPrev}
                                     onDoubleClick={handleDoubleClickPrev} />
            {state.isPlaying
              ? <PauseIcon sx={unExpandedControls} onClick={() => state.pause()} />
              : <PlayArrowIcon sx={unExpandedControls} onClick={() => state.play()} />}

            <SkipNextRoundedIcon sx={unExpandedControls} onClick={onNextHandler} />
          </Stack>

        </ListItemButton>
      </ListItem>
    </Box>;
  }

  const currentTime = state.currentTime;
  const duration = state.duration;
  const timeLeft = duration-currentTime
  return (
    <Box id="controls-expanded"
         sx={{
           backgroundColor: "#222222",
           // flexShrink: 0,
           margin: "0 auto",
           maxWidth: "1200px",
           width: "100%",
         }}>
      <Box onClick={handleExpandedClick} sx={{
        cursor: "pointer",
        "&:hover .MuiButton-root": {
          backgroundColor: "secondary.light",
        },
      }}>
        <Button
          id="expand"
          size="small"
          sx={{ width: "1rem", backgroundColor: "grey", mb: 2 }}>
        </Button>
      </Box>
      <Stack spacing={0.2}>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 , gap: 2, alignItems: "center",
            width: "100%",
            padding: {
            md: "0 5rem",
            xs: "0 2.5rem",
          },

          }}>
            <Typography variant="caption">
              {formatTime(currentTime)}
            </Typography>
            <TextRunner align="center">
              <Typography id="trackRoadText" variant="inherit">
                {state.currentTrack?.title ?? "-"}
              </Typography>
            </TextRunner>
            <Typography variant="caption">
              {formatTime(timeLeft)}
            </Typography>
          </Box>
        <AudioProgress
          currentTime={currentTime}
          duration={duration}
          onChangeProgress={onChangeProgress}
        />

        <Typography variant="caption">
          {trackPosition ?? "-"}
        </Typography>

        <Stack direction={"row"} sx={{
          alignItems: "center",
          justifyContent: "space-around",
        }}>
          <Box sx={{ cursor: "pointer" }} onClick={handleRepeatClick}>
            <RepeatIcon color={state.repeatType !== RepeatType.NONE ? activeColor : disabledColor}
                        single={state.repeatType === RepeatType.SINGLE} />
          </Box>
          <Stack spacing={2} direction={"row"} sx={{
            alignItems: "center",
            justifyContent: "center",
          }}>
            <SkipPreviousRoundedIcon sx={sxIconsArrow} onClick={handleClickPrev}
                                     onDoubleClick={handleDoubleClickPrev} />
            {state.isPlaying
              ? <PauseIcon sx={sxIconsPlayPause} onClick={() => state.pause()} />
              : <PlayArrowIcon sx={sxIconsPlayPause} onClick={() => state.play()} />}

            <SkipNextRoundedIcon sx={sxIconsArrow} onClick={onNextHandler} />
          </Stack>
          <ShuffleRoundedIcon
            cursor={"pointer"}
            color={state.isShuffle ? "action" : "disabled"}
            fontSize="large"
            onClick={handleShuffleClick}
          />
        </Stack>

        <VolumeControl />
      </Stack>
    </Box>
  );
};

