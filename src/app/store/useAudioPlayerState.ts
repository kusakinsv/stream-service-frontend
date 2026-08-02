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
  //mediaSession
  updateMetadata: (track: AudioTrackData, playlist: AudioTrackData[], playlistName: null | string) => void;

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
    isControlsExpanded: false,


    setCurrentTrack: (track, ofPlaylist) => {
      const {
        currentTrack,
        audioRef: currentRef,
        progressTo,
        setCurrentPlaylist,
        updateMetadata,
        play,
        pause,
        next,
        prev,
        volume,
      } = get();


      const newAudioRef = track.audioElem;

      const updateProgress = (seekTime: number | undefined, track: AudioTrackData) => {
        if (seekTime !== undefined && track?.duration !== undefined) {
          const progress = seekTime * 100 / currentDuration;
          progressTo(progress);
        }
      };

      const currentDuration = track.duration ?? 0;
      const eventListenerControlsFunc = () => {
        navigator.mediaSession.setActionHandler("play", play);
        navigator.mediaSession.setActionHandler("pause", pause);
        navigator.mediaSession.setActionHandler("previoustrack", prev);
        navigator.mediaSession.setActionHandler("nexttrack", next);
        navigator.mediaSession.setActionHandler("seekto", (details) => updateProgress(details.seekTime, track));
      };

      //если уже играет трек, то ставим ему паузу и сбрасываем прогресс
      if (currentTrack !== track && currentRef) {
        currentRef.pause();
        progressTo(0);
      }


      currentTrack?.audioElem?.removeEventListener("playing", eventListenerControlsFunc);

      updateMetadata(track, ofPlaylist, null);

      track.audioElem?.addEventListener("playing", eventListenerControlsFunc);



      set({
        error: null,
        currentTime: 0,
        isPlaying: false,
        currentTrack: track,
        audioRef: track.audioElem,
        duration: track.duration ?? 0,
      });
      setCurrentPlaylist(ofPlaylist);


      if (newAudioRef) {
        newAudioRef.volume = volume / 100;
        newAudioRef.onended = () => {
          get().handleTrackEnd();
        };
        newAudioRef.ontimeupdate = () => {
          set({ currentTime: newAudioRef.currentTime });
        };

        newAudioRef.play()
          .then(() => {
            navigator.mediaSession.playbackState = "playing";
            set({ isPlaying: true });

          })
          .catch((error) => {
            console.error("Ошибка воспроизведения", error);
            set({
              isPlaying: false,
              error: "Ошибка воспроизведения",
            });
          });
      }
    },

    play: () => {
      const { audioRef } = get();
      if (audioRef) {
        audioRef.play();
        set({ isPlaying: true });
        navigator.mediaSession.playbackState = "playing";
      }
    },

    pause: () => {
      const { audioRef } = get();
      if (audioRef) {
        audioRef.pause();
        set({ isPlaying: false });
        navigator.mediaSession.playbackState = "paused";
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
        console.log(progressToValue);
        set({ currentTime: progressToValue });
      }
    },

    updateProgress: () => {
      const { audioRef } = get();
      if (audioRef) {
        set({ currentTime: audioRef.currentTime });
        if ("mediaSession" in navigator && audioRef.duration && !isNaN(audioRef.duration)) {
          navigator.mediaSession.setPositionState({
            duration: audioRef.duration,
            playbackRate: audioRef.playbackRate,
            position: audioRef.currentTime,
          });
        }
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
          if (!nextTrack.isValid && currentIndex + 1 < getCurrentPlaylist().length) {
            next();
          }
        } else {
          if (repeatType === RepeatType.PLAYLIST) {
            setCurrentTrack(getCurrentPlaylist()[0], getCurrentPlaylist());
          }
        }
      }
    },

    prev: () => {
      const { getCurrentPlaylist, currentTrack, setCurrentTrack, repeatType, prev } = get();
      if (currentTrack) {
        const currentIndex = getCurrentPlaylist().indexOf(currentTrack);
        if (currentIndex !== 0) {
          const prevTrack = getCurrentPlaylist()[currentIndex - 1];
          setCurrentTrack(prevTrack, getCurrentPlaylist());
          if (!prevTrack.isValid && currentIndex !== 0) {
            prev();
          }
        } else {
          if (repeatType === RepeatType.PLAYLIST) {
            setCurrentTrack(getCurrentPlaylist()[getCurrentPlaylist().length - 1], getCurrentPlaylist());
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
      const { isControlsExpanded } = get();
      set({
        isControlsExpanded: !isControlsExpanded,
      });
    },

    updateMetadata: (track: AudioTrackData, playlist: AudioTrackData[], playlistName: null | string) => {
      const currentIndex = playlist.indexOf(track);
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        album: `${currentIndex + 1} / ${playlist.length} ${playlistName !== null ? playlistName : ""}`,
        artwork: [
          { src: "/favicon.ico", sizes: "96x96", type: "image/x-icon" },
        ],
      });
    },
  })),
);