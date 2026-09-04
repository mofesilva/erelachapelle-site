import Link from "next/link";
import { ArrowRightUpBold } from "solar-icon-set";
import { useTranslations } from "next-intl";
import { SkeletonImage } from "@/_components/SkeletonImage";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import { resolveMediaAssetUrl } from "@/types/media-asset";
import type { Post } from "@/types/blog";
import type { Locale } from "@/types/common";

interface ArticleCardProps {
  article: Post;
  locale: Locale;
  readMoreLabel: string;
}

export function ArticleCard({ article, locale, readMoreLabel }: ArticleCardProps) {
  const t = useTranslations("blog");
  const title = getLocalizedContent(article.title, locale);

  return (
    <article className="group">
      <Link
        href={`/${locale}/blog/${article._id}`}
        className="block overflow-hidden border border-dust-grey bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
      >
        {/* Thumbnail — mesmo tratamento do card de prédication */}
        <div className="relative aspect-video overflow-hidden bg-dust-grey">
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
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              unoptimized
            />
          )}
        </div>

        {/* Content — mesma escala tipográfica fixada do card de prédication (`SermonCard`):
            o padrão de `globals.css` deixa `p` a 18px e `h6` a 22px, gritando demais dentro do card. */}
        <div className="p-5 md:p-6">
          <p className="flex items-center gap-2 text-[0.6875rem] font-bold uppercase leading-none tracking-[0.18em] text-toffee-brown">
            <time dateTime={article.publishedAt}>
              {formatDate(article.publishedAt, locale)}
            </time>
          </p>

          <h6 className="mt-2.5 line-clamp-2 font-serif text-[1.25rem] font-bold leading-[1.3] text-night-bordeaux-2 transition-colors duration-200 group-hover:text-toffee-brown">
            {title}
          </h6>

          <p className="mt-3 line-clamp-2 text-[0.875rem] leading-[1.65] text-coffee-bean/75">
            {getLocalizedContent(article.excerpt, locale)}
          </p>

          {/* Badge — mesmo tratamento da série/referência bíblica no card de prédication */}
          <div className="mt-4 flex flex-wrap gap-2">
            <p className="border border-toffee-brown/60 bg-toffee-brown/10 px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-toffee-brown">
              {t(`postTypes.${article.postType}`)}
            </p>
            <p className="border border-toffee-brown/30 px-2.5 py-1 text-[0.6875rem] uppercase tracking-[0.1em] text-coffee-bean/70">
              {getLocalizedContent(article.category.name, locale)}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-toffee-brown opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span>{readMoreLabel}</span>
            <ArrowRightUpBold size={12} />
          </div>
        </div>
      </Link>
    </article>
  );
}
