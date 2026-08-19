import { localizedText, type LocalizedText, type UserRef } from "../../_lib/localized-text";
import type { EntityRef } from "../sermons/sermon.type";
import type { Locale } from "@/types/common";

export type { EntityRef };

export type FeaturedImage = {
  id: string;
  url: string;
  altText?: LocalizedText;
};

/** O documento como `GET /posts` devolve (datas chegam como string ISO no JSON). */
export type Post = {
  _id: string;
  title: LocalizedText;
  content: LocalizedText;
  excerpt: LocalizedText;
  author: string;
  category: EntityRef;
  tags?: string[];
  themes?: EntityRef[];
  featuredImage?: FeaturedImage;
  publishedAt: string;
  published: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: UserRef;
  updatedBy: UserRef;
};

export type PostStatus = "draft" | "published" | "scheduled";

/** Rascunho / Publicado / Agendado — derivado, não vem da API. */
export function postStatus(post: Pick<Post, "published" | "publishedAt">): PostStatus {
  if (!post.published) return "draft";
  return new Date(post.publishedAt) > new Date() ? "scheduled" : "published";
}

export function localizedName(text: LocalizedText, locale: Locale): string {
  return localizedText(text, locale);
}
