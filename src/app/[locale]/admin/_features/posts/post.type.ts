import { localizedText, type LocalizedText, type UserRef } from "../../_lib/localized-text";
import type { EntityRef } from "../sermons/sermon.type";
import type { Locale } from "@/types/common";

export type { EntityRef };

export type FeaturedImage = {
  id: string;
  url: string;
  altText?: LocalizedText;
};

// Separado de `category` (livre/CRUD): postType é o eixo fixo que organiza o hub de conteúdo.
export const POST_TYPES = ["artigo", "newsletter", "boletim"] as const;
export type PostType = (typeof POST_TYPES)[number];

/** O documento como `GET /posts` devolve (datas chegam como string ISO no JSON). */
export type Post = {
  _id: string;
  title: LocalizedText;
  content: LocalizedText;
  excerpt: LocalizedText;
  author: string;
  postType: PostType;
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
