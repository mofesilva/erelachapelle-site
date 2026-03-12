import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import {
  filterEvents,
  getAllEvents,
  getEventTypes,
} from "@/lib/events";
import { getLocations } from "@/lib/locations";
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
    ? await filterEvents({ eventType: params.type, locationId: params.location })
    : await getAllEvents();

  const eventTypes = await getEventTypes();
  const locations = (await getLocations()).map((l) => ({ id: l._id, name: l.name }));

  return (
    <main>
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-serif font-bold">
            {t("title")}
          </h1>
          <p className="mt-4 text-primary-foreground/80">
            {t("upcoming")}
          </p>
        </div>
      </section>

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
