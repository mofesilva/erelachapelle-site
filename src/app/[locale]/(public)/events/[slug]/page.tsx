import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { fr, pt, enUS } from "date-fns/locale";
import { BackLink } from "@/_components/BackLink";
import { GoogleMapEmbed } from "@/_components/GoogleMapEmbed";
import { ShareButtons } from "@/_components/ShareButtons";
import { SplitButton } from "@/_components/SplitButton";
import { getEventBySlug, getAllEvents, getUpcomingEvents } from "@/lib/data/events";
import { getDirectionsUrl } from "@/lib/integrations/maps";
import { getLocalizedContent } from "@/lib/utils";
import { eventJsonLd } from "@/lib/structured-data";
import { resolveMediaAssetUrl } from "@/types/media-asset";
import type { Locale } from "@/types/common";
import type { Event } from "@/types/event";

const FALLBACK_HERO_IMAGE = "/images/inside-church.jpg";

const dateLocales = { fr, pt, en: enUS } as const;

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

function EventRow({ event, locale, typeLabel }: { event: Event; locale: Locale; typeLabel: string }) {
  const date = new Date(event.startDate);
  const dateLocale = dateLocales[locale] ?? fr;
  return (
    <Link
      href={`/${locale}/events/${event.slug}`}
      className="group flex items-baseline gap-7 border-t border-night-bordeaux-2/15 py-6 transition-colors last:border-b hover:bg-night-bordeaux-2/[0.03]"
    >
      <p className="w-14 shrink-0 font-serif text-2xl text-night-bordeaux-2">{format(date, "d")}</p>
      <div className="flex-1">
        <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-toffee-brown">
          {format(date, "EEEE", { locale: dateLocale })} · {format(date, "MMMM", { locale: dateLocale })} · {typeLabel}
        </p>
        <p className="mt-1 font-serif text-xl text-night-bordeaux-2">{getLocalizedContent(event.title, locale)}</p>
      </div>
      <span className="self-center text-xs font-semibold uppercase tracking-[0.1em] text-night-bordeaux-2 opacity-70 transition-opacity group-hover:opacity-100">
        Voir →
      </span>
    </Link>
  );
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const t = await getTranslations("events");
  const tTypes = await getTranslations("events.types");
  const tCommon = await getTranslations("common");
  const locale = (await getLocale()) as Locale;
  const dateLocale = dateLocales[locale] ?? fr;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const pageUrl = `https://erelachapelle.fr/${locale}/events/${event.slug}`;
  const address = event.customAddress || event.location.address;
  const directionsHref = getDirectionsUrl(event.location.coordinates.lat, event.location.coordinates.lng);
  const description = getLocalizedContent(event.description, locale);
  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;
  const typeLabel = tTypes(event.eventType);

  const otherEvents = (await getUpcomingEvents(new Date(), 4))
    .filter((e) => e._id !== event._id)
    .slice(0, 3);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventJsonLd(event, locale)),
        }}
      />

      {/* Hero — foto real + fundo carbon-black (não bordeaux); reúne título, data,
          descrição e o colofão de data/tipo/local — cresce com o conteúdo, sem altura
          fixa. Único container de largura em toda a página: max-w-7xl px-4, igual ao
          Header (src/app/[locale]/_components/Header.tsx). */}
      <section className="relative overflow-hidden bg-carbon-black pb-16 pt-36 md:pb-20 md:pt-44">
        <Image
          src={event.featuredImage?.url ? resolveMediaAssetUrl(event.featuredImage.url) : FALLBACK_HERO_IMAGE}
          alt=""
          fill
          priority
          className="object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-carbon-black/85" />

        <div className="relative mx-auto max-w-7xl px-4">
          <BackLink href={`/${locale}/events`}>{t("backToEvents")}</BackLink>

          <div className="mt-8 text-center">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.35em] text-toffee-brown">
              {typeLabel}
            </p>

            {/* Bloco de data empilhado: dia grande em cima, mês/ano embaixo — mesma
                hierarquia do EventCard, só centralizado e maior. Dia na cor-assinatura
                (toffee-brown); mês/ano em parchment, não dourado, pra continuar legível
                sobre a foto. */}
            <div className="mt-7 flex flex-col items-center">
              <span className="font-serif text-[6.5rem] font-normal leading-none text-toffee-brown md:text-[8.5rem]">
                {format(startDate, "d")}
              </span>
              <span className="mt-3 font-serif text-2xl leading-none text-parchment md:text-3xl">
                {format(startDate, "MMMM", { locale: dateLocale })}
              </span>
              <span className="mt-1.5 font-serif text-base leading-none text-parchment/60 md:text-lg">
                {format(startDate, "yyyy")}
              </span>
            </div>

            <h1 className="mt-6 font-serif font-bold text-parchment">
              {getLocalizedContent(event.title, locale)}
            </h1>

            {description && (
              <p className="mx-auto mt-6 text-lg leading-relaxed text-parchment/75">{description}</p>
            )}
          </div>

          {/* Colofão — só horário e local, texto centralizado. */}
          <div className="mx-auto mt-14 max-w-4xl">
            <div className="h-px bg-parchment/15" />
            <div className="flex flex-wrap justify-center gap-12 py-8 sm:flex-nowrap sm:gap-20">
              <div className="flex-1 text-center">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-toffee-brown">
                  {t("time")}
                </p>
                <p className="mt-2 font-serif text-lg text-parchment">
                  {format(startDate, "HH:mm")}
                  {endDate ? ` – ${format(endDate, "HH:mm")}` : ""}
                </p>
              </div>
              <div className="flex-1 text-center">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-toffee-brown">
                  {t("filterByLocation")}
                </p>
                <p className="mt-2 font-serif text-lg text-parchment">{event.location.name}</p>
                <p className="mt-1 text-sm text-parchment/60">{address}</p>
              </div>
            </div>
            <div className="h-px bg-parchment/15" />
          </div>
        </div>
      </section>

      {/* Corpo — só mapa, itinerário e compartilhamento. */}
      <section className="bg-parchment py-16 md:py-20">
        <div className="mx-auto max-w-7xl space-y-10 px-4">
          <div className="overflow-hidden border border-dust-grey shadow-md">
            <GoogleMapEmbed address={address} coordinates={event.location.coordinates} showDirections={false} />
          </div>

          <div className="flex justify-center">
            <SplitButton href={directionsHref} variant="burgundy" external>
              {tCommon("getDirections")}
            </SplitButton>
          </div>

          <div className="border-t border-dust-grey pt-8">
            <ShareButtons url={pageUrl} title={getLocalizedContent(event.title, locale)} />
          </div>
        </div>
      </section>

      {/* Autres événements — liste éditoriale, pas des cartes. */}
      {otherEvents.length > 0 && (
        <section className="bg-parchment py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.3em] text-toffee-brown/70">
                {t("title")}
              </p>
              <h2 className="mt-3 font-serif font-bold text-night-bordeaux-2">{t("moreEvents")}</h2>
            </div>

            <div className="mx-auto mt-14">
              {otherEvents.map((e) => (
                <EventRow key={`${e._id}-${e.startDate}`} event={e} locale={locale} typeLabel={tTypes(e.eventType)} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
