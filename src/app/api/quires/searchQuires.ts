import type { AudioItem } from "@/app/types.ts";

import { internetSearcherClient} from "@/app/api/clients.ts";

type SearchMusicRequest = {
  query: string;
}

export const searchQuires = (params: SearchMusicRequest) => {
  return internetSearcherClient.get<AudioItem[]>("/api/v1/search", {params})
};