import type { ExtendedRef } from "@/types/common";
import type { Post } from "@/types/blog";
import { fetchList, fetchOne } from "@/lib/api/client";

const FETCH_SIZE = 100;
const PAGE_SIZE = 24;

// `GET /posts` ordena por `_id` (= criação), não por `publishedAt` — reordena aqui,
// já que um post agendado pode ter sido criado fora de ordem.
export async function getAllArticles(): Promise<Post[]> {
  const posts = await fetchList<Post>(`/posts?limit=${FETCH_SIZE}`);
  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getPostsPage(
  page = 1
): Promise<{ articles: Post[]; totalPages: number }> {
  const all = await getAllArticles();
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  return { articles: all.slice(start, start + PAGE_SIZE), totalPages };
}

export async function getRecentArticles(limit = 3): Promise<Post[]> {
  const posts = await getAllArticles();
  return posts.slice(0, limit);
}

// Post não tem `slug` (ver docs/modelo-de-dados.md) — a página de detalhe é servida por `_id`.
export async function getArticleById(id: string): Promise<Post | null> {
  return fetchOne<Post>(`/posts/${id}`);
}

export async function getArticleCategories(): Promise<ExtendedRef[]> {
  const posts = await getAllArticles();
  const seen = new Map<string, ExtendedRef>();
  for (const p of posts) seen.set(p.category.id, p.category);
  return Array.from(seen.values());
}

export async function filterArticles(filters: { categoryId?: string }): Promise<Post[]> {
  const posts = await getAllArticles();
  return posts.filter((p) => !filters.categoryId || p.category.id === filters.categoryId);
}
