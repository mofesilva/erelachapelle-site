export interface MultilingualText {
  fr: string;
  pt: string;
  en: string;
}

export interface BibleRef {
  book: string;
  chapter: number;
  verses?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SEOMeta {
  title: string;
  description: string;
  ogImage?: string;
}

export type Locale = "fr" | "pt" | "en";
