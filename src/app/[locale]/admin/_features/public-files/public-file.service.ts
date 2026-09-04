import { apiFetch } from "../../_lib/http-client";
import type { PublicFileFormValues } from "./public-file.schema";
import type { PublicFile, PublicFilePage } from "./public-file.type";

type ListParams = {
  cursor?: string;
  limit?: number;
};

/**
 * Público na API. Paginação por keyset (cursor = _id), não por página numerada — sem
 * `?cursor`, devolve a primeira página, ordenada do mais recente pro mais antigo.
 */
export function listPublicFiles({ cursor, limit }: ListParams = {}) {
  const query = new URLSearchParams();
  if (cursor) query.set("cursor", cursor);
  if (limit) query.set("limit", String(limit));
  const qs = query.toString();
  return apiFetch<PublicFilePage>(`/public-files${qs ? `?${qs}` : ""}`);
}

function toBody(values: PublicFileFormValues) {
  return {
    title: { fr: values.title.fr },
    description: values.description ? { fr: values.description } : undefined,
    documentType: values.documentType,
    asset: values.asset,
  };
}

export function createPublicFile(values: PublicFileFormValues, token: string) {
  return apiFetch<PublicFile>("/public-files", { method: "POST", token, body: toBody(values) });
}

export function updatePublicFile(id: string, values: PublicFileFormValues, token: string) {
  return apiFetch<PublicFile>(`/public-files/${id}`, { method: "PUT", token, body: toBody(values) });
}

/** Soft delete: a API move pra lixeira (`deletedAt`), TTL de 30 dias — não é definitivo. */
export function deletePublicFile(id: string, token: string) {
  return apiFetch<void>(`/public-files/${id}`, { method: "DELETE", token });
}
