import { format } from "date-fns";
import { fr, pt, enUS } from "date-fns/locale";
import { MapPointBold } from "solar-icon-set";
import Link from "next/link";
import { cn } from "@/lib/utils";

type EventType = "culte" | "conference" | "jeunesse" | "autre";

interface EventCardProps {
  date: Date;
  type: EventType;
  title: string;
  location: string;
  description?: string;
  href: string;
  locale?: string;
  typeLabel: string;
}

const badgeColors: Record<EventType, string> = {
  culte: "bg-toffee-brown text-white",
  conference: "bg-powder-petal text-rich-mahogany",
  jeunesse: "bg-night-bordeaux-2 text-white",
  autre: "bg-rich-mahogany text-white",
};

const localeMap = {
  fr: fr,
  pt: pt,
  en: enUS,
};

export function EventCard({
  date,
  type,
  title,
  location,
  description,
  href,
  locale = "fr",
  typeLabel,
}: EventCardProps) {
  const dateLocale = localeMap[locale as keyof typeof localeMap] || fr;

  return (
    <article className="group">
      <Link
        href={href}
        className="block overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-rich-mahogany/8 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:-translate-y-1"
      >
        <div className="p-5 md:p-6">
          {/* Date + badge row */}
          <div className="flex items-start justify-between gap-4">
            <time dateTime={date.toISOString()} className="shrink-0">
              <span className="block text-3xl font-bold text-toffee-brown leading-none">
                {format(date, "d")}
              </span>
              <span className="mt-0.5 block text-xs uppercase tracking-widest text-rich-mahogany/40">
                {format(date, "MMM", { locale: dateLocale })}
              </span>
            </time>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
                badgeColors[type]
              )}
            >
              {typeLabel}
            </span>
          </div>

          {/* Title */}
          <h5 className="mt-4 font-serif font-bold text-rich-mahogany line-clamp-2 group-hover:text-night-bordeaux-2 transition-colors duration-300">
            {title}
          </h5>

          {/* Location */}
          {location && (
            <address className="mt-3 flex items-center gap-2 text-sm text-carbon-black/50 not-italic">
              <MapPointBold size={14} color="var(--toffee-brown)" className="shrink-0" />
              <span className="truncate">{location}</span>
            </address>
          )}

          {/* Description */}
          {description && (
            <p className="mt-3 text-carbon-black/45 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
