import type { BibleRef, ExtendedRef, MultilingualText } from "./common";

export interface Sermon {
  _id: string;
  title: MultilingualText;
  description?: MultilingualText;
  preacher: string;
  date: string;
  biblicalReference?: BibleRef;
  /** Achatado para string no `lib/data/sermons.ts` (a API guarda MultilingualText). */
  series?: string;
  seriesOrder?: number;
  youtubeVideoId: string;
  notes?: { id: string; url: string; fileType: "pdf" | "epub" };
  tags: string[];
  duration?: number;
  categories?: ExtendedRef[];
  themes?: ExtendedRef[];
  slug: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
