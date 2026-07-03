import type { PlayListItem, AudioTrackData } from "@/app/types.ts";

export const removeDuplicates = <T extends {url: string} >(values: T[]) => {
  const map = new Map<string, T>();
  for (const item of values) {
    if (!map.has(item.url)) {
      map.set(item.url, item);
    }
  }
  return Array.from(map.values());
}

export const filterValidAudio = (values: AudioTrackData[]) => {
  return values.filter(item=> item.isValid);
}

export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const mapToPlayListItem = (trackData: AudioTrackData): PlayListItem => {
  return {
    url: trackData.url,
    duration: trackData.duration,
    title: trackData.title,
    isNeedProxy: trackData.isNeedProxy ?? false,
  };
};

