import type { ExtendedRef, MediaRef, MultilingualText } from "./common";

export interface Post {
  _id: string;
  title: MultilingualText;
  content: MultilingualText;
  excerpt: MultilingualText;
  author: string;
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
