import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import { SecondaryHeroSection } from "@/_components/SecondaryHeroSection";
import {
  filterEvents,
  getAllEvents,
  getEventTypes,
} from "@/lib/data/events";
import { getLocations } from "@/lib/data/locations";
import type { Locale } from "@/types/common";
import { EventCard } from "./_components/EventCard";
import { EventFilters } from "./_components/EventFilters";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("events");
  return {
    title: t("title"),
    description: t("upcoming"),
  };
}

type PageProps = {
  searchParams: Promise<{ type?: string; location?: string }>;
};

export default async function EventsPage({ searchParams }: PageProps) {
  const t = await getTranslations("events");
  const tTypes = await getTranslations("events.types");
  const locale = (await getLocale()) as Locale;
  const params = await searchParams;

  const hasFilters = params.type || params.location;
  const events = hasFilters
    ? filterEvents({ eventType: params.type, locationId: params.location })
    : getAllEvents();

  const eventTypes = getEventTypes();
  const locations = getLocations().map((l) => ({ id: l._id, name: l.name }));

  return (
    <main>
      <SecondaryHeroSection
        title={t("title")}
        description={t("upcoming")}
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <Suspense fallback={null}>
              <EventFilters eventTypes={eventTypes} locations={locations} />
            </Suspense>
          </div>

          {events.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {t("noEvents")}
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  locale={locale}
                  typeLabel={tTypes(event.eventType)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
