import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { SkeletonImage } from "@/_components/SkeletonImage";
import { getRecentSermons } from "@/lib/data/sermons";
import { getRecentPodcasts } from "@/lib/data/podcasts";
import { getRecentArticles } from "@/lib/data/blog";
import { getAllAlbums } from "@/lib/data/albums";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import { getYouTubeThumbnailUrl } from "@/lib/integrations/youtube";
import { resolveMediaAssetUrl } from "@/types/media-asset";
import type { Locale } from "@/types/common";
import {
  StarBoldDuotone,
  VideocameraBold,
  PodcastBold,
  NotebookBold,
  GalleryBold,
} from "solar-icon-set";

type HighlightIcon = React.ComponentType<{ size?: number; color?: string; className?: string }>;

interface HighlightCard {
  key: string;
  href: string;
  image: string | null;
  icon: HighlightIcon;
  typeLabel: string;
  title: string;
  date: string;
  description: string;
}

export async function HighlightsSection() {
  const t = await getTranslations("homepage.highlights");
  const tGallery = await getTranslations("gallery");
  const locale = (await getLocale()) as Locale;

  const [sermons, podcasts, articles, albums] = await Promise.all([
    getRecentSermons(1),
    getRecentPodcasts(1),
    getRecentArticles(1),
    getAllAlbums(),
  ]);

  const sermon = sermons[0];
  const podcast = podcasts[0];
  const article = articles[0];
  const album = albums[0];

  const cards: HighlightCard[] = [];

  if (sermon) {
    cards.push({
      key: "sermon",
      href: `/${locale}/sermons/${sermon.slug}`,
      image: getYouTubeThumbnailUrl(sermon.youtubeVideoId),
      icon: VideocameraBold,
      typeLabel: t("sermon.label"),
      title: getLocalizedContent(sermon.title, locale),
      date: formatDate(sermon.date, locale),
      description: sermon.description ? getLocalizedContent(sermon.description, locale) : "",
    });
  }

  if (podcast) {
    cards.push({
      key: "podcast",
      href: `/${locale}/podcast/${podcast._id}`,
      image: null,
      icon: PodcastBold,
      typeLabel: t("podcast.label"),
      title: getLocalizedContent(podcast.title, locale),
      date: formatDate(podcast.date, locale),
      description: podcast.description ? getLocalizedContent(podcast.description, locale) : "",
    });
  }

  if (article) {
    cards.push({
      key: "blog",
      href: `/${locale}/blog/${article._id}`,
      image: article.featuredImage?.url ? resolveMediaAssetUrl(article.featuredImage.url) : null,
      icon: NotebookBold,
      typeLabel: t("blog.label"),
      title: getLocalizedContent(article.title, locale),
      date: formatDate(article.publishedAt, locale),
      description: getLocalizedContent(article.excerpt, locale),
    });
  }

  if (album) {
    cards.push({
      key: "album",
      href: `/${locale}/gallery/${album.slug}`,
      image: album.images[0]?.url ? resolveMediaAssetUrl(album.images[0].url) : null,
      icon: GalleryBold,
      typeLabel: t("album.label"),
      title: getLocalizedContent(album.title, locale),
      date: `${album.images.length} ${tGallery("photos")}`,
      description: album.description ? getLocalizedContent(album.description, locale) : "",
    });
  }

  if (cards.length === 0) return null;

  return (
    <section className="bg-parchment py-16 md:py-20 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Label — same icon + line treatment used above the sermons list */}
        <div className="flex items-center gap-3">
          <StarBoldDuotone size={18} color="var(--night-bordeaux-2)" />
          <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[0.25em] text-night-bordeaux-2">
            {t("label")}
          </p>
          <span className="h-px flex-1 bg-night-bordeaux-2/15" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.key}
              href={card.href}
              className="group flex h-full flex-col overflow-hidden border border-dust-grey bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video shrink-0 overflow-hidden bg-dust-grey">
                {card.image ? (
                  <SkeletonImage
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-night-bordeaux to-rich-mahogany">
                    <card.icon size={40} color="rgba(255,255,255,0.25)" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[0.18em] text-toffee-brown">
                  {card.date}
                </p>

                <h6 className="mt-2.5 font-serif text-[1.25rem] font-bold leading-[1.3] text-night-bordeaux-2 line-clamp-2 transition-colors duration-200 group-hover:text-toffee-brown">
                  {card.title}
                </h6>

                {card.description && (
                  <p className="mt-3 line-clamp-2 text-[0.875rem] leading-[1.65] text-coffee-bean/75">
                    {card.description}
                  </p>
                )}

                {/* Type badge */}
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <p className="border border-toffee-brown/30 px-2.5 py-1 text-[0.6875rem] uppercase tracking-[0.1em] text-coffee-bean/70">
                    {card.typeLabel}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
