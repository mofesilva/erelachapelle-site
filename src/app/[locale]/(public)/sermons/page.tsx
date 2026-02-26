import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import {
  filterSermons,
  getAllSermons,
  getSermonPreachers,
  getSermonSeries,
} from "@/lib/data/sermons";
import type { Locale } from "@/types/common";
import { SermonCard } from "./_components/SermonCard";
import { SermonFilters } from "./_components/SermonFilters";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("sermons");
  return {
    title: t("title"),
    description: t("archive"),
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
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-serif text-4xl font-bold md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80">
            {t("archive")}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <Suspense fallback={null}>
              <SermonFilters preachers={preachers} seriesList={seriesList} />
            </Suspense>
          </div>

          {sermons.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {t("noSermons")}
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sermons.map((sermon) => (
                <SermonCard key={sermon._id} sermon={sermon} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
