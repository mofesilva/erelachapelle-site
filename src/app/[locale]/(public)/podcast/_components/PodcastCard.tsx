import { PodcastEmbed } from "@/_components/PodcastEmbed";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";
import type { Podcast } from "@/types/podcast";

interface PodcastCardProps {
  episode: Podcast;
  locale: Locale;
  episodeLabel: string;
}

/**
 * Linha de lista, não card em grid — sem imagem de capa, o player do Spotify já é o
 * elemento visual. Texto à esquerda, player à direita; separadas por um filete, como o
 * arquivo de prédications.
 */
export function PodcastCard({ episode, locale, episodeLabel }: PodcastCardProps) {
  const title = getLocalizedContent(episode.title, locale);

  return (
    <article className="grid gap-4 border-t border-toffee-brown/15 py-7 first:border-t-0 md:grid-cols-[1fr_22rem] md:items-center md:gap-10">
      <div className="min-w-0">
        <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[0.18em] text-toffee-brown">
          {formatDate(episode.date, locale)}
          {episode.episodeNumber && ` · ${episodeLabel} ${episode.episodeNumber}`}
        </p>

        <h3 className="mt-2 font-serif text-[1.25rem] font-bold leading-[1.3] text-night-bordeaux-2">
          {title}
        </h3>

        {episode.description && (
          <p className="mt-2 text-[0.875rem] leading-[1.65] text-coffee-bean/70">
            {getLocalizedContent(episode.description, locale)}
          </p>
        )}
      </div>

      <PodcastEmbed url={episode.url} title={title} />
    </article>
  );
}
