import React from "react";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";
import { Box, Stack, Button, ListItem, useTheme, Typography, ListItemText, ListItemButton } from "@mui/material";

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

const topBorderColor = "#353535";

export const MusicPlayerControlsWidget = () => {

  const state = useAudioStore();

  // const { updatePositionState, setPlaybackState } = useMediaSession({
  //   title: state.currentTrack?.title,
  //   artwork: [
  //     { src: '/cover-512x512.png', sizes: '512x512', type: 'image/png' },
  //     { src: '/cover-192x192.png', sizes: '192x192', type: 'image/png' },
  //   ],
  //   onPlay: () => {
  //     state.play();
  //     setPlaybackState('playing');
  //   },
  //   onPause: () => {
  //     state.pause();
  //     setPlaybackState('paused');
  //   },
  //   onNext: () => {
  //     // Логика переключения на следующий трек
  //     console.log('Next track');
  //   },
  //   onPrev: () => {
  //     // Логика переключения на предыдущий трек
  //     console.log('Prev track');
  //   },
  //   onSeek: (time) => {
  //     console.log(time);
  //     // if (audioRef.current) {
  //     //   audioRef.current.currentTime = time;
  //     // }
  //   },
  // })

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
    // updatePositionState(state.duration, 1)
  };

  const handleExpandedClick = () => {
    state.toggleControlsExpanded();
  };

  const currentPosition = state.getCurrentPlaylist().findIndex(track => track === state.currentTrack);
  const trackPosition = `${currentPosition + 1} / ${state.getCurrentPlaylist().length}`;

  // useEffect(() => {
  //   const audio = state.currentTrack?.audioElem;
  //   if (!audio) return;
  //
  //   const updatePosition = () => {
  //     if (audio.duration && !isNaN(audio.duration)) {
  //       // updatePositionState(audio.duration, audio.currentTime);
  //     }
  //   };
  //
  //   // 🔥 Критично: вызываем ОДИН РАЗ, когда аудио загрузилось (ещё ДО нажатия Play)
  //   const handleLoadedMetadata = () => {
  //     if (audio.duration && !isNaN(audio.duration)) {
  //       updatePositionState(audio.duration, 0);
  //       console.log('Duration set for iOS:', audio.duration);
  //     }
  //   };
  //
  //   audio.addEventListener('loadedmetadata', handleLoadedMetadata);
  //
  //   // Если метаданные уже загружены — вызываем сразу
  //   if (audio.readyState >= 1) {
  //     handleLoadedMetadata();
  //   }
  //
  //   // Обновляем во время игры
  //   const interval = setInterval(updatePosition, 1000);
  //   audio.addEventListener('timeupdate', updatePosition);
  //
  //   return () => {
  //     clearInterval(interval);
  //     audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
  //     audio.removeEventListener('timeupdate', updatePosition);
  //   };
  // }, [updatePositionState]);


  if (!state.isControlsExpanded) {

    return <Box id="controls-unexpanded">
      <ListItem disablePadding sx={{
        padding: {
          lg: "0 4px"
        },
        maxWidth: "lg",
        margin: "0 auto",
      }}>
        <ListItemButton sx={{
          borderRadius: 0,
          borderTop: `${topBorderColor} solid 1px`,
          borderBottom: `${topBorderColor} solid 1px`,
          borderLeft: {
            lg: `${topBorderColor} solid 1px`,
          },
          borderRight: {
            lg: `${topBorderColor} solid 1px`,
          },
          paddingLeft: {
            xs: "4px",
            md: "1.1rem",
          },
          display: "flex",
          gap: 1,
          minWidth: 0,
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
                            }} />
            </TextRunner>
          </Box>
          <Stack spacing={1} direction={"row"} sx={{
            flex: "0 0 auto",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
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
  const timeLeft = duration - currentTime;
  return (
    <Box id="controls-expanded"
         sx={{
           borderTop: `${topBorderColor} solid 1px`,
           borderBottom: `${topBorderColor} solid 1px`,
           // borderLeft: `${topBorderColor} solid 1px`,
           // borderRight: `${topBorderColor} solid 1px`,
           backgroundColor: "#222222",
           width: "100%",
         }}>
      <Box sx={{
        margin: "0 auto",
        maxWidth: "1200px",
      }}>
        <Box onClick={handleExpandedClick} sx={{
          cursor: "pointer",
          "&:hover .MuiButton-root": {
            backgroundColor: "action.active",
            // margin: "0 auto",
          },
        }}>
          <Button
            id="expand"
            size="medium"
            sx={{
              width: "1rem",
              backgroundColor: topBorderColor,
              mb: 2, borderRadius: 0.3,
            }}>
          </Button>
        </Box>
        <Stack spacing={0.2}>

          <Box sx={{
            display: "flex", justifyContent: "space-between", mt: 2, gap: 2, alignItems: "center",
            width: "100%",
            padding: {
              md: "0 5rem",
              xs: "0 2.5rem",
            },

          }}>

            <TextRunner align="center">
              <Typography id="trackRoadText" variant="inherit">
                {state.currentTrack?.title ?? "-"}
              </Typography>
            </TextRunner>

          </Box>
          <AudioProgress
            currentTime={currentTime}
            duration={duration}
            onChangeProgress={onChangeProgress}
          />
          <Box sx={{
            display: "flex", justifyContent: "space-between", mt: 2, gap: 2, alignItems: "center",
            width: "100%",
            padding: {
              md: "0 5rem",
              xs: "0 2.5rem",
            },
          }}>
            <Typography variant="caption">
              {formatTime(currentTime)}
            </Typography>
            <Typography variant="caption">
              {trackPosition ?? "-"}
            </Typography>
            <Typography variant="caption">
              {formatTime(timeLeft)}
            </Typography>
          </Box>

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
    </Box>
  );
};

