import { localizedText, type LocalizedText, type UserRef } from "../../_lib/localized-text";
import type { Locale } from "@/types/common";

export const DOCUMENT_TYPES = ["bulletin", "notes", "study_guide", "book"] as const;

/** Cópia de {id,url,fileType} do MediaAsset no momento em que é vinculado (Extended Reference Pattern). */
export type PublicFileAsset = {
  id: string;
  url: string;
  fileType: "pdf" | "epub";
  coverUrl?: string;
};

/** O documento como `GET /public-files` devolve (datas chegam como string ISO no JSON). */
export type PublicFile = {
  _id: string;
  title: LocalizedText;
  description?: LocalizedText;
  documentType: (typeof DOCUMENT_TYPES)[number];
  asset: PublicFileAsset;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: UserRef;
  updatedBy: UserRef;
};

export type PublicFilePage = {
  items: PublicFile[];
  /** _id do último item da página — manda de volta como `cursor` pra pegar a próxima. `null` = não tem mais. */
  nextCursor: string | null;
};

export function localizedName(text: LocalizedText, locale: Locale): string {
  return localizedText(text, locale);
}
