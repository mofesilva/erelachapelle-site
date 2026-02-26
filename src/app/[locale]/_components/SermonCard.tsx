import { format } from "date-fns";
import { fr, pt, enUS } from "date-fns/locale";
import { PlayBold } from "solar-icon-set";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SermonCardProps {
  thumbnail: string;
  date: Date;
  preacher: string;
  series: string;
  title: string;
  videoUrl: string;
  locale?: string;
}

const localeMap = {
  fr: fr,
  pt: pt,
  en: enUS,
};

export function SermonCard({
  thumbnail,
  date,
  preacher,
  series,
  title,
  videoUrl,
  locale = "fr",
}: SermonCardProps) {
  const dateLocale = localeMap[locale as keyof typeof localeMap] || fr;

  return (
    <article className="group">
      <Link
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_16px_50px_rgba(106,13,30,0.15)] hover:-translate-y-1"
      >
        {/* Thumbnail with Play Overlay */}
        <div className="relative aspect-video overflow-hidden">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={`${title} - ${series}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-night-bordeaux to-rich-mahogany">
              <PlayBold size={64} color="rgba(255,255,255,0.2)" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Play Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-500 group-hover:scale-110 group-hover:bg-white">
              <PlayBold size={28} color="var(--night-bordeaux)" className="ml-1" />
            </div>
          </div>

          {/* Series Badge on thumbnail */}
          {series && (
            <div className="absolute top-4 left-4">
              <span className="inline-block rounded-full bg-toffee-brown px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                {series}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <time
            dateTime={date.toISOString()}
            className="text-xs uppercase tracking-wider text-carbon-black/40"
          >
            {format(date, "d MMMM yyyy", { locale: dateLocale })}
          </time>

          <h3 className="mt-2 font-serif text-xl font-bold text-rich-mahogany line-clamp-2 group-hover:text-night-bordeaux transition-colors duration-300">
            {title}
          </h3>

          <p className="mt-2 text-sm font-medium text-toffee-brown">{preacher}</p>

          {/* Decorative accent */}
          <div className="mt-4 h-0.5 w-8 rounded-full bg-toffee-brown/30 transition-all duration-500 group-hover:w-16 group-hover:bg-toffee-brown" />
        </div>
      </Link>
    </article>
  );
}
