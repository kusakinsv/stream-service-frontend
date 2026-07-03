import { useMemo, useCallback } from "react";
import { Box, Stack, Slider } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";

import { useAudioStore } from "@/app/store/GlobalPlayerStore/useAudioPlayerState.ts";

export const VolumeControl = () => {
  const { setVolume, audioRef, volume } = useAudioStore();
  const defaultVolume = useMemo<number>(() => volume, []);

  const handleDragChange = useCallback((_: Event, value: number) => {
    if (audioRef != null) {
      audioRef.volume = value / 100;
    }
  }, [audioRef]);

  const handleDragEnd = (_: Event, volume: number) => {
    setVolume(volume);
  };


  return (
    <Box sx={{
      width: "100%",
      padding: {
        md: "0 5rem",
        xs: "0 2.5rem",
      },
    }}>
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        // justifyContent: "center", /* Горизонтальное выравнивание (опционально) */
        height: " 40px", /* Задайте нужную высоту контейнеру */
      }}>
        <Box sx={{
          minHeight: "50px",
          // width: "18rem",
          // position.: "relative",
          display: "flex",
          alignItems: "center", /* Центрирует элементы по вертикали */
          justifyContent: "center",
        }}>
          <Stack spacing={1.5} direction="row">
          <VolumeDownIcon color="primary" />
          <Slider defaultValue={defaultVolume} min={0} max={100}
                  sx={{
                    margin: "0 auto",
                    bottom: 0,
                    left: 0,
                    height: 3,
                    padding: "0.7rem 0",
                    width: "10rem",
                    // paddingBottom: "1px",
                    // "& .MuiSlider-track": { display: "none" },
                    // "& .MuiSlider-rail": { display: "none" },
                    "& .MuiSlider-thumb": { width: "1rem", height: "1rem" },
                  }}
                  onChange={(_, v) => handleDragChange(_, v as number)}
            /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
            // @ts-expect-error
                  onChangeCommitted={(_, v) => handleDragEnd(_, v as number)}
            // onTouchEnd={() => handleDragEnd}
          >
          </Slider>
          <VolumeUpIcon color="primary" />
          </Stack>
        </Box>

      </Box>
      <Box sx={{ height: "2rem" }}></Box>
      {/*<Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, width: "60%", }}>*/}
      {/*  <Typography variant="caption">*/}
      {/*    /!*{formatTime(currentTime)}*!/*/}
      {/*  </Typography>*/}
      {/*  <Typography variant="caption">*/}
      {/*    {volumeLevel}*/}
      {/*  </Typography>*/}
      {/*</Box>*/}
    </Box>
  );
};