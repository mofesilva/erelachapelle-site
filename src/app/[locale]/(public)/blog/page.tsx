import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import {
  filterArticles,
  getAllArticles,
  getArticleCategories,
} from "@/lib/data/blog";
import type { Locale } from "@/types/common";
import { ArticleCard } from "./_components/ArticleCard";
import { ArticleFilters } from "./_components/ArticleFilters";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog");
  return {
    title: t("title"),
  };
}

type PageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function BlogPage({ searchParams }: PageProps) {
  const t = await getTranslations("blog");
  const tCategories = await getTranslations("blog.categories");
  const locale = (await getLocale()) as Locale;
  const params = await searchParams;

  const hasFilters = !!params.category;
  const articles = hasFilters
    ? filterArticles({ category: params.category })
    : getAllArticles();

  const categories = getArticleCategories();

  return (
    <main>
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-serif text-4xl font-bold md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80">
            {t("articles")}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <Suspense fallback={null}>
              <ArticleFilters categories={categories} />
            </Suspense>
          </div>

          {articles.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {t("noArticles")}
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard
                  key={article._id}
                  article={article}
                  locale={locale}
                  categoryLabel={
                    article.categories[0]
                      ? tCategories(article.categories[0])
                      : ""
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
