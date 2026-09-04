import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { fr, pt, enUS } from "date-fns/locale";
import { DownloadBold } from "solar-icon-set";
import { BackLink } from "@/_components/BackLink";
import { YouTubeEmbed } from "@/_components/YouTubeEmbed";
import {
  getSermonBySlug,
  getAllSermons,
  filterSermons,
} from "@/lib/data/sermons";
import { getLocalizedContent } from "@/lib/utils";
import { videoJsonLd } from "@/lib/structured-data";
import type { Locale } from "@/types/common";
import { SermonCard } from "../_components/SermonCard";

const HERO_IMAGE = "/images/inside-church.jpg";
const dateLocales = { fr, pt, en: enUS } as const;

type PageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateStaticParams() {
  const sermons = await getAllSermons();
  return sermons.map((sermon) => ({ slug: sermon.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const sermon = await getSermonBySlug(slug);
  if (!sermon) return {};
  return {
    title: sermon.title.fr,
    description: sermon.description?.fr,
  };
}

export default async function SermonDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const t = await getTranslations("sermons");
  const locale = (await getLocale()) as Locale;
  const dateLocale = dateLocales[locale] ?? fr;
  const sermon = await getSermonBySlug(slug);

  if (!sermon) notFound();

  const sermonDate = new Date(sermon.date);

  // Related sermons from the same series (excluding current)
  const relatedSermons = sermon.series
    ? (await filterSermons({ series: sermon.series }))
      .filter((s) => s._id !== sermon._id)
      .slice(0, 3)
    : [];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(videoJsonLd(sermon, locale)),
        }}
      />

      {/* Hero — foto de fundo + overlay carbon-black, mesmo padrão do hero de
          /events/[slug]: cresce com o conteúdo, sem altura fixa. */}
      <section className="relative overflow-hidden bg-carbon-black pb-16 pt-36 md:pb-20 md:pt-44">
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
          <BackLink href={`/${locale}/sermons`}>{t("backToSermons")}</BackLink>

          <div className="mt-8 text-center">
            {sermon.series && (
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.35em] text-toffee-brown">
                {sermon.series}
              </p>
            )}

            {/* O título é o elemento de destaque aqui, não a data — o bloco de data
                grande faz sentido no evento (o "quando" é a informação central), mas
                na prédication o que importa é o título. */}
            <h1 className="mt-6 font-serif font-bold text-parchment md:mt-8">
              {getLocalizedContent(sermon.title, locale)}
            </h1>

            {sermon.description && (
              <p className="mx-auto mt-6 text-lg leading-relaxed text-parchment/75">
                {getLocalizedContent(sermon.description, locale)}
              </p>
            )}
          </div>

          {/* Colofão — data, pregador e referência bíblica, mesmo tratamento do
              horário/local no hero de /events/[slug]. */}
          <div className="mx-auto mt-14 max-w-4xl">
            <div className="h-px bg-parchment/15" />
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 py-8 sm:gap-x-20">
              <div className="text-center">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-toffee-brown">
                  {t("filterByDate")}
                </p>
                <p className="mt-2 font-serif text-lg text-parchment">
                  {format(sermonDate, "d MMMM yyyy", { locale: dateLocale })}
                </p>
              </div>
              {sermon.preacher && (
                <div className="text-center">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-toffee-brown">
                    {t("preacher")}
                  </p>
                  <p className="mt-2 font-serif text-lg text-parchment">
                    {sermon.preacher}
                  </p>
                </div>
              )}
              {sermon.biblicalReference && (
                <div className="text-center">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-toffee-brown">
                    {t("biblicalRef")}
                  </p>
                  <p className="mt-2 font-serif text-lg text-parchment">
                    {sermon.biblicalReference.book}{" "}
                    {sermon.biblicalReference.chapter}
                    {sermon.biblicalReference.verses &&
                      `:${sermon.biblicalReference.verses}`}
                  </p>
                </div>
              )}
            </div>
            <div className="h-px bg-parchment/15" />
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-parchment py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          {/* Video embed */}
          <div className="overflow-hidden shadow-lg">
            <YouTubeEmbed
              videoId={sermon.youtubeVideoId}
              title={getLocalizedContent(sermon.title, locale)}
            />
          </div>

          {/* Series info */}
          {sermon.series && (
            <div className="mt-8 border border-dust-grey bg-white p-6">
              <p className="font-bold uppercase tracking-[0.2em] text-toffee-brown">
                {t("series")}
              </p>
              <p className="mt-2 font-serif font-bold text-night-bordeaux-2">
                {sermon.series}
              </p>
            </div>
          )}

          {/* Notes download */}
          {sermon.notes && (
            <a
              href={sermon.notes.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center justify-center gap-2 border border-toffee-brown/40 bg-white px-6 py-3 font-bold uppercase tracking-[0.15em] text-night-bordeaux-2 transition-colors hover:border-toffee-brown hover:bg-powder-petal"
            >
              <DownloadBold size={18} color="currentColor" />
              {t("downloadNotes")}
            </a>
          )}
        </div>
      </section>

      {/* Related sermons */}
      {relatedSermons.length > 0 && (
        <section className="bg-parchment py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <p className="font-bold uppercase tracking-[0.3em] text-toffee-brown/70">
                {t("series")}
              </p>
              <h2 className="mt-3 font-serif font-bold text-night-bordeaux-2">
                {t("relatedSermons")}
              </h2>
              
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedSermons.map((s) => (
                <SermonCard key={s._id} sermon={s} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
