export interface MultilingualText {
  fr: string;
  pt?: string;
  en?: string;
}

// Extended Reference Pattern (ver decisoes-arquitetura.md §1): id + cópia dos campos
// exibidos no dia a dia, evita lookup pra exibir a referência mais comum.
export interface ExtendedRef {
  id: string;
  name: MultilingualText;
}

export interface MediaRef {
  id: string;
  url: string;
  altText?: MultilingualText;
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


