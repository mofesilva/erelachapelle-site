import Link from "next/link";
import { useTranslations } from "next-intl";
import { DocumentTextBold, LetterBoldDuotone, FileTextBold } from "solar-icon-set";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Post, PostType } from "@/types/blog";
import type { Locale } from "@/types/common";
import { ArticleCard } from "./ArticleCard";

// Identidade visual própria por tipo — é o que faz as 3 zonas conviverem na mesma tela
// sem se confundir, mesmo sem aba/filtro pra separar. Exportado pra a listagem completa
// de um tipo só (`page.tsx` com `?type=`) reaproveitar o mesmo cabeçalho.
export const ZONE_ICON: Record<PostType, typeof DocumentTextBold> = {
  artigo: DocumentTextBold,
  newsletter: LetterBoldDuotone,
  boletim: FileTextBold,
};

export const ZONE_COLOR: Record<PostType, string> = {
  artigo: "var(--toffee-brown)",
  newsletter: "var(--night-bordeaux-2)",
  boletim: "var(--olive-wood)",
};

interface PostTypeSectionProps {
  postType: PostType;
  articles: Post[];
  locale: Locale;
  readMoreLabel: string;
}

/** Uma zona do hub — carrossel arrastável/navegável, não uma lista estática. Todas as
 * zonas ficam visíveis ao mesmo tempo na página (sem aba/filtro pra trocar entre elas).
 * `articles` já vem limitado (ver `page.tsx`); "ver tudo" leva pra listagem completa
 * do mesmo tipo, ainda dentro de `/blog` (query `?type=`), não uma rota separada. */
export function PostTypeSection({ postType, articles, locale, readMoreLabel }: PostTypeSectionProps) {
  const t = useTranslations("blog");
  const Icon = ZONE_ICON[postType];

  if (articles.length === 0) return null;

  return (
    <div className="mt-16 first:mt-0">
      <div className="flex items-center gap-3">
        <Icon size={18} color={ZONE_COLOR[postType]} />
        <p
          className="text-[0.6875rem] font-bold uppercase leading-none tracking-[0.25em]"
          style={{ color: ZONE_COLOR[postType] }}
        >
          {t(`postTypes.${postType}`)}
        </p>
        <span className="h-px flex-1 bg-night-bordeaux-2/15" />
        <Link
          href={`/${locale}/blog?type=${postType}`}
          className="shrink-0 text-[0.8125rem] font-bold uppercase tracking-[0.1em] text-toffee-brown hover:text-night-bordeaux-2"
        >
          {t("seeAllInType")}
        </Link>
      </div>

      <Carousel opts={{ align: "start", dragFree: true }} className="mt-8">
        <CarouselContent>
          {articles.map((article) => (
            <CarouselItem key={article._id} className="basis-[85%] sm:basis-1/2 lg:basis-1/3">
              <ArticleCard article={article} locale={locale} readMoreLabel={readMoreLabel} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
}

