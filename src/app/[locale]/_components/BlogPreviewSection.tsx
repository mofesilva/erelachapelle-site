import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { SplitButton } from "@/components/shared/SplitButton";
import { getRecentArticles } from "@/lib/data/blog";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";
import { ArrowUpRight } from "lucide-react";

export async function BlogPreviewSection() {
  const t = await getTranslations("homepage.blog");
  const locale = (await getLocale()) as Locale;
  const articles = getRecentArticles();

  return (
    <section className="relative bg-[#EEEEEE] py-20 md:py-32">
      {/* Top decorative border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#643036] to-transparent" />

      <div className="mx-auto max-w-7xl px-4">
        <SectionLabel label={t("label")} />
        <h2 className="mt-6 text-center font-serif text-3xl font-bold text-[#3D000A] md:text-5xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-[#171717]/30">
          ◆────◆
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {articles.map((article) => (
            <article key={article._id} className="group">
              <Link
                href={`/${locale}/blog/${article.slug}`}
                className="block overflow-hidden rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_16px_50px_rgba(106,13,30,0.12)] hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  {article.featuredImage ? (
                    <Image
                      src={article.featuredImage}
                      alt={getLocalizedContent(article.title, locale)}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      unoptimized
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#643036] via-[#3D000A] to-[#643036]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif text-4xl text-white/10">✦</span>
                      </div>
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#171717]/40">
                    <time>{formatDate(article.publishedAt, locale)}</time>
                    <span>·</span>
                    <span>{article.author}</span>
                  </div>

                  <h3 className="mt-3 font-serif text-xl font-bold text-[#3D000A] line-clamp-2 group-hover:text-[#643036] transition-colors duration-300">
                    {getLocalizedContent(article.title, locale)}
                  </h3>

                  <p className="mt-3 text-sm text-[#171717]/50 line-clamp-3 leading-relaxed">
                    {getLocalizedContent(article.excerpt, locale)}
                  </p>

                  {/* Read more indicator */}
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#8C5E35] opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <span className="uppercase tracking-wider text-xs">Lire</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
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
