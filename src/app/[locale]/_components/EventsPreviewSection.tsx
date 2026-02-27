import { getTranslations, getLocale } from "next-intl/server";
import { EventCard } from "./EventCard";
import { SplitButton } from "@/_components/SplitButton";
import { SectionLabel } from "@/_components/SectionLabel";
import { getRecentEvents } from "@/lib/data/events";
import { getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";
import { CalendarBoldDuotone } from "solar-icon-set";

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
      <section className="relative bg-parchment py-16 md:pt-32 md:pb-16 overflow-hidden">
        <div className="relative mx-auto max-w-5xl px-6">
          <SectionLabel icon={CalendarBoldDuotone} title={t("title")} />
          <div className="mt-14 flex flex-col items-center gap-4 text-rich-mahogany/30">
            <CalendarBoldDuotone size={48} />
            <p className="font-light">{t("empty")}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-parchment py-16 md:pt-16 md:pb-16 overflow-hidden">

      <div className="relative mx-auto max-w-5xl">
        {/* Centered header */}
        <SectionLabel icon={CalendarBoldDuotone} title={t("title")} />

        {/* Events list */}
        <div className="mt-12 md:mt-14 space-y-8 md:space-y-0 md:grid md:gap-8 md:grid-cols-3">
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
