import type { Album } from "@/types/album";
import { fetchArray } from "@/lib/api/client";

// `GET /albums` não é paginado — devolve o array inteiro.
export async function getAllAlbums(): Promise<Album[]> {
  return fetchArray<Album>("/albums");
}

export async function getAlbumBySlug(slug: string): Promise<Album | null> {
  const albums = await getAllAlbums();
  return albums.find((a) => a.slug === slug) ?? null;
}
