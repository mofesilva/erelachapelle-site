import type { Locale } from "@/types/common";
import type { Post, PostType } from "@/types/blog";
import { fetchList, fetchOne } from "@/lib/api/client";
import { getLocalizedContent } from "@/lib/utils";

const FETCH_SIZE = 100;

// `GET /posts` ordena por `_id` (= criação), não por `publishedAt` — reordena aqui,
// já que um post agendado pode ter sido criado fora de ordem.
export async function getAllArticles(): Promise<Post[]> {
  const posts = await fetchList<Post>(`/posts?limit=${FETCH_SIZE}`);
  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getRecentArticles(limit = 3): Promise<Post[]> {
  const posts = await getAllArticles();
  return posts.slice(0, limit);
}

// Base do mini hub de conteúdo: cada zona (artigo/newsletter/boletim) mostra só o seu tipo.
export async function getArticlesByType(postType: PostType): Promise<Post[]> {
  const posts = await fetchList<Post>(`/posts?postType=${postType}&limit=${FETCH_SIZE}`);
  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// Post não tem `slug` (ver docs/modelo-de-dados.md) — a página de detalhe é servida por `_id`.
export async function getArticleById(id: string): Promise<Post | null> {
  return fetchOne<Post>(`/posts/${id}`);
}

// Busca por texto: sem case, sem acento — mesma normalização usada em `slugify` (ver
// `lib/utils.ts`). Volume baixo (ver FETCH_SIZE acima), então filtrar em memória sobre o
// conjunto já carregado é suficiente; não precisa de endpoint de busca na API.
const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");

function normalizeForSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .trim();
}

export async function searchArticles(q: string, locale: Locale = "fr"): Promise<Post[]> {
  const posts = await getAllArticles();
  const query = normalizeForSearch(q);

  return posts.filter((p) => {
    const haystack = normalizeForSearch(
      `${getLocalizedContent(p.title, locale)} ${getLocalizedContent(p.excerpt, locale)}`
    );
    return haystack.includes(query);
  });
}
