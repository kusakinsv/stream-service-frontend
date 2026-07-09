import { create } from "zustand/react";
import { subscribeWithSelector } from "zustand/middleware";

import type { AudioTrackData } from "@/app/types.ts";


interface AudioPlayerState {
  isPlaying: boolean;
  currentTrack: null | AudioTrackData;
  audioRef: null | HTMLAudioElement;
  volume: number;
  duration: number;
  currentTime: number;
  error: null | string;
  currentPlaylist: AudioTrackData[];

  reset: () => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  togglePlay: () => void;

  handleTrackEnd: () => void;
  progressTo: (time: number) => void;
  updateProgress: () => void;

  setCurrentTrack: (track: AudioTrackData, ofPlayList: AudioTrackData[]) => void;
  setCurrentPlaylist: (playlist: AudioTrackData[]) => void;
  setVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioPlayerState>()(
  subscribeWithSelector((set, get) => ({
    volume: Number.parseFloat(localStorage.getItem("audio_volume") ?? "0.6") ??  0.6,
    duration: 0,
    error: null,
    currentTime: 0,
    audioRef: null,
    isPlaying: false,
    currentTrack: null,
    currentPlaylist: [],


    setCurrentTrack: (track, ofPlaylist) => {
      const { currentTrack, audioRef: currentRef, progressTo } = get();

      // если уже играет трек, то ставим ему паузу и сбрасываем прогресс
      if (currentTrack !== track && currentRef) {
        currentRef.pause();
        progressTo(0);
      }

      set({
        error: null,
        currentTime: 0,
        isPlaying: false,
        currentTrack: track,
        audioRef: track.audioElem,
        duration: track.duration ?? 0,
        currentPlaylist: ofPlaylist,
      });

      const { audioRef , volume} = get();
      if (audioRef) {
        audioRef.volume = volume/100;
        audioRef.onended = () => {
          get().handleTrackEnd();
        };
        audioRef.ontimeupdate = () => {
          set({ currentTime: audioRef.currentTime });
        };

        audioRef.play().catch((error) => {
          console.error("Ошибка воспроизведения", error);
          set({
            isPlaying: false,
            error: "Ошибка воспроизведения",
          });
        });
        set({ isPlaying: true });
      }
    },

    play: () => {
      const { audioRef } = get();
      if (audioRef) {
        audioRef.play();
        set({ isPlaying: true });
      }
    },

    pause: () => {
      const { audioRef } = get();
      if (audioRef) {
        audioRef.pause();
        set({ isPlaying: false });
      }
    },

    togglePlay: () => {
      const { isPlaying, play, pause, audioRef } = get();
      if (audioRef) {
        if (isPlaying) {
          pause();
        } else {
          play();
        }
      }
    },

    progressTo: (time: number) => {
      const { audioRef, duration } = get();
      if (audioRef && duration) {
        const progressEnd = duration / 100.00;
        const progressToValue = progressEnd * time;
        // console.log(duration + " " + progressToValue);
        audioRef.currentTime = progressToValue;
        set({ currentTime: progressToValue });
      }
    },

    updateProgress: () => {
      const { audioRef } = get();
      if (audioRef) {
        set({ currentTime: audioRef.currentTime });
      }
    },

    setVolume: (volume) => {
      const { audioRef } = get();
      const refVolume = Math.max(0, Math.min(1, volume/100));
      if (audioRef) audioRef.volume = refVolume;
      set({ volume: volume });

      // Сохраняем громкость в localStorage
      localStorage.setItem("audio_volume", String(volume));
    },

    handleTrackEnd: () => {
      set({
        isPlaying: false,
        currentTime: 0,
      });
      console.log("конец воспроизведения");
      // Здесь добавить логику для следующего трека
    },

    reset: () => {
      const { audioRef } = get();
      if (audioRef) {
        audioRef.pause();
        audioRef.src = "";
      }
      set({
        currentTrack: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        error: null,
      });
    },

    setCurrentPlaylist: (playlist) => {
      set({
        currentPlaylist: playlist,
      });
    },

    next: () => {
      const { currentPlaylist, currentTrack, setCurrentTrack} = get();

      if (currentTrack) {
        const currentIndex = currentPlaylist.indexOf(currentTrack);
        if (currentIndex + 1 < currentPlaylist.length) {
          setCurrentTrack(currentPlaylist[currentIndex + 1], currentPlaylist);
        }
      }
    },

    prev: () => {
      const { currentPlaylist, currentTrack, setCurrentTrack} = get();

      if (currentTrack) {
        const currentIndex = currentPlaylist.indexOf(currentTrack);
        if (currentIndex !== 0) {
          setCurrentTrack(currentPlaylist[currentIndex-1], currentPlaylist);
        }
      }

    }

  })),
);