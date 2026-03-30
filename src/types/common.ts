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

export type SolarIcon = (props: import("solar-icon-set").SolarIconProps) => React.JSX.Element;

export type Locale = "fr" | "pt" | "en";


