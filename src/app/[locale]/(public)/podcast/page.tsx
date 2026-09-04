import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import { PodcastBoldDuotone } from "solar-icon-set";
import { getPodcastsPage, searchPodcasts } from "@/lib/data/podcasts";
import type { Locale } from "@/types/common";
import { EpisodesList } from "./_components/EpisodesList";
import { FeaturedPodcast } from "./_components/FeaturedPodcast";
import { PodcastCard } from "./_components/PodcastCard";
import { PodcastFilters } from "./_components/PodcastFilters";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("podcast");
  return {
    title: t("title"),
    description: t("heroSubtitle"),
  };
}

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function PodcastPage({ searchParams }: PageProps) {
  const t = await getTranslations("podcast");
  const locale = (await getLocale()) as Locale;
  const params = await searchParams;
  const { episodes, totalPages } = await getPodcastsPage(1);

  const [latest, ...rest] = episodes;

  // Busca por texto varre a base inteira (a API não filtra no servidor), mesmo padrão
  // do /blog — o episódio em destaque não muda com a busca, só a lista abaixo dele.
  const hasQuery = !!params.q;
  const searchResults = hasQuery ? await searchPodcasts(params.q!, locale) : null;

  return (
    <main className="flex flex-1 flex-col">
      {/* Bloco bordeaux do topo com o episódio mais recente em destaque — mesmo
          tratamento do FeaturedSermon em /sermons. */}
      <section className="relative flex min-h-[50svh] flex-col justify-center bg-night-bordeaux-2 pb-16 pt-32 md:pb-20 md:pt-40">
        <Image
          src="/images/inside-church.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 bg-night-bordeaux-2/80" />
        <div className="relative">
          {latest ? (
            <FeaturedPodcast
              episode={latest}
              locale={locale}
              episodeLabel={t("episode")}
            />
          ) : (
            <div className="mx-auto max-w-7xl px-4">
              <h1 className="font-serif text-[1.75rem] font-bold text-parchment md:text-[2.5rem]">
                {t("title")}
              </h1>
              <p className="mt-3 text-parchment/70">{t("heroSubtitle")}</p>
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-1 flex-col bg-parchment py-16 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-4">
          <div className="flex items-center gap-3">
            <PodcastBoldDuotone size={18} color="var(--night-bordeaux-2)" />
            <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[0.25em] text-night-bordeaux-2">
              {t("allEpisodes")}
            </p>
            <span className="h-px flex-1 bg-night-bordeaux-2/15" />
          </div>

          <div className="mt-8">
            <Suspense fallback={null}>
              <PodcastFilters />
            </Suspense>
          </div>

          {hasQuery ? (
            searchResults!.length === 0 ? (
              <p className="mt-12 text-center font-serif italic text-coffee-bean/50">
                {t("noEpisodes")}
              </p>
            ) : (
              <div className="mt-4">
                {searchResults!.map((episode) => (
                  <PodcastCard
                    key={episode._id}
                    episode={episode}
                    locale={locale}
                    episodeLabel={t("episode")}
                    listenLabel={t("listen")}
                  />
                ))}
              </div>
            )
          ) : rest.length === 0 ? (
            <p className="mt-12 text-center font-serif italic text-coffee-bean/50">
              {t("noEpisodes")}
            </p>
          ) : (
            <EpisodesList
              initialEpisodes={rest}
              initialTotalPages={totalPages}
              locale={locale}
              episodeLabel={t("episode")}
              listenLabel={t("listen")}
              loadMoreLabel={t("loadMore")}
            />
          )}
        </div>
      </section>
    </main>
  );
}
