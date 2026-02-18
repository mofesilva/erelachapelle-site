import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { YouTubeEmbed } from "@/components/shared/YouTubeEmbed";
import { getSermonBySlug, getAllSermons } from "@/lib/data/sermons";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import { videoJsonLd } from "@/lib/structured-data";
import type { Locale } from "@/types/common";

type PageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateStaticParams() {
  return getAllSermons().map((sermon) => ({ slug: sermon.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const sermon = getSermonBySlug(slug);
  if (!sermon) return {};
  return {
    title: sermon.title.fr,
    description: sermon.description?.fr,
  };
}

export default async function SermonDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const t = await getTranslations("sermons");
  const tCommon = await getTranslations("common");
  const locale = (await getLocale()) as Locale;
  const sermon = getSermonBySlug(slug);

  if (!sermon) notFound();

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(videoJsonLd(sermon, locale)),
        }}
      />
      <section className="bg-primary py-12 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4">
          <Link
            href={`/${locale}/sermons`}
            className="text-sm text-primary-foreground/70 hover:text-primary-foreground"
          >
            ← {tCommon("back")}
          </Link>
          <h1 className="mt-4 font-serif text-3xl font-bold md:text-4xl">
            {getLocalizedContent(sermon.title, locale)}
          </h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-primary-foreground/80">
            <span>{formatDate(sermon.date, locale)}</span>
            <span>·</span>
            <span>{sermon.preacher}</span>
            {sermon.biblicalReference && (
              <>
                <span>·</span>
                <span>
                  {sermon.biblicalReference.book}{" "}
                  {sermon.biblicalReference.chapter}
                  {sermon.biblicalReference.verses &&
                    `:${sermon.biblicalReference.verses}`}
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4">
          <YouTubeEmbed
            videoId={sermon.youtubeVideoId}
            title={getLocalizedContent(sermon.title, locale)}
          />

          {sermon.description && (
            <div className="mt-8">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {getLocalizedContent(sermon.description, locale)}
              </p>
            </div>
          )}

          {sermon.series && (
            <div className="mt-6 rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">{t("series")}:</span>{" "}
                {sermon.series}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
