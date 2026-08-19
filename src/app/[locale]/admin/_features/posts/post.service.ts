import { apiFetch } from "../../_lib/http-client";
import type { Category } from "../categories/category.type";
import type { Theme } from "../themes/theme.type";
import type { PostFormValues } from "./post.schema";
import type { EntityRef, FeaturedImage, Post } from "./post.type";

export type PostPage = {
  items: Post[];
  /** _id do último item da página — manda de volta como `cursor` pra pegar a próxima. `null` = não tem mais. */
  nextCursor: string | null;
};

type ListParams = {
  cursor?: string;
  limit?: number;
};

/**
 * Paginação por keyset (cursor = _id), mesmo padrão de category.service.ts. Autenticada
 * (com token), devolve rascunhos e agendados também — é o que a tabela do admin precisa;
 * sem token só devolve o que já está publicado (regra que vive na API, não aqui).
 */
export function listPosts({ cursor, limit }: ListParams = {}, token: string) {
  const query = new URLSearchParams();
  if (cursor) query.set("cursor", cursor);
  if (limit) query.set("limit", String(limit));
  const qs = query.toString();
  return apiFetch<PostPage>(`/posts${qs ? `?${qs}` : ""}`, { token });
}

export function getPost(id: string, token: string) {
  return apiFetch<Post>(`/posts/${id}`, { token });
}

function resolveCategoryRef(id: string, categories: Category[]): EntityRef {
  const category = categories.find((c) => c._id === id);
  if (!category) throw new Error("Catégorie introuvable");
  return { id: category._id, name: category.name };
}

function resolveThemeRefs(ids: string[], themes: Theme[]): EntityRef[] {
  return ids
    .map((id) => themes.find((t) => t._id === id))
    .filter((theme): theme is Theme => theme !== undefined)
    .map((theme) => ({ id: theme._id, name: theme.name }));
}

/** Exportado pra o editor poder montar o mesmo corpo e diffar contra o último salvo (autosave). */
export function buildPostBody(values: PostFormValues, categories: Category[], themes: Theme[]) {
  return {
    title: { fr: values.title.fr },
    excerpt: { fr: values.excerpt.fr },
    content: { fr: values.content.fr },
    author: values.author,
    category: resolveCategoryRef(values.categoryId, categories),
    themes: resolveThemeRefs(values.themeIds, themes),
    tags: values.tags,
    featuredImage: values.featuredImage ?? undefined,
    published: values.published,
    publishedAt: values.publishedAt.toISOString(),
  };
}

/** Exige role editor/admin. `createdBy`/`updatedBy` são preenchidos pelo servidor a partir do JWT. */
export function createPost(
  values: PostFormValues,
  categories: Category[],
  themes: Theme[],
  token: string
) {
  return apiFetch<Post>("/posts", {
    method: "POST",
    token,
    body: buildPostBody(values, categories, themes),
  });
}

export function updatePost(
  id: string,
  values: PostFormValues,
  categories: Category[],
  themes: Theme[],
  token: string
) {
  return apiFetch<Post>(`/posts/${id}`, {
    method: "PUT",
    token,
    body: buildPostBody(values, categories, themes),
  });
}

/**
 * Autosave: `PUT` na API aceita corpo parcial, então manda só os campos tocados. Usado pelo
 * editor pra salvar em segundo plano sem reconstruir o post inteiro a cada pausa de digitação.
 */
export function patchPost(
  id: string,
  patch: Partial<{
    title: { fr: string };
    excerpt: { fr: string };
    content: { fr: string };
    author: string;
    category: EntityRef;
    themes: EntityRef[];
    tags: string[];
    featuredImage: FeaturedImage | null;
    published: boolean;
    publishedAt: string;
  }>,
  token: string
) {
  return apiFetch<Post>(`/posts/${id}`, { method: "PUT", token, body: patch });
}

/** Soft delete: a API move pra lixeira (`deletedAt`) — não é definitivo. */
export function deletePost(id: string, token: string) {
  return apiFetch<void>(`/posts/${id}`, { method: "DELETE", token });
}
