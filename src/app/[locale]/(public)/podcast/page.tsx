import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { PodcastBoldDuotone } from "solar-icon-set";
import { getPodcastsPage } from "@/lib/data/podcasts";
import type { Locale } from "@/types/common";
import { EpisodesList } from "./_components/EpisodesList";
import { FeaturedPodcast } from "./_components/FeaturedPodcast";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("podcast");
  return {
    title: t("title"),
    description: t("heroSubtitle"),
  };
}

export default async function PodcastPage() {
  const t = await getTranslations("podcast");
  const locale = (await getLocale()) as Locale;
  const { episodes, totalPages } = await getPodcastsPage(1);

  const [latest, ...rest] = episodes;

  return (
    <main>
      {/* Bloco bordeaux do topo com o episódio mais recente em destaque — mesmo
          tratamento do FeaturedSermon em /sermons. */}
      <section className="bg-night-bordeaux-2 pb-16 pt-32 md:pb-20 md:pt-40">
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
      </section>

      <section className="bg-powder-petal py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-3">
            <PodcastBoldDuotone size={18} color="var(--night-bordeaux-2)" />
            <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[0.25em] text-night-bordeaux-2">
              {t("allEpisodes")}
            </p>
            <span className="h-px flex-1 bg-night-bordeaux-2/15" />
          </div>

          {rest.length === 0 ? (
            <p className="mt-12 text-center font-serif italic text-coffee-bean/50">
              {t("noEpisodes")}
            </p>
          ) : (
            <EpisodesList
              initialEpisodes={rest}
              initialTotalPages={totalPages}
              locale={locale}
              episodeLabel={t("episode")}
              loadMoreLabel={t("loadMore")}
            />
          )}
        </div>
      </section>
    </main>
  );
}
