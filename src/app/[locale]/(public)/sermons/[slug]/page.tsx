import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftBold } from "solar-icon-set";
import { YouTubeEmbed } from "@/_components/YouTubeEmbed";
import { CrossDivider } from "@/_components/CrossDivider";
import { DiamondDivider } from "@/_components/DiamondDivider";
import {
  getSermonBySlug,
  getAllSermons,
  filterSermons,
} from "@/lib/sermons";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import { videoJsonLd } from "@/lib/structured-data";
import type { Locale } from "@/types/common";
import { SermonCard } from "../_components/SermonCard";

type PageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateStaticParams() {
  return [];
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
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0JyBoZWlnaHQ9JzQnPjxyZWN0IHdpZHRoPScxJyBoZWlnaHQ9JzEnIGZpbGw9JyNmZmYnLz48L3N2Zz4=\")",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-6">
          {/* Back link */}
          <Link
            href={`/${locale}/sermons`}
            className="inline-flex items-center gap-1.5 text-sm text-parchment/60 transition-colors hover:text-parchment"
          >
            <ArrowLeftBold size={14} color="currentColor" />
            {t("backToSermons")}
          </Link>

          <div className="mt-8 text-center">
            <CrossDivider variant="white" className="justify-center" />

            <h1 className="mt-8 font-serif font-bold text-parchment md:mt-10">
              {getLocalizedContent(sermon.title, locale)}
            </h1>

            {/* Meta pills */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <p className="inline-flex bg-white/10 px-3 py-1 text-parchment/80">
                {formatDate(sermon.date, locale)}
              </p>
              <p className="inline-flex bg-white/10 px-3 py-1 text-parchment/80">
                {sermon.preacher}
              </p>
              {sermon.biblicalReference && (
                <span className="inline-flex bg-white/10 px-3 py-1 text-parchment/80">
                  {sermon.biblicalReference.book}{" "}
                  {sermon.biblicalReference.chapter}
                  {sermon.biblicalReference.verses &&
                    `:${sermon.biblicalReference.verses}`}
                </span>
              )}
            </div>

            {/* Gold accent */}
            <div className="mx-auto mt-8 flex items-center justify-center gap-2">
              <div className="h-0.5 w-12 bg-toffee-brown/40" />
              <div className="h-1 w-1 rotate-45 bg-toffee-brown/60" />
              <div className="h-0.5 w-12 bg-toffee-brown/40" />
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-parchment py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
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
        </div>
      </section>

      {/* Related sermons */}
      {relatedSermons.length > 0 && (
        <section className="bg-powder-petal py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center">
              <p className="font-bold uppercase tracking-[0.3em] text-toffee-brown/70">
                {t("series")}
              </p>
              <h2 className="mt-3 font-serif font-bold text-night-bordeaux-2">
                {t("relatedSermons")}
              </h2>
              <DiamondDivider
                variant="bordeaux"
                className="mt-5 justify-center"
              />
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
