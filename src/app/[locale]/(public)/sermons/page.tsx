import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import { BookBoldDuotone } from "solar-icon-set";
import {
  filterSermons,
  getSermonSeries,
  getSermonsPage,
} from "@/lib/data/sermons";
import type { Locale } from "@/types/common";
import { FeaturedSermon } from "./_components/FeaturedSermon";
import { SermonCard } from "./_components/SermonCard";
import { SermonFilters } from "./_components/SermonFilters";
import { SermonsList } from "./_components/SermonsList";
import { SermonsCtaSection } from "./_components/SermonsCtaSection";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("sermons");
  return {
    title: t("title"),
    description: t("heroSubtitle"),
  };
}

type PageProps = {
  searchParams: Promise<{ series?: string; q?: string }>;
};

export default async function SermonsPage({ searchParams }: PageProps) {
  const t = await getTranslations("sermons");
  const locale = (await getLocale()) as Locale;
  const params = await searchParams;

  const hasFilters = !!params.series || !!params.q;
  const filteredSermons = hasFilters
    ? await filterSermons({ series: params.series, q: params.q }, locale)
    : null;
  const { sermons, totalPages } = hasFilters
    ? { sermons: filteredSermons!, totalPages: 1 }
    : await getSermonsPage(1);

  const seriesList = await getSermonSeries();

  return (
    <main className="flex flex-1 flex-col">
      {/* Bloco bordeaux do topo: leva o sermão em destaque dentro, no lugar do antigo
          título "Prédications" — o hero era um retângulo quase vazio. */}
      <section className="relative min-h-[50svh] bg-night-bordeaux-2 pb-16 pt-32 md:pb-20 md:pt-40">
        <Image
          src="/images/inside-church.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 bg-night-bordeaux-2/80" />
        <div className="relative">
          <FeaturedSermon />
        </div>
      </section>

      {/* Sermon grid with filters */}
      <section className="bg-parchment py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          {/* Cabeçalho da seção no mesmo formato do rótulo do destaque — o <h2> do
              SectionLabel sai a 55px e gritava mais que o título da prédication. */}
          <div className="flex items-center gap-3">
            <BookBoldDuotone size={18} color="var(--night-bordeaux-2)" />
            <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[0.25em] text-night-bordeaux-2">
              {t("allSermons")}
            </p>
            <span className="h-px flex-1 bg-night-bordeaux-2/15" />
          </div>

          <div className="mt-8">
            <Suspense fallback={null}>
              <SermonFilters seriesList={seriesList} />
            </Suspense>
          </div>

          {sermons.length === 0 ? (
            <p className="mt-12 text-center font-serif italic text-coffee-bean/50">
              {t("noSermons")}
            </p>
          ) : hasFilters ? (
            <div className="mt-10 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sermons.map((sermon) => (
                <SermonCard key={sermon._id} sermon={sermon} locale={locale} />
              ))}
            </div>
          ) : (
            <SermonsList
              initialSermons={sermons}
              initialTotalPages={totalPages}
              locale={locale}
              loadMoreLabel={t("loadMore")}
            />
          )}
        </div>
      </section>

      <SermonsCtaSection />
    </main>
  );
}
