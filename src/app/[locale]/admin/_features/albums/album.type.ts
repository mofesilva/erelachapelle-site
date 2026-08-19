import { localizedText, type LocalizedText, type UserRef } from "../../_lib/localized-text";
import type { Locale } from "@/types/common";

/** Cópia dos dados do MediaAsset no momento em que a imagem é adicionada ao álbum
 *  (Extended Reference Pattern) — não é só uma referência por id. */
export type AlbumImage = {
  id: string;
  url: string;
  altText?: LocalizedText;
};

/** O documento como `GET /albums` devolve (datas chegam como string ISO no JSON). */
export type Album = {
  _id: string;
  title: LocalizedText;
  slug: string;
  description?: LocalizedText;
  images: AlbumImage[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: UserRef;
  updatedBy: UserRef;
};

export function localizedName(text: LocalizedText, locale: Locale): string {
  return localizedText(text, locale);
}
