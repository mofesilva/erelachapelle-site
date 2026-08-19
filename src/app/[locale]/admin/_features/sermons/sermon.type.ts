import { localizedText, type LocalizedText, type UserRef } from "../../_lib/localized-text";
import type { Locale } from "@/types/common";

export type BiblicalReference = {
  book: string;
  chapter: number;
  verses?: string;
};

/** Extended Reference Pattern (ver decisoes-arquitetura.md §1): guarda id + nome, não só o id. */
export type EntityRef = {
  id: string;
  name: LocalizedText;
};

/** O documento como `GET /sermons` devolve (datas chegam como string ISO no JSON). */
export type Sermon = {
  _id: string;
  title: LocalizedText;
  description?: LocalizedText;
  preacher: string;
  date: string;
  biblicalReference?: BiblicalReference;
  series?: LocalizedText;
  seriesOrder?: number;
  youtubeVideoId: string;
  notes?: { id: string; url: string; fileType: "pdf" | "epub" };
  tags: string[];
  duration?: number;
  categories?: EntityRef[];
  themes?: EntityRef[];
  slug: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: UserRef;
  updatedBy: UserRef;
};

export function localizedName(text: LocalizedText, locale: Locale): string {
  return localizedText(text, locale);
}

export function formatBiblicalReference(ref: BiblicalReference | undefined): string {
  if (!ref) return "";
  const base = `${ref.book} ${ref.chapter}`;
  return ref.verses ? `${base}:${ref.verses}` : base;
}
