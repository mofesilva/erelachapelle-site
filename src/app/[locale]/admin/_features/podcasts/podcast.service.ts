import { apiFetch } from "../../_lib/http-client";
import type { PodcastFormValues } from "./podcast.schema";
import type { Podcast } from "./podcast.type";

export type PodcastPage = {
  items: Podcast[];
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
export function listPodcasts({ cursor, limit }: ListParams = {}) {
  const query = new URLSearchParams();
  if (cursor) query.set("cursor", cursor);
  if (limit) query.set("limit", String(limit));
  const qs = query.toString();
  return apiFetch<PodcastPage>(`/podcasts${qs ? `?${qs}` : ""}`);
}

function buildBody(values: PodcastFormValues) {
  return {
    title: { fr: values.title.fr },
    description: values.description ? { fr: values.description } : undefined,
    url: values.url,
    date: values.date,
  };
}

/** Exige role editor/admin. `createdBy`/`updatedBy` são preenchidos pelo servidor a partir do JWT. */
export function createPodcast(values: PodcastFormValues, token: string) {
  return apiFetch<Podcast>("/podcasts", {
    method: "POST",
    token,
    body: buildBody(values),
  });
}

/** PUT aceita corpo parcial na API, mas aqui sempre mandamos tudo que o form edita. */
export function updatePodcast(id: string, values: PodcastFormValues, token: string) {
  return apiFetch<Podcast>(`/podcasts/${id}`, {
    method: "PUT",
    token,
    body: buildBody(values),
  });
}

/** Soft delete: a API move pra lixeira (`deletedAt`), TTL de 30 dias — não é definitivo. */
export function deletePodcast(id: string, token: string) {
  return apiFetch<void>(`/podcasts/${id}`, { method: "DELETE", token });
}
