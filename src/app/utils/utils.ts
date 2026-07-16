import type { AudioTrackData } from "@/app/types.ts";

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

export function shufflePlaylist<T extends { position: number }>(array: T[]): T[] {
  const shuffled = [...array]; // Создаем копию, чтобы не мутировать исходный массив
  const positions = shuffled.map(item => item.position);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  shuffled.forEach((item, index) => {
    item.position = positions[index];
  });
  return shuffled;
}