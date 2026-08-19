import type { Podcast } from "@/types/podcast";
import { fetchList } from "@/lib/api/client";

const FETCH_SIZE = 100;
const PAGE_SIZE = 24;

export async function getAllPodcasts(): Promise<Podcast[]> {
  return fetchList<Podcast>(`/podcasts?limit=${FETCH_SIZE}`);
}

export async function getPodcastsPage(
  page = 1
): Promise<{ episodes: Podcast[]; totalPages: number }> {
  const all = await getAllPodcasts();
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  return { episodes: all.slice(start, start + PAGE_SIZE), totalPages };
}
