import Link from "next/link";
import { PlayBold } from "solar-icon-set";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";
import type { Podcast } from "@/types/podcast";

interface PodcastCardProps {
  episode: Podcast;
  locale: Locale;
  episodeLabel: string;
  listenLabel: string;
}

/**
 * Linha de lista, linka pra página de detalhe do episódio (`/podcast/[id]`) em vez de
 * embutir o player aqui — só a página de detalhe monta um iframe do Spotify fora do
 * destaque, senão seria possível tocar vários episódios ao mesmo tempo (o site não tem
 * como pausar um player remotamente, é iframe de terceiro).
 */
export function PodcastCard({ episode, locale, episodeLabel, listenLabel }: PodcastCardProps) {
  const title = getLocalizedContent(episode.title, locale);

  return (
    <Link
      href={`/${locale}/podcast/${episode._id}`}
      className="group grid gap-4 border-t border-toffee-brown/15 py-7 first:border-t-0 md:grid-cols-[1fr_auto] md:items-center md:gap-10"
    >
      <div className="min-w-0">
        <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[0.18em] text-toffee-brown">
          {formatDate(episode.date, locale)}
          {episode.episodeNumber && ` · ${episodeLabel} ${episode.episodeNumber}`}
        </p>

        <h3 className="mt-2 font-serif text-[1.25rem] font-bold leading-[1.3] text-night-bordeaux-2 transition-colors duration-200 group-hover:text-toffee-brown">
          {title}
        </h3>

        {episode.description && (
          <p className="mt-2 text-[0.875rem] leading-[1.65] text-coffee-bean/70">
            {getLocalizedContent(episode.description, locale)}
          </p>
        )}
      </div>

      <span
        aria-label={listenLabel}
        className="flex h-12 w-12 shrink-0 items-center justify-center bg-toffee-brown/10 text-toffee-brown transition-colors duration-200 group-hover:bg-toffee-brown group-hover:text-parchment md:justify-self-end"
      >
        <PlayBold size={18} color="currentColor" />
      </span>
    </Link>
  );
}
