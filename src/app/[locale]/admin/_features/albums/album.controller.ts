"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "../../_lib/auth-context";
import {
  createAlbum,
  deleteAlbum,
  listAlbums,
  updateAlbumImages,
  updateAlbumMetadata,
} from "./album.service";
import type { AlbumFormValues } from "./album.schema";
import type { Album, AlbumImage } from "./album.type";

// Mesmo motivo do MIN_LOADING_MS em category.controller.ts: evita o "flash" do skeleton
// quando a API responde rápido demais pra sequer perceber o carregamento.
const MIN_LOADING_MS = 400;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useAlbums() {
  const { accessToken } = useAdminAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  // Diferente de Podcasts/Categories/MediaAssets: `GET /albums` não aceita cursor/limit,
  // devolve a lista inteira de uma vez — sem paginação client-side a inventar aqui.
  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    setLoadFailed(false);
    const startedAt = Date.now();
    try {
      const items = await listAlbums();
      setAlbums(items);
    } catch {
      setLoadFailed(true);
    } finally {
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_LOADING_MS) await sleep(MIN_LOADING_MS - elapsed);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  function requireToken() {
    if (!accessToken) throw new Error("Sessão ausente");
    return accessToken;
  }

  /** Deixa o erro subir: quem chama é o formulário, que sabe traduzir por status. */
  async function create(values: AlbumFormValues) {
    await createAlbum(values, requireToken());
    await fetchAlbums();
  }

  async function updateMetadata(id: string, values: AlbumFormValues) {
    await updateAlbumMetadata(id, values, requireToken());
    await fetchAlbums();
  }

  async function remove(id: string) {
    await deleteAlbum(id, requireToken());
    await fetchAlbums();
  }

  /** Ignora imagens que já estão no álbum (o seletor já filtra isso, mas fica à prova de reentrância). */
  async function addImages(album: Album, newImages: AlbumImage[]) {
    const existingIds = new Set(album.images.map((image) => image.id));
    const toAdd = newImages.filter((image) => !existingIds.has(image.id));
    const updated = toAdd.length
      ? await updateAlbumImages(album._id, [...album.images, ...toAdd], requireToken())
      : album;
    await fetchAlbums();
    return updated;
  }

  async function removeImage(album: Album, imageId: string) {
    const updated = await updateAlbumImages(
      album._id,
      album.images.filter((image) => image.id !== imageId),
      requireToken()
    );
    await fetchAlbums();
    return updated;
  }

  return {
    albums,
    loading,
    loadFailed,
    create,
    updateMetadata,
    remove,
    addImages,
    removeImage,
  };
}
