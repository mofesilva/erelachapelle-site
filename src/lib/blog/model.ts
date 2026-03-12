import type { MultilingualText } from "@/types/common";

export interface BlogArticle {
    _id: string;
    title: MultilingualText;
    content: MultilingualText;
    excerpt: MultilingualText;
    author: string;
    authorBio?: string;
    publishedAt: string;
    featuredImage?: string;
    categories: string[];
    tags: string[];
    slug: string;
    published: boolean;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}
