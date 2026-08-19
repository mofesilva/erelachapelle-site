import { format } from "date-fns";
import { fr, pt, enUS } from "date-fns/locale";
import { MapPointBold } from "solar-icon-set";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PeekRectangle } from "@/_components/PeekRectangle";

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
    <article className="group aspect-[3/4]">
      <PeekRectangle color="bordeaux" position="bottom-right" className="h-full">
        <Link
          href={href}
          className={cn("flex h-full flex-col overflow-hidden bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:-translate-y-1")}
        >
          {/* Tamanhos fixados na mão, mesmo motivo do SermonCard da listagem de predicações:
              a escala de `globals.css` é pensada pra título de página, não pra dentro de um
              card — usada crua aqui, a data e o badge gritavam mais que o título. */}
          <div className="flex flex-1 flex-col p-5 md:p-6">
            {/* Date + badge row */}
            <div className="flex items-start justify-between gap-4">
              <time dateTime={date.toISOString()} className="shrink-0">
                <p className="block text-4xl font-bold leading-none text-toffee-brown">
                  {format(date, "d")}
                </p>
                <p className="mt-1.5 block text-[0.75rem] uppercase leading-none tracking-[0.18em] text-rich-mahogany/40">
                  {format(date, "MMM", { locale: dateLocale })}
                </p>
              </time>
              <p
                className={cn(
                  "px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.1em]",
                  badgeColors[type]
                )}
              >
                {typeLabel}
              </p>
            </div>

            {/* Title + meta, agrupados e alinhados embaixo do card */}
            <div className="mt-auto space-y-3 pt-3">
              <h5 className="font-serif text-[1.25rem] font-bold leading-[1.3] text-rich-mahogany group-hover:text-night-bordeaux-2 transition-colors duration-300 line-clamp-2">
                {title}
              </h5>

              {location && (
                <address className="flex items-center gap-2 text-[0.8125rem] text-carbon-black/50 not-italic">
                  <MapPointBold size={14} color="var(--toffee-brown)" className="shrink-0" />
                  <p className="truncate">{location}</p>
                </address>
              )}

              {description && (
                <p className="line-clamp-2 text-[0.875rem] leading-[1.65] text-carbon-black/45">
                  {description}
                </p>
              )}
            </div>
          </div>
        </Link>
      </PeekRectangle>
    </article>
  );
}
