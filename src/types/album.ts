import type { MediaRef, MultilingualText } from "./common";

export interface Album {
  _id: string;
  title: MultilingualText;
  slug: string;
  description?: MultilingualText;
  images: MediaRef[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
