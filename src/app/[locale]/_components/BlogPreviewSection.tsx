import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { SplitButton } from "@/_components/SplitButton";
import { SectionLabel } from "@/_components/SectionLabel";
import { getRecentArticles } from "@/lib/data/blog";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";
import { ArrowRightUpBold, NotebookBoldDuotone } from "solar-icon-set";

export async function BlogPreviewSection() {
  const t = await getTranslations("homepage.blog");
  const locale = (await getLocale()) as Locale;
  const articles = getRecentArticles();

  if (articles.length === 0) return null;

  return (
    <section className="bg-parchment pt-8 pb-24 md:py-32">
      {/* Section separator */}
      <div className="mx-auto mb-20 md:mb-24 flex items-center justify-center gap-4 max-w-xs">
        <span className="h-px flex-1 bg-toffee-brown/15" />
        <span className="text-toffee-brown/25 text-[10px]">✦</span>
        <span className="h-px flex-1 bg-toffee-brown/15" />
      </div>

      <div className="mx-auto max-w-5xl px-6">
        {/* Centered header */}
        <SectionLabel icon={NotebookBoldDuotone} title={t("title")} />

        {/* Articles */}
        <div className="mt-12 md:mt-14 space-y-8 md:space-y-0 md:grid md:gap-8 md:grid-cols-3">
          {articles.map((article) => (
            <article key={article._id} className="group">
              <Link
                href={`/${locale}/blog/${article.slug}`}
                className="block overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(61,0,8,0.08)] hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-16/10 overflow-hidden">
                  {article.featuredImage ? (
                    <Image
                      src={article.featuredImage}
                      alt={getLocalizedContent(article.title, locale)}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      unoptimized
                    />
                  ) : (
                    <div className="h-full w-full bg-linear-to-br from-night-bordeaux-2 via-rich-mahogany to-night-bordeaux-2">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif text-4xl text-white/10">✦</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-coffee-bean/50">
                    <time>{formatDate(article.publishedAt, locale)}</time>
                    <span>·</span>
                    <span>{article.author}</span>
                  </div>

                  <h3 className="mt-3 font-serif text-lg font-bold text-rich-mahogany line-clamp-2 leading-snug group-hover:text-night-bordeaux-2 transition-colors duration-300">
                    {getLocalizedContent(article.title, locale)}
                  </h3>

                  <p className="mt-2 text-sm text-coffee-bean/60 line-clamp-2 leading-relaxed">
                    {getLocalizedContent(article.excerpt, locale)}
                  </p>

                  {/* Read more */}
                  <div className="mt-4 flex items-center gap-1.5 text-toffee-brown opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider">{t("readMore")}</span>
                    <ArrowRightUpBold size={12} />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <SplitButton href={`/${locale}/blog`} variant="burgundy">
            {t("cta")}
          </SplitButton>
        </div>
      </div>
    </section>
  );
}
