import { apiFetch } from "../../_lib/http-client";
import type { MediaAssetTitleFormValues } from "./media-asset.schema";
import type { MediaAsset, MediaAssetPage } from "./media-asset.type";

type ListParams = {
  cursor?: string;
  limit?: number;
  fileType?: string;
};

/**
 * Público na API. Paginação por keyset (cursor = _id), não por página numerada — sem
 * `?cursor`, devolve a primeira página, ordenada do mais recente pro mais antigo.
 */
export function listMediaAssets({ cursor, limit, fileType }: ListParams = {}) {
  const query = new URLSearchParams();
  if (cursor) query.set("cursor", cursor);
  if (limit) query.set("limit", String(limit));
  if (fileType) query.set("fileType", fileType);
  const qs = query.toString();
  return apiFetch<MediaAssetPage>(`/media-assets${qs ? `?${qs}` : ""}`);
}

/** Soft delete: a API marca `active:false`, não apaga o arquivo do storage. */
export function deleteMediaAsset(id: string, token: string) {
  return apiFetch<void>(`/media-assets/${id}`, { method: "DELETE", token });
}

/** PUT aceita corpo parcial — só o title é editado aqui, o resto do documento fica intacto. */
export function updateMediaAsset(id: string, values: MediaAssetTitleFormValues, token: string) {
  return apiFetch<MediaAsset>(`/media-assets/${id}`, {
    method: "PUT",
    token,
    body: { title: { fr: values.title.fr } },
  });
}

/** title/altText/description são STRING contendo JSON multilingual, porque multipart não
 * tem tipo objeto nativo. Só o francês por ora, como no resto do conteúdo (fallback nos outros locales). */
export function uploadMediaAsset(file: File, token: string, title: string): Promise<MediaAsset> {
  const formData = new FormData();
  formData.append("file", file);
  if (title) formData.append("title", JSON.stringify({ fr: title }));

  return apiFetch<MediaAsset>("/media-assets/upload", { method: "POST", body: formData, token });
}
