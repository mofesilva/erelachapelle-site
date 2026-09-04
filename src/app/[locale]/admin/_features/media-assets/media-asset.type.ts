import { localizedText, type LocalizedText, type UserRef } from "../../_lib/localized-text";
import type { Locale } from "@/types/common";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const FILE_TYPES = ["pdf", "png", "jpeg", "epub"] as const;

/** O documento como `POST /media-assets/upload` devolve. */
export type MediaAsset = {
  _id: string;
  fileType: (typeof FILE_TYPES)[number];
  title?: LocalizedText;
  altText?: LocalizedText;
  description?: LocalizedText;
  url: string;
  coverUrl?: string;
  slug?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: UserRef;
  updatedBy: UserRef;
};

export type MediaAssetPage = {
  items: MediaAsset[];
  /** _id do último item da página — manda de volta como `cursor` pra pegar a próxima. `null` = não tem mais. */
  nextCursor: string | null;
};

/** `url` da API é relativa (`/uploads/xxx.ext`) — precisa do host da API pra virar `<img src>` de verdade. */
export function resolveMediaAssetUrl(url: string): string {
  return url.startsWith("/") ? `${API_URL}${url}` : url;
}

/** Sem `title`, cai pro nome do arquivo (sem extensão) extraído da própria url. */
export function displayTitle(asset: MediaAsset, locale: Locale): string {
  if (asset.title) return localizedText(asset.title, locale);
  const basename = asset.url.split("/").pop() ?? asset.url;
  return basename.replace(/\.[^./]+$/, "");
}
