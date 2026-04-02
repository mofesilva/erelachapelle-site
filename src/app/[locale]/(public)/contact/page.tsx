import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { getLocations } from "@/lib/data/locations";
import { getLocalizedContent } from "@/lib/utils";
import { getDirectionsUrl } from "@/lib/integrations/maps";
import type { Locale } from "@/types/common";
import {
  MapPointBoldDuotone,
  PhoneBoldDuotone,
  LetterBoldDuotone,
  ClockCircleBoldDuotone,
  ArrowRightBold,
} from "solar-icon-set";
import { CrossDivider } from "@/_components/CrossDivider";
import { DiamondDivider } from "@/_components/DiamondDivider";
import { SplitButton } from "@/_components/SplitButton";
import { ContactForm } from "./_components/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const tCta = await getTranslations("contact.cta");
  const locale = (await getLocale()) as Locale;
  const locations = getLocations();
  const location = locations[0];

  const directionsHref = location
    ? getDirectionsUrl(location.coordinates.lat, location.coordinates.lng)
    : "#";

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative bg-night-bordeaux-2 pb-20 pt-40 md:pb-28 md:pt-48">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0JyBoZWlnaHQ9JzQnPjxyZWN0IHdpZHRoPScxJyBoZWlnaHQ9JzEnIGZpbGw9JyNmZmYnLz48L3N2Zz4=\")",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <CrossDivider variant="gold" className="justify-center" />

          <h1 className="mt-8 font-serif font-bold text-parchment md:mt-10">
            {t("title")}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-powder-petal/60">
            {t("heroDescription")}
          </p>

          <div className="mx-auto mt-8 flex items-center justify-center gap-2">
            <div className="h-0.5 w-12 bg-toffee-brown/40" />
            <div className="h-1 w-1 rotate-45 bg-toffee-brown/60" />
            <div className="h-0.5 w-12 bg-toffee-brown/40" />
          </div>
        </div>
      </section>

      {/* ── Form Section ── */}
      <section className="bg-parchment py-28 md:py-40">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <p className="font-bold uppercase tracking-[0.3em] text-toffee-brown">
              {t("subtitle")}
            </p>
            <h2 className="mt-3 font-serif font-bold text-carbon-black">
              {t("sendMessage")}
            </h2>
            <DiamondDivider variant="gold" className="mt-5 justify-center" />
          </div>

          <div className="mt-14">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── Location Section (dark, like GatheringSection) ── */}
      {location && (
        <section className="relative bg-carbon-black py-28 md:py-40">
          <div className="absolute inset-0 bg-gradient-to-b from-rich-mahogany/20 to-transparent pointer-events-none" />

          <div className="relative mx-auto max-w-6xl px-6 md:px-10">
            {/* Header */}
            <div className="text-center">
              <p className="font-bold uppercase tracking-[0.3em] text-toffee-brown/70">
                {t("ourLocations")}
              </p>
              <h2 className="mt-3 font-serif font-bold text-parchment">
                {location.name}
              </h2>
              <DiamondDivider variant="parchment" className="mt-5 justify-center" />
            </div>

            {/* Info columns — same pattern as GatheringSection */}
            <div className="mt-16 flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-center sm:gap-0 md:mt-20">
              {/* Address */}
              <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:pr-10">
                <MapPointBoldDuotone size={28} color="#fff" />
                <p className="mt-3 font-bold uppercase tracking-[0.2em] text-white">
                  {t("address")}
                </p>
                <address className="mt-2 not-italic text-base font-normal leading-relaxed text-parchment">
                  {location.address}
                  <br />
                  {location.postalCode} {location.city}
                </address>
              </div>

              {/* Divider */}
              <div className="hidden w-px self-stretch bg-parchment/10 sm:block" />

              {/* Schedule */}
              <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:px-10">
                <ClockCircleBoldDuotone size={28} color="#fff" />
                <p className="mt-3 font-bold uppercase tracking-[0.2em] text-white">
                  {t("officeHours")}
                </p>
                <p className="mt-2 text-base font-normal text-parchment">
                  {getLocalizedContent(location.worshipSchedule, locale)}
                </p>
              </div>

              {/* Divider */}
              <div className="hidden w-px self-stretch bg-parchment/10 sm:block" />

              {/* Phone */}
              {location.contactPhone && (
                <>
                  <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:px-10">
                    <PhoneBoldDuotone size={28} color="#fff" />
                    <p className="mt-3 font-bold uppercase tracking-[0.2em] text-white">
                      {t("phone")}
                    </p>
                    <a
                      href={`tel:${location.contactPhone}`}
                      className="mt-2 text-base font-normal text-parchment underline decoration-parchment/30 underline-offset-4 transition-colors hover:text-toffee-brown hover:decoration-toffee-brown"
                    >
                      {location.contactPhone}
                    </a>
                  </div>

                  <div className="hidden w-px self-stretch bg-parchment/10 sm:block" />
                </>
              )}

              {/* Email */}
              {location.contactEmail && (
                <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:pl-10">
                  <LetterBoldDuotone size={28} color="#fff" />
                  <p className="mt-3 font-bold uppercase tracking-[0.2em] text-white">
                    {t("email")}
                  </p>
                  <a
                    href={`mailto:${location.contactEmail}`}
                    className="mt-2 text-base font-normal text-parchment underline decoration-parchment/30 underline-offset-4 transition-colors hover:text-toffee-brown hover:decoration-toffee-brown"
                  >
                    {location.contactEmail}
                  </a>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="mx-auto mt-16 max-w-4xl overflow-hidden border border-parchment/10 md:mt-20">
              <div className="aspect-video">
                <iframe
                  src={`https://www.google.com/maps?q=${location.coordinates.lat},${location.coordinates.lng}&z=17&output=embed`}
                  title={location.name}
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Directions button */}
            <div className="mt-10 flex justify-center">
              <a
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex items-stretch shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                <span className="flex items-center bg-toffee-brown px-8 py-3.5 font-semibold uppercase tracking-wider text-white transition-colors duration-300 group-hover/btn:bg-olive-wood">
                  {t("directions")}
                </span>
                <span className="flex items-center justify-center bg-olive-wood px-4 transition-colors duration-300 group-hover/btn:bg-coffee-bean">
                  <ArrowRightBold size={16} color="#fff" className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                </span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="bg-night-bordeaux-2 py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <DiamondDivider variant="parchment" className="justify-center" />

          <h2 className="mt-8 font-serif font-bold text-parchment">
            {tCta("title")}
          </h2>

          <p className="mx-auto mt-4 max-w-lg leading-relaxed text-powder-petal/50">
            {tCta("subtitle")}
          </p>

          <div className="mt-10">
            <SplitButton href={`/${locale}/events`} variant="gold">
              {tCta("button")}
            </SplitButton>
          </div>
        </div>
      </section>
    </main>
  );
}
