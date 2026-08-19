import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/_components/ui/badge";
import { GoogleMapEmbed } from "@/_components/GoogleMapEmbed";
import { ShareButtons } from "@/_components/ShareButtons";
import { getEventBySlug, getAllEvents } from "@/lib/data/events";
import { formatDateTime, getLocalizedContent } from "@/lib/utils";
import { eventJsonLd } from "@/lib/structured-data";
import type { Locale } from "@/types/common";
import { CalendarBold, MapPointBold } from "solar-icon-set";

type PageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateStaticParams() {
  const events = await getAllEvents();
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return {
    title: event.title.fr,
    description: event.description.fr,
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const t = await getTranslations("events");
  const tTypes = await getTranslations("events.types");
  const tCommon = await getTranslations("common");
  const locale = (await getLocale()) as Locale;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const pageUrl = `https://erelachapelle.fr/${locale}/events/${event.slug}`;

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventJsonLd(event, locale)),
        }}
      />
      <section className="bg-primary py-12 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4">
          <Link
            href={`/${locale}/events`}
            className="text-sm text-primary-foreground/70 hover:text-primary-foreground"
          >
            ← {tCommon("back")}
          </Link>
          <h1 className="mt-4 font-serif font-bold">
            {getLocalizedContent(event.title, locale)}
          </h1>
          <Badge className="mt-4 bg-primary-foreground/20 text-primary-foreground">
            {tTypes(event.eventType)}
          </Badge>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-8 md:col-span-2">
              <p className="leading-relaxed text-muted-foreground">
                {getLocalizedContent(event.description, locale)}
              </p>

              <GoogleMapEmbed
                address={event.customAddress || event.location.address}
                coordinates={event.location.coordinates}
                directionsLabel={tCommon("getDirections")}
              />

              <ShareButtons
                url={pageUrl}
                title={getLocalizedContent(event.title, locale)}
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-6 bg-muted/50 p-6">
                <div className="flex items-start gap-3">
                  <CalendarBold size={20} color="var(--primary)" className="mt-1" />
                  <div>
                    <p className="font-semibold">
                      {formatDateTime(event.startDate, locale)}
                    </p>
                    {event.endDate && (
                      <p className="text-muted-foreground">
                        → {formatDateTime(event.endDate, locale)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPointBold size={20} color="var(--primary)" className="mt-1" />
                  <div>
                    <p className="font-semibold">{event.location.name}</p>
                    <p className="text-muted-foreground">
                      {event.customAddress || event.location.address}
                    </p>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
