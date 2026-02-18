import { format } from "date-fns";
import { fr, pt, enUS } from "date-fns/locale";
import { Play } from "lucide-react";
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
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#643036] to-[#3D000A]">
              <Play className="h-16 w-16 text-white/20" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Play Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-500 group-hover:scale-110 group-hover:bg-white">
              <Play className="h-7 w-7 text-[#643036] fill-[#643036] ml-1" />
            </div>
          </div>

          {/* Series Badge on thumbnail */}
          {series && (
            <div className="absolute top-4 left-4">
              <span className="inline-block rounded-full bg-[#8C5E35] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                {series}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <time
            dateTime={date.toISOString()}
            className="text-xs uppercase tracking-wider text-[#171717]/40"
          >
            {format(date, "d MMMM yyyy", { locale: dateLocale })}
          </time>

          <h3 className="mt-2 font-serif text-xl font-bold text-[#3D000A] line-clamp-2 group-hover:text-[#643036] transition-colors duration-300">
            {title}
          </h3>

          <p className="mt-2 text-sm font-medium text-[#8C5E35]">{preacher}</p>

          {/* Decorative accent */}
          <div className="mt-4 h-0.5 w-8 rounded-full bg-[#8C5E35]/30 transition-all duration-500 group-hover:w-16 group-hover:bg-[#8C5E35]" />
        </div>
      </Link>
    </article>
  );
}
