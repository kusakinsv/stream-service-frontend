import { useRef, useEffect, useCallback } from "react";

interface MediaSessionProps {
  title?: string;
  artist?: string;
  album?: string;
  artwork?: { src: string; sizes: string; type: string }[];
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek?: (time: number) => void;
}

export const useMediaSession = (props: MediaSessionProps) => {
  const {
    title,
    artist,
    album = "",
    artwork = [],
    onPlay,
    onPause,
    onNext,
    onPrev,
    onSeek,
  } = props;

  const isInitialized = useRef(false);

  const updateMetadata = useCallback(() => {
    // if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist,
        album,
        artwork: artwork.length > 0 ? artwork : [
          { src: "/favicon.ico", sizes: "96x96", type: "image/x-icon" },
        ],
      });
    // }
  }, [title, artist, album, artwork]);

  const setupHandlers = useCallback(() => {
    if (!("mediaSession" in navigator)) return;

    const session = navigator.mediaSession;

    session.setPositionState({
      duration: 180, // обновите при загрузке аудио
      playbackRate: 1,
      position: 0,
    });

    // Базовые действия (обязательны для блок-экрана)
    session.setActionHandler("play", () => {
      onPlay();
    });

    session.setActionHandler("pause", () => {
      onPause();
    });

    // Опционально: переключение треков
    // session.setActionHandler("nexttrack", () => {
    //   onNext();
    // });
    //
    //
    // session.setActionHandler("previoustrack", () => {
    //   onPrev();
    // });


    // Опционально: перемотка
    if (onSeek) {
      session.setActionHandler("seekto", (details) => {
        if (details.seekTime !== undefined) {
          onSeek(details.seekTime);
        }
      });
    }

    // Обязательно: включаем поддержку позиции (для ползунка на блок-экране)

  }, [onPlay, onPause, onNext, onPrev, onSeek]);

  // Инициализация
  useEffect(() => {
    if (!("mediaSession" in navigator)) {
      console.warn("Media Session API не поддерживается в этом браузере");
      return;
    }

    if (!isInitialized.current) {
      updateMetadata();
      setupHandlers();
      isInitialized.current = true;
    }

    // Обновляем метаданные при изменении трека
    updateMetadata();

    // Cleanup: сбрасываем обработчики при размонтировании
    return () => {
      if ("mediaSession" in navigator) {
        const session = navigator.mediaSession;
        session.setActionHandler("play", null);
        session.setActionHandler("pause", null);
        session.setActionHandler("nexttrack", null);
        session.setActionHandler("previoustrack", null);
        session.setActionHandler("seekto", null);
      }
    };
  }, [updateMetadata, setupHandlers]);

  // Функция для обновления позиции (вызывать при воспроизведении)
  const updatePositionState = useCallback((duration: number, position: number) => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setPositionState({
        duration,
        playbackRate: 1,
        position,
      });
    }
  }, []);

  // Управление состоянием: активно / неактивно (для отображения кнопок на блок-экране)
  const setPlaybackState = useCallback((state: "none" | "paused" | "playing") => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = state;
    }
  }, []);

  return { updatePositionState, setPlaybackState };
};