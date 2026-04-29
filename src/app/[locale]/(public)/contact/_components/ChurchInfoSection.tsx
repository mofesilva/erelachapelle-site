import { getTranslations, getLocale } from "next-intl/server";
import { MapPointBold, ClockCircleBold, LetterBold } from "solar-icon-set";
import { SectionLabel } from "@/_components/SectionLabel";
import { GoogleMapEmbed } from "@/_components/GoogleMapEmbed";
import { SplitButton } from "@/_components/SplitButton";
import { getLocalizedContent } from "@/lib/utils";
import { getLocations } from "@/lib/data/locations";
import { getDirectionsUrl } from "@/lib/integrations/maps";
import type { Locale } from "@/types/common";

const columnLabelClass =
  "text-[10px] uppercase tracking-widest font-semibold text-white/50 mb-1";

const columnValueClass = "text-white font-serif text-base leading-snug";

export async function ChurchInfoSection() {
  const t = await getTranslations("contact");
  const tDirections = await getTranslations("common");
  const locale = (await getLocale()) as Locale;
  const locations = getLocations();
  const location = locations[0];

  if (!location) return null;

  const directionsHref = getDirectionsUrl(location.coordinates.lat, location.coordinates.lng);

  return (
    <section className="bg-carbon-black py-20">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <SectionLabel
            icon={MapPointBold}
            title={t("findUs")}
            color="parchment"
            align="center"
          />
        </div>

        {/* 3-column info grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-0 mb-16">
          {/* Address */}
          <div className="flex flex-col items-center gap-3 text-center md:border-r md:border-white/10 md:px-8">
            <MapPointBold size={40} color="var(--toffee-brown)" />
            <p className={columnLabelClass}>{t("address")}</p>
            <p className={columnValueClass}>
              {location.address}
              <br />
              {location.postalCode} {location.city}
            </p>
          </div>

          {/* Sunday Service */}
          <div className="flex flex-col items-center gap-3 text-center md:border-r md:border-white/10 md:px-8">
            <ClockCircleBold size={40} color="var(--toffee-brown)" />
            <p className={columnLabelClass}>{t("sundayService")}</p>
            <p className={columnValueClass}>
              {getLocalizedContent(location.worshipSchedule, locale)}
            </p>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center gap-3 text-center md:px-8">
            <LetterBold size={40} color="var(--toffee-brown)" />
            <p className={columnLabelClass}>{t("email")}</p>
            {location.contactEmail && (
              <a
                href={`mailto:${location.contactEmail}`}
                className={`${columnValueClass} hover:text-toffee-brown transition-colors underline underline-offset-4`}
              >
                {location.contactEmail}
              </a>
            )}
          </div>
        </div>

        {/* Map */}
        <GoogleMapEmbed
          address={`${location.address}, ${location.postalCode} ${location.city}`}
          coordinates={location.coordinates}
          showDirections={false}
        />
        <div className="mt-6 flex justify-center">
          <SplitButton href={directionsHref} variant="gold" external>
            {tDirections("getDirections")}
          </SplitButton>
        </div>
      </div>
    </section>
  );
}
