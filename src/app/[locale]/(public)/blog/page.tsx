import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import { NotebookBoldDuotone } from "solar-icon-set";
import { SecondaryHeroSection } from "@/_components/SecondaryHeroSection";
import { SectionLabel } from "@/_components/SectionLabel";
import { getPeekProps } from "@/_components/PeekRectangle";
import {
  filterArticles,
  getArticleCategories,
  getPostsPage,
} from "@/lib/data/blog";
import { getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";
import { ArticleCard } from "./_components/ArticleCard";
import { ArticleFilters } from "./_components/ArticleFilters";
import { ArticlesList } from "./_components/ArticlesList";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog");
  return {
    title: t("title"),
    description: t("heroSubtitle"),
  };
}

type PageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function BlogPage({ searchParams }: PageProps) {
  const t = await getTranslations("blog");
  const locale = (await getLocale()) as Locale;
  const params = await searchParams;

  // Filtro por categoria varre a base inteira (a API não filtra por categoria no
  // servidor). Sem filtro, a listagem carrega 24 por vez, com "carregar mais".
  const hasFilters = !!params.category;
  const filteredArticles = hasFilters
    ? await filterArticles({ categoryId: params.category })
    : null;
  const { articles, totalPages } = hasFilters
    ? { articles: filteredArticles!, totalPages: 1 }
    : await getPostsPage(1);

  const categories = (await getArticleCategories()).map((category) => ({
    value: category.id,
    label: getLocalizedContent(category.name, locale),
  }));

  return (
    <main>
      <SecondaryHeroSection title={t("title")} description={t("heroSubtitle")} />

      <section className="bg-powder-petal py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionLabel
            icon={NotebookBoldDuotone}
            title={t("allArticles")}
            color="bordeaux"
          />

          {categories.length > 0 && (
            <div className="mt-10">
              <Suspense fallback={null}>
                <ArticleFilters categories={categories} />
              </Suspense>
            </div>
          )}

          {articles.length === 0 ? (
            <p className="mt-12 text-center font-serif italic text-coffee-bean/50">
              {t("noArticles")}
            </p>
          ) : hasFilters ? (
            <div className="mt-12 grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => {
                const peek = getPeekProps(index);
                return (
                  <ArticleCard
                    key={article._id}
                    article={article}
                    locale={locale}
                    readMoreLabel={t("readMore")}
                    peekColor={peek.color}
                    peekPosition={peek.position}
                  />
                );
              })}
            </div>
          ) : (
            <ArticlesList
              initialArticles={articles}
              initialTotalPages={totalPages}
              locale={locale}
              readMoreLabel={t("readMore")}
              loadMoreLabel={t("loadMore")}
            />
          )}
        </div>
      </section>
    </main>
  );
}
