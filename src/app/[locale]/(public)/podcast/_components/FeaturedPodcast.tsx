import { PodcastEmbed } from "@/_components/PodcastEmbed";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";
import type { Podcast } from "@/types/podcast";

interface FeaturedPodcastProps {
  episode: Podcast;
  locale: Locale;
  episodeLabel: string;
}

/** Mesma estrutura do FeaturedSermon em /sermons: 2 colunas, sem rótulo de seção, data
 * em texto liso (sem borda), badge só pro que é opcional (aqui, número do episódio). */
export function FeaturedPodcast({ episode, locale, episodeLabel }: FeaturedPodcastProps) {
  const title = getLocalizedContent(episode.title, locale);

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
        {/* Player — mesma posição do thumbnail do sermão, sem moldura extra */}
        <div className="shadow-2xl">
          <PodcastEmbed url={episode.url} title={title} />
        </div>

        {/* Info */}
        <div>
          <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[0.2em] text-parchment/50">
            {formatDate(episode.date, locale)}
          </p>

          <h1 className="mt-3 font-serif text-[1.75rem] font-bold leading-[1.15] text-parchment md:text-[2.5rem]">
            {title}
          </h1>

          {episode.description && (
            <p className="mt-4 text-[0.9375rem] leading-[1.7] text-parchment/70">
              {getLocalizedContent(episode.description, locale)}
            </p>
          )}

          {episode.episodeNumber && (
            <div className="mt-5 flex flex-wrap gap-2">
              <p className="border border-parchment/25 px-2.5 py-1 text-[0.6875rem] uppercase tracking-[0.1em] text-parchment/70">
                {episodeLabel} {episode.episodeNumber}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
