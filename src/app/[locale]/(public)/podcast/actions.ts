"use server";

import { getPodcastsPage } from "@/lib/data/podcasts";

export async function loadMorePodcasts(page: number) {
  return getPodcastsPage(page);
}
