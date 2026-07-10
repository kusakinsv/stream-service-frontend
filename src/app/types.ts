export type AudioItem = {
  url: string;
  title: string;
  cors?: boolean;
}

export type MusicTrack = {
  url: string;
  title: string;
  duration?: null | string;
}

export type AudioTrackData = {
  position?: number;
  url: string;
  title: string;
  isValid: boolean;
  isNeedProxy?: boolean;
  duration: null | number;
  audioElem: null | HTMLAudioElement;
}

export type PlayListItem = {
  position: number,
  title: string,
  url: string,
  duration: null | number,
  isNeedProxy: boolean
}