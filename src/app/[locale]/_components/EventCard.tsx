import { format } from "date-fns";
import { fr, pt, enUS } from "date-fns/locale";
import { MapPin } from "lucide-react";
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
  culte: "bg-[#8C5E35] text-white",
  conference: "bg-[#D1A594] text-[#3D000A]",
  jeunesse: "bg-[#643036] text-white",
  autre: "bg-[#3D000A] text-white",
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
        className="block overflow-hidden rounded-2xl bg-[#8C5E35] shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(106,13,30,0.12)] hover:-translate-y-1"
      >
        {/* Date Header with gradient */}
        <div className="bg-gradient-to-r from-[#8C5E35] to-[#A67342] px-6 py-4 text-center">
          <time dateTime={date.toISOString()} className="block">
            <span className="block text-4xl font-bold text-white leading-none">
              {format(date, "d")}
            </span>
            <span className="mt-1 block text-sm uppercase tracking-widest text-white/70">
              {format(date, "MMMM", { locale: dateLocale })}
            </span>
          </time>
        </div>

        {/* Content */}
        <div className="bg-white p-6">
          {/* Type Badge */}
          <span
            className={cn(
              "inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
              badgeColors[type]
            )}
          >
            {typeLabel}
          </span>

          {/* Title */}
          <h3 className="mt-3 font-serif text-xl font-bold text-[#3D000A] line-clamp-2 group-hover:text-[#643036] transition-colors duration-300">
            {title}
          </h3>

          {/* Location */}
          {location && (
            <address className="mt-3 flex items-center gap-2 text-sm text-[#171717]/60 not-italic">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-[#8C5E35]" />
              <span className="truncate">{location}</span>
            </address>
          )}

          {/* Description */}
          {description && (
            <p className="mt-3 text-sm text-[#171717]/50 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Decorative accent */}
          <div className="mt-5 h-0.5 w-8 rounded-full bg-[#8C5E35]/30 transition-all duration-500 group-hover:w-16 group-hover:bg-[#8C5E35]" />
        </div>
      </Link>
    </article>
  );
}
