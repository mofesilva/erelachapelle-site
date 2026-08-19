import { getTranslations, getLocale } from "next-intl/server";
import { UpcomingEventsGrid, type UpcomingEventItem } from "./UpcomingEventsGrid";
import { SplitButton } from "@/_components/SplitButton";
import { SectionLabel } from "@/_components/SectionLabel";
import { getUpcomingEvents } from "@/lib/data/events";
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

  // Busca uma folga a mais (10) que o exibido (3): o corte final por data acontece no
  // cliente, com o relógio de quem visita — essa margem absorve a diferença entre o
  // instante da renderização no servidor e o do navegador.
  const upcoming = await getUpcomingEvents(new Date(), 10);
  const events: UpcomingEventItem[] = upcoming.map((event) => ({
    id: event._id,
    startDate: event.startDate,
    type: eventTypeMap[event.eventType] || "autre",
    title: getLocalizedContent(event.title, locale),
    location: event.location?.name || event.customAddress || "",
    description: getLocalizedContent(event.description, locale),
    href: `/${locale}/events/${event.slug}`,
    typeLabel: tEvents(event.eventType),
  }));

  return (
    <section className="relative bg-parchment py-16 md:pt-16 md:pb-16 overflow-hidden">
      <div className="relative mx-auto max-w-5xl px-6">
        <SectionLabel icon={CalendarBoldDuotone} title={t("label")} align="center" color="gold" />

        <h2 className="mt-4 text-center font-serif text-3xl md:text-4xl text-night-bordeaux-2 leading-snug">
          {t("title")}
        </h2>

        <UpcomingEventsGrid events={events} locale={locale} emptyLabel={t("empty")} />

        <div className="mt-12 text-center">
          <SplitButton href={`/${locale}/events`}>{t("cta")}</SplitButton>
        </div>
      </div>
    </section>
  );
}
