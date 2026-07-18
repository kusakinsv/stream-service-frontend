import { create } from "zustand/react";
import { subscribeWithSelector } from "zustand/middleware";

import type { AudioTrackData } from "@/app/types.ts";

import { shufflePlaylist } from "@/app/utils/utils.ts";


export enum RepeatType {
  NONE,
  PLAYLIST,
  SINGLE,
}

interface AudioPlayerState {
  isPlaying: boolean;
  currentTrack: null | AudioTrackData;
  audioRef: null | HTMLAudioElement;
  volume: number;
  duration: number;
  currentTime: number;
  error: null | string;
  normalState: AudioTrackData[];
  shuffledState: AudioTrackData[];
  repeatType: RepeatType;
  isShuffle: boolean;
  isControlsExpanded: boolean;

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
  toggleShuffle: () => void;
  setShuffledState: (playlist: AudioTrackData[]) => void;
  clearShuffleState: () => void;
  toggleRepeat: () => void;
  getCurrentPlaylist: () => AudioTrackData[];
  toggleControlsExpanded: () => void;
}

export const useAudioStore = create<AudioPlayerState>()(
  subscribeWithSelector((set, get) => ({
    volume: Number.parseFloat(localStorage.getItem("audio_volume") ?? "0.6") ?? 0.6,
    duration: 0,
    error: null,
    currentTime: 0,
    audioRef: null,
    isPlaying: false,
    currentTrack: null,
    normalState: [],
    shuffledState: [],
    repeatType: RepeatType.NONE,
    isShuffle: false,
    isControlsExpanded: true,


    setCurrentTrack: (track, ofPlaylist) => {
      const { currentTrack, audioRef: currentRef, progressTo, setCurrentPlaylist } = get();

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
        // currentPlaylist: ofPlaylist,
      });
      setCurrentPlaylist(ofPlaylist);

      const { audioRef, volume } = get();
      if (audioRef) {
        audioRef.volume = volume / 100;
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
      const refVolume = Math.max(0, Math.min(1, volume / 100));
      if (audioRef) audioRef.volume = refVolume;
      set({ volume: volume });

      localStorage.setItem("audio_volume", String(volume));
    },

    handleTrackEnd: () => {
      const { next, getCurrentPlaylist, currentTrack, repeatType, setCurrentTrack, isShuffle, shuffledState } = get();
      const index = getCurrentPlaylist().findIndex(item => item.url === (currentTrack ? currentTrack.url : -1));
      if (repeatType === RepeatType.SINGLE) {
        setCurrentTrack(currentTrack ?? getCurrentPlaylist()[0], getCurrentPlaylist());
      } else {
        if (index != getCurrentPlaylist().length - 1) {
          next();
        } else {
          if (repeatType === RepeatType.PLAYLIST) {
            setCurrentTrack(isShuffle ? shuffledState[0] : getCurrentPlaylist()[0], getCurrentPlaylist());
          } else {
            set({
              isPlaying: false,
              currentTime: 0,
            });
          }
        }
      }
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
      const { isShuffle } = get();
      if (isShuffle) {
        set({
          shuffledState: playlist,
        });
      } else {
        set({
          normalState: playlist,
        });
      }

    },

    next: () => {
      const { getCurrentPlaylist, currentTrack, setCurrentTrack, repeatType, next } = get();
      if (currentTrack) {
        const currentIndex = getCurrentPlaylist().indexOf(currentTrack);
        if (currentIndex + 1 < getCurrentPlaylist().length) {
          const nextTrack = getCurrentPlaylist()[currentIndex + 1];
          setCurrentTrack(nextTrack, getCurrentPlaylist());
          if (!nextTrack.isValid) {
            if (currentIndex + 1 < getCurrentPlaylist().length) {
              next();
            }
          }
        } else {
          if (repeatType === RepeatType.PLAYLIST) {
            setCurrentTrack(getCurrentPlaylist()[0], getCurrentPlaylist());
          }
        }
      }
    },

    prev: () => {
      const { getCurrentPlaylist, currentTrack, setCurrentTrack, repeatType , prev} = get();
      if (currentTrack) {
        const currentIndex = getCurrentPlaylist().indexOf(currentTrack);
        if (currentIndex !== 0) {
        const prevTrack = getCurrentPlaylist()[currentIndex - 1]
          setCurrentTrack(prevTrack, getCurrentPlaylist());
          if (!prevTrack.isValid) {
            if (currentIndex !== 0) {
              prev();
            }
          }
        } else {
          if (repeatType === RepeatType.PLAYLIST) {
            setCurrentTrack(getCurrentPlaylist()[getCurrentPlaylist().length-1], getCurrentPlaylist());
          }
        }
      }
    },

    toggleShuffle: () => {
      const { isShuffle, normalState } = get();
      if (!isShuffle) {
        set({
          isShuffle: true,
          shuffledState: shufflePlaylist(normalState),
        });
      } else {
        set({
          isShuffle: false,
          shuffledState: [],
        });
      }
    },

    setShuffledState: (playlist) => {
      set({
        shuffledState: playlist,
      });
    },

    clearShuffleState: () => {
      set({
        shuffledState: [],
      });
    },

    toggleRepeat: () => {
      const { repeatType } = get();
      if (repeatType === RepeatType.NONE) {
        set({
          repeatType: RepeatType.PLAYLIST,
        });
      } else if (repeatType === RepeatType.PLAYLIST) {
        set({
          repeatType: RepeatType.SINGLE,
        });
      } else {
        set({
          repeatType: RepeatType.NONE,
        });
      }
    },

    getCurrentPlaylist: () => {
      const { isShuffle, normalState, shuffledState } = get();
      if (isShuffle) return shuffledState;
      else return normalState;
    },

    toggleControlsExpanded: () => {
      const {isControlsExpanded} = get();
      set({
        isControlsExpanded: !isControlsExpanded,
      });
    },

  })),
);