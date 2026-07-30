import { Box, Slider } from "@mui/material";
import { useMemo, useCallback } from "react";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";

import { useAudioStore } from "@/app/store/useAudioPlayerState.ts";

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

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <Box sx={{
      width: "100%",
      padding: {
        md: "0 5rem",
        xs: "0 2.5rem 0 2.5rem",
      },
    }}>
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        // justifyContent: "center", /* Горизонтальное выравнивание (опционально) */
        height: isIOS ? "1px" : "40px", /* Задайте нужную высоту контейнеру */
      }}>
        <Box sx={{
          minHeight: "65px",
          display: "flex",
          alignItems: "center", /* Центрирует элементы по вертикали */
          justifyContent: "center",
        }}>

          {!isIOS &&
            <>
              <VolumeDownIcon color="primary" />
              <Slider defaultValue={defaultVolume} min={0} max={100}
                      sx={{
                        margin: "0 0.8rem",
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
            </>
          }
        </Box>
      </Box>
      <Box sx={{ height: isIOS ? "1.2rem" : "2rem" }}></Box>
    </Box>
  );
};

// const isIOS = () => {
//   // Регулярное выражение для поиска ключевых слов iPhone, iPad или iPod в строке User-Agent
//   return /iPad|iPhone|iPod/.test(navigator.userAgent);
// };