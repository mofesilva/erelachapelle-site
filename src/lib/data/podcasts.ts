import type { Locale } from "@/types/common";
import type { Podcast } from "@/types/podcast";
import { fetchList } from "@/lib/api/client";
import { getLocalizedContent } from "@/lib/utils";

const FETCH_SIZE = 100;
const PAGE_SIZE = 24;

export async function getAllPodcasts(): Promise<Podcast[]> {
  return fetchList<Podcast>(`/podcasts?limit=${FETCH_SIZE}`);
}

export async function getRecentPodcasts(limit = 3): Promise<Podcast[]> {
  return fetchList<Podcast>(`/podcasts?limit=${limit}`);
}

export async function getPodcastsPage(
  page = 1
): Promise<{ episodes: Podcast[]; totalPages: number }> {
  const all = await getAllPodcasts();
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  return { episodes: all.slice(start, start + PAGE_SIZE), totalPages };
}

export async function getPodcastById(id: string): Promise<Podcast | null> {
  const all = await getAllPodcasts();
  return all.find((p) => p._id === id) ?? null;
}

// Busca por texto: sem case, sem acento — mesma normalização usada em `searchArticles`
// (ver `lib/data/blog.ts`). Filtra em memória sobre o conjunto já carregado (ver
// FETCH_SIZE acima); não precisa de endpoint de busca na API.
const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");

function normalizeForSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .trim();
}

export async function searchPodcasts(q: string, locale: Locale = "fr"): Promise<Podcast[]> {
  const episodes = await getAllPodcasts();
  const query = normalizeForSearch(q);

  return episodes.filter((e) => {
    const haystack = normalizeForSearch(
      `${getLocalizedContent(e.title, locale)} ${e.description ? getLocalizedContent(e.description, locale) : ""}`
    );
    return haystack.includes(query);
  });
}
