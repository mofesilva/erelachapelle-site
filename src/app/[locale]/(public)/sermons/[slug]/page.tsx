import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftBold, DownloadBold } from "solar-icon-set";
import { YouTubeEmbed } from "@/_components/YouTubeEmbed";
import {
  getSermonBySlug,
  getAllSermons,
  filterSermons,
} from "@/lib/data/sermons";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import { videoJsonLd } from "@/lib/structured-data";
import type { Locale } from "@/types/common";
import { SermonCard } from "../_components/SermonCard";

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
  const sermon = await getSermonBySlug(slug);

  if (!sermon) notFound();

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

      {/* Hero */}
      <section className="relative bg-night-bordeaux-2 pb-16 pt-36 md:pb-20 md:pt-44">
        {/* Texture overlay */}
      

        <div className="relative mx-auto max-w-7xl px-4">
          {/* Back link */}
          <Link
            href={`/${locale}/sermons`}
            className="inline-flex items-center gap-1.5 text-md text-parchment/60 transition-colors hover:text-parchment"
          >
            <ArrowLeftBold size={14} color="currentColor" />
            {t("backToSermons")}
          </Link>

          <div className="mt-8 text-center">

            <h1 className="mt-8 font-serif font-bold text-parchment md:mt-10">
              {getLocalizedContent(sermon.title, locale)}
            </h1>

            {/* Meta — mesmas badges com borda usadas no destaque de /sermons; sem o
                pregador aqui. Data e referência bíblica com o mesmo tratamento. */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="border border-parchment/25 px-2.5 py-1 text-[0.6875rem] uppercase tracking-[0.1em] text-parchment/70">
                {formatDate(sermon.date, locale)}
              </span>
              {sermon.biblicalReference && (
                <span className="border border-parchment/25 px-2.5 py-1 text-[0.6875rem] uppercase tracking-[0.1em] text-parchment/70">
                  {sermon.biblicalReference.book}{" "}
                  {sermon.biblicalReference.chapter}
                  {sermon.biblicalReference.verses &&
                    `:${sermon.biblicalReference.verses}`}
                </span>
              )}
            </div>
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

          {/* Description */}
          {sermon.description && (
            <div className="mt-10">
              <p className="leading-relaxed text-coffee-bean">
                <span className="font-serif text-5xl font-bold leading-none text-toffee-brown/30">
                  {getLocalizedContent(sermon.description, locale).charAt(0)}
                </span>
                {getLocalizedContent(sermon.description, locale).slice(1)}
              </p>
            </div>
          )}

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
        <section className="bg-powder-petal py-16 md:py-20">
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
