import { slugify } from "@/lib/utils";
import { apiFetch } from "../../_lib/http-client";
import type { Category } from "../categories/category.type";
import type { Theme } from "../themes/theme.type";
import type { SermonFormValues } from "./sermon.schema";
import type { EntityRef, Sermon } from "./sermon.type";

export type SermonPage = {
  items: Sermon[];
  /** "<date ISO>_<_id>" do último item da página — manda de volta como `cursor` pra pegar a próxima. `null` = não tem mais. */
  nextCursor: string | null;
};

type ListParams = {
  cursor?: string;
  limit?: number;
};

/**
 * Público na API. Paginação por keyset (cursor = date+_id do último item), não por página
 * numerada — sem `?cursor`, devolve a primeira página, ordenada do mais recente pro mais antigo.
 */
export function listSermons({ cursor, limit }: ListParams = {}) {
  const query = new URLSearchParams();
  if (cursor) query.set("cursor", cursor);
  if (limit) query.set("limit", String(limit));
  const qs = query.toString();
  return apiFetch<SermonPage>(`/sermons${qs ? `?${qs}` : ""}`);
}

function resolveRefs(
  ids: string[],
  options: { _id: string; name: Category["name"] }[]
): EntityRef[] {
  return ids
    .map((id) => options.find((option) => option._id === id))
    .filter((option): option is (typeof options)[number] => option !== undefined)
    .map((option) => ({ id: option._id, name: option.name }));
}

function buildBody(values: SermonFormValues, categories: Category[], themes: Theme[]) {
  const chapter = values.biblicalReference.chapter
    ? Number(values.biblicalReference.chapter)
    : undefined;

  return {
    title: { fr: values.title.fr },
    preacher: values.preacher,
    date: values.date,
    youtubeVideoId: values.youtubeVideoId,
    biblicalReference:
      values.biblicalReference.book && chapter
        ? {
            book: values.biblicalReference.book,
            chapter,
            verses: values.biblicalReference.verses || undefined,
          }
        : undefined,
    categories: resolveRefs(values.categoryIds, categories),
    themes: resolveRefs(values.themeIds, themes),
    slug: slugify(values.title.fr),
  };
}

/** Exige role editor/admin. `createdBy`/`updatedBy` são preenchidos pelo servidor a partir do JWT. */
export function createSermon(
  values: SermonFormValues,
  categories: Category[],
  themes: Theme[],
  token: string
) {
  return apiFetch<Sermon>("/sermons", {
    method: "POST",
    token,
    body: buildBody(values, categories, themes),
  });
}

/** PUT aceita corpo parcial na API, mas aqui sempre mandamos tudo que o form edita. */
export function updateSermon(
  id: string,
  values: SermonFormValues,
  categories: Category[],
  themes: Theme[],
  token: string
) {
  return apiFetch<Sermon>(`/sermons/${id}`, {
    method: "PUT",
    token,
    body: buildBody(values, categories, themes),
  });
}

/** Soft delete: a API move pra lixeira (`deletedAt`), TTL de 30 dias — não é definitivo. */
export function deleteSermon(id: string, token: string) {
  return apiFetch<void>(`/sermons/${id}`, { method: "DELETE", token });
}
