import type { BibleRef, MultilingualText } from "./common";

export interface Sermon {
  _id: string;
  title: MultilingualText;
  description?: MultilingualText;
  preacher: string;
  date: string;
  biblicalReference?: BibleRef;
  series?: string;
  seriesOrder?: number;
  youtubeVideoId: string;
  pdfNotesUrl?: string;
  tags: string[];
  duration?: number;
  slug: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SermonFilter {
  preacher?: string;
  series?: string;
  tag?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface SermonSeries {
  name: string;
  count: number;
}
