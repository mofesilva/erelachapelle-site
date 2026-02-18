import { getTranslations, getLocale } from "next-intl/server";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { LocationCard } from "./LocationCard";
import { getLocations } from "@/lib/data/locations";
import { GoogleMapEmbed } from "@/components/shared/GoogleMapEmbed";
import { getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";
import { Church } from "lucide-react";

export async function GatheringSection() {
  const t = await getTranslations("homepage.gathering");
  const locale = (await getLocale()) as Locale;
  const locations = getLocations();
  const location = locations[0];

  if (!location) return null;

  return (
    <section className="relative bg-[#EEEEEE] py-20 md:py-32">
      {/* Top decorative border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#643036] to-transparent" />

      <div className="mx-auto max-w-7xl px-4">
        <SectionLabel label={t("label")} />
        <h2 className="mt-6 text-center font-serif text-3xl font-bold text-[#3D000A] md:text-5xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-[#171717]/60">
          ◆────◆
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-2 md:gap-10 max-w-4xl mx-auto">
          {/* Location Card */}
          <LocationCard
            icon={Church}
            name={location.name}
            address={`${location.address}, ${location.postalCode} ${location.city}`}
            schedule={getLocalizedContent(location.worshipSchedule, locale)}
          />

          {/* Google Map */}
          <div className="overflow-hidden rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
            <GoogleMapEmbed
              address={`${location.address}, ${location.postalCode} ${location.city}`}
              coordinates={location.coordinates}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
