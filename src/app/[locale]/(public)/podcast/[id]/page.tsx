import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { BackLink } from "@/_components/BackLink";
import { PodcastEmbed } from "@/_components/PodcastEmbed";
import { getAllPodcasts, getPodcastById } from "@/lib/data/podcasts";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";

const HERO_IMAGE = "/images/inside-church.jpg";

type PageProps = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateStaticParams() {
  const episodes = await getAllPodcasts();
  return episodes.map((episode) => ({ id: episode._id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const episode = await getPodcastById(id);
  if (!episode) return {};
  return {
    title: episode.title.fr,
    description: episode.description?.fr,
  };
}

export default async function PodcastEpisodePage({ params }: PageProps) {
  const { id } = await params;
  const t = await getTranslations("podcast");
  const locale = (await getLocale()) as Locale;
  const episode = await getPodcastById(id);

  if (!episode) notFound();

  const title = getLocalizedContent(episode.title, locale);

  return (
    <main>
      {/* Hero — foto de fundo + overlay carbon-black, mesmo padrão do hero de
          /sermons/[slug], com min-h-[50svh] (pedido à parte pra esta página). */}
      <section className="relative min-h-[50svh] overflow-hidden bg-carbon-black pb-16 pt-36 md:pb-20 md:pt-44">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          className="object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-carbon-black/85" />

        <div className="relative mx-auto max-w-7xl px-4">
          <BackLink href={`/${locale}/podcast`}>{t("backToPodcast")}</BackLink>

          <div className="mt-8 text-center">
            <h1 className="mt-6 font-serif font-bold text-parchment md:mt-8">
              {title}
            </h1>
          </div>

          {/* Colofão — data e número do episódio, mesmo tratamento do
              pregador/referência bíblica no hero de /sermons/[slug]. */}
          <div className="mx-auto mt-14 max-w-4xl">
            <div className="h-px bg-parchment/15" />
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 py-8 sm:gap-x-20">
              <div className="text-center">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-toffee-brown">
                  {t("date")}
                </p>
                <p className="mt-2 font-serif text-lg text-parchment">
                  {formatDate(episode.date, locale)}
                </p>
              </div>
              {episode.episodeNumber && (
                <div className="text-center">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-toffee-brown">
                    {t("episode")}
                  </p>
                  <p className="mt-2 font-serif text-lg text-parchment">
                    {episode.episodeNumber}
                  </p>
                </div>
              )}
            </div>
            <div className="h-px bg-parchment/15" />
          </div>
        </div>
      </section>

      {/* Body — único player fora do destaque em /podcast: ao sair desta página, o
          iframe desmonta e o áudio para. */}
      <section className="bg-parchment py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="shadow-lg">
            <PodcastEmbed url={episode.url} title={title} />
          </div>

          {episode.description && (
            <div className="mt-8 border-t border-dust-grey pt-8">
              <p className="font-serif text-[1.125rem] italic leading-[1.7] text-coffee-bean/80 md:text-[1.25rem]">
                <span className="mr-1 font-serif text-5xl font-bold leading-none text-toffee-brown/30">
                  {getLocalizedContent(episode.description, locale).charAt(0)}
                </span>
                {getLocalizedContent(episode.description, locale).slice(1)}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
