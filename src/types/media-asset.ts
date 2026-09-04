import type { Locale, MultilingualText } from "./common";
import { getLocalizedContent } from "@/lib/utils";

export const DOCUMENT_TYPES = ["bulletin", "notes", "study_guide", "book"] as const;

export interface MediaAsset {
  _id: string;
  documentType?: (typeof DOCUMENT_TYPES)[number];
  title?: MultilingualText;
  description?: MultilingualText;
  url: string;
  coverUrl?: string;
  createdAt: string;
}

/** `url` da API é relativa (`/uploads/xxx.pdf`) — precisa do host da API pra virar link de verdade. */
export function resolveMediaAssetUrl(url: string): string {
  return url.startsWith("/") ? `${process.env.NEXT_PUBLIC_API_URL}${url}` : url;
}

/** Sem `title`, cai pro nome do arquivo (sem extensão) extraído da própria url. */
export function displayTitle(asset: MediaAsset, locale: Locale): string {
  if (asset.title) return getLocalizedContent(asset.title, locale);
  const basename = asset.url.split("/").pop() ?? asset.url;
  return basename.replace(/\.[^./]+$/, "");
}
