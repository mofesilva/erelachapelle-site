import Link from "next/link";
import { ArrowRightUpBold } from "solar-icon-set";
import { PeekRectangle, type PeekColor, type PeekPosition } from "@/_components/PeekRectangle";
import { SkeletonImage } from "@/_components/SkeletonImage";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import type { Post } from "@/types/blog";
import type { Locale } from "@/types/common";

interface ArticleCardProps {
  article: Post;
  locale: Locale;
  readMoreLabel: string;
  peekColor: PeekColor;
  peekPosition: PeekPosition;
}

export function ArticleCard({
  article,
  locale,
  readMoreLabel,
  peekColor,
  peekPosition,
}: ArticleCardProps) {
  const title = getLocalizedContent(article.title, locale);

  return (
    <article className="group h-full">
      <PeekRectangle color={peekColor} position={peekPosition} className="h-full">
        <Link
          href={`/${locale}/blog/${article._id}`}
          className="flex h-full flex-col overflow-hidden bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(61,0,8,0.08)] hover:-translate-y-1"
        >
          {/* Image */}
          <div className="relative aspect-16/10 overflow-hidden">
            {article.featuredImage ? (
              <SkeletonImage
                src={article.featuredImage.url}
                alt={
                  article.featuredImage.altText
                    ? getLocalizedContent(article.featuredImage.altText, locale)
                    : title
                }
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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

            {/* Categoria sobre a imagem — mesmo tratamento da série no card de prédication */}
            <p className="absolute left-4 top-4 bg-toffee-brown px-3 py-1 font-bold uppercase tracking-widest text-white shadow-lg">
              {getLocalizedContent(article.category.name, locale)}
            </p>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col p-6">
            <p className="flex items-center gap-2 uppercase tracking-wider text-coffee-bean/50">
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt, locale)}
              </time>
              <span>·</span>
              <span>{article.author}</span>
            </p>

            <h6 className="mt-3 line-clamp-2 font-serif font-bold leading-snug text-rich-mahogany transition-colors duration-300 group-hover:text-night-bordeaux-2">
              {title}
            </h6>

            <p className="mt-2 line-clamp-2 leading-relaxed text-coffee-bean/60">
              {getLocalizedContent(article.excerpt, locale)}
            </p>

            <div className="mt-4 flex items-center gap-1.5 text-toffee-brown opacity-0 transition-all duration-300 group-hover:opacity-100">
              <p className="font-bold uppercase tracking-wider">{readMoreLabel}</p>
              <ArrowRightUpBold size={12} />
            </div>
          </div>
        </Link>
      </PeekRectangle>
    </article>
  );
}
