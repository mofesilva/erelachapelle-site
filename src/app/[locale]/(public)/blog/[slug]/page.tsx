import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticles } from "@/lib/blog";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";

type PageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title.fr,
    description: article.excerpt.fr,
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const t = await getTranslations("blog");
  const tCommon = await getTranslations("common");
  const locale = (await getLocale()) as Locale;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  return (
    <main>
      <section className="bg-primary py-12 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4">
          <Link
            href={`/${locale}/blog`}
            className="text-sm text-primary-foreground/70 hover:text-primary-foreground"
          >
            ← {tCommon("back")}
          </Link>
          <h1 className="mt-4 font-serif font-bold">
            {getLocalizedContent(article.title, locale)}
          </h1>
          <p className="mt-4 text-primary-foreground/80">
            <span>{t("publishedOn")} {formatDate(article.publishedAt, locale)}</span>
            <span> · {t("by")} {article.author}</span>
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          <div className="prose prose-lg max-w-none">
            <p className="leading-relaxed text-muted-foreground">
              {getLocalizedContent(article.content, locale)}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
