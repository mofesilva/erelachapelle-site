"use client";

import { useState, useTransition } from "react";
import type { Locale } from "@/types/common";
import type { Podcast } from "@/types/podcast";
import { loadMorePodcasts } from "../actions";
import { PodcastCard } from "./PodcastCard";

interface EpisodesListProps {
  initialEpisodes: Podcast[];
  initialTotalPages: number;
  locale: Locale;
  episodeLabel: string;
  loadMoreLabel: string;
}

/** Mesmo padrão de "carregar mais" da lista de prédications — sem link, sem reload. */
export function EpisodesList({
  initialEpisodes,
  initialTotalPages,
  locale,
  episodeLabel,
  loadMoreLabel,
}: EpisodesListProps) {
  const [episodes, setEpisodes] = useState(initialEpisodes);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isPending, startTransition] = useTransition();

  function handleLoadMore() {
    startTransition(async () => {
      const next = page + 1;
      const result = await loadMorePodcasts(next);
      setEpisodes((prev) => [...prev, ...result.episodes]);
      setTotalPages(result.totalPages);
      setPage(next);
    });
  }

  return (
    <>
      <div className="mt-4">
        {episodes.map((episode) => (
          <PodcastCard
            key={episode._id}
            episode={episode}
            locale={locale}
            episodeLabel={episodeLabel}
          />
        ))}
      </div>

      {page < totalPages && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isPending}
            className="cursor-pointer border border-night-bordeaux-2/30 px-6 py-2.5 text-[0.8125rem] font-bold uppercase tracking-[0.15em] text-night-bordeaux-2 transition-colors duration-200 hover:border-night-bordeaux-2 hover:bg-night-bordeaux-2 hover:text-parchment disabled:cursor-wait disabled:opacity-50"
          >
            {isPending ? "…" : loadMoreLabel}
          </button>
        </div>
      )}
    </>
  );
}
