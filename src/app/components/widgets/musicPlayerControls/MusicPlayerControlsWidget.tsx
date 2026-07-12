import React from "react";
import { Box, Stack } from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";

import { useAudioStore } from "@/app/store/useAudioPlayerState.ts";
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

export const MusicPlayerControlsWidget = () => {
  const state = useAudioStore();

  const onNextHandler = () => {
    state.next();
  };

  const handleShuffleClick = () => {
    state.toggleShuffle();

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

  return (
    <Box id="controls"
         sx={{
           height: "27vh",
           backgroundColor: "#222222",
           flexShrink: 0,
           margin: "0 auto",
           maxWidth: "1200px",
           width: "100%",
         }}>
      <Stack spacing={1}>
        <Stack>
          <AudioProgress
            currentTime={state.currentTime}
            duration={state.duration}
            onChangeProgress={onChangeProgress}
          />
        </Stack>
        <Box>{state.currentTrack?.title ?? "-"}</Box>
        <Stack direction={"row"} sx={{
          alignItems: "center",
          justifyContent: "space-around",
          pb: 2,
        }}>
          <AutorenewRoundedIcon fontSize="large"/>
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

