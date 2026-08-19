import { slugify } from "@/lib/utils";
import { apiFetch } from "../../_lib/http-client";
import type { AlbumFormValues } from "./album.schema";
import type { Album, AlbumImage } from "./album.type";

/** Público na API. Sem paginação — `GET /albums` devolve todos os álbuns ativos de uma vez,
 *  ordenados do mais recente pro mais antigo. */
export function listAlbums() {
  return apiFetch<Album[]>("/albums");
}

/** Exige role editor/admin. `slug` é gerado a partir do título, não é campo do formulário. */
export function createAlbum(values: AlbumFormValues, token: string) {
  return apiFetch<Album>("/albums", {
    method: "POST",
    token,
    body: {
      title: { fr: values.title.fr },
      slug: slugify(values.title.fr),
      description: values.description ? { fr: values.description } : undefined,
    },
  });
}

/** PUT aceita corpo parcial — usado tanto pra editar metadados quanto pra atualizar `images`. */
export function updateAlbumMetadata(id: string, values: AlbumFormValues, token: string) {
  return apiFetch<Album>(`/albums/${id}`, {
    method: "PUT",
    token,
    body: {
      title: { fr: values.title.fr },
      slug: slugify(values.title.fr),
      description: values.description ? { fr: values.description } : undefined,
    },
  });
}

export function updateAlbumImages(id: string, images: AlbumImage[], token: string) {
  return apiFetch<Album>(`/albums/${id}`, {
    method: "PUT",
    token,
    body: { images },
  });
}

/** Soft delete: a API move pra lixeira (`deletedAt`), TTL de 30 dias — não é definitivo. */
export function deleteAlbum(id: string, token: string) {
  return apiFetch<void>(`/albums/${id}`, { method: "DELETE", token });
}
