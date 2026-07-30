import type { AudioTrackData } from "@/app/types.ts";

import { useAudioStore } from "@/app/store/useAudioPlayerState.ts";

export class MediaSessionService {
  private static instance: MediaSessionService;
  private isSupported: boolean;
  private unsubscribe?: () => void;

  private constructor() {
    this.isSupported = 'mediaSession' in navigator;
  }

  static getInstance(): MediaSessionService {
    if (!MediaSessionService.instance) {
      MediaSessionService.instance = new MediaSessionService();
    }
    return MediaSessionService.instance;
  }

  // Инициализация: подписываемся на изменения стора
  init() {
    if (!this.isSupported) {
      console.warn('Media Session API не поддерживается');
      return;
    }

    // 🔥 Подписываемся на Zustand стор
    this.unsubscribe = useAudioStore.subscribe(
      (state) => state.currentTrack,
      (currentTrack, previousTrack) => {
        if (currentTrack && currentTrack !== previousTrack) {
          this.updateMetadata(currentTrack);
        }
      }
    );

    useAudioStore.subscribe(
      (state) => state.isPlaying,
      (isPlaying) => {
        this.updatePlaybackState(isPlaying);
      }
    );

    useAudioStore.subscribe(
      (state) => ({ currentTime: state.currentTime, duration: state.duration }),
      ({ currentTime, duration }) => {
        if (duration > 0) {
          this.updatePosition(duration, currentTime);
        }
      }
    );

    // Регистрируем обработчики кнопок
    // this.setupHandlers();

    // Если уже есть текущий трек - обновляем метаданные
    const { currentTrack, isPlaying, duration, currentTime } = useAudioStore.getState();
    if (currentTrack) {
      this.updateMetadata(currentTrack);
      this.updatePlaybackState(isPlaying);
      if (duration > 0) {
        this.updatePosition(duration, currentTime);
      }
    }
  }

  // Обновление метаданных трека
  public updateMetadata(track: AudioTrackData) {
    if (!this.isSupported) return;

    try {
      const metadata = new MediaMetadata({
        title: track.title || 'Без названия',
        artist: 'Неизвестный исполнитель',
        artwork: [
          { src: '/favicon.ico', sizes: '96x96', type: 'image/x-icon' }
        ],
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        type: 'music'
      });
      navigator.mediaSession.metadata = metadata;
    } catch (error) {
      console.error('Ошибка обновления метаданных:', error);
    }
  }

  // Обновление состояния Play/Pause
  private updatePlaybackState(isPlaying: boolean) {
    if (!this.isSupported) return;

    try {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    } catch (error) {
      console.error('Ошибка обновления состояния:', error);
    }
  }

  // Обновление позиции (для ползунка на блок-экране)
  private updatePosition(duration: number, currentTime: number) {
    if (!this.isSupported) return;

    try {
      navigator.mediaSession.setPositionState({
        duration,
        playbackRate: 1,
        position: currentTime,
      });
    } catch (error) {
      console.error('Ошибка обновления позиции:', error);
    }
  }

  // Регистрация обработчиков кнопок
  // private setupHandlers() {
  //   if (!this.isSupported) return;
  //
  //   const session = navigator.mediaSession;
  //
  //   // Play
  //   // session.setActionHandler('play', () => {
  //   //   console.log('[MediaSession] Play');
  //   //   useAudioStore.getState().play();
  //   // });
  //   //
  //   // // Pause
  //   // session.setActionHandler('pause', () => {
  //   //   console.log('[MediaSession] Pause');
  //   //   useAudioStore.getState().pause();
  //   // });
  //   //
  //   // // Next
  //   // session.setActionHandler("nexttrack", () => {
  //   //   console.log('[MediaSession] Next track');
  //   //   useAudioStore.getState().next();
  //   // });
  //   //
  //   // // Previous
  //   // session.setActionHandler("previoustrack", () => {
  //   //   console.log('[MediaSession] Previous track');
  //   //   useAudioStore.getState().prev();
  //   // });
  //
  //   // // Seek (перемотка)
  //   // session.setActionHandler('seekto', (details) => {
  //   //   if (details.seekTime !== undefined) {
  //   //     console.log('[MediaSession] Seek to:', details.seekTime);
  //   //     const { duration } = useAudioStore.getState();
  //   //     if (duration > 0) {
  //   //       const progress = (details.seekTime / duration) * 100;
  //   //       useAudioStore.getState().progressTo(progress);
  //   //     }
  //   //   }
  //   // });
  //
  //   // // Если нужно - можно добавить перемотку на +/- 15 секунд
  //   // session.setActionHandler('seekbackward', (details) => {
  //   //   console.log('[MediaSession] Seek backward:', details);
  //   //   const { currentTime, progressTo } = useAudioStore.getState();
  //   //   const newTime = Math.max(0, currentTime - (details.seekOffset || 15));
  //   //   const progress = (newTime / useAudioStore.getState().duration) * 100;
  //   //   progressTo(progress);
  //   // });
  //   //
  //   // session.setActionHandler('seekforward', (details) => {
  //   //   console.log('[MediaSession] Seek forward:', details);
  //   //   const { currentTime, duration, progressTo } = useAudioStore.getState();
  //   //   const newTime = Math.min(duration, currentTime + (details.seekOffset || 15));
  //   //   const progress = (newTime / duration) * 100;
  //   //   progressTo(progress);
  //   // });
  //
  //   if (session.metadata) {
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-expect-error
  //     session.metadata.trackCount = playlist.length;
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-expect-error
  //     session.metadata.trackNumber = currentIndex + 1;
  //   }
  // }
  //
  // // Очистка при размонтировании
  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    if (!this.isSupported) return;

    const session = navigator.mediaSession;
    // session.setActionHandler('play', null);
    // session.setActionHandler('pause', null);
    // session.setActionHandler('nexttrack', null);
    // session.setActionHandler("previoustrack", null);
    // session.setActionHandler('seekto', null);
    session.setActionHandler('seekbackward', null);
    session.setActionHandler('seekforward', null);
  }

}

export const mediaSessionService = MediaSessionService.getInstance();