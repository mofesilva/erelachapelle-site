"use client";

import { useState } from "react";
import { PlayBold, CloseCircleBold } from "solar-icon-set";
import { PodcastEmbed } from "@/_components/PodcastEmbed";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/common";
import type { Podcast } from "@/types/podcast";

interface EpisodeListProps {
  episodes: Podcast[];
  locale: Locale;
  listenLabel: string;
  closeLabel: string;
}

/**
 * Lista editorial de episódios. O player só é montado quando o visitante abre o
 * episódio — 30 iframes do Spotify carregados de uma vez deixariam a página
 * pesada e comprida demais pra navegar.
 */
export function EpisodeList({ episodes, locale, listenLabel, closeLabel }: EpisodeListProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className="border-t border-dust-grey">
      {episodes.map((episode) => {
        const title = getLocalizedContent(episode.title, locale);
        const isOpen = openId === episode._id;

        return (
          <li key={episode._id} className="border-b border-dust-grey">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : episode._id)}
              className={cn(
                "group flex w-full cursor-pointer items-center gap-5 px-1 py-5 text-left transition-colors duration-300 md:gap-8 md:px-2",
                isOpen ? "bg-white" : "hover:bg-white/60"
              )}
            >
              {/* Número do episódio — losango quando o episódio não foi numerado,
                  pra coluna não virar uma fileira de traços. */}
              <span
                aria-hidden="true"
                className={cn(
                  "flex w-10 shrink-0 items-center justify-end transition-colors duration-300 md:w-14",
                  isOpen ? "text-toffee-brown" : "text-toffee-brown/30 group-hover:text-toffee-brown/60"
                )}
              >
                {episode.episodeNumber ? (
                  <span className="font-serif text-2xl leading-none tabular-nums md:text-3xl">
                    {episode.episodeNumber}
                  </span>
                ) : (
                  <span className="h-1.5 w-1.5 rotate-45 bg-current" />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-coffee-bean/45">
                  {formatDate(episode.date, locale)}
                </span>

                <span
                  className={cn(
                    "mt-1 block truncate font-serif text-lg font-bold transition-colors duration-300 md:text-xl",
                    isOpen ? "text-toffee-brown" : "text-night-bordeaux-2 group-hover:text-toffee-brown"
                  )}
                >
                  {title}
                </span>

                {episode.description && (
                  <span className="mt-1 hidden truncate text-sm leading-relaxed text-coffee-bean/60 md:block">
                    {getLocalizedContent(episode.description, locale)}
                  </span>
                )}
              </span>

              {/* Ação */}
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center transition-all duration-300",
                  isOpen
                    ? "bg-night-bordeaux-2 text-parchment"
                    : "bg-toffee-brown/10 text-toffee-brown group-hover:bg-toffee-brown group-hover:text-parchment"
                )}
                aria-label={isOpen ? closeLabel : listenLabel}
              >
                {isOpen ? (
                  <CloseCircleBold size={18} color="currentColor" />
                ) : (
                  <PlayBold size={16} color="currentColor" />
                )}
              </span>
            </button>

            {isOpen && (
              <div className="bg-white px-1 pb-6 md:px-2">
                <div className="md:pl-[4.5rem]">
                  <PodcastEmbed url={episode.url} title={title} />
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
