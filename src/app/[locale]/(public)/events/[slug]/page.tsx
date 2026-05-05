import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/_components/ui/badge";
import { GoogleMapEmbed } from "@/_components/GoogleMapEmbed";
import { ShareButtons } from "@/_components/ShareButtons";
import { getEventBySlug, getAllEvents } from "@/lib/data/events";
import { getLocationById } from "@/lib/data/locations";
import { formatDateTime, getLocalizedContent } from "@/lib/utils";
import { eventJsonLd } from "@/lib/structured-data";
import type { Locale } from "@/types/common";
import { CalendarBold, MapPointBold } from "solar-icon-set";
import { EventRegistrationForm } from "../_components/EventRegistrationForm";

type PageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllEvents().map((event) => ({ locale, slug: event.slug }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};
  return {
    title: event.title.fr,
    description: event.description.fr,
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug, locale: paramLocale } = await params;
  const locale = paramLocale as Locale;
  const t = await getTranslations("events");
  const tTypes = await getTranslations("events.types");
  const tCommon = await getTranslations("common");
  const event = getEventBySlug(slug);

  if (!event) notFound();

  const location = getLocationById(event.locationId);
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

              {location && (
                <GoogleMapEmbed
                  address={`${location.address}, ${location.postalCode} ${location.city}`}
                  coordinates={location.coordinates}
                  directionsLabel={tCommon("getDirections")}
                />
              )}

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

                {location && (
                  <div className="flex items-start gap-3">
                    <MapPointBold size={20} color="var(--primary)" className="mt-1" />
                    <div>
                      <p className="font-semibold">{location.name}</p>
                      <p className="text-muted-foreground">
                        {location.address}
                      </p>
                      <p className="text-muted-foreground">
                        {location.postalCode} {location.city}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {event.registrationEnabled && (
                <div className="border p-6">
                  <h6 className="mb-4 font-serif font-semibold">
                    {t("register")}
                  </h6>
                  <EventRegistrationForm eventId={event._id} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
