import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { EventCard } from "./EventCard";
import { SplitButton } from "@/components/shared/SplitButton";
import { getRecentEvents } from "@/lib/data/events";
import { getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";
import { Calendar } from "lucide-react";

const eventTypeMap: Record<string, "culte" | "conference" | "jeunesse" | "autre"> = {
  service: "culte",
  conference: "conference",
  youth: "jeunesse",
  community: "autre",
  outreach: "autre",
  prayer: "culte",
  other: "autre",
};

export async function EventsPreviewSection() {
  const t = await getTranslations("homepage.events");
  const tEvents = await getTranslations("events.types");
  const locale = (await getLocale()) as Locale;
  const events = getRecentEvents();

  if (events.length === 0) {
    return (
      <section className="relative bg-[#643036] py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative mx-auto max-w-7xl px-4">
          <SectionLabel label={t("label")} className="[&_span]:text-white/40 [&_.text-primary]:text-[#8C5E35]" />
          <h2 className="mt-6 text-center font-serif text-3xl font-bold text-white md:text-5xl">
            {t("title")}
          </h2>
          <div className="mt-14 flex flex-col items-center gap-4 text-white/40">
            <Calendar className="h-16 w-16" />
            <p className="text-lg font-light">{t("empty")}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-[#643036] py-20 md:py-32 overflow-hidden">
      {/* Decorative dot pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <div className="relative mx-auto max-w-7xl px-4">
        <SectionLabel label={t("label")} className="[&_span]:text-white/40 [&_.text-primary]:text-[#8C5E35]" />
        <h2 className="mt-6 text-center font-serif text-3xl font-bold text-white md:text-5xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-white/30">
          ◆────◆
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event._id}
              date={new Date(event.startDate)}
              type={eventTypeMap[event.eventType] || "autre"}
              title={getLocalizedContent(event.title, locale)}
              location={event.locationId || ""}
              description={getLocalizedContent(event.description, locale)}
              href={`/${locale}/events/${event.slug}`}
              locale={locale}
              typeLabel={tEvents(event.eventType)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <SplitButton href={`/${locale}/events`}>
            {t("cta")}
          </SplitButton>
        </div>
      </div>
    </section>
  );
}
