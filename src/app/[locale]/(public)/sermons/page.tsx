import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import { BookBoldDuotone } from "solar-icon-set";
import { SectionLabel } from "@/_components/SectionLabel";
import {
  filterSermons,
  getAllSermons,
  getSermonPreachers,
  getSermonSeries,
} from "@/lib/data/sermons";
import type { Locale } from "@/types/common";
import { SecondaryHeroSection } from "@/_components/SecondaryHeroSection";
import { FeaturedSermon } from "./_components/FeaturedSermon";
import { SermonCard } from "./_components/SermonCard";
import { SermonFilters } from "./_components/SermonFilters";
import { SermonsCtaSection } from "./_components/SermonsCtaSection";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("sermons");
  return {
    title: t("title"),
    description: t("heroSubtitle"),
  };
}

type PageProps = {
  searchParams: Promise<{ preacher?: string; series?: string }>;
};

export default async function SermonsPage({ searchParams }: PageProps) {
  const t = await getTranslations("sermons");
  const locale = (await getLocale()) as Locale;
  const params = await searchParams;

  const hasFilters = params.preacher || params.series;
  const sermons = hasFilters
    ? filterSermons({ preacher: params.preacher, series: params.series })
    : getAllSermons();

  const preachers = getSermonPreachers();
  const seriesList = getSermonSeries();

  return (
    <main>
      <SecondaryHeroSection
        title={t("title")}
        description={t("heroSubtitle")}
      />

      {/* Featured sermon — only when no filters active */}
      {!hasFilters && <FeaturedSermon />}

      {/* Sermon grid with filters */}
      <section className="bg-powder-petal py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionLabel
            icon={BookBoldDuotone}
            title={t("allSermons")}
            color="bordeaux"
          />

          <div className="mt-10">
            <Suspense fallback={null}>
              <SermonFilters preachers={preachers} seriesList={seriesList} />
            </Suspense>
          </div>

          {sermons.length === 0 ? (
            <p className="mt-12 text-center font-serif italic text-coffee-bean/50">
              {t("noSermons")}
            </p>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sermons.map((sermon) => (
                <SermonCard key={sermon._id} sermon={sermon} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </section>

      <SermonsCtaSection />
    </main>
  );
}
