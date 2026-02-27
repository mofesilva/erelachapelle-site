import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Badge } from "@/_components/ui/badge";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import type { BlogArticle } from "@/types/blog";
import type { Locale } from "@/types/common";

interface ArticleCardProps {
  article: BlogArticle;
  locale: Locale;
  categoryLabel: string;
}

export function ArticleCard({ article, locale, categoryLabel }: ArticleCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      {article.featuredImage && (
        <div className="aspect-video bg-muted">
          <Image
            src={article.featuredImage}
            alt={getLocalizedContent(article.title, locale)}
            width={400}
            height={225}
            className="h-full w-full object-cover"
            loading="lazy"
            unoptimized
          />
        </div>
      )}
      <CardHeader>
        <span className="text-xs text-muted-foreground">
          {formatDate(article.publishedAt, locale)} · {article.author}
        </span>
        <CardTitle className="font-serif text-lg">
          <Link
            href={`/${locale}/blog/${article.slug}`}
            className="hover:text-primary"
          >
            {getLocalizedContent(article.title, locale)}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-muted-foreground">
          {getLocalizedContent(article.excerpt, locale)}
        </p>
        {article.categories.length > 0 && (
          <Badge variant="secondary" className="mt-3">
            {categoryLabel}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
