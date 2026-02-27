import Link from "next/link";
import Image from "next/image";
import { PlayBold } from "solar-icon-set";
import { DiamondDivider } from "@/_components/DiamondDivider";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import { getYouTubeThumbnailUrl } from "@/lib/integrations/youtube";
import type { Locale } from "@/types/common";
import type { Sermon } from "@/types/sermon";

interface SermonCardProps {
  sermon: Sermon;
  locale: Locale;
}

export function SermonCard({ sermon, locale }: SermonCardProps) {
  return (
    <Link
      href={`/${locale}/sermons/${sermon.slug}`}
      className="group block overflow-hidden rounded-xl border border-dust-grey bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-dust-grey">
        <Image
          src={getYouTubeThumbnailUrl(sermon.youtubeVideoId)}
          alt={getLocalizedContent(sermon.title, locale)}
          width={480}
          height={270}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          unoptimized
        />
        {/* Play overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-night-bordeaux-2/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-md">
            <PlayBold size={20} color="var(--night-bordeaux-2)" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-toffee-brown">
          {formatDate(sermon.date, locale)} · {sermon.preacher}
        </span>

        <h3 className="mt-2 font-serif text-lg font-bold text-night-bordeaux-2 transition-colors duration-200 group-hover:text-toffee-brown">
          {getLocalizedContent(sermon.title, locale)}
        </h3>

        {sermon.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-coffee-bean/80">
            {getLocalizedContent(sermon.description, locale)}
          </p>
        )}

        {/* Divider + Badges */}
        {(sermon.series || sermon.biblicalReference) && (
          <>
            <DiamondDivider
              variant="bordeaux"
              className="mt-4 justify-start"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {sermon.series && (
                <span className="rounded-full border border-toffee-brown/30 px-3 py-0.5 text-xs text-coffee-bean/70">
                  {sermon.series}
                </span>
              )}
              {sermon.biblicalReference && (
                <span className="rounded-full border border-dust-grey px-3 py-0.5 text-xs text-coffee-bean/70">
                  {sermon.biblicalReference.book}{" "}
                  {sermon.biblicalReference.chapter}
                  {sermon.biblicalReference.verses &&
                    `:${sermon.biblicalReference.verses}`}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
