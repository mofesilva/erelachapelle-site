import { localizedText, type LocalizedText, type UserRef } from "../../_lib/localized-text";
import type { Locale } from "@/types/common";

/** O documento como `GET /podcasts` devolve (datas chegam como string ISO no JSON). */
export type Podcast = {
  _id: string;
  title: LocalizedText;
  description?: LocalizedText;
  url: string;
  date: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: UserRef;
  updatedBy: UserRef;
};

export function localizedName(text: LocalizedText, locale: Locale): string {
  return localizedText(text, locale);
}
