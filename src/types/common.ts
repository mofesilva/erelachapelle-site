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

/** Reusable type for Solar Icon components (replaces LucideIcon) */
export type { SolarIconProps } from "solar-icon-set";
export type SolarIcon = (props: import("solar-icon-set").SolarIconProps) => React.JSX.Element;

export type Locale = "fr" | "pt" | "en";
