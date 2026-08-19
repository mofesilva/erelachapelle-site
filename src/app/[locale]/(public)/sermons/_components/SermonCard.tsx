import Link from "next/link";
import { PlayBold } from "solar-icon-set";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import { getYouTubeThumbnailUrl } from "@/lib/integrations/youtube";
import type { Locale } from "@/types/common";
import type { Sermon } from "@/types/sermon";
import { SkeletonImage } from "@/_components/SkeletonImage";

interface SermonCardProps {
  sermon: Sermon;
  locale: Locale;
}

export function SermonCard({ sermon, locale }: SermonCardProps) {
  return (      <Link
        href={`/${locale}/sermons/${sermon.slug}`}
        className="group block overflow-hidden border border-dust-grey bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-dust-grey">
          <SkeletonImage
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
            <div className="flex h-12 w-12 items-center justify-center bg-white/90 shadow-md">
              <PlayBold size={20} color="var(--night-bordeaux-2)" />
            </div>
          </div>
        </div>

        {/* Content — tamanhos fixados na mão: a escala de `globals.css` é de título de
            página (`p` a 18px, `h6` a 22px), o que dentro do card deixava a data em
            maiúscula do mesmo tamanho do título, gritando mais que ele. */}
        <div className="p-5 md:p-6">
          <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[0.18em] text-toffee-brown">
            {formatDate(sermon.date, locale)}
          </p>

          <h6 className="mt-2.5 font-serif text-[1.25rem] font-bold leading-[1.3] text-night-bordeaux-2 transition-colors duration-200 group-hover:text-toffee-brown">
            {getLocalizedContent(sermon.title, locale)}
          </h6>

          {sermon.description && (
            <p className="mt-3 line-clamp-2 text-[0.875rem] leading-[1.65] text-coffee-bean/75">
              {getLocalizedContent(sermon.description, locale)}
            </p>
          )}

          {/* Badges */}
          {(sermon.series || sermon.biblicalReference) && (
            <>
              <div className="mt-4 flex flex-wrap gap-2">
                {sermon.series && (
                  <p className="border border-toffee-brown/30 px-2.5 py-1 text-[0.6875rem] uppercase tracking-[0.1em] text-coffee-bean/70">
                    {sermon.series}
                  </p>
                )}
                {sermon.biblicalReference && (
                  <p className="border border-dust-grey px-2.5 py-1 text-[0.6875rem] uppercase tracking-[0.1em] text-coffee-bean/70">
                    {sermon.biblicalReference.book}{" "}
                    {sermon.biblicalReference.chapter}
                    {sermon.biblicalReference.verses &&
                      `:${sermon.biblicalReference.verses}`}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </Link>
  );
}
