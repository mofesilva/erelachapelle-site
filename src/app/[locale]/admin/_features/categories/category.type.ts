import { localizedText, type LocalizedText, type UserRef } from "../../_lib/localized-text";
import type { Locale } from "@/types/common";

/** O documento como `GET /categories` devolve (datas chegam como string ISO no JSON). */
export type Category = {
  _id: string;
  name: LocalizedText;
  slug: string;
  description?: LocalizedText;
  displayOrder?: number;
  active?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: UserRef;
  updatedBy: UserRef;
};

export function localizedName(text: LocalizedText, locale: Locale): string {
  return localizedText(text, locale);
}
