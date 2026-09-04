import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { SkeletonImage } from "@/_components/SkeletonImage";
import { SplitButton } from "@/_components/SplitButton";
import { getRecentArticles } from "@/lib/data/blog";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import { resolveMediaAssetUrl } from "@/types/media-asset";
import type { Locale } from "@/types/common";

/**
 * Vive dentro do bloco bordeaux do topo da página, no lugar do antigo hero genérico
 * (`SecondaryHeroSection`) — mesma estrutura do `FeaturedSermon` em /sermons e do
 * `FeaturedPodcast` em /podcast: 2 colunas, texto claro sobre fundo escuro.
 */
export async function FeaturedArticle() {
  const t = await getTranslations("blog");
  const locale = (await getLocale()) as Locale;
  const [article] = await getRecentArticles(1);

  if (!article) return null;

  const title = getLocalizedContent(article.title, locale);

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
        {/* Thumbnail — mesmo comportamento de clique do ArticleCard: a imagem inteira
            leva pro artigo. */}
        <Link
          href={`/${locale}/blog/${article._id}`}
          className="group relative block aspect-video overflow-hidden bg-dust-grey shadow-2xl"
        >
          {article.featuredImage && (
            <SkeletonImage
              src={resolveMediaAssetUrl(article.featuredImage.url)}
              alt={
                article.featuredImage.altText
                  ? getLocalizedContent(article.featuredImage.altText, locale)
                  : title
              }
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
          )}
        </Link>

        {/* Info */}
        <div>
          <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[0.2em] text-parchment/50">
            {formatDate(article.publishedAt, locale)}
            {" · "}
            {article.author}
          </p>

          <h1 className="mt-3 font-serif text-[1.75rem] font-bold leading-[1.15] text-parchment md:text-[2.5rem]">
            {title}
          </h1>

          <p className="mt-4 text-[0.9375rem] leading-[1.7] text-parchment/70">
            {getLocalizedContent(article.excerpt, locale)}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <p className="border border-parchment/60 bg-parchment/10 px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-parchment">
              {t(`postTypes.${article.postType}`)}
            </p>
            <p className="border border-parchment/25 px-2.5 py-1 text-[0.6875rem] uppercase tracking-[0.1em] text-parchment/70">
              {getLocalizedContent(article.category.name, locale)}
            </p>
          </div>

          <div className="mt-8">
            <SplitButton href={`/${locale}/blog/${article._id}`} variant="gold">
              {t("readMore")}
            </SplitButton>
          </div>
        </div>
      </div>
    </div>
  );
}
