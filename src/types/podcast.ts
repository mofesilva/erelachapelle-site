import type { MultilingualText } from "./common";

export interface Podcast {
  _id: string;
  title: MultilingualText;
  description?: MultilingualText;
  url: string;
  date: string;
  episodeNumber?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
