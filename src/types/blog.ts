import type { ExtendedRef, MediaRef, MultilingualText } from "./common";

// Separado de `category` (livre/CRUD): postType é o eixo fixo que organiza o hub de conteúdo.
export const POST_TYPES = ["artigo", "newsletter", "boletim"] as const;
export type PostType = (typeof POST_TYPES)[number];

export interface Post {
  _id: string;
  title: MultilingualText;
  content: MultilingualText;
  excerpt: MultilingualText;
  author: string;
  postType: PostType;
  category: ExtendedRef;
  tags?: string[];
  themes?: ExtendedRef[];
  featuredImage?: MediaRef;
  publishedAt: string;
  published: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
